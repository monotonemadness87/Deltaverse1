const S=require("story.js");
const {buildAttack,ATTACKS}=require("attacks.js");
const {World}=require("world.js");
// Fixed-step simulation for the walk and the battle, separate from Canvas presentation.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const MENU_BOX={x:24,y:249,w:592,h:140};
// Damage per hit on each difficulty. The genocide hunt hits twice as hard as the trap.
const DIFF={gentle:{speed:.8,warn:1.35,cooldown:1.15,pacifist:1,genocide:3},normal:{speed:.96,warn:1.18,cooldown:.95,pacifist:2,genocide:4},hard:{speed:1.1,warn:1.05,cooldown:.82,pacifist:3,genocide:5}};
const angleDiff=(a,b)=>{let d=(a-b)%(Math.PI*2);if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;return d;};
class BattleEngine{
 constructor(){this.settings={difficulty:'normal',route:'pacifist',invincible:false,skipWalk:false};this.world=new World(this);this.reset();}
 get genocide(){return this.settings.route==='genocide';}
 reset(){
  const g=this.genocide;
  this.scene='world';this.state='world';this.paused=false;this.clock=0;this.timer=0;this.deathAge=0;this.checkpoint=null;
  this.lv=g?5:1;this.maxHP=g?36:30;this.hp=this.maxHP;this.enemyMax=g?2000:900;this.enemyHP=this.enemyMax;
  this.turn=0;this.dodges=0;this.storySeen=0;this.selected=0;this.option=0;this.talks=0;this.calls=0;this.anger=0;this.aquaComing=-1;this.aquaHere=false;this.advice={};this.brace=false;this.spareTries=0;this.ready=false;this.ending='';
  this.items=[{name:'SNOW PEAR',heal:12,count:3},{name:'PINE TEA',heal:20,count:2},{name:'HOT COCOA',heal:99,count:1}];
  this.arena={...MENU_BOX};this.targetArena={...MENU_BOX};this.bullets=[];this.timeline=[];this.effects=[];this.soul={x:320,y:300};this.motion=null;this.dark=0;
  this.boss={x:320,y:196,alpha:1,pose:'idle',hurt:0,face:'neutral'};this.poison=0;this.poisonTick=0;this.pollenTick=0;this.invulnerability=0;this.shake=0;this.attackTime=0;this.duration=0;this.pattern=null;this.attackName='';this.config=null;this.aquaGuard=0;
  this.pages=[];this.text='';this.displayChars=0;this.speaker='narrator';this.face='neutral';this.next=null;this.encounter=0;this.ending='';
  this.world.reset();this.emit('reset');
  if(this.settings.skipWalk)this.startBattle(true);
 }
 emit(event){this.onEvent?.(event);}
 random(){this.seed=((this.seed||91357)*1664525+1013904223)>>>0;return this.seed/4294967296;}
 beginRoute(route){if(!['pacifist','genocide'].includes(route))return;this.settings.route=route;this.reset();}
 // ------------------------------------------------------------ dialogue
 message(pages,next='menu'){this.pages=(Array.isArray(pages)?pages:[pages]).map(p=>typeof p==='string'?S.N(p):p);this.next=next;this.showPage();}
 showPage(){
  let p=this.pages.shift();
  while(p&&p.turn){this.world.marigoldTurns();p=this.pages.shift();}
  if(!p){this.finishDialogue();return;}
  this.state='dialogue';this.text=p.text;this.speaker=p.speaker;this.face=p.face??'neutral';this.phone=!!p.phone;this.displayChars=0;this.timer=0;
  if(p.speaker==='boss')this.boss.face=p.face;this.emit('text');
 }
 finishDialogue(){const n=this.next;this.next=null;if(typeof n==='function'){this.state=this.scene==='world'?'world':'menu';n();return;}if(n==='defend')this.startAttack();else if(n==='menu')this.toMenu();else if(n==='world')this.state='world';else{this.state=n;this.timer=0;this.emit('end');}}
 // ------------------------------------------------------------ battle setup
 startBattle(skip=false){
  this.scene='battle';this.state=skip?'menu':'encounter';this.encounter=0;this.timer=0;this.seed=this.genocide?66013:31337;
  this.setArena(MENU_BOX);this.arena={...MENU_BOX};this.saveCheckpoint();
  if(skip)this.toMenu(true);this.emit(skip?'turn':'encounter');
 }
 saveCheckpoint(){this.checkpoint={turn:this.turn,dodges:this.dodges,storySeen:this.storySeen,enemyHP:this.enemyHP,talks:this.talks,calls:this.calls,anger:this.anger,aquaComing:this.aquaComing,aquaHere:this.aquaHere,advice:{...this.advice},ready:this.ready,spareTries:this.spareTries};}
 retry(){if(this.state==='dead'&&this.deathAge<1.8)return;const cp=this.checkpoint;this.scene='battle';Object.assign(this,{...cp,advice:{...cp.advice}});this.checkpoint={...cp,advice:{...cp.advice}};this.hp=this.maxHP;this.poison=0;this.freshStock();this.bullets=[];this.effects=[];this.timeline=[];this.dark=0;this.motion=null;this.boss.alpha=1;this.toMenu();this.message(S.N(this.genocide?'* You refuse to let it end here.\n* Full HP. Supplies restored.':'* The smell of buttercups fades.\n* Full HP. Supplies restored.'),'menu');this.emit('heal');}
 freshStock(){const counts={'SNOW PEAR':3,'PINE TEA':2,'HOT COCOA':1};for(const i of this.items)i.count=counts[i.name];}
 options(){
  if(this.state==='act')return['CHECK','TALK','CALL AQUA','BRACE'];
  if(this.state==='item')return this.items.filter(i=>i.count).map(i=>`${i.name} x${i.count}`);
  if(this.state==='mercy')return['SPARE','FLEE'];
  if(this.state==='target')return['MARIGOLD'];return[];
 }
 navigate(dx,dy){if(this.paused)return;if(this.state==='menu'){this.selected=(this.selected+(dx||dy)+4)%4;this.emit('select');return;}const n=this.options().length;if(!n)return;if(n>2){const row=Math.floor(this.option/2),col=this.option%2,c=dx?row*2+(1-col):(1-row)*2+col;if(c<n)this.option=c;}else this.option=(this.option+(dx||dy)+n)%n;this.emit('select');}
 back(){if(this.paused)return;if(this.options().length){this.state='menu';this.option=0;this.emit('select');}}
 chooseMenu(i){if(this.state!=='menu'||this.paused||!Number.isInteger(i)||i<0||i>3)return;this.selected=i;this.confirm();}
 togglePause(){if(['dead','spared','killed'].includes(this.state))return;this.paused=!this.paused;this.emit('pause');}
 // ------------------------------------------------------------ confirm
 confirm(){
  if(this.paused)return;
  if(this.state==='world'){this.world.interact();return;}
  if(this.state==='dialogue'){if(this.displayChars<this.text.length){this.displayChars=this.text.length;return;}if(this.pages.length)this.showPage();else this.finishDialogue();return;}
  if(this.state==='dead'){this.retry();return;}
  if(['spared','killed'].includes(this.state)){if(this.timer>1.2)this.reset();return;}
  if(this.state==='menu'){this.state=['target','act','item','mercy'][this.selected];this.option=0;if(this.state==='item'&&!this.options().length)this.message('* Your pockets are empty.','menu');this.emit('select');return;}
  if(this.state==='target'){this.state='fight';this.timer=0;this.attackCursor=56;this.attackDir=1;this.emit('select');return;}
  if(this.state==='fight'){this.strike();return;}
  if(this.state==='act'){this.act(this.option);return;}
  if(this.state==='item'){const item=this.items.filter(i=>i.count)[this.option];if(!item)return;const amount=Math.min(this.maxHP-this.hp,item.heal);this.hp+=amount;item.count--;this.emit('heal');this.message([S.N(`* You ${item.name==='PINE TEA'?'drink':'eat'} the ${item.name}.\n* ${this.hp>=this.maxHP?'Your HP was maxed out.':'You recover '+amount+' HP.'}`)],'defend');return;}
  if(this.state==='mercy'){this.mercy(this.option);return;}
 }
 strike(){
  const accuracy=clamp(1-Math.abs(this.attackCursor-320)/264,0,1),before=this.enemyHP,g=this.genocide;
  let dmg=Math.round((g?70+70*accuracy:30+50*accuracy)*(this.advice.crack?1.35:1));
  const floor=g?(this.dodges>=13?0:1):(this.dodges>=6?0:1);
  this.enemyHP=Math.max(floor,this.enemyHP-dmg);const dealt=before-this.enemyHP;
  this.effects.push({type:'damage',text:String(dealt),life:1.1,x:320,y:70});this.boss.hurt=.55;this.shake=.18;this.emit('attack');
  if(!this.enemyHP){this.endBattle('killed');return;}
  const bank=g?S.STRIKE_G:S.STRIKE_P;this.message([S.M(g?'angry':'sad',dealt===0?'...':bank[this.turn%bank.length])],'defend');
 }
 act(i){
  const g=this.genocide;
  if(i===0){this.message(S.N(S.CHECK[this.settings.route]),'defend');return;}
  if(i===1){
   if(g){this.message(S.TALK_G,'defend');return;}
   const topic=S.TALK_P[this.talks];
   if(!topic){this.message(S.TALK_DONE,'defend');return;}
   if(topic.needsAqua&&!this.aquaHere){this.message(S.TALK_EARLY,'defend');return;}
   this.talks++;if(this.talks>=3)this.ready=true;this.message([S.N(topic.prompt),...topic.lines],'defend');return;
  }
  if(i===2){this.call();return;}
  if(i===3){this.brace=true;this.message(S.STAND,'defend');return;}
 }
 call(){
  const g=this.genocide,n=this.calls;let lines;
  if(!g&&this.aquaHere){this.message(S.CALL_P_HERE,'defend');return;}
  if(g){lines=S.CALLS_G[Math.min(n,S.CALLS_G.length-1)];if(n===1)this.advice.tells=true;if(n===2)this.advice.crack=true;if(n===3)this.advice.poison=true;if(n===4)this.advice.lance=true;}
  else if(n<S.CALLS_P.length){lines=S.CALLS_P[n];if(n===S.CALLS_P.length-1)this.aquaComing=this.dodges;}
  else lines=S.CALL_P_AFTER;
  this.calls++;this.anger=Math.min(g?6:5,this.anger+1);
  const annoy=(g?S.ANNOY_G:S.ANNOY_P);this.emit('phone');
  this.message([...lines,...annoy[Math.min(n,annoy.length-1)]],'defend');
 }
 mercy(i){
  const g=this.genocide;
  if(i===1){this.message(g?S.FLEE_G:S.FLEE_P,'defend');return;}
  if(!g&&this.ready&&this.aquaHere){this.endBattle('spared');return;}
  const bank=g?S.SPARE_G:S.SPARE_EARLY_P;this.message(bank[Math.min(this.spareTries++,bank.length-1)],'defend');
 }
 endBattle(kind){
  this.bullets=[];this.timeline=[];this.dark=0;this.motion=null;this.setArena(MENU_BOX);this.ending=kind;
  const lines=kind==='spared'?S.SPARED:this.genocide?S.KILLED_G:S.KILLED_P;
  if(kind==='killed')this.boss.dying=0;
  this.message(lines,kind);this.emit(kind==='spared'?'spare':'kill');
 }
 // ------------------------------------------------------------ turns
 toMenu(silent=false){
  this.state='menu';this.bullets=[];this.timeline=[];this.motion=null;this.dark=0;this.setArena(MENU_BOX);this.boss.alpha=1;this.boss.pose='idle';this.speaker='narrator';
  const flavor=S.FLAVOR[this.settings.route];this.text=this.ready&&this.aquaHere?S.FLAVOR_READY:this.turn===0?flavor[0]:flavor[1+(this.turn*3)%(flavor.length-1)];this.displayChars=this.text.length;
  if(!silent)this.emit('turn');
 }
 config_(){
  const d=DIFF[this.settings.difficulty]||DIFF.normal,g=this.genocide,a=this.anger;
  // Calling Aqua costs pressure: a little on the trap, a lot on the hunt.
  return{speed:d.speed*(g?1.1:1)*(1+a*(g?.05:.025)),warn:d.warn*(this.advice.tells?1.4:1),cooldown:d.cooldown,damage:Math.max(1,d[this.settings.route]+(g?(a>=3?1:0):(a>=4?1:0))-(this.brace?1:0)),density:(g?.9:1)/(1+a*(g?.06:.03)),lanceWarn:this.advice.lance?1.35:1};
 }
 startAttack(){
  this.turn++;const list=ATTACKS[this.settings.route];let index=this.dodges;if(index>=list.length)index=list.length-6+((index-list.length)%6);
  const attack=list[index];this.pattern=attack.id;this.attackName=attack.name;this.duration=attack.duration;this.config=this.config_();
  this.state='warning';this.timer=0;this.attackTime=0;this.bullets=[];this.effects=this.effects.filter(e=>e.type==='damage');this.timeline=[];this.motion=null;this.dark=0;this.boss.alpha=1;this.aquaGuard=1.2;
  this.setArena(attack.arena);this.soul={x:attack.arena.x+attack.arena.w/2,y:attack.arena.y+attack.arena.h/2};this.invulnerability=.4;
  buildAttack(this,attack);this.timeline.sort((a,b)=>a.at-b.at);this.emit('warning');
 }
 finishWave(){
  this.dodges++;this.storySeen=this.dodges;this.brace=false;this.advice.tells=false;this.poison=0;
  this.bullets=[];this.timeline=[];this.motion=null;this.dark=0;this.setArena(MENU_BOX);this.boss.alpha=1;this.boss.pose='idle';
  const story=(this.genocide?S.STORY_G:S.STORY_P);let lines=story[Math.min(this.dodges-1,story.length-1)].slice();
  if(this.dodges>story.length)lines=[S.M(this.genocide?'angry':'sad','...')];
  if(!this.genocide&&this.aquaComing>=0&&!this.aquaHere&&this.dodges-this.aquaComing>=2){this.aquaHere=true;lines=[...S.ARRIVAL];this.emit('aqua');}
  if(this.dodges%4===0){this.hp=this.maxHP;this.freshStock();lines.push(S.N(this.genocide?'* You catch your breath.\n* Full HP. Supplies restored.':'* The cold air steadies you.\n* Full HP. Supplies restored.'));this.saveCheckpoint();this.emit('heal');}
  this.message(lines,'menu');
 }
 // ------------------------------------------------------------ timeline + spawners (used by attacks.js)
 setArena(a){this.targetArena={...a};}
 at(t,fn){this.timeline.push({at:t,action:fn,done:false});}
 every(start,end,interval,fn){const step=interval*this.config.density;for(let i=0,t=start;t<end;i++,t+=step){const k=i;this.at(t,()=>fn(k));}}
 spawn(b){const o={age:0,vx:0,vy:0,...b};this.bullets.push(o);return o;}
 pose(p,time=.9){this.boss.pose=p;this.boss.poseTime=time;}
 cue(text){this.effects.push({type:'instruction',text,life:1.6});}
 edgePoint(edge,pos,a=this.targetArena){if(edge==='bottom')return{x:a.x+pos,y:a.y+a.h,dx:0,dy:-1};if(edge==='top')return{x:a.x+pos,y:a.y,dx:0,dy:1};if(edge==='left')return{x:a.x,y:a.y+pos,dx:1,dy:0};return{x:a.x+a.w,y:a.y+pos,dx:-1,dy:0};}
 thorn(edge,pos,{w=22,len,warn=.72,live=.55,rise=.11,fizzle=false}={}){const a=this.targetArena,p=this.edgePoint(edge,pos);len??=(edge==='top'||edge==='bottom'?a.h:a.w)*.52;return this.spawn({kind:'thorn',x:p.x,y:p.y,dx:p.dx,dy:p.dy,w,len,warn:warn*this.config.warn,rise,live,fall:.16,fizzle});}
 thornRow(edge,gapCenter,gapW=62,opts={}){const a=this.targetArena,span=edge==='top'||edge==='bottom'?a.w:a.h,w=opts.w||22;for(let p=w/2+2;p<span;p+=w){if(Math.abs(p-gapCenter)<gapW/2+w/2-4)continue;this.thorn(edge,p,opts);}this.emit('cue');this.pose('summon'+(this.turn%3),.8);}
 lance(side,coord,{speed=760,len=230,w=10,warn=.78}={}){
  const a=this.targetArena;let x,y,angle;
  if(side==='left'){x=a.x-30;y=coord??this.soul.y;angle=0;}else if(side==='right'){x=a.x+a.w+30;y=coord??this.soul.y;angle=Math.PI;}else if(side==='top'){x=coord??this.soul.x;y=a.y-30;angle=Math.PI/2;}else{x=coord??this.soul.x;y=a.y+a.h+30;angle=-Math.PI/2;}
  this.pose(side==='left'||side==='right'?'aim':'thrust',.7);this.emit('cue');
  return this.spawn({kind:'lance',x,y,angle,len,w,speed:speed*this.config.speed,warn:warn*this.config.warn*this.config.lanceWarn,tip:0});
 }
 sword(fromLeft,band,{warn=.85,dur=.42}={}){
  const a=this.targetArena,px=a.x+a.w/2,py=a.y-46,far=Math.hypot(a.w/2,a.h+46)+8,near=40,mid=46+a.h*.5;
  const [r0,r1]=band==='near'?[near,mid]:[mid,far];const a0=fromLeft?Math.PI*.96:Math.PI*.04,a1=fromLeft?Math.PI*.04:Math.PI*.96;
  this.pose(fromLeft?'swing0':'swing1',warn*this.config.warn+dur);this.emit('cue');
  return this.spawn({kind:'arc',x:px,y:py,r0,r1,a0,a1,prev:a0,warn:warn*this.config.warn,dur,cur:a0});
 }
 bud(x,y,{vx=0,vy=70,fuse=1.8,R=24,petals=0}={}){return this.spawn({kind:'bud',x,y,vx:vx*this.config.speed,vy:vy*this.config.speed,fuse,R,petals,r:5});}
 petal(x,y,angle,speed=95,turn=0){return this.spawn({kind:'petal',x,y,angle,speed:speed*this.config.speed,turn,r:4,life:7});}
 star(x,y,vx,vy,{delay=0,r=6}={}){return this.spawn({kind:'star',x,y,vx:vx*this.config.speed,vy:vy*this.config.speed,delay,r,life:6});}
 orbit(cx,cy,n=8,radius=70,{spin=.9,release=1.6,phase=0}={}){for(let k=0;k<n;k++)this.spawn({kind:'orbit',cx,cy,radius,theta:phase+k*Math.PI*2/n,spin:Math.sign(spin)*.9,release:release*this.config.warn,r:5,x:cx,y:cy,life:6});this.pose('shower'+(this.turn%3),1.2);}
 ghost(fromLeft,y,{speed=120,spear=true}={}){const a=this.targetArena;this.pose('prepare',1);return this.spawn({kind:'ghost',x:fromLeft?a.x-30:a.x+a.w+30,y,vx:(fromLeft?1:-1)*speed*this.config.speed,w:18,h:38,spear,life:9});}
 ring(cx,cy,R,gap,{gapW=.9,close=1.6,warn=.6}={}){this.emit('cue');return this.spawn({kind:'ring',x:cx,y:cy,R,r:R,gap,gapW,close:close/this.config.speed,warn:warn*this.config.warn});}
 heart(cx,cy,{size=58,warn=1,close=.9}={}){this.emit('cue');return this.spawn({kind:'heart',x:cx,y:cy,size,scale:1,warn:warn*this.config.warn,close});}
 // ------------------------------------------------------------ physics
 hurt(amount=this.config.damage){if(this.invulnerability>0||this.settings.invincible)return;this.hp=Math.max(0,this.hp-amount);this.invulnerability=this.config.cooldown;this.shake=.18;this.emit('hurt');if(!this.hp){this.state='dead';this.deathAge=0;this.bullets=[];this.timeline=[];this.dark=0;this.emit('dead');}}
 hitTest(b,s){
  if(b.kind==='thorn'){if(b.age<b.warn||b.fizzle)return false;const L=b.cur||0;if(L<4)return false;const rx=s.x-b.x,ry=s.y-b.y,t=rx*b.dx+ry*b.dy,perp=Math.abs(rx*b.dy-ry*b.dx);if(t<-3||t>L+2)return false;return perp<(b.w*.32)*(1-t/L*.7)+4;}
  if(b.kind==='lance'){if(b.age<b.warn)return false;const cx=Math.cos(b.angle),cy=Math.sin(b.angle),rx=s.x-b.tx,ry=s.y-b.ty,t=-(rx*cx+ry*cy),perp=Math.abs(rx*cy-ry*cx);return t>-6&&t<b.len&&perp<b.w/2+3;}
  if(b.kind==='arc'){if(b.age<b.warn||b.age>b.warn+b.dur+.02)return false;const d=Math.hypot(s.x-b.x,s.y-b.y);if(d<b.r0-4||d>b.r1+4)return false;const ang=Math.atan2(s.y-b.y,s.x-b.x),lo=Math.min(b.prev,b.cur)-.05,hi=Math.max(b.prev,b.cur)+.05;return ang>=lo&&ang<=hi;}
  if(b.kind==='ghost')return Math.abs(s.x-b.x)<b.w/2+3&&Math.abs(s.y-b.y)<b.h/2+3||b.spear&&Math.abs(s.y-(b.y+2))<4&&(b.vx>0?s.x>b.x&&s.x<b.x+34:s.x<b.x&&s.x>b.x-34);
  if(b.kind==='ring'){if(b.age<b.warn)return false;const d=Math.hypot(s.x-b.x,s.y-b.y);if(Math.abs(d-b.r)>6)return false;return Math.abs(angleDiff(Math.atan2(s.y-b.y,s.x-b.x),b.gap))>b.gapW/2;}
  if(b.kind==='heart'){if(b.age<b.warn)return false;for(const p of heartPoints(b))if(Math.hypot(s.x-p.x,s.y-p.y)<9)return true;return false;}
  if(b.kind==='pollen')return false;
  return Math.hypot(s.x-b.x,s.y-b.y)<(b.r||4)+4;
 }
 update(dt,input={}){
  if(this.state==='dead'){if(!this.paused){dt=Math.min(Math.max(dt,0),.04);this.clock+=dt;this.deathAge+=dt;}return;}
  dt=clamp(dt,0,.025);if(this.paused)return;this.clock+=dt;this.timer+=dt;
  this.effects=this.effects.filter(e=>(e.life-=dt)>0);this.shake=Math.max(0,this.shake-dt);this.boss.hurt=Math.max(0,this.boss.hurt-dt);
  if(this.boss.poseTime>0){this.boss.poseTime-=dt;if(this.boss.poseTime<=0)this.boss.pose='idle';}
  if(this.boss.dying!==undefined)this.boss.dying+=dt;
  if(this.scene==='world'){this.world.update(dt,input);if(this.state==='dialogue')this.displayChars=Math.min(this.text.length,this.displayChars+dt*36);return;}
  if(this.state==='encounter'){this.encounter+=dt;if(this.encounter>1.25){this.toMenu(true);this.message(S.N(this.genocide?'* Marigold attacks!':'* Marigold blocks the way!'),'menu');}return;}
  // Arena easing and drifting.
  if(this.motion&&this.state==='defend'){const m=this.motion,t=this.attackTime-m.start,shrink=Math.min(t*(m.shrink||0),m.max||0);this.targetArena={x:m.base.x+shrink/2,y:m.base.y+shrink*.3,w:m.base.w-shrink,h:m.base.h-shrink*.6};}
  for(const k of ['x','y','w','h']){const d=this.targetArena[k]-this.arena[k];this.arena[k]+=Math.abs(d)<.3?d:d*Math.min(1,dt*12);}
  if(this.state==='dialogue'){this.displayChars=Math.min(this.text.length,this.displayChars+dt*40);return;}
  if(this.state==='fight'){this.attackCursor+=this.attackDir*330*dt;if(this.attackCursor>584||this.attackCursor<56){this.attackCursor=clamp(this.attackCursor,56,584);this.attackDir*=-1;}return;}
  if(this.state==='warning'){if(this.timer>.85){this.state='defend';this.timer=0;this.emit('defend');}return;}
  if(this.state!=='defend')return;
  this.attackTime+=dt;this.invulnerability=Math.max(0,this.invulnerability-dt);
  for(const e of this.timeline)if(!e.done&&this.attackTime>=e.at){e.done=true;e.action();}
  const s=this.soul,a=this.arena;const sx=Number(!!input.right)-Number(!!input.left),sy=Number(!!input.down)-Number(!!input.up),n=Math.hypot(sx,sy)||1,speed=190*(input.slow?.5:1);
  s.x+=sx/n*speed*dt;s.y+=sy/n*speed*dt;if(input.touch){const tx=input.touch.x-s.x,ty=input.touch.y-s.y,m=Math.hypot(tx,ty),step=Math.min(m,250*dt);if(m){s.x+=tx/m*step;s.y+=ty/m*step;}}
  s.x=clamp(s.x,a.x+12,a.x+a.w-12);s.y=clamp(s.y,a.y+12,a.y+a.h-12);
  // Poison keeps you low but never finishes you.
  if(this.poison>0){this.poisonTick+=dt;const rate=this.advice.poison?.7:.42;if(this.poisonTick>=rate){this.poisonTick=0;this.poison--;if(this.hp>1){this.hp--;this.emit('poison');}}}
  this.pollenTick=Math.max(0,this.pollenTick-dt);
  // Aqua, once she arrives on the trap route, cuts away the projectile closest to Seth.
  if(this.aquaHere&&!this.genocide){this.aquaGuard-=dt;if(this.aquaGuard<=0){let best=null,bd=78;for(const b of this.bullets)if(['petal','star','orbit','bud','lance'].includes(b.kind)&&!(b.delay&&b.age<b.delay)&&!(b.kind==='lance'&&b.age<b.warn)){const d=Math.hypot((b.kind==='lance'?b.tx:b.x)-s.x,(b.kind==='lance'?b.ty:b.y)-s.y);if(d<bd){bd=d;best=b;}}if(best){best.gone=true;this.effects.push({type:'aquaCut',x:best.kind==='lance'?best.tx:best.x,y:best.kind==='lance'?best.ty:best.y,life:.35});this.emit('aquaCut');this.aquaGuard=2.3;}else this.aquaGuard=.2;}}
  const born=[];
  for(const b of this.bullets){
   b.age+=dt;if(b.delay&&b.age<b.delay)continue;
   if(b.kind==='thorn'){const t=b.age-b.warn;b.cur=b.fizzle||t<0?0:t<b.rise?b.len*t/b.rise:t<b.rise+b.live?b.len:Math.max(0,b.len*(1-(t-b.rise-b.live)/b.fall));if(t>=0&&!b.sounded){b.sounded=true;this.emit(b.fizzle?'fizzle':'thorn');}if(t>b.rise+b.live+b.fall)b.gone=true;}
   else if(b.kind==='lance'){const t=b.age-b.warn;b.tip=t<0?-26*Math.min(1,b.age/b.warn):t*b.speed;b.tx=b.x+Math.cos(b.angle)*b.tip;b.ty=b.y+Math.sin(b.angle)*b.tip;if(t>=0&&!b.sounded){b.sounded=true;this.emit('lance');}if(b.tip>900)b.gone=true;}
   else if(b.kind==='arc'){const t=b.age-b.warn;b.prev=b.cur;b.cur=t<0?b.a0:b.a0+(b.a1-b.a0)*clamp(t/b.dur,0,1);if(t>=0&&!b.sounded){b.sounded=true;this.emit('swing');}if(t>b.dur+.25)b.gone=true;}
   else if(b.kind==='bud'){b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.age>=b.fuse){b.gone=true;born.push({kind:'pollen',x:b.x,y:b.y,R:b.R,r:0,age:0,life:1.7});for(let k=0;k<b.petals;k++){const an=k*Math.PI*2/b.petals+.4;born.push({kind:'petal',x:b.x,y:b.y,angle:an,speed:80*this.config.speed,turn:0,r:4,age:0,life:5});}this.emit('pop');}}
   else if(b.kind==='pollen'){b.r=b.R*Math.min(1,b.age/.3);if(b.age>b.life)b.gone=true;else if(Math.hypot(s.x-b.x,s.y-b.y)<b.r*.82+3&&this.pollenTick<=0&&!this.settings.invincible){this.pollenTick=.3;this.poison=Math.min(this.advice.poison?4:this.genocide?8:5,this.poison+(this.genocide?2:1));this.emit('poisoned');}}
   else if(b.kind==='petal'){b.angle+=b.turn*dt;b.x+=Math.cos(b.angle)*b.speed*dt;b.y+=Math.sin(b.angle)*b.speed*dt;}
   else if(b.kind==='orbit'){if(!b.released){b.theta+=b.spin*dt;b.x=b.cx+Math.cos(b.theta)*b.radius;b.y=b.cy+Math.sin(b.theta)*b.radius;if(b.age>=b.release){b.released=true;const d=Math.atan2(b.cy-b.y,b.cx-b.x),v=150*this.config.speed;b.vx=Math.cos(d)*v;b.vy=Math.sin(d)*v;}}else{b.x+=b.vx*dt;b.y+=b.vy*dt;}}
   else if(b.kind==='ring'){if(b.age>=b.warn){b.r=b.R*(1-clamp((b.age-b.warn)/b.close,0,1));if(b.r<=2)b.gone=true;}}
   else if(b.kind==='heart'){if(b.age>=b.warn){b.scale=1-clamp((b.age-b.warn)/b.close,0,1);if(b.scale<=.04)b.gone=true;}}
   else{b.x+=(b.vx||0)*dt;b.y+=(b.vy||0)*dt;}
   if(!b.gone&&this.hitTest(b,s)){this.hurt();if(this.state==='dead')return;}
  }
  this.bullets.push(...born);
  this.bullets=this.bullets.filter(b=>{if(b.gone)return false;if(['thorn','lance','arc','pollen','ring','heart'].includes(b.kind))return true;return b.age<(b.life??6)&&b.x>-60&&b.x<700&&b.y>-60&&b.y<540;});
  if(this.attackTime>=this.duration)this.finishWave();
 }
 snapshot(){return{scene:this.scene,state:this.state,room:this.world.room,paused:this.paused,hp:this.hp,maxHP:this.maxHP,lv:this.lv,enemyHP:this.enemyHP,turn:this.turn,waves:this.dodges,route:this.settings.route,pattern:this.pattern,talks:this.talks,calls:this.calls,anger:this.anger,aquaHere:this.aquaHere,spareable:this.ready&&this.aquaHere,poison:this.poison,ending:this.ending,items:this.items.map(i=>({...i}))};}
}
// Points along a heart outline, used for drawing and for collision.
function heartPoints(b,n=18){const pts=[];const k=b.size*b.scale/17;for(let i=0;i<n;i++){const t=i/n*Math.PI*2,x=16*Math.sin(t)**3,y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));if(Math.abs(Math.sin(t))<.12&&Math.cos(t)<0)continue;pts.push({x:b.x+x*k,y:b.y+y*k});}return pts;}

Object.assign(exports,{BattleEngine,clamp,heartPoints,MENU_BOX});
