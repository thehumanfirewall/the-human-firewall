import React, { useEffect, useRef, useState } from 'react';
import { Shield, Play, Gamepad2, Headphones, ArrowRight, ArrowUpRight, LockKeyhole, Crosshair, Fingerprint, Zap, X, Menu, Check, Radio, ScanFace, ShieldCheck } from 'lucide-react';
import './App.css';

const missions = [
  { n:'02', name:'FAKE INVESTMENT', kind:'FINANCIAL FRAUD', icon:'â—ˆ' },
  { n:'03', name:'QR CODE TRAP', kind:'QUISHING', icon:'âŒ—' },
  { n:'04', name:'PHISHING EMAIL', kind:'EMAIL ATTACKS', icon:'âœ‰' },
  { n:'05', name:'FAKE LOGIN PAGE', kind:'CREDENTIAL THEFT', icon:'âŒ˜' },
];
const levels = [
  {n:'01',title:'FOUNDATION',tag:'SPOT THE RED FLAGS',desc:'Spot obvious signs of an impersonated manager calling with an unexpected request.'},
  {n:'02',title:'INTERMEDIATE',tag:'QUESTION THE VOICE',desc:'Verify a persuasive caller who sounds exactly like someone you know.'},
  {n:'03',title:'ADVANCED',tag:'DEFEND UNDER PRESSURE',desc:'Respond to a multi-stage AI impersonation attack under time pressure.'},
];

function World() {
  const canvas = useRef(null);
  const move = useRef({x:0,y:0});
  const keys = useRef({});
  useEffect(()=>{
    const down = e => {let k=e.key.toLowerCase(); if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){keys.current[k]=true;if(document.activeElement?.tagName!=='INPUT')e.preventDefault()}};
    const up = e => keys.current[e.key.toLowerCase()]=false;
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);
    return ()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)};
  },[]);
  useEffect(()=>{
    const el=canvas.current,ctx=el.getContext('2d');let raf=0,t=0;let w=1,h=1;
    const ro=new ResizeObserver(()=>{const b=el.getBoundingClientRect();const d=Math.min(window.devicePixelRatio||1,2);w=el.width=Math.max(1,Math.round(b.width*d));h=el.height=Math.max(1,Math.round(b.height*d));});ro.observe(el);
    const polygon=(pts,col)=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=col;ctx.fill()};
    const line=(a,b,c,d,col,l=1)=>{ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.strokeStyle=col;ctx.lineWidth=l;ctx.stroke()};
    const draw=()=>{
      t+=.012;let p=move.current, k=keys.current, running=false;
      if(k.w||k.arrowup){p.y=Math.min(5,p.y+.07);running=true}if(k.s||k.arrowdown){p.y=Math.max(-3,p.y-.07);running=true}
      if(k.a||k.arrowleft){p.x=Math.max(-6,p.x-.07);running=true}if(k.d||k.arrowright){p.x=Math.min(6,p.x+.07);running=true}
      const s=Math.min(w/1100,h/650),cx=w*.5,hy=h*.40;
      const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#2a173d');bg.addColorStop(.44,'#914d72');bg.addColorStop(1,'#211428');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
      const glow=ctx.createRadialGradient(cx,hy,0,cx,hy,w*.57);glow.addColorStop(0,'#ffcf906e');glow.addColorStop(1,'#ffcf9000');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
      ctx.fillStyle='#ffd49d';ctx.beginPath();ctx.arc(cx,hy,62*s,0,Math.PI*2);ctx.fill();
      for(let i=0;i<15;i++){let x=i*w/14-35*s,bh=(90+(i*47)%170)*s;ctx.fillStyle=i%2?'#392540':'#4d2d4e';ctx.fillRect(x,hy-bh,95*s,bh+22*s);for(let r=0;r<6;r++)for(let c=0;c<3;c++)if((i+r+c)%3===0){ctx.fillStyle='#ffb98a9c';ctx.fillRect(x+(16+c*23)*s,hy-bh+(16+r*25)*s,7*s,10*s)}}
      const top=hy+36*s;polygon([[0,top],[w,top],[w,h],[0,h]],'#2c2038');polygon([[cx-145*s,top],[cx+145*s,top],[w*.86,h],[w*.14,h]],'#473348');
      for(let i=-12;i<=12;i++)line(cx+i*9*s,top,cx+i*100*s,h,'#ffb69a46',1*s);
      for(let j=1;j<15;j++){let d=j/15;let y=top+(h-top)*d*d;line(0,y,w,y,'#ffb69a37',1*s)}
      const panel=(xx,yy,name)=>{let x=cx+xx*s,y=hy+yy*s;ctx.fillStyle='#301e3b';ctx.fillRect(x-60*s,y-102*s,120*s,120*s);ctx.strokeStyle='#ffb67f';ctx.lineWidth=2*s;ctx.strokeRect(x-60*s,y-102*s,120*s,120*s);ctx.fillStyle='#ef99bc';ctx.fillRect(x-40*s,y-80*s,80*s,7*s);ctx.font=`${13*s}px monospace`;ctx.textAlign='center';ctx.fillStyle='#ffe2bd';ctx.fillText(name,x,y-44*s);for(let j=0;j<8;j++){let q=10+Math.abs(Math.sin(t*3+j))*24;ctx.fillStyle='#ffb47b';ctx.fillRect(x+(-35+j*9)*s,y+(-6-q)*s,4*s,q*s)}};
      panel(-300,92,'INCOMING CALL');panel(300,92,'VERIFY ID');
      let x=cx+p.x*67*s,y=h*.72-p.y*25*s,bob=Math.sin(t*(running?18:2))*3*s,sz=1.4*s;
      ctx.save();ctx.translate(x,y+bob);
      ctx.fillStyle='#0006';ctx.beginPath();ctx.ellipse(0,78*sz,30*sz,9*sz,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#1f1929';ctx.lineWidth=13*sz;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-12*sz,25*sz);ctx.lineTo((-15+(running?Math.sin(t*18)*6:0))*sz,74*sz);ctx.moveTo(12*sz,25*sz);ctx.lineTo((15-(running?Math.sin(t*18)*6:0))*sz,74*sz);ctx.stroke();
      polygon([[-25*sz,-24*sz],[25*sz,-24*sz],[20*sz,35*sz],[-20*sz,35*sz]],'#33213c');
      line(-16*sz,-19*sz,-12*sz,28*sz,'#ee9bb1',3*sz);line(16*sz,-19*sz,12*sz,28*sz,'#ee9bb1',3*sz);
      ctx.strokeStyle='#291b34';ctx.lineWidth=13*sz;ctx.beginPath();ctx.moveTo(-24*sz,-15*sz);ctx.lineTo(-33*sz,28*sz);ctx.moveTo(24*sz,-15*sz);ctx.lineTo(33*sz,28*sz);ctx.stroke();
      ctx.fillStyle='#c88e85';ctx.beginPath();ctx.arc(0,-42*sz,16*sz,0,Math.PI*2);ctx.fill();ctx.fillStyle='#25172c';ctx.beginPath();ctx.arc(0,-47*sz,17*sz,Math.PI,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffc08b';ctx.lineWidth=2*sz;ctx.beginPath();ctx.arc(0,-42*sz,19*sz,.75*Math.PI,2.2*Math.PI);ctx.stroke();ctx.restore();
      for(let i=0;i<40;i++){let a=((i*187+t*(11+i%5)*7)%w),b=i*h/40+Math.sin(t+i)*25*s;ctx.fillStyle=i%2?'#ffc19060':'#ff8abf67';ctx.fillRect(a,b,2*s,2*s)}
      const vignette=ctx.createRadialGradient(cx,h*.5,h*.15,cx,h*.5,w*.7);vignette.addColorStop(0,'#190d2900');vignette.addColorStop(1,'#130b26b3');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
      raf=requestAnimationFrame(draw);
    };raf=requestAnimationFrame(draw);return ()=>{cancelAnimationFrame(raf);ro.disconnect()};
  },[]);
  return <div className="world"><canvas ref={canvas}/><div className="world-top"><span><i className="live"/> LIVE SIMULATION PREVIEW</span><span>THE HUMAN FIREWALL // ALPHA 01</span></div><div className="world-title">THE WORLD IS NOT WHAT IT SEEMS</div><div className="world-bottom"><span><Gamepad2 size={17}/> W A S D <small>MOVE THE CHARACTER</small></span><span><Crosshair size={17}/> EXPLORATION MODE</span></div></div>;
}
export default function App(){
  const [modal,setModal]=useState(false),[selected,setSelected]=useState(null),[menu,setMenu]=useState(false);
  useEffect(()=>{const f=e=>{if(e.key==='Escape')setModal(false)};window.addEventListener('keydown',f);return ()=>window.removeEventListener('keydown',f)},[]);
  const scroll=id=>{setMenu(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})};
  return <div className="site"><header className="navbar"><button className="brand" onClick={()=>scroll('home')}><span className="brand-badge"><Shield size={25}/></span><span>THE HUMAN <b>FIREWALL</b><small>THE INTERACTIVE EXPERIENCE</small></span></button><nav className={menu?'navlinks show':'navlinks'}><button onClick={()=>scroll('home')}>HOME</button><button onClick={()=>scroll('experience')}>THE WORLD</button><button onClick={()=>scroll('missions')}>MISSIONS</button><button onClick={()=>scroll('about')}>ABOUT</button></nav><div className="navright"><span className="build">âœ¦ GP II // BUILD 001</span><button className="navstart" onClick={()=>setModal(true)}><Gamepad2 size={17}/> ENTER THE GAME</button><button className="hamb" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></header>
  <main><section id="home" className="hero"><div className="hero-cloud one"/><div className="hero-cloud two"/><div className="hero-content"><div className="pretitle"><span>âœ¦</span> YOUR MIND IS THE FINAL LINE OF DEFENSE</div><div className="eyebrow">WELCOME TO THE SIMULATION</div><h1>THE HUMAN <em>FIREWALL<span>.</span></em></h1><p className="lead">THEY CAN FAKE A VOICE. THEY CAN STEAL A FACE.<br/><strong>CAN THEY FOOL YOU?</strong></p><p className="desc">Enter a world of deception, critical choices, and real cyber threats. Learn to outsmart social engineers through interactive missions.</p><div className="actions"><button className="primary" onClick={()=>setModal(true)}><Play size={19} fill="currentColor"/> START YOUR JOURNEY <ArrowRight size={18}/></button><button className="outline" onClick={()=>scroll('experience')}><Gamepad2 size={19}/> VIEW GAME WORLD</button></div><div className="stats"><div><b>05</b><small>MISSIONS</small></div><div><b>15</b><small>PLANNED LEVELS</small></div><div><b>3D</b><small>FUTURE GAMEPLAY</small></div></div></div><div className="hero-art"><div className="orbit one"/><div className="orbit two"/><div className="hero-shield"><Shield size={150} strokeWidth={1.1}/><span>HF</span></div><div className="float-ui top"><ScanFace size={19}/> IDENTITY UNKNOWN</div><div className="float-ui bottom"><ShieldCheck size={19}/> THINK. VERIFY. DEFEND.</div></div><div className="scroll-text">SCROLL TO EXPLORE â†“</div></section>
  <div className="marquee"><div>{Array.from({length:4},(_,i)=><span key={i}>âœ¦ THINK BEFORE YOU TRUST &nbsp; âœ¦ VERIFY EVERY SIGNAL &nbsp; âœ¦ THE HUMAN FIREWALL &nbsp;</span>)}</div></div>
  <section id="experience" className="section experience"><div className="section-title"><div><span className="section-kicker">01 / THE EXPERIENCE</span><h2>STEP INTO <em>THE GAME.</em></h2><p>Move the character through a living cyberpunk training world. This is an interactive visual preview of the game environment.</p></div><strong>WORLD PREVIEW<br/>ALPHA BUILD</strong></div><World/><div className="under-world"><span><Zap size={16}/> LIVE ANIMATED SCENE</span><span><Gamepad2 size={16}/> MOVE WITH WASD OR ARROW KEYS</span><span><Shield size={16}/> SCENARIO GAMEPLAY COMING NEXT</span></div></section>
  <section id="missions" className="section missions"><div className="section-title"><div><span className="section-kicker">02 / CHOOSE YOUR MISSION</span><h2>EVERY DECISION <em>MATTERS.</em></h2><p>Five social engineering scenarios, three difficulty levels each. Your first challenge begins with one familiar voice.</p></div><strong>MISSION SELECT<br/>01 / 05</strong></div><div className="featured"><div className="featured-text"><div className="featured-top"><span>âœ¦ FEATURED MISSION</span><span className="in-dev">IN DEVELOPMENT</span></div><div className="featured-icon"><Headphones size={46}/><div className="tiny-bars">â–‚ â–… â–‡ â–ƒ â–†</div></div><span className="serial">MISSION 001 <i>/ AI IMPERSONATION</i></span><h3>VOICE<br/><em>CLONING.</em></h3><h4>THE FAKE MANAGER CALL</h4><p>Your manager calls. The voice sounds real. The request is urgent. But can you trust what you hear? Learn to identify the danger of AI-generated impersonation.</p><div className="chips"><span><Radio size={14}/> AI VOICE</span><span><Crosshair size={14}/> DECISION-BASED</span><span><Zap size={14}/> 3 LEVELS</span></div><button className="primary" onClick={()=>setModal(true)}>EXPLORE MISSION <ArrowRight size={18}/></button></div><div className="featured-art"><div className="ring a"/><div className="ring b"/><div className="graphic-head"><Headphones size={117} strokeWidth={1.2}/></div><div className="waveform">{Array.from({length:31},(_,i)=><i key={i} style={{height:`${12+Math.abs(Math.sin(i*1.62))*80}px`,animationDelay:`${i*.045}s`}}/>)}</div><div className="featured-art-top">â— VOICE PATTERN / UNVERIFIED</div><div className="featured-art-bottom">WHAT IF THE VOICE YOU TRUST ISN'T REAL?</div></div></div><div className="upcoming-head"><span>UPCOMING MISSIONS</span><small>PLANNED DEVELOPMENT ROADMAP</small></div><div className="upcoming">{missions.map(m=><div className="mission" key={m.n}><div className="mission-top"><span>MISSION {m.n}</span><LockKeyhole size={18}/></div><span className="mission-art">{m.icon}</span><small>{m.kind}</small><h4>{m.name}</h4><div className="mission-footer">COMING SOON <ArrowUpRight size={15}/></div></div>)}</div></section>
  <section className="statement"><p>THE HUMAN FIREWALL</p><h2>THE LAST LINE OF DEFENSE<br/>IS <em>YOU.</em></h2><button onClick={()=>setModal(true)}>ENTER THE SIMULATION <ArrowUpRight size={18}/></button></section><section id="about" className="about"><div className="about-icon"><Shield size={40}/></div><div><span className="section-kicker">03 / THE PROJECT</span><h2>MORE THAN A GAME.</h2><p>The Human Firewall: An Interactive AI-Driven Social Engineering Awareness Game. A graduation project at Jordan University of Science and Technology (JUST), supervised by Dr. Asim Basoul.</p></div></section></main><footer><b>THE HUMAN <span>FIREWALL.</span></b><span>Â© 2026 Â· GRADUATION PROJECT II Â· JUST</span><span>THINK. VERIFY. DEFEND.</span></footer>
  {modal&&<div className="modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><div className="modal" role="dialog" aria-modal="true" aria-label="Voice Cloning Level Selection"><div className="modal-header"><div><span>MISSION 001 // LEVEL SELECT</span><h2>VOICE <em>CLONING.</em></h2><p>THE FAKE MANAGER CALL</p></div><button onClick={()=>setModal(false)}><X size={22}/></button></div><div className="level-list">{levels.map(l=><button key={l.n} onClick={()=>setSelected(l.n)} className={selected===l.n?'level selected':'level'}><span className="number">{l.n}</span><small>{l.tag}</small><h3>{l.title}</h3><p>{l.desc}</p><div className="level-foot">{selected===l.n?<><Check size={16}/> SELECTED</>:<>SELECT LEVEL <ArrowRight size={16}/></>}</div></button>)}</div><div className="modal-actions"><span><i className="live"/> LEVELS IN DEVELOPMENT</span><button disabled={!selected} onClick={()=>alert('Level '+selected+' is in development. Interactive gameplay will be implemented in the next phase.')}>START LEVEL {selected||'--'} <Play size={15}/></button></div></div></div>}
  </div>
}
