const API='http://localhost:3107/api';
let current=null;
async function request(path,data){let r=await fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(data)});if(!r.ok)throw new Error('Unable to save attempt');return r.json()}
window.HFTracking={
 start(scenario,level){const currentPromise=request('/attempts/start',{scenario,level}).then(v=>v.attemptId).catch(e=>{console.warn('Tracking start:',e.message);return null});current=currentPromise;return currentPromise;},
 async event(event){let id=await current;if(!id)return;try{await request('/attempts/event',{attemptId:id,event})}catch(e){console.warn(e.message)}},
 async finish(outcome){let id=await current;current=null;if(!id)return;try{await request('/attempts/finish',{attemptId:id,outcome})}catch(e){console.warn('Tracking finish:',e.message)}},
 async abandon(){let id=await current;current=null;if(!id)return;try{await request('/attempts/finish',{attemptId:id,outcome:'abandoned'})}catch(e){console.warn(e.message)}}
};
