// Count Anansi's acts. On the trap (pacifist) every attack is a gentle preview: his own theatre (spiders, wine,
// candelabras, web curtains, a blood ballet), Seth's specials staged back at him (PAGE STORM, MARGIN TRAP),
// many grasping hands, and a revolving stage. The hunt (genocide) plays them for real, then sets the house on fire.
const A=(id,name,arena,duration,mode='orange')=>({id,name,arena,duration,mode});
const box=(w,h,y=null)=>({x:320-w/2,y:y??(388-h),w,h});
const ATTACKS={
 pacifist:{main:[
  A('threads','SPIDER THREADS',box(300,160),11),
  A('wine','WINE SPILL',box(300,166),12),
  A('candles','CANDELABRAS',box(320,160),12),
  A('storm','PAGE STORM',box(300,170),12),
  A('hands','MANY HANDS',box(330,170),13),
  A('margin','MARGIN TRAP',box(300,170),12),
  A('spin','REVOLVING STAGE',box(210,190),13),
  A('ballet','BLOOD BALLET',box(250,184),13),
  A('curtain','WEB CURTAIN',box(320,168),13),
  A('invite',"THE COUNT'S INVITATION",box(360,186),22)
 ]},
 genocide:{
  life1:[
   A('g-threads','SPIDER THREADS',box(300,164),13),
   A('g-wine','WINE SPILL',box(300,170),14),
   A('g-storm','PAGE STORM',box(300,176),14),
   A('g-hands','MANY HANDS',box(340,176),15),
   A('g-spin','REVOLVING STAGE',box(214,196),15),
   A('g-ballet','BLOOD BALLET',box(254,190),15),
   A('g-flood','THE HOUSE BURNS',box(380,186),18)
  ],
  life2:[
   A('g-strings','ON A STRING',box(330,180),15,'strings'),
   A('g-margin','MARGIN TRAP',box(320,180),15,'strings'),
   A('g-snap','THE STRINGS BURN',box(340,186),17,'strings')
  ],
  life3:[
   A('g-pyre','THE PYRE',box(360,190),17),
   A('g-invite',"THE COUNT'S INVITATION",box(380,196),24)
  ]
 }
};

function buildAttack(g,attack){
 const a=attack.arena,cx=a.x+a.w/2,cy=a.y+a.h/2,R=()=>g.random(),sp=()=>g.config.speed,soul=()=>g.soul;
 const every=(s,e,i,f)=>g.every(s,e,i,f),at=(t,f)=>g.at(t,f);
 // The orange cue comes with the tea pour (engine); the strings get their own the first time.
 const intro=()=>{if(attack.mode==='strings'&&!g.stringsTold&&g.soulOrange){g.stringsTold=true;at(0,()=>g.cue('STRINGS: ↑↓ SWITCH · KEEP MOVING · Z DASH'));}};
 // His theatre.
 const spider=(x,depth,hang=1.4,amp=10)=>{g.spawn({kind:'spider',x0:x,x,y:a.y-10,top:a.y-10,ty:a.y+depth,speed:150*sp(),hang,swing:2.4,amp,r:7,state:'down'});g.pose('gesture',.6);};
 const threads=(n=1,hang=1.4)=>i=>{for(let k=0;k<n;k++)spider(a.x+24+((i*71+k*113)%Math.max(1,a.w-48)),30+((i*37+k*59)%Math.max(1,a.h-60)),hang,8+(i%3)*5);};
 const drip=(n=1,vy=30)=>()=>{for(let k=0;k<n;k++)g.spawn({kind:'drip',x:a.x+12+R()*(a.w-24),y:a.y-4,vy,r:4,life:4});};
 const pool=(frac,rise)=>g.spawn({kind:'pool',top:a.y+a.h,limit:a.y+a.h*(1-frac),rise});
 const candle=(phase,amp=.95,speed=1.5,ember=1)=>g.spawn({kind:'candle',px:cx,py:a.y-62,L:62+a.h*.5,amp,speed:speed*sp(),phase,r:10,ember,nextEmber:.6,life:attack.duration});
 const blades=(n=8,radius=80,release=1.7)=>i=>{for(let k=0;k<n;k++)g.spawn({kind:'blade',cx,cy,radius,theta:i*.4+k*Math.PI*2/n,spin:i%2?-1:1,release:release*g.config.warn,r:5,x:cx,y:cy,life:6});g.pose('gesture',.8);};
 const web=(fromLeft,speed=95,gh=50)=>{const gy=a.y+26+R()*(a.h-52);g.spawn({kind:'web',x:fromLeft?a.x-8:a.x+a.w+8,vx:(fromLeft?1:-1)*speed*sp(),gy,gh});};
 const runner=(fromLeft,y,speed=150,burning=false)=>g.spawn({kind:'runner',x:fromLeft?a.x-10:a.x+a.w+10,y0:y,y,vx:(fromLeft?1:-1)*speed*sp(),r:7,burning,life:6});
 // Seth's own specials, performed back at him.
 const pageFan=(fromLeft,n=5,speed=130)=>{const x=fromLeft?a.x+6:a.x+a.w-6,y=a.y+6,aim=Math.atan2(soul().y-y,soul().x-x);for(let k=0;k<n;k++){const an=aim+(k-(n-1)/2)*.22;g.spawn({kind:'page',x,y,vx:Math.cos(an)*speed*sp(),vy:Math.sin(an)*speed*sp(),r:5,spin:R()*6,life:5});}g.pose('talk',.5);};
 const margin=(gap=46,beam=true)=>{const c=Math.max(a.y+gap/2+10,Math.min(a.y+a.h-gap/2-10,soul().y)),warn=.75*g.config.warn;g.spawn({kind:'wall',top:true,from:a.y,to:c-gap/2,edge:a.y,warn,close:.45,hold:1});g.spawn({kind:'wall',top:false,from:a.y+a.h,to:c+gap/2,edge:a.y+a.h,warn,close:.45,hold:1});if(beam)at(g.attackTime+warn+.5,()=>g.spawn({kind:'beam',vertical:true,x:soul().x,w:14,warn:.6*g.config.warn,live:.25}));};
 // Many hands, closing in from the wings.
 const hand=(side,y,{warn=.8,reach=.32}={})=>g.spawn({kind:'hand',side,x0:side<0?a.x-60:a.x+a.w+60,x:side<0?a.x-60:a.x+a.w+60,tx:side<0?a.x+a.w*reach:a.x+a.w*(1-reach),y:y??soul().y,w:110,h:80,warn:warn*g.config.warn,inT:.32,hold:.35,outT:.45,phase:'warn'});
 // The revolving stage.
 const turn=(step=Math.PI/2)=>{g.angleTarget+=step;g.cue('THE STAGE TURNS');g.emit('rumble');};
 intro();
 switch(attack.id){
  // ---------------------------------------------------------------- the trap: a gentle preview
  case 'threads':every(.4,10,.9,threads(1,1.3));break;
  case 'wine':at(0,()=>pool(.26,4));every(.3,11,.55,drip(1,30));break;
  case 'candles':at(0,()=>{candle(0);});at(5,()=>candle(Math.PI,.8,1.7));every(2,11,2.6,threads(1,1));break;
  case 'storm':every(.3,11,1.35,i=>pageFan(i%2===0,5,125));break;
  case 'hands':every(.4,12,1.9,i=>hand(i%2?1:-1,undefined,{warn:1}));break;
  case 'margin':every(.4,11,2.6,()=>margin(62,true));break;
  case 'spin':[2.5,6,9.5].forEach(t=>at(t,()=>turn()));every(.4,12,1.1,threads(1,1.1));every(1.5,12,2.4,i=>pageFan(i%2===0,3,120));break;
  case 'ballet':every(.3,12,2.4,blades(7,82,1.8));break;
  case 'curtain':every(.3,12,1.5,i=>web(i%2===0,90,66));break;
  case 'invite':
   // The finale: everything at once, gently, while the seats fill with cheering spiders.
   at(0,()=>{g.seatsGoal=1;g.cue("THE COUNT'S INVITATION");});
   every(.3,5.5,1.7,i=>hand(i%2?1:-1,undefined,{warn:1}));every(.8,5.5,1.3,threads(1,1));
   at(6,()=>turn());every(6.4,11,1.6,i=>pageFan(i%2===0,4,125));every(7,11,2.8,blades(6,86,1.8));
   at(11.5,()=>turn());every(11.8,16.5,1.5,i=>web(i%2===0,95,66));every(12.4,16.5,1.9,drip(1,40));
   at(17,()=>{g.cue('TAKE A BOW');});every(17.3,21,2,i=>{hand(-1,soul().y-62,{warn:1});hand(1,soul().y+62,{warn:1});});
   at(21.4,()=>{g.angleTarget=0;g.bullets=g.bullets.filter(b=>b.kind==='spider');g.pose('gesture',1.4);});break;
  // ---------------------------------------------------------------- the hunt: the real thing
  case 'g-threads':every(.3,12,.6,threads(1,1.2));every(1,12,1.7,threads(1,.8));break;
  case 'g-wine':at(0,()=>pool(.34,6));every(.2,13,.42,drip(1,46));break;
  case 'g-storm':every(.2,13,.95,i=>pageFan(i%2===0,6,150));every(1.5,13,2.2,threads(1,.8));break;
  case 'g-hands':every(.3,14,1.5,i=>hand(i%2?1:-1,undefined,{warn:.75,reach:.32}));every(2,14,3,i=>{hand(-1,a.y+40,{warn:.8,reach:.28});hand(1,a.y+a.h-40,{warn:.8,reach:.28});});break;
  case 'g-spin':[1.5,4.5,7.5,10.5,13].forEach((t,i)=>at(t,()=>turn(i%2?-Math.PI/2:Math.PI/2)));every(.3,14,.75,threads(1,1));every(1,14,1.6,i=>pageFan(i%2===0,4,140));break;
  case 'g-ballet':every(.3,14,2.2,blades(8,86,1.6));every(1.2,14,3,i=>web(i%2===0,110,56));break;
  case 'g-flood':
   // The spiders pour into the box for their count; some of them are burning. The house starts to burn.
   at(0,()=>{g.fire=Math.max(g.fire,1);g.emit('rumble');g.cue('THE HOUSE BURNS');});
   every(.2,17,.38,i=>runner(i%2===0,a.y+20+R()*(a.h-40),130+R()*70,R()<.4));every(2,17,2.5,threads(2,.8));break;
  case 'g-strings':every(.3,14,1.2,i=>pageFan(i%2===0,4,135));every(.8,14,1.4,threads(1,.9));break;
  case 'g-margin':every(.3,14,2.1,()=>margin(40,true));every(1.2,14,2.4,i=>runner(i%2===0,g.strings?g.strings[i%3]:cy,150,true));break;
  case 'g-snap':
   // Purple plus orange, then the strings catch and burn away, leaving only orange.
   every(.3,8.5,1.1,i=>hand(i%2?1:-1,g.strings?g.strings[(i+1)%3]:undefined,{warn:.7}));every(.8,8.5,1.4,i=>runner(i%2===0,g.strings?g.strings[i%3]:cy,170,true));
   at(9,()=>g.burnStrings());every(9.6,16.5,.45,i=>runner(i%2===0,a.y+20+R()*(a.h-40),170,R()<.5));every(10,16.5,2,blades(8,90,1.4));break;
  case 'g-pyre':every(.3,16,.75,i=>runner(i%2===0,a.y+18+R()*(a.h-60),150+R()*50,R()<.55));every(1,16,1.8,drip(1,56));every(2,16,3.2,blades(7,90,1.5));break;
  case 'g-invite':
   at(0,()=>g.cue("THE COUNT'S INVITATION"));
   every(.3,6,1.4,i=>hand(i%2?1:-1,undefined,{warn:.75,reach:.3}));every(.5,6,1.1,threads(1,.8));
   at(6.4,()=>turn());every(6.8,12,1.4,i=>pageFan(i%2===0,5,140));every(7,12,2.8,blades(7,92,1.5));
   at(12.4,()=>turn(-Math.PI/2));every(12.8,18,.75,i=>runner(i%2===0,a.y+18+R()*(a.h-60),165,R()<.6));every(13,18,1.9,i=>web(i%2===0,115,56));
   at(18.4,()=>g.cue('TAKE A BOW'));every(18.7,23.5,1.6,i=>{hand(-1,soul().y-62,{warn:.8});hand(1,soul().y+62,{warn:.8});});break;
 }
}
Object.assign(exports,{ATTACKS,buildAttack});
