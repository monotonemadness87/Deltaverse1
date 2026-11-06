// The Knight's attacks. Each heart has its own vocabulary, taken from the concept sheet and from the other world:
//   blade (cyan): X-SLASH lines, lunges, crystal spikes from the floor and ceiling;
//   wild heart (pink): RUDE BUSTER crescents, torn cloth lashing down, a boomerang axe;
//   hope (green): HEAL PRAYER hearts (catch them: HP and its mercy for Seth), PACIFY Zs (harmless, sleepy),
//   and the scarf that carries hearts while it tries to spare him.
// The Undertale half has four single waves; the Deltarune half plays one move from each heart in turn (blade, wild,
// hope), then UNIFIED waves with all three at once, then the finale, A NEW WORLD.
const UT_BOX={x:180,y:236,w:280,h:150},DR_BOX={x:206,y:112,w:190,h:170};
const BLADE=['xslash','lunge','spikes'],WILD=['rudebuster','cloth','axe'],HOPE=['healprayer','pacify','scarf'];
const SEG=4.4;

// ------------------------------------------------------------------ the moves (each runs from t0 for dur seconds)
function moves(g){
 const R=()=>g.random(),a=()=>g.targetArena,sp=()=>g.config.speed,warn=()=>g.config.warn;
 const every=(t0,dur,interval,fn)=>{const step=interval*g.config.density;for(let i=0,t=t0;t<t0+dur-.25;i++,t+=step){const k=i;g.at(t,()=>fn(k));}};
 const star=(x,y,vx,vy,o={})=>g.spawn({kind:'star',x,y,vx:vx*sp(),vy:vy*sp(),r:5,life:7,...o});
 const M={
  // Two crossing slashes through a point near Seth: a warning line, then the cut.
  xslash(t0,dur){every(t0,dur,1.15,k=>{const A=a(),cx=Math.max(A.x+30,Math.min(A.x+A.w-30,g.soul.x+(R()-.5)*40)),cy=Math.max(A.y+30,Math.min(A.y+A.h-30,g.soul.y+(R()-.5)*40)),L=Math.max(A.w,A.h);
   for(const s of [1,-1])g.spawn({kind:'slash',x1:cx-L,y1:cy-L*s,x2:cx+L,y2:cy+L*s,w:9,warn:.72*warn()+(s<0?.12:0),live:.2});g.pose('slash',1);g.emit('cue');});},
  // The blade thrusts in from the side at Seth's height.
  lunge(t0,dur){every(t0,dur,.95,k=>{const A=a(),left=k%2===0;g.spawn({kind:'lance',x:left?A.x-30:A.x+A.w+30,y:g.soul.y,angle:left?0:Math.PI,len:110,w:10,speed:640*sp(),warn:.62*warn(),tip:0});g.pose('lunge',.8);g.emit('cue');});},
  // A row of crystal teeth from the floor or the ceiling, with one gap.
  spikes(t0,dur){every(t0,dur,1.35,k=>{const A=a(),edge=k%2?'top':'bottom',gap=A.x+30+R()*(A.w-60),w=18;for(let x=A.x+w/2;x<A.x+A.w;x+=w){if(Math.abs(x-gap)<30)continue;g.spike(edge,x,{w,len:A.h*.55,warn:.75});}g.pose('rise',1);g.emit('cue');});},
  // RUDE BUSTER: a crescent of pink light sweeps across the box. One end of the box is always clear.
  rudebuster(t0,dur){every(t0,dur,1.45,k=>{const A=a(),left=k%2===0,high=R()<.5,cy=A.y+A.h*(high?.3:.7),R0=A.h*.62;g.spawn({kind:'buster',x:left?A.x-R0*.4:A.x+A.w+R0*.4,y:cy,vx:(left?1:-1)*250*sp(),R:R0,thick:16,span:.95,facing:left?0:Math.PI,warn:.55*warn(),life:5});g.pose('sweep',1);g.emit('cue');});},
  // Torn cloth lashes down the box as a wave, with one tear in it to slip through.
  cloth(t0,dur,{interval=1.5,gapW=46}={}){every(t0,dur,interval,k=>{const A=a(),gap=A.x+25+R()*(A.w-50);g.spawn({kind:'ribbon',x:A.x,wd:A.w,y:A.y-6,vy:64*sp(),amp:10,k:.06,spin:3,w:8,gap,gapW,life:6});g.emit('cue');});},
  // The axe, thrown at Seth, comes back.
  axe(t0,dur){every(t0,dur,1.25,k=>{const A=a(),x0=k%2?A.x-14:A.x+A.w+14,y0=A.y+16+R()*(A.h-32),dx=g.soul.x-x0,dy=g.soul.y-y0,d=Math.hypot(dx,dy)||1;g.spawn({kind:'axe',x0,y0,x:x0,y:y0,ux:dx/d,uy:dy/d,dist:d+40,dur:1.7/sp(),r:9,life:2});g.emit('swing');});},
  // HEAL PRAYER: green hearts drift down (catch them), with a few slow sparkles to dodge.
  healprayer(t0,dur,{gifts=6}={}){const A=a();for(let i=0;i<gifts;i++)g.at(t0+.2+i*(dur-.6)/gifts,()=>g.spawn({kind:'gift',x:A.x+20+R()*(A.w-40),y:A.y+4,vx:(R()-.5)*20,vy:46,r:7,life:7}));every(t0+.4,dur,.75,()=>star(A.x+10+R()*(A.w-20),A.y-6,(R()-.5)*30,70));},
  // PACIFY: sleepy Zs float across. They don't hurt; touching one makes the SOUL drowsy (slower) and lets it spare you a little.
  pacify(t0,dur){const A=a();every(t0,dur,.42,k=>g.spawn({kind:'zee',x:A.x+A.w+10,y:A.y+14+R()*(A.h-28),vx:-(55+R()*30),vy:-8,r:7,life:7,wob:R()*6}));every(t0+.6,dur,.9,()=>star(A.x+A.w+6,A.y+10+R()*(A.h-20),-110,(R()-.5)*30));},
  // The scarf sweeps across carrying hearts while the hope heart tries to spare Seth.
  scarf(t0,dur){const A=a();g.at(t0,()=>{g.spawn({kind:'scarf',x:A.x-80,y:A.y+A.h*.5,vx:120,amp:A.h*.28,life:dur+1});g.spareSeth(6,'scarf');});for(let i=0;i<3;i++)g.at(t0+.5+i*.9,()=>g.spawn({kind:'gift',x:A.x-10,y:A.y+A.h*(.3+.2*i),vx:110,vy:0,r:7,life:5}));every(t0+.5,dur,.8,()=>star(A.x+10+R()*(A.w-20),A.y-6,0,80));},
  // The halo: blades orbit the box and close in, then fly out.
  halo(t0,dur){g.at(t0,()=>{const A=a(),cx=A.x+A.w/2,cy=A.y+A.h/2,r=Math.min(A.w,A.h)*.62;for(let k=0;k<10;k++)g.spawn({kind:'orbitblade',cx,cy,radius:r,r0:r,theta:k*Math.PI/5,spin:1.1,close:dur*.55,life:dur+.5,r:6});g.pose('halo',dur);g.emit('cue');});},
  stars(t0,dur){const A=a();every(t0,dur,.5,()=>star(A.x+10+R()*(A.w-20),A.y-6,(R()-.5)*40,95,{fuse:.8+R()*.8}));}
 };
 return M;
}

// ------------------------------------------------------------------ the waves
function buildWave(g,plan){
 const M=moves(g);
 if(plan.kind==='arrival'){
  const d=11.5;
  if(plan.i===0){M.stars(0,d);M.xslash(2.5,d-2.5);}
  else if(plan.i===1){M.spikes(0,d);M.stars(4,d-4);}
  else if(plan.i===2){M.cloth(0,d,{interval:2.1,gapW:62});M.lunge(5,d-5);M.healprayer(1,d-1,{gifts:4});}
  else{M.halo(0,6);M.xslash(1.2,4.6);M.halo(6.2,5.2);M.stars(6.5,5);}
  return d;
 }
 if(plan.kind==='triple'){const [b,w,h]=plan.picks;M[b](0,SEG);M[w](SEG,SEG);M[h](SEG*2,SEG);return SEG*3+.4;}
 if(plan.kind==='unified'){
  const d=13;
  if(plan.i%3===0){M.halo(0,6.5);M.xslash(.8,5.6);M.halo(6.6,6);M.rudebuster(7,6);M.healprayer(6.6,6,{gifts:3});}
  else if(plan.i%3===1){M.rudebuster(0,6.5);M.lunge(.6,6);M.cloth(6.5,6.5);M.pacify(6.5,6.5);}
  else{M.spikes(0,6.5);M.cloth(1,5.5);M.axe(6.5,6.5);M.healprayer(6.5,6.5,{gifts:4});}
  return d;
 }
 // A NEW WORLD: every piece of the dream at once, then nothing but hearts.
 M.halo(0,4.5);M.stars(0,4.5);M.rudebuster(4.5,4);M.lunge(4.8,3.7);M.spikes(8.5,4);M.cloth(9,3.5);
 M.xslash(12.5,3);M.axe(12.5,3);M.pacify(12.5,3);
 for(let i=0;i<16;i++)g.at(15.6+i*.12,()=>{const A=g.targetArena;g.spawn({kind:'gift',x:A.x+12+g.random()*(A.w-24),y:A.y+4,vx:0,vy:70,r:7,life:5,last:true});});
 g.at(15.5,()=>{g.bullets=g.bullets.filter(b=>b.kind==='gift');g.effects.push({type:'flash',life:.25,color:'#ffffff'});g.emit('heal');});
 return 18.5;
}
// The Knight's plan for its next turn.
function planWave(g){
 if(g.ui!=='dr')return{kind:'arrival',i:Math.min(3,g.dodges),name:require("story.js").ARRIVAL_NAMES[Math.min(3,g.dodges)],box:UT_BOX};
 if(g.knightMercy>=100&&g.sethMercy>=100&&!g.finaleDone)return{kind:'finale',name:require("story.js").FINALE_NAME,box:DR_BOX};
 if(g.knightMercy>=70||g.finaleDone){const i=g.unifiedCount;return{kind:'unified',i,name:require("story.js").UNIFIED_NAMES[i%3],box:DR_BOX};}
 const n=g.dodges-4,pick=(list,k)=>list[(n+k+Math.floor(g.random()*3))%3];
 return{kind:'triple',picks:[pick(BLADE,0),pick(WILD,1),pick(HOPE,2)],box:DR_BOX};
}
Object.assign(exports,{buildWave,planWave,UT_BOX,DR_BOX,BLADE,WILD,HOPE});
