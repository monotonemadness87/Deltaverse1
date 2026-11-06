// Music: a synthesized placeholder until the designer supplies themes (a slow crystal arpeggio for the walk, a
// steadier one for the Undertale half, a brighter, faster one with a bass line once the battle turns Deltarune).
// Effects are UNDERTALE's own sounds that PURPLE already uses (hurt, select, slash, ding, heavy hit), plus synthesized
// graze, shatter and roar; text uses the designer's snd_txt1, pitched per speaker.
const SOUNDS=__SOUNDS__;
const VOICE={narrator:1,boss:.9,gerson:.72,seth:.78};
// Placeholder score: [scale degrees], tempo (seconds per step) and voices per mode.
const NOTES=[261.63,293.66,329.63,392,440,523.25,587.33,659.25,783.99,880];
const SCORE={
 walk:{step:.42,arp:[0,4,7,4,2,5,8,5],lead:'triangle',gain:.05,bass:null},
 ut:{step:.3,arp:[0,4,7,9,7,4,2,4,1,5,8,5,4,7,9,7],lead:'triangle',gain:.055,bass:[0,0,3,3]},
 dr:{step:.2,arp:[0,4,7,9,5,7,9,8,0,4,7,9,4,5,7,4],lead:'square',gain:.035,bass:[0,0,5,5,3,3,4,4]},
 finale:{step:.18,arp:[9,7,4,7,8,7,5,4,9,7,4,7,9,8,9,7],lead:'square',gain:.04,bass:[0,5,3,4]}
};
class StageAudio{
 constructor(){this.enabled=false;this.paused=false;this.context=null;this.master=null;this.mode='off';this.nextTime=0;this.step=0;this.timer=null;this.userMuted=false;this.buffers={};}
 async enable(value){
  this.enabled=value;if(!value){this.updateGain();return;}
  try{
   this.context??=new(window.AudioContext||window.webkitAudioContext)();
   if(!this.master){
    this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);
    this.music=this.context.createGain();this.music.gain.value=.7;this.music.connect(this.master);this.noise=this.makeNoise();
    for(const name of ['damage','select','slash','ding','heavy','txt'])fetch(SOUNDS[name]).then(r=>r.arrayBuffer()).then(b=>this.context.decodeAudioData(b)).then(buf=>{this.buffers[name]=buf;}).catch(()=>{});
   }
   await this.context.resume();
  }catch{/* No Web Audio: silent. */}
  this.updateGain();this.schedule();
 }
 makeNoise(){const c=this.context,b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}
 updateGain(){if(this.master)this.master.gain.setTargetAtTime(this.enabled&&!this.paused&&!this.gameOver?.9:0,this.context.currentTime,.05);}
 status(mode,paused,gameOver=false){
  if(mode!==this.mode){this.mode=mode;this.step=0;if(this.context)this.nextTime=this.context.currentTime+.08;}
  if(paused!==this.paused||gameOver!==this.gameOver){this.paused=paused;this.gameOver=gameOver;this.updateGain();}
  this.schedule();
 }
 schedule(){
  if(!this.enabled||!this.context||!this.master||this.paused)return;const c=this.context,score=SCORE[this.mode];if(this.nextTime<c.currentTime)this.nextTime=c.currentTime+.05;
  if(score){while(this.nextTime<c.currentTime+.4){const k=this.step,deg=score.arp[k%score.arp.length],f=NOTES[deg%NOTES.length];
   this.voice(f,this.nextTime,score.step*.9,score.lead,score.gain,this.music);
   if(k%4===0)this.voice(f*2,this.nextTime,score.step*.5,'sine',score.gain*.5,this.music);
   if(score.bass&&k%2===0){const b=NOTES[score.bass[Math.floor(k/4)%score.bass.length]]/4;this.voice(b,this.nextTime,score.step*1.8,'triangle',score.gain*1.6,this.music);}
   this.nextTime+=score.step;this.step++;}}
  clearTimeout(this.timer);this.timer=setTimeout(()=>this.schedule(),120);
 }
 voice(freq,when,dur,type,gain,dest=this.master){const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(gain,when+.01);g.gain.exponentialRampToValueAtTime(.0001,when+dur);o.connect(g);g.connect(dest);o.start(when);o.stop(when+dur+.02);}
 ok(){return this.enabled&&!this.paused&&this.context&&this.master;}
 sample(name,{rate=1,gain=.8,offset=0,duration}={}){if(!this.ok())return false;const buf=this.buffers[name];if(!buf)return false;const c=this.context,s=c.createBufferSource(),g=c.createGain();s.buffer=buf;s.playbackRate.value=rate;g.gain.value=gain;s.connect(g);g.connect(this.master);s.start(c.currentTime,offset,duration);return true;}
 tone(freq,duration=.08,type='square',gain=.12,delay=0){if(!this.ok())return;this.voice(freq,this.context.currentTime+delay,duration,type,gain);}
 burst(gain=.12,dur=.12,freq=2400){if(!this.ok())return;const c=this.context,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime;s.buffer=this.noise;f.type='bandpass';f.frequency.value=freq;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(this.master);s.start(t,Math.random()*.5,dur+.02);}
 effect(name){
  const S=(n,o)=>this.sample(n,o);
  const map={
   select:()=>S('select',{gain:.5,offset:.07,duration:.4})||this.tone(520,.035),
   hurt:()=>S('damage',{gain:.9})||this.tone(49,.2),
   heal:()=>S('ding',{gain:.7,rate:1.2})||this.tone(780,.16,'triangle'),
   dead:()=>S('heavy',{gain:.8,rate:.8})||this.tone(41,.6),
   spare:()=>S('ding',{gain:.8,rate:.9}),attack:()=>S('slash',{gain:.6}),
   slash:()=>S('slash',{gain:.45,rate:1.2}),lunge:()=>S('slash',{gain:.4,rate:1.45}),swing:()=>this.burst(.06,.12,1500),
   spike:()=>{this.burst(.06,.06,5200);this.tone(1568,.05,'triangle',.04);},
   buster:()=>{this.burst(.12,.3,700);this.tone(196,.25,'sawtooth',.05);},
   pop:()=>this.tone(1318,.04,'sine',.05),cue:()=>this.tone(988,.03,'triangle',.04),
   gift:()=>{this.tone(784,.08,'triangle',.06);this.tone(1175,.12,'triangle',.05,.06);},
   zee:()=>this.tone(392,.18,'sine',.05),
   // Deltarune's graze: a short bright tick.
   graze:()=>{const now=this.context?.currentTime??0;if(now-(this.lastGraze??-1)<.06)return;this.lastGraze=now;this.tone(2093,.025,'square',.025);},
   defend:()=>this.tone(523,.12,'triangle',.06),spell:()=>{this.tone(659,.1,'triangle',.07);this.tone(880,.1,'triangle',.07,.1);this.tone(1318,.2,'triangle',.06,.2);},
   roar:()=>{this.burst(.1,.35,320);this.tone(110,.3,'sawtooth',.05);},
   // The roar that breaks the battle: a long low swell, then glass.
   roarBreak:()=>{this.burst(.22,1.2,240);this.tone(82,1.1,'sawtooth',.08);setTimeout(()=>{this.burst(.2,.5,4200);this.burst(.15,.7,2600);},1600);setTimeout(()=>{this.tone(523,.3,'triangle',.07);this.tone(784,.4,'triangle',.06,.12);this.tone(1046,.6,'triangle',.05,.24);},3000);},
   laser:()=>{this.tone(1760,.08,'sawtooth',.03);this.burst(.06,.25,3200);},shine:()=>{this.tone(1318,.25,'triangle',.05);this.tone(1975,.3,'sine',.03,.05);},block:()=>this.tone(880,.05,'triangle',.06),
   drStart:()=>{},echo:()=>{this.tone(1046,.4,'sine',.04);this.tone(1568,.6,'sine',.025,.2);},
   awaken:()=>{this.tone(262,1.2,'sine',.06);this.tone(392,1.4,'sine',.05,.4);this.tone(523,1.6,'sine',.05,.8);this.burst(.08,2,1800);},
   door:()=>this.burst(.05,.2,600),encounter:()=>{this.tone(880,.06);setTimeout(()=>this.tone(440,.08),110);this.burst(.1,.3,1600);}
  };
  map[name]?.();
 }
 blip(speaker){if(!this.sample('txt',{rate:(VOICE[speaker]||1)*(speaker==='boss'?1+Math.random()*.04:1),gain:.55,duration:.06}))this.tone(200,.03,'square',.06);if(speaker==='boss')this.tone(1046+Math.random()*200,.02,'triangle',.015);}
}
Object.assign(exports,{StageAudio});
