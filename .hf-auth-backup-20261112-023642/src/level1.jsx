import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, ChevronRight, CircleAlert, Coffee, FileSpreadsheet, FileText, Folder, Headphones, HelpCircle, Laptop, LockKeyhole, Mail, MapPin, MousePointer2, Phone, PhoneOff, Play, RotateCcw, Send, Shield, ShieldAlert, ShieldCheck, Volume2, VolumeX, X } from 'lucide-react';
import './level1.css';

const FILES = [
  { id:'salary', name:'Employee_Salaries_Q4.xlsx', size:'84 KB', type:'spreadsheet', classification:'CONFIDENTIAL' },
  { id:'payroll', name:'Payroll_Records_2026.pdf', size:'236 KB', type:'pdf', classification:'RESTRICTED' },
  { id:'bonus', name:'Staff_Bonus_List.xlsx', size:'42 KB', type:'spreadsheet', classification:'CONFIDENTIAL' }
];
const MANAGER_EMAIL = 'david.morgan@astera-corp.com';
const FAKE_EMAIL = 'david.morgan.hr@astera-helpdesk.com';
const SPEECH = {
  manager: "Hi, it's David. Sorry to call so suddenly. I'm in an external meeting and our payroll review starts in ten minutes. I can't get into my work mailbox from here. I need Employee Salaries Q4, Payroll Records 2026, and Staff Bonus List. I've left a draft email on your laptop with the address to send them to. Please attach all three files and send it right away. Don't call me back during the meeting. Can you handle that?",
  managerThanks: "Perfect. Thanks for helping me out. I really appreciate it. Talk later.",
  managerPressure: "I understand, but we're running short on time. The files are in the confidential folder. Please check the draft and use your judgment. Thanks.",
  itFailure: "This is Maya from IT Security. Our data loss prevention system just detected three confidential payroll documents leaving the company network. They were sent to an unauthorized external domain. Your manager did not request these files. The caller was using an artificial voice impersonation. In this training simulation, your access is being suspended and the simulated disciplinary outcome will now appear on your workstation.",
  itSuccess: "Hi, this is Maya from IT Security. You took the right action. That call used an AI-generated imitation of your manager's voice. By checking the official directory and refusing to send confidential files to an unapproved address, you stopped the social engineering attempt. Congratulations, you passed the training exercise."
};
const COLOR = { wood:'#6b4638', lightWood:'#9a6a50', pink:'#df90b1', gold:'#f7ba83' };

function Box({ position, args, color, rotation, materialProps, ...rest }) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow {...rest}><boxGeometry args={args}/><meshStandardMaterial color={color} roughness={.72} {...materialProps}/></mesh>;
}
function Label3d({ children, position, color='#fff0dc', fontSize=.22 }) {
  return <Text position={position} color={color} fontSize={fontSize} anchorX="center" anchorY="middle" maxWidth={3}>{children}</Text>;
}
function Office({ ringing, near, onInteract }) {
  const phoneGlow = useRef();
  useFrame(({clock})=>{if(phoneGlow.current)phoneGlow.current.intensity=ringing?2.4+Math.sin(clock.elapsedTime*12)*.8:.35});
  return <>
    <color attach="background" args={['#1b1324']}/>
    <fog attach="fog" args={['#1b1324',10,26]}/>
    <ambientLight intensity={1.35} color="#f7d7cf" />
    <hemisphereLight intensity={1.35} groundColor="#59445e" color="#ffe2d1" />
    <directionalLight position={[-3,7,2]} intensity={2.4} color="#ffd5ac" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10}/>
    <pointLight position={[2.5,3,-2]} intensity={22} color="#f9a36e" distance={9} decay={2}/>
    <pointLight position={[-4,2,1]} intensity={13} color="#bb8cff" distance={8} decay={2}/>
    <pointLight ref={phoneGlow} position={[-1.05,1.15,-1.3]} color="#ffb27e" distance={3} decay={2}/>

    {/* Room */}
    <Box position={[0,-.12,0]} args={[13,.22,12]} color="#7c6b69"/>
    <Box position={[0,-.002,0]} args={[12.5,.01,11.5]} color="#927d77"/>
    {Array.from({length:11},(_,i)=><Box key={'floor'+i} position={[-5.4+i*1.08,.011,0]} args={[.018,.01,11.4]} color="#a38c84"/>)}
    <Box position={[0,3.05,-5.55]} args={[13,6.3,.2]} color="#ddd0c5"/>
    <Box position={[-6.35,3,0]} args={[.2,6.2,12]} color="#bca9a6"/>
    <Box position={[6.35,3,0]} args={[.2,6.2,12]} color="#c8b7b6"/>
    <Box position={[0,6.12,0]} args={[13,.13,12]} color="#f1dacf"/>
    <Box position={[0,.12,-5.43]} args={[12.5,.15,.12]} color="#7a596a"/>
    <Box position={[-6.18,.12,0]} args={[.13,.15,11.5]} color="#7a596a"/>
    <Box position={[6.18,.12,0]} args={[.13,.15,11.5]} color="#7a596a"/>

    {/* Windows and skyline */}
    <Box position={[3.5,3.18,-5.4]} args={[3.6,3.75,.05]} color="#3c354b"/>
    <Box position={[3.5,3.18,-5.35]} args={[3.4,3.55,.05]} color="#d59d8a" materialProps={{emissive:'#9e5b6c',emissiveIntensity:.36}}/>
    {Array.from({length:8},(_,i)=><Box key={'sky'+i} position={[2.02+i*.43,2.08+(i%3)*.09,-5.3]} args={[.33,(i%4)*.35+.9,.02]} color={i%2?'#675c70':'#76616d'}/>)}
    <Box position={[3.5,3.17,-5.26]} args={[.08,3.6,.11]} color="#efded0"/>
    <Box position={[3.5,3.18,-5.25]} args={[3.48,.08,.11]} color="#efded0"/>
    <Box position={[3.5,5.0,-5.2]} args={[3.8,.2,.25]} color="#8b6776"/>

    {/* Wall decor */}
    <Box position={[-2.75,3.43,-5.39]} args={[2.55,1.6,.08]} color="#3f2a41"/>
    <Box position={[-2.75,3.43,-5.31]} args={[2.25,1.33,.02]} color="#e5ad8e"/>
    <Label3d position={[-2.75,3.65,-5.25]} color="#4a273a" fontSize={.28}>THINK. VERIFY.</Label3d>
    <Label3d position={[-2.75,3.18,-5.25]} color="#4a273a" fontSize={.3}>DEFEND.</Label3d>

    {/* Rug */}
    <Box position={[0,.035,.8]} args={[5.4,.025,4.7]} color="#67475e"/>
    <Box position={[0,.051,.8]} args={[5.07,.014,4.35]} color="#8e6076"/>

    {/* Main desk */}
    <Box position={[0,1,-1.55]} args={[4.55,.16,1.77]} color={COLOR.lightWood}/>
    <Box position={[0,.89,-1.55]} args={[4.36,.06,1.62]} color="#432e3b"/>
    {[-1.89,1.89].map(x=>[-2.21,-.91].map(z=><Box key={x+'-'+z} position={[x,.5,z]} args={[.19,1,.18]} color="#4b3741"/>))}
    <Box position={[0,.72,-2.3]} args={[4.1,.5,.13]} color="#44313b"/>

    {/* Premium laptop chassis: two-piece aluminum enclosure, hinges and keyboard deck */}
    <group position={[.72,1.12,-1.48]} rotation={[0,-.1,0]}>
      <RoundedBox args={[1.46,.075,1.03]} radius={.048} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#b4adb0" metalness={.82} roughness={.27}/>
      </RoundedBox>
      <Box position={[0,.044,0]} args={[1.36,.01,.91]} color="#24232a" materialProps={{metalness:.55,roughness:.28}}/>
      {/* Keyboard keycaps and spaced rows */}
      {Array.from({length:5},(_,r)=>Array.from({length:12},(_,c)=>
        <RoundedBox key={'key'+r+'-'+c} position={[-.555+c*.101,.059,-.335+r*.101]} args={[.076,.012,.066]} radius={.007} smoothness={2}>
          <meshStandardMaterial color={r===4&&c>3&&c<8?'#3d3942':'#17191f'} metalness={.2} roughness={.62}/>
        </RoundedBox>
      ))}
      <RoundedBox position={[0,.064,.34]} args={[.42,.006,.2]} radius={.016} smoothness={3}>
        <meshStandardMaterial color="#99939b" metalness={.6} roughness={.3}/>
      </RoundedBox>
      {/* Speaker perforations */}
      {Array.from({length:10},(_,i)=><React.Fragment key={'sp'+i}>
        <Box position={[-.66,.056,-.37+i*.075]} args={[.018,.003,.021]} color="#555057"/>
        <Box position={[.66,.056,-.37+i*.075]} args={[.018,.003,.021]} color="#555057"/>
      </React.Fragment>)}
      <mesh position={[-.46,.045,-.51]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.034,.034,.14,14]}/><meshStandardMaterial color="#8c858b" metalness={.9} roughness={.3}/></mesh>
      <mesh position={[.46,.045,-.51]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.034,.034,.14,14]}/><meshStandardMaterial color="#8c858b" metalness={.9} roughness={.3}/></mesh>
      {/* The display is attached at the back edge of the real base */}
      <group position={[0,.49,-.52]} rotation={[-.12,0,0]}>
        <RoundedBox args={[1.48,.97,.055]} radius={.041} smoothness={4} castShadow>
          <meshStandardMaterial color="#a59da3" metalness={.8} roughness={.27}/>
        </RoundedBox>
        <RoundedBox position={[0,0,.031]} args={[1.43,.91,.011]} radius={.025} smoothness={3}>
          <meshStandardMaterial color="#121119" metalness={.25} roughness={.22}/>
        </RoundedBox>
        <Box position={[0,-.008,.040]} args={[1.34,.77,.003]} color="#35243d" materialProps={{emissive:'#8e4775',emissiveIntensity:.33,roughness:.3}}/>
        {/* Display wallpaper with taskbar, cards, sidebar and visible desktop widgets */}
        <Box position={[-.49,-.005,.044]} args={[.24,.74,.005]} color="#251c30"/>
        <Box position={[.13,.17,.047]} args={[.91,.13,.005]} color="#a66c85"/>
        <Box position={[-.02,-.10,.048]} args={[.57,.23,.005]} color="#53445f"/>
        <Box position={[.47,-.10,.048]} args={[.35,.23,.005]} color="#74536a"/>
        <Box position={[.13,-.31,.049]} args={[.91,.035,.005]} color="#e8ac8a"/>
        <Label3d position={[.15,.17,.052]} fontSize={.064} color="#fff2e6">ASTERA  WORKSPACE</Label3d>
        <Label3d position={[0,-.12,.054]} fontSize={.037} color="#f4d6cb">SECURE DOCUMENTS</Label3d>
        <mesh position={[0,.444,.039]}><sphereGeometry args={[.014,10,10]}/><meshStandardMaterial color="#29202d"/></mesh>
      </group>
      <Label3d position={[0,.06,.52]} fontSize={.032} color="#28212a">ASTERA</Label3d>
    </group>

    {/* Phone on desk */}
    <group position={[-1.23,1.11,-1.24]} rotation={[0,-.25,0]} onClick={onInteract}>
      <Box args={[.43,.07,.81]} color="#24202a"/>
      <Box position={[0,.038,0]} args={[.36,.009,.69]} color={ringing?'#ffba86':'#402f51'} materialProps={{emissive:ringing?'#f08963':'#613e7b',emissiveIntensity:ringing?1.7:.2}}/>
      <Label3d position={[0,.051,-.1]} fontSize={.055} color={ringing?'#3d1931':'#f2bad6'}>{ringing?'DAVID MORGAN':'PHONE'}</Label3d>
    </group>

    {/* Paper stack, pen, mug */}
    {[0,.018,.036,.054].map((dy,i)=><Box key={'paper'+i} position={[-.22,1.105+dy,-1.12]} args={[.43,.011,.56]} color={i===3?'#f4e9dd':'#d5d3cc'} rotation={[0,-.23,0]}/>)}
    <Box position={[-.23,1.173,-1.12]} args={[.32,.006,.02]} color="#a87783"/>
    <mesh position={[1.76,1.18,-1.95]} castShadow><cylinderGeometry args={[.15,.12,.23,18]}/><meshStandardMaterial color="#efb18f" roughness={.5}/></mesh>
    <mesh position={[1.95,1.19,-1.94]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.084,.026,9,20]}/><meshStandardMaterial color="#efb18f"/></mesh>

    {/* Office chair */}
    <Box position={[.3,.47,1.03]} args={[.93,.16,.93]} color="#4b3346"/>
    <Box position={[.3,1.07,1.5]} args={[.95,1.2,.18]} color="#564055" rotation={[-.13,0,0]}/>
    <mesh position={[.3,.32,1.03]}><cylinderGeometry args={[.08,.08,.65,10]}/><meshStandardMaterial color="#5b5461"/></mesh>
    {Array.from({length:5},(_,i)=>{
      const a=i*Math.PI*2/5;
      return <Box key={'wheel'+i} position={[.3+Math.cos(a)*.45,.11,1.03+Math.sin(a)*.45]} args={[.7,.07,.1]} color="#3c3343" rotation={[0,-a,0]}/>;
    })}

    {/* Bookshelves */}
    <Box position={[-5.4,2.12,-3.26]} args={[1.38,3.83,.48]} color="#584052"/>
    {Array.from({length:4},(_,row)=><React.Fragment key={'shelf'+row}>
      <Box position={[-5.4,.5+row*.93,-2.94]} args={[1.32,.09,.65]} color="#a46d56"/>
      {Array.from({length:7},(_,i)=><Box key={'book'+row+'-'+i} position={[-5.96+i*.18,.86+row*.93,-2.96]} args={[.12,.48+(i%3)*.1,.27]} color={['#d0a19d','#51425e','#efbb81','#9b7089','#4a465b'][i%5]}/>)}
    </React.Fragment>)}

    {/* Coffee station */}
    <Box position={[5.12,.94,-1.28]} args={[1.45,.12,1.25]} color="#ad7861"/>
    <Box position={[5.12,.43,-1.28]} args={[1.36,.95,1.15]} color="#544353"/>
    <Box position={[5.08,1.28,-1.33]} args={[.76,.59,.69]} color="#36313f"/>
    <Box position={[5.08,1.46,-.96]} args={[.54,.15,.05]} color="#d7b2a7"/>
    <Box position={[5.08,1.10,-1.0]} args={[.40,.08,.4]} color="#bbb0a6"/>
    <Label3d position={[5.08,1.49,-.926]} color="#4c2c3b" fontSize={.065}>COFFEE</Label3d>
    <mesh position={[4.4,1.12,-1.33]}><cylinderGeometry args={[.12,.12,.22,16]}/><meshStandardMaterial color="#e6b3a3"/></mesh>
    <mesh position={[5.75,1.14,-1.32]}><cylinderGeometry args={[.12,.12,.25,16]}/><meshStandardMaterial color="#eed4b8"/></mesh>

    {/* Sideboard and plants */}
    <Box position={[-4.7,.8,1.18]} args={[1.5,1.42,.8]} color="#685062"/>
    <Box position={[-4.7,1.56,1.18]} args={[1.6,.11,.85]} color="#b0806b"/>
    <mesh position={[-4.4,1.77,1.1]}><cylinderGeometry args={[.24,.19,.42,12]}/><meshStandardMaterial color="#b77d76"/></mesh>
    {Array.from({length:8},(_,i)=>{
      const a=i*Math.PI*.25;
      return <mesh key={'leaf'+i} position={[-4.4+Math.cos(a)*.23,2.16+(i%3)*.14,1.1+Math.sin(a)*.19]} rotation={[.35,0,a]}><sphereGeometry args={[.12,.25,9,7]}/><meshStandardMaterial color={i%2?'#587466':'#78957b'}/></mesh>;
    })}

    {/* Photoreal-style office accents: desk mat, desk lamp, wall clock, monitor stand and outlet */}
    <RoundedBox position={[.60,1.094,-1.48]} args={[1.95,.012,1.26]} radius={.045} smoothness={3} receiveShadow>
      <meshStandardMaterial color="#362632" roughness={.92}/>
    </RoundedBox>
    <mesh position={[-1.68,1.11,-1.91]} castShadow><cylinderGeometry args={[.17,.19,.055,32]}/><meshStandardMaterial color="#3b373d" metalness={.72} roughness={.35}/></mesh>
    <mesh position={[-1.68,1.45,-1.91]} castShadow><cylinderGeometry args={[.022,.022,.67,12]}/><meshStandardMaterial color="#9d8c83" metalness={.85} roughness={.25}/></mesh>
    <mesh position={[-1.55,1.76,-1.91]} rotation={[0,0,-.4]} castShadow><coneGeometry args={[.20,.3,24,1,true]}/><meshStandardMaterial color="#51434b" metalness={.5} roughness={.4} side={THREE.DoubleSide}/></mesh>
    <pointLight position={[-1.5,1.65,-1.9]} intensity={2.2} color="#ffd9b2" distance={2.5}/>
    <mesh position={[-5.9,4.7,-5.26]}><cylinderGeometry args={[.39,.39,.055,36]}/><meshStandardMaterial color="#efe4d6" metalness={.15} roughness={.5}/></mesh>
    <Box position={[-5.9,4.7,-5.20]} args={[.012,.27,.012]} color="#634b56"/>
    <Box position={[-5.9,4.7,-5.19]} args={[.21,.012,.012]} color="#634b56"/>
    <Box position={[3.1,1.05,-5.25]} args={[.62,.62,.065]} color="#d6b5a6"/>
    <Box position={[3.1,1.05,-5.21]} args={[.4,.32,.01]} color="#e9dcd2"/>
    {Array.from({length:6},(_,i)=><Box key={'blinds'+i} position={[3.5,4.55-i*.47,-5.10]} args={[3.1,.055,.025]} color="#f2d4c8" materialProps={{transparent:true,opacity:.55}}/>)}
    {/* Accent wall sconces and baseboard trim */}
    <pointLight position={[-5.7,4,-3]} intensity={3.5} color="#fff0db" distance={4}/>
    <Box position={[-6.18,4,-3]} args={[.17,.66,.37]} color="#e8d3bf" materialProps={{emissive:'#ffcfa7',emissiveIntensity:.25}}/>

    {/* Ceiling fixture */}
    <Box position={[0,5.85,-1]} args={[2.3,.12,.55]} color="#fff2d6" materialProps={{emissive:'#fff1d5',emissiveIntensity:1.6}}/>
    <Box position={[-3.8,5.85,2.7]} args={[1.5,.12,.4]} color="#fff2d6" materialProps={{emissive:'#fff1d5',emissiveIntensity:1.2}}/>
    <ContactShadows position={[0,.035,0]} opacity={.18} scale={12} blur={2.2} far={5}/>
  </>;
}

function Controller({ enabled, onNearChange, onInteract, ringing, ringReady }) {
  const {camera,gl} = useThree();
  const keys = useRef({});
  const yaw = useRef(0), pitch=useRef(-.13), position=useRef(new THREE.Vector3(0,1.68,3.15));
  const dragging=useRef(false), nearRef=useRef('');
  const onInteractRef=useRef(onInteract); onInteractRef.current=onInteract;
  useEffect(()=>{
    const kd=e=>{
      const k=({KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyE:'e',ShiftLeft:'shift',ShiftRight:'shift',ArrowUp:'arrowup',ArrowDown:'arrowdown',ArrowLeft:'arrowleft',ArrowRight:'arrowright'})[e.code]||e.key.toLowerCase();
      if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','e','shift'].includes(k)){
        if(enabled && document.activeElement?.tagName!=='INPUT')e.preventDefault();
        if(k==='e' && !e.repeat && enabled)onInteractRef.current(nearRef.current);
        keys.current[k]=true;
      }
    };
    const ku=e=>{const k=({KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyE:'e',ShiftLeft:'shift',ShiftRight:'shift',ArrowUp:'arrowup',ArrowDown:'arrowdown',ArrowLeft:'arrowleft',ArrowRight:'arrowright'})[e.code]||e.key.toLowerCase();keys.current[k]=false};
    const blur=()=>{keys.current={};dragging.current=false};
    const mouseDown=e=>{if(e.button===0)dragging.current=true};
    const mouseUp=()=>dragging.current=false;
    const move=e=>{
      if(!enabled||!dragging.current)return;
      yaw.current-=e.movementX*.0035;
      pitch.current=Math.min(.5,Math.max(-.5,pitch.current-e.movementY*.003));
    };
    window.addEventListener('keydown',kd,true);window.addEventListener('keyup',ku,true);window.addEventListener('blur',blur);
    gl.domElement.addEventListener('pointerdown',mouseDown);
    window.addEventListener('pointerup',mouseUp);window.addEventListener('pointermove',move);
    return ()=>{window.removeEventListener('keydown',kd,true);window.removeEventListener('keyup',ku,true);window.removeEventListener('blur',blur);gl.domElement.removeEventListener('pointerdown',mouseDown);window.removeEventListener('pointerup',mouseUp);window.removeEventListener('pointermove',move)};
  },[enabled,gl]);
  useFrame((_,dt)=>{
    const p=position.current;
    if(enabled){
      let forward=(keys.current.w||keys.current.arrowup?1:0)-(keys.current.s||keys.current.arrowdown?1:0);
      let side=(keys.current.d||keys.current.arrowright?1:0)-(keys.current.a||keys.current.arrowleft?1:0);
      if(forward||side){
        const n=Math.hypot(forward,side),speed=(keys.current.shift?3.8:2.35)*Math.min(dt,.06);
        const sx=(Math.sin(yaw.current)*forward+Math.cos(yaw.current)*side)/n*speed;
        const sz=(-Math.cos(yaw.current)*forward+Math.sin(yaw.current)*side)/n*speed;
        let nx=p.x+sx,nz=p.z+sz;
        nx=Math.max(-5.68,Math.min(5.68,nx));nz=Math.max(-4.79,Math.min(4.9,nz));
        // Solid desk, cabinet, bookshelf and coffee station collision
        const blocked=(x,z)=>
          (x>-2.55&&x<2.55&&z>-2.65&&z<-.54) ||
          (x>-4.35&&x<.95&&z>.55&&z<1.95) && Math.abs(x)<.95 ||
          (x>4.15&&z>-2.4&&z<-.2) ||
          (x< -4.35&&z< -2.55);
        if(!blocked(nx,p.z))p.x=nx;
        if(!blocked(p.x,nz))p.z=nz;
      }
    }
    camera.position.copy(p);
    camera.rotation.order='YXZ';camera.rotation.y=yaw.current;camera.rotation.x=pitch.current;
    const ph=Math.hypot(p.x+1.25,p.z+1.22)<2.35;
    const lh=Math.hypot(p.x-.72,p.z+1.5)<2.35;
    const value=ph?'phone':lh?'laptop':'';
    if(value!==nearRef.current){nearRef.current=value;onNearChange(value)};
  });
  return null;
}

function useAudioNarration(){
  const ctx=useRef(null), tim=useRef(null), speech=useRef(null), [muted,setMuted]=useState(false), mutedRef=useRef(false);
  const unlock=()=>{
    try{if(!ctx.current)ctx.current=new (window.AudioContext||window.webkitAudioContext)();ctx.current.resume()}catch(e){}
  };
  const stopRing=()=>{if(tim.current){clearInterval(tim.current);tim.current=null}};
  const beep=()=>{
    if(mutedRef.current)return;
    try{
      unlock();const a=ctx.current,t=a.currentTime;
      [0,.18,.55,.73].forEach((offset,i)=>{
        const osc=a.createOscillator(),gain=a.createGain();osc.type='sine';osc.frequency.setValueAtTime(i%2?555:440,t+offset);
        gain.gain.setValueAtTime(.0001,t+offset);gain.gain.linearRampToValueAtTime(.10,t+offset+.018);gain.gain.exponentialRampToValueAtTime(.0001,t+offset+.16);
        osc.connect(gain).connect(a.destination);osc.start(t+offset);osc.stop(t+offset+.18);
      });
    }catch(e){}
  };
  const startRing=()=>{stopRing();beep();tim.current=setInterval(beep,1700)};
  const stopSpeech=()=>{try{window.speechSynthesis?.cancel()}catch(e){}};
  const speak=(text,onDone,kind='manager')=>{
    stopSpeech();
    if(!window.speechSynthesis||mutedRef.current){const t=setTimeout(()=>onDone?.(),Math.min(16000,Math.max(3500,text.length*43)));return ()=>clearTimeout(t)}
    const u=new SpeechSynthesisUtterance(text);speech.current=u;u.lang='en-US';u.rate=kind==='manager'?.87:.91;u.pitch=kind==='manager'?.74:1.05;u.volume=1;
    const voices=window.speechSynthesis.getVoices();
    const matches=voices.filter(v=>v.lang.startsWith('en'));
    const preferred=kind==='manager'?matches.find(v=>/David|Guy|Mark|George|Male|Daniel/i.test(v.name)):matches.find(v=>/Jenny|Zira|Aria|Female|Samantha/i.test(v.name));
    if(preferred||matches[0])u.voice=preferred||matches[0];
    let finished=false;
    const done=()=>{if(!finished){finished=true;onDone?.()}};
    u.onend=done;u.onerror=done;
    setTimeout(()=>{try{window.speechSynthesis.speak(u)}catch(e){done()}},100);
    return ()=>{u.onend=null;u.onerror=null;stopSpeech()};
  };
  const toggleMute=()=>setMuted(v=>{mutedRef.current=!v;if(!v){stopRing();stopSpeech()}return !v});
  useEffect(()=>()=>{stopRing();stopSpeech();ctx.current?.close()},[]);
  return {unlock,startRing,stopRing,speak,stopSpeech,muted,toggleMute};
}

function FileIcon({file}){return file.type==='pdf'?<FileText size={19}/>:<FileSpreadsheet size={19}/>}
function LaptopDesktop({onSend,onVerify,onReport,onClose,verified,results}){
  const [tab,setTab]=useState('files');
  const [selected,setSelected]=useState([]);
  const [attached,setAttached]=useState([]);
  const [draftOpen,setDraftOpen]=useState(false);
  const [drag,setDrag]=useState(false);
  const [showDirectory,setShowDirectory]=useState(false);
  const add=(ids)=>setAttached(v=>[...new Set([...v,...ids])]);
  const toggle=(id)=>setSelected(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
  return <div className="laptop-shell" role="dialog" aria-modal="true" aria-label="Simulated company laptop">
    <div className="laptop-bezel">
      <div className="laptop-screen">
        <div className="os-top"><span className="os-brand"><Shield size={16}/> ASTERA <b>WORKSPACE</b></span><span><LockKeyhole size={14}/> COMPANY DEVICE — TRAINING SIMULATION</span><button onClick={onClose}><X size={16}/> CLOSE [ESC]</button></div>
        <div className="os-layout">
          <aside className="os-sidebar"><div className="os-avatar">AM</div><b>ALEX MORGAN</b><small>Employee account</small><div className="os-rule"/>
            <button className={tab==='files'?'active':''} onClick={()=>setTab('files')}><Folder size={17}/> File Explorer</button>
            <button className={tab==='mail'?'active':''} onClick={()=>setTab('mail')} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(FILES.some(f=>f.id===id))add([id]);setTab('mail')}}><Mail size={17}/> Mail <span className="mail-count">1</span></button>
            <button className={tab==='directory'?'active':''} onClick={()=>setTab('directory')}><BriefcaseBusiness size={17}/> Company Directory</button>
            <div className="os-sidebar-bottom"><Shield size={16}/> Confidential system</div>
          </aside>
          <div className="os-main">
            {tab==='files'&&<>
              <div className="os-heading"><div><small>COMPANY DRIVE / HR / RESTRICTED</small><h3>Confidential Files</h3></div><span className="classified">RESTRICTED ACCESS</span></div>
              <div className="file-banner"><ShieldAlert size={17}/> Company policy: payroll files must never be sent to unapproved external addresses.</div>
              <div className="file-tools"><button onClick={()=>setSelected(FILES.map(f=>f.id))}><Check size={14}/> SELECT ALL</button><button disabled={!selected.length} onClick={()=>{add(selected);setTab('mail')}}><Mail size={14}/> ATTACH SELECTED ({selected.length})</button><span>SELECT FILES • DRAG TO EMAIL</span></div>
              <div className="files-table"><div className="files-table-heading"><span>FILE NAME</span><span>CLASSIFICATION</span><span>SIZE</span></div>
                {FILES.map(f=><div key={f.id} className={'file-row '+(selected.includes(f.id)?'is-selected':'')} draggable onDragStart={e=>{e.dataTransfer.setData('text/plain',f.id);e.dataTransfer.effectAllowed='copy'}} onClick={()=>toggle(f.id)} onDoubleClick={()=>{add([f.id]);setTab('mail')}}>
                  <span><input readOnly type="checkbox" checked={selected.includes(f.id)}/><FileIcon file={f}/>{f.name}</span><span className="file-class">{f.classification}</span><span>{f.size}</span>
                </div>)}
              </div>
              <div className="os-help">Tip: Select files and click “Attach Selected”, or drag a file onto Mail in the sidebar.</div>
            </>}
            {tab==='mail'&&<>
              <div className="os-heading"><div><small>ASTERA MAIL / DRAFTS</small><h3>New Message</h3></div><span className="draft-tag">UNSENT DRAFT</span></div>
              <div className="email-fields"><div><label>From</label><span>alex@astera-corp.com</span></div><div className="suspicious-to"><label>To</label><strong>{FAKE_EMAIL}</strong><CircleAlert size={17}/></div><div><label>Subject</label><span>URGENT — Payroll Review Documents</span></div></div>
              <div className="mail-body">Hi David,<br/><br/>As requested, please find the confidential payroll documents attached.<br/><br/>Best regards,<br/>Alex</div>
              <div className={'dropzone '+(drag?'dragging':'')} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);let id=e.dataTransfer.getData('text/plain');if(FILES.some(f=>f.id===id))add([id])}}>
                <div><Folder size={17}/> ATTACHMENTS <small>DRAG FILES HERE</small></div>
                <div className="attachment-chips">{attached.length?attached.map(id=>{const f=FILES.find(x=>x.id===id);return <span key={id}><FileIcon file={f}/>{f.name}<button onClick={()=>setAttached(v=>v.filter(x=>x!==id))}><X size={12}/></button></span>}):<p>No files attached. Open File Explorer to add files.</p>}</div>
              </div>
              <div className="mail-footer"><button className="mail-alt" onClick={()=>setTab('files')}><Folder size={15}/> OPEN FILES</button><button className="mail-send" onClick={()=>onSend(attached)} disabled={!attached.length}><Send size={16}/> SEND EMAIL ({attached.length}/3)</button></div>
              <p className="mail-warning"><CircleAlert size={15}/> External recipient. Compare the address with the company directory before sending sensitive data.</p>
            </>}
            {tab==='directory'&&<>
              <div className="os-heading"><div><small>VERIFIED INTERNAL RECORDS</small><h3>Company Directory</h3></div><span className="verified">OFFICIAL SOURCE</span></div>
              <div className="directory-profile"><div className="directory-avatar">DM</div><div><h3>David Morgan</h3><p>Operations Manager</p><span><Mail size={15}/> {MANAGER_EMAIL}</span><span><Phone size={15}/> Extension 204 — Corporate VoIP</span></div></div>
              <div className="directory-alert"><CircleAlert size={20}/><p>The draft recipient <b>{FAKE_EMAIL}</b> is <strong>not</strong> the manager's verified corporate email address.</p></div>
              <button className="verify-btn" onClick={onVerify}><ShieldCheck size={18}/> VERIFY REQUEST THROUGH COMPANY IT</button>
              <button className="report-btn" onClick={onReport}><ShieldAlert size={18}/> REPORT SUSPICIOUS EMAIL</button>
            </>}
          </div>
        </div>
        <div className="os-taskbar"><span>✦ ASTERA OS</span><span>LOCAL SIMULATION • NO REAL EMAIL WILL BE SENT</span><span>14:32</span></div>
      </div>
    </div>
    <div className="laptop-base"/>
  </div>
}

function App(){
  const [stage,setStage]=useState('ready');
  const [session,setSession]=useState(0);
  const [near,setNear]=useState('');
  const [dialogueFinished,setDialogueFinished]=useState(false);
  const [laptopOpen,setLaptopOpen]=useState(false);
  const [callVisible,setCallVisible]=useState(false);
  const [itType,setItType]=useState('');
  const [result,setResult]=useState('');
  const [selectedFiles,setSelectedFiles]=useState([]);
  const [elapsed,setElapsed]=useState(0);
  const timer=useRef([]),stageRef=useRef('ready'),audio=useAudioNarration();
  stageRef.current=stage;
  const schedule=(fn,ms)=>{const t=setTimeout(fn,ms);timer.current.push(t);return t};
  const clearTimers=()=>{timer.current.forEach(clearTimeout);timer.current=[]};
  const [showControls,setShowControls]=useState(true);
  const scrollBack=()=>{window.location.href='/';};

  const ringManager=()=>{
    if(['ending','itCall','laptop','itRing','success','failure'].includes(stageRef.current))return;
    setStage('ringing');setCallVisible(true);audio.startRing();
    schedule(()=>{if(stageRef.current==='ringing'){audio.stopRing();setCallVisible(false);setStage('waiting');schedule(()=>{if(stageRef.current==='waiting')ringManager()},5000)}},6500);
  };
  const start=()=>{
    audio.unlock();setStage('intro');setShowControls(false);
    schedule(()=>ringManager(),3200);
  };
  const decline=()=>{
    audio.stopRing();setCallVisible(false);setStage('waiting');
    schedule(()=>{if(stageRef.current==='waiting')ringManager()},5000);
  };
  const answer=()=>{
    if(stageRef.current!=='ringing')return;
    audio.unlock();audio.stopRing();setCallVisible(true);setDialogueFinished(false);setStage('call');
    audio.speak(SPEECH.manager,()=>setDialogueFinished(true),'manager');
  };
  const respond=(choice)=>{
    if(!dialogueFinished||stageRef.current!=='call')return;
    setDialogueFinished(false);setStage('outro');
    audio.speak(choice==='okay'?SPEECH.managerThanks:SPEECH.managerPressure,()=>{
      setCallVisible(false);setStage('explore');
    },'manager');
  };
  const openLaptop=()=>{if(stageRef.current==='explore'){setLaptopOpen(true);setStage('laptop');}};
  const startIT=(type)=>{
    setLaptopOpen(false);setItType(type);setStage('itRing');
    schedule(()=>{audio.startRing();setCallVisible(true)},2600);
  };
  const sendFiles=(ids)=>{
    if(!ids.length)return;
    setSelectedFiles(ids);
    setResult('failure');
    startIT('failure');
  };
  const verify=()=>{setResult('success');startIT('success');};
  const answerIT=()=>{
    if(stageRef.current!=='itRing')return;
    audio.unlock();audio.stopRing();setStage('itCall');setDialogueFinished(false);
    audio.speak(itType==='success'?SPEECH.itSuccess:SPEECH.itFailure,()=>setDialogueFinished(true),'it');
  };
  const finish=()=>{setCallVisible(false);setStage('ending')};
  const reset=()=>{
    clearTimers();audio.stopRing();audio.stopSpeech();setSession(v=>v+1);setStage('ready');setNear('');setDialogueFinished(false);setLaptopOpen(false);setCallVisible(false);setItType('');setResult('');setSelectedFiles([]);setElapsed(0);setShowControls(true);
  };
  const interact=(item)=>{
    if((stageRef.current==='ringing'||stageRef.current==='itRing')&&item==='phone')return stageRef.current==='ringing'?answer():answerIT();
    if(stageRef.current==='explore'&&item==='laptop')return openLaptop();
  };
  useEffect(()=>{const onKey=e=>{
    if(e.key==='Escape'&&laptopOpen&&stageRef.current==='laptop'){setLaptopOpen(false);setStage('explore')}
  };window.addEventListener('keydown',onKey);return ()=>window.removeEventListener('keydown',onKey)},[laptopOpen]);
  useEffect(()=>{const id=setInterval(()=>{if(stageRef.current!=='ready'&&stageRef.current!=='ending')setElapsed(v=>v+1)},1000);return ()=>clearInterval(id)},[]);
  useEffect(()=>()=>clearTimers(),[]);
  const playable=['intro','ringing','waiting','explore','itRing'].includes(stage);
  const nearPhone=near==='phone',nearLaptop=near==='laptop';
  return <div className="level-app">
    <Canvas className="three-canvas" shadows dpr={[1,1.75]} camera={{fov:72,position:[0,1.68,3.15],near:.08,far:50}} gl={{antialias:true}}>
      <Office ringing={stage==='ringing'||(stage==='itRing'&&callVisible)} near={near} onInteract={()=>interact('phone')}/>
      <Controller key={'controller-'+session} enabled={playable&&!callVisible&&!laptopOpen} onNearChange={setNear} onInteract={interact}/>
    </Canvas>
    <div className="film-grain"/>
    <header className="mission-hud"><button onClick={scrollBack} className="hud-back"><ArrowLeft size={18}/> MAIN MENU</button><div className="hud-center"><Shield size={17}/> THE HUMAN FIREWALL <span>/ MISSION 001 / FOUNDATION</span></div><button className="hud-sound" onClick={audio.toggleMute}>{audio.muted?<VolumeX size={19}/>:<Volume2 size={19}/>} {audio.muted?'MUTED':'SOUND ON'}</button></header>
    <div className="mission-progress"><span className="progress-kicker">01 / VOICE CLONING</span><strong>THE URGENT CALL</strong><span>{stage==='ready'?'AWAITING DEPLOYMENT':stage==='ringing'||stage==='waiting'?'INCOMING CONTACT':stage==='call'||stage==='outro'?'VERIFYING IDENTITY':stage==='explore'||stage==='laptop'?'INVESTIGATE THE REQUEST':stage==='itRing'||stage==='itCall'?'SECURITY FOLLOW-UP':'MISSION COMPLETE'}</span></div>
    {playable&&!callVisible&&<div className="reticle">+</div>}
    {stage==='explore'&&<div className="objective"><span>NEW OBJECTIVE</span><strong>Investigate the manager's request</strong><small>Open the laptop. Review the files and verify the destination address before taking action.</small></div>}
    {stage==='ringing'&&<div className="objective"><span>INCOMING CALL</span><strong>Your manager is calling</strong><small>Approach the phone and press E. The call will ring again if unanswered.</small></div>}
    {stage==='itRing'&&<div className="objective"><span>SECURITY ALERT</span><strong>IT Security is calling</strong><small>Approach the desk phone and press E to answer.</small></div>}
    {playable&&!callVisible&&nearPhone&&(stage==='ringing'||(stage==='itRing'&&callVisible))&&<div className="interaction"><span>E</span> ANSWER PHONE</div>}
    {playable&&!callVisible&&nearLaptop&&stage==='explore'&&<button className="interaction interaction-button" onClick={openLaptop}><span>E</span> OPEN LAPTOP</button>}
    {stage==='explore'&&!nearLaptop&&<div className="bottom-controls">W A S D — MOVE <i/> DRAG MOUSE — LOOK <i/> SHIFT — WALK FASTER <i/> E — INTERACT</div>}
    {stage==='intro'&&<div className="cinematic-title"><span>MISSION 001 / FOUNDATION</span><h1>THE URGENT <em>CALL</em></h1><p>Your office. Your decisions. Your consequences.</p></div>}
    {stage==='ready'&&<div className="start-screen"><div className="intro-content"><div className="intro-kicker"><span>✦</span> LEVEL 01 / FOUNDATION</div><h1>THE URGENT<br/><em>CALL.</em></h1><p>A familiar voice. An urgent request. Confidential information on the line. Will you recognize the threat?</p><div className="mission-mini-tags"><span><MapPin size={14}/> 3D OFFICE</span><span><Headphones size={14}/> VOICE IMPERSONATION</span><span><Shield size={14}/> DECISION GAME</span></div><button className="start-button" onClick={start}><Play size={21} fill="currentColor"/> ENTER THE OFFICE <ArrowRight size={19}/></button><div className="start-help">Use WASD to walk, drag your mouse to look, and press E to interact. Click Start to enable audio.</div></div></div>}
    {callVisible&&['ringing','call','outro','itRing','itCall'].includes(stage)&&<div className="phone-ui"><div className="phone-glass"><div className="phone-speaker"/><div className="phone-time">ASTERA CORPORATE PHONE</div><div className="caller-avatar">{stage.startsWith('it')?'IT':'DM'}</div><div className="caller-name">{stage.startsWith('it')?'IT SECURITY':'DAVID MORGAN'}</div><div className="caller-role">{stage.startsWith('it')?'SECURITY OPERATIONS':'OPERATIONS MANAGER'}</div><div className="call-label">{stage==='ringing'||stage==='itRing'?'INCOMING CALL':stage==='call'||stage==='itCall'?'CALL IN PROGRESS':'CALL ENDING'}<div className="call-waves">{Array.from({length:10},(_,i)=><i key={i} style={{height:7+Math.abs(Math.sin(i*1.5))*18}}/>)}</div></div>
      {(stage==='ringing'||stage==='itRing')&&<div className="phone-actions">{stage==='ringing'&&<button className="decline" onClick={decline}><PhoneOff size={20}/> DECLINE</button>}<button className="answer" onClick={stage==='ringing'?answer:answerIT}><Phone size={20}/> ANSWER</button></div>}
      {stage==='call'&&<><p className="call-transcript">“I need you to send the confidential payroll files right away. My work mailbox isn't syncing...”</p>{dialogueFinished?<div className="responses"><p>HOW DO YOU RESPOND?</p><button onClick={()=>respond('okay')}>OKAY, I'LL HANDLE IT <ChevronRight size={16}/></button><button onClick={()=>respond('unsure')}>I'M NOT SURE ABOUT THIS <ChevronRight size={16}/></button></div>:<p className="speaking">MANAGER SPEAKING — LISTEN TO THE FULL MESSAGE</p>}</>}
      {stage==='outro'&&<p className="speaking">LISTENING TO MANAGER'S REPLY...</p>}
      {stage==='itCall'&&<><p className="call-transcript">{itType==='failure'?'IT Security detected an unauthorized transfer of confidential files.':'IT Security is reviewing your response to the suspicious request.'}</p>{dialogueFinished?<button className="finish-call" onClick={finish}>END CALL & VIEW OUTCOME <ArrowRight size={17}/></button>:<p className="speaking">IT SECURITY SPEAKING — LISTEN TO THE FULL MESSAGE</p>}</>}
      </div><div className="phone-help">Simulation voice is generated by your browser. No real phone call is made.</div></div>}
    {laptopOpen&&stage==='laptop'&&<LaptopDesktop onSend={sendFiles} onVerify={verify} onReport={verify} onClose={()=>{setLaptopOpen(false);setStage('explore')}}/>}
    {stage==='ending'&&<div className={'ending-screen '+(result==='success'?'success':'failure')}><div className="ending-panel">{result==='success'?<ShieldCheck size={66}/>:<ShieldAlert size={66}/>}<span className="ending-kicker">MISSION 001 / FOUNDATION / {result==='success'?'PASSED':'FAILED'}</span><h1>{result==='success'?'THREAT':'SECURITY'}<br/><em>{result==='success'?'DEFEATED.':'BREACH.'}</em></h1><p>{result==='success'?'You verified the sender through an official channel and protected company information. The suspicious call was an AI voice impersonation exercise.':'You sent sensitive payroll files to an unverified external address. In this fictional training outcome, your access has been suspended and your employment has been terminated.'}</p><div className="result-box"><strong>{result==='success'?'SECURITY AWARENESS: EXCELLENT':'SIMULATED TERMINATION NOTICE'}</strong><span>{result==='success'?'+100 POINTS • COMPANY DATA PROTECTED':'CONFIDENTIAL DATA EXFILTRATION • POLICY VIOLATION'}</span></div><div className="lesson"><b>KEY LESSON</b><span>A familiar voice is not identity verification. Always use an independently verified channel before sharing sensitive files.</span></div><div className="ending-buttons"><button onClick={reset}><RotateCcw size={17}/> REPLAY LEVEL</button><button onClick={scrollBack}><ArrowLeft size={17}/> RETURN TO MENU</button></div></div></div>}
    {stage!=='ready'&&stage!=='ending'&&<div className="time-label">SIMULATED SESSION • {String(Math.floor(elapsed/60)).padStart(2,'0')}:{String(elapsed%60).padStart(2,'0')}</div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
