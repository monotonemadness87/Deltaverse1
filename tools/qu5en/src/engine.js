const S=require("story.js");
const {ROUNDS,buildRound}=require("attacks.js");
// QU5EN — fixed-step simulation, separate from Canvas presentation.
// Every round is a SOUL mode, a quiz and a minigame at once. Answers fill her DATA bar; at 70% she challenges
// Seth to her arcade cabinet, at 100% she runs the final scan, and the scan ends the fight.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const MENU_BOX={x:24,y:249,w:592,h:140};
const DIFF={gentle:{speed:.85,warn:1.25,damage:1},normal:{speed:1,warn:1.1,damage:2},hard:{speed:1.1,warn:1,damage:3}};
const ITEMS=()=>[{name:'GLAMBURGER',heal:27,count:2},{name:'STARFAIT',heal:14,count:3},{name:'LEGENDARY HERO',heal:40,count:1},{name:'EGG',heal:0,count:0}];
const DATA={correct:11,wrong:3,survive:2,hype:8,egg:12,strike:4,ko:25,draw:12};
const SIDES=['up','right','down','left'];
// The fight follows "QU5EN": 130.08 BPM, first beat 0.277 s into the track, kicks on beats 1 and 3 (measured from the file).
// song is the track's time (the page keeps it on the real audio while it plays); rounds start on a beat, hazards land on half-beats.
const MUSIC={bpm:130.08,first:.277},BEAT=60/MUSIC.bpm,HALF=BEAT/2;
const snap=(t,unit=HALF)=>Math.round(t/unit)*unit;
class BattleEngine{
 constructor(){this.settings={difficulty:'normal',invincible:false,skipIntro:false};this.reset();}
 reset(){
  this.scene='battle';this.state='intro';this.paused=false;this.clock=0;this.timer=0;this.intro=0;this.deathAge=0;this.checkpoint=null;
  this.lv=1;this.maxHP=30;this.hp=30;this.data=0;this.chassis=100;this.waves=0;this.turn=0;this.cycle=0;this.storyIdx=0;this.used=[];
  this.arcadeDone=false;this.scanDone=false;this.ready=false;this.hint=null;this.hype=0;this.calls=0;this.asked=0;this.hypes=0;this.strikes=0;this.spareTries=0;
  this.selected=0;this.option=0;this.items=ITEMS();this.pages=[];this.text='';this.displayChars=0;this.speaker='narrator';this.face='talk';this.next=null;
  this.arena={...MENU_BOX};this.targetArena={...MENU_BOX};this.bullets=[];this.timeline=[];this.effects=[];this.shots=[];this.platforms=[];
  this.soul={x:320,y:300};this.mode='red';this.round=null;this.quiz=null;this.invulnerability=0;this.shake=0;this.attackTime=0;this.duration=0;this.attackName='';
  this.boss={hurt:0,glitch:0,sad:false};this.ending='';this.seed=4441;this.told=new Set();this.song=this.song||0;this.beat=BEAT;
  this.emit('reset');if(this.settings.skipIntro)this.skipIntro();
 }
 emit(e){this.onEvent?.(e);}
 get beatPos(){return (this.song-MUSIC.first)/BEAT;}
 random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 config(){const d=DIFF[this.settings.difficulty]||DIFF.normal;return{speed:d.speed*(this.hype?1.12:1),warn:d.warn,damage:d.damage,cooldown:1};}
 // ------------------------------------------------------------ dialogue
 message(pages,next='menu'){this.pages=(Array.isArray(pages)?pages:[pages]).map(p=>typeof p==='string'?S.N(p):p);this.next=next;this.showPage();}
 showPage(){const p=this.pages.shift();if(!p){this.finishDialogue();return;}this.state='dialogue';this.text=p.text;this.speaker=p.speaker;this.face=p.face||'talk';this.displayChars=0;this.timer=0;if(/EGG\.$/.test(p.text)&&/gives you/.test(p.text))this.giveEgg();this.emit('text');}
 finishDialogue(){const n=this.next;this.next=null;if(n==='defend')this.startAttack();else if(n==='menu')this.toMenu();else{this.state=n;this.timer=0;this.emit('end');}}
 giveEgg(){const e=this.items.find(i=>i.name==='EGG');if(!e.count&&!this.eggGiven){e.count=1;this.eggGiven=true;this.emit('heal');}}
 skipIntro(){this.state='menu';this.message(S.INTRO,'menu');this.saveCheckpoint();}
 // ------------------------------------------------------------ menus
 options(){
  if(this.state==='act')return S.ACTS;
  if(this.state==='item')return this.items.filter(i=>i.count).map(i=>`${i.name} x${i.count}`);
  if(this.state==='mercy')return['SPARE','FLEE'];
  if(this.state==='target')return['QU5EN'];return[];
 }
 navigate(dx,dy){if(this.paused)return;if(this.state==='menu'){this.selected=(this.selected+(dx||dy)+4)%4;this.emit('select');return;}const n=this.options().length;if(!n)return;if(n>2){const row=Math.floor(this.option/2),col=this.option%2,c=dx?row*2+(1-col):(1-row)*2+col;if(c<n)this.option=c;}else this.option=(this.option+(dx||dy)+n)%n;this.emit('select');}
 back(){if(this.paused)return;if(this.state==='dead'){if(this.deathAge>=1.8)this.reset();return;}if(this.state==='dialogue'){this.displayChars=this.text.length;return;}if(this.options().length){this.state='menu';this.option=0;this.emit('select');}}
 chooseMenu(i){if(this.state!=='menu'||this.paused||!Number.isInteger(i)||i<0||i>3)return;this.selected=i;this.confirm();}
 togglePause(){if(['dead','spared','intro'].includes(this.state))return;this.paused=!this.paused;this.emit('pause');}
 confirm(){
  if(this.paused)return;
  if(this.state==='intro'){this.skipIntro();return;}
  if(this.state==='defend'){this.action();return;}
  if(this.state==='warning'){this.queued=.3;return;}
  if(this.state==='dialogue'){if(this.displayChars<this.text.length){this.displayChars=this.text.length;return;}if(this.pages.length)this.showPage();else this.finishDialogue();return;}
  if(this.state==='dead'){this.retry();return;}
  if(this.state==='spared'){if(this.timer>1.2)this.reset();return;}
  if(this.state==='menu'){this.state=['target','act','item','mercy'][this.selected];this.option=0;if(this.state==='item'&&!this.options().length)this.message('* Your pockets are empty.','menu');this.emit('select');return;}
  if(this.state==='target'){this.state='fight';this.timer=0;this.attackCursor=56;this.attackDir=1;this.emit('select');return;}
  if(this.state==='fight'){this.strike();return;}
  if(this.state==='act'){this.act(S.ACTS[this.option]);return;}
  if(this.state==='item'){const item=this.items.filter(i=>i.count)[this.option];if(!item)return;item.count--;
   if(item.name==='EGG'){this.addData(DATA.egg);this.message(S.EGG_USE,'defend');return;}
   const amount=Math.min(this.maxHP-this.hp,item.heal);this.hp+=amount;this.emit('heal');this.message([S.N(`* You eat the ${item.name}.\n* ${this.hp>=this.maxHP?'Your HP was maxed out.':'You recover '+amount+' HP.'}`)],'defend');return;}
  if(this.state==='mercy'){if(this.option===1){this.message(S.FLEE,'defend');return;}if(this.ready){this.spare();return;}this.message(S.SPARE_EARLY[Math.min(this.spareTries++,S.SPARE_EARLY.length-1)],'defend');return;}
 }
 // FIGHT is percussive maintenance: it can't end the fight, but a clean hit knocks the next answer loose.
 strike(){
  const acc=clamp(1-Math.abs(this.attackCursor-320)/264,0,1),dent=Math.round(8+20*acc);this.chassis=Math.max(1,this.chassis-dent);
  this.effects.push({type:'damage',text:String(dent),life:1.1,x:320,y:70});this.boss.hurt=.55;this.boss.glitch=.6;this.shake=.18;this.emit('attack');
  const good=acc>=.6,bank=good?S.STRIKE_GOOD:S.STRIKE_WEAK;if(good){this.hint='show';this.addData(DATA.strike);}
  this.message([S.Q(good?'talk':'smug',bank[this.strikes++%bank.length])],'defend');
 }
 act(name){
  if(name==='CHECK'){this.message(S.N(S.CHECK),'defend');return;}
  if(name==='ASK ABOUT HIM'){this.hint=this.hint==='show'?'show':'cross';this.message(S.ABOUT_HIM[Math.min(this.asked++,S.ABOUT_HIM.length-1)],'defend');return;}
  if(name==='HYPE CHAT'){this.addData(DATA.hype);this.hype=1;this.message(S.HYPE[this.hypes++%S.HYPE.length],'defend');return;}
  if(name==='CALL ALPHYS'){const i=Math.min(this.calls++,S.CALL.length-1);if(i===2)this.hint='show';this.message(S.CALL[i],'defend');return;}
 }
 addData(n){if(this.scanDone)return;this.data=Math.min(100,this.data+n);this.effects.push({type:'data',text:'DATA +'+n,life:1.2});}
 spare(){this.ending='spared';this.bullets=[];this.timeline=[];this.mode='red';this.setArena(MENU_BOX);this.message(S.SPARED,'spared');this.emit('spare');}
 // ------------------------------------------------------------ rounds
 toMenu(silent=false){
  this.state='menu';this.mode='red';this.bullets=[];this.timeline=[];this.shots=[];this.platforms=[];this.quiz=null;this.setArena(MENU_BOX);this.speaker='narrator';
  this.text=this.ready?S.FLAVOR_READY:S.FLAVOR[(this.turn*3)%S.FLAVOR.length];this.displayChars=this.text.length;if(!silent)this.emit('turn');
 }
 nextRound(){if(this.data>=100&&this.arcadeDone&&!this.scanDone)return ROUNDS.scan;if(this.data>=70&&!this.arcadeDone&&this.cycle>=ROUNDS.cycle.length)return ROUNDS.arcade;if(this.scanDone)return ROUNDS.cycle[this.cycle%ROUNDS.cycle.length];return ROUNDS.cycle[this.cycle%ROUNDS.cycle.length];}
 pickQuiz(n){
  const bank=S.QUIZ.map((q,i)=>({...q,i})).filter(q=>!this.used.includes(q.i)&&(q.after===undefined||this.storyIdx>q.after)&&q.a.length<=n);
  let pick=bank[Math.floor(this.random()*bank.length)];if(!pick){this.used=[];return this.pickQuiz(n);}this.used.push(pick.i);
  const answers=pick.a.map((text,k)=>({text,correct:k===0}));for(let k=answers.length-1;k>0;k--){const j=Math.floor(this.random()*(k+1));[answers[k],answers[j]]=[answers[j],answers[k]];}
  const q={q:pick.q,answers,crossed:-1,shown:false,resolved:false,chosen:-1};
  if(this.hint==='cross'){const wrong=answers.map((a,k)=>a.correct?-1:k).filter(k=>k>=0);q.crossed=wrong[Math.floor(this.random()*wrong.length)];}
  if(this.hint==='show')q.shown=true;this.hint=null;return q;
 }
 startAttack(){
  this.turn++;const r=this.nextRound();this.round=r;this.attackName=r.name;this.duration=r.duration;this.mode=r.mode;this.cfg=this.config();
  this.state='warning';this.timer=0;this.attackTime=0;this.bullets=[];this.timeline=[];this.shots=[];this.platforms=[];this.effects=this.effects.filter(e=>e.type==='damage'||e.type==='data');
  this.setArena(r.arena);this.arena={...r.arena};const a=this.arena;this.soul={x:a.x+a.w/2,y:a.y+a.h/2};this.invulnerability=.4;this.queued=0;this.heat=0;this.dash=0;this.dashCD=0;this.vy=0;this.grounded=false;
  this.duration=Math.round(r.duration/BEAT)*BEAT;
  this.quiz=r.quiz?this.pickQuiz(r.quiz.max):null;if(this.quiz){this.quiz.at=snap(r.quiz.at,BEAT);this.quiz.instant=!!r.quiz.instant;}
  if(this.mode==='cyan'){this.orbitTheta=-Math.PI/2;this.orbitSign=1;}
  if(this.mode==='green'){this.shield='up';this.soul={x:a.x+a.w/2,y:a.y+a.h/2};}
  if(this.mode==='yellow'){this.soul={x:a.x+a.w/2,y:a.y+a.h-30};this.fireCD=0;}
  if(this.mode==='strings'){this.strings=[0,1,2].map(k=>a.y+a.h*(k+1)/4);this.lane=1;this.soul.y=this.strings[1];this.laneHeld=false;}
  if(this.mode==='blue')this.soul={x:a.x+a.w/2,y:a.y+20};
  if(this.mode==='arcade')this.arc={seth:{air:0,duck:false,punch:0,punchCD:0,hurt:0,upHeld:false},queen:{state:'idle',t:.9,move:'high',hits:0,hurt:0},result:''};
  buildRound(this,r);this.timeline.sort((x,y)=>x.at-y.at);this.emit('warning');
 }
 finishWave(){
  const r=this.round;this.waves++;this.hype=0;this.effects=this.effects.filter(e=>!['verdict','quip','instruction'].includes(e.type));this.bullets=[];this.timeline=[];this.shots=[];this.platforms=[];this.mode='red';this.setArena(MENU_BOX);
  let lines=[];
  if(r.id==='scan'){this.scanDone=true;this.ready=true;this.boss.sad=true;lines=[...S.SCAN_RESULT];this.emit('scan');}
  else if(r.id==='arcade'){this.arcadeDone=true;const ko=this.arc.queen.hits>=3;this.addData(ko?DATA.ko:DATA.draw);lines=[...(ko?S.ARCADE_WIN:S.ARCADE_DRAW)];}
  else{this.cycle++;if(!this.scanDone)this.addData(DATA.survive);if(this.storyIdx<S.STORY.length&&!this.scanDone)lines=[...S.STORY[this.storyIdx++]];}
  if(!this.scanDone){const nx=this.nextRound();if(nx.id==='arcade')lines.push(...S.ARCADE_INTRO);else if(nx.id==='scan')lines.push(...S.SCAN_INTRO);}
  if(this.waves%3===0&&!this.ready){this.hp=this.maxHP;this.items.forEach(i=>{if(i.name!=='EGG')i.count=ITEMS().find(j=>j.name===i.name).count;});lines.push(S.N('* QU5EN runs a quick system restore.\n* On you, by accident.\n* Full HP. Supplies restored.'));this.saveCheckpoint();this.emit('heal');}
  this.message(lines.length?lines:[S.N(this.text)],'menu');
 }
 saveCheckpoint(){this.checkpoint={data:this.data,cycle:this.cycle,storyIdx:this.storyIdx,used:[...this.used],arcadeDone:this.arcadeDone,scanDone:this.scanDone,ready:this.ready,waves:this.waves,chassis:this.chassis,eggGiven:this.eggGiven,egg:this.items.find(i=>i.name==='EGG').count};}
 retry(){if(this.deathAge<1.8)return;const c=this.checkpoint;Object.assign(this,{data:c.data,cycle:c.cycle,storyIdx:c.storyIdx,used:[...c.used],arcadeDone:c.arcadeDone,scanDone:c.scanDone,ready:c.ready,waves:c.waves,chassis:c.chassis,eggGiven:c.eggGiven});this.items=ITEMS();this.items.find(i=>i.name==='EGG').count=c.egg;this.hp=this.maxHP;this.bullets=[];this.effects=[];this.timeline=[];this.toMenu(true);this.message(S.N('* FIGHT AGAIN.\n* Full HP. Supplies restored.'),'menu');this.emit('heal');}
 // ------------------------------------------------------------ the quiz
 // The answer is wherever the SOUL is when TIME runs out; shooting and dashing answer on the spot.
 chosen(){
  const q=this.quiz,a=this.arena,n=q.answers.length,s=this.soul;
  if(this.mode==='red')return clamp(Math.floor((s.x-a.x)/(a.w/n)),0,n-1);
  if(this.mode==='blue'){const p=this.platforms.find(p=>p.ans>=0&&this.grounded===p);return p?p.ans:-1;}
  if(this.mode==='cyan'){const t=((this.orbitTheta+Math.PI/2)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);return Math.floor(t/(Math.PI*2/n));}
  if(this.mode==='green')return SIDES.indexOf(this.shield)<n?SIDES.indexOf(this.shield):-1;
  if(this.mode==='strings')return this.lane<n?this.lane:-1;
  return -1;
 }
 answer(i){
  const q=this.quiz;if(!q||q.resolved)return;q.resolved=true;q.chosen=i;const ok=i>=0&&q.answers[i].correct,round=this.round;
  if(round.id==='scan'){this.effects.push({type:'verdict',text:'SCANNING...',ok:true,life:1.6});this.emit('cue');return;}
  this.addData(ok?DATA.correct:DATA.wrong);const bank=i<0?S.NO_ANSWER:ok?S.CORRECT:S.WRONG;
  this.effects.push({type:'verdict',text:ok?'CORRECT!':i<0?'TIME!':'WRONG!',ok,life:1.4},{type:'quip',text:bank[(this.turn+this.waves)%bank.length],life:2.6});
  this.emit(ok?'correct':'wrong');round.resolve?.(this,ok,i);
 }
 // ------------------------------------------------------------ spawners (used by attacks.js)
 setArena(a){this.targetArena={...a};}
 at(t,fn){this.timeline.push({at:snap(t),action:fn,done:false});}
 every(start,end,interval,fn){const step=Math.max(HALF,snap(interval/this.cfg.speed));for(let i=0,t=snap(start);t<end;i++,t+=step){const k=i;this.at(t,()=>fn(k));}}
 spawn(b){const o={age:0,vx:0,vy:0,...b};this.bullets.push(o);return o;}
 cue(text){this.effects.push({type:'instruction',text,life:1.8});}
 hurt(amount=this.cfg.damage){
  if(this.invulnerability>0||this.settings.invincible||this.dash>0)return;
  this.hp=Math.max(0,this.hp-amount);this.invulnerability=this.cfg.cooldown;this.shake=.2;this.effects.push({type:'vignette',color:'120,255,80',life:.3});this.emit('hurt');
  if(!this.hp){this.state='dead';this.deathAge=0;this.bullets=[];this.timeline=[];this.emit('dead');}
 }
 // Yellow fires; orange dashes; cyan turns back; the arcade punches.
 action(){
  if(this.mode==='yellow'){if(this.fireCD<=0){this.shots.push({x:this.soul.x,y:this.soul.y-10});this.fireCD=.22;this.emit('shoot');}return;}
  if(this.mode==='orange'){this.queued=.3;return;}
  if(this.mode==='cyan'){this.orbitSign*=-1;this.emit('select');return;}
  if(this.mode==='arcade'){const p=this.arc.seth;if(p.punchCD<=0&&!p.hurt){p.punch=.2;p.punchCD=.45;this.emit('swing');}return;}
 }
 hitTest(b,s){
  if(b.delay&&b.age<b.delay)return false;
  // Her boot and the whole leg above it.
  if(b.kind==='boot')return b.phase!=='warn'&&s.x>b.x-b.w/2-4&&s.x<b.x+b.w/2+4&&s.y<b.y+4;
  if(b.kind==='beam'){if(b.age<b.warn||b.age>b.warn+b.live)return false;return Math.abs(-Math.sin(b.angle)*(s.x-b.x)+Math.cos(b.angle)*(s.y-b.y))<b.w/2+3;}
  const inRect=(x,y,w,h)=>s.x>x-w/2-4&&s.x<x+w/2+4&&s.y>y-h/2-4&&s.y<y+h/2+4;
  if(b.kind==='bubble')return inRect(b.x,b.y,b.w,b.h);
  // Her fighter: the body, and the fist while she punches.
  if(b.kind==='fighter')return inRect(b.x,b.y,b.w,b.h)||b.punching&&inRect(b.x+b.dir*34,b.y-22,46,14);
  if(b.kind==='head'&&b.age<b.form)return false;
  if(b.kind==='sector'){if(b.age<b.warn||b.age>b.warn+b.live)return false;const t=((this.orbitTheta+Math.PI/2)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);return t>=b.t0&&t<b.t1;}
  if(b.kind==='packet')return false;
  return Math.hypot(s.x-b.x,s.y-b.y)<(b.r||5)+4;
 }
 // ------------------------------------------------------------ physics
 update(dt,input={}){
  if(this.state==='dead'){if(!this.paused){dt=Math.min(Math.max(dt,0),.04);this.clock+=dt;this.deathAge+=dt;}return;}
  dt=clamp(dt,0,.025);if(this.paused)return;this.clock+=dt;this.timer+=dt;const lastBeat=Math.floor(this.beatPos);this.song+=dt;
  this.effects=this.effects.filter(e=>(e.life-=dt)>0);this.shake=Math.max(0,this.shake-dt);this.boss.hurt=Math.max(0,this.boss.hurt-dt);this.boss.glitch=Math.max(0,this.boss.glitch-dt);
  if(this.state==='intro'){this.intro+=dt;if(this.intro>6.2)this.skipIntro();return;}
  for(const k of ['x','y','w','h']){const d=this.targetArena[k]-this.arena[k];this.arena[k]+=Math.abs(d)<.3?d:d*Math.min(1,dt*12);}
  if(this.state==='dialogue'){this.displayChars=Math.min(this.text.length,this.displayChars+dt*40);return;}
  if(this.state==='fight'){this.attackCursor+=this.attackDir*330*dt;if(this.attackCursor>584||this.attackCursor<56){this.attackCursor=clamp(this.attackCursor,56,584);this.attackDir*=-1;}return;}
  if(this.state==='warning'){this.queued=Math.max(0,(this.queued||0)-dt);if(this.timer>.9&&Math.floor(this.beatPos)>lastBeat||this.timer>2.5){this.state='defend';this.timer=0;this.emit('defend');}return;}
  if(this.state!=='defend')return;
  this.attackTime+=dt;this.invulnerability=Math.max(0,this.invulnerability-dt);
  for(const e of this.timeline)if(!e.done&&this.attackTime>=e.at){e.done=true;e.action();if(this.state!=='defend')return;}
  const q=this.quiz;if(q&&!q.resolved&&this.attackTime>=q.at){this.answer(q.instant?-1:this.chosen());if(this.state!=='defend')return;}
  this.move(dt,input);if(this.state!=='defend')return;
  const s=this.soul;
  for(const b of this.bullets){
   b.age+=dt;if(b.delay&&b.age<b.delay)continue;
   if(b.kind==='boot'){if(b.phase==='warn'&&b.age>=b.warn){b.phase='drop';this.emit('stomp');}if(b.phase==='drop'){b.y=Math.min(b.floor,b.y+900*dt);if(b.y>=b.floor){b.phase='stay';b.t=0;this.shake=Math.max(this.shake,.1);}}else if(b.phase==='stay'){b.t+=dt;if(b.t>b.stay)b.gone=true;}}
   else if(b.kind==='head'){if(b.age>=b.form&&!b.burst){b.x+=b.vx*dt;b.y+=b.vy*dt;}if(b.age>=b.pop){b.gone=true;this.burst(b.x,b.y,b.n||6,b.speed||110);}}
   else if(b.kind==='mini'){b.x+=b.vx*dt;b.y+=b.vy*dt;}
   else if(b.kind==='beam'){if(b.age>b.warn+b.live+.15)b.gone=true;}
   else if(b.kind==='sector'){if(b.age>b.warn+b.live+.15)b.gone=true;}
   else if(b.kind==='bubble'||b.kind==='fighter'){b.x+=b.vx*dt;if(b.x<this.arena.x-120||b.x>this.arena.x+this.arena.w+120)b.gone=true;if(b.kind==='fighter'){const ph=((this.beatPos%2)+2)%2;b.punching=ph<.5;}}
   else if(b.kind==='target'){b.x+=b.vx*dt;if(b.x<this.arena.x+20||b.x>this.arena.x+this.arena.w-20)b.vx*=-1;b.y=b.y0+Math.sin(b.age*2+b.p)*8;}
   else if(b.kind==='packet'){b.dist-=b.speed*dt;const p=packetPos(this,b);b.x=p.x;b.y=p.y;if(b.dist<30&&b.side===this.shield){b.gone=true;this.effects.push({type:'block',x:b.x,y:b.y,life:.25});this.emit('block');continue;}if(b.dist<10){b.gone=true;this.hurt();if(this.state==='dead')return;continue;}}
   else{b.x+=(b.vx||0)*dt;b.y+=(b.vy||0)*dt;}
   if(b.gone)continue;
   // Dashing through a bubble answers it (or pops the spam).
   if(b.kind==='bubble'&&this.dash>0&&this.hitTest(b,s)){b.gone=true;this.emit('pop');if(b.ans>=0&&q&&!q.resolved)this.answer(b.ans);continue;}
   if(b.kind==='target')continue;
   if(this.mode!=='arcade'&&this.hitTest(b,s)){this.hurt();if(this.state==='dead')return;}
  }
  // Yellow shots: an answer target answers; anything else just pops.
  for(const sh of this.shots){sh.y-=420*dt;for(const b of this.bullets){if(b.gone)continue;if(b.kind==='target'&&Math.hypot(sh.x-b.x,sh.y-b.y)<b.r+4){sh.gone=true;b.gone=true;this.emit('pop');if(q&&!q.resolved)this.answer(b.ans);break;}if((b.kind==='mini'||b.kind==='head'&&b.age>=b.form)&&Math.hypot(sh.x-b.x,sh.y-b.y)<(b.r||5)+3){sh.gone=true;b.gone=true;this.effects.push({type:'block',x:b.x,y:b.y,life:.2});break;}}}
  this.shots=this.shots.filter(s2=>!s2.gone&&s2.y>this.arena.y);
  this.bullets=this.bullets.filter(b=>!b.gone&&(['boot','beam','sector','bubble','fighter','target','packet','head'].includes(b.kind)||b.age<(b.life??6)&&b.x>-60&&b.x<700&&b.y>-60&&b.y<540));
  if(this.attackTime>=this.duration){if(q&&!q.resolved)this.answer(q.instant?-1:this.chosen());this.finishWave();}
 }
 burst(x,y,n,speed){for(let k=0;k<n;k++){const an=k*Math.PI*2/n+this.random()*.4;this.spawn({kind:'mini',x,y,vx:Math.cos(an)*speed*this.cfg.speed,vy:Math.sin(an)*speed*this.cfg.speed,r:5,life:4,spin:this.random()*8});}this.emit('burst');}
 move(dt,input){
  const s=this.soul,a=this.arena,sx=Number(!!input.right)-Number(!!input.left),sy=Number(!!input.down)-Number(!!input.up),speed=180*(input.slow?.5:1);
  const touch=input.touch;
  if(this.mode==='red'||this.mode==='yellow'||this.mode==='orange'){
   let dx=sx,dy=sy;const n=Math.hypot(dx,dy)||1;dx/=n;dy/=n;
   if(this.mode==='orange'){this.dashCD=Math.max(0,this.dashCD-dt);this.dash=Math.max(0,this.dash-dt);if(sx||sy)this.lastMove={x:dx,y:dy};if(this.queued>0){if(this.dashCD<=0&&this.dash<=0){if(sx||sy)this.lastMove={x:dx,y:dy};this.dash=.24;this.dashCD=.6;this.queued=0;this.dashDir={...(this.lastMove||{x:1,y:0})};this.emit('dash');}else this.queued-=dt;}}
   if(this.dash>0){s.x+=this.dashDir.x*speed*2.6*dt;s.y+=this.dashDir.y*speed*2.6*dt;}
   else{s.x+=dx*speed*dt*(sx||sy?1:0);s.y+=dy*speed*dt*(sx||sy?1:0);if(touch){const tx=touch.x-s.x,ty=touch.y-s.y,m=Math.hypot(tx,ty),st=Math.min(m,250*dt);if(m>1){s.x+=tx/m*st;s.y+=ty/m*st;if(this.mode==='orange')this.lastMove={x:tx/m,y:ty/m};}}}
   if(this.mode==='yellow'){this.fireCD=Math.max(0,this.fireCD-dt);s.y=Math.max(s.y,a.y+a.h*.45);}
   s.x=clamp(s.x,a.x+12,a.x+a.w-12);s.y=clamp(s.y,a.y+12,a.y+a.h-12);
   // ORANGE: a SOUL that stands still heats up and burns.
   if(this.mode==='orange'){const moving=this.dash>0||!!(sx||sy)||!!touch;this.heat=moving?Math.max(0,this.heat-dt*3):Math.min(1,this.heat+dt/1.4);if(this.heat>=1){this.burnTick=(this.burnTick||0)+dt;if(this.burnTick>.5){this.burnTick=0;if(this.hp>1&&!this.settings.invincible){this.hp--;this.emit('burn');}}}}
   return;
  }
  if(this.mode==='blue'){
   // Gravity: arrows walk, UP jumps (hold for height); answer platforms are where you stand.
   const dirX=sx||(touch?Math.sign(touch.x-s.x)*(Math.abs(touch.x-s.x)>6?1:0):0),jump=input.up||(touch&&touch.y<s.y-30);
   s.x+=dirX*150*dt;if(jump&&this.grounded){this.vy=-345;this.grounded=null;this.emit('jump');}
   if(!jump&&this.vy<0)this.vy*=Math.pow(.02,dt);this.vy=Math.min(520,this.vy+900*dt);const py=s.y;s.y+=this.vy*dt;this.grounded=null;
   for(const p of this.platforms){if(p.gone)continue;if(this.vy>=0&&py+8<=p.y+1&&s.y+8>=p.y&&s.x>p.x-4&&s.x<p.x+p.w+4){s.y=p.y-8;this.vy=0;this.grounded=p;}}
   s.x=clamp(s.x,a.x+12,a.x+a.w-12);if(s.y<a.y+12){s.y=a.y+12;this.vy=Math.max(0,this.vy);}
   if(s.y>a.y+a.h-12){s.y=a.y+a.h-12;this.vy=0;this.grounded={floor:true};}
   if(this.acid&&s.y+6>this.acid.top){this.hurt();this.vy=-380;this.grounded=null;}
   if(this.acid)this.acid.top=Math.max(this.acid.limit,this.acid.top-this.acid.rise*dt);
   for(const p of this.platforms)if(p.crumble){p.drop=(p.drop||0)+dt;p.y+=p.drop*220*dt;if(p.y>a.y+a.h+20)p.gone=true;}
   return;
  }
  if(this.mode==='cyan'){
   // Aqua's cyan: ride the ring; arrows push along it, otherwise it drifts; Z turns it back.
   const push=sx||sy?(sx||-sy):0,r=Math.min(a.w,a.h)*.38;this.orbitTheta+=(push||this.orbitSign*.4)*2.2*dt;s.x=a.x+a.w/2+Math.cos(this.orbitTheta)*r;s.y=a.y+a.h/2+Math.sin(this.orbitTheta)*r;return;
  }
  if(this.mode==='green'){if(input.up)this.shield='up';else if(input.down)this.shield='down';else if(input.left)this.shield='left';else if(input.right)this.shield='right';
   if(touch){const dx=touch.x-(a.x+a.w/2),dy=touch.y-(a.y+a.h/2);if(Math.hypot(dx,dy)>20)this.shield=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}return;}
  if(this.mode==='strings'){
   s.x+=sx*speed*dt;if(touch){const tx=touch.x-s.x;s.x+=clamp(tx,-250*dt,250*dt);}
   const lane=sy;if(lane&&!this.laneHeld){this.lane=clamp(this.lane+lane,0,2);this.emit('select');}this.laneHeld=!!lane;s.y+=(this.strings[this.lane]-s.y)*Math.min(1,dt*18);s.x=clamp(s.x,a.x+12,a.x+a.w-12);return;
  }
  if(this.mode==='arcade')this.arcade(dt,input);
 }
 // ROUND 2: FIGHT! Her fighter telegraphs HIGH (duck under it) or LOW (jump over it); a whiff leaves her open to a punch.
 arcade(dt,input){
  const A=this.arc,p=A.seth,qn=A.queen,w=this.cfg.warn;
  p.punch=Math.max(0,p.punch-dt);p.punchCD=Math.max(0,p.punchCD-dt);p.hurt=Math.max(0,p.hurt-dt);p.air=Math.max(0,p.air-dt);qn.hurt=Math.max(0,qn.hurt-dt);
  if(input.up&&!p.upHeld&&!p.air&&!p.hurt){p.air=.62;this.emit('jump');}p.upHeld=!!input.up;p.duck=!!input.down&&!p.air;
  qn.t-=dt;
  if(qn.state==='ko')return;
  const ph=((this.beatPos%1)+1)%1;
  if(qn.state==='idle'&&qn.t<=0&&ph>=.5&&ph<.6){qn.state='tell';qn.move=this.random()<.5?'high':'low';qn.t=1.5*BEAT-(ph-.5)*BEAT;this.emit('cue');}
  else if(qn.state==='tell'&&qn.t<=0){qn.state='attack';qn.t=.24;const dodged=qn.move==='high'?p.duck:p.air>0;if(!dodged){if(!this.settings.invincible&&this.invulnerability<=0){p.hurt=.45;}this.hurt();if(this.state==='dead')return;qn.state='attack';qn.hit=true;}else qn.hit=false;this.emit('swing');}
  else if(qn.state==='attack'&&qn.t<=0){qn.state=qn.hit?'idle':'recover';qn.t=qn.hit?BEAT:2*BEAT*w;}
  else if(qn.state==='recover'&&qn.t<=0){qn.state='idle';qn.t=.35+this.random()*.5;}
  else if(qn.state==='hurt'&&qn.t<=0){qn.state='idle';qn.t=.6;}
  if(p.punch>.14&&p.punch<=.2&&!p.landed){p.landed=true;if(qn.state==='recover'){qn.state='hurt';qn.t=.5;qn.hits++;qn.hurt=.4;this.boss.glitch=.4;this.effects.push({type:'arcadeHit',life:.4});this.emit('attack');if(qn.hits>=3){qn.state='ko';A.result='ko';this.effects.push({type:'verdict',text:'K.O.!',ok:true,life:2});this.at(this.attackTime+1.8,()=>{this.duration=Math.min(this.duration,this.attackTime+.01);});}}else{this.effects.push({type:'arcadeBlock',life:.3});this.emit('block');}}
  if(p.punch<=0)p.landed=false;
 }
 snapshot(){return{state:this.state,hp:this.hp,maxHP:this.maxHP,lv:this.lv,data:this.data,chassis:this.chassis,turn:this.turn,waves:this.waves,round:this.round?.id,mode:this.mode,ready:this.ready,scanDone:this.scanDone,arcadeDone:this.arcadeDone,ending:this.ending,items:this.items.map(i=>({...i}))};}
}
// A packet's position: it flies straight at the centre of the box from its side.
function packetPos(g,b){const a=g.arena,cx=a.x+a.w/2,cy=a.y+a.h/2,d={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]}[b.side];return{x:cx+d[0]*b.dist,y:cy+d[1]*b.dist};}
Object.assign(exports,{BattleEngine,clamp,MENU_BOX,SIDES,packetPos,DATA,MUSIC,BEAT});
