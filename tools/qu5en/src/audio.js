// The designer's theme for her, "QU5EN". Effects are UNDERTALE's own sounds already used across PURPLE, plus a
// few synthesized arcade blips; text uses the designer's snd_txt1, pitched up and doubled with a square chirp for her.
const SOUNDS=__SOUNDS__;
const VOICE={narrator:1,boss:1.35,seth:.78};
class StageAudio{
 constructor(){
  this.enabled=false;this.paused=false;this.context=null;this.master=null;this.mode='off';this.userMuted=false;this.buffers={};
  this.track=new Audio(SOUNDS.theme);this.track.loop=true;this.track.preload='auto';this.track.volume=.5;
 }
 async enable(value){
  this.enabled=value;this.sync();if(!value){this.updateGain();return;}
  try{
   this.context??=new(window.AudioContext||window.webkitAudioContext)();
   if(!this.master){this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);this.noise=this.makeNoise();
    for(const name of ['damage','select','slash','ding','heavy','txt'])fetch(SOUNDS[name]).then(r=>r.arrayBuffer()).then(b=>this.context.decodeAudioData(b)).then(buf=>{this.buffers[name]=buf;}).catch(()=>{});}
   await this.context.resume();
  }catch{/* The theme still plays without Web Audio. */}
  this.updateGain();this.sync();
 }
 makeNoise(){const c=this.context,b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}
 updateGain(){if(this.master)this.master.gain.setTargetAtTime(this.enabled&&!this.paused&&!this.gameOver?.9:0,this.context.currentTime,.05);}
 // mode: 'battle' | 'intro' | 'end' | 'off'
 status(mode,paused,gameOver=false){
  if(mode!==this.mode){if(mode==='battle'&&this.mode==='off')this.track.currentTime=0;this.mode=mode;}
  if(paused!==this.paused||gameOver!==this.gameOver){this.paused=paused;this.gameOver=gameOver;this.updateGain();}
  this.sync();
 }
 sync(){const on=this.enabled&&!this.paused&&!this.gameOver&&['battle','intro','end'].includes(this.mode);if(on&&this.track.paused)this.track.play().catch(()=>{});else if(!on&&!this.track.paused)this.track.pause();this.track.volume=this.mode==='end'?.3:.5;}
 ok(){return this.enabled&&!this.paused&&this.context&&this.master;}
 sample(name,{rate=1,gain=.8,offset=0,duration}={}){if(!this.ok())return false;const buf=this.buffers[name];if(!buf)return false;const c=this.context,s=c.createBufferSource(),g=c.createGain();s.buffer=buf;s.playbackRate.value=rate;g.gain.value=gain;s.connect(g);g.connect(this.master);s.start(c.currentTime,offset,duration);return true;}
 voice(freq,when,dur,type,gain){const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(gain,when+.01);g.gain.exponentialRampToValueAtTime(.0001,when+dur);o.connect(g);g.connect(this.master);o.start(when);o.stop(when+dur+.02);}
 tone(freq,duration=.08,type='square',gain=.12,delay=0){if(!this.ok())return;this.voice(freq,this.context.currentTime+delay,duration,type,gain);}
 burst(gain=.12,dur=.12,freq=2400){if(!this.ok())return;const c=this.context,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime;s.buffer=this.noise;f.type='bandpass';f.frequency.value=freq;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(this.master);s.start(t,Math.random()*.5,dur+.02);}
 effect(name){
  const S=(n,o)=>this.sample(n,o);
  const map={
   select:()=>S('select',{gain:.5,offset:.07,duration:.4})||this.tone(520,.035),hurt:()=>S('damage',{gain:.9})||this.tone(49,.2),heal:()=>S('ding',{gain:.7,rate:1.2}),
   dead:()=>S('heavy',{gain:.8,rate:.8}),spare:()=>S('ding',{gain:.8,rate:.9}),attack:()=>S('slash',{gain:.6}),
   correct:()=>{this.tone(660,.08,'square',.08);this.tone(990,.14,'square',.08,.08);},wrong:()=>{this.tone(220,.12,'sawtooth',.09);this.tone(147,.22,'sawtooth',.09,.12);},
   stomp:()=>{this.burst(.18,.25,180);S('heavy',{gain:.35,rate:1.4});},burst:()=>this.burst(.08,.12,2600),pop:()=>this.tone(1200,.04,'square',.06),shoot:()=>this.tone(1600,.03,'square',.04),
   block:()=>this.tone(880,.04,'triangle',.06),jump:()=>this.tone(440,.06,'square',.04),dash:()=>this.burst(.12,.14,1800),burn:()=>this.burst(.08,.1,4200),swing:()=>this.burst(.1,.1,1200),
   cue:()=>this.tone(880,.03,'triangle',.05),warning:()=>{this.tone(1046,.05,'square',.05);this.tone(1318,.05,'square',.05,.06);},scan:()=>{this.tone(392,.4,'triangle',.08);this.tone(311,.6,'triangle',.08,.4);}
  };
  map[name]?.();
 }
 // snd_txt1, pitched for the speaker; her voice adds a quiet square chirp, like a machine reading aloud.
 blip(speaker){if(!this.sample('txt',{rate:(VOICE[speaker]||1)*(speaker==='boss'?1+Math.random()*.08:1),gain:.5,duration:.06}))this.tone(200,.03,'square',.06);if(speaker==='boss')this.tone(700+Math.random()*500,.025,'square',.025);}
}
Object.assign(exports,{StageAudio});
