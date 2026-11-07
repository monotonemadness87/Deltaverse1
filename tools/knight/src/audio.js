// Music, all supplied by the designer: "Quiet Water" in the crystal room before the battle, and "Your Humble Service"
// (a DELTARUNE fan track) through the battle's two halves and finale. The battle theme pauses for the roar that
// breaks the battle and picks up where it left off.
// Effects are only recorded sounds the designer has supplied to PURPLE: UNDERTALE's hurt, select, slash, ding and heavy
// hit; Seth's own notebook slash; the teleport, encounter, blaster and vine sounds from the Sans fights; Omega
// Flowey's yowl for the Knight's roar; snd_txt1 for text. Nothing is synthesized.
const SOUNDS=__SOUNDS__;
const VOICE={narrator:1,boss:.9,gerson:.72,seth:.78};
const SAMPLES=['damage','select','slash','ding','heavy','txt','sethslash','teleport','enter','blaster','vine','yowl'];
class StageAudio{
 constructor(){
  this.tracks={battle:new Audio(SOUNDS.theme),room:new Audio(SOUNDS.quietwater)};
  for(const t of Object.values(this.tracks)){t.loop=true;t.preload='auto';}
  this.tracks.battle.volume=.5;this.tracks.room.volume=.55;
  this.enabled=false;this.paused=false;this.context=null;this.master=null;this.mode='off';this.userMuted=false;this.buffers={};this.last={};
 }
 async enable(value){
  this.enabled=value;if(!value){this.updateGain();this.syncTracks();return;}
  try{
   this.context??=new(window.AudioContext||window.webkitAudioContext)();
   if(!this.master){
    this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);
    for(const name of SAMPLES)fetch(SOUNDS[name]).then(r=>r.arrayBuffer()).then(b=>this.context.decodeAudioData(b)).then(buf=>{this.buffers[name]=buf;}).catch(()=>{});
   }
   await this.context.resume();
  }catch{/* No Web Audio: the music still plays. */}
  this.updateGain();this.syncTracks();
 }
 // Which track a mode wants: the room theme on the walk and at the end, the battle theme in the battle.
 trackFor(mode){return ['ut','dr','finale'].includes(mode)?'battle':mode==='walk'?'room':null;}
 syncTracks(){
  const want=this.enabled&&!this.paused&&!this.gameOver?this.trackFor(this.mode):null;
  for(const [name,t] of Object.entries(this.tracks)){if(name===want&&t.paused)t.play().catch(()=>{});else if(name!==want&&!t.paused)t.pause();}
 }
 updateGain(){if(this.master)this.master.gain.setTargetAtTime(this.enabled&&!this.paused&&!this.gameOver?.9:0,this.context.currentTime,.05);}
 status(mode,paused,gameOver=false){
  if(mode!==this.mode){
   // A battle started from the room plays its theme from the top.
   if(mode==='walk')this.fresh=true;if(this.trackFor(mode)==='battle'&&this.fresh){this.fresh=false;this.tracks.battle.currentTime=0;}
   this.mode=mode;
  }
  if(paused!==this.paused||gameOver!==this.gameOver){this.paused=paused;this.gameOver=gameOver;this.updateGain();}
  this.syncTracks();
 }
 ok(){return this.enabled&&!this.paused&&this.context&&this.master;}
 sample(name,{rate=1,gain=.8,offset=0,duration,delay=0,every=0}={}){
  if(!this.ok())return false;const buf=this.buffers[name];if(!buf)return false;const c=this.context;
  // every: the shortest gap between two plays of this sound (grazes, star pops and the like come in bursts).
  if(every){const k=name+rate;if(c.currentTime-(this.last[k]??-9)<every)return true;this.last[k]=c.currentTime;}
  const s=c.createBufferSource(),g=c.createGain();s.buffer=buf;s.playbackRate.value=rate;g.gain.value=gain;s.connect(g);g.connect(this.master);s.start(c.currentTime+delay,offset,duration);return true;
 }
 effect(name){
  const S=(n,o)=>this.sample(n,o);
  const map={
   select:()=>S('select',{gain:.5,offset:.07,duration:.4}),
   hurt:()=>S('damage',{gain:.9}),heal:()=>S('ding',{gain:.7,rate:1.2}),dead:()=>S('heavy',{gain:.8,rate:.8}),
   spare:()=>{S('ding',{gain:.8,rate:.9});S('teleport',{gain:.6,delay:.4});},
   // Seth's own slash for his FIGHT; the Knight's swords use UNDERTALE's.
   attack:()=>S('sethslash',{gain:.75}),
   slash:()=>S('slash',{gain:.45,rate:1.2,every:.05}),lunge:()=>S('slash',{gain:.4,rate:1.45,every:.05}),swing:()=>S('slash',{gain:.3,rate:.8,every:.08}),
   spike:()=>S('vine',{gain:.55,every:.08}),
   buster:()=>{S('heavy',{gain:.45,rate:1.3});S('slash',{gain:.4,rate:.7});},
   pop:()=>S('select',{gain:.22,rate:2.2,offset:.07,duration:.15,every:.06}),
   cue:()=>S('select',{gain:.18,rate:1.6,offset:.07,duration:.15,every:.1}),
   gift:()=>S('ding',{gain:.5,rate:1.6}),zee:()=>S('ding',{gain:.3,rate:.6}),
   graze:()=>S('select',{gain:.14,rate:2.8,offset:.07,duration:.08,every:.07}),
   defend:()=>S('select',{gain:.5,rate:.8,offset:.07,duration:.4}),
   spell:()=>{S('ding',{gain:.6,rate:.75});S('teleport',{gain:.5,delay:.12});},
   roar:()=>S('yowl',{gain:.5,rate:.75}),
   // The roar that breaks the battle: the yowl slowed right down, then the heavy hit as the UI shatters.
   roarBreak:()=>{S('yowl',{gain:.8,rate:.55});S('yowl',{gain:.5,rate:.45,delay:.35});S('heavy',{gain:.9,rate:.9,delay:1.6});S('teleport',{gain:.7,rate:.8,delay:3});},
   laser:()=>S('blaster',{gain:.4,every:.15}),shine:()=>S('blaster',{gain:.3,rate:1.3,every:.15}),block:()=>S('ding',{gain:.4,rate:2}),
   echo:()=>S('ding',{gain:.35,rate:.6}),
   awaken:()=>{S('teleport',{gain:.7,rate:.6});S('ding',{gain:.6,rate:.5,delay:.8});S('ding',{gain:.5,rate:.75,delay:1.6});},
   encounter:()=>S('enter',{gain:.8})
  };
  map[name]?.();
 }
 // snd_txt1, pitched for the speaker.
 blip(speaker){this.sample('txt',{rate:(VOICE[speaker]||1)*(speaker==='boss'?1+Math.random()*.04:1),gain:.55,duration:.06});}
}
Object.assign(exports,{StageAudio});
