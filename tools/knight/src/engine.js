const S=require("story.js");
const {buildWave,planWave}=require("attacks.js");
const {World}=require("world.js");
// THE WHITE ROARING KNIGHT — fixed-step simulation for the walk and the battle, separate from Canvas presentation.
// The battle starts as an ordinary Undertale battle (ui 'ut'). After four waves the Knight roars and the battle UI
// breaks apart and rebuilds as a Deltarune battle (ui 'dr'): TP from grazing, DEFEND, a TP spell, FIGHT ACT ITEM
// SPARE DEFEND, and two MERCY bars, because the Knight is trying to spare Seth while Seth tries to spare it.
// When both reach 100% the finale plays, and then they spare each other.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const MENU_BOX={x:24,y:249,w:592,h:140};
const DIFF={gentle:{speed:.85,warn:1.3,cooldown:1.1,damage:1,density:1.15},normal:{speed:1,warn:1.12,cooldown:.95,damage:2,density:1},hard:{speed:1.1,warn:1,cooldown:.85,damage:3,density:.88}};
// How much each thing moves each MERCY bar. Knight: what Seth does to it. Seth: what the Knight does for him.
const KMERCY={WISH:5,LISTEN:4,'ROAR BACK':4,PERSEVERE:9,fight:3,fightGood:2,wave:2};
const SMERCY={waveUT:3,waveDR:5,gift:2,zee:1,spare:6,defend:5};
// Grazing earns TP the way it does in Aqua's fight: 6 TP a second while any damaging hitbox is close, one
// aggregate amount per tick (no stacking from overlapping bullets, nothing from warnings, gifts or a hit).
const TP_COST=40,GRAZE_RATE=6;
const angleDiff=(a,b)=>{let d=(a-b)%(Math.PI*2);if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;return d;};
function segDist(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,L=dx*dx+dy*dy||1,t=clamp(((px-x1)*dx+(py-y1)*dy)/L,0,1);return Math.hypot(px-(x1+dx*t),py-(y1+dy*t));}
class BattleEngine{
 constructor(){this.settings={difficulty:'normal',invincible:false,skipWalk:false};this.world=new World(this);this.reset();}
 reset(){
  this.scene='world';this.state='world';this.paused=false;this.clock=0;this.timer=0;this.deathAge=0;this.checkpoint=null;
  this.lv=1;this.maxHP=30;this.hp=30;this.enemyMax=1500;this.enemyHP=this.enemyMax;this.ui='ut';this.breakTime=0;
  this.turn=0;this.dodges=0;this.selected=0;this.option=0;this.knightMercy=0;this.sethMercy=0;this.tp=0;this.unifiedCount=0;this.finaleDone=false;this.ready=false;this.unifiedTold=false;
  this.counts={};this.defending=false;this.persevere=false;this.spareTries=0;this.tiredTold=false;this.pendingDR=null;this.sleepy=0;
  this.items=[{name:'SEA TEA',heal:10,count:3},{name:'ASTRONAUT FOOD',heal:21,count:2},{name:'ABANDONED QUICHE',heal:34,count:1}];
  this.arena={...MENU_BOX};this.targetArena={...MENU_BOX};this.bullets=[];this.timeline=[];this.effects=[];this.soul={x:320,y:300};
  this.boss={x:320,y:224,pose:'idle',poseTime:0,hurt:0};this.invulnerability=0;this.shake=0;this.attackTime=0;this.duration=0;this.plan=null;this.attackName='';this.config=this.config_();
  this.pages=[];this.text='';this.displayChars=0;this.speaker='narrator';this.heart='all';this.next=null;this.encounter=0;this.ending='';this.seed=24601;
  this.world.reset();this.emit('reset');
  if(this.settings.skipWalk)this.startBattle(true);
 }
 emit(event){this.onEvent?.(event);}
 random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 // ------------------------------------------------------------ dialogue
 message(pages,next='menu'){this.pages=(Array.isArray(pages)?pages:[pages]).map(p=>typeof p==='string'?S.N(p):p);this.next=next;this.showPage();}
 showPage(){const p=this.pages.shift();if(!p){this.finishDialogue();return;}this.state='dialogue';this.text=p.text;this.speaker=p.speaker;this.heart=p.heart||'all';this.face=p.face||'face';this.displayChars=0;this.timer=0;this.emit('text');}
 finishDialogue(){const n=this.next;this.next=null;if(typeof n==='function'){this.state=this.scene==='world'?'world':'menu';n();return;}if(n==='defend')this.startAttack();else if(n==='menu')this.toMenu();else if(n==='world')this.state='world';else{this.state=n;this.timer=0;this.emit('end');}}
 // ------------------------------------------------------------ battle setup
 startBattle(skip=false){
  const w=this.world;this.encFrom={x:w.seth.x-w.camera(),y:w.seth.y-42};this.scene='battle';this.state=skip?'menu':'encounter';this.encounter=0;this.timer=0;
  this.setArena(MENU_BOX);this.arena={...MENU_BOX};this.saveCheckpoint();if(skip)this.toMenu(true);this.emit(skip?'turn':'encounter');
 }
 snapshotState(){return{ui:this.ui,turn:this.turn,dodges:this.dodges,enemyHP:this.enemyHP,knightMercy:this.knightMercy,sethMercy:this.sethMercy,tp:this.tp,unifiedCount:this.unifiedCount,finaleDone:this.finaleDone,ready:this.ready,unifiedTold:this.unifiedTold,counts:{...this.counts},spareTries:this.spareTries,tiredTold:this.tiredTold};}
 saveCheckpoint(){this.checkpoint=this.snapshotState();}
 retry(){if(this.state==='dead'&&this.deathAge<1.8)return;const cp=this.checkpoint;this.scene='battle';Object.assign(this,{...cp,counts:{...cp.counts}});this.hp=this.maxHP;this.freshStock();this.bullets=[];this.effects=[];this.timeline=[];this.defending=false;this.persevere=false;this.sleepy=0;this.toMenu();this.message(S.N('* The crystal hums you back together.\n* Full HP. Supplies restored.'),'menu');this.emit('heal');}
 freshStock(){const counts={'SEA TEA':3,'ASTRONAUT FOOD':2,'ABANDONED QUICHE':1};for(const i of this.items)i.count=counts[i.name];}
 get dr(){return this.ui==='dr';}
 menuLabels(){return this.dr?['FIGHT','ACT','ITEM','SPARE','DEFEND']:['FIGHT','ACT','ITEM','MERCY'];}
 options(){
  if(this.state==='act')return this.dr?S.ACTS_DR:S.ACTS_UT;
  if(this.state==='item')return this.items.filter(i=>i.count).map(i=>`${i.name} x${i.count}`);
  if(this.state==='mercy')return['SPARE','FLEE'];
  if(this.state==='target')return['KNIGHT'];
  if(this.state==='drtarget')return['WHITE ROARING KNIGHT'];
  return[];
 }
 navigate(dx,dy){if(this.paused)return;if(this.state==='menu'){const n=this.menuLabels().length;this.selected=(this.selected+(dx||dy)+n)%n;this.emit('select');return;}const n=this.options().length;if(!n)return;if(this.dr&&this.state==='act'||n<=2||this.state==='drtarget')this.option=(this.option+(dy||dx)+n)%n;else{const row=Math.floor(this.option/2),col=this.option%2,c=dx?row*2+(1-col):(1-row)*2+col;if(c<n)this.option=c;}this.emit('select');}
 back(){if(this.paused)return;if(this.state==='dialogue'){this.displayChars=this.text.length;return;}if(this.options().length){this.state='menu';this.option=0;this.emit('select');}}
 chooseMenu(i){if(this.state!=='menu'||this.paused||!Number.isInteger(i)||i<0||i>=this.menuLabels().length)return;this.selected=i;this.confirm();}
 togglePause(){if(['dead','spared'].includes(this.state))return;this.paused=!this.paused;this.emit('pause');}
 // ------------------------------------------------------------ confirm
 confirm(){
  if(this.paused)return;
  if(this.state==='world'){this.world.interact();return;}
  if(this.state==='dialogue'){if(this.displayChars<this.text.length){this.displayChars=this.text.length;return;}if(this.pages.length)this.showPage();else this.finishDialogue();return;}
  if(this.state==='dead'){this.retry();return;}
  if(this.state==='spared'){if(this.timer>1.2)this.reset();return;}
  if(this.state==='menu'){
   const label=this.menuLabels()[this.selected];this.option=0;this.emit('select');
   if(label==='FIGHT'){this.state=this.dr?'drtarget':'target';this.pendingDR='fight';return;}
   if(label==='ACT'){if(this.dr){this.state='drtarget';this.pendingDR='act';}else this.state='act';return;}
   if(label==='ITEM'){this.state='item';if(!this.options().length)this.message('* Your pockets are empty.','menu');return;}
   if(label==='MERCY'){this.state='mercy';return;}
   if(label==='SPARE'){this.state='drtarget';this.pendingDR='spare';return;}
   if(label==='DEFEND'){this.defend();return;}
  }
  if(this.state==='target'){this.state='fight';this.timer=0;this.attackCursor=56;this.attackDir=1;this.emit('select');return;}
  if(this.state==='fight'){this.strike(clamp(1-Math.abs(this.attackCursor-320)/264,0,1));return;}
  if(this.state==='drtarget'){const p=this.pendingDR;this.emit('select');if(p==='fight'){this.state='drfight';this.timer=0;this.drCursor=1;}else if(p==='act'){this.state='act';this.option=0;}else this.spare();return;}
  if(this.state==='drfight'){this.drStrike();return;}
  if(this.state==='act'){this.act(this.options()[this.option]);return;}
  if(this.state==='item'){const item=this.items.filter(i=>i.count)[this.option];if(!item)return;const amount=Math.min(this.maxHP-this.hp,item.heal);this.hp+=amount;item.count--;this.emit('heal');this.message([S.N(`* You ${item.name==='SEA TEA'?'drink':'eat'} the ${item.name}.\n* ${this.hp>=this.maxHP?'Your HP was maxed out.':'You recover '+amount+' HP.'}`)],'defend');return;}
  if(this.state==='mercy'){if(this.option===1){this.message(S.FLEE,'defend');return;}this.spare();return;}
 }
 // MERCY for the Knight (Seth's doing) and for Seth (the Knight's). Both show once the battle turns Deltarune.
 mercyKnight(n){const before=this.knightMercy;const tired=this.enemyHP<this.enemyMax*.3?1.5:1;this.knightMercy=clamp(this.knightMercy+Math.round(n*tired),0,100);if(this.dr&&this.knightMercy>before)this.effects.push({type:'mercy',who:'knight',text:'+'+(this.knightMercy-before)+'%',life:1.2});}
 spareSeth(n){const before=this.sethMercy;this.sethMercy=clamp(this.sethMercy+n,0,100);if(this.dr&&this.sethMercy>before)this.effects.push({type:'mercy',who:'seth',text:'+'+(this.sethMercy-before)+'%',life:1.2});}
 // The Notebook (Undertale half) and the Deltarune FIGHT bar both land here. Hitting the dream is part of the dream.
 strike(quality){
  const dmg=Math.round(40+60*quality);this.enemyHP=Math.max(1,this.enemyHP-dmg);
  this.effects.push({type:'damage',text:String(dmg),life:1.1,x:this.dr?520:320,y:this.dr?120:70});this.boss.hurt=.55;this.shake=.18;this.emit('attack');
  this.mercyKnight(KMERCY.fight+(quality>=.8?KMERCY.fightGood:0));
  const lines=[S.K((quality>=.4?S.STRIKE:S.STRIKE_WEAK)[this.turn%(quality>=.4?S.STRIKE.length:S.STRIKE_WEAK.length)],'wild')];
  if(this.enemyHP<this.enemyMax*.3&&!this.tiredTold){this.tiredTold=true;lines.push(...S.TIRED);}
  this.message(lines,'defend');
 }
 drStrike(){const q=this.drCursor<=0?0:clamp(1-Math.abs(this.drCursor-.14)*3.2,0,1);if(q<=0){this.message([S.N('* SETH missed!')],'defend');return;}this.strike(q);}
 act(name){
  const c=this.counts[name]=(this.counts[name]||0)+1;
  if(name==='CHECK'){this.message(S.CHECK,'defend');return;}
  if(name==='PERSEVERE'){if(this.tp<TP_COST){this.message(S.NO_TP,'act');return;}this.tp-=TP_COST;this.persevere=true;this.hp=Math.min(this.maxHP,this.hp+6);this.emit('spell');this.mercyKnight(KMERCY.PERSEVERE);this.message([...S.PERSEVERE,S.N('* SETH recovered 6 HP.\n* Damage is halved this turn.')],'defend');return;}
  const bank={WISH:S.WISH,LISTEN:S.LISTEN,'ROAR BACK':S.ROAR}[name];
  // Repeating the same ACT is worth less after the third time.
  this.mercyKnight(Math.round(KMERCY[name]*(c>3?.6:1)));if(name==='ROAR BACK')this.emit('roar');
  this.message(bank[Math.min(c-1,bank.length-1)],'defend');
 }
 spare(){
  if(this.ready){this.endBattle();return;}
  this.spareSeth(SMERCY.spare);
  if(!this.dr){this.message(S.SPARE_UT,'defend');return;}
  this.message([...S.SPARE_EARLY[Math.min(this.spareTries++,S.SPARE_EARLY.length-1)],S.N(`* (The Knight's MERCY: ${this.knightMercy}%.)`)],'defend');
 }
 defend(){this.defending=true;this.tp=Math.min(100,this.tp+16);this.spareSeth(SMERCY.defend);this.emit('defend');this.message(S.DEFEND,'defend');}
 endBattle(){this.bullets=[];this.timeline=[];this.setArena(MENU_BOX);this.ending='spared';this.message(S.SPARED,'spared');this.emit('spare');}
 // ------------------------------------------------------------ turns
 toMenu(silent=false){
  this.state='menu';this.mode='red';this.bullets=[];this.timeline=[];this.setArena(MENU_BOX);this.boss.pose='idle';this.speaker='narrator';
  const f=this.dr?S.FLAVOR_DR:S.FLAVOR;this.text=this.ready?S.FLAVOR_READY:f[this.turn%f.length];this.displayChars=this.text.length;
  if(this.selected>=this.menuLabels().length)this.selected=0;if(!silent)this.emit('turn');
 }
 config_(){const d=DIFF[this.settings?.difficulty]||DIFF.normal,u=this.unifiedCount>0||this.finaleDone?1.06:1;return{speed:d.speed*u,warn:d.warn,cooldown:d.cooldown,damage:d.damage,density:d.density};}
 startAttack(force=null){
  // force: a plan to play instead of the Knight's own choice (screenshots and tests).
  this.turn++;this.config=this.config_();const plan=force||planWave(this);this.plan=plan;
  this.attackName=plan.kind==='triple'?plan.picks.map(p=>S.HEART_ACTS[p]).join('\n'):plan.name;
  this.state='warning';this.timer=0;this.attackTime=0;this.bullets=[];this.effects=this.effects.filter(e=>['damage','mercy'].includes(e.type));this.timeline=[];this.boss.pose='idle';
  this.mode='red';this.split=false;this.voidMode=false;this.prevIn={};this.setArena(plan.box,true);this.soul={x:plan.box.x+plan.box.w/2,y:plan.box.y+plan.box.h/2};this.invulnerability=.4;this.sleepy=0;
  // The arena is set before the wave is built, so the moves aim inside the right box.
  this.targetArena={...plan.box};this.duration=buildWave(this,plan);this.timeline.sort((a,b)=>a.at-b.at);this.emit('warning');
 }
 finishWave(){
  const plan=this.plan;this.dodges++;this.defending=false;this.persevere=false;this.sleepy=0;
  this.bullets=[];this.timeline=[];this.setArena(MENU_BOX);this.boss.pose='idle';
  this.mercyKnight(KMERCY.wave);this.spareSeth(this.dr?SMERCY.waveDR:SMERCY.waveUT);
  let lines=[];
  if(plan.kind==='arrival'){lines=S.STORY[Math.min(this.dodges-1,S.STORY.length-1)].slice();if(this.dodges===4){lines.push(...S.BREAK);this.message(lines,()=>this.startBreak());return;}}
  else if(plan.kind==='finale'){this.finaleDone=true;this.ready=true;this.knightMercy=100;this.sethMercy=100;this.message(S.FINALE_END,'menu');return;}
  else{if(plan.kind==='unified')this.unifiedCount++;const i=this.dodges-5;if(i>=0&&i<S.STORY_DR.length)lines=S.STORY_DR[i].slice();}
  // The next turn's big moments get their own lines.
  if(this.dr&&!this.finaleDone){if(this.knightMercy>=100&&this.sethMercy>=100)lines.push(...S.FINALE_INTRO);else if(this.knightMercy>=70&&!this.unifiedTold){this.unifiedTold=true;lines.push(...S.UNIFIED);}}
  if(this.dodges%4===0){this.hp=this.maxHP;this.freshStock();lines.push(S.N('* The crystal\'s light steadies you.\n* Full HP. Supplies restored.'));this.saveCheckpoint();this.emit('heal');}
  this.message(lines.length?lines:[S.N(this.text||'* ...')],'menu');
 }
 startBreak(){this.scene='battle';this.state='uibreak';this.breakTime=0;this.bullets=[];this.effects=[];this.setArena(MENU_BOX);this.emit('roarBreak');}
 finishBreak(){this.ui='dr';this.selected=0;this.saveCheckpoint();this.hp=this.maxHP;this.message(S.AFTER_BREAK,'menu');this.emit('drStart');}
 // ------------------------------------------------------------ spawners (used by attacks.js)
 // In the Deltarune half the box spins into each new shape, as the Knight's does.
 setArena(a,spin=false){this.targetArena={...a};if(spin&&this.ui==='dr')this.boxSpin=.45;}
 at(t,fn){this.timeline.push({at:t,action:fn,done:false});}
 spawn(b){const o={age:0,vx:0,vy:0,...b};this.bullets.push(o);return o;}
 pose(p,time=.9){this.boss.pose=p;this.boss.poseTime=time;}
 cue(text){this.effects.push({type:'instruction',text,life:1.6});}
 spike(edge,pos,{w=18,len,warn=.75,live=.5,rise=.1}={}){const a=this.targetArena;let x,y,dx=0,dy=0;if(edge==='bottom'){x=pos;y=a.y+a.h;dy=-1;}else{x=pos;y=a.y;dy=1;}return this.spawn({kind:'spike',x,y,dx,dy,w,len:len??a.h*.5,warn:warn*this.config.warn,rise,live,fall:.15});}
 // ------------------------------------------------------------ physics
 hurt(amount=this.config.damage){
  if(this.invulnerability>0||this.settings.invincible)return;
  if(this.defending||this.persevere)amount=Math.max(1,Math.ceil(amount/2));
  this.hp=Math.max(0,this.hp-amount);this.invulnerability=this.config.cooldown;this.shake=.18;this.effects.push({type:'vignette',color:'90,140,255',life:.35});this.emit('hurt');
  if(!this.hp){this.state='dead';this.deathAge=0;this.bullets=[];this.timeline=[];this.emit('dead');}
 }
 // margin > 0 asks "is the SOUL within margin of it?" (the graze test).
 hitTest(b,s,m=0){
  if(b.kind==='gift'||b.kind==='zee'||b.kind==='scarf'||b.kind==='arrow'||b.kind==='eruption')return false;
  if(b.delay&&b.age<b.delay)return false;
  if(b.kind==='dashline'){if(b.age<b.warn||b.age>b.warn+b.live)return false;return Math.abs(s.y-b.y)<b.w/2+3+m;}
  if(b.kind==='sword'){if(b.age<b.warn)return false;const top=b.vy>0?b.y-b.len:b.y,bot=b.vy>0?b.y:b.y+b.len;return Math.abs(s.x-b.x)<b.w/2+3+m&&s.y>top-3-m&&s.y<bot+3+m;}
  if(b.kind==='bar'){if(Math.abs(s.x-b.x)>b.w/2+3+m)return false;if(b.blue)return !m&&this.moved;return Math.abs(s.y-b.gapY)>b.gapH/2-3-m;}
  if(b.kind==='laser'){if(b.age<b.warn||b.age>b.warn+b.live)return false;const cx=Math.cos(b.angle),cy=Math.sin(b.angle),rx=s.x-b.ox,ry=s.y-b.oy;return rx*cx+ry*cy>0&&Math.abs(rx*cy-ry*cx)<b.w/2+3+m;}
  if(b.kind==='cone'){if(b.age<b.warn||b.age>b.warn+b.live)return false;const d=Math.hypot(s.x-b.ox,s.y-b.oy);return d<b.len&&Math.abs(angleDiff(Math.atan2(s.y-b.oy,s.x-b.ox),b.angle))<b.half+(m?.04:0);}
  if(b.kind==='spike'){if(b.age<b.warn)return false;const L=b.cur||0;if(L<4)return false;const rx=s.x-b.x,ry=s.y-b.y,t=rx*b.dx+ry*b.dy,perp=Math.abs(rx*b.dy-ry*b.dx);if(t<-3-m||t>L+2+m)return false;return perp<(b.w*.32)*(1-t/L*.7)+4+m;}
  if(b.kind==='slash'){if(b.age<b.warn||b.age>b.warn+b.live)return false;return segDist(s.x,s.y,b.x1,b.y1,b.x2,b.y2)<b.w/2+3+m;}
  if(b.kind==='lance'){if(b.age<b.warn)return false;const cx=Math.cos(b.angle),cy=Math.sin(b.angle),rx=s.x-b.tx,ry=s.y-b.ty,t=-(rx*cx+ry*cy),perp=Math.abs(rx*cy-ry*cx);return t>-6-m&&t<b.len+m&&perp<b.w/2+3+m;}
  if(b.kind==='buster'){if(b.age<b.warn)return false;const d=Math.hypot(s.x-b.x,s.y-b.y);if(Math.abs(d-b.R)>b.thick/2+3+m)return false;return Math.abs(angleDiff(Math.atan2(s.y-b.y,s.x-b.x),b.facing))<b.span+(m?.08:0);}
  if(b.kind==='ribbon'){const a=this.arena;if(s.x<b.x||s.x>b.x+b.wd)return false;if(Math.abs(s.x-b.gap)<b.gapW/2-m)return false;return Math.abs(s.y-ribbonY(b,s.x))<b.w/2+3+m;}
  return Math.hypot(s.x-b.x,s.y-b.y)<(b.r||4)+4+m;
 }
 update(dt,input={}){
  if(this.state==='dead'){if(!this.paused){dt=Math.min(Math.max(dt,0),.04);this.clock+=dt;this.deathAge+=dt;}return;}
  dt=clamp(dt,0,.025);if(this.paused)return;this.clock+=dt;this.timer+=dt;
  this.effects=this.effects.filter(e=>(e.life-=dt)>0);this.shake=Math.max(0,this.shake-dt);this.boss.hurt=Math.max(0,this.boss.hurt-dt);
  if(this.boss.poseTime>0){this.boss.poseTime-=dt;if(this.boss.poseTime<=0)this.boss.pose='idle';}
  if(this.scene==='world'){this.world.update(dt,input);if(this.state==='dialogue')this.displayChars=Math.min(this.text.length,this.displayChars+dt*36);return;}
  if(this.state==='encounter'){this.encounter+=dt;if(this.encounter>1.55){this.toMenu();}return;}
  if(this.state==='uibreak'){this.breakTime+=dt;if(this.breakTime>4.6)this.finishBreak();return;}
  for(const k of ['x','y','w','h']){const d=this.targetArena[k]-this.arena[k];this.arena[k]+=Math.abs(d)<.3?d:d*Math.min(1,dt*12);}
  if(this.state==='dialogue'){this.displayChars=Math.min(this.text.length,this.displayChars+dt*40);return;}
  if(this.state==='fight'){this.attackCursor+=this.attackDir*330*dt;if(this.attackCursor>584||this.attackCursor<56){this.attackCursor=clamp(this.attackCursor,56,584);this.attackDir*=-1;}return;}
  if(this.state==='drfight'){this.drCursor-=dt*1.05;if(this.drCursor<=-.08){this.drCursor=0;this.drStrike();}return;}
  if(this.state==='warning'){if(this.timer>(this.dr&&this.plan.kind==='triple'?1.9:1.1)){this.state='defend';this.timer=0;this.emit('defend');}return;}
  if(this.state!=='defend')return;
  this.attackTime+=dt;this.invulnerability=Math.max(0,this.invulnerability-dt);this.sleepy=Math.max(0,this.sleepy-dt);
  for(const e of this.timeline)if(!e.done&&this.attackTime>=e.at){e.done=true;e.action();}
  const s=this.soul,a=this.arena,sx=Number(!!input.right)-Number(!!input.left),sy=Number(!!input.down)-Number(!!input.up),n=Math.hypot(sx,sy)||1,speed=190*(input.slow?.5:1)*(this.sleepy>0?.55:1);
  const ox=s.x,oy=s.y;
  if(this.mode==='green'){
   // GREEN (the HAMMER OF JUSTICE wave): the SOUL holds still at the centre; the shield faces the arrow pressed last.
   const pr=this.prevIn||{},SIDES=['up','right','down','left'];const fresh=SIDES.find(k=>input[k]&&!pr[k]);if(fresh)this.shield=fresh;else if(!input[this.shield]){const held=SIDES.find(k=>input[k]);if(held)this.shield=held;}
   if(input.touch){const dx=input.touch.x-(a.x+a.w/2),dy=input.touch.y-(a.y+a.h/2);if(Math.hypot(dx,dy)>18)this.shield=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}
   this.prevIn={up:!!input.up,down:!!input.down,left:!!input.left,right:!!input.right};s.x=a.x+a.w/2;s.y=a.y+a.h/2;
  }else{
   s.x+=sx/n*speed*dt;s.y+=sy/n*speed*dt;if(input.touch){const tx=input.touch.x-s.x,ty=input.touch.y-s.y,m=Math.hypot(tx,ty),step=Math.min(m,250*dt);if(m){s.x+=tx/m*step;s.y+=ty/m*step;}}
   s.x=clamp(s.x,a.x+10,a.x+a.w-10);s.y=clamp(s.y,a.y+10,a.y+a.h-10);
  }
  // Blue bars hurt only a SOUL that is moving.
  this.moved=Math.hypot(s.x-ox,s.y-oy)>.2;this.boxSpin=Math.max(0,(this.boxSpin||0)-dt);
  const born=[];let grazing=false;
  for(const b of this.bullets){
   b.age+=dt;
   if(b.kind==='spike'){const t=b.age-b.warn;b.cur=t<0?0:t<b.rise?b.len*t/b.rise:t<b.rise+b.live?b.len:Math.max(0,b.len*(1-(t-b.rise-b.live)/b.fall));if(t>=0&&!b.sounded){b.sounded=true;this.emit('spike');}if(t>b.rise+b.live+b.fall)b.gone=true;}
   else if(b.kind==='slash'){if(b.age>=b.warn&&!b.sounded){b.sounded=true;this.emit('slash');this.shake=Math.max(this.shake,.06);}if(b.age>b.warn+b.live+.2)b.gone=true;}
   else if(b.kind==='lance'){const t=b.age-b.warn;b.tip=t<0?-22*Math.min(1,b.age/b.warn):t*b.speed;b.tx=b.x+Math.cos(b.angle)*b.tip;b.ty=b.y+Math.sin(b.angle)*b.tip;if(t>=0&&!b.sounded){b.sounded=true;this.emit('lunge');}if(b.tip>700)b.gone=true;}
   else if(b.kind==='buster'){if(b.age>=b.warn){if(!b.sounded){b.sounded=true;this.emit('buster');}b.x+=b.vx*dt;}if(b.age>b.life)b.gone=true;}
   else if(b.kind==='ribbon'){b.y+=b.vy*dt;if(b.y>this.arena.y+this.arena.h+20)b.gone=true;}
   else if(b.kind==='axe'){const u=clamp(b.age/b.dur,0,1),k=Math.sin(Math.PI*u);b.x=b.x0+b.ux*b.dist*k;b.y=b.y0+b.uy*b.dist*k;if(u>=1)b.gone=true;}
   else if(b.kind==='orbitblade'){const u=b.age/b.close;b.radius=u<1?b.r0*(1-.65*u):b.r0*.35+(b.age-b.close)*160*this.config.speed;b.theta+=b.spin*dt*(u<1?1:.3);b.x=b.cx+Math.cos(b.theta)*b.radius;b.y=b.cy+Math.sin(b.theta)*b.radius;}
   else if(b.kind==='star'){b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.fuse&&b.age>=b.fuse){b.gone=true;for(let k=0;k<4;k++){const an=k*Math.PI/2+Math.PI/4;born.push({kind:'shard',x:b.x,y:b.y,vx:Math.cos(an)*90*this.config.speed,vy:Math.sin(an)*90*this.config.speed,r:3,age:0,life:3});}this.emit('pop');}}
   else if(b.kind==='zee'){b.x+=b.vx*dt;b.y+=b.vy*dt+Math.sin(b.age*3+b.wob)*12*dt;}
   else if(b.kind==='orbitsword'){if(b.age<b.aimAt){b.theta+=b.spin*dt;b.x=b.cx+Math.cos(b.theta)*b.radius;b.y=b.cy+Math.sin(b.theta)*b.radius;b.ang=Math.atan2(s.y-b.y,s.x-b.x);}else{if(!b.launched){b.launched=true;b.vx=Math.cos(b.ang)*b.speed;b.vy=Math.sin(b.ang)*b.speed;this.emit('lunge');}b.x+=b.vx*dt;b.y+=b.vy*dt;}}
   else if(b.kind==='sword'){if(b.age>=b.warn)b.y+=b.vy*dt;}
   else if(b.kind==='dashline'){if(b.age>=b.warn&&!b.sounded){b.sounded=true;this.emit('slash');this.shake=Math.max(this.shake,.1);}if(b.age>b.warn+b.live+.25)b.gone=true;}
   else if(b.kind==='eruption'){if(b.age>=b.warn){b.gone=true;born.push({kind:'spike',x:b.x,y:b.y,dx:0,dy:-1,w:b.w,len:b.len,warn:0,rise:.08,live:b.live,fall:.15,age:0,vx:0,vy:0});for(let k=0;k<6;k++){const an=-Math.PI/2+(k-2.5)*.42;born.push({kind:'shard',x:b.x,y:b.y-10,vx:Math.cos(an)*150*this.config.speed,vy:Math.sin(an)*190*this.config.speed,g:300,r:4,age:0,life:3});}this.emit('spike');this.shake=Math.max(this.shake,.08);}}
   else if(b.kind==='bar'){b.x+=b.vx*dt;if(b.x<this.arena.x-20)b.gone=true;}
   else if(b.kind==='laser'){if(b.age>=b.warn){if(!b.sounded){b.sounded=true;this.emit('laser');}b.angle+=b.spin*dt;}if(b.age>b.warn+b.live+.2)b.gone=true;}
   else if(b.kind==='cone'){if(b.age>=b.warn&&!b.sounded){b.sounded=true;this.emit('shine');}if(b.age>b.warn+b.live+.2)b.gone=true;}
   else if(b.kind==='star6'){if(b.delay&&b.age<b.delay)continue;if(b.hover!==undefined&&!b.sought){if(b.age>=b.hover){b.sought=true;const d=Math.hypot(s.x-b.x,s.y-b.y)||1;b.vx=(s.x-b.x)/d*b.seek;b.vy=(s.y-b.y)/d*b.seek;}}else{b.x+=(b.vx||0)*dt;b.y+=(b.vy||0)*dt;}if(b.fuse&&b.age>=b.fuse){b.gone=true;for(let k=0;k<(b.burst||5);k++){const an=k*6.283/(b.burst||5)+b.age;born.push({kind:'shard',x:b.x,y:b.y,vx:Math.cos(an)*110*this.config.speed,vy:Math.sin(an)*110*this.config.speed,r:3,age:0,life:3});}this.emit('pop');}}
   else if(b.kind==='arrow'){
    // A trick spear swings round the SOUL and comes in from the opposite side.
    if(b.flip!==undefined){b.flip+=dt;if(b.flip>=.38){b.side={up:'down',down:'up',left:'right',right:'left'}[b.side];b.flip=undefined;b.flipped=true;}}
    else{b.dist-=b.speed*dt;if(b.trick&&!b.flipped&&b.dist<=64){b.flip=0;b.dist=64;}
     else if(b.dist<30&&this.shield===b.side){b.gone=true;this.effects.push({type:'block',life:.25});this.emit('block');continue;}
     else if(b.dist<10){b.gone=true;this.hurt();if(this.state==='dead')return;continue;}}
   }
   else if(b.kind==='shard'&&b.g){b.vy+=b.g*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;}
   else if(b.kind==='scarf'){b.x+=b.vx*dt;}
   else{b.x+=(b.vx||0)*dt;b.y+=(b.vy||0)*dt;}
   if(b.gone)continue;
   // Hearts and Zs are gifts: they never hurt.
   if(b.kind==='gift'&&Math.hypot(s.x-b.x,s.y-b.y)<b.r+7){b.gone=true;this.hp=Math.min(this.maxHP,this.hp+2);this.spareSeth(SMERCY.gift);this.effects.push({type:'gift',x:b.x,y:b.y,life:.5});this.emit('gift');continue;}
   if(b.kind==='zee'&&Math.hypot(s.x-b.x,s.y-b.y)<b.r+6){b.gone=true;this.sleepy=1;this.spareSeth(SMERCY.zee);this.effects.push({type:'zee',x:b.x,y:b.y,life:.6});this.emit('zee');continue;}
   if(this.hitTest(b,s)){this.hurt();if(this.state==='dead')return;grazing=false;this.grazeBlock=.3;continue;}
   if(this.dr&&!grazing&&this.hitTest(b,s,14))grazing=true;
  }
  // Grazing (Deltarune half): passing close to a damaging bullet builds TP.
  this.grazeBlock=Math.max(0,(this.grazeBlock||0)-dt);
  if(grazing&&this.grazeBlock<=0){this.tp=Math.min(100,this.tp+GRAZE_RATE*dt);this.grazeFx=(this.grazeFx||0)-dt;if(this.grazeFx<=0){this.grazeFx=.18;this.effects.push({type:'graze',life:.2});this.emit('graze');}}
  this.bullets.push(...born);
  this.bullets=this.bullets.filter(b=>{if(b.gone)return false;if(['spike','slash','lance','buster','ribbon','axe','orbitblade','scarf','dashline','eruption','laser','cone','arrow','bar','sword'].includes(b.kind))return b.age<(b.life??30);return b.age<(b.life??6)&&b.x>-80&&b.x<720&&b.y>-80&&b.y<560;});
  if(this.attackTime>=this.duration)this.finishWave();
 }
 snapshot(){return{scene:this.scene,state:this.state,ui:this.ui,room:this.world.room,hp:this.hp,maxHP:this.maxHP,enemyHP:this.enemyHP,turn:this.turn,waves:this.dodges,knightMercy:this.knightMercy,sethMercy:this.sethMercy,tp:Math.round(this.tp),ready:this.ready,finaleDone:this.finaleDone,ending:this.ending,plan:this.plan?.kind};}
}
function ribbonY(b,x){return b.y+b.amp*Math.sin(x*b.k+b.age*b.spin);}
Object.assign(exports,{BattleEngine,clamp,MENU_BOX,ribbonY,TP_COST});
