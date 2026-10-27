modules["patterns.js"]=(exports,require)=>{
const {beginBroadcast,spawnSweep,verticalLanes}=require("spamtenna-scenes.js");
const {encoreCurtain,encoreSpotlight,riftTargeted,riftVolley}=require("stolen-scenes.js");
const {AMBIENT}=require("story.js");
const ROOM={x:180,y:248,w:408,h:220},SQUARE={x:299,y:262,w:170,h:170},FACE={x:30,y:226,w:708,h:240},BIG={x:40,y:262,w:688,h:204};
// Where his act-three body is on screen: eyes, jaw, petal ring centre, arm tips.
const BODY={eyeL:{x:364,y:88},eyeR:{x:404,y:88},jaw:{x:384,y:122},ring:{x:384,y:112},armL:{x:30,y:246},armR:{x:738,y:246}};
const A=(id,name,duration,arena=ROOM)=>({id,type:'attack',name,duration,arena});
// False genocide. Act one is his battle, rigged against a killer; the face scenes save a file and the chases load the emptied rooms.
// Act two takes the soul. Act three is inside him, and every boss he replays is one Seth killed or tried to.
const PLAN=[
 A('pellets','NO MORE LESSONS',11,SQUARE),A('save','EXP RECEIVED',11),A('buttons','YOUR FAVORITE BUTTON',10),A('mercy','JUST ONCE',11),
 {id:'rug1',type:'rug'},{id:'face1',type:'face',name:'COUNT THEM',duration:12,arena:FACE},{id:'ruins',type:'chase',name:'THE EMPTY HOUSE',duration:26},
 A('turn','TURN THE KNIFE',11,{x:294,y:256,w:180,h:180}),A('mouth','NOT ENOUGH',10),A('hands','YOUR OWN HANDS',11),A('name','LOVE LETTER',10),
 {id:'rug2',type:'rug'},{id:'face2',type:'face',name:'HER NAME',duration:12,arena:FACE},{id:'snowdin',type:'chase',name:'DUST ON THE SNOW',duration:26},
 A('screen','NO ONE ON THE OTHER SIDE',11,{x:84,y:216,w:600,h:252}),A('delete','THE WORD YOU KEPT',11),A('over','NO SECOND MORNING',13),A('you','THE ABSENT PLAYER',11,{x:126,y:278,w:204,h:180}),
 {id:'rug3',type:'rug'},{id:'face3',type:'face',name:'DELETE SETH',duration:13,arena:FACE},{id:'waterfall',type:'chase',name:'THE HAMMER STOPPED',duration:26},{id:'montage',type:'chase',name:'NO SHORTCUTS',duration:14},
 {id:'dark',type:'dark'},
 A('body','A SOUL THAT WILL NOT TEAR',18,BIG),A('theatre','THE EMPTIED THEATRE',20,BIG),{id:'page0',type:'memory',index:0},
 A('cataclysm','CATACLYSM',20,BIG),{id:'page1',type:'memory',index:1},
 A('gerson','NOTHING FOR YOU',20,BIG),{id:'page2',type:'memory',index:2},
 A('neo','A DEAL ALREADY BROKEN',21,BIG),{id:'page3',type:'memory',index:3},
 A('muffet','THE EMPTY NEST',20,BIG),{id:'page4',type:'memory',index:4},
 A('misery','MISERY WITHOUT COMPANY',20,BIG),{id:'page5',type:'memory',index:5},
 A('last','COURSE CORRECTION',42,BIG)
];
const DARK_STEP=PLAN.findIndex(s=>s.type==='dark');
// He is not bored this time. His own attacks repeat about 40% more often than the false-pacifist fight, the replays 10% more often than their own games,
// and the screen keeps breaking into static: he SAVEs and LOADs whenever he likes.
const REPLAYS=['theatre','cataclysm','gerson','neo','muffet','misery'];
function buildAttack(g){
 const every=g.every,scale=REPLAYS.includes(g.pattern)?.9:.6;g.every=(s,e,d,fn)=>every.call(g,s,e,d*scale,fn);try{build(g);}finally{g.every=every;}
 if(g.scene!=='face')for(let t=1.7+(g.round%3)*.6;t<g.duration-1;t+=g.act===3?2.9:4.2)g.at(t,()=>g.glitch(g.act===3?.45:.3));
}
function build(g){
 const p=g.pattern,a=g.arena,each=(s,e,d,fn)=>g.every(s,e,d,fn),sp=()=>g.config.speed;
 const cue=(text,life=1.5)=>g.effects.push({type:'control',text,life});
 const vine=i=>{const aa=g.targetArena,gap=aa.y+aa.h/2+Math.sin(i*.83)*28,from=i%2===0;for(const y of [gap-90,gap+90])g.spawn({kind:'vine',x:from?aa.x-15:aa.x+aa.w+15,y,w:18,h:118,vx:(from?1:-1)*111*sp(),delay:.65,life:5});};
 const words=(i,list=['MINE','ME','FLOWEY','NO','STAY'])=>{const aa=g.targetArena,label=list[i%list.length];g.spawn({kind:'word',label,x:aa.x+25+(i*71)%(aa.w-50),y:aa.y-16,w:label.length*12,h:22,vy:99*sp(),vx:Math.sin(i)*26,life:5,delay:.5});};
 const crossed=i=>{const s=i%2&&g.echo?g.echoSoul():g.soul,angle=i%2?Math.PI/4:0;g.beam(s.x,s.y,angle,12,1.18,.28);if(i%3===0)g.beam(s.x,s.y,angle+Math.PI/2,12,1.18,.28);};
 const dual=()=>{g.changeArena({x:126,y:278,w:204,h:180});g.echo={x:438,y:278,w:204,h:180};g.echoFlip=true;cue('THE OTHER HEART IS HIS');};
 const lanes=()=>{g.changeArena({x:168,y:250,w:432,h:216},'purple');g.blocked='up';g.lane=1;cue('MERCY DELETED / UP DELETED');};
 const floor=i=>{const aa=g.targetArena,h=22+(i%3)*10;g.spawn({kind:'jaw',x:i%2?aa.x-38:aa.x+aa.w+38,y:g.gravity>0?aa.y+aa.h-h/2-5:aa.y+h/2+5,w:46,h,vx:(i%2?1:-1)*143*sp(),life:4,delay:.55});};
 const fan=(i,count=6,speed=150)=>{const cx=g.flowerX(),cy=g.flowerY(),s=g.soul;for(let k=0;k<count;k++){const t=Math.PI*(.15+.7*k/(count-1)),x=cx+Math.cos(t+Math.PI)*58,y=cy+Math.sin(t)*22+30,angle=Math.atan2(s.y-y,s.x-x)+(k-(count-1)/2)*.05;g.spawn({kind:'seed',r:5,x,y,vx:Math.cos(angle)*speed*sp(),vy:Math.sin(angle)*speed*sp(),delay:.62+k*.05,life:4});}g.emit('cue');};
 const closing=(radius,count,gap,width,speed)=>{const cx=a.x+a.w/2,cy=a.y+a.h/2;for(let i=0;i<count;i++){if(((i-gap)%count+count)%count<width)continue;const t=i*Math.PI*2/count;g.spawn({kind:'seed',r:5,x:cx+Math.cos(t)*radius,y:cy+Math.sin(t)*radius,vx:-Math.cos(t)*speed*sp(),vy:-Math.sin(t)*speed*sp(),delay:.8,life:radius/(speed*sp())+.95});}g.emit('cue');};
 const spiral=(i,arms=2,speed=118,cx=384,cy=196)=>{for(let k=0;k<arms;k++){const t=i*.42+k*Math.PI*2/arms;g.spawn({kind:'seed',r:5,x:cx,y:cy,vx:Math.cos(t)*speed*sp(),vy:Math.sin(t)*speed*sp(),life:4.5});}};
 const daisyFall=(x,vx=0,vy=128)=>g.spawn({kind:'daisy',r:8,x,y:212,vx,vy:vy*sp(),delay:.35,life:5});
 const count=(i,label=String(i+1))=>g.spawn({kind:'word',label,x:90+(i*157)%588,y:216,w:Math.max(24,label.length*13),h:22,vy:118*sp(),vx:Math.sin(i*1.3)*30,delay:.35,life:5});
 // ---- Replayed bosses' signatures, built from their own games. ----
 // Gerson: arrows from the four sides at your row or column, his hammer turning the box, shells on the strings.
 const arrow=(i,speed=230)=>{const aa=g.targetArena,s=g.soul,side=i%4,off=((i*37)%3-1)*14;const x=side===0?aa.x-24:side===1?aa.x+aa.w+24:clamp(s.x+off,aa.x+14,aa.x+aa.w-14),y=side===2?aa.y-24:side===3?aa.y+aa.h+24:clamp(s.y+off,aa.y+14,aa.y+aa.h-14),angle=[0,Math.PI,Math.PI/2,-Math.PI/2][side];g.spawn({kind:'arrow',x,y,angle,w:side<2?40:10,h:side<2?10:40,vx:Math.cos(angle)*speed*sp(),vy:Math.sin(angle)*speed*sp(),delay:.55,life:5});};
 const shell=(i,speed=118)=>{const aa=g.targetArena,t=i*1.7+.4;g.spawn({kind:'shell',r:12,x:aa.x+30+(i*97)%(aa.w-60),y:aa.y+22,vx:Math.cos(t)*speed*sp(),vy:Math.abs(Math.sin(t))*speed*sp()+40,bounce:true,delay:.5,life:6.5});};
 // Muffet: spiders walk the strings in little processions; donuts roll; the pet takes a column.
 const procession=(i,n=3,speed=150)=>{const aa=g.targetArena,lane=i%3,ys=[aa.y+36,aa.y+aa.h/2,aa.y+aa.h-36],from=i%2===0;for(let k=0;k<n;k++)g.spawn({kind:'spider',r:9,x:from?aa.x-20-k*34:aa.x+aa.w+20+k*34,y:ys[lane],vx:(from?1:-1)*speed*sp(),delay:.45,life:7});g.emit('cue');};
 const donut=i=>{const aa=g.targetArena,ys=[aa.y+36,aa.y+aa.h/2,aa.y+aa.h-36],from=i%2===1;g.spawn({kind:'donut',r:10,x:from?aa.x-18:aa.x+aa.w+18,y:ys[(i+1)%3],vx:(from?1:-1)*205*sp(),delay:.5,life:5});};
 const pet=(x,w=96)=>{const aa=g.targetArena;g.spawn({kind:'pet',x,y:aa.y+aa.h/2,w,h:aa.h,warning:.95*g.config.warning,live:.42,life:2});g.emit('warning');};
 // Sans and Alphys: bones you jump, blasters, and the CORE's blue and orange beams.
 const bones=(i,speed=205)=>{const aa=g.targetArena,h=22+(i*13)%34,from=i%2===0;g.spawn({kind:'bone',x:from?aa.x-10:aa.x+aa.w+10,y:aa.y+aa.h-h/2-2,w:12,h,vx:(from?1:-1)*speed*sp(),delay:.3,life:4});};
 const blast=(i)=>{const s=g.soul,t=i*1.9+.6,r=170,x=clamp(s.x+Math.cos(t)*r,40,728),y=clamp(s.y+Math.sin(t)*r,150,520);g.blaster(x,y,Math.atan2(s.y-y,s.x-x),30,1.05*g.config.warning);};
 const coreBeam=(i)=>{const aa=g.targetArena;g.spawn({kind:'beam',x:aa.x+aa.w/2,y:aa.y+aa.h/2,angle:i*.9,width:20,warning:.9*g.config.warning,live:1.7,spin:i%2?-.55:.55,color:i%2?'blue':'orange'});g.emit('cue');};
 // Rift's cataclysm: a lattice with one open column, orbiting blades, crossed cuts.
 const lattice=i=>{const aa=g.targetArena,s=g.soul,vertical=i%2===0,n=vertical?6:3,step=(vertical?aa.w:aa.h)/n,gap=clamp(Math.floor((vertical?s.x-aa.x:s.y-aa.y)/step),0,n-1);for(let k=0;k<n;k++)if(k!==gap)g.beam(vertical?aa.x+(k+.5)*step:aa.x+aa.w/2,vertical?aa.y+aa.h/2:aa.y+(k+.5)*step,vertical?Math.PI/2:0,Math.max(8,step-30),1.2,.3);};
 const orbit=(i,count=8,cx=384,cy=352,radius=96)=>{for(let k=0;k<count;k++)g.spawn({kind:'orbit',art:k%2?'sword':'eye',r:6,cx,cy,x:cx,y:cy,theta:i*.51+k*Math.PI*2/count,radius,spin:i%2?-1.2:1.2,release:1.8,delay:.6,life:4.6});g.emit('cue');};
 const rewind=(save,...loads)=>{g.at(save,()=>g.saveAttack());for(const t of loads)g.at(t,()=>g.loadAttack());};
 if(AMBIENT[p])for(const [i,t] of [g.duration*.38,g.duration*.72].entries())g.at(t,()=>g.say(AMBIENT[p][i+1],g.act===3?(i?9:4):i?4:2,3.2));
 if(p==='pellets'){
  rewind(4,7.4);
  each(.4,9.2,1.45,i=>fan(i,i%3===2?8:6,160));g.at(3.6,()=>closing(165,22,5,3,64));g.at(6.4,()=>closing(165,22,15,3,70));g.at(9,()=>closing(165,24,9,3,74));
 }else if(p==='save'){
  each(.2,9.6,.9,i=>g.aimed(i%2?a.x:a.x+a.w,a.y+25+(i%3)*70,3,131));each(.6,9.6,1.3,i=>words(i,['EXP','LV','LOVE','EXP']));g.at(2.6,()=>g.saveAttack());[5.2,8].forEach(t=>g.at(t,()=>g.loadAttack()));each(1.6,9.6,2.6,crossed);
 }else if(p==='buttons'){
  each(.3,8.6,.95,i=>g.spawn({kind:'button',label:i%5===4?'MERCY':'FIGHT',x:a.x+30+(i*83)%(a.w-60),y:a.y-24,w:96,h:32,trap:true,vy:112*sp(),vx:i%2?38:-38,delay:.65,life:5}));each(1.5,8.6,2.4,vine);g.at(4,()=>cue('IT ALWAYS SAID FIGHT'));
 }else if(p==='mercy'){
  g.addTrap('MERCY',()=>({x:308,y:314,w:152,h:48}),'MERCY',null,11);each(.4,9.4,1,i=>g.spawn({kind:'button',label:i%3?'SPARE':'JUST ONCE',x:200+(i*97)%368,y:230,w:i%3?96:126,h:32,trap:true,vy:96*sp(),vx:Math.cos(i)*40,life:5,delay:.7}));each(1.6,9.6,2.3,i=>g.beam(g.soul.x,g.soul.y,i%2?0:Math.PI/2,16,1.18,.28));g.at(4.8,()=>{g.addTrap('HEAL',()=>({x:460,y:355,w:105,h:42}),'HEAL',null,6);g.face=9;cue('IT WORKED ONCE');});
 }else if(p==='face1'){
  each(.3,10.6,1.3,i=>g.ring(384,196,10,96,i*.4));each(.8,10.6,1.05,i=>count(i));each(8,11,.14,i=>spiral(i,2,112));
 }else if(p==='face2'){
  each(.4,10.8,.5,i=>daisyFall(60+(i*137)%648,Math.sin(i*1.7)*40,136));each(1.4,10.6,2.3,i=>{const s=g.soul;for(let k=-2;k<=2;k++){const t=Math.atan2(s.y-210,s.x-384)+k*.16;g.spawn({kind:'seed',r:5,x:384,y:210,vx:Math.cos(t)*155*sp(),vy:Math.sin(t)*155*sp(),delay:.5,life:4});}g.emit('cue');});each(2,10.6,2.6,i=>count(i,'AQUA'));
 }else if(p==='face3'){
  each(.3,6.2,.16,i=>spiral(i,3,104));each(1,12,1.5,i=>{const s=g.soul;for(let k=-1;k<=1;k++){const t=Math.atan2(s.y-196,s.x-384)+k*.14;g.spawn({kind:'seed',r:5,x:384,y:196,vx:Math.cos(t)*165*sp(),vy:Math.sin(t)*165*sp(),delay:.45,life:4});}g.emit('cue');});each(6.6,11.8,.16,i=>spiral(-i,3,112));each(2,11.6,2.6,i=>{const left=i%2===0,gap=g.arena.y+40+(i*67)%(g.arena.h-80);for(let y=g.arena.y+14;y<g.arena.y+g.arena.h;y+=30)if(Math.abs(y-gap)>40)g.spawn({kind:'daisy',r:8,x:left?10:758,y,vx:(left?1:-1)*150*sp(),delay:.6,life:6});g.emit('cue');});each(3,11,2.4,i=>count(i,'DELETE'));
 }else if(p==='turn'){
  rewind(2,7);
  each(.25,9.8,2.4,i=>{g.angleTarget+=(i%3===2?-1:1)*Math.PI/2;g.face=[1,3,2,6][i%4];cue('TURN');});each(.8,9.8,1.6,i=>g.ring(384,346,8,77,i*.31));each(1.4,9.8,2.8,i=>g.aimed(i%2?a.x-20:a.x+a.w+20,a.y+a.h/2,3,120));g.at(4.9,()=>g.setControls('quarter',4));
 }else if(p==='mouth'){
  rewind(2.8,6.2);
  each(.3,8.8,.94,i=>g.jaw(i));each(1.6,8.8,2.6,i=>g.aimed(i%2?160:608,300+(i%2)*100,4,113));
 }else if(p==='hands'){
  g.drift={x:a.x,y:a.y,amplitude:68,start:0};g.at(1,()=>g.setControls('reverse',5));g.at(7,()=>g.setControls('quarter',3.6));each(.7,9.8,1.2,i=>g.aimed(i%2?g.targetArena.x:g.targetArena.x+g.targetArena.w,270+(i%3)*65,3,113));each(2.2,9.8,3,vine);
 }else if(p==='name'){
  rewind(2.4,5.6,8);
  each(.3,8.8,.76,i=>words(i,['SETH','LV 10','LOVE','DUST','EXP']));each(1.6,8.8,2.6,i=>g.beam(g.soul.x,g.soul.y,i%2?Math.PI/4:-Math.PI/4,12,1.25,.25));g.at(3.6,()=>{g.fakeHp=true;cue('HP: MINE');});g.at(6.8,()=>g.fakeHp=false);
 }else if(p==='screen'){
  g.well=25;each(.2,9.6,1.45,i=>g.ring(384,320,13,93,i*.31));each(1.8,9.6,2.6,crossed);[3.4,7].forEach(t=>g.at(t,()=>{g.mirror=!g.mirror;g.invulnerability=Math.max(g.invulnerability,.6);cue(g.mirror?'NOBODY IN THE GLASS':'THE GLASS TURNS BACK');g.emit('warp');}));
 }else if(p==='delete'){
  lanes();each(.4,9.8,.87,i=>g.spawn({kind:'hand',x:i%2?g.arena.x-24:g.arena.x+g.arena.w+24,y:[286,358,430][i%3],w:45,h:24,vx:(i%2?1:-1)*161*sp(),life:4,delay:.5}));each(1.6,9.8,2.5,i=>words(i,['MERCY','SPARE','MERCY']));g.at(7.6,()=>{g.blocked='';cue('UP RESTORED. MERCY ISN’T.');});
 }else if(p==='over'){
  each(.3,3.2,1.1,i=>g.aimed(i%2?195:570,250,5,123));g.at(4.4,()=>g.beginFakeOver(4.6));each(9.4,12.2,.9,i=>g.jaw(i));
 }else if(p==='you'){
  rewind(3,6.6);
  dual();each(.4,10,.9,i=>{const aa=i%2?g.echo:g.arena,s=i%2?g.echoSoul():g.soul;g.aimed(aa.x+aa.w/2,aa.y-15,3,113);for(const seed of g.bullets.slice(-3)){const theta=Math.atan2(s.y-seed.y,s.x-seed.x);seed.vx=Math.cos(theta)*112*sp();seed.vy=Math.sin(theta)*112*sp();}});each(1.8,10,2.8,crossed);
 // ---- Act three: inside him. ----
 }else if(p==='body'){
  rewind(5,9.6,15.6);
  // Vines lashing in from the dark, petals, jaw, arms; then all of it.
  const lash=i=>{const e={x:i%2?800:-32,y:200+(i*53)%110},s=g.soul;g.beam(s.x,s.y,Math.atan2(s.y-e.y,s.x-e.x),14,.95,.3);};
  const petals=i=>{for(let k=0;k<7;k++){const t=Math.PI*(.12+.76*k/6)+(i%2?.06:-.06),x=BODY.ring.x+Math.cos(t)*100,y=BODY.ring.y+Math.sin(t)*60;g.spawn({kind:'petal',r:6,x,y,vx:Math.cos(t)*120*sp(),vy:Math.sin(t)*120*sp(),delay:.5,life:5});}g.emit('cue');};
  const bite=i=>{g.formCue={part:'jaw',until:g.attackTime+1.4};const aa=g.arena,gap=(i*3)%6;for(let k=0;k<8;k++)if(k!==gap&&k!==gap+1)g.spawn({kind:'tooth',x:aa.x+aa.w*(k+.5)/8,y:BODY.jaw.y+30,w:20,h:26,vy:150*sp(),delay:.75,life:4});g.emit('cue');};
  const sweep=i=>{const left=i%2===0,a2=g.arena,gap=a2.y+30+((i*61)%(a2.h-60)),x=left?a2.x-20:a2.x+a2.w+20;g.formCue={part:left?'armL':'armR',until:g.attackTime+1};for(const [y0,y1] of [[a2.y,gap-36],[gap+36,a2.y+a2.h]])if(y1>y0)g.spawn({kind:'thornbar',x,y:(y0+y1)/2,w:16,h:y1-y0,vx:(left?1:-1)*150*sp(),delay:.6,life:6});g.emit('cue');};
  each(.6,4.6,1.3,lash);each(4.4,8,1.3,petals);g.at(8.4,()=>bite(0));g.at(10.2,()=>bite(1));each(11.6,14.6,1.5,sweep);each(14.8,17.2,.8,i=>{if(i%2)lash(i);else petals(i);});
 }else if(p==='theatre'){
  // ENCORE’s genocide house: the same curtains and spotlight waltz, narrower, with nobody in the seats.
  g.replay='theatre';g.changeArena({x:96,y:266,w:576,h:196});
  g.every(.25,5.2,.9,i=>encoreCurtain(g,i,66));g.at(6,()=>cue('A MILLION EMPTY SEATS',2));g.every(6.4,19,.74,i=>encoreSpotlight(g,i));g.every(9,18.4,1.8,i=>encoreCurtain(g,i,74));
  g.at(12.5,()=>{g.setControls('reverse',3.4);cue('NO OVERTURE',2);});
 }else if(p==='cataclysm'){
  // RIFT’s cataclysm: the room is a knife, then the crown’s orbit, then two hearts.
  g.replay='cataclysm';g.changeArena({x:150,y:252,w:468,h:212});
  g.every(.3,5.8,1.5,lattice);g.every(.8,5.8,1.1,i=>riftTargeted(g,i));
  g.at(6.4,()=>{g.changeArena({x:258,y:226,w:252,h:252});g.circle=true;g.soul.x=472;g.soul.y=352;cue('KEEP CIRCLING',2);});g.every(7,12.6,1.9,i=>orbit(i));g.every(7.8,12.6,2.6,i=>g.spawn({kind:'beam',x:384,y:352,angle:i*.71,width:9,warning:1.1*g.config.warning,live:1.3,spin:i%2?-.45:.45}));
  g.at(13,()=>{dual();cue('OPPOSITE HEARTS',2);});g.every(13.5,19.4,1.3,i=>crossed(i));g.every(14,19.4,2.2,i=>riftVolley(g,i%2?g.echo.x+g.echo.w/2:g.arena.x+g.arena.w/2,g.arena.y-10,9,82,i*.3));
 }else if(p==='gerson'){
  rewind(3.2,5.6);
  // GERSON: arrows from four sides; the hammer turns the box and shells bounce; then shells on the strings.
  g.replay='gerson';g.changeArena({x:264,y:258,w:240,h:200});
  g.every(.3,6.2,.52,i=>arrow(i));g.at(1,()=>cue('FOUR SIDES. NO SHIELD.',2));
  g.at(6.6,()=>cue('THE HAMMER TURNS THE BOX',2));g.every(6.8,12.8,2.1,i=>{g.angleTarget+=(i%2?-1:1)*Math.PI/2;g.effects.push({type:'swing',life:.3});g.emit('warp');for(let k=0;k<2;k++)shell(i*2+k);});g.every(7.4,12.8,1,i=>arrow(i+1,200));
  g.at(13.2,()=>{g.changeArena({x:150,y:262,w:468,h:196},'purple');cue('BENT STRINGS',2);});g.every(13.6,19.4,.9,i=>{const aa=g.targetArena,lane=(i*2)%3;g.spawn({kind:'shell',r:12,x:aa.x+aa.w+18,y:[aa.y+36,aa.y+aa.h/2,aa.y+aa.h-36][lane],vx:-175*sp(),delay:.45,life:5});});g.every(14,19.4,1.2,i=>{const aa=g.targetArena,x=clamp(g.soul.x+((i%3)-1)*40,aa.x+16,aa.x+aa.w-16);g.spawn({kind:'arrow',x,y:aa.y-24,angle:Math.PI/2,w:10,h:40,vx:0,vy:230*sp(),delay:.6,life:4});});
 }else if(p==='neo'){
  // SPAMSON NEO: upright strings, receivers that fire down their lane, falling heads, one cannon sweep with a safe pocket.
  beginBroadcast(g,true);g.replay='neo';g.broadcast.phase='NO REFUNDS';cue('LEFT + RIGHT CHANGE STRINGS / Z SHOOTS',3);
  for(let t=1.2,i=0;t<18.5;t+=2.6,i++)if(t<8.4||t>12.2)g.at(t,((index)=>()=>{if(g.attackTime<g.sweepUntil)return;const safe=(index*3)%7,lines=verticalLanes(g);g.broadcast.host=index;for(let lane=0;lane<7;lane++){if([safe,(safe+1)%7,(safe+2)%7].includes(lane))continue;const rec={kind:'receiver',x:lines[lane],y:g.arena.y+22,r:16,hp:5,maxHP:5,shootable:true,life:2.6*g.config.warning+.8,delay:0,label:'CUT',source:'sales'};g.spawn(rec);const gen=g.bullets.at(-1);g.spawn({kind:'broadcastRay',x:lines[lane],y:g.arena.y+10,angle:Math.PI/2,width:29,warning:2.6*g.config.warning,live:.38,linked:gen,source:'host'});}g.emit('cue');})(i));
  g.every(2,18.5,2.4,i=>{if(g.attackTime<g.sweepUntil)return;const lines=verticalLanes(g),safe=(i*3+1)%7;g.broadcast.sales=i;for(let lane=0;lane<7;lane++)if(lane!==safe&&lane!==(safe+1)%7&&lane%2===i%2)g.spawn({kind:i%3===2?'pod':'head',x:lines[lane],y:g.arena.y-12,r:10,hp:2,maxHP:2,shootable:true,vy:140*sp(),delay:.55,life:4,source:'sales',fuse:i%3===2?1.8:0});});
  g.at(9,()=>{g.bullets=[];g.sweepUntil=g.attackTime+3.5;spawnSweep(g,1);cue('SWEEP / GREEN POCKET IS SAFE',2.2);});
  g.at(19.6,()=>{g.bullets=[];g.broadcast.phase='OFF AIR';g.broadcast.overheat=1;});
 }else if(p==='muffet'){
  rewind(6,9);
  // MUFFET: three strings, spiders in procession, donuts on the off-beats, the pet eating a column.
  g.replay='muffet';g.changeArena({x:120,y:262,w:528,h:196},'purple');g.lane=1;cue('FOLLOW THE SILK',2);
  g.every(.3,19,1.25,i=>procession(i,i%4===3?4:3,150+(i%3)*12));g.every(4,19,1.9,donut);
  g.at(9.4,()=>cue('THE PET IS HUNGRY',2));g.every(10,19,1.75,i=>{const aa=g.targetArena,x=clamp(g.soul.x+((i%3)-1)*30,aa.x+48,aa.x+aa.w-48);pet(x);});
 }else if(p==='misery'){
  // SANS + ALPHYS: bones to jump, blasters around the box, the CORE’s blue and orange.
  g.replay='misery';g.changeArena({x:180,y:282,w:408,h:160},'blue');cue('JUMP',1.6);
  g.every(.4,6,.62,i=>bones(i));
  g.at(6.4,()=>{g.changeArena({x:264,y:252,w:240,h:220});cue('BLASTERS',1.6);});g.every(6.8,12.8,.95,i=>blast(i));
  g.at(13,()=>{g.changeArena({x:204,y:252,w:360,h:220});cue('BLUE: STAND STILL / ORANGE: MOVE',2.4);});g.every(13.4,19.4,1.5,coreBeam);g.every(14.2,19.4,2.2,i=>blast(i+3));
 }else if(p==='last'){
  // His last gauntlet: everything he took from everyone, all at once. He doesn't beg. He LOADs it again.
  const lash=i=>{const e={x:i%2?800:-32,y:200+(i*53)%110},s=g.soul;g.beam(s.x,s.y,Math.atan2(s.y-e.y,s.x-e.x),14,.95,.3);};
  g.changeArena({x:168,y:250,w:432,h:216});each(.4,5.6,.9,i=>{lash(i);if(i%2)g.ring(384,300,10,104,i*.35);});
  g.at(6,()=>{g.changeArena({x:96,y:266,w:576,h:196});cue('NO ENCORE',1.6);});each(6.4,10.4,1,i=>encoreCurtain(g,i,70));
  g.at(10.8,()=>{g.changeArena({x:258,y:226,w:252,h:252});g.circle=true;g.soul.x=472;g.soul.y=352;cue('NO LITTLE LIGHT',1.6);});each(11.2,15,1.7,i=>orbit(i));
  g.at(15.4,()=>{g.changeArena({x:264,y:258,w:240,h:200});cue('NO SHIELD',1.6);});each(15.8,20,.55,i=>arrow(i,220));
  g.at(20.4,()=>{g.changeArena({x:120,y:262,w:528,h:196},'purple');g.lane=1;cue('NO NEST',1.6);});each(20.8,25,1.2,i=>procession(i,3,160));g.at(23,()=>pet(clamp(g.soul.x,180,588)));
  g.at(25.4,()=>{g.changeArena({x:180,y:282,w:408,h:160},'blue');cue('NO ONE TO CATCH YOU',1.6);});each(25.8,29.6,.66,i=>bones(i,215));g.at(27.6,()=>blast(1));
  g.at(30,()=>{dual();});each(30.4,34,.9,crossed);g.at(30.4,()=>g.saveAttack());g.at(33,()=>{g.say('Again.',6,2);g.loadAttack();});
  g.at(34.4,()=>{g.changeArena({x:168,y:250,w:432,h:216});});each(34.8,39.6,.7,i=>{if(i%2)lash(i);else g.ring(384,300,12,110,i*.3);});
  g.at(37.6,()=>g.say('You were never getting out of here.',2,3));g.at(40.2,()=>{g.bullets=[];g.face=3;g.glitch(1,'LOAD');});
 }
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Kept under the old name: the HUD and tooling read ATTACKS.length.
const ATTACKS=PLAN;
Object.assign(exports,{PLAN,ATTACKS,DARK_STEP,BODY,buildAttack,ROOM,SQUARE,FACE,BIG});
};
