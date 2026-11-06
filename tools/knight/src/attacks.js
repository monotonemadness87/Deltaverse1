// The Knight's attacks, built on DELTARUNE's Roaring Knight fight (the designer's reference: the Kaizo Roaring Knight
// no-hit video) and the secret Gerson fight, re-made as the White Roaring Knight's own: the dream of the Angel uses
// the other world's moves.
//   blade heart (cyan): ENCIRCLING BLADES (swords circle the box, then stab in one by one), SWORD RAIN, a SWORD
//     VOLLEY from the Knight, and its DASH (a slash across the whole screen);
//   wild heart (pink): CRESCENTS swept through a tall, narrow box, CRYSTAL ERUPTIONS (a shadow on the floor, then a
//     crystal bursts up and flings shards), the BAR CURTAIN (white bars with a gap to slip through; blue bars only
//     hurt if you move), and RUDE BUSTER;
//   hope heart (green): the LIGHT CONE from its sword (leave the cone; stars bloom in it), HEAL PRAYER hearts, PACIFY.
// UNIFIED waves combine them, and one is the HAMMER OF JUSTICE: the dream's memory of the old hero, a GREEN SOUL
// shield wave in a turning box, with spears from four sides and trick spears that curve round to the other side.
// The finale drops the box: a void of stars spiralling out of the Knight, then a web of red light, then hearts.
const UT_BOX={x:180,y:236,w:280,h:150};
const DR_BOX={x:216,y:108,w:170,h:170},TALL={x:262,y:90,w:84,h:208},WIDE={x:168,y:128,w:266,h:138},FIELD={x:64,y:16,w:512,h:300},HAMMER_BOX={x:250,y:142,w:102,h:102};
const KX=522,KY=196;// the Knight's sword, where its light and volleys come from
const BLADE=['encircle','swordrain','volley','dash'],WILD=['crescent','eruption','bars','rudebuster'],HOPE=['cone','healprayer','pacify'];
const SEG=4.6;
// Which box a move wants (the box spins into the new shape when it changes).
const BOXES={crescent:TALL,bars:WIDE,eruption:WIDE,volley:WIDE};

function moves(g){
 const R=()=>g.random(),a=()=>g.targetArena,sp=()=>g.config.speed,warn=()=>g.config.warn;
 const every=(t0,dur,interval,fn)=>{const step=interval*g.config.density;for(let i=0,t=t0;t<t0+dur-.3;i++,t+=step){const k=i;g.at(t,()=>fn(k));}};
 // Only the Deltarune half reshapes the box (the Undertale half keeps its own).
 const box=(t0,b)=>{if(g.ui==='dr')g.at(t0,()=>g.setArena(b,true));};
 const M={
  // Swords appear in a ring round the box, turn to point at Seth, and stab in one after another.
  encircle(t0,dur){every(t0,dur,2.3,k=>{const A=a(),cx=A.x+A.w/2,cy=A.y+A.h/2,r=Math.hypot(A.w,A.h)/2+26,n=7,ph=R()*6.28;for(let i=0;i<n;i++)g.spawn({kind:'orbitsword',cx,cy,radius:r,theta:ph+i*6.283/n,spin:.9,aimAt:(1.05+i*.13)*warn(),speed:400*sp(),r:5,life:5,x:cx,y:cy});g.pose('halo',1.6);g.emit('cue');});},
  // Swords drop point-first through the box; a glint at the edge shows where.
  swordrain(t0,dur){every(t0,dur,.42,k=>{const A=a(),up=k%5===4,x=A.x+10+R()*(A.w-20);g.spawn({kind:'sword',x,y:up?A.y+A.h+30:A.y-30,vy:(up?-1:1)*330*sp(),len:34,w:6,warn:.5*warn(),life:4});});},
  // A volley thrown from the Knight: a row of blades with one gap.
  volley(t0,dur){box(t0,BOXES.volley);every(t0+.4,dur-.4,1.2,k=>{const A=a(),rows=6,gap=Math.floor(R()*rows);for(let i=0;i<rows;i++){if(i===gap)continue;const y=A.y+A.h*(i+.5)/rows;g.spawn({kind:'lance',x:A.x+A.w+30,y,angle:Math.PI,len:46,w:8,speed:520*sp(),warn:.55*warn(),tip:0});}g.pose('lunge',.9);g.emit('cue');});},
  // The Knight's dash: a slash across the whole screen at Seth's height.
  dash(t0,dur){every(t0,dur,1.5,k=>{g.spawn({kind:'dashline',y:g.soul.y,w:10,warn:.62*warn(),live:.16,life:2});g.pose('lunge',1);g.emit('cue');});},
  // Crescents swept through a tall, narrow box from the right: dodge up or down.
  crescent(t0,dur){box(t0,BOXES.crescent);every(t0+.5,dur-.5,.85,k=>{const A=TALL,y=A.y+30+R()*(A.h-60),R0=58;g.spawn({kind:'buster',moon:true,x:A.x+A.w+R0+10,y,vx:-310*sp(),R:R0,thick:13,span:.62,facing:Math.PI,warn:.35*warn(),life:3});g.pose('sweep',.9);g.emit('cue');});},
  // A shadow on the floor, then a crystal erupts there and flings shards.
  eruption(t0,dur){box(t0,BOXES.eruption);every(t0+.4,dur-.4,1.15,k=>{const A=a(),x=Math.max(A.x+24,Math.min(A.x+A.w-24,g.soul.x+(R()-.5)*70));g.spawn({kind:'eruption',x,y:A.y+A.h,w:34,len:A.h*.72,warn:.8*warn(),live:.45,life:3});g.pose('rise',1);});},
  // The bar curtain: white bars with a gap that winds, then blue bars that only hurt if you're moving.
  bars(t0,dur){box(t0,BOXES.bars);const A=WIDE,gapH=48,spacing=30,speed=170*sp(),step=spacing/speed;let gy=A.y+A.h/2;
   for(let i=0,t=t0+.5;t<t0+dur-1.6;i++,t+=step){const k=i;g.at(t,()=>{const blue=Math.floor(k/7)%2===1;if(!blue)gy=Math.max(A.y+gapH/2+6,Math.min(A.y+A.h-gapH/2-6,gy+(R()-.5)*34));g.spawn({kind:'bar',x:A.x+A.w+12,vx:-speed,w:10,y0:A.y,y1:A.y+A.h,gapY:gy,gapH,blue,life:4});});}
   g.at(t0+.3,()=>g.cue('BLUE: STAND STILL'));},
  // RUDE BUSTER: a pink crescent across the box, one end always clear.
  rudebuster(t0,dur){every(t0,dur,1.45,k=>{const A=a(),left=k%2===0,high=R()<.5,cy=A.y+A.h*(high?.3:.7),R0=A.h*.62;g.spawn({kind:'buster',x:left?A.x-R0*.4:A.x+A.w+R0*.4,y:cy,vx:(left?1:-1)*250*sp(),R:R0,thick:16,span:.95,facing:left?0:Math.PI,warn:.55*warn(),life:5});g.pose('sweep',1);g.emit('cue');});},
  // The light cone from its sword: get out of it before it shines; stars bloom inside it and burst.
  cone(t0,dur){every(t0,dur,2.2,k=>{const ang=Math.atan2(g.soul.y-KY,g.soul.x-(KX-40))+(R()-.5)*.1,w=.85*warn();g.spawn({kind:'cone',ox:KX-40,oy:KY,angle:ang,half:.2,len:720,warn:w,live:.7,life:2.2});
   for(let i=0;i<5;i++){const d=150+i*60;g.spawn({kind:'star6',x:KX-40+Math.cos(ang)*d,y:KY+Math.sin(ang)*d,r:7,delay:w+.15,fuse:w+.75+i*.05,burst:6,life:4});}g.pose('slash',1.4);g.emit('cue');});},
  // HEAL PRAYER: green hearts drift down (catch them), with a few slow sparkles to dodge.
  healprayer(t0,dur,{gifts=6}={}){for(let i=0;i<gifts;i++)g.at(t0+.2+i*(dur-.6)/gifts,()=>{const B=a();g.spawn({kind:'gift',x:B.x+20+R()*(B.w-40),y:B.y+4,vx:(R()-.5)*20,vy:46,r:7,life:7});});every(t0+.4,dur,.75,()=>{const B=a();g.spawn({kind:'star',x:B.x+10+R()*(B.w-20),y:B.y-6,vx:(R()-.5)*30*sp(),vy:70*sp(),r:5,life:7});});},
  // PACIFY: sleepy Zs float across. Touching one makes the SOUL drowsy and lets the Knight spare you a little.
  pacify(t0,dur){every(t0,dur,.42,k=>{const A=a();g.spawn({kind:'zee',x:A.x+A.w+10,y:A.y+14+R()*(A.h-28),vx:-(55+R()*30),vy:-8,r:7,life:7,wob:R()*6});});every(t0+.6,dur,.9,()=>{const A=a();g.spawn({kind:'star',x:A.x+A.w+6,y:A.y+10+R()*(A.h-20),vx:-110*sp(),vy:(R()-.5)*30,r:5,life:7});});g.at(t0,()=>g.spareSeth(4));},
  // Six-pointed stars gather round the box, then dive at Seth and burst.
  starburst(t0,dur){every(t0,dur,1.3,k=>{const A=a(),cx=A.x+A.w/2,cy=A.y+A.h/2;for(let i=0;i<5;i++){const an=R()*6.28,d=Math.hypot(A.w,A.h)/2+30;g.spawn({kind:'star6',x:cx+Math.cos(an)*d,y:cy+Math.sin(an)*d,r:7,hover:.55*warn()+i*.1,seek:210*sp(),fuse:1.9+i*.1,burst:5,life:5});}g.emit('cue');});},
  // Blue lasers sweep through the box from outside it.
  lasers(t0,dur){every(t0,dur,1.1,k=>{const A=a(),cx=A.x+A.w/2,cy=A.y+A.h/2,an=R()*6.28,ox=cx+Math.cos(an)*230,oy=cy+Math.sin(an)*170;g.spawn({kind:'laser',ox,oy,angle:Math.atan2(g.soul.y-oy,g.soul.x-ox),spin:(R()<.5?-1:1)*.35,w:12,warn:.75*warn(),live:.55,life:2.5,col:'#3a5aff'});g.emit('cue');});},
  // The box splits in two along a seam; slashes run down the seam and shards fall in both halves.
  split(t0,dur){g.at(t0,()=>{g.setArena(DR_BOX,true);g.split=true;});g.at(t0+dur-.1,()=>{g.split=false;});every(t0+.6,dur-.6,1.3,()=>{const A=DR_BOX;g.spawn({kind:'slash',x1:A.x+A.w/2,y1:A.y-40,x2:A.x+A.w/2,y2:A.y+A.h+40,w:12,warn:.6*warn(),live:.22});});every(t0+.3,dur-.3,.34,k=>{const A=DR_BOX,left=k%2===0,x=left?A.x+8+R()*(A.w/2-26):A.x+A.w/2+18+R()*(A.w/2-26);g.spawn({kind:'shard',x,y:A.y-6,vx:0,vy:120*sp(),r:4,big:true,life:4});});},
  // HAMMER OF JUSTICE (the old hero, as the dream remembers him): the SOUL turns green and holds a shield.
  // Spears come from four sides; gold ones are tricks that curve round and come from the opposite side.
  hammer(t0,dur){g.at(t0,()=>{g.setArena(HAMMER_BOX,true);g.mode='green';g.shield='up';g.soul={x:HAMMER_BOX.x+HAMMER_BOX.w/2,y:HAMMER_BOX.y+HAMMER_BOX.h/2};g.cue('ARROW KEYS TURN THE SHIELD');});g.at(t0+dur-.05,()=>{g.mode='red';});
   const sides=['up','right','down','left'];let last='up';every(t0+.9,dur-1,.5,k=>{let side;do side=sides[Math.floor(R()*4)];while(side===last&&R()<.6);last=side;const trick=k>3&&R()<.25;g.spawn({kind:'arrow',side,dist:150,speed:190*sp(),trick,life:6});});g.pose('rise',dur);},
  stars(t0,dur){every(t0,dur,.5,()=>{const A=a();g.spawn({kind:'star',x:A.x+10+R()*(A.w-20),y:A.y-6,vx:(R()-.5)*40*sp(),vy:95*sp(),r:5,fuse:.8+R()*.8,life:6});});}
 };
 return M;
}

function buildWave(g,plan){
 const M=moves(g);g.split=false;g.voidMode=false;
 if(plan.kind==='arrival'){
  const d=11.5;
  if(plan.i===0){M.stars(0,d);M.swordrain(3,d-3);}
  else if(plan.i===1){M.eruption(0,d);}
  else if(plan.i===2){M.encircle(0,d);M.healprayer(1,d-1,{gifts:4});}
  else{M.encircle(0,6);M.starburst(5.5,6);}
  return d;
 }
 if(plan.kind==='triple'){const [b,w,h]=plan.picks;M[b](0,SEG);g.at(SEG,()=>g.setArena(BOXES[w]||DR_BOX,true));M[w](SEG,SEG);g.at(SEG*2,()=>g.setArena(DR_BOX,true));M[h](SEG*2,SEG);return SEG*3+.4;}
 if(plan.kind==='unified'){
  const d=13,i=plan.i%4;
  if(i===0){M.cone(0,6.6);M.starburst(.6,6);M.encircle(6.6,6.4);M.healprayer(6.6,6.4,{gifts:3});}
  else if(i===1){M.bars(0,7);M.eruption(7,6);M.pacify(7,6);}
  else if(i===2){M.hammer(0,d-.2);}
  else{M.split(0,6.5);M.lasers(6.6,6.4);M.swordrain(7,6);}
  return d;
 }
 // A NEW WORLD: the box falls away into the void of stars; then red light; then nothing but hearts.
 g.at(0,()=>{g.setArena(FIELD,true);g.voidMode=true;});
 for(let t=.8;t<9;t+=.14){g.at(t,()=>{const arms=5,base=g.attackTime*1.1;for(let j=0;j<arms;j++){const an=base+j*6.283/arms;g.spawn({kind:'star6',x:320,y:166,vx:Math.cos(an)*120*g.config.speed,vy:Math.sin(an)*120*g.config.speed,r:6,life:4});}});}
 for(let t=9.4;t<14.6;t+=.55){g.at(t,()=>{const an=g.random()*6.28,ox=320+Math.cos(an)*320,oy=166+Math.sin(an)*220;g.spawn({kind:'laser',ox,oy,angle:Math.atan2(g.soul.y-oy,g.soul.x-ox)+(g.random()-.5)*.4,spin:0,w:5,warn:.7*g.config.warn,live:1.1,life:2.4,col:'#ff2a3a'});});}
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
 const n=g.dodges-4,pick=(list,k)=>list[(n+k+Math.floor(g.random()*list.length))%list.length];
 return{kind:'triple',picks:[pick(BLADE,0),pick(WILD,1),pick(HOPE,2)],box:DR_BOX};
}
Object.assign(exports,{buildWave,planWave,UT_BOX,DR_BOX,TALL,WIDE,FIELD,HAMMER_BOX,BLADE,WILD,HOPE,KX,KY});
