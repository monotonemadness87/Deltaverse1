// QU5EN's test suite. Every round is a SOUL mode, a quiz and a minigame at once: where you stand, ride, aim
// or dash is your answer, and the wrong answers are where the round hurts. Her hazards are her own:
// her vector fighter, her boot stomps, her laser cursors, her exploding heads, a comment section.
const box=(w,h,y=null)=>({x:320-w/2,y:y??(388-h),w,h});
const R=(id,name,mode,arena,duration,quiz,cue)=>({id,name,mode,arena,duration,quiz,cue});
const ROUNDS={
 cycle:[
  R('hereis','HERE IS QU5EN','red',box(420,180),14,{at:10,max:4},'STAND IN YOUR ANSWER WHEN TIME RUNS OUT'),
  R('gravity','GRAVITY TEST','blue',box(400,190),16,{at:11,max:3},'BLUE: ↑ JUMP · STAND ON YOUR ANSWER'),
  R('ring','RING TOSS','cyan',box(260,190),15,{at:11,max:4},'CYAN: RIDE THE RING · Z TURNS BACK'),
  R('gallery','SHOOTING GALLERY','yellow',box(400,190),15,{at:12.5,max:4,instant:true},'YELLOW: Z SHOOTS · SHOOT YOUR ANSWER'),
  R('egg','GUARD THE EGG','green',box(190,190),15,{at:11,max:4},'GREEN: ARROWS TURN THE SHIELD · FACE YOUR ANSWER'),
  R('comments','COMMENT SECTION','orange',box(420,180),16,{at:13.5,max:4,instant:true},'ORANGE: KEEP MOVING · Z DASH THROUGH YOUR ANSWER')
 ],
 arcade:R('arcade','ROUND 2: FIGHT!','arcade',box(520,190),26,null,'↑ JUMP HER LOW KICK · ↓ DUCK HER HIGH PUNCH · Z PUNCH WHEN SHE MISSES'),
 scan:R('scan','THE FINAL SCAN','strings',box(420,190),20,null,'STRINGS: ↑↓ SWITCH · ←→ MOVE')
};
const SPAM=['lol','POG','first','W','based','ratio','lmao','???','GG','L','real','kino','clip it','F','omg'];

function buildRound(g,r){
 const a=r.arena,cx=a.x+a.w/2,cy=a.y+a.h/2,R=()=>g.random(),sp=()=>g.cfg.speed;
 const every=(s,e,i,f)=>g.every(s,e,i,f),at=(t,f)=>g.at(t,f);g.acid=null;
 // Each mode explains itself the first time it appears.
 if(!g.told.has(r.mode)){g.told.add(r.mode);at(0,()=>g.cue(r.cue));}
 // Her exploding heads: they form, laugh, and burst into small spinning heads.
 // Timed to the music: whatever a hazard does, it does on a beat. untilBeat(n) is the time to the first whole beat
 // at least n beats away: heads burst on it, boots land on it, lasers fire on it, messages reach the shield on it.
 const B=g.beat,untilBeat=n=>(Math.ceil(g.beatPos+n)-g.beatPos)*B;
 const head=(x,y,n=6,speed=110)=>{const pop=untilBeat(2.5);g.spawn({kind:'head',x,y,r:10,form:pop-B,pop,n,speed});};
 const boot=(x,bw,warn=true)=>g.spawn({kind:'boot',x,w:bw,h:34,y:warn?a.y+4:a.y+a.h-4,floor:a.y+a.h-4,phase:warn?'warn':'stay',t:0,warn:warn?untilBeat(1.6)-(a.h-38)/900:0,stay:warn?.3:.45});
 const laser=(tx,ty)=>{const from=[[a.x-60,a.y-40],[a.x+a.w+60,a.y-40],[a.x-60,a.y+a.h+20],[a.x+a.w+60,a.y+a.h+20]][Math.floor(R()*4)],an=Math.atan2(ty-from[1],tx-from[0]);g.spawn({kind:'beam',x:tx,y:ty,fx:from[0],fy:from[1],angle:an,w:12,warn:untilBeat(1.6),live:.25});};
 const q=g.quiz,n=q?q.answers.length:0;
 switch(r.id){
  case 'hereis':
   // Her fighter strolls through, punching every second or so; heads go off; at TIME, her boot stomps every wrong column.
   every(.5,13,4,i=>{const left=i%2===0;g.spawn({kind:'fighter',x:left?a.x-30:a.x+a.w+30,y:a.y+a.h-58,w:30,h:100,vx:(left?1:-1)*72*sp(),dir:left?1:-1});});
   every(1,9.4,1.9,()=>head(a.x+40+R()*(a.w-80),a.y+30+R()*(a.h*.5)));every(10.6,13.5,1.4,()=>head(a.x+40+R()*(a.w-80),a.y+30+R()*(a.h*.5)));
   r.resolve=(g,ok,i)=>{const cw=a.w/n;for(let k=0;k<n;k++)if(!g.quiz.answers[k].correct)boot(a.x+cw*k+cw/2,cw-8,false);g.emit('stomp');};
   break;
  case 'gravity':
   // Answer platforms over rising acid; side ledges to jump from; boots stomp; heads rain.
   at(0,()=>{const pw=Math.min(96,(a.w-40)/n-18);for(let k=0;k<n;k++)g.platforms.push({x:a.x+20+(a.w-40)*(k+.5)/n-pw/2,y:a.y+a.h*.62,w:pw,ans:k});g.platforms.push({x:a.x+8,y:a.y+a.h*.34,w:56,ans:-1},{x:a.x+a.w-64,y:a.y+a.h*.34,w:56,ans:-1});g.acid={top:a.y+a.h-14,limit:a.y+a.h-38,rise:2.5};});
   every(1.4,10.4,2.3,()=>boot(a.x+30+R()*(a.w-60),44));every(.8,15.5,1.3,()=>g.spawn({kind:'mini',x:a.x+14+R()*(a.w-28),y:a.y+6,vx:0,vy:80*sp(),r:5,life:4,spin:3}));
   r.resolve=(g)=>{for(const p of g.platforms)if(p.ans>=0&&!g.quiz.answers[p.ans].correct)p.crumble=true;if(g.acid)g.acid.rise=7;g.emit('stomp');};
   break;
  case 'ring':
   // Her laser cursors aim ahead of you on the ring; at TIME, every wrong sector of the ring is fired on.
   every(.7,10.6,1.45,()=>{const r0=Math.min(a.w,a.h)*.38,t=g.orbitTheta+g.orbitSign*.4*2.2*.9;laser(cx+Math.cos(t)*r0,cy+Math.sin(t)*r0);});
   every(11.6,14.6,1.1,()=>{const r0=Math.min(a.w,a.h)*.38,t=g.orbitTheta+g.orbitSign*.4*2.2*.9;laser(cx+Math.cos(t)*r0,cy+Math.sin(t)*r0);});
   every(2,14,3.2,()=>head(cx,cy,8,90));
   r.resolve=(g)=>{const s=Math.PI*2/n;for(let k=0;k<n;k++)if(!g.quiz.answers[k].correct)g.spawn({kind:'sector',t0:k*s,t1:(k+1)*s,warn:0,live:.45});g.emit('stomp');};
   break;
  case 'gallery':
   // Her heads carry the answers across the top of the box: shoot yours. Shoot the wrong one and the rest burst.
   at(.5,()=>{for(let k=0;k<n;k++)g.spawn({kind:'target',x:a.x+40+(a.w-80)*(k+.5)/n,y:a.y+34+(k%2)*30,y0:a.y+34+(k%2)*30,vx:(k%2?-1:1)*(45+R()*25)*sp(),r:17,ans:k,p:k});});
   every(.9,14.6,1.4,()=>head(a.x+40+R()*(a.w-80),a.y+a.h*.42,7,100));
   r.resolve=(g,ok)=>{for(const b of g.bullets)if(b.kind==='target'){b.gone=true;if(!ok)g.burst(b.x,b.y,6,95);}};
   break;
  case 'egg':
   // Messages fly at the egg from every side; the shield blocks the side it faces. At TIME, face your answer.
   // Nothing flies in the second before TIME, so there is a moment to turn to your answer.
   every(.5,14.6,.62,i=>{if(g.attackTime>9.4&&g.attackTime<11.3)return;const side=['up','right','down','left'][Math.floor(R()*4)];g.spawn({kind:'packet',side,dist:a.w/2+34,speed:(a.w/2+4)/untilBeat(1.6),x:cx,y:cy});});
   every(6,14.6,1.6,()=>{if(g.attackTime>9.4&&g.attackTime<11.3)return;const side=['up','right','down','left'][Math.floor(R()*4)];g.spawn({kind:'packet',side,dist:a.w/2+60,speed:(a.w/2+30)/untilBeat(2.1),x:cx,y:cy});});
   r.resolve=(g,ok)=>{if(!ok){g.effects.push({type:'zap',life:.4});g.invulnerability=0;g.hurt();}};
   break;
  case 'comments':
   // Spam scrolls through in lanes and hurts to touch; the answers scroll too. Dash through yours.
   const lanes=[0,1,2,3].map(k=>a.y+24+(a.h-48)*k/3);
   every(.3,15.6,.75,i=>{const left=R()<.5,y=lanes[Math.floor(R()*4)];g.spawn({kind:'bubble',x:left?a.x-40:a.x+a.w+40,y,vx:(left?1:-1)*(105+R()*45)*sp(),w:60,h:20,label:SPAM[Math.floor(R()*SPAM.length)],ans:-1});});
   every(1.5,13,3.6,i=>{if(g.quiz.resolved)return;const order=[0,1,2,3].sort(()=>R()-.5);for(let k=0;k<n;k++){const left=(i+k)%2===0;g.spawn({kind:'bubble',x:left?a.x-70-k*30:a.x+a.w+70+k*30,y:lanes[order[k]],vx:(left?1:-1)*68*sp(),w:120,h:22,label:g.quiz.answers[k].text,ans:k});}});
   r.resolve=(g,ok)=>{for(const b of g.bullets)if(b.kind==='bubble'&&b.ans>=0){b.gone=true;if(!ok)g.burst(b.x,b.y,5,90);}};
   break;
  case 'arcade':
   break;
  case 'scan':
   // The final scan sweeps the strings while her heads ride them. The last question has no wrong answer.
   g.quiz={q:'Are You The Red SOUL?',answers:[{text:'YES',correct:true},{text:'NO',correct:true},{text:'EGG',correct:true}],crossed:-1,shown:false,resolved:false,chosen:-1,at:15};
   every(.4,19,1,i=>{const k=Math.floor(R()*3),left=R()<.5;g.spawn({kind:'mini',x:left?a.x-10:a.x+a.w+10,y:g.strings[k],vx:(left?1:-1)*150*sp(),r:6,life:5,spin:5});});
   every(2,18,2.8,()=>head(a.x+50+R()*(a.w-100),cy,6,95));
   r.resolve=()=>{};
   break;
 }
}
Object.assign(exports,{ROUNDS,buildRound});
