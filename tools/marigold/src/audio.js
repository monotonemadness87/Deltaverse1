// The designer's themes: "The King's Dream" for the trap, "Thorns of Agony" for the hunt.
// Effects are UNDERTALE's own sounds already used across PURPLE (hurt, select, slash, ding, heavy hit), and the
// designer's snd_txt1 for every line of text. The walk plays "Glowing Snow" over synthesized wind.
const SOUNDS=__SOUNDS__;
// Text voices: snd_txt1 at a pitch per speaker.
const VOICE={narrator:1,boss:1.32,aqua:.86,flowey:1.55,seth:.78};
class StageAudio{
 constructor(){
  this.enabled=false;this.paused=false;this.context=null;this.master=null;this.mode='off';this.nextTime=0;this.step=0;this.timer=null;this.userMuted=false;this.buffers={};
  // The walk plays "Glowing Snow": as supplied on the hunt, higher and faster on the trap (one rate, pitch not preserved).
  this.tracks={trap:new Audio(SOUNDS.trap),hunt:new Audio(SOUNDS.hunt),walk:new Audio(SOUNDS.walk)};
  for(const t of Object.values(this.tracks)){t.loop=true;t.preload='auto';}
  this.tracks.trap.volume=.5;this.tracks.hunt.volume=.46;this.tracks.walk.volume=.45;
  const w=this.tracks.walk;w.preservesPitch=false;w.mozPreservesPitch=false;w.webkitPreservesPitch=false;
 }
 async enable(value){
  this.enabled=value;
  if(!value){this.syncTracks();this.updateGain();return;}
  this.syncTracks();
  try{
   this.context??=new(window.AudioContext||window.webkitAudioContext)();
   if(!this.master){
    this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);
    this.music=this.context.createGain();this.music.gain.value=.5;this.music.connect(this.master);this.noise=this.makeNoise();
    for(const name of ['damage','select','slash','ding','heavy','txt','yowl','flowey','sprout'])fetch(SOUNDS[name]).then(r=>r.arrayBuffer()).then(b=>this.context.decodeAudioData(b)).then(buf=>{this.buffers[name]=buf;}).catch(()=>{});
   }
   await this.context.resume();
  }catch{/* The themes can still play without Web Audio. */}
  this.updateGain();this.schedule();
 }
 makeNoise(){const c=this.context,b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}
 updateGain(){if(this.master)this.master.gain.setTargetAtTime(this.enabled&&!this.paused&&!this.gameOver?.9:0,this.context.currentTime,.05);}
 syncTracks(){
  for(const [name,t] of Object.entries(this.tracks)){
   const on=this.enabled&&!this.paused&&!this.gameOver&&(this.mode===name||name==='walk'&&(this.mode==='walk'||this.mode==='walkHunt'));
   if(name==='walk'){const rate=this.mode==='walk'?1.15:1;if(t.playbackRate!==rate)t.playbackRate=rate;}
   if(on&&t.paused)t.play().catch(()=>{});else if(!on&&!t.paused)t.pause();
  }
 }
 status(mode,paused,gameOver=false){
  if(mode!==this.mode){
   // A new battle starts its theme from the top; the walk and endings let it rest.
   if((mode==='trap'||mode==='hunt')&&this.mode!=='pause')this.tracks[mode].currentTime=0;
   this.mode=mode;this.step=0;if(this.context)this.nextTime=this.context.currentTime+.08;
  }
  if(paused!==this.paused||gameOver!==this.gameOver){this.paused=paused;this.gameOver=gameOver;this.updateGain();}
  this.syncTracks();this.schedule();
 }
 // The walk: gusts of wind under "Glowing Snow", stronger on the hunt.
 schedule(){
  if(!this.enabled||!this.context||!this.master||this.paused)return;const c=this.context;if(this.nextTime<c.currentTime)this.nextTime=c.currentTime+.05;
  if(this.mode!=='walk'&&this.mode!=='walkHunt')return;
  const gust=3.7,hunt=this.mode==='walkHunt';
  while(this.nextTime<c.currentTime+.5){this.wind(this.nextTime,gust,hunt?.06:.035);this.nextTime+=gust;}
  clearTimeout(this.timer);this.timer=setTimeout(()=>this.schedule(),150);
 }
 voice(freq,when,dur,type,gain,dest=this.master){const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(gain,when+.01);g.gain.exponentialRampToValueAtTime(.0001,when+dur);o.connect(g);g.connect(dest);o.start(when);o.stop(when+dur+.02);}
 wind(when,dur,gain){const c=this.context,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;s.loop=true;f.type='bandpass';f.frequency.setValueAtTime(420,when);f.frequency.linearRampToValueAtTime(820,when+dur/2);f.frequency.linearRampToValueAtTime(380,when+dur);f.Q.value=.7;g.gain.setValueAtTime(.0001,when);g.gain.linearRampToValueAtTime(gain,when+dur/2);g.gain.linearRampToValueAtTime(.0001,when+dur);s.connect(f);f.connect(g);g.connect(this.music);s.start(when);s.stop(when+dur+.05);}
 ok(){return this.enabled&&!this.paused&&this.context&&this.master;}
 sample(name,{rate=1,gain=.8,offset=0,duration}={}){if(!this.ok())return false;const buf=this.buffers[name];if(!buf)return false;const c=this.context,s=c.createBufferSource(),g=c.createGain();s.buffer=buf;s.playbackRate.value=rate;g.gain.value=gain;s.connect(g);g.connect(this.master);s.start(c.currentTime,offset,duration);return true;}
 tone(freq,duration=.08,type='square',gain=.12){if(!this.ok())return;this.voice(freq,this.context.currentTime,duration,type,gain);}
 burst(gain=.12,dur=.12,freq=2400){if(!this.ok())return;const c=this.context,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime;s.buffer=this.noise;f.type='bandpass';f.frequency.value=freq;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(this.master);s.start(t,Math.random()*.5,dur+.02);}
 effect(name){
  const S=(n,o)=>this.sample(n,o);
  const map={
   select:()=>S('select',{gain:.5,offset:.07,duration:.4})||this.tone(520,.035),
   hurt:()=>S('damage',{gain:.9})||this.tone(49,.2),
   heal:()=>S('ding',{gain:.7,rate:1.2})||this.tone(780,.16,'triangle'),
   dead:()=>S('heavy',{gain:.8,rate:.8})||this.tone(41,.6),
   kill:()=>S('heavy',{gain:.9,rate:.7}),
   spare:()=>S('ding',{gain:.8,rate:.9}),
   swing:()=>S('slash',{gain:.55,rate:.85}),
   lance:()=>this.yowl(.55,1.12)||S('slash',{gain:.4,rate:1.25}),
   aquaCut:()=>S('slash',{gain:.6,rate:1.5}),
   // Her thorns and lance lunge like Flowey's vines, so they share his yowl (once per burst, as in his fights).
   thorn:()=>this.yowl(.42)||(this.burst(.08,.07,3600),this.tone(1320+Math.random()*300,.05,'triangle',.04)),
   fizzle:()=>this.burst(.04,.06,5000),
   cue:()=>this.tone(880,.03,'triangle',.05),
   pop:()=>this.tone(1046,.05,'sine',.05),poisoned:()=>this.tone(220,.12,'sawtooth',.04),poison:()=>this.tone(180,.05,'triangle',.035),
   phone:()=>{this.tone(1200,.08,'square',.05);setTimeout(()=>this.tone(1200,.08,'square',.05),160);},
   aqua:()=>S('slash',{gain:.6,rate:1.1}),door:()=>this.burst(.05,.2,600),read:()=>S('select',{gain:.35,offset:.07,duration:.3,rate:.9}),
   encounter:()=>{this.tone(880,.06);setTimeout(()=>this.tone(440,.08),110);this.burst(.1,.3,1600);},
   turnaround:()=>this.tone(330,.25,'triangle',.05),sprout:()=>S('sprout',{gain:.7}),warp:()=>this.tone(660,.05,'triangle',.06),save:()=>S('ding',{gain:.6,rate:1.35}),rumble:()=>this.burst(.14,.4,180)
  };
  map[name]?.();
 }
 yowl(gain,rate=1){const now=this.context?.currentTime??0;if(now-(this.lastYowl??-1)<.12)return true;const ok=this.sample('yowl',{gain,rate:rate*(.94+Math.random()*.12)});if(ok)this.lastYowl=now;return ok;}
 // snd_txt1: only its short click, pitched for the speaker.
 blip(speaker){if(speaker==='flowey'&&this.sample('flowey',{gain:.6}))return;if(!this.sample('txt',{rate:(VOICE[speaker]||1)*(speaker==='boss'?1+Math.random()*.05:1),gain:.55,duration:.06}))this.tone(200,.03,'square',.06);}
}
Object.assign(exports,{StageAudio});
