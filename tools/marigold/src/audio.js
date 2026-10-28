// No theme has been supplied for Marigold yet, so her music is synthesized: a D-minor music-box waltz
// for the trap, the same waltz driven hard for the hunt, and wind for the walk. Effects and voices are Web Audio too.
const MELODY=[[69,2],[65,1],[67,1],[69,1],[74,1],[72,2],[69,1],[65,3],[64,2],[65,1],[67,1],[69,1],[70,1],[69,2],[67,1],[64,3],
 [69,2],[65,1],[67,1],[69,1],[74,1],[77,2],[76,1],[74,3],[72,1],[70,1],[69,1],[67,2],[70,1],[69,1],[67,1],[64,1],[62,3]];
const ROOTS=[50,50,53,53,48,43,45,45,50,50,46,46,43,43,45,50];
const hz=m=>440*Math.pow(2,(m-69)/12);
class StageAudio{
 constructor(){this.enabled=false;this.paused=false;this.context=null;this.master=null;this.music=null;this.mode='off';this.nextTime=0;this.step=0;this.timer=null;this.userMuted=false;}
 async enable(value){
  this.enabled=value;
  if(!value){this.updateGain();return;}
  try{
   this.context??=new(window.AudioContext||window.webkitAudioContext)();
   if(!this.master){this.master=this.context.createGain();this.master.gain.value=0;const f=this.context.createBiquadFilter();f.type='lowpass';f.frequency.value=4200;this.master.connect(f);f.connect(this.context.destination);this.music=this.context.createGain();this.music.gain.value=.55;this.music.connect(this.master);this.noise=this.makeNoise();}
   await this.context.resume();
  }catch{/* Effects stay silent without Web Audio. */}
  this.updateGain();this.schedule();
 }
 makeNoise(){const c=this.context,b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}
 updateGain(){if(this.master)this.master.gain.setTargetAtTime(this.enabled&&!this.paused&&!this.gameOver?.16:0,this.context.currentTime,.05);}
 status(mode,paused,gameOver=false){
  if(mode!==this.mode){this.mode=mode;this.step=0;if(this.context)this.nextTime=this.context.currentTime+.08;}
  if(paused!==this.paused||gameOver!==this.gameOver){this.paused=paused;this.gameOver=gameOver;this.updateGain();}
  this.schedule();
 }
 // Look-ahead sequencer: waltz beats for the battle, sparse music box and wind for the walk.
 schedule(){
  if(!this.enabled||!this.context||!this.master||this.paused)return;const c=this.context;if(this.nextTime<c.currentTime)this.nextTime=c.currentTime+.05;
  const hunt=this.mode==='hunt',walk=this.mode==='walk'||this.mode==='walkHunt',beat=hunt?.21:walk?.62:.34;
  if(this.mode==='off'||this.mode==='end')return;
  while(this.nextTime<c.currentTime+.4){
   const t=this.nextTime,s=this.step,notes=MELODY,total=notes.reduce((n,x)=>n+x[1],0),pos=s%total;
   let acc=0,note=null,start=false;for(const [m,len] of notes){if(pos>=acc&&pos<acc+len){note=m;start=pos===acc;break;}acc+=len;}
   const bar=Math.floor(pos/3)%16,root=ROOTS[bar],beatInBar=pos%3;
   if(walk){if(start&&s%2===0)this.voice(hz(note+12),t,1.4,'triangle',.05,this.music);if(beatInBar===0&&s%6===0)this.wind(t,beat*6,this.mode==='walkHunt'?.05:.03);}
   else{
    if(start)this.voice(hz(note+12),t,beat*1.8,hunt?'square':'triangle',hunt?.05:.09,this.music);
    if(start&&!hunt)this.voice(hz(note+24),t,beat*.6,'sine',.03,this.music);
    this.voice(hz(beatInBar===0?root:root+(beatInBar===1?7:12)),t,beat*.9,hunt?'sawtooth':'square',beatInBar===0?.07:.035,this.music);
    if(hunt){this.voice(hz(root-12),t,beat*.5,'square',.06,this.music);this.hat(t,beatInBar===0?.06:.025);if(beatInBar===0)this.kick(t);}
   }
   this.nextTime+=beat;this.step++;
  }
  clearTimeout(this.timer);this.timer=setTimeout(()=>this.schedule(),120);
 }
 voice(freq,when,dur,type,gain,dest=this.master){const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(gain,when+.01);g.gain.exponentialRampToValueAtTime(.0001,when+dur);o.connect(g);g.connect(dest);o.start(when);o.stop(when+dur+.02);}
 hat(when,gain){const c=this.context,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;f.type='highpass';f.frequency.value=7000;g.gain.setValueAtTime(gain,when);g.gain.exponentialRampToValueAtTime(.0001,when+.05);s.connect(f);f.connect(g);g.connect(this.music);s.start(when,Math.random()*.5,.08);}
 kick(when){const c=this.context,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(120,when);o.frequency.exponentialRampToValueAtTime(40,when+.12);g.gain.setValueAtTime(.18,when);g.gain.exponentialRampToValueAtTime(.0001,when+.16);o.connect(g);g.connect(this.music);o.start(when);o.stop(when+.18);}
 wind(when,dur,gain){const c=this.context,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;s.loop=true;f.type='bandpass';f.frequency.setValueAtTime(500,when);f.frequency.linearRampToValueAtTime(900,when+dur/2);f.Q.value=.6;g.gain.setValueAtTime(.0001,when);g.gain.linearRampToValueAtTime(gain,when+dur/2);g.gain.linearRampToValueAtTime(.0001,when+dur);s.connect(f);f.connect(g);g.connect(this.music);s.start(when);s.stop(when+dur+.05);}
 tone(freq,duration=.08,type='square',gain=.12){if(!this.enabled||this.paused||!this.context||!this.master)return;this.voice(freq,this.context.currentTime,duration,type,gain);}
 burst(gain=.12,dur=.12,freq=2400){if(!this.enabled||this.paused||!this.context||!this.master)return;const c=this.context,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime;s.buffer=this.noise;f.type='bandpass';f.frequency.value=freq;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(this.master);s.start(t,Math.random()*.5,dur+.02);}
 effect(name){
  const map={select:()=>this.tone(520,.035),attack:()=>{this.tone(92,.18);this.burst(.1,.1,1400);},hurt:()=>{this.tone(49,.2);this.burst(.12,.1,900);},heal:()=>this.tone(780,.16,'triangle'),dead:()=>this.tone(41,.6),cue:()=>this.tone(880,.03,'triangle',.06),
   thorn:()=>{this.burst(.09,.08,3600);this.tone(1320,.05,'triangle',.05);},fizzle:()=>this.burst(.04,.06,5000),lance:()=>this.burst(.14,.22,1200),swing:()=>this.burst(.16,.3,700),pop:()=>this.tone(1046,.05,'sine',.06),poisoned:()=>this.tone(220,.12,'sawtooth',.05),poison:()=>this.tone(180,.05,'triangle',.04),
   phone:()=>{this.tone(1200,.08,'square',.05);setTimeout(()=>this.tone(1200,.08,'square',.05),160);},aquaCut:()=>this.burst(.13,.09,4200),aqua:()=>this.tone(660,.2,'triangle'),door:()=>this.burst(.05,.2,600),encounter:()=>{this.tone(880,.06);setTimeout(()=>this.tone(440,.06),90);},
   spare:()=>this.tone(988,.4,'triangle'),kill:()=>this.tone(55,.8,'sawtooth',.08),read:()=>this.tone(392,.12,'triangle',.06),turnaround:()=>this.tone(330,.25,'triangle',.06)};
  map[name]?.();
 }
 blip(speaker){const f={boss:440,narrator:165,aqua:300,flowey:520,seth:220}[speaker]||200;this.tone(f*(speaker==='boss'?1+Math.random()*.06:1),.035,speaker==='boss'?'triangle':'square',.07);}
}
Object.assign(exports,{StageAudio});
