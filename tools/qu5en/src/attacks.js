// QU5EN's test suite. Every experiment is a SOUL mode, a quiz and a minigame at once: where you stand, ride, aim
// or dash is your answer, and the wrong answers are where the round hurts. Her hazards are her own:
// her vector fighter, her boot stomps, her laser cursors, her exploding heads, a comment section.
// Act 1 runs six single-mode experiments; Act 2 (the Double-Blind Trials) runs six that each combine two of them,
// and shuffles some answers as you go. Between experiments she challenges Seth to bouts in her arcade cabinet.
const box=(w,h,y=null)=>({x:320-w/2,y:y??(388-h),w,h});
const R=(id,name,mode,arena,duration,quiz,souls,extra={})=>({id,name,mode,arena,duration,quiz,souls,...extra});
// souls: what the round asks of Seth, one chip per SOUL mode (colour, controls, short label). Shown on the round's title card
// and beside the TIME counter all round, so a combined round says plainly what both halves want.
// The bouts are DELTARUNE's arcade punch-out: Seth's fighter below hers, moving freely, punching up into her. She flashes
// white on the beats of each tell, then stomps where he stood (step aside), rolls wheels at head height (duck) or drops
// a HIT IT target (punch it). hp is her QU5EN HP; tell is in beats; combo is the most attacks in a row.
const BOUTS=[
 {n:1,hp:60,tell:2,combo:1,moves:['stomp','stomp','hitit'],duration:20},
 {n:2,hp:60,tell:2,combo:2,moves:['stomp','wheels','hitit'],duration:22},
 {n:3,hp:70,tell:1.5,combo:2,moves:['stomp','wheels','hitit'],duration:24},
 {n:4,hp:70,tell:1.5,combo:3,moves:['stomp','stomp','wheels','hitit'],duration:24},
 {n:5,hp:100,tell:1.5,combo:3,moves:['stomp','stomp','wheels','hitit'],duration:34,final:true}
];
const PUNCH=[['white','LEFT / RIGHT MOVE · Z PUNCHES (STAND UNDER HER) · DOWN DUCKS','MOVE · PUNCH · DUCK']];
const arena=box(600,368,18);
const bouts=BOUTS.map(b=>R(b.final?'final':'bout'+b.n,b.final?'FINAL ROUND: FIGHT!':`ROUND ${b.n}: FIGHT!`,'arcade',arena,b.duration,null,PUNCH,{bout:b,final:!!b.final}));
const ROUNDS={
 cycle:[
  R('hereis','HERE IS QU5EN','red',box(420,180),14,{at:10,max:4},[['purple','MOVE · STAND IN YOUR ANSWER AT TIME','IN YOUR ANSWER']]),
  R('gravity','GRAVITY TEST','blue',box(400,190),16,{at:11,max:3},[['blue','UP JUMPS · LAND ON YOUR ANSWER','UP JUMPS']]),
  R('ring','RING TOSS','cyan',box(260,190),15,{at:11,max:4},[['cyan','RIDE THE RING · Z TURNS BACK · BE IN YOUR ANSWER','RIDE THE RING']]),
  R('gallery','SHOOTING GALLERY','yellow',box(400,190),15,{at:12.5,max:4,instant:true},[['yellow','Z SHOOTS · SHOOT YOUR ANSWER','Z SHOOTS']]),
  R('egg','GUARD THE EGG','green',box(190,190),15,{at:11,max:4},[['green','ARROW KEYS TURN THE SHIELD · FACE YOUR ANSWER','FACE YOUR ANSWER']]),
  R('comments','COMMENT SECTION','orange',box(420,180),16,{at:13.5,max:4,instant:true},[['orange','KEEP MOVING · Z DASHES THROUGH YOUR ANSWER','Z DASHES']])
 ],
 // Act 2: two experiments at once.
 remix:[
  R('freefall','TARGET PRACTICE IN FREEFALL','blue',box(400,190),16,{at:13.5,max:4,instant:true},[['blue','UP JUMPS · STAY OUT OF THE ACID','UP JUMPS'],['yellow','Z SHOOTS · SHOOT YOUR ANSWER','Z SHOOTS']],{shoot:true,heart:['blue','yellow']}),
  R('stomp','RING STOMP','cyan',box(260,190),15,{at:11,max:4},[['cyan','RIDE THE RING · Z TURNS BACK','RIDE THE RING'],['white','HER BOOTS STOMP · BE IN YOUR ANSWER','BOOTS']]),
  R('feed','COMMENTS ON A STRING','strings',box(420,190),16,{at:13.5,max:3,instant:true},[['purple','UP / DOWN SWITCH STRINGS','UP/DOWN STRINGS'],['orange','KEEP MOVING · Z DASHES THROUGH YOUR ANSWER','Z DASHES']],{dash:true,heart:['purple','orange']}),
  R('roulette','EGG ROULETTE','green',box(190,190),15,{at:11,max:4},[['green','FACE YOUR ANSWER AT TIME','FACE YOUR ANSWER'],['white','THE ANSWERS SWAP SIDES, THEN STOP','SWAPS']],{swap:true}),
  R('shuffle','THE SHUFFLE','red',box(420,180),15,{at:11,max:4},[['purple','STAND IN YOUR ANSWER AT TIME','IN YOUR ANSWER'],['white','THE COLUMNS SHUFFLE, THEN STOP','SHUFFLES']],{swap:true}),
  R('shooter','STRING SHOOTER','strings',box(420,190),15,{at:12.5,max:4,instant:true},[['purple','UP / DOWN SWITCH STRINGS','UP/DOWN STRINGS'],['yellow','Z SHOOTS · SHOOT YOUR ANSWER','Z SHOOTS']],{shoot:true,heart:['purple','yellow']})
 ],
 bout:n=>bouts[Math.min(n,BOUTS.length-1)-1],
 final:bouts[BOUTS.length-1],
 scan:R('scan','THE FINAL SCAN','strings',box(420,190),20,null,[['purple','UP / DOWN SWITCH STRINGS · LEFT / RIGHT MOVE','UP/DOWN STRINGS']])
};
const SPAM=['lol','POG','first','W','based','ratio','lmao','???','GG','L','real','kino','clip it','F','omg'];

function buildRound(g,r){
 const a=r.arena,cx=a.x+a.w/2,cy=a.y+a.h/2,R=()=>g.random(),sp=()=>g.cfg.speed;
 const every=(s,e,i,f)=>g.every(s,e,i,f),at=(t,f)=>g.at(t,f);g.acid=null;
 // Timed to the music: whatever a hazard does, it does on a beat. untilBeat(n) is the time to the first whole beat
 // at least n beats away: heads burst on it, boots land on it, lasers fire on it, messages reach the shield on it.
 const B=g.beat,untilBeat=n=>(Math.ceil(g.beatPos+n)-g.beatPos)*B;
 // Her exploding heads: they form, laugh, and burst into small spinning heads.
 const head=(x,y,n=6,speed=110)=>{const pop=untilBeat(2.5);g.spawn({kind:'head',x,y,r:10,form:pop-B,pop,n,speed});};
 const boot=(x,bw,warn=true)=>g.spawn({kind:'boot',x,w:bw,h:34,y:warn?a.y+4:a.y+a.h-4,floor:a.y+a.h-4,phase:warn?'warn':'stay',t:0,warn:warn?untilBeat(1.6)-(a.h-38)/900:0,stay:warn?.3:.45});
 const laser=(tx,ty)=>{const from=[[a.x-60,a.y-40],[a.x+a.w+60,a.y-40],[a.x-60,a.y+a.h+20],[a.x+a.w+60,a.y+a.h+20]][Math.floor(R()*4)],an=Math.atan2(ty-from[1],tx-from[0]);g.spawn({kind:'beam',x:tx,y:ty,fx:from[0],fy:from[1],angle:an,w:12,warn:untilBeat(1.6),live:.25});};
 const q=g.quiz,n=q?q.answers.length:0;
 // ---- the pieces each experiment is built from
 const fighters=(start,end,interval)=>every(start,end,interval,i=>{const left=i%2===0;g.spawn({kind:'fighter',x:left?a.x-30:a.x+a.w+30,y:a.y+a.h-58,w:30,h:100,vx:(left?1:-1)*72*sp(),dir:left?1:-1});});
 const stompWrongColumns=()=>{r.resolve=(g)=>{const cw=a.w/n;for(let k=0;k<n;k++)if(!g.quiz.answers[g.quiz.slots[k]].correct)boot(a.x+cw*k+cw/2,cw-8,false);g.emit('stomp');};};
 const ringAim=()=>{const r0=Math.min(a.w,a.h)*.38,t=g.orbitTheta+g.orbitSign*.4*2.2*.9;laser(cx+Math.cos(t)*r0,cy+Math.sin(t)*r0);};
 const fireWrongSectors=()=>{r.resolve=(g)=>{const s=Math.PI*2/n;for(let k=0;k<n;k++)if(!g.quiz.answers[k].correct)g.spawn({kind:'sector',t0:k*s,t1:(k+1)*s,warn:0,live:.45});g.emit('stomp');};};
 const targets=(t,y)=>at(t,()=>{for(let k=0;k<n;k++)g.spawn({kind:'target',x:a.x+40+(a.w-80)*(k+.5)/n,y:y+(k%2)*24,y0:y+(k%2)*24,vx:(k%2?-1:1)*(45+R()*25)*sp(),r:17,ans:k,p:k});});
 const burstWrongTargets=()=>{r.resolve=(g,ok)=>{for(const b of g.bullets)if(b.kind==='target'){b.gone=true;if(!ok)g.burst(b.x,b.y,6,95);}};};
 const packets=(start,end,quiet)=>{every(start,end,.62,()=>{if(g.attackTime>quiet[0]&&g.attackTime<quiet[1])return;const side=['up','right','down','left'][Math.floor(R()*4)];g.spawn({kind:'packet',side,dist:a.w/2+34,speed:(a.w/2+4)/untilBeat(1.6),x:cx,y:cy});});};
 const zapIfWrong=()=>{r.resolve=(g,ok)=>{if(!ok){g.effects.push({type:'zap',life:.4});g.invulnerability=0;g.hurt();}};};
 const bubbles=(lanes,spamEvery,answersEvery,end)=>{
  every(.3,end,spamEvery,()=>{const left=R()<.5,y=lanes[Math.floor(R()*lanes.length)];g.spawn({kind:'bubble',x:left?a.x-40:a.x+a.w+40,y,vx:(left?1:-1)*(105+R()*45)*sp(),w:60,h:20,label:SPAM[Math.floor(R()*SPAM.length)],ans:-1});});
  every(1.5,end-2.5,answersEvery,i=>{if(g.quiz.resolved)return;const order=lanes.map((l,k)=>k).sort(()=>R()-.5);for(let k=0;k<n;k++){const left=(i+k)%2===0;g.spawn({kind:'bubble',x:left?a.x-70-k*30:a.x+a.w+70+k*30,y:lanes[order[k%lanes.length]],vx:(left?1:-1)*68*sp(),w:120,h:22,label:g.quiz.answers[k].text,ans:k});}});
  r.resolve=(g,ok)=>{for(const b of g.bullets)if(b.kind==='bubble'&&b.ans>=0){b.gone=true;if(!ok)g.burst(b.x,b.y,5,90);}};
 };
 const shuffles=()=>{for(let t=2;t<q.at-3.5*B;t+=2*B)at(t,()=>g.shuffle());at(q.at-3.5*B,()=>g.cue('NO MORE SHUFFLING'));};
 switch(r.id){
  // ---------------------------------------------------------------- Act 1
  case 'hereis':
   // Her fighter strolls through, punching on the beat; heads go off; at TIME, her boot stomps every wrong column.
   fighters(.5,13,4);every(1,9.4,1.9,()=>head(a.x+40+R()*(a.w-80),a.y+30+R()*(a.h*.5)));every(10.6,13.5,1.4,()=>head(a.x+40+R()*(a.w-80),a.y+30+R()*(a.h*.5)));
   stompWrongColumns();break;
  case 'gravity':
   // Answer platforms over rising acid; side ledges to jump from; boots stomp; heads rain.
   at(0,()=>{const pw=Math.min(96,(a.w-40)/n-18);for(let k=0;k<n;k++)g.platforms.push({x:a.x+20+(a.w-40)*(k+.5)/n-pw/2,y:a.y+a.h*.62,w:pw,ans:k});g.platforms.push({x:a.x+8,y:a.y+a.h*.34,w:56,ans:-1},{x:a.x+a.w-64,y:a.y+a.h*.34,w:56,ans:-1});g.acid={top:a.y+a.h-14,limit:a.y+a.h-38,rise:2.5};});
   every(1.4,10.4,2.3,()=>boot(a.x+30+R()*(a.w-60),44));every(.8,15.5,1.3,()=>g.spawn({kind:'mini',x:a.x+14+R()*(a.w-28),y:a.y+6,vx:0,vy:80*sp(),r:5,life:4,spin:3}));
   r.resolve=(g)=>{for(const p of g.platforms)if(p.ans>=0&&!g.quiz.answers[p.ans].correct)p.crumble=true;if(g.acid)g.acid.rise=7;g.emit('stomp');};
   break;
  case 'ring':
   // Her laser cursors aim ahead of you on the ring; at TIME, every wrong sector of the ring is fired on.
   every(.7,10.6,1.45,ringAim);every(11.6,14.6,1.1,ringAim);every(2,14,3.2,()=>head(cx,cy,8,90));fireWrongSectors();break;
  case 'gallery':
   // Her heads carry the answers across the top of the box: shoot yours. Shoot the wrong one and the rest burst.
   targets(.5,a.y+34);every(.9,14.6,1.4,()=>head(a.x+40+R()*(a.w-80),a.y+a.h*.42,7,100));burstWrongTargets();break;
  case 'egg':
   // Messages fly at the egg from every side; the shield blocks the side it faces. At TIME, face your answer.
   // Nothing flies in the second before TIME, so there is a moment to turn to your answer.
   packets(.5,14.6,[9.4,11.3]);every(6,14.6,1.6,()=>{if(g.attackTime>9.4&&g.attackTime<11.3)return;const side=['up','right','down','left'][Math.floor(R()*4)];g.spawn({kind:'packet',side,dist:a.w/2+60,speed:(a.w/2+30)/untilBeat(2.1),x:cx,y:cy});});
   zapIfWrong();break;
  case 'comments':
   // Spam scrolls through in lanes and hurts to touch; the answers scroll too. Dash through yours.
   bubbles([0,1,2,3].map(k=>a.y+24+(a.h-48)*k/3),.75,3.6,15.6);break;
  // ---------------------------------------------------------------- Act 2: the Double-Blind Trials
  case 'freefall':
   // Blue + yellow: jump between ledges over the acid and shoot your answer out of the air.
   at(0,()=>{g.platforms.push({x:a.x+16,y:a.y+a.h*.74,w:110,ans:-1},{x:a.x+a.w*.5-55,y:a.y+a.h*.6,w:110,ans:-1},{x:a.x+a.w-126,y:a.y+a.h*.74,w:110,ans:-1},{x:a.x+a.w*.25-40,y:a.y+a.h*.46,w:80,ans:-1},{x:a.x+a.w*.75-40,y:a.y+a.h*.46,w:80,ans:-1});g.acid={top:a.y+a.h-12,limit:a.y+a.h-22,rise:1};});
   targets(.5,a.y+26);every(.8,15.5,1.9,()=>g.spawn({kind:'mini',x:a.x+14+R()*(a.w-28),y:a.y+60,vx:0,vy:70*sp(),r:5,life:4,spin:3}));every(2,15,4,()=>boot(a.x+40+R()*(a.w-80),40));
   burstWrongTargets();break;
  case 'stomp':
   // Cyan + her boots: the ring passes under her stomps; at TIME the wrong sectors are fired on.
   every(.8,14.6,1.85,()=>boot(a.x+24+R()*(a.w-48),34));every(2.4,14,2.8,ringAim);every(3,13,4,()=>head(cx,cy,6,85));fireWrongSectors();break;
  case 'feed':
   // Strings + orange: the comment section scrolls along Seth's strings. Switch lanes, keep moving, dash through yours.
   bubbles(g.strings,.7,3.4,15.6);break;
  case 'roulette':
   // Green with a twist: the answers change sides on the beat until just before TIME.
   packets(.5,14.6,[9.6,11.3]);shuffles();zapIfWrong();break;
  case 'shuffle':
   // The columns shuffle on the beat; her fighter strolls through; her laser screens track you.
   fighters(1,14,4.2);every(1.5,9.5,2.2,()=>laser(g.soul.x,g.soul.y));every(11.5,14.5,1.4,()=>laser(g.soul.x,g.soul.y));shuffles();stompWrongColumns();break;
  case 'shooter':
   // Strings + yellow: shoot your answer from Seth's strings while her heads ride them.
   targets(.5,a.y+22);every(.6,14.6,1.1,()=>{const k=Math.floor(R()*3),left=R()<.5;g.spawn({kind:'mini',x:left?a.x-10:a.x+a.w+10,y:g.strings[k],vx:(left?1:-1)*140*sp(),r:6,life:5,spin:5});});
   burstWrongTargets();break;
  case 'scan':
   // The final scan sweeps the strings while her heads ride them. The last question has no wrong answer.
   g.quiz={q:'Are You The Red SOUL?',answers:[{text:'YES',correct:true},{text:'NO',correct:true},{text:'EGG',correct:true}],crossed:-1,shown:false,resolved:false,chosen:-1,at:15,slots:[0,1,2]};
   every(.4,19,1,()=>{const k=Math.floor(R()*3),left=R()<.5;g.spawn({kind:'mini',x:left?a.x-10:a.x+a.w+10,y:g.strings[k],vx:(left?1:-1)*150*sp(),r:6,life:5,spin:5});});
   every(2,18,2.8,()=>head(a.x+50+R()*(a.w-100),cy,6,95));
   r.resolve=()=>{};break;
 }
}
Object.assign(exports,{ROUNDS,BOUTS,buildRound});
