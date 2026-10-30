modules["notebook.js"]=(exports,require)=>{
// Deterministic Torn Notebook timing, shared by every Seth FIGHT flow.
class TornNotebook {
 constructor(onEvent=()=>{}){this.onEvent=onEvent;this.active=false;this.history=[];this.impacts=[];this.events=[];this.stops=[];this.phase='idle';this.age=0;this.phaseAge=0;this.speed=.92;this.stagger=.22;}
 start(target,resolve){this.active=true;this.phase='timing';this.age=0;this.phaseAge=0;this.stops=[];this.target={...target};this.resolve=resolve;this.applied=false;this.events=[];this.event('begin');}
 event(type){const event={type,time:this.age,phase:this.phase};this.events.push(event);this.onEvent(type,this);}
 position(i){return Math.max(0,Math.min(1,1-(this.age-i*this.stagger)*this.speed));}
 stop(missed=false){if(!this.active||this.phase!=='timing'||this.stops.length>=2)return;const i=this.stops.length;if(!missed&&this.age<i*this.stagger)return;const position=this.position(i),quality=missed?0:Math.max(0,1-Math.abs(position-.5)*2);this.stops.push({position,quality,missed});this.event(missed?'miss':'mark');if(this.stops.length===2){this.quality=(this.stops[0].quality+this.stops[1].quality)/2;this.perfect=this.stops.every(s=>s.quality>=.94);this.phase='spin';this.phaseAge=0;this.event('spin');}}
 update(dt){if(!this.active)return;dt=Math.max(0,Math.min(dt,.05));this.age+=dt;this.phaseAge+=dt;if(this.phase==='timing'){while(this.stops.length<2&&this.age>1/this.speed+.04+this.stops.length*this.stagger)this.stop(true);return;}if(this.phase==='spin'&&this.phaseAge>=1.045){this.phase='impact';this.phaseAge=0;if(!this.applied){this.applied=true;this.event('hit');this.resolve(this.quality);}return;}if(this.phase==='impact'&&this.phaseAge>=.52){this.active=false;this.phase='done';this.history.push({quality:this.quality,stops:this.stops.map(x=>({...x})),events:this.events.map(x=>({...x}))});this.event('end');}}
 cancel(){this.active=false;this.phase='cancelled';this.event('cancel');}
}
function installNotebook(game,{kind,target=()=>({x:320,y:118}),event=()=>{}}){
 const notebook=new TornNotebook(event);notebook.kind=kind;game.notebook=notebook;notebook.follow=()=>target(game);let resolving=false;
 const confirm=game.confirm.bind(game),update=game.update.bind(game),back=game.back?.bind(game),reset=game.reset?.bind(game),emit=game.emit?.bind(game);
 const timing={encore:['fight'],rift:['fight'],lab:['fight'],muffet:['aim'],gerson:['strike','landing'],duo:['strike'],neo:['timing'],sans:['fight'],mettalot:['pose'],flowey:['strike'],aqua:['finisher']}[kind]||[];
 const quiet=new Set(['attack','strike','gentleStrike','slash','cut']);
 game.emit=function(type,...args){if(resolving&&(quiet.has(type)||kind==='aqua'&&type==='damage'||kind==='gerson'&&type==='enemyHurt'))return;return emit?.(type,...args);};
 function resolve(score,state){resolving=true;try{
  if(['encore','rift','lab'].includes(kind))game.attackCursor=320+(1-score)*264;
  if(kind==='flowey')game.cursor=384+(1-score)*310;
  if(kind==='gerson')game.cursor=(1+score)/2;
  if(kind==='muffet')game.aimQuality=score;
  if(kind==='duo')game.cursor=(1+score)/2;
  if(kind==='neo')game.timer=.8*score;
  if(kind==='mettalot'){const pose=game.poseCursor;game.poseCursor=()=>384+(1-score)*285;try{confirm();}finally{game.poseCursor=pose;}return;}
  if(kind==='aqua'){if(state==='finisher'){game.timer=.28;update(0,{});}else{const budget=game.completed<8?8:game.completed<16?10:12;game.hurtEnemy(Math.min(Math.round(2+4*score),Math.max(0,budget-game.duelDamage)));}return;}
  confirm();
  // Gerson's shield intercepts the resolved weapon impact, rather than an invisible later hit.
  if(kind==='gerson'&&game.state==='blocked'){game.timer=.23;update(0,{});}
 }finally{resolving=false;}}
 game.notebookRender=render=>{const state=game.state;if(notebook.active&&notebook.phase==='impact'&&['encore','rift','duo','aqua'].includes(kind))game.state=notebook.presentationState;try{return render();}finally{game.state=state;}};
 function begin(){if(notebook.active||!timing.includes(game.state))return;const state=game.state;notebook.presentationState=state;notebook.start(target(game),score=>resolve(score,state));}
 function interruptSans(){if(kind!=='sans'||!notebook.active||notebook.phase!=='timing')return;notebook.blockedLines=[0,1].map(i=>({position:notebook.position(i),disabled:true}));notebook.active=false;notebook.phase='interrupted';notebook.event('cutoff');game.interruptFight(notebook.blockedLines.map(l=>67.2+l.position*633.6));}
 game.notebookEnsure=begin;
 game.confirm=function(...args){if(game.paused)return;begin();if(notebook.active){if(notebook.phase==='timing'){if(kind==='sans')interruptSans();else notebook.stop();}return;}if(kind==='neo'&&game.state==='finishPrompt'){notebook.start(target(game),()=>{resolving=true;try{confirm();}finally{resolving=false;}});return;}const result=confirm(...args);begin();return result;};
 game.update=function(dt,...args){if(!game.paused)notebook.impacts=notebook.impacts.filter(f=>(f.age+=Math.min(Math.max(dt,0),.05))<.52);if(game.paused){event('pause',notebook);return;}begin();if(notebook.active){if(Number.isFinite(game.clock))game.clock+=Math.min(Math.max(dt,0),.05);game.advancePresence?.(Math.min(Math.max(dt,0),.05));notebook.update(dt);if(kind==='sans'&&notebook.phase==='timing'&&notebook.age>=.34)interruptSans();return;}const result=update(dt,...args);begin();return result;};
 if(back)game.back=function(...args){if(notebook.active){if(notebook.phase!=='timing'||game.paused)return;if(kind==='muffet'){notebook.stops=[];notebook.stop(true);notebook.stop(true);return;}const state=game.state,result=back(...args);if(game.state!==state)notebook.cancel();return result;}return back(...args);};
 if(reset)game.reset=function(...args){notebook.cancel();notebook.impacts=[];return reset(...args);};
 if(kind==='sans'){const lever=game.lever.bind(game);game.lever=()=>resolving?384+(1-notebook.quality)*201:lever();}
 if(kind==='aqua'){
  const shoot=game.shoot.bind(game),hurtEnemy=game.hurtEnemy.bind(game);
  game.shoot=function(...args){const before=game.shots.length,result=shoot(...args);if(game.shots.length>before&&game.mode==='purple')event('spin',notebook);return result;};
  game.hurtEnemy=function(amount,source='player',...args){if(source!=='player'||resolving)return hurtEnemy(amount,source,...args);const before=game.enemyHP;resolving=true;try{return hurtEnemy(amount,source,...args);}finally{resolving=false;if(game.enemyHP<before){notebook.impacts.push({x:game.enemy.x,y:game.enemy.y,age:0});event('hit',notebook);}}};
  const duel=game.startDuel.bind(game);game.startDuel=function(...args){const result=duel(...args);if(game.state==='duel'){notebook.presentationState='duel';notebook.start(target(game),score=>resolve(score,'duel'));}else begin();return result;};
 }
 if(kind==='duo'){
  const activate=game.activate.bind(game);game.activate=function(action,...args){if(action==='fight'&&game.state==='menu'&&game.final&&!game.paused){game.state='strike';game.timer=0;notebook.presentationState='strike';notebook.start(target(game),score=>{game.score=score;game.gentleStrikes++;game.pose='react';game.preAttack();});return;}return activate(action,...args);};
 }
 return notebook;
}

Object.assign(exports,{TornNotebook,installNotebook});
};
