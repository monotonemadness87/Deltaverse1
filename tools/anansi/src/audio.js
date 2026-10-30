// The designer's themes: "COPY-CAT PANIC" for the pacifist show, "FRENETIC FOLLIES" for the genocide one.
// On the walk the route's theme plays muffled, as if through the theatre walls, louder as you get closer.
// Effects are UNDERTALE's own sounds already used across PURPLE; text uses the designer's snd_txt1.
const SOUNDS=__SOUNDS__;
const VOICE={narrator:1,boss:.72,aqua:.86,seth:.78};
class StageAudio{
 constructor(){
  this.enabled=false;this.paused=false;this.context=null;this.master=null;this.mode='off';this.userMuted=false;this.buffers={};
  this.tracks={pacifist:new Audio(SOUNDS.pacifist),genocide:new Audio(SOUNDS.genocide)};
  for(const t of Object.values(this.tracks)){t.loop=true;t.preload='auto';t.volume=.5;}
  this.room='battle';
 }
 async enable(value){
  this.enabled=value;
  if(!value){this.sync();this.updateGain();return;}
  this.sync();
  try{
   this.context??=new(window.AudioContext||window.webkitAudioContext)();
   if(!this.master){
    this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);this.noise=this.makeNoise();
    // The themes run through a low-pass filter, so the walk hears them through the walls.
    this.filter=this.context.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=20000;this.trackGain=this.context.createGain();this.filter.connect(this.trackGain);this.trackGain.connect(this.context.destination);
    try{for(const t of Object.values(this.tracks))this.context.createMediaElementSource(t).connect(this.filter);this.routed=true;}catch{this.routed=false;}
    for(const name of ['damage','select','slash','ding','heavy','txt'])fetch(SOUNDS[name]).then(r=>r.arrayBuffer()).then(b=>this.context.decodeAudioData(b)).then(buf=>{this.buffers[name]=buf;}).catch(()=>{});
   }
   await this.context.resume();
  }catch{/* The themes still play without Web Audio. */}
  this.updateGain();this.sync();
 }
 makeNoise(){const c=this.context,b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}
 updateGain(){if(this.master)this.master.gain.setTargetAtTime(this.enabled&&!this.paused&&!this.gameOver?.9:0,this.context.currentTime,.05);}
 // mode: 'pacifist' | 'genocide' (battle), 'walk-pacifist' | 'walk-genocide', 'off', 'end'. room: hall | theatre | battle.
 status(mode,paused,gameOver=false,room='battle'){
  if(mode!==this.mode){const was=this.mode;this.mode=mode;const name=this.trackName();if(name&&!(was||'').includes(name)&&this.tracks[name])this.tracks[name].currentTime=0;}
  this.room=room;
  if(paused!==this.paused||gameOver!==this.gameOver){this.paused=paused;this.gameOver=gameOver;this.updateGain();}
  this.sync();
 }
 trackName(){return this.mode.includes('genocide')?'genocide':this.mode.includes('pacifist')?'pacifist':null;}
 sync(){
  const name=this.trackName(),walk=this.mode.startsWith('walk');
  for(const [k,t] of Object.entries(this.tracks)){const on=this.enabled&&!this.paused&&!this.gameOver&&k===name;if(on&&t.paused)t.play().catch(()=>{});else if(!on&&!t.paused)t.pause();}
  if(this.filter&&this.context){const f=walk?(this.room==='hall'?520:1400):20000,v=walk?(this.room==='hall'?.5:.75):1;this.filter.frequency.setTargetAtTime(f,this.context.currentTime,.3);this.trackGain.gain.setTargetAtTime(v,this.context.currentTime,.3);}
  else if(name){this.tracks[name].volume=walk?(this.room==='hall'?.18:.3):.5;}
 }
 ok(){return this.enabled&&!this.paused&&this.context&&this.master;}
 sample(name,{rate=1,gain=.8,offset=0,duration}={}){if(!this.ok())return false;const buf=this.buffers[name];if(!buf)return false;const c=this.context,s=c.createBufferSource(),g=c.createGain();s.buffer=buf;s.playbackRate.value=rate;g.gain.value=gain;s.connect(g);g.connect(this.master);s.start(c.currentTime,offset,duration);return true;}
 voice(freq,when,dur,type,gain){const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(gain,when+.01);g.gain.exponentialRampToValueAtTime(.0001,when+dur);o.connect(g);g.connect(this.master);o.start(when);o.stop(when+dur+.02);}
 tone(freq,duration=.08,type='square',gain=.12){if(!this.ok())return;this.voice(freq,this.context.currentTime,duration,type,gain);}
 burst(gain=.12,dur=.12,freq=2400){if(!this.ok())return;const c=this.context,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime;s.buffer=this.noise;f.type='bandpass';f.frequency.value=freq;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(this.master);s.start(t,Math.random()*.5,dur+.02);}
 effect(name){
  const S=(n,o)=>this.sample(n,o);
  const map={
   select:()=>S('select',{gain:.5,offset:.07,duration:.4})||this.tone(520,.035),
   hurt:()=>S('damage',{gain:.9})||this.tone(49,.2),
   heal:()=>S('ding',{gain:.7,rate:1.2})||this.tone(780,.16,'triangle'),
   dead:()=>S('heavy',{gain:.8,rate:.8}),kill:()=>S('heavy',{gain:.9,rate:.6}),spare:()=>S('ding',{gain:.8,rate:.9}),letter:()=>S('ding',{gain:.5,rate:.7}),
   dash:()=>this.burst(.09,.12,1800),tea:()=>this.tone(880,.08,'triangle',.05),pour:()=>this.burst(.1,.5,700),scald:()=>{this.burst(.14,.3,3200);S('damage',{gain:.5,rate:1.3});},burn:()=>this.burst(.05,.08,4200),
   reignite:()=>{this.burst(.2,.6,300);this.tone(110,.5,'sawtooth',.08);},rumble:()=>this.burst(.14,.45,180),
   cue:()=>this.tone(880,.03,'triangle',.05),encounter:()=>{this.tone(880,.06);setTimeout(()=>this.tone(440,.08),110);this.burst(.1,.3,1600);},
   door:()=>this.burst(.05,.2,600),read:()=>S('select',{gain:.35,offset:.07,duration:.3,rate:.9}),turnaround:()=>this.tone(330,.25,'triangle',.05)
  };
  map[name]?.();
 }
 // snd_txt1: only its short click, pitched for the speaker; the count speaks low.
 blip(speaker){if(!this.sample('txt',{rate:(VOICE[speaker]||1)*(speaker==='boss'?1+Math.random()*.04:1),gain:.55,duration:.06}))this.tone(200,.03,'square',.06);}
}
Object.assign(exports,{StageAudio});
