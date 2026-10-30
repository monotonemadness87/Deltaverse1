
const {installNotebook}=require("notebook.js");
const {NotebookVisual}=require("notebook-visual.js");
const {battleButtons,drawBattleButton}=require("battle-ui.js");
const {SoulBreak}=require("soul-break.js");
const {SoulVisual}=require("soul-visual.js");
const {BattleEngine,candlePos,FIRE_BAND,FIRE_SIDE}=require("engine.js");
const {pixelText}=require("font.js");
const {StageAudio}=require("audio.js");
const {KonamiCode}=require("konami.js");
const {AnansiArt}=require("anansi-art.js");
const {AquaArt}=require("aqua-art.js");
const S=require("story.js");
await document.fonts.load('24px "Determination"');
const $=id=>document.getElementById(id),canvas=$('battle'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
const game=new BattleEngine(),text=pixelText(ctx),audio=new StageAudio(),art=new AnansiArt(ctx),aqua=new AquaArt(ctx),keys={},touchKeys={};
let touch=null,drag=null,last=performance.now(),signature='',accumulator=0,reduceMotion=false,textSound=0,resumeAfterOptions=false;
const soul=new Image();soul.src="__SOUL_PNG__";const soulVisual=new SoulVisual(ctx,soul);
const konami=new KonamiCode(()=>{game.settings.invincible=!game.settings.invincible;game.effects.push({type:'cheat',life:2,text:game.settings.invincible?'INVINCIBILITY ON':'INVINCIBILITY OFF'});audio.effect('heal');syncUI();});
function box(x,y,w,h,color='#fff',line=4){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));ctx.fillStyle='#000';ctx.fillRect(Math.round(x+line),Math.round(y+line),Math.round(w-line*2),Math.round(h-line*2));}
function heart(x,y,size=16,color='purple',alpha=1,angle=0){soulVisual.draw(x,y,size,color,alpha,angle);}
const soulBreak=new SoulBreak(ctx,(x,y,size,alpha)=>heart(x,y,size,'purple',alpha,0));
function optionRect(i,n){return n>2?{x:40+(i%2)*288,y:270+Math.floor(i/2)*43,w:274,h:38}:{x:40,y:270+i*43,w:550,h:38};}
function wrap(str,max=44,width=528,size=2){const lines=[];for(const line of String(str).split('\n')){let current='';for(const word of line.split(' ')){const next=(current+' '+word).trim();if(current&&(next.length>max||text.measure(next,size)>width)){lines.push(current);current=word;}else current=next;}lines.push(current);}return lines;}
// Typewriter text: the whole text is laid out first, then only its first n characters are drawn, so words never jump lines.
function typedLines(lines,str,n){if(!(n<str.length))return lines;let at=0;return lines.map(l=>{const lead=l.length-l.trimStart().length;let seen=false;const words=l.slice(lead).split(' ').map(w=>{const s=str.indexOf(w,at);if(s<0)return w;at=s+w.length;if(s<n)seen=true;return w.slice(0,Math.max(0,n-s));});return seen?l.slice(0,lead)+words.join(' ').trimEnd():'';});}
const shown=()=>game.state==='dialogue'?Math.floor(game.displayChars):Infinity;
const typing=()=>game.state==='dialogue'&&game.displayChars<game.text.length;
// Pixel fire, the count's own element: a tongue of flame w wide and h tall, standing on (x,y).
function flame(x,y,w,h,t,alpha=1){if(h<2)return;ctx.save();ctx.globalAlpha*=alpha;const f=reduceMotion?0:Math.sin(t*13+x*.7)*.18,H=Math.round(h*(1+f));
 ctx.fillStyle='#c4301a';ctx.fillRect(Math.round(x-w/2),Math.round(y-H*.55),Math.round(w),Math.round(H*.55));ctx.fillRect(Math.round(x-w/4),Math.round(y-H),Math.max(1,Math.round(w/2)),Math.round(H*.45));
 ctx.fillStyle='#ff8a2a';ctx.fillRect(Math.round(x-w/3),Math.round(y-H*.45),Math.max(1,Math.round(w*2/3)),Math.round(H*.45));ctx.fillRect(Math.round(x-w/6),Math.round(y-H*.75),Math.max(1,Math.round(w/3)),Math.round(H*.3));
 ctx.fillStyle='#ffe08a';ctx.fillRect(Math.round(x-w/6),Math.round(y-H*.28),Math.max(1,Math.round(w/3)),Math.round(H*.28));ctx.restore();}

// ======================================================================= the walk
function renderWorld(){
 const w=game.world,cam=w.camera(),t=game.clock,gen=game.genocide;
 art.room(w.room,cam,gen);
 const actors=[{y:w.seth.y,draw:()=>art.sethFrame(w.seth.dir,w.seth.moving,w.seth.step,w.seth.x-cam,w.seth.y)}];
 if(w.count){const c=w.count;actors.push({y:c.y,draw:()=>drawCount(c,c.x-cam)});}
 actors.sort((a,b)=>a.y-b.y).forEach(a=>a.draw());
 if(w.room==='hall')hallSpiders(cam,t,gen);
 if(w.room==='theatre'&&gen)embers(t,10,.5);
 if(game.state==='world'&&!w.fadeTo){const o=w.nearest();if(o){const bob=reduceMotion?0:Math.round(Math.sin(t*5)*2);text('Z',o.x-cam,o.y-(o.id.startsWith('seat')?60:118)+bob,1,'#ffff00',true);}}
 if(w.title>0){ctx.save();ctx.globalAlpha=Math.min(1,w.title);text(S.ROOMS[w.room],320,452,1.5,'#fff',true);ctx.restore();}
 if(game.state==='dialogue')worldDialogue(w);
 if(w.fadeTo){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,w.fade<.32?w.fade/.32:1-(w.fade-.32)/.32)})`;ctx.fillRect(0,0,640,480);}
}
// On the stage he keeps his back to the house, wine in hand, until Seth is halfway down the aisle; then he turns.
function drawCount(c,x){
 const talking=game.state==='dialogue'&&game.speaker==='boss';let name=c.facing==='up'?'ow_up':'ow_down';
 if(c.turn>=0&&c.turn<.3)name='ow_turn';else if(talking)name='ow_wine';
 art.frame(name,x,c.y,2);
}
// A few spiders scuttle along the wing's walls; on the hunt they have all gone.
function hallSpiders(cam,t,gen){if(gen||reduceMotion)return;for(let i=0;i<3;i++){const span=1280,x=((i*431+t*(30+i*12))%span)-cam,y=150+i*22;if(x>-20&&x<660)art.spider(x,y,t+i,{scale:2});}}
function embers(t,n,alpha){if(reduceMotion)return;ctx.save();ctx.globalAlpha=alpha;for(let i=0;i<n;i++){const x=(i*137+Math.sin(t*.8+i)*30)%640,y=480-((t*(24+i%5*9)+i*71)%520);ctx.fillStyle=i%3?'#ff8a2a':'#ffe08a';ctx.fillRect(Math.round(x),Math.round(y),2,2);}ctx.restore();}
function worldDialogue(w){
 const top=w.seth.y>250&&w.room!=='theatre',y=top?16:318;box(32,y,576,146,'#fff',6);
 let tx=56,width=520,max=40;const sp=game.speaker;
 if(sp==='boss'){art.portrait(game.face,52,y+73,96);tx=170;width=416;max=30;}
 else if(sp==='aqua'){aqua.face(game.face??0,104,y+73,104);tx=176;width=410;max=30;}
 typedLines(wrap(game.text,max,width),game.text,shown()).slice(0,4).forEach((l,i)=>text(l,tx,y+20+i*30,2,'#fff'));
 if(game.displayChars>=game.text.length)text('Z',590,y+118,1,'#777');
}

// ======================================================================= the battle
let flameOut=-1;
function bossPose(){
 const b=game.boss;
 if(game.ending==='killed')return 'defeat';
 if(game.ending==='spared')return game.state==='spared'||/bow/.test(game.text)?'gesture':typing()&&game.speaker==='boss'?'talk':'idle0';
 if(b.hurt>0)return 'hurt';
 if(game.state==='dialogue'&&game.speaker==='boss')return 'talk';
 if(game.state==='warning')return 'idle1';
 if(game.state==='defend'&&b.pose&&b.pose!=='idle'&&art.has(b.pose))return b.pose;
 return 'idle0';
}
function drawBoss(){
 const b=game.boss,pose=bossPose(),t=game.clock,dying=game.ending==='killed';
 const bob=reduceMotion||dying?0:Math.round(Math.sin(t*2.2)*1.5),hurtX=b.hurt>0&&!reduceMotion?Math.round(Math.sin(t*70)*4*b.hurt):0;
 // His fire: a little flame on each horn, smaller each time he reignites, gone when he goes out.
 const out=flameOut>=0?Math.max(0,1-(t-flameOut)/1.2):1,power=(1-b.dim*.28)*out;
 if(power>0){const g=ctx.createRadialGradient(b.x,b.y-80,6,b.x,b.y-80,130);g.addColorStop(0,`rgba(255,110,30,${(game.genocide?.22+game.fire*.04:.14)*power+(reduceMotion?0:Math.sin(t*3)*.02)})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(b.x-140,b.y-210,280,260);}
 let alpha=b.alpha;if(dying&&flameOut>=0)alpha=Math.max(.25,1-(t-flameOut)/2);
 const tint=b.hurt>.4&&!reduceMotion?'rgba(255,255,255,.75)':b.dim?`rgba(20,4,8,${b.dim*.22})`:dying?`rgba(30,10,10,${Math.min(.5,(b.dying||0)*.2)})`:null;
 art.frame(pose,b.x+hurtX,b.y+bob,2,{alpha,tint});
 if(power>0&&!pose.startsWith('defeat'))for(const dx of [-30,28])flame(b.x+dx+hurtX,b.y-122+bob,8*power+2,(14+game.fire*3)*power,t+dx,.9);
 if(dying&&flameOut>=0&&!reduceMotion)for(let i=0;i<8;i++){const u=((t-flameOut)*.6+i/8)%1;ctx.fillStyle=`rgba(120,110,110,${(1-u)*.6})`;ctx.fillRect(Math.round(b.x-40+i*11+Math.sin(u*6+i)*6),Math.round(b.y-20-u*120),3,3);}
}
function speech(){
 if(game.state!=='dialogue'||game.speaker!=='boss')return;
 box(384,30,244,176,'#fff',3);ctx.fillStyle='#fff';ctx.fillRect(372,96,13,3);ctx.fillRect(375,99,10,3);ctx.fillRect(378,102,7,3);
 art.portrait(game.face,392,72,58);
 typedLines(wrap(game.text,16,162,1.5),game.text,shown()).slice(0,8).forEach((l,i)=>text(l,458,40+i*19,1.5,'#fff'));
 if(game.displayChars>=game.text.length)text('Z',612,186,1,'#777');
}
// The house: spiders creep back into the boxes and onto the front rows as the trap's finale draws them in.
const SEATS=[...[0,1,2,3,4].map(i=>({x:28+i*16,y:80})),...[0,1,2,3,4].map(i=>({x:548+i*16,y:80})),...[0,1,2,3].map(i=>({x:14+i*24,y:236-Math.abs(i-1.5)*6})),...[0,1,2,3].map(i=>({x:554+i*24,y:236-Math.abs(i-1.5)*6}))];
function audience(){
 const n=Math.round(game.seats*SEATS.length),cheer=game.ending==='spared'||game.seats>=1;if(!n||game.genocide)return;
 for(let i=0;i<n;i++){const k=(i*7)%SEATS.length,p=SEATS[k],hop=cheer&&!reduceMotion?Math.round(Math.abs(Math.sin(game.clock*7+k))*-5):0;art.spider(p.x,p.y+hop,game.clock+k,{scale:2,eye:'#ffd060'});}
}
// The room grows hotter with every flame: an orange wash, rising embers, and (on the last life) a shimmer.
function heat(){
 const f=game.fire+(game.ending==='killed'&&game.genocide&&flameOut>=0?Math.min(3,(game.clock-flameOut)*.8):0);if(!f)return;
 ctx.fillStyle=`rgba(255,80,20,${Math.min(.2,f*.045)})`;ctx.fillRect(0,0,640,480);embers(game.clock,Math.round(8+f*10),.7);
 if(f>=3)for(let x=0;x<640;x+=18)flame(x+9,480,14,10+f*8+Math.abs(Math.sin(x*.3+game.clock*2))*12,game.clock+x,.55);
}
const RED='#c41a30',INK='#5a2a9a';
function hazard(b){
 if(b.delay&&b.age<b.delay)return;const a=game.arena,t=game.clock;
 switch(b.kind){
  case 'spider':ctx.strokeStyle='#d8d0e0';ctx.globalAlpha=.6;ctx.beginPath();ctx.moveTo(Math.round(b.x)+.5,b.top);ctx.lineTo(Math.round(b.x)+.5,b.y-6);ctx.stroke();ctx.globalAlpha=1;art.spider(b.x,b.y,b.age,{scale:2});return;
  case 'runner':art.spider(b.x,b.y,b.age,{scale:2,burning:b.burning});return;
  case 'flame':flame(b.x,b.y+4,8,14*Math.max(0,1-b.age/b.life)+4,t+b.x);return;
  case 'pool':{ctx.fillStyle='#5a0614';ctx.fillRect(a.x,b.top,a.w,a.y+a.h-b.top);ctx.fillStyle=RED;for(let x=a.x;x<a.x+a.w;x+=8){const wv=reduceMotion?0:Math.round(Math.sin(x*.12+t*3)*1.5);ctx.fillRect(x,Math.round(b.top+wv),8,3);}ctx.fillStyle='#ff6a7a';ctx.fillRect(a.x,Math.round(b.top),a.w,1);return;}
  case 'drip':if(b.ember){flame(b.x,b.y+4,6,10,t+b.x);}else{ctx.fillStyle=RED;ctx.fillRect(Math.round(b.x-3),Math.round(b.y-2),6,6);ctx.fillRect(Math.round(b.x-1),Math.round(b.y-6),2,4);ctx.fillStyle='#ff8a9a';ctx.fillRect(Math.round(b.x-2),Math.round(b.y-1),1,2);}return;
  case 'candle':{const p=candlePos(b);art.candelabra(p.x,p.y,b.px,b.py);return;}
  case 'hand':drawHand(b);return;
  case 'wall':{const top=b.top;if(b.age<b.warn){ctx.save();ctx.strokeStyle=RED;ctx.globalAlpha=.5+(reduceMotion?0:.3*Math.sin(b.age*24));ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(a.x,b.to+.5);ctx.lineTo(a.x+a.w,b.to+.5);ctx.stroke();ctx.restore();return;}
   const y0=top?a.y:b.edge,y1=top?b.edge:a.y+a.h;if(y1-y0<1)return;ctx.fillStyle='#efe2c4';ctx.fillRect(a.x,y0,a.w,y1-y0);ctx.fillStyle='#8aa0d8';for(let y=(top?y1:y0)+(top?-10:10);top?y>y0:y<y1;y+=top?-10:10)ctx.fillRect(a.x,Math.round(y),a.w,1);ctx.fillStyle='#d0405a';ctx.fillRect(a.x+26,y0,2,y1-y0);ctx.fillStyle='#3a1a20';ctx.fillRect(a.x,Math.round(top?y1-2:y0),a.w,2);return;}
  case 'beam':{if(b.age<b.warn){ctx.save();ctx.strokeStyle='#ff8a2a';ctx.globalAlpha=.55;ctx.setLineDash([4,4]);ctx.strokeRect(Math.round(b.x-b.w/2)+.5,a.y,b.w,a.h);ctx.restore();return;}const k=Math.max(0,1-(b.age-b.warn-b.live)/.15);ctx.save();ctx.globalAlpha=k;ctx.fillStyle='#ff5a20';ctx.fillRect(Math.round(b.x-b.w/2),a.y,b.w,a.h);ctx.fillStyle='#fff2c0';ctx.fillRect(Math.round(b.x-b.w/4),a.y,Math.round(b.w/2),a.h);ctx.restore();return;}
  case 'web':{ctx.fillStyle='#e8e0f0';const g0=b.gy-b.gh/2,g1=b.gy+b.gh/2,x=Math.round(b.x);ctx.fillRect(x-1,a.y,2,g0-a.y);ctx.fillRect(x-1,g1,2,a.y+a.h-g1);ctx.globalAlpha=.55;for(let y=a.y+8;y<a.y+a.h;y+=14){if(y>g0-4&&y<g1+4)continue;ctx.fillRect(x-6,y,12,1);ctx.fillRect(x-4,y-3,1,6);ctx.fillRect(x+3,y-3,1,6);}ctx.globalAlpha=1;return;}
  case 'blade':art.blade(b.x,b.y,b.age*(b.released?10:4));return;
  case 'tea':drawTea(b);return;
  case 'page':{ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y));ctx.rotate(b.age*(b.spin||3));ctx.fillStyle='#2a1420';ctx.fillRect(-6,-7,12,14);ctx.fillStyle='#f0e6cc';ctx.fillRect(-5,-6,10,12);ctx.fillStyle=INK;ctx.fillRect(-3,-3,6,1);ctx.fillRect(-3,0,6,1);ctx.fillRect(-3,3,4,1);ctx.restore();return;}
 }
 ctx.fillStyle='#fff';ctx.fillRect(Math.round(b.x-3),Math.round(b.y-3),6,6);
}
// Many hands: his gloved hands grasp in from the wings. The warning marks the band they will close on.
function drawHand(b){
 const a=game.arena;
 if(b.phase==='warn'){ctx.save();ctx.strokeStyle='#ff8a2a';ctx.globalAlpha=.45+(reduceMotion?0:.25*Math.sin(b.t*22));ctx.setLineDash([5,4]);const x0=b.side<0?a.x+4:b.tx-b.w/2+8,x1=b.side<0?b.tx+b.w/2-8:a.x+a.w-4;ctx.strokeRect(Math.round(x0)+.5,Math.round(b.y-b.h/2+8)+.5,Math.round(x1-x0),b.h-16);ctx.restore();return;}
 const claw=b.phase==='hold';
 // A dark sleeve from the edge of the box to the cuff.
 const cuff=b.x-b.side*b.w/2,edge=b.side<0?a.x-4:a.x+a.w+4;ctx.fillStyle='#1a0810';ctx.fillRect(Math.round(Math.min(edge,cuff)),Math.round(b.y-14),Math.round(Math.abs(cuff-edge)),28);ctx.fillStyle='#c4301a';ctx.fillRect(Math.round(Math.min(edge,cuff)),Math.round(b.y-14),Math.round(Math.abs(cuff-edge)),2);
 art.frame(claw?'hand_claw':'hand_open',b.x,b.y,2,{anchor:'center',rot:b.side<0?Math.PI/2:-Math.PI/2,flip:b.side>0});
}
// The count's teapot tips over anyone who stands still too long; the pour scalds.
function drawTea(b){
 const a=game.arena,top=a.y-2;
 if(b.phase==='pour'){const k=Math.min(1,b.t/.12),bottom=top+(a.h+4)*k;ctx.fillStyle='#b8682a';ctx.fillRect(Math.round(b.x-8),top,16,Math.round(bottom-top));ctx.fillStyle='#e8a050';ctx.fillRect(Math.round(b.x-3),top,6,Math.round(bottom-top));if(!reduceMotion){ctx.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<4;i++){const u=(b.t*2+i/4)%1;ctx.fillRect(Math.round(b.x-10+i*6+Math.sin(u*9)*3),Math.round(a.y+a.h-6-u*40),3,3);}}}
 else{ctx.save();ctx.strokeStyle='#e8a050';ctx.globalAlpha=.6;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(Math.round(b.x)+.5,a.y);ctx.lineTo(Math.round(b.x)+.5,a.y+a.h);ctx.stroke();ctx.restore();}
 art.teapot(b.x-26,top-18,b.phase,b.t);
}
// Steam rises off a SOUL that stands still: the tea is coming.
function steam(){const lim=game.config?.stillLimit||1,u=game.still/lim;if(u<.35||reduceMotion)return;ctx.fillStyle=`rgba(255,240,220,${Math.min(.8,u)})`;for(let i=0;i<3;i++){const k=(game.clock*1.6+i/3)%1;ctx.fillRect(Math.round(game.soul.x-6+i*5+Math.sin(k*8+i)*2),Math.round(game.soul.y-12-k*16),2,3);}}
const trail=[];
function drawSoul(){
 const s=game.soul;
 if(game.dash>0&&!reduceMotion)trail.push({x:s.x,y:s.y,life:.18});
 for(const p of trail){p.life-=1/60;if(p.life>0)heart(p.x,p.y,16,'orange',p.life*2.5);}while(trail.length&&trail[0].life<=0)trail.shift();
 if(game.invulnerability>0&&game.dash<=0&&Math.floor(game.clock*15)%2)return;
 // Seth's SOUL keeps its purple rim in every mode.
 if(game.mode==='red')heart(s.x,s.y,16,'purple');else{heart(s.x,s.y,20,'purple');heart(s.x,s.y,14,'orange');}
 if(game.burn>0)for(let i=0;i<Math.min(3,game.burn);i++)flame(s.x-6+i*6,s.y-6,4,8,game.clock*1.3+i);
 if(game.dashCD>0&&game.dash<=0){ctx.save();ctx.strokeStyle='#ff9d27';ctx.globalAlpha=.6;ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,14,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-game.dashCD/(game.config?.dashCD||1)));ctx.stroke();ctx.restore();}
}
function field(){
 const a=game.arena,cx=a.x+a.w/2,cy=a.y+a.h/2;
 ctx.save();
 // The revolving stage: the picture turns around the box's centre; the engine turns the controls to match.
 if(game.angle){ctx.translate(cx,cy);ctx.rotate(game.angle);ctx.translate(-cx,-cy);}
 box(a.x,a.y,a.w,a.h);
 ctx.save();ctx.beginPath();ctx.rect(a.x+4,a.y+4,a.w-8,a.h-8);ctx.clip();
 for(const b of game.bullets)if(b.kind==='pool'||b.kind==='wall')hazard(b);
 // The genocide floor fire: the bottom band burns, and on the last life the side walls too.
 if(game.fire>0){const band=FIRE_BAND[game.fire];ctx.fillStyle='rgba(120,20,10,.5)';ctx.fillRect(a.x,a.y+a.h-band,a.w,band);for(let x=a.x+6;x<a.x+a.w;x+=12)flame(x,a.y+a.h,12,band+4+Math.abs(Math.sin(x*.21+game.clock*3))*6,game.clock+x);if(game.fire>=3)for(let y=a.y+10;y<a.y+a.h;y+=14){flame(a.x+4+FIRE_SIDE/2,y+8,FIRE_SIDE,10,game.clock+y);flame(a.x+a.w-4-FIRE_SIDE/2,y+8,FIRE_SIDE,10,game.clock+y*1.3);}}
 if(game.strings){ctx.fillStyle='#b249dc';for(const y of game.strings){ctx.globalAlpha=.75;ctx.fillRect(a.x,Math.round(y)-1,a.w,2);}ctx.globalAlpha=1;}
 for(const b of game.bullets)if(!['pool','wall','candle','tea'].includes(b.kind))hazard(b);
 for(const e of game.effects)if(e.type==='stringsBurn'){const u=1-e.life/.9;for(const y of e.ys){const half=a.w/2*Math.min(1,u*1.6);ctx.fillStyle='#b249dc';ctx.globalAlpha=1-u;ctx.fillRect(a.x,Math.round(y)-1,a.w/2-half,2);ctx.fillRect(cx+half,Math.round(y)-1,a.w/2-half,2);ctx.globalAlpha=1;for(let k=0;k<6;k++){flame(cx-half+k*4,y+2,5,8,game.clock+k);flame(cx+half-k*4,y+2,5,8,game.clock+k+3);}}}
 steam();drawSoul();
 ctx.restore();
 // Candelabras hang on chains from above the box; the teapot tips in over its top edge.
 for(const b of game.bullets)if(b.kind==='candle'||b.kind==='tea')hazard(b);
 ctx.restore();
 if(game.state==='warning'){const size=text.measure(game.attackName)>a.w-18?1.5:2;text(game.attackName,cx,cy-8,size,'#fff',true);}
}
function prose(str,n=Infinity,x=48,width=528,max=44){typedLines(wrap(str,max,width),str,n).slice(0,5).forEach((line,i)=>text(line,x,267+i*24));}
function mainText(){
 const sp=game.speaker,d=game.state==='dialogue';
 if(d&&sp==='boss'){if(game.displayChars>=game.text.length)text('Z',590,367,1,'#777');return;}
 if(d&&sp==='aqua'){aqua.face(game.face??0,92,318,110);prose(game.text,shown(),160,430,32);}
 else prose(game.text,d?shown():Infinity);
 if(d&&game.displayChars>=game.text.length)text('Z',590,367,1,'#777');
}
function effectsFX(){for(const e of game.effects){
 if(e.type==='flash'&&!reduceMotion){ctx.save();ctx.globalAlpha=Math.min(1,e.life*1.4);ctx.fillStyle=e.color||'#fff';ctx.fillRect(0,0,640,480);ctx.restore();}
 else if(e.type==='vignette'){const g=ctx.createRadialGradient(320,240,170,320,240,420);g.addColorStop(0,`rgba(${e.color},0)`);g.addColorStop(1,`rgba(${e.color},${Math.min(.55,e.life*1.4)})`);ctx.fillStyle=g;ctx.fillRect(0,0,640,480);}
}}
let aquaArrived=null;
function renderBattle(){
 const defending=['defend','warning'].includes(game.state),ended=['spared','killed'].includes(game.state);
 game.locationFX?.draw();
 if(game.state==='encounter'){const t=game.encounter,f=game.encFrom||{x:320,y:300};if(t<.45){game.scene='world';const st=game.state;game.state='frozen';renderWorld();game.state=st;game.scene='battle';const bob=reduceMotion?0:Math.round(Math.sin(t*30)*2);box(f.x-12,f.y-70+bob,24,28,'#fff',2);text('!',f.x,f.y-68+bob,2,'#fff',true);return;}ctx.fillStyle='#000';ctx.fillRect(0,0,640,480);if(t<.9){if(Math.floor((t-.45)*13)%2===0||reduceMotion)heart(f.x,f.y,16,'purple');}else{const k=Math.min(1,(t-.9)/.55),e=k*k*(3-2*k);heart(f.x+(320-f.x)*e,f.y+(300-f.y)*e,16,'purple');}return;}
 art.backdrop(game.genocide,.9);audience();
 // Aqua runs in at the end of either show and stands beside the stage.
 if(game.ending&&game.speaker==='aqua'&&aquaArrived===null)aquaArrived=game.clock;
 if(aquaArrived!==null){const u=reduceMotion?1:Math.min(1,(game.clock-aquaArrived)/.55),e=1-(1-u)**3;aqua.pose(u<1?4:0,-60+190*e,128,150);}
 drawBoss();heat();speech();
 text('COUNT ANANSI',24,26,1,game.ready?'#ffff00':'#ff9d5a');
 if(game.genocide)for(let i=0;i<3;i++){const lit=i>=game.life-1;flame(150+i*14,36,8,lit?10:4,game.clock+i,lit?1:.35);}
 if(game.enemyHP<game.enemyMax||game.state==='target'){ctx.fillStyle='#222';ctx.fillRect(256,212,128,3);ctx.fillStyle='#ff9d27';ctx.fillRect(256,212,128*game.enemyHP/game.enemyMax,3);}
 if(defending)field();
 else{
  const a=game.arena;box(a.x,a.y,a.w,a.h);
  if(game.state==='fight'){ctx.fillStyle='#201410';ctx.fillRect(56,286,528,65);for(let i=0;i<24;i++){const x=64+i*22,h=8+(1-Math.abs(x-320)/264)*45;ctx.fillStyle=Math.abs(x-320)<26?'#fff':'#a05a3a';ctx.fillRect(x,319-h/2,3,h);}ctx.fillStyle='#ffff00';ctx.fillRect(317,279,6,81);ctx.fillStyle='#fff';ctx.fillRect(Math.round(game.attackCursor)-2,278,5,83);}
  else if(ended){const sp=game.state==='spared';text(sp?'THE CURTAIN FALLS':game.genocide?'THE HOUSE BURNS':'THE FLAME GOES OUT',320,265,3,sp?'#ffff00':'#ff9d5a',true);prose(sp?'\n* The spiders are still cheering.\n* He is going to see his daughter.':game.genocide?'\n* Some of the spiders make it out.\n* The count does not.':'\n* The seats are empty.\n* The footlights burn anyway.');if(game.timer>1.2)text('Z',590,368,1,'#777');}
  else if(game.options().length){const opts=game.options();opts.forEach((label,i)=>{const r=optionRect(i,opts.length),sel=game.option===i,col=game.state==='mercy'&&i===0&&game.ready?'#ffff00':sel?'#fff':'#bbb';if(sel)heart(r.x+12,r.y+13,14,'purple');text(label,r.x+30,r.y+5,text.measure(label,2)>r.w-44?1.5:2,col);});if(game.state==='item'){const item=game.items.filter(i=>i.count)[game.option];if(item)text(item.heal>=99?'RESTORES ALL HP':'RESTORES '+item.heal+' HP',48,366,1.5,'#ffff00');}else text('Z · CONFIRM     X · BACK',48,366,1,'#777');}
  else mainText();
 }
 effectsFX();
 for(const e of game.effects){if(e.type==='damage')text(e.text,e.x,e.y-(1.1-e.life)*18,4,'#ff9d5a',true);if(['cheat','instruction'].includes(e.type))text(e.text||'...',320,Math.min(206,game.arena.y-24),1.5,e.type==='cheat'?'#ffff00':'#ffc890',true);}
 if(game.settings.invincible)text('INVINCIBLE',24,46,1,'#ffff00');
 text('SETH',24,407,2);text('LV '+game.lv,132,407,2);text('HP',248,408,2);
 ctx.fillStyle='#8e2636';ctx.fillRect(284,403,120,16);ctx.fillStyle='#ffff00';ctx.fillRect(284,403,120*game.hp/game.maxHP,16);
 if(game.burn>0){const p=Math.min(game.burn,game.hp),x=284+120*(game.hp-p)/game.maxHP;ctx.fillStyle='#ff9d27';ctx.fillRect(Math.round(x),403,Math.max(0,Math.round(120*p/game.maxHP)),16);}
 text(`${game.hp} / ${game.maxHP}`,425,407,2,game.burn>0?'#ff9d27':'#fff');
 battleButtons(640,480).forEach((r,i)=>drawBattleButton(ctx,r,r.label,i,game.state==='menu'&&game.selected===i));
 if(game.state==='defend'){ctx.fillStyle='#302420';ctx.fillRect(24,397,592,1);ctx.fillStyle='#ff9d27';ctx.fillRect(24,397,592*Math.max(0,1-game.attackTime/game.duration),1);}
}
function render(){
 soulVisual.advance(game.clock,'purple',1);ctx.save();ctx.fillStyle='#000';ctx.fillRect(0,0,640,480);
 if(game.shake&&!reduceMotion)ctx.translate(Math.sin(game.clock*109)*3,Math.cos(game.clock*73)*2);
 if(game.state==='dead'){const ready=soulBreak.draw(game,{x:game.soul.x,y:game.soul.y,reduced:reduceMotion});if(ready){text('GAME OVER',320,105,5,'#fff',true);text(game.genocide?'HE IS STILL BURNING.':'THE SHOW MUST GO ON.',320,281,2,'#aaa',true);text('Z / TAP · RETRY',320,324,2,'#ffff00',true);text('FULL HP + RESTORED SUPPLIES',320,355,1.5,'#aaa',true);}ctx.restore();return;}
 if(game.scene==='world')renderWorld();else renderBattle();
 if(game.paused){ctx.fillStyle='#000d';ctx.fillRect(0,0,640,480);text('PAUSED',320,213,4,'#fff',true);}
 ctx.restore();
}
function musicMode(){if(['spared','killed'].includes(game.state)||game.ending)return 'end';if(game.scene==='world')return game.genocide?'walk-genocide':'walk-pacifist';if(game.state==='encounter')return 'off';return game.genocide?'genocide':'pacifist';}
function syncUI(){
 $('back').textContent=konami.progress>=8?'B':'X';$('confirm').textContent=konami.progress>=8?'A':(game.state==='defend'&&game.mode!=='red'?'⇥':'Z');
 audio.status(musicMode(),game.paused,game.state==='dead',game.scene==='world'?game.world.room:'battle');
 $('phase').textContent=game.paused?'PAUSED':game.state==='dead'?'STAY DETERMINED':game.state==='spared'?'THE CURTAIN FALLS':game.state==='killed'?(game.genocide?'THE HOUSE BURNS':'THE FLAME GOES OUT'):game.scene==='world'?S.ROOMS[game.world.room]:(game.genocide?'ENCORE — LIFE '+game.life:'ENCORE')+' / TURN '+Math.max(1,game.turn)+(game.settings.invincible?' / INVINCIBLE':'');
 $('normalRoute').setAttribute('aria-pressed',String(!game.genocide));$('genocideRoute').setAttribute('aria-pressed',String(game.genocide));
 $('pause').textContent=game.paused?'▶':'Ⅱ';$('pause').setAttribute('aria-pressed',String(game.paused));
 const next=[game.scene,game.state,game.paused,game.items.map(i=>i.count).join(','),game.ready,game.genocide,game.state==='dead'&&game.deathAge>=1.8,game.timer>1.2].join('/');if(signature===next)return;signature=next;const overlay=$('targets');overlay.replaceChildren();
 const target=(label,x,y,w,h,fn)=>{const b=document.createElement('button');b.setAttribute('aria-label',label);b.style.cssText=`left:${x/640*100}%;top:${y/480*100}%;width:${w/640*100}%;height:${h/480*100}%`;b.onclick=()=>{fn();syncUI();};overlay.append(b);};
 if(game.paused){target('Resume',0,0,640,480,()=>game.togglePause());return;}
 if(game.scene==='world'){if(game.state==='dialogue')target('Continue',0,0,640,480,()=>game.confirm());return;}
 if(game.state==='dead'&&game.deathAge<1.8)return;
 if(game.state==='menu')battleButtons(640,480).forEach((r,i)=>target(r.label,r.x,r.y,r.w,r.h,()=>game.chooseMenu(i)));
 else if(game.options().length)game.options().forEach((label,i)=>{const r=optionRect(i,game.options().length);target(label,r.x,r.y,r.w,r.h,()=>{game.option=i;game.confirm();});});
 else if(['dialogue','fight','spared','killed','dead'].includes(game.state))target(game.state==='fight'?'Strike':game.state==='dialogue'?'Continue':'Play again',24,game.state==='dialogue'?30:100,592,game.state==='dialogue'?360:280,()=>game.confirm());
}
game.onEvent=event=>{
 if(event==='reset'){flameOut=-1;aquaArrived=null;trail.length=0;}
 if(event==='reignite')game.effects.push({type:'flash',color:'#ff9030',life:.45});
 if(event==='letter')game.effects.push({type:'flash',color:'#fff4d0',life:.3});
 if(event==='text'&&game.ending==='killed'&&/flame goes out/.test(game.text)&&flameOut<0)flameOut=game.clock;
 syncUI();audio.effect(event);if(['text','turn','dead','end'].includes(event))$('live').textContent=game.state==='dead'?'Game over.':`${game.text}`;
};
// The first touch or key turns sound on. The ♪ button handles itself, or its click would undo the unlock.
function unlockSound(e){if(e?.target?.closest?.('#sound'))return;if(!audio.enabled&&!audio.userMuted)void audio.enable(true).then(()=>$('sound').setAttribute('aria-pressed','true'));}
document.addEventListener('pointerdown',unlockSound);window.addEventListener('keydown',unlockSound);
const keyMap={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',Shift:'slow'};
window.addEventListener('keydown',e=>{if($('options').open||e.target instanceof HTMLSelectElement||e.target instanceof HTMLInputElement)return;const k=e.key.length===1?e.key.toLowerCase():e.key,dir=keyMap[k];if(!e.repeat&&konami.input(['up','down','left','right'].includes(dir)&&!['b','a'].includes(k)?dir:k)){e.preventDefault();syncUI();return;}if(dir){e.preventDefault();keys[dir]=true;if(!e.repeat&&dir!=='slow')game.navigate(dir==='left'?-1:dir==='right'?1:0,dir==='up'?-1:dir==='down'?1:0);}if(['z','Enter',' ','x','Escape','Backspace','p'].includes(k)){if(e.target instanceof HTMLButtonElement&&(k==='Enter'||k===' '))return;e.preventDefault();if(e.repeat)return;if(k==='p')game.togglePause();else if(['x','Escape','Backspace'].includes(k))game.back();else game.confirm();}syncUI();});
window.addEventListener('keyup',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if(keyMap[k])keys[keyMap[k]]=false;});
function clearInput(){Object.keys(keys).forEach(k=>keys[k]=false);Object.keys(touchKeys).forEach(k=>touchKeys[k]=false);touch=null;drag=null;document.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
function inactive(){clearInput();if(['defend','fight','warning'].includes(game.state)&&!game.paused)game.togglePause();}
window.addEventListener('blur',inactive);document.addEventListener('visibilitychange',()=>{if(document.hidden)inactive();});
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*640/r.width,y:(e.clientY-r.top)*480/r.height};}
// Touch: dragging moves the SOUL; a quick tap while defending is the brave dash.
canvas.addEventListener('pointerdown',e=>{if(game.paused||drag)return;if(game.state==='defend'){e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);drag={id:e.pointerId,x:p.x,y:p.y,sx:game.soul.x,sy:game.soul.y,world:false,at:performance.now(),moved:0};touch={x:game.soul.x,y:game.soul.y};}else if(game.state==='world'){e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);drag={id:e.pointerId,world:true};touch=p;}canvas.focus({preventScroll:true});});
canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e);if(!drag.world)drag.moved=Math.max(drag.moved,Math.hypot(p.x-drag.x,p.y-drag.y));touch=drag.world?p:{x:drag.sx+p.x-drag.x,y:drag.sy+p.y-drag.y};});
const releaseDrag=e=>{if(drag?.id===e.pointerId){if(drag.world&&game.state==='world')game.confirm();else if(!drag.world&&game.state==='defend'&&drag.moved<8&&performance.now()-drag.at<220)game.confirm();touch=null;drag=null;}};canvas.addEventListener('pointerup',releaseDrag);canvas.addEventListener('pointercancel',releaseDrag);
document.querySelectorAll('.touch-controls button').forEach(b=>b.addEventListener('contextmenu',e=>e.preventDefault()));
document.querySelectorAll('[data-key]').forEach(button=>{const dir=button.dataset.key;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);touchKeys[dir]=true;button.classList.add('held');konami.input(dir);game.navigate(dir==='left'?-1:dir==='right'?1:0,dir==='up'?-1:dir==='down'?1:0);syncUI();});const release=()=>{touchKeys[dir]=false;button.classList.remove('held');};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);});
$('confirm').onclick=()=>{if(!konami.input('a'))game.confirm();syncUI();};$('back').onclick=()=>{if(!konami.input('b'))game.back();syncUI();};$('pause').onclick=()=>{clearInput();game.togglePause();};
$('normalRoute').onclick=()=>{clearInput();game.beginRoute('pacifist');};$('genocideRoute').onclick=()=>{clearInput();game.beginRoute('genocide');};$('restart').onclick=()=>{clearInput();game.reset();};
$('sound').onclick=async()=>{audio.userMuted=audio.enabled;await audio.enable(!audio.enabled);$('sound').setAttribute('aria-pressed',String(audio.enabled));$('sound').setAttribute('aria-label',audio.enabled?'Mute music and sound':'Enable music and sound');};
$('help').onclick=()=>{clearInput();resumeAfterOptions=!game.paused&&game.scene==='battle';if(resumeAfterOptions)game.togglePause();$('options').showModal();};$('closeOptions').onclick=()=>$('options').close();$('options').addEventListener('close',()=>{if(resumeAfterOptions&&game.paused)game.togglePause();canvas.focus({preventScroll:true});});
$('difficulty').onchange=e=>{game.settings.difficulty=e.target.value;};$('motion').onchange=e=>{reduceMotion=e.target.checked;};
$('skipWalk').onchange=e=>{game.settings.skipWalk=e.target.checked;if(e.target.checked&&game.scene==='world')game.startBattle(true);};
function frame(now){accumulator=Math.min(accumulator+(now-last)/1000,.1);last=now;const input={};for(const k of ['up','down','left','right','slow'])input[k]=keys[k]||touchKeys[k];input.touch=touch;while(accumulator>=1/120){game.update(1/120,input);accumulator-=1/120;}if(typing()&&game.clock-textSound>.07){audio.blip(game.speaker);textSound=game.clock;}syncUI();render();requestAnimationFrame(frame);}
syncUI();render();requestAnimationFrame(frame);
window.battleDebug={game,render,syncUI,audio};

// Seth's supplied weapon: two timed strikes, spin, then a single resolved impact.
const notebookVisual=new NotebookVisual(ctx,{enabled:()=>audio.enabled,paused:()=>game.paused,calm:()=>reduceMotion});
installNotebook(game,{kind:'rift',target:g=>({x:g.boss.x,y:g.boss.y-80}),event:(type,n)=>notebookVisual.event(type,n)});
notebookVisual.fx.bind(game,{hurt:fx=>fx.hurt(),dead:fx=>fx.kick(.55)});
notebookVisual.atmosphere(game,'theatre',{variant:()=>game.genocide});
const beforeNotebookRender=render;
render=function(){game.notebookRender(beforeNotebookRender);if(game.scene==='battle')notebookVisual.draw(game);};
canvas.addEventListener('pointerdown',event=>{const n=game.notebook;if(!n.active)return;const r=canvas.getBoundingClientRect(),x=(event.clientX-r.left)*canvas.width/r.width,y=(event.clientY-r.top)*canvas.height/r.height,s=canvas.width/640,top=canvas.height-231*s;if(x>=24*s&&x<=616*s&&y>=top&&y<=top+140*s){event.preventDefault();event.stopImmediatePropagation();game.confirm();}},{capture:true});

})().catch(console.error);</script>
</body></html>
