const S=require("story.js");
const {ATTACKS,buildAttack}=require("attacks.js");
const {World}=require("world.js");
// ENCORE — Count Anansi. Fixed-step simulation for the walk and the battle, separate from Canvas presentation.
// The arena is simulated unrotated; the revolving stage turns only the picture and the controls.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const MENU_BOX={x:24,y:249,w:592,h:140};
// The trap of a pacifist run is fun first; the genocide run is fun but hard.
const DIFF={gentle:{speed:.82,warn:1.3,pacifist:1,genocide:2},normal:{speed:.95,warn:1.15,pacifist:2,genocide:3},hard:{speed:1.08,warn:1.02,pacifist:3,genocide:4}};
const LIFE_HP=[1100,650,420];
// How far the genocide fire reaches into the box: the floor at each level, and the walls on the last life.
const FIRE_BAND=[0,14,22,28],FIRE_SIDE=12;
class BattleEngine{
 constructor(){this.settings={difficulty:'normal',route:'pacifist',invincible:false,skipWalk:false};this.world=new World(this);this.reset();}
 get genocide(){return this.settings.route==='genocide';}
 reset(){
  const g=this.genocide;
  this.scene='world';this.state='world';this.paused=false;this.clock=0;this.timer=0;this.deathAge=0;this.checkpoint=null;
  this.lv=g?3:1;this.maxHP=g?28:30;this.hp=this.maxHP;this.life=1;this.enemyMax=g?LIFE_HP[0]:900;this.enemyHP=this.enemyMax;
  this.turn=0;this.dodges=0;this.selected=0;this.option=0;this.refused=0;this.applause=0;this.letter=false;this.ready=false;this.spareTries=0;this.ending='';this.brace=false;this.fire=0;this.seats=0;this.taunts=0;
  this.items=[{name:'SPIDER DONUT',heal:12,count:3},{name:'SPIDER CIDER',heal:24,count:2},{name:'BUTTERSCOTCH PIE',heal:99,count:1}];
  this.arena={...MENU_BOX};this.targetArena={...MENU_BOX};this.bullets=[];this.timeline=[];this.effects=[];this.soul={x:320,y:300};this.mode='red';this.angle=0;this.angleTarget=0;
  this.strings=null;this.lane=1;this.laneHeld=false;this.still=0;this.stillRef={x:320,y:300};this.burn=0;this.burnTick=0;this.dash=0;this.dashCD=0;this.dashDir={x:1,y:0};this.lastMove={x:1,y:0};
  this.boss={x:320,y:192,alpha:1,pose:'idle',hurt:0,dim:0};this.invulnerability=0;this.shake=0;this.attackTime=0;this.duration=0;this.pattern=null;this.attackName='';this.config=null;
  this.pages=[];this.text='';this.displayChars=0;this.speaker='narrator';this.face='neutral';this.next=null;this.encounter=0;
  this.world.reset();this.emit('reset');
  if(this.settings.skipWalk)this.startBattle(true);
 }
 emit(event){this.onEvent?.(event);}
 random(){this.seed=((this.seed||7121)*1664525+1013904223)>>>0;return this.seed/4294967296;}
 beginRoute(route){if(!['pacifist','genocide'].includes(route))return;this.settings.route=route;this.reset();}
 // ------------------------------------------------------------ dialogue
 message(pages,next='menu'){this.pages=(Array.isArray(pages)?pages:[pages]).map(p=>typeof p==='string'?S.N(p):p);this.next=next;this.showPage();}
 showPage(){const p=this.pages.shift();if(!p){this.finishDialogue();return;}this.state='dialogue';this.text=p.text;this.speaker=p.speaker;this.face=p.face??'neutral';this.displayChars=0;this.timer=0;if(p.speaker==='boss')this.boss.face=p.face;if(!this.genocide&&/seats|cheering/.test(p.text))this.seatsGoal=1;this.emit('text');}
 finishDialogue(){const n=this.next;this.next=null;if(typeof n==='function'){this.state=this.scene==='world'?'world':'menu';n();return;}if(n==='defend')this.startAttack();else if(n==='menu')this.toMenu();else if(n==='world')this.state='world';else{this.state=n;this.timer=0;this.emit('end');}}
 // ------------------------------------------------------------ battle setup
 startBattle(skip=false){
  const w=this.world;this.encFrom={x:w.seth.x-w.camera(),y:w.seth.y-42};this.scene='battle';this.state=skip?'menu':'encounter';this.encounter=0;this.timer=0;this.seed=this.genocide?40531:10007;
  this.setArena(MENU_BOX);this.arena={...MENU_BOX};this.saveCheckpoint();if(skip)this.toMenu(true);this.emit(skip?'turn':'encounter');
 }
 saveCheckpoint(){this.checkpoint={turn:this.turn,dodges:this.dodges,enemyHP:this.enemyHP,enemyMax:this.enemyMax,life:this.life,fire:this.fire,refused:this.refused,applause:this.applause,letter:this.letter,ready:this.ready,seats:this.seats,spareTries:this.spareTries,taunts:this.taunts};}
 retry(){if(this.state==='dead'&&this.deathAge<1.8)return;const cp=this.checkpoint;this.scene='battle';Object.assign(this,cp);this.checkpoint={...cp};this.hp=this.maxHP;this.burn=0;this.freshStock();this.bullets=[];this.effects=[];this.timeline=[];this.toMenu();this.message(S.N(this.genocide?'* The smoke clears.\n* Full HP. Supplies restored.':'* The curtain rises again.\n* Full HP. Supplies restored.'),'menu');this.emit('heal');}
 freshStock(){const counts={'SPIDER DONUT':3,'SPIDER CIDER':2,'BUTTERSCOTCH PIE':1};for(const i of this.items)i.count=counts[i.name];}
 options(){
  if(this.state==='act')return S.ACTS[this.settings.route];
  if(this.state==='item')return this.items.filter(i=>i.count).map(i=>`${i.name} x${i.count}`);
  if(this.state==='mercy')return['SPARE','FLEE'];
  if(this.state==='target')return['COUNT ANANSI'];return[];
 }
 navigate(dx,dy){if(this.paused)return;if(this.state==='menu'){this.selected=(this.selected+(dx||dy)+4)%4;this.emit('select');return;}const n=this.options().length;if(!n)return;if(n>2){const row=Math.floor(this.option/2),col=this.option%2,c=dx?row*2+(1-col):(1-row)*2+col;if(c<n)this.option=c;}else this.option=(this.option+(dx||dy)+n)%n;this.emit('select');}
 back(){if(this.paused)return;if(this.state==='dialogue'){this.displayChars=this.text.length;return;}if(this.options().length){this.state='menu';this.option=0;this.emit('select');}}
 chooseMenu(i){if(this.state!=='menu'||this.paused||!Number.isInteger(i)||i<0||i>3)return;this.selected=i;this.confirm();}
 togglePause(){if(['dead','spared','killed'].includes(this.state))return;this.paused=!this.paused;this.emit('pause');}
 // ------------------------------------------------------------ confirm
 confirm(){
  if(this.paused)return;
  if(this.state==='world'){this.world.interact();return;}
  // ORANGE: Z is a brave dash through bullets.
  if(this.state==='defend'&&['orange','strings'].includes(this.mode)){this.tryDash();return;}
  if(this.state==='dialogue'){if(this.displayChars<this.text.length){this.displayChars=this.text.length;return;}if(this.pages.length)this.showPage();else this.finishDialogue();return;}
  if(this.state==='dead'){this.retry();return;}
  if(['spared','killed'].includes(this.state)){if(this.timer>1.2)this.reset();return;}
  if(this.state==='menu'){this.state=['target','act','item','mercy'][this.selected];this.option=0;if(this.state==='item'&&!this.options().length)this.message('* Your pockets are empty.','menu');this.emit('select');return;}
  if(this.state==='target'){this.state='fight';this.timer=0;this.attackCursor=56;this.attackDir=1;this.emit('select');return;}
  if(this.state==='fight'){this.strike();return;}
  if(this.state==='act'){this.act(S.ACTS[this.settings.route][this.option]);return;}
  if(this.state==='item'){const item=this.items.filter(i=>i.count)[this.option];if(!item)return;const amount=Math.min(this.maxHP-this.hp,item.heal);this.hp+=amount;item.count--;this.emit('heal');this.message([S.N(`* You ${item.name==='SPIDER CIDER'?'drink':'eat'} the ${item.name}.\n* ${this.hp>=this.maxHP?'Your HP was maxed out.':'You recover '+amount+' HP.'}`)],'defend');return;}
  if(this.state==='mercy'){this.mercy(this.option);return;}
 }
 strike(){
  const accuracy=clamp(1-Math.abs(this.attackCursor-320)/264,0,1),before=this.enemyHP,g=this.genocide;
  const dmg=Math.round(g?90+90*accuracy:30+50*accuracy);
  // His first life can't end before the house starts burning; on the trap, not before the show is under way.
  const floor=g?(this.life===1&&this.dodges<7?1:0):(this.dodges>=5?0:1);
  this.enemyHP=Math.max(floor,this.enemyHP-dmg);const dealt=before-this.enemyHP;
  this.effects.push({type:'damage',text:String(dealt),life:1.1,x:320,y:70});this.boss.hurt=.55;this.shake=.18;this.emit('attack');
  if(!this.enemyHP){if(g&&this.life<3){this.reignite();return;}this.endBattle('killed');return;}
  const bank=g?S.STRIKE_G:S.STRIKE_P;this.message([S.C(g?'cackle':'amused',bank[this.turn%bank.length])],'defend');
 }
 reignite(){this.life++;this.enemyMax=this.enemyHP=LIFE_HP[this.life-1];this.fire=Math.min(3,this.fire+1);this.boss.dim=this.life-1;this.shake=.5;this.hp=this.maxHP;this.burn=0;this.freshStock();this.emit('reignite');this.saveCheckpoint();this.message(S.REIGNITE[this.life-2],'defend');}
 act(name){
  const g=this.genocide,bank=S.ACT_LINES[name];
  if(name==='CHECK'){this.message(S.N(S.CHECK[this.settings.route]),'defend');return;}
  if(name==='REFUSE'){if(this.refused>=3){this.message(S.REFUSE_EARLY,'defend');return;}this.message(bank[this.refused++],'defend');return;}
  if(name==='APPLAUD'){this.applause++;this.message(bank[Math.min(this.applause-1,bank.length-1)],'defend');return;}
  if(name==='BRACE'){this.brace=true;this.message(bank[0],'defend');return;}
  if(name==='TAUNT'){this.taunts++;this.message(bank[0],'defend');return;}
  this.message(bank[0],'defend');
 }
 mercy(i){
  const g=this.genocide;
  if(i===1){this.message(g?S.FLEE_G:S.FLEE_P,'defend');return;}
  if(!g&&this.ready){this.endBattle('spared');return;}
  const bank=g?S.SPARE_G:S.SPARE_EARLY;this.message(bank[Math.min(this.spareTries++,bank.length-1)],'defend');
 }
 endBattle(kind){
  this.bullets=[];this.timeline=[];this.mode='red';this.strings=null;this.angle=this.angleTarget=0;this.setArena(MENU_BOX);this.ending=kind;
  const lines=kind==='spared'?[...S.SPARED,...S.AQUA_P]:this.genocide?[...S.DEATH_G,...S.AQUA_G]:S.KILLED_P;
  if(kind==='killed')this.boss.dying=0;else this.seats=1;
  this.message(lines,kind);this.emit(kind==='spared'?'spare':'kill');
 }
 // ------------------------------------------------------------ turns
 toMenu(silent=false){
  this.state='menu';this.mode='red';this.strings=null;this.bullets=[];this.timeline=[];this.angle=this.angleTarget=0;this.setArena(MENU_BOX);this.boss.alpha=1;this.boss.pose='idle';this.speaker='narrator';
  const flavor=S.FLAVOR[this.settings.route];this.text=this.ready?S.FLAVOR_READY:this.turn===0?flavor[0]:flavor[1+(this.turn*3)%(flavor.length-1)];this.displayChars=this.text.length;
  if(!silent)this.emit('turn');
 }
 config_(){
  const d=DIFF[this.settings.difficulty]||DIFF.normal,g=this.genocide;
  return{speed:d.speed*(g?1.08+.05*(this.life-1):1),warn:d.warn,cooldown:g?.85:1.15,damage:Math.max(1,d[this.settings.route]-(this.brace?1:0)),density:g?.88-.05*(this.life-1):1.1,
   stillLimit:g?1:1.5,teaTilt:g?.5:.65,teaFollow:g?60:42,dashCD:g?1.1:.8,scald:g?2:1};
 }
 attackList(){
  const lists=ATTACKS[this.settings.route];
  if(!this.genocide){const l=lists.main;let i=this.dodges;if(i>=l.length)i=l.length-4+((i-l.length)%4);return l[i];}
  const l=lists['life'+this.life];const start=this.lifeStart??0;let i=this.dodges-start;if(i>=l.length)i=Math.max(0,l.length-3)+((i-l.length)%Math.min(3,l.length));return l[i];
 }
 startAttack(){
  if(this.genocide&&this.lifeStartFor!==this.life){this.lifeStartFor=this.life;this.lifeStart=this.life===1?0:this.dodges;}
  this.turn++;const attack=this.attackList();this.pattern=attack.id;this.attackName=attack.name;this.duration=attack.duration;this.config=this.config_();
  this.mode=attack.mode||'orange';this.strings=null;this.angle=this.angleTarget=0;
  this.state='warning';this.timer=0;this.attackTime=0;this.bullets=[];this.effects=this.effects.filter(e=>e.type==='damage');this.timeline=[];this.boss.alpha=1;
  this.setArena(attack.arena);this.arena={...attack.arena};this.soul={x:attack.arena.x+attack.arena.w/2,y:attack.arena.y+attack.arena.h/2};this.stillRef={...this.soul};this.still=0;this.dash=0;this.dashCD=0;this.invulnerability=.4;
  if(this.mode==='strings')this.makeStrings();
  buildAttack(this,attack);this.timeline.sort((a,b)=>a.at-b.at);this.emit('warning');
 }
 finishWave(){
  this.dodges++;this.brace=false;this.burn=0;
  this.bullets=[];this.timeline=[];this.mode='red';this.strings=null;this.angle=this.angleTarget=0;this.setArena(MENU_BOX);this.boss.alpha=1;this.boss.pose='idle';
  let lines;
  if(!this.genocide){
   const finale=this.pattern==='invite';
   if(finale&&this.refused>=3&&!this.letter){this.letter=true;this.ready=true;this.seats=1;lines=[...S.LETTER];this.emit('letter');}
   else if(finale&&!this.letter)lines=[S.C('thinking',"...You still won't play my way? Then AGAIN!"),S.N('* (He wants you to hate him. REFUSE.)')];
   else lines=(S.STORY_P[this.dodges-1]||[S.C('amused','FUHUHU... encore~!')]).slice();
  }else{
   if(this.life===1)lines=(S.STORY_G[this.dodges-1]||[S.C('cackle','FUHUHU... again~!')]).slice();
   else lines=[S.C(this.life===3?'tired':'cackle',this.life===3?'Hah... hah... warmer... WARMER~!':'FUHUHU! Keep up, little mage!')];
  }
  if(this.dodges%4===0){this.hp=this.maxHP;this.freshStock();lines.push(S.N(this.genocide?'* You catch your breath in the smoke.\n* Full HP. Supplies restored.':'* Intermission.\n* Full HP. Supplies restored.'));this.saveCheckpoint();this.emit('heal');}
  this.message(lines,'menu');
 }
 // ------------------------------------------------------------ spawners (used by attacks.js)
 setArena(a){this.targetArena={...a};}
 at(t,fn){this.timeline.push({at:t,action:fn,done:false});}
 every(start,end,interval,fn){const step=interval*this.config.density;for(let i=0,t=start;t<end;i++,t+=step){const k=i;this.at(t,()=>fn(k));}}
 spawn(b){const o={age:0,vx:0,vy:0,...b};this.bullets.push(o);return o;}
 pose(p,time=.9){this.boss.pose=p;this.boss.poseTime=time;}
 cue(text){this.effects.push({type:'instruction',text,life:1.8});}
 makeStrings(n=3){const a=this.targetArena;this.strings=[];for(let k=0;k<n;k++)this.strings.push(a.y+a.h*(k+1)/(n+1));this.lane=Math.floor(n/2);this.soul.y=this.strings[this.lane];}
 burnStrings(){if(!this.strings)return;this.effects.push({type:'stringsBurn',ys:[...this.strings],life:.9});this.strings=null;this.mode='orange';this.emit('rumble');this.cue('THE STRINGS BURN AWAY');}
 tryDash(){if(this.dashCD>0)return;this.dash=.22;this.dashCD=this.config.dashCD;this.dashDir={...this.lastMove};this.still=0;this.emit('dash');}
 // ------------------------------------------------------------ physics
 hurt(amount=this.config.damage,lethal=true){
  if(this.invulnerability>0||this.settings.invincible)return;
  this.hp=Math.max(lethal?0:Math.min(this.hp,1),this.hp-amount);this.invulnerability=this.config.cooldown;this.shake=.18;this.effects.push({type:'vignette',color:'255,120,40',life:.35});this.emit('hurt');
  if(!this.hp){this.state='dead';this.deathAge=0;this.bullets=[];this.timeline=[];this.emit('dead');}
 }
 scald(){if(this.settings.invincible)return;this.burn=Math.min(4,this.burn+this.config.scald);this.effects.push({type:'vignette',color:'255,150,60',life:.3});this.emit('scald');}
 rectHit(s,x,y,w,h){return s.x>x-4&&s.x<x+w+4&&s.y>y-4&&s.y<y+h+4;}
 hitTest(b,s){
  if(b.delay&&b.age<b.delay)return false;
  if(b.kind==='pool')return s.y>b.top-3;
  if(b.kind==='hand'){if(b.phase==='warn')return false;return this.rectHit(s,b.x-b.w/2+8,b.y-b.h/2+8,b.w-16,b.h-16);}
  if(b.kind==='wall'){if(b.age<b.warn)return false;return b.top?s.y<b.edge+3:s.y>b.edge-3;}
  if(b.kind==='beam'){if(b.age<b.warn||b.age>b.warn+b.live)return false;return b.vertical?Math.abs(s.x-b.x)<b.w/2+3:Math.abs(s.y-b.y)<b.w/2+3;}
  if(b.kind==='web'){if(Math.abs(s.x-b.x)>5)return false;return Math.abs(s.y-b.gy)>b.gh/2;}
  if(b.kind==='tea')return b.phase==='pour'&&Math.abs(s.x-b.x)<10&&s.y>b.y;
  if(b.kind==='candle'){const p=candlePos(b);return Math.hypot(s.x-p.x,s.y-p.y)<b.r+4;}
  return Math.hypot(s.x-b.x,s.y-b.y)<(b.r||4)+4;
 }
 update(dt,input={}){
  if(this.state==='dead'){if(!this.paused){dt=Math.min(Math.max(dt,0),.04);this.clock+=dt;this.deathAge+=dt;}return;}
  dt=clamp(dt,0,.025);if(this.paused)return;this.clock+=dt;this.timer+=dt;
  this.effects=this.effects.filter(e=>(e.life-=dt)>0);this.shake=Math.max(0,this.shake-dt);this.boss.hurt=Math.max(0,this.boss.hurt-dt);
  if(this.boss.poseTime>0){this.boss.poseTime-=dt;if(this.boss.poseTime<=0)this.boss.pose='idle';}
  if(this.boss.dying!==undefined)this.boss.dying+=dt;
  this.seats+=((this.seatsGoal??0)>this.seats?Math.min(dt*.25,(this.seatsGoal??0)-this.seats):0);
  if(this.scene==='world'){this.world.update(dt,input);if(this.state==='dialogue')this.displayChars=Math.min(this.text.length,this.displayChars+dt*36);return;}
  if(this.state==='encounter'){this.encounter+=dt;if(this.encounter>1.55){this.toMenu(true);this.message(this.genocide?[S.N('* Count Anansi attacks.')]:[S.N('* The curtain rises.\n* Count Anansi takes the stage!')],'menu');}return;}
  for(const k of ['x','y','w','h']){const d=this.targetArena[k]-this.arena[k];this.arena[k]+=Math.abs(d)<.3?d:d*Math.min(1,dt*12);}
  this.angle+=(this.angleTarget-this.angle)*Math.min(1,dt*3.2);
  if(this.state==='dialogue'){this.displayChars=Math.min(this.text.length,this.displayChars+dt*40);return;}
  if(this.state==='fight'){this.attackCursor+=this.attackDir*330*dt;if(this.attackCursor>584||this.attackCursor<56){this.attackCursor=clamp(this.attackCursor,56,584);this.attackDir*=-1;}return;}
  if(this.state==='warning'){if(this.timer>.85){this.state='defend';this.timer=0;this.emit('defend');}return;}
  if(this.state!=='defend')return;
  this.attackTime+=dt;this.invulnerability=Math.max(0,this.invulnerability-dt);this.dashCD=Math.max(0,this.dashCD-dt);this.dash=Math.max(0,this.dash-dt);
  for(const e of this.timeline)if(!e.done&&this.attackTime>=e.at){e.done=true;e.action();}
  const s=this.soul,a=this.arena,c=Math.cos(this.angle),sn=Math.sin(this.angle);
  let sx=Number(!!input.right)-Number(!!input.left),sy=Number(!!input.down)-Number(!!input.up);
  // The revolving stage turns the controls with it.
  let dx=sx*c+sy*sn,dy=-sx*sn+sy*c;const n=Math.hypot(dx,dy)||1;dx/=n;dy/=n;if(sx||sy)this.lastMove={x:dx,y:dy};
  const base=190*(input.slow?.5:1),speed=this.dash>0?base*2.6:base;
  if(this.mode==='strings'&&this.strings){
   s.x+=(this.dash>0?this.dashDir.x:dx)*speed*dt;
   const lane=Math.round(dy);if(lane&&!this.laneHeld){this.lane=clamp(this.lane+lane,0,this.strings.length-1);this.emit('select');}this.laneHeld=!!lane;
   s.y+=(this.strings[this.lane]-s.y)*Math.min(1,dt*18);
  }else if(this.dash>0){s.x+=this.dashDir.x*speed*dt;s.y+=this.dashDir.y*speed*dt;}
  else{s.x+=dx*speed*dt*(sx||sy?1:0);s.y+=dy*speed*dt*(sx||sy?1:0);
   if(input.touch){const p=this.localPoint(input.touch),tx=p.x-s.x,ty=p.y-s.y,m=Math.hypot(tx,ty),step=Math.min(m,250*dt);if(m){s.x+=tx/m*step;s.y+=ty/m*step;this.lastMove={x:tx/m,y:ty/m};}}}
  s.x=clamp(s.x,a.x+12,a.x+a.w-12);s.y=clamp(s.y,a.y+12,a.y+a.h-12);
  // ORANGE: bravery. Stand still and his teapot tips over you.
  if(['orange','strings'].includes(this.mode)){
   if(Math.hypot(s.x-this.stillRef.x,s.y-this.stillRef.y)>10){this.stillRef={x:s.x,y:s.y};this.still=Math.max(0,this.still-dt*3);}else this.still+=dt;
   if(this.still>this.config.stillLimit&&!this.bullets.some(b=>b.kind==='tea')){this.spawn({kind:'tea',x:s.x,y:a.y+4,phase:'tilt',t:0});this.still=0;this.emit('tea');}
  }
  if(this.burn>0){this.burnTick+=dt;if(this.burnTick>=.32){this.burnTick=0;this.burn--;if(this.hp>(this.genocide?0:1)){this.hp--;this.emit('burn');if(!this.hp){this.state='dead';this.deathAge=0;this.bullets=[];this.timeline=[];this.emit('dead');return;}}}}
  // The genocide fire: the floor burns, and on the last life the walls too.
  if(this.fire>0&&!this.dash){const band=FIRE_BAND[this.fire];if(s.y>a.y+a.h-band||this.fire>=3&&(s.x<a.x+FIRE_SIDE||s.x>a.x+a.w-FIRE_SIDE))this.hurt(Math.max(1,this.config.damage-2));if(this.state==='dead')return;}
  const born=[];
  for(const b of this.bullets){
   b.age+=dt;if(b.delay&&b.age<b.delay)continue;
   if(b.kind==='spider'){if(b.state==='down'){b.y+=b.speed*dt;if(b.y>=b.ty){b.y=b.ty;b.state='hang';b.t=0;}}else if(b.state==='hang'){b.t+=dt;b.x=b.x0+Math.sin(b.t*b.swing)*b.amp;if(b.t>b.hang){b.state='up';}}else{b.y-=b.speed*1.3*dt;if(b.y<b.top-20)b.gone=true;}}
   else if(b.kind==='runner'){b.x+=b.vx*dt;b.y=b.y0+Math.abs(Math.sin(b.age*9))*-6;if(b.burning){b.trail=(b.trail||0)+dt;if(b.trail>.11){b.trail=0;born.push({kind:'flame',x:b.x,y:b.y0+4,r:5,age:0,life:.9});}}}
   else if(b.kind==='flame'){if(b.age>b.life)b.gone=true;}
   else if(b.kind==='pool'){b.top=Math.max(b.limit,b.top-b.rise*dt);}
   else if(b.kind==='drip'){b.vy+=260*dt;b.y+=b.vy*dt;}
   else if(b.kind==='candle'){b.t=(b.t||0)+dt;if(b.ember&&b.t>b.nextEmber){b.nextEmber=b.t+b.ember;const p=candlePos(b);born.push({kind:'drip',ember:true,x:p.x,y:p.y+8,vy:20,r:4,age:0,life:4});}if(b.age>b.life)b.gone=true;}
   else if(b.kind==='hand'){b.t=(b.t||0)+dt;const {warn,inT,hold,outT}=b;if(b.t<warn)b.phase='warn';else if(b.t<warn+inT){b.phase='in';const u=(b.t-warn)/inT;b.x=b.x0+(b.tx-b.x0)*(1-(1-u)**3);}else if(b.t<warn+inT+hold){b.phase='hold';b.x=b.tx;}else if(b.t<warn+inT+hold+outT){b.phase='out';const u=(b.t-warn-inT-hold)/outT;b.x=b.tx+(b.x0-b.tx)*u*u;}else b.gone=true;}
   else if(b.kind==='wall'){const u=clamp((b.age-b.warn)/b.close,0,1);b.edge=b.top?b.from+(b.to-b.from)*u:b.from-(b.from-b.to)*u;if(b.age>b.warn+b.close+b.hold)b.gone=true;}
   else if(b.kind==='beam'){if(b.age>b.warn+b.live+.15)b.gone=true;}
   else if(b.kind==='web'){b.x+=b.vx*dt;if(b.x<a.x-20||b.x>a.x+a.w+20)b.gone=true;}
   else if(b.kind==='blade'){if(!b.released){b.theta+=b.spin*dt;b.x=b.cx+Math.cos(b.theta)*b.radius;b.y=b.cy+Math.sin(b.theta)*b.radius;if(b.age>=b.release){b.released=true;const d=Math.atan2(b.cy-b.y,b.cx-b.x),v=165*this.config.speed;b.vx=Math.cos(d)*v;b.vy=Math.sin(d)*v;}}else{b.x+=b.vx*dt;b.y+=b.vy*dt;}}
   else if(b.kind==='tea'){b.t+=dt;b.x+=clamp(s.x-b.x,-this.config.teaFollow*dt,this.config.teaFollow*dt);if(b.phase==='tilt'&&b.t>this.config.teaTilt){b.phase='pour';b.t=0;this.emit('pour');}else if(b.phase==='pour'&&b.t>.8)b.gone=true;}
   else{b.x+=(b.vx||0)*dt;b.y+=(b.vy||0)*dt;}
   if(b.gone)continue;
   if(this.dash>0&&b.kind!=='tea')continue;
   if(this.hitTest(b,s)){if(b.kind==='tea'){if(this.invulnerability<=0){this.scald();this.invulnerability=.5;}}else{this.hurt();if(this.state==='dead')return;}}
  }
  this.bullets.push(...born);
  this.bullets=this.bullets.filter(b=>{if(b.gone)return false;if(['pool','hand','wall','beam','web','tea','spider','candle','flame'].includes(b.kind))return true;return b.age<(b.life??6)&&b.x>-60&&b.x<700&&b.y>-60&&b.y<540;});
  if(this.attackTime>=this.duration)this.finishWave();
 }
 localPoint(p){const a=this.arena,cx=a.x+a.w/2,cy=a.y+a.h/2,dx=p.x-cx,dy=p.y-cy,c=Math.cos(this.angle),s=Math.sin(this.angle);return{x:cx+dx*c+dy*s,y:cy-dx*s+dy*c};}
 snapshot(){return{scene:this.scene,state:this.state,room:this.world.room,paused:this.paused,hp:this.hp,maxHP:this.maxHP,lv:this.lv,enemyHP:this.enemyHP,life:this.life,fire:this.fire,turn:this.turn,waves:this.dodges,route:this.settings.route,pattern:this.pattern,mode:this.mode,refused:this.refused,letter:this.letter,spareable:this.ready,ending:this.ending,items:this.items.map(i=>({...i}))};}
}
// A swinging candelabra: pivot above the box, the flame at the end of the arm.
function candlePos(b){const ang=Math.sin((b.t||0)*b.speed+b.phase)*b.amp;return{x:b.px+Math.sin(ang)*b.L,y:b.py+Math.cos(ang)*b.L};}
Object.assign(exports,{BattleEngine,clamp,candlePos,MENU_BOX,FIRE_BAND,FIRE_SIDE});
