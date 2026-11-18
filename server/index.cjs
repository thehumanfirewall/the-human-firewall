'use strict';
const http=require('node:http');
const crypto=require('node:crypto');
const path=require('node:path');
const fs=require('node:fs');
const {DatabaseSync}=require('node:sqlite');
const PORT=3107;
const root=path.resolve(__dirname,'..');
const dataDir=path.join(root,'data');fs.mkdirSync(dataDir,{recursive:true});
const db=new DatabaseSync(path.join(dataDir,'human_firewall.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,username TEXT UNIQUE NOT NULL,display_name TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('player','admin')),salt TEXT NOT NULL,password_hash TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),scenario TEXT NOT NULL,level TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'in_progress',score INTEGER,started_at TEXT DEFAULT CURRENT_TIMESTAMP,finished_at TEXT,events_json TEXT DEFAULT '[]');
CREATE INDEX IF NOT EXISTS idx_attempt_user ON attempts(user_id,id DESC);
`);
const hashPwd=(pw,salt)=>crypto.scryptSync(pw,salt,64).toString('hex');
function seed(name,label,role,pw){if(db.prepare('SELECT id FROM users WHERE username=?').get(name))return;let salt=crypto.randomBytes(16).toString('hex');db.prepare('INSERT INTO users(username,display_name,role,salt,password_hash) VALUES(?,?,?,?,?)').run(name,label,role,salt,hashPwd(pw,salt));}
seed('player.demo','Alex Morgan','player','Player@2026!');seed('admin.demo','Security Administrator','admin','Admin@2026!');
const allowed=new Set(['http://localhost:5173','http://localhost:5174','http://localhost:5175','http://localhost:5180','http://127.0.0.1:5180','http://127.0.0.1:5173','http://127.0.0.1:5174','http://127.0.0.1:5175']);
function respond(res,code,body,headers={}){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(body));}
function cookieValue(req,key){return (req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(key+'='))?.slice(key.length+1)||null}
function auth(req){let token=cookieValue(req,'hf_session');if(!token)return null;let hash=crypto.createHash('sha256').update(token).digest('hex');return db.prepare('SELECT u.id,u.username,u.display_name,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').get(hash,Date.now())||null}
function body(req){return new Promise((resolve,reject)=>{let bytes=0,chunks=[];req.on('data',c=>{bytes+=c.length;if(bytes>20000){reject(new Error('Payload too large'));req.destroy();return}chunks.push(c)});req.on('end',()=>{try{resolve(JSON.parse(Buffer.concat(chunks).toString()||'{}'))}catch(e){reject(new Error('Invalid JSON'))}});req.on('error',reject)})}
function publicUser(u){return {id:u.id,username:u.username,displayName:u.display_name,role:u.role}}
function overview(id){let stats=db.prepare(`SELECT COUNT(*) attempts,SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) completed,MAX(score) best_score,ROUND(AVG(CASE WHEN status='completed' THEN score END)) average_score FROM attempts WHERE user_id=?`).get(id);let attempts=db.prepare('SELECT id,scenario,level,status,score,started_at,finished_at,events_json FROM attempts WHERE user_id=? ORDER BY id DESC LIMIT 100').all(id).map(a=>({...a,events:JSON.parse(a.events_json||'[]'),events_json:undefined}));return {stats:{attempts:stats.attempts||0,completed:stats.completed||0,bestScore:stats.best_score??0,averageScore:stats.average_score??0},attempts}}
const server=http.createServer(async(req,res)=>{
 const origin=req.headers.origin;
 if(origin&&allowed.has(origin)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Access-Control-Allow-Credentials','true');res.setHeader('Vary','Origin')}
 if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'});return res.end()}
 try{
 const url=new URL(req.url,'http://localhost');const p=url.pathname;
 if(p==='/api/health'&&req.method==='GET')return respond(res,200,{ok:true,service:'Human Firewall API'});
 if(p==='/api/login'&&req.method==='POST'){
 const b=await body(req);const u=db.prepare('SELECT * FROM users WHERE username=?').get(String(b.username||'').trim());
 const candidate=hashPwd(String(b.password||''),u?.salt||'0'.repeat(32));const valid=!!u&&crypto.timingSafeEqual(Buffer.from(candidate,'hex'),Buffer.from(u.password_hash,'hex'));
 if(!valid)return respond(res,401,{error:'Incorrect username or password'});
 const token=crypto.randomBytes(32).toString('hex'),tokenHash=crypto.createHash('sha256').update(token).digest('hex');
 db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(tokenHash,u.id,Date.now()+7*86400000);
 return respond(res,200,{user:publicUser(u)},{'Set-Cookie':`hf_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`});
 }
 if(p==='/api/logout'&&req.method==='POST'){const token=cookieValue(req,'hf_session');if(token){db.prepare('DELETE FROM sessions WHERE token_hash=?').run(crypto.createHash('sha256').update(token).digest('hex'))}return respond(res,200,{ok:true},{'Set-Cookie':'hf_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'})}
 const u=auth(req);if(!u)return respond(res,401,{error:'Please sign in first'});
 if(p==='/api/me'&&req.method==='GET')return respond(res,200,{user:publicUser(u),...overview(u.id)});
 if(p==='/api/attempts/start'&&req.method==='POST'){
 if(u.role!=='player')return respond(res,403,{error:'Only players can play'});
 const b=await body(req);const scenario=String(b.scenario||'01'),level=String(b.level||'01');
 if(!/^0[1-5]$/.test(scenario)||!/^0[1-3]$/.test(level))return respond(res,400,{error:'Invalid level'});
 const a=db.prepare("INSERT INTO attempts(user_id,scenario,level,status) VALUES(?,?,?,'in_progress')").run(u.id,scenario,level);
 return respond(res,201,{attemptId:Number(a.lastInsertRowid)});
 }
 if(p==='/api/attempts/event'&&req.method==='POST'){
 const b=await body(req),id=Number(b.attemptId),event=String(b.event||'').slice(0,80);
 const row=db.prepare('SELECT * FROM attempts WHERE id=? AND user_id=?').get(id,u.id);if(!row||row.status!=='in_progress')return respond(res,404,{error:'Active attempt not found'});
 let events=JSON.parse(row.events_json||'[]');if(events.length<100){events.push({event,at:new Date().toISOString()});db.prepare('UPDATE attempts SET events_json=? WHERE id=?').run(JSON.stringify(events),id)}return respond(res,200,{ok:true})
 }
 if(p==='/api/attempts/finish'&&req.method==='POST'){
 const b=await body(req),id=Number(b.attemptId),outcome=String(b.outcome||'');
 const row=db.prepare('SELECT * FROM attempts WHERE id=? AND user_id=?').get(id,u.id);if(!row||row.status!=='in_progress')return respond(res,404,{error:'Active attempt not found'});
 if(row.scenario!=='01')return respond(res,400,{error:'Invalid scenario'});
 const allowedOutcomes={'01':['success','failure','abandoned'],'02':['perfect','safe','partial','breach','abandoned'],'03':['perfect','partial','breach','abandoned']};if(!(allowedOutcomes[row.level]||[]).includes(outcome))return respond(res,400,{error:'Invalid outcome for level'});
 const scoreTables={'01':{success:100,failure:0},'02':{perfect:100,safe:80,partial:45,breach:0},'03':{perfect:100,partial:70,breach:0}};const score=outcome==='abandoned'?null:scoreTables[row.level]?.[outcome];if(outcome!=='abandoned'&&score===undefined)return respond(res,400,{error:'Unrecognized score'});
 db.prepare('UPDATE attempts SET status=?,score=?,finished_at=CURRENT_TIMESTAMP WHERE id=?').run(outcome==='abandoned'?'abandoned':'completed',score,id);
 return respond(res,200,{ok:true,score});
 }
 if(p==='/api/admin/overview'&&req.method==='GET'){
 if(u.role!=='admin')return respond(res,403,{error:'Admin access required'});
 let users=db.prepare("SELECT id,username,display_name,role,created_at FROM users WHERE role='player' ORDER BY id").all();
 let rows=users.map(x=>({...x,...overview(x.id)}));
 let aggregate={players:users.length,attempts:rows.reduce((a,x)=>a+x.stats.attempts,0),completed:rows.reduce((a,x)=>a+x.stats.completed,0)};
 return respond(res,200,{aggregate,players:rows});
 }
 if(p==='/api/register')return respond(res,403,{error:'Registration is disabled in this demo'});
 return respond(res,404,{error:'Endpoint not found'});
 }catch(e){console.error(e);return respond(res,500,{error:'Server error'})}
});
server.listen(PORT,'127.0.0.1',()=>console.log(`HF Backend ready at http://localhost:${PORT}`));
