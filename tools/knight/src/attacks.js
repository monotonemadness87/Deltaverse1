// The Knight's attacks, built on DELTARUNE's Roaring Knight fight (the designer's reference: the Kaizo Roaring Knight
// no-hit video, studied turn by turn) and the secret Gerson fight, re-made as the White Roaring Knight's own: the
// dream of the Angel uses the other world's moves. As in the reference, the box changes size and place with the move,
// and the big things (crescents, bars, beams, crystals, thrown swords) cross the whole field, not just the box.
//   blade heart (cyan):  ENCIRCLING BLADES (a ring of swords turns round the box; each lights up and stabs in),
//     SWORD RAIN (rows of standing blades creep along the top and bottom edges while a sword tracks the SOUL from
//     outside, locks, and stabs straight through), THROWN SWORDS (a small box; one at a time, from every side), and
//     its DASH (a thin double line across the screen, then the slash; it ends on a web of them);
//   wild heart (pink):   CRESCENTS (a tall, narrow box by Seth; huge moon-blades cross the whole field in pairs with
//     a gap that wanders), CRYSTAL ERUPTIONS (shadows on the floor, then spires burst up and spray diamond shards
//     through the room), the BAR CURTAIN (blades from floor to ceiling with a winding corridor; blue ones only hurt
//     a SOUL that moves), and RUDE BUSTER;
//   hope heart (green):  the LIGHT (a line from its sword, then a vast cone; stars bloom in it and shatter when it
//     folds), HEAL PRAYER hearts, PACIFY.
// UNIFIED waves combine them and add the BEAMS (thin lines through one point, then blue light across the whole
// screen), the SPLIT BOX, and the HAMMER OF JUSTICE: the dream's memory of the old hero, a GREEN SOUL shield wave.
// The finale drops the box: a void of stars spiralling out, then a web of red light, then hearts.
const UT_BOX={x:180,y:236,w:280,h:150};
const DR_BOX={x:246,y:96,w:150,h:150},TALL={x:176,y:96,w:60,h:150},WIDE={x:190,y:117,w:222,h:148},RAIN={x:228,y:97,w:186,h:148},SMALL={x:282,y:132,w:76,h:76};
const FIELD={x:64,y:16,w:512,h:300},HAMMER_BOX={x:269,y:120,w:102,h:102};
const KX=470,KY=186;// where the Knight's light and thrown swords come from (its sword hand)
const BLADE=['encircle','swordrain','volley','dash'],WILD=['crescent','eruption','bars','rudebuster'],HOPE=['cone','healprayer','pacify'];
const SEG=4.6;
// Which box a move wants in the Deltarune half (the box spins into the new shape when it changes).
const BOXES={crescent:TALL,bars:WIDE,swordrain:RAIN,volley:SMALL};

function moves(g){
 const R=()=>g.random(),a=()=>g.targetArena,sp=()=>g.config.speed,warn=()=>g.config.warn,dr=()=>g.ui==='dr';
 const every=(t0,dur,interval,fn)=>{const step=interval*g.config.density;for(let i=0,t=t0;t<t0+dur-.3;i++,t+=step){const k=i;g.at(t,()=>fn(k));}};
 // Only the Deltarune half reshapes the box (the Undertale half keeps its own).
 const box=(t0,b)=>{if(dr())g.at(t0,()=>g.setArena(b,true));};
 // A sword that follows the SOUL from outside the box, locks (a thin line shows its path), then stabs straight through.
 const stab=(up)=>g.spawn({kind:'tsword',x:g.soul.x,up:up&&dr(),track:.5*warn(),lock:.3*warn(),speed:780*sp(),len:50,life:4});
 const M={
  stabs(t0,dur,interval=1.3){every(t0,dur,interval,k=>stab(k%2===1));},
  // A ring of swords turns round the box; one after another they light up and stab in at the SOUL.
  encircle(t0,dur){box(t0,DR_BOX);every(t0+.2,dur-.2,2.5,k=>{const A=a(),cx=A.x+A.w/2,cy=A.y+A.h/2,n=8,ph=R()*6.28,
    rx=dr()?A.w/2+24:A.w/2+26,ry=dr()?A.h/2+24:A.h/2+12;
   for(let i=0;i<n;i++)g.spawn({kind:'orbitsword',cx,cy,rx,ry,theta:ph+i*6.283/n,spin:.9,aimAt:(1.0+i*.15)*warn(),speed:430*sp(),r:5,life:5,x:cx,y:cy});g.pose('cast_orbiting_blade',1.6);g.emit('cue');});},
  // Rows of standing blades creep along the top and bottom edges; a sword tracks the SOUL and stabs through.
  swordrain(t0,dur){box(t0,BOXES.swordrain);g.at(t0+.25,()=>{g.pose('cast_star_storm',1.2);const A=a();
    // The rows grow in across the whole box, then drift; new blades follow from the right.
    for(let x=A.x+14;x<A.x+A.w+10;x+=34+R()*14)g.spawn({kind:'tooth',x,top:R()<.5,len:22+R()*30,vx:-46*sp(),grow:.55,life:9});g.emit('cue');});
   every(t0+.9,dur-.9,.62,k=>{const A=a();g.spawn({kind:'tooth',x:A.x+A.w+16,top:k%2===0,len:22+R()*30,vx:-46*sp(),grow:.3,life:9});});
   M.stabs(t0+1.1,dur-1.1,1.15);},
  // Thrown swords: a small box, and blades thrown one at a time from every side. Each shows itself, then flies.
  volley(t0,dur){box(t0,BOXES.volley);every(t0+.45,dur-.45,.6,k=>{
   if(k%4===3){stab(R()<.5);return;}
   // The first comes from the Knight's hand; the rest from anywhere round the box.
   const an=k===0?Math.atan2(KY-g.soul.y,KX-g.soul.x):R()*6.283,d=150+R()*30;let x=g.soul.x+Math.cos(an)*d,y=g.soul.y+Math.sin(an)*d;y=Math.max(22,Math.min(g.ui==='dr'?312:386,y));
   const L=Math.hypot(g.soul.x-x,g.soul.y-y)||1,v=390*sp();g.spawn({kind:'thrown',x,y,vx:(g.soul.x-x)/L*v,vy:(g.soul.y-y)/L*v,spin:.5*warn(),life:4});g.pose('thrust_left',.6);g.emit('cue');});},
  // The Knight's dash: a thin double line across the whole screen through the SOUL, then the slash. It ends on a web.
  dash(t0,dur){box(t0,DR_BOX);const line=(px,py,an,w)=>{const c=Math.cos(an),s=Math.sin(an);g.spawn({kind:'slash',x1:px-c*800,y1:py-s*800,x2:px+c*800,y2:py+s*800,w:10,warn:w,live:.16,life:w+1,wide:true});};
   const web=dur>=4.4,solo=web?dur-1.9:dur;
   every(t0+.25,solo-.25,1.15,k=>{line(g.soul.x,g.soul.y,(R()-.5)*.4,.62*warn());g.pose('dash_left',1);g.emit('cue');});
   if(web)g.at(t0+dur-1.75,()=>{const A=a();for(let i=0;i<4;i++)line(A.x+20+R()*(A.w-40),A.y+16+i*(A.h-32)/3,(R()-.5)*.9,.95*warn());g.pose('spin_multislash',1.5);g.emit('cue');});},
  // Crescents: a tall, narrow box. Pairs of huge moon-blades cross the whole field from the Knight, one above and one
  // below a gap that wanders; now and then a sword stabs down the box.
  crescent(t0,dur){box(t0,BOXES.crescent);let gy=null;
   every(t0+.15,dur-1.1,.84,k=>{const A=dr()?TALL:a(),R0=78,span=.95,gap=44,half=R0*Math.sin(span),lo=A.y+gap/2+12,hi=A.y+A.h-gap/2-12;
    gy=gy===null?A.y+A.h/2:Math.max(lo,Math.min(hi,gy+(R()<.5?-1:1)*(30+R()*34)));if(k>0&&(gy===lo||gy===hi)&&R()<.5)gy=A.y+A.h/2;
    for(const s of [-1,1])g.spawn({kind:'buster',moon:true,out:true,x:640+R0+20,y:gy+s*(gap/2+half),vx:-330*sp(),R:R0,thick:22,span,facing:Math.PI,warn:0,life:4});
    g.pose('slash_horizontal',.8);g.emit('swing');});
   M.stabs(t0+2.2,dur-2.2,1.7);},
  // Shadows spread on the floor all over the room (and a few on the ceiling); a moment later tall crystal spires burst
  // out of them and spray diamond shards everywhere. One in three comes up through the box itself.
  eruption(t0,dur){box(t0,DR_BOX);every(t0+.25,dur-.25,.5,k=>{const A=a(),down=k%5===4,inBox=k%3===1;
    const x=inBox?Math.max(A.x+14,Math.min(A.x+A.w-14,g.soul.x+(R()-.5)*70)):(R()<.5?40+R()*(A.x-70):A.x+A.w+30+R()*(600-A.x-A.w-30));
    const floor=inBox?Math.max(A.y+A.h+30,300):262+R()*54,len=down?(inBox?A.y+A.h*.72:150+R()*60):(inBox?floor-(A.y+A.h*.22):150+R()*70);
    g.spawn({kind:'eruption',out:true,down,x,y:down?0:floor,w:44,len,warn:.85*warn(),live:.42,life:3});if(k%2===0)g.pose('ground_slam',1);});},
  // The Undertale half's crystals: they come up through the box floor (and down from its top) where the cracks show.
  teeth(t0,dur){every(t0+.3,dur-.3,.62,k=>{const A=a(),top=k%4===3,x=k%2?Math.max(A.x+14,Math.min(A.x+A.w-14,g.soul.x+(R()-.5)*50)):A.x+16+R()*(A.w-32);
    g.spike(top?'top':'bottom',x,{w:26,len:A.h*(top?.5:.68),warn:.8,live:.4});if(k%2===0)g.pose('ground_slam',1);
    if(k%3===2)g.at(g.attackTime+.8*warn(),()=>{for(let j=0;j<4;j++){const an=(top?Math.PI/2:-Math.PI/2)+(j-1.5)*.5;g.spawn({kind:'shard',big:true,x,y:top?A.y+A.h*.4:A.y+A.h*.45,vx:Math.cos(an)*100*sp(),vy:Math.sin(an)*100*sp(),r:4,life:3});}});});},
  // The bar curtain: blades from floor to ceiling crossing the whole room, with a corridor that winds; the blue ones
  // close the corridor and only hurt a SOUL that is moving.
  bars(t0,dur){box(t0,BOXES.bars);const A=dr()?WIDE:a(),gapH=48,spacing=44,speed=150*sp(),step=spacing/speed;let gy=A.y+A.h/2;
   for(let i=0,t=t0+.3;t<t0+dur-1.95;i++,t+=step){const k=i;g.at(t,()=>{const blue=k%6>=4;if(!blue)gy=Math.max(A.y+gapH/2+8,Math.min(A.y+A.h-gapH/2-8,gy+(R()-.5)*52));g.spawn({kind:'bar',out:true,x:A.x+A.w+96,vx:-speed,w:20,y0:A.y,y1:A.y+A.h,gapY:gy,gapH,blue,life:6});});}
   g.at(t0+.3,()=>{g.cue('BLUE: STAND STILL');g.pose('spin_multislash',1.6);});M.stabs(t0+2.6,dur-3.4,1.6);},
  // RUDE BUSTER, the real one (cut from the Gerson fight): the purple chevron flies across the box from the Knight.
  // A band flickers along its row first; its head is the only part that hurts; one edge of the box is always clear.
  rudebuster(t0,dur){box(t0,DR_BOX);every(t0+.5,dur-.5,1.3,k=>{const A=a(),half=46,high=R()<.5,y=high?A.y+half-6:A.y+A.h-half+6;g.spawn({kind:'rb',tip:A.x+A.w+30,y,vx:-330*sp(),half,k:.9,thick:30,warn:.55*warn(),life:4});g.pose('overhead_cleave',1);g.emit('cue');});},
  // The Knight's light: a white line runs from its sword through the SOUL, then a vast cone of light opens over the
  // whole left of the room (the light itself is harmless). Stars bloom inside it and drift; when the light folds back
  // into a line they flare, flash white and shatter into shards.
  cone(t0,dur){box(t0,DR_BOX);let ang=Math.PI;
   g.at(t0+.1,()=>{ang=Math.atan2(g.soul.y-KY,g.soul.x-KX);g.spawn({kind:'ray',ox:KX,oy:KY,angle:ang,life:.85*warn()+.1});g.pose('sword_windup',1.2);g.emit('cue');});
   g.at(t0+.1+.85*warn(),()=>{const live=dur-2.5;g.spawn({kind:'cone',ox:KX,oy:KY,angle:ang,half:.36,len:900,warn:0,live,life:dur});g.emit('shine');
    const n=dr()?13:10;for(let i=0;i<n;i++)g.at(g.attackTime+.15+i*(live-.9)/n,()=>{const B=a();let x,y,tries=0;do{x=B.x-34+R()*(B.w+50);y=B.y-24+R()*(B.h+48);}while(Math.hypot(x-g.soul.x,y-g.soul.y)<40&&++tries<8);
     g.spawn({kind:'star6',big:dr(),x,y,vx:(-10-R()*18)*sp(),vy:(R()-.5)*16,r:dr()?9:6,bloom:.45*warn(),fuse:(t0+dur-.95)-g.attackTime+R()*.2,burst:6,life:9});});});
   g.at(t0+dur-1.6,()=>{g.spawn({kind:'ray',ox:KX,oy:KY,angle:ang,life:.5,bright:true});});},
  // HEAL PRAYER: green hearts drift down (catch them), with a few slow sparkles to dodge.
  healprayer(t0,dur,{gifts=6}={}){box(t0,DR_BOX);for(let i=0;i<gifts;i++)g.at(t0+.3+i*(dur-.7)/gifts,()=>{const B=a();g.spawn({kind:'gift',x:B.x+20+R()*(B.w-40),y:B.y+4,vx:(R()-.5)*20,vy:46,r:7,life:7});});every(t0+.5,dur,.75,()=>{const B=a();g.spawn({kind:'star',x:B.x+10+R()*(B.w-20),y:B.y-6,vx:(R()-.5)*30*sp(),vy:70*sp(),r:5,life:7});});},
  // PACIFY: sleepy Zs float across. Touching one makes the SOUL drowsy and lets the Knight spare you a little.
  pacify(t0,dur){box(t0,DR_BOX);every(t0+.2,dur,.42,k=>{const A=a();g.spawn({kind:'zee',x:A.x+A.w+10,y:A.y+14+R()*(A.h-28),vx:-(55+R()*30),vy:-8,r:7,life:7,wob:R()*6});});every(t0+.7,dur,.9,()=>{const A=a();g.spawn({kind:'star',x:A.x+A.w+6,y:A.y+10+R()*(A.h-20),vx:-110*sp(),vy:(R()-.5)*30,r:5,life:7});});g.at(t0,()=>g.spareSeth(4));},
  // Six-pointed stars gather round the box, then dive at Seth and burst.
  starburst(t0,dur){every(t0,dur,1.3,k=>{const A=a(),cx=A.x+A.w/2,cy=A.y+A.h/2;for(let i=0;i<5;i++){const an=R()*6.28,d=Math.hypot(A.w,A.h)/2+30;g.spawn({kind:'star6',x:cx+Math.cos(an)*d,y:Math.min(g.ui==='dr'?316:388,cy+Math.sin(an)*d),r:7,hover:.55*warn()+i*.1,seek:210*sp(),fuse:1.9+i*.1,burst:5,life:5});}g.emit('cue');g.pose('cast_star_storm',1);});},
  // The beams: thin lines cross the box through one point; a moment later each is a blade of blue light across the
  // whole screen. The SOUL has to be in a wedge between them.
  lasers(t0,dur){box(t0,DR_BOX);every(t0+.3,dur-.5,1.45,k=>{g.pose(k%2?'slash_diagonal':'slash_horizontal',.9);const A=a(),n=Math.min(4,2+k),s=g.soul;
   const off=24+R()*26,oa=R()*6.283,px=Math.max(A.x+12,Math.min(A.x+A.w-12,s.x+Math.cos(oa)*off)),py=Math.max(A.y+12,Math.min(A.y+A.h-12,s.y+Math.sin(oa)*off));
   // Turn the fan until no beam starts on top of the SOUL.
   let base=R()*Math.PI;const clear=b0=>{for(let i=0;i<n;i++){const an=b0+i*Math.PI/n;if(Math.abs((s.x-px)*Math.sin(an)-(s.y-py)*Math.cos(an))<20)return false;}return true;};
   for(let tries=0;tries<12&&!clear(base);tries++)base+=.26;
   for(let i=0;i<n;i++)g.spawn({kind:'laser',full:true,out:true,ox:px,oy:py,angle:base+i*Math.PI/n+(R()-.5)*.1,spin:0,w:14,warn:.8*warn(),live:.3,life:2,col:'#1018ff'});
   g.effects.push({type:'kslash',life:.5+.8*warn(),delay:.8*warn()});g.emit('cue');});},
  // The box splits in two along the Knight's slash and the halves slide apart; diamonds line the seam, then stream out
  // of it through both halves in rows; a pale beam crosses now and then.
  split(t0,dur){box(t0,DR_BOX);
   const seq=['v','h','v'],part=dur/seq.length;
   seq.forEach((o,i)=>{const ts=t0+i*part;
    g.at(ts,()=>{g.splitTarget=0;g.setArena(DR_BOX);const A=DR_BOX,cx=A.x+A.w/2,cy=A.y+A.h/2;g.pose('cast_diamond_storm',1.2);
     g.spawn(o==='v'?{kind:'slash',x1:cx,y1:-20,x2:cx+14,y2:340,w:8,warn:.3,live:.14,wide:true,harmless:true}:{kind:'slash',x1:-20,y1:cy,x2:660,y2:cy+10,w:8,warn:.3,live:.14,wide:true,harmless:true});g.emit('cue');});
    g.at(ts+.32,()=>{const A=DR_BOX,G=44;g.split=o;g.splitTarget=G;g.setArena(o==='v'?{x:A.x-G/2,y:A.y,w:A.w+G,h:A.h}:{x:A.x,y:A.y-G/2,w:A.w,h:A.h+G});});
    for(let w=0;w<2;w++)g.at(ts+.75+w*.72,()=>{const A=g.targetArena,cx=A.x+A.w/2,cy=A.y+A.h/2,ph=R()*30;
     for(const sd of [-1,1])for(let j=0;j<5;j++){const p=10+((j*31+ph+(sd>0?15:0))%(o==='v'?A.h-20:A.w-20));
      g.spawn(o==='v'?{kind:'shard',big:true,x:cx+sd*8,y:A.y+p,vx:sd*135*sp(),vy:0,hold:.32*warn(),r:5,life:3}:{kind:'shard',big:true,x:A.x+p,y:cy+sd*8,vx:0,vy:sd*135*sp(),hold:.32*warn(),r:5,life:3});}});});
   g.at(t0+dur-.25,()=>{g.splitTarget=0;g.setArena(DR_BOX);});g.at(t0+dur-.05,()=>{g.split=false;});
   every(t0+1.5,dur-1.8,2.1,()=>{const s=g.soul,an=R()*3.14;g.spawn({kind:'laser',full:true,out:true,ox:s.x+(R()-.5)*30,oy:s.y+(R()-.5)*30,angle:an,spin:0,w:12,warn:.7*warn(),live:.28,life:1.6,col:'#8a98ff'});});},
  // HAMMER OF JUSTICE (the old hero, as the dream remembers him): the SOUL turns green and holds a shield.
  // Spears come from four sides; gold ones are tricks that curve round and come from the opposite side.
  hammer(t0,dur){g.at(t0,()=>{g.setArena(HAMMER_BOX,true);g.mode='green';g.shield='up';g.soul={x:HAMMER_BOX.x+HAMMER_BOX.w/2,y:HAMMER_BOX.y+HAMMER_BOX.h/2};g.cue('ARROW KEYS TURN THE SHIELD');});g.at(t0+dur-.05,()=>{g.mode='red';});
   const sides=['up','right','down','left'];let last='up';every(t0+.9,dur-1,.5,k=>{let side;do side=sides[Math.floor(R()*4)];while(side===last&&R()<.6);last=side;const trick=k>3&&R()<.25;g.spawn({kind:'arrow',side,dist:150,speed:190*sp(),trick,life:6});});g.pose('guard_parry',dur);},
  stars(t0,dur){every(t0,dur,.5,()=>{const A=a();g.spawn({kind:'star',x:A.x+10+R()*(A.w-20),y:A.y-6,vx:(R()-.5)*40*sp(),vy:95*sp(),r:5,fuse:.8+R()*.8,life:6});});}
 };
 return M;
}

function buildWave(g,plan){
 const M=moves(g);g.split=false;g.splitTarget=0;g.splitGap=0;g.voidMode=false;
 if(plan.kind==='arrival'){
  const d=11.5;
  if(plan.i===0){M.stars(0,d);M.stabs(3,d-3,1.5);}
  else if(plan.i===1){M.teeth(0,d);}
  else if(plan.i===2){M.encircle(0,d);M.healprayer(1,d-1,{gifts:4});}
  else{M.encircle(0,6);M.starburst(5.5,6);}
  return d;
 }
 // Between two moves the last one's leftovers fade so nothing strays into the new box.
 const cut=t=>g.at(t,()=>g.clearHazards());
 if(plan.kind==='triple'){const [b,w,h]=plan.picks;M[b](0,SEG);cut(SEG);M[w](SEG,SEG);cut(SEG*2);M[h](SEG*2,SEG);return SEG*3+.4;}
 if(plan.kind==='unified'){
  const d=13,i=plan.i%4;
  if(i===0){M.cone(0,6.6);M.starburst(1.4,4.4);cut(6.6);M.encircle(6.6,6.4);M.healprayer(6.6,6.4,{gifts:3});}
  else if(i===1){M.bars(0,7);cut(7);M.eruption(7,6);M.pacify(7,6);}
  else if(i===2){M.hammer(0,d-.2);}
  else{M.split(0,6.5);cut(6.55);M.lasers(6.6,6.4);M.stabs(8,4.6,1.9);}
  return d;
 }
 // A NEW WORLD: the box falls away into the void of stars; then red light; then nothing but hearts.
 g.at(0,()=>{g.setArena(FIELD,true);g.voidMode=true;g.pose('finale_ascend',15);});
 for(let t=.8;t<9;t+=.14){g.at(t,()=>{const arms=5,base=g.attackTime*1.1;for(let j=0;j<arms;j++){const an=base+j*6.283/arms;g.spawn({kind:'star6',x:320,y:166,vx:Math.cos(an)*120*g.config.speed,vy:Math.sin(an)*120*g.config.speed,r:6,life:4});}});}
 for(let t=9.4;t<14.6;t+=.55){g.at(t,()=>{const an=g.random()*6.28,ox=320+Math.cos(an)*320,oy=166+Math.sin(an)*220;g.spawn({kind:'laser',out:true,ox,oy,angle:Math.atan2(g.soul.y-oy,g.soul.x-ox)+(g.random()-.5)*.4,spin:0,w:5,warn:.7*g.config.warn,live:1.1,life:2.4,col:'#ff2a3a'});});}
 g.at(15.2,()=>{g.bullets=g.bullets.filter(b=>b.kind==='gift');g.effects.push({type:'flash',life:.3,color:'#ffffff'});g.emit('heal');});
 for(let i=0;i<18;i++)g.at(15.4+i*.12,()=>{const A=g.targetArena;g.spawn({kind:'gift',x:A.x+30+g.random()*(A.w-60),y:A.y+4,vx:0,vy:80,r:7,life:5,last:true});});
 return 18.6;
}
// The Knight's plan for its next turn.
function planWave(g){
 const S=require("story.js");
 if(g.ui!=='dr')return{kind:'arrival',i:Math.min(3,g.dodges),name:S.ARRIVAL_NAMES[Math.min(3,g.dodges)],box:UT_BOX};
 if(g.knightMercy>=100&&g.sethMercy>=100&&!g.finaleDone)return{kind:'finale',name:S.FINALE_NAME,box:DR_BOX};
 if(g.knightMercy>=70||g.finaleDone){const i=g.unifiedCount;return{kind:'unified',i,name:S.UNIFIED_NAMES[i%4],box:i%4===2?HAMMER_BOX:DR_BOX};}
 const n=g.dodges-4,pick=(list,k)=>list[(n+k+Math.floor(g.random()*list.length))%list.length],b=pick(BLADE,0);
 return{kind:'triple',picks:[b,pick(WILD,1),pick(HOPE,2)],box:BOXES[b]||DR_BOX};
}
Object.assign(exports,{buildWave,planWave,UT_BOX,DR_BOX,TALL,WIDE,RAIN,SMALL,FIELD,HAMMER_BOX,BOXES,BLADE,WILD,HOPE,KX,KY,SEG});
