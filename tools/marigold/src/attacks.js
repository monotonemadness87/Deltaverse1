// Marigold's attacks: thorncraft, the thorn sword and lance, buttercup pollen, flower showers,
// and the dread of her dead Royal Guard. The hunt (genocide) is a separate, much harsher score.
const A=(id,name,arena,duration)=>({id,name,arena,duration});
const box=(w,h,y=null)=>({x:320-w/2,y:y??(388-h),w,h});
const ATTACKS={
 pacifist:[
  A('bloom','FIRST BLOOM',box(248,158),11),
  A('wall','THE GARDEN WALL',box(308,162),13),
  A('lance','THE LANCE',box(340,150),13),
  A('waltz','PETAL WALTZ',box(240,172),14),
  A('crown','CROWN OF THORNS',box(204,176),14),
  A('sword','THE THORN SWORD',box(300,160),14),
  A('field','BUTTERCUP FIELD',box(330,166),15),
  A('guard','THE ROYAL GUARD',box(400,164),15),
  A('shower','FLOWER SHOWER',box(232,180),15),
  A('oath','THE OATH',box(340,176),16),
  A('carry','CARRY IT ON',box(308,168),16),
  A('hope','THE HOPE OF THE UNDERGROUND',box(280,176),17),
  A('hesitate','HESITATION',box(248,164),14),
  A('memorial','FORGET-ME-NOT',box(340,180),26)
 ],
 genocide:[
  A('g-hunt','THE HUNT',box(300,160),14),
  A('g-wall','THORN GARDEN',box(320,170),15),
  A('g-poison','SACRED POISON',box(320,170),15),
  A('g-sword','THE KNIGHT\'S ARC',box(300,164),16),
  A('g-guard','THE LAST GUARD',box(420,170),16),
  A('g-mages','WHAT KILLED US',box(260,180),17),
  A('g-waltz','RED PETALS',box(250,180),16),
  A('g-crown','CROWN OF THORNS',box(220,184),17),
  A('g-dread','DREAD',box(340,176),18),
  A('g-oath','THE OATH',box(360,180),18),
  A('g-shower','FLOWER SHOWER',box(250,184),18),
  A('g-live','WE WILL LIVE ON',box(340,180),21),
  A('g-agony','THORNS OF AGONY',{x:42,y:100,w:556,h:288},30),
  A('g-stand','STILL STANDING',box(300,176),20)
 ]
};

function buildAttack(g,attack){
 const a=attack.arena,cx=a.x+a.w/2,cy=a.y+a.h/2,R=()=>g.random(),soul=()=>g.soul;
 const every=(s,e,i,f)=>g.every(s,e,i,f),at=(t,f)=>g.at(t,f);
 const gapAt=(edge,spread=70)=>{const vertical=edge==='top'||edge==='bottom',span=vertical?a.w:a.h,me=vertical?soul().x-a.x:soul().y-a.y;return Math.max(40,Math.min(span-40,me+(R()-.5)*spread*2));};
 const rows=(edges,gapW,opts)=>i=>{const e=edges[i%edges.length];g.thornRow(e,gapAt(e),gapW,opts);};
 const lanceAt=(sides)=>i=>g.lance(sides[i%sides.length]);
 const spiral=(arms,speed,turn,step=.36)=>i=>{for(let k=0;k<arms;k++)g.petal(cx,a.y+8,i*step+k*Math.PI*2/arms+Math.PI/2*.2,speed,k%2?turn:-turn);g.pose('shower'+(i%3),.5);};
 const rain=(n=1,vy=70,R0=24,petals=0)=>()=>{for(let k=0;k<n;k++)g.bud(a.x+16+R()*(a.w-32),a.y-6,{vy,fuse:1.3+R()*1.1,R:R0,petals});g.pose('spell'+(g.turn%3),.6);};
 const swords=(warn=.85)=>i=>g.sword(i%2===0,(i>>1)%2?'near':'far',{warn});
 const ghosts=(gap=58,speed=120,both=false)=>i=>{const left=both?true:i%2===0,gy=a.y+30+R()*(a.h-60);for(let y=a.y+18;y<a.y+a.h-8;y+=40){if(Math.abs(y-gy)<gap/2+10)continue;g.ghost(left,y,{speed});if(both)g.ghost(!left,y+20>a.y+a.h-18?y-20:y+20,{speed:speed*.8});}};
 const orbitSoul=(n=8,r=72,release=1.6)=>i=>g.orbit(soul().x,soul().y,n,r,{spin:i%2?-1.3:1.3,release,phase:i*.4});
 const stars=(n=6,speed=100)=>i=>{for(let k=0;k<n;k++){const an=i*.5+k*Math.PI*2/n;g.star(cx,a.y-14,Math.cos(an)*speed,Math.abs(Math.sin(an))*speed+30);}};
 switch(attack.id){
  // ---------------------------------------------------------------- the trap
  case 'bloom':every(.4,9.5,.78,rain(1,64,22));every(2,10,2.8,spiral(6,70,0,.5));break;
  case 'wall':every(.3,12,1.32,rows(['bottom','top'],66,{w:22}));every(2.4,12,2.6,rain(1,70,20));break;
  case 'lance':every(.4,12,1.05,lanceAt(['left','right']));every(3,12,3.3,()=>g.thorn('bottom',soul().x-a.x,{w:26}));break;
  case 'waltz':every(.2,13,.42,spiral(2,92,.55));every(3,13,4,()=>g.cue('THE WALTZ TURNS'));break;
  case 'crown':every(.3,13,1.75,i=>{if(i%2){g.thornRow('left',-999,0,{len:a.w/2-34});g.thornRow('right',-999,0,{len:a.w/2-34});}else{g.thornRow('top',-999,0,{len:a.h/2-30});g.thornRow('bottom',-999,0,{len:a.h/2-30});}});every(1.2,13,2.6,i=>g.star(i%2?a.x+10:a.x+a.w-10,a.y+10,(i%2?1:-1)*60,70));at(.2,()=>g.cue('THE CENTER IS SAFE'));break;
  case 'sword':at(.1,()=>g.cue('NEAR OR FAR'));every(.5,13,1.55,swords());break;
  case 'field':every(.3,14,1.1,i=>{const cols=6,rowsN=3;for(let k=0;k<4;k++){const c=(i*2+k*3)%cols,r=(i+k)%rowsN;g.bud(a.x+28+c*(a.w-56)/(cols-1),a.y+28+r*(a.h-56)/(rowsN-1),{vy:0,fuse:1.2,R:30,petals:k===0?4:0});}g.pose('spell'+(i%3),.6);});break;
  case 'guard':at(.1,()=>g.cue('THE GUARD MARCHES AGAIN'));every(.5,14,1.45,ghosts(60,118));break;
  case 'shower':every(.4,14,2.9,orbitSoul(8,74,1.9));every(1.6,14,3.2,spiral(3,76,.3));break;
  case 'oath':at(0,()=>{g.motion={base:{...a},start:0,shrink:8,max:120};g.cue('THE WALLS CLOSE');});every(.6,15,1.4,lanceAt(['left','top','right','bottom']));every(2.5,15,3,rain(1,60,20));break;
  case 'carry':every(.3,15,1.6,rows(['bottom','top'],70));every(1,15,1.6,lanceAt(['right','left']));every(4,15,4,rain(2,70,22));break;
  case 'hope':every(.4,16,2.7,()=>g.heart(soul().x,soul().y,{size:62,warn:1}));every(1.4,16,2.2,stars(5,90));at(.1,()=>g.cue('LEAVE THROUGH THE POINT'));break;
  case 'hesitate':every(.3,13,1.4,i=>{const e=['bottom','top'][i%2];const gap=gapAt(e),fizz=g.talks>=2;const span=e==='top'||e==='bottom'?a.w:a.h;for(let p=13;p<span;p+=22)if(Math.abs(p-gap)>42)g.thorn(e,p,{fizzle:fizz&&(Math.floor(p/22)+i)%2===0});});every(2,13,3,i=>g.lance(i%2?'left':'right'));break;
  case 'memorial':
   every(.3,5.5,1.2,rows(['bottom','top'],70));every(.9,5.5,1.6,lanceAt(['left','right']));
   at(6.2,()=>g.cue('THE THORN SWORD'));every(6.5,11.5,1.35,swords(.8));
   at(12.2,()=>g.cue('FLOWER SHOWER'));every(12.4,18,2.2,orbitSoul(8,70,1.5));every(13,18,1.2,rain(1,72,22));
   at(18.6,()=>{g.motion={base:{...a},start:g.attackTime,shrink:10,max:110};g.cue('FORGET-ME-NOT');});every(18.8,24.5,1.25,lanceAt(['left','top','right','bottom']));every(19.5,24.5,2.2,spiral(4,80,.4));
   at(25,()=>{g.bullets=[];g.pose('prepare',1.2);g.effects.push({type:'silence',life:1.2});});break;
  // ---------------------------------------------------------------- the hunt
  case 'g-hunt':every(.25,13,.68,lanceAt(['left','top','right','bottom']));every(1.2,13,1.7,()=>g.thorn('bottom',soul().x-a.x,{w:28}));break;
  case 'g-wall':every(.3,14,1.02,i=>{const e=i%2?'top':'bottom';g.thornRow(e,gapAt(e,90),60,{len:a.h*.58});});every(1.5,14,2,rain(1,90,22));break;
  case 'g-poison':every(.2,14,.55,rain(1,105,30,0));every(1.4,14,2.1,()=>{const s=soul();g.bud(s.x,a.y-6,{vy:150,fuse:.75,R:34,petals:5});});break;
  case 'g-sword':at(.1,()=>g.cue('NEAR OR FAR'));every(.4,15,1.2,swords(.75));every(1.6,15,2.4,lanceAt(['left','right']));break;
  case 'g-guard':at(.1,()=>g.cue('THE LAST GUARD'));every(.4,15,1.15,ghosts(56,150,false));every(2.2,15,2.6,i=>g.lance(i%2?'top':'bottom'));break;
  case 'g-mages':at(.1,()=>g.cue('THE MAGIC THAT KILLED THEM'));every(.3,16,1.45,i=>{const s=soul();g.ring(s.x,s.y,96,R()*Math.PI*2,{gapW:1,close:1.75});});every(1,16,2.4,stars(4,105));break;
  case 'g-waltz':every(.15,15,.3,spiral(3,118,.7,.31));every(2,15,2.5,lanceAt(['left','right']));break;
  case 'g-crown':every(.3,16,1.4,i=>{if(i%2){g.thornRow('left',-999,0,{len:a.w/2-30});g.thornRow('right',-999,0,{len:a.w/2-30});}else{g.thornRow('top',-999,0,{len:a.h/2-27});g.thornRow('bottom',-999,0,{len:a.h/2-27});}});every(1,16,1.4,i=>g.lance(i%2?'left':'right',a.y+a.h/2+(i%3-1)*36));at(.2,()=>g.cue('THE CENTER IS SAFE'));break;
  case 'g-dread':at(0,()=>{g.dark=70;g.cue('ONLY THE WARNINGS ARE LIT');});every(.3,17,1.15,rows(['bottom','top','left','right'],62));every(.8,17,1.3,lanceAt(['left','right','top']));at(17.4,()=>{g.dark=0;});break;
  case 'g-oath':at(0,()=>{g.motion={base:{...a},start:0,shrink:8,max:130};g.cue('THE WALLS CLOSE');});every(.5,17,1.45,swords(.78));every(1,17,1.4,lanceAt(['left','right','top','bottom']));break;
  case 'g-shower':every(.3,17,2.2,orbitSoul(9,78,1.45));every(.9,17,1.6,rain(1,90,26,2));break;
  case 'g-live':
   every(.2,5,.9,lanceAt(['left','top','right','bottom']));
   at(5.3,()=>g.cue('NEAR OR FAR'));every(5.5,10,1,swords(.72));
   at(10.3,()=>g.cue('THE MAGIC THAT KILLED THEM'));every(10.5,15.5,1.5,()=>{const s=soul();g.ring(s.x,s.y,94,R()*Math.PI*2,{gapW:.95,close:1.6});});
   every(15.8,20.5,.9,rows(['bottom','top'],62));every(16,20.5,1.2,orbitSoul(8,70,1.4));break;
  case 'g-agony':
   at(0,()=>{g.boss.alpha=.35;g.cue('THORNS OF AGONY');});
   every(.3,8,.42,()=>{const edge=['bottom','top','left','right'][Math.floor(R()*4)],v=edge==='top'||edge==='bottom';g.thorn(edge,v?soul().x-a.x+(R()-.5)*160:soul().y-a.y+(R()-.5)*120,{w:30,len:(v?a.h:a.w)*(.45+R()*.35)});});
   at(8.4,()=>g.cue('THE GUARD FOLLOWS HER'));every(8.6,14,1.35,ghosts(66,150,true));
   at(14.4,()=>g.cue('NEAR OR FAR'));every(14.6,20,.9,swords(.7));every(15,20,1.1,lanceAt(['left','right']));
   at(20.4,()=>g.cue('SACRED POISON'));every(20.6,26,.6,rain(1,115,28,2));every(21,26,1.9,orbitSoul(9,80,1.4));
   at(26.5,()=>{g.bullets=[];g.boss.alpha=1;g.pose('prepare',2);g.effects.push({type:'silence',life:2.4});});break;
  case 'g-stand':every(.3,19,1.5,rows(['bottom','top'],76));every(.8,19,1.8,stars(6,85));every(2,19,3,i=>g.lance(i%2?'left':'right'));at(.1,()=>g.cue('SHE IS STILL STANDING'));break;
 }
}
Object.assign(exports,{ATTACKS,buildAttack});
