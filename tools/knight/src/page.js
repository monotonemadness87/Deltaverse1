
const {installNotebook}=require("notebook.js");
const {NotebookVisual}=require("notebook-visual.js");
const {battleButtons,drawBattleButton,battleSoul}=require("battle-ui.js");
const {SoulBreak}=require("soul-break.js");
const {SoulVisual}=require("soul-visual.js");
const {BattleEngine,clamp,ribbonY,TP_COST}=require("engine.js");
const {pixelText}=require("font.js");
const {StageAudio}=require("audio.js");
const {KonamiCode}=require("konami.js");
const {KnightArt}=require("knight-art.js");
await document.fonts.load('24px "Determination"');
const $=id=>document.getElementById(id),canvas=$('battle'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
const game=new BattleEngine(),text=pixelText(ctx),audio=new StageAudio(),art=new KnightArt(ctx),keys={},touchKeys={};
let touch=null,drag=null,last=performance.now(),signature='',accumulator=0,reduceMotion=false,textSound=0,resumeAfterOptions=false;
const soul=new Image();soul.src="__SOUL_PNG__";const soulVisual=new SoulVisual(ctx,soul);
const konami=new KonamiCode(()=>{game.settings.invincible=!game.settings.invincible;game.effects.push({type:'cheat',life:2,text:game.settings.invincible?'INVINCIBILITY ON':'INVINCIBILITY OFF'});audio.effect('heal');syncUI();});
// The three hearts' colours (Kris's blade, Susie's wild heart, Ralsei's hope), Seth's purple, Deltarune's orange.
const HEART={blade:'#5ab8ff',wild:'#ff4aa8',hope:'#5ef29a',all:'#ffffff'},SETHC='#b249dc',DR_ORANGE='#ff7f27',DR_GREEN='#1ec51e';
function box(x,y,w,h,color='#fff',line=4){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));ctx.fillStyle='#000';ctx.fillRect(Math.round(x+line),Math.round(y+line),Math.round(w-line*2),Math.round(h-line*2));}
function heart(x,y,size=16,color='purple',alpha=1,angle=0){soulVisual.draw(x,y,size,color,alpha,angle);}
const soulBreak=new SoulBreak(ctx,(x,y,size,alpha)=>heart(x,y,size,'purple',alpha,0));
function optionRect(i,n){return n>2?{x:40+(i%2)*288,y:270+Math.floor(i/2)*43,w:274,h:38}:{x:40,y:270+i*43,w:550,h:38};}
function wrap(str,max=44,width=528,size=2){const lines=[];for(const line of String(str).split('\n')){let current='';for(const word of line.split(' ')){const next=(current+' '+word).trim();if(current&&(next.length>max||text.measure(next,size)>width)){lines.push(current);current=word;}else current=next;}lines.push(current);}return lines;}
function typedLines(lines,str,n){if(!(n<str.length))return lines;let at=0;return lines.map(l=>{const lead=l.length-l.trimStart().length;let seen=false;const words=l.slice(lead).split(' ').map(w=>{const s=str.indexOf(w,at);if(s<0)return w;at=s+w.length;if(s<n)seen=true;return w.slice(0,Math.max(0,n-s));});return seen?l.slice(0,lead)+words.join(' ').trimEnd():'';});}
const shown=()=>game.state==='dialogue'?Math.floor(game.displayChars):Infinity;
const blink=(hz=6)=>reduceMotion||Math.floor(game.clock*hz)%2===0;
const ease=u=>1-(1-clamp(u,0,1))**3;

// ======================================================================= the walk
function renderWorld(){
 const w=game.world,cam=w.camera(),t=game.clock;
 art.room(w.room,cam);
 if(w.room==='shop'){
  art.gems(t,cam,640,3);const g=ctx.createRadialGradient(242,120,2,242,120,70);g.addColorStop(0,'rgba(255,210,120,.28)');g.addColorStop(1,'rgba(255,210,120,0)');ctx.fillStyle=g;ctx.fillRect(170,50,144,144);
  // Gerson behind his counter (the counter is redrawn over him).
  art.gerson('keeper',464-cam,262+(reduceMotion?0:Math.round(Math.sin(t*1.6))),1.15);
  ctx.fillStyle='#3a2a20';ctx.fillRect(340-cam,236,248,60);ctx.fillStyle='#6a5040';ctx.fillRect(340-cam,236,248,6);ctx.fillStyle='#2a1e18';for(let x=352;x<588;x+=28)ctx.fillRect(x-cam,248,2,44);
 }
 if(w.room==='path'){
  art.gems(t,cam,1440,9);art.stream(t,cam);
  for(let i=0;i<4;i++){const le=w.flags.lastEcho,lit=le&&le.i===i?Math.max(0,1-(t-le.t)/2.5):w.flags['echo'+i]?.12:0;art.echoFlower(260+i*290-cam,330,t,lit);}
  if(w.flags.gerson){const x=1386-cam,g=ctx.createRadialGradient(x,256,2,x,256,60);g.addColorStop(0,`rgba(180,220,255,${.3+.1*Math.sin(t*2)})`);g.addColorStop(1,'rgba(180,220,255,0)');ctx.fillStyle=g;ctx.fillRect(x-60,190,120,140);}
 }
 if(w.room==='cavern'){art.gems(t,0,640,5);const m=w.manifest;art.crystal(320,346,t,m?Math.min(1,m.t/1.6):0);}
 if(w.room==='cavern'&&w.manifest)manifestation(w.manifest.t);
 art.sethFrame(w.seth.dir,w.seth.moving,w.seth.step,w.seth.x-cam,w.seth.y);
 if(game.state==='world'&&!w.fadeTo){const o=w.nearest();if(o){const bob=reduceMotion?0:Math.round(Math.sin(t*5)*2);text('Z',o.x-cam,o.y-(o.id==='gerson'?150:o.id==='crystal'?250:110)+bob,1,'#ffff00',true);}}
 if(w.title>0){ctx.save();ctx.globalAlpha=Math.min(1,w.title);text(require("story.js").ROOMS[w.room],320,452,1.5,'#fff',true);ctx.restore();}
 if(game.state==='dialogue')worldDialogue(w);
 if(w.fadeTo){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,w.fade<.32?w.fade/.32:1-(w.fade-.32)/.32)})`;ctx.fillRect(0,0,640,480);}
}
// The crystal wakes: light builds, three hearts (cyan, pink, green) fly out and circle, then merge into the Knight.
function manifestation(t){
 const cx=320,cy=226;
 if(t>1.1){const u=clamp((t-1.1)/1.4,0,1);['blade','wild','hope'].forEach((h,k)=>{const an=k*Math.PI*2/3+t*(reduceMotion?0:2.6),r=(1-u)*120*Math.sin(Math.min(1,u*3)*Math.PI/2)+(u>=1?0:10);battleSoul(ctx,cx+Math.cos(an)*r,cy+Math.sin(an)*r*.6,18,HEART[h]);});}
 // The Knight arrives out of the light (its arrival animation), then idles in front of the crystal.
 if(t>2.4){const k=Math.floor((t-2.4)*8);if(k<8)art.anim('arrival',k,320,346,1.2);else art.anim('idle',Math.floor(game.clock*LOOP)%8,320,346,1.2);}
 if(t>2.3&&t<3.1){ctx.save();ctx.globalAlpha=(reduceMotion?.4:1)*Math.max(0,1-Math.abs(t-2.55)/.4);ctx.fillStyle='#fff';ctx.fillRect(0,0,640,480);ctx.restore();}
}
function worldDialogue(w){
 const top=w.seth.y>250,y=top?16:318;box(32,y,576,146,'#fff',6);
 let tx=56,width=520,max=40,col='#fff';const sp=game.speaker;
 if(sp==='gerson'){art.gersonFace(52,y+20,96);tx=168;width=420;max=31;}
 else if(sp==='boss'){art.portrait(50,y+18,104);tx=170;width=416;max=30;col=HEART[game.heart]||'#fff';}
 else if(sp==='seth'){art.sethFace(game.face&&game.face!=='face'?game.face:'talking',56,y+22,96);tx=168;width=420;max=31;col='#d9a6ff';}
 typedLines(wrap(game.text,max,width),game.text,shown()).slice(0,4).forEach((l,i)=>text(l,tx,y+20+i*30,2,col));
 if(game.displayChars>=game.text.length)text('Z',590,y+118,1,'#777');
}

// ======================================================================= hazards (both halves)
function star4(x,y,r,col='#fff'){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r*.28,y-r*.28);ctx.lineTo(x+r,y);ctx.lineTo(x+r*.28,y+r*.28);ctx.lineTo(x,y+r);ctx.lineTo(x-r*.28,y+r*.28);ctx.lineTo(x-r,y);ctx.lineTo(x-r*.28,y-r*.28);ctx.closePath();ctx.fill();}
// A sword: white blade, pale guard, pointing along angle (centre at x,y).
function swordShape(x,y,angle,len,col){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(len/2,0);ctx.lineTo(len/2-7,-3);ctx.lineTo(-len/2+6,-3);ctx.lineTo(-len/2+6,3);ctx.lineTo(len/2-7,3);ctx.closePath();ctx.fill();ctx.fillStyle='#8aa4ff';ctx.fillRect(-len/2+3,-7,3,14);ctx.fillRect(-len/2-3,-2,6,4);ctx.restore();}
// The Knight's six-pointed star, outlined.
function star6(x,y,r,col){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(game.clock*(reduceMotion?0:2));ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<12;k++){const rr=k%2?r*.5:r,an=k*Math.PI/6;k?ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):ctx.moveTo(Math.cos(an)*rr,Math.sin(an)*rr);}ctx.closePath();ctx.stroke();ctx.fillStyle=col;ctx.fillRect(-1,-1,2,2);ctx.restore();}
// The Knight's crescent: a white moon-blade with afterimages trailing behind it.
function moon(b){const warn=b.age<b.warn;ctx.save();ctx.lineCap='round';
 if(warn){ctx.globalAlpha=.3+.3*blink(14);ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.R,b.facing-b.span,b.facing+b.span);ctx.stroke();ctx.restore();return;}
 for(let k=4;k>=0;k--){ctx.globalAlpha=k?.12*(5-k):1;ctx.strokeStyle=k?'#9ab8ff':'#ffffff';ctx.lineWidth=k?b.thick-2:b.thick;ctx.beginPath();ctx.arc(b.x-Math.sign(b.vx)*k*12,b.y,b.R,b.facing-b.span,b.facing+b.span);ctx.stroke();}
 ctx.globalAlpha=1;ctx.strokeStyle='#cfe0ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.R-b.thick/2,b.facing-b.span*.9,b.facing+b.span*.9);ctx.stroke();ctx.restore();}
function spikePath(b,len){const px=-b.dy,py=b.dx,hw=b.w/2;ctx.beginPath();ctx.moveTo(b.x+px*hw,b.y+py*hw);ctx.lineTo(b.x+b.dx*len,b.y+b.dy*len);ctx.lineTo(b.x-px*hw,b.y-py*hw);ctx.closePath();}
function hazard(b){
 const t=game.clock;
 switch(b.kind){
  case 'spike':{if(b.age<b.warn){ctx.save();ctx.globalAlpha=.35+(reduceMotion?.2:.25*Math.sin(b.age*30));ctx.strokeStyle='#9ad4ff';ctx.setLineDash([4,3]);spikePath(b,b.len);ctx.stroke();ctx.restore();return;}if(b.cur<1)return;ctx.save();ctx.fillStyle='#bfe6ff';spikePath(b,b.cur);ctx.fill();ctx.strokeStyle='#3a78d8';ctx.lineWidth=1;ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x+b.dx*2,b.y+b.dy*2);ctx.lineTo(b.x+b.dx*b.cur*.8,b.y+b.dy*b.cur*.8);ctx.stroke();ctx.restore();return;}
  case 'slash':{ctx.save();if(b.age<b.warn){ctx.globalAlpha=.45+(reduceMotion?0:.2*Math.sin(b.age*28));ctx.strokeStyle=HEART.blade;ctx.lineWidth=1;ctx.setLineDash([6,4]);}else{ctx.globalAlpha=Math.max(0,1-(b.age-b.warn-b.live)/.2);ctx.strokeStyle=HEART.blade;ctx.lineWidth=b.w+4;ctx.beginPath();ctx.moveTo(b.x1,b.y1);ctx.lineTo(b.x2,b.y2);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=b.w-3;}ctx.beginPath();ctx.moveTo(b.x1,b.y1);ctx.lineTo(b.x2,b.y2);ctx.stroke();ctx.restore();return;}
  case 'lance':{const cx=Math.cos(b.angle),cy=Math.sin(b.angle);if(b.age<b.warn){ctx.save();ctx.strokeStyle=HEART.blade;ctx.globalAlpha=.55;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+cx*700,b.y+cy*700);ctx.stroke();ctx.restore();}
   if(game.dr&&art.anim('sword_projectile',Math.floor(game.clock*8)%4,b.x+cx*(b.tip-b.len/2),b.y+cy*(b.tip-b.len/2),b.len/110,{rot:b.angle+Math.PI/2}))return;
   const tx=b.x+cx*b.tip,ty=b.y+cy*b.tip;ctx.save();ctx.translate(tx,ty);ctx.rotate(b.angle);ctx.fillStyle='#e8f4ff';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-b.len,-b.w/2);ctx.lineTo(-b.len,b.w/2);ctx.closePath();ctx.fill();ctx.fillStyle=HEART.blade;ctx.fillRect(-b.len,-1,b.len-6,2);ctx.fillStyle='#3a78d8';ctx.fillRect(-b.len-14,-3,14,6);ctx.restore();return;}
  case 'buster':{if(b.moon){moon(b);return;}ctx.save();const warn=b.age<b.warn;ctx.globalAlpha=warn?.3+(reduceMotion?0:.2*Math.sin(b.age*30)):1;ctx.lineCap='round';
   if(!warn){ctx.strokeStyle='rgba(176,58,216,.45)';ctx.lineWidth=b.thick+10;ctx.beginPath();ctx.arc(b.x-Math.sign(b.vx)*12,b.y,b.R,b.facing-b.span,b.facing+b.span);ctx.stroke();}
   ctx.strokeStyle=warn?HEART.wild:'#ff4aa8';ctx.lineWidth=warn?2:b.thick;ctx.beginPath();ctx.arc(b.x,b.y,b.R,b.facing-b.span,b.facing+b.span);ctx.stroke();
   if(!warn){ctx.strokeStyle='#ffd0ec';ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,b.R+b.thick*.2,b.facing-b.span*.9,b.facing+b.span*.9);ctx.stroke();}ctx.restore();return;}
  case 'ribbon':{ctx.save();ctx.strokeStyle='#ff4aa8';ctx.lineWidth=b.w;ctx.beginPath();let on=false;for(let x=b.x;x<=b.x+b.wd;x+=4){const inGap=Math.abs(x-b.gap)<b.gapW/2,y=ribbonY(b,x);if(inGap){on=false;continue;}if(!on){ctx.moveTo(x,y);on=true;}else ctx.lineTo(x,y);}ctx.stroke();
   ctx.fillStyle='#b03ad8';for(let x=b.x;x<b.x+b.wd;x+=12){if(Math.abs(x-b.gap)<b.gapW/2)continue;const y=ribbonY(b,x);ctx.fillRect(Math.round(x),Math.round(y+b.w/2-1),4,3+((x*7)%5));}ctx.restore();return;}
  case 'axe':{ctx.save();ctx.translate(b.x,b.y);ctx.rotate(reduceMotion?0:b.age*14);ctx.fillStyle='#7a3a9a';ctx.fillRect(-2,-10,4,20);ctx.fillStyle='#ff4aa8';ctx.beginPath();ctx.moveTo(2,-10);ctx.lineTo(11,-6);ctx.lineTo(11,2);ctx.lineTo(2,-2);ctx.closePath();ctx.fill();ctx.restore();return;}
  case 'orbitblade':{ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.theta+Math.PI/2);ctx.fillStyle='#e8f4ff';ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(4,0);ctx.lineTo(0,9);ctx.lineTo(-4,0);ctx.closePath();ctx.fill();ctx.fillStyle=HEART.blade;ctx.fillRect(-1,-6,2,12);ctx.restore();return;}
  case 'star':{if(art.anim('star_projectile',Math.floor(b.age*10)%4,b.x,b.y,.17))return;const r=b.fuse&&b.age>b.fuse-.3&&blink(14)?7:5;star4(b.x,b.y,r+1,HEART.blade);star4(b.x,b.y,r-1,'#fff');return;}
  case 'shard':{if(b.big&&art.anim('diamond_shard',Math.floor(b.age*8)%4,b.x,b.y,.16))return;if(b.big){ctx.fillStyle='#dfe8ff';ctx.beginPath();ctx.moveTo(b.x,b.y-8);ctx.lineTo(b.x+5,b.y);ctx.lineTo(b.x,b.y+8);ctx.lineTo(b.x-5,b.y);ctx.closePath();ctx.fill();return;}star4(b.x,b.y,3,'#bfe6ff');return;}
  case 'gift':{if(!art.anim('heal_heart',Math.floor(b.age*6)%4,b.x,b.y,.17))battleSoul(ctx,b.x,b.y,14,blink(5)?HEART.hope:'#a8ffd0');return;}
  case 'zee':{ctx.save();ctx.globalAlpha=.85;text('Z',b.x,b.y-7,1.5,'#c8f0ff',true);ctx.restore();return;}
  case 'orbitsword':{if(!art.anim('sword_projectile',Math.floor(game.clock*8)%4,b.x,b.y,.27,{rot:(b.ang??0)+Math.PI/2,alpha:b.launched?1:.85}))swordShape(b.x,b.y,b.ang??0,24,'#fff');return;}
  case 'sword':{if(b.age<b.warn){const A=game.arena,y=b.vy>0?A.y+10:A.y+A.h-10;art.anim('twinkle',Math.floor(b.age*10),b.x,y,.3);return;}const cy=b.y-(b.vy>0?b.len/2:-b.len/2);if(!art.anim('sword_projectile',Math.floor(game.clock*8)%4,b.x,cy,.32,{rot:b.vy>0?Math.PI:0}))swordShape(b.x,cy,b.vy>0?Math.PI/2:-Math.PI/2,b.len,'#fff');return;}
  case 'eruption':{const u=clamp(b.age/b.warn,0,1);art.anim('warning_reticle',Math.floor(b.age*8),b.x,b.y-14,.32,{alpha:.5+.5*u});ctx.save();ctx.globalAlpha=.3+.5*u;ctx.fillStyle='#c8d0ff';ctx.beginPath();ctx.ellipse(b.x,b.y-5,b.w*(.4+.4*u),4+2*u,0,0,6.283);ctx.fill();ctx.restore();return;}
  case 'bar':{ctx.fillStyle=b.blue?'#3a6aff':'#ffffff';const x=Math.round(b.x-b.w/2);if(b.blue)ctx.fillRect(x,b.y0,b.w,b.y1-b.y0);else{ctx.fillRect(x,b.y0,b.w,Math.round(b.gapY-b.gapH/2-b.y0));ctx.fillRect(x,Math.round(b.gapY+b.gapH/2),b.w,Math.round(b.y1-b.gapY-b.gapH/2));}return;}
  case 'star6':{if(b.delay&&b.age<b.delay)return;if(!art.anim('star_projectile',Math.floor(b.age*10)%4,b.x,b.y,.24,{tint:b.fuse&&b.age>b.fuse-.25&&blink(14)?'rgba(255,232,160,1)':null}))star6(b.x,b.y,b.r+3,'#fff');return;}
  case 'dashline':{const warn=b.age<b.warn;ctx.save();if(warn){ctx.globalAlpha=.45+.3*blink(14);ctx.fillStyle='#ffffff';ctx.fillRect(0,Math.round(b.y),640,1);}else{ctx.globalAlpha=Math.max(0,1-(b.age-b.warn-b.live)/.25);ctx.fillStyle='#bfe6ff';ctx.fillRect(0,Math.round(b.y-b.w/2-3),640,b.w+6);ctx.fillStyle='#fff';ctx.fillRect(0,Math.round(b.y-b.w/2),640,b.w);}ctx.restore();return;}
  case 'laser':{const cx=Math.cos(b.angle),cy=Math.sin(b.angle),L=1200;ctx.save();if(b.age<b.warn){ctx.globalAlpha=.5;ctx.strokeStyle=b.col;ctx.lineWidth=1;ctx.setLineDash([6,4]);}else{ctx.globalAlpha=Math.max(0,Math.min(1,(b.warn+b.live+.2-b.age)/.2));ctx.strokeStyle=b.col;ctx.lineWidth=b.w+6;ctx.beginPath();ctx.moveTo(b.ox,b.oy);ctx.lineTo(b.ox+cx*L,b.oy+cy*L);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(2,b.w-6);}ctx.beginPath();ctx.moveTo(b.ox,b.oy);ctx.lineTo(b.ox+cx*L,b.oy+cy*L);ctx.stroke();ctx.restore();return;}
  case 'cone':{const live=b.age>=b.warn,a1=b.angle-b.half,a2=b.angle+b.half;ctx.save();ctx.globalAlpha=live?Math.max(0,Math.min(.75,(b.warn+b.live+.2-b.age)*2)):.12+.12*blink(10);const g=ctx.createLinearGradient(b.ox,b.oy,b.ox+Math.cos(b.angle)*b.len,b.oy+Math.sin(b.angle)*b.len);g.addColorStop(0,'#ffffff');g.addColorStop(.4,live?'#8a9cff':'#4a5aaa');g.addColorStop(1,live?'#5a6cff':'#2a3466');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(b.ox,b.oy);ctx.lineTo(b.ox+Math.cos(a1)*b.len,b.oy+Math.sin(a1)*b.len);ctx.lineTo(b.ox+Math.cos(a2)*b.len,b.oy+Math.sin(a2)*b.len);ctx.closePath();ctx.fill();ctx.restore();return;}
  case 'scarf':{const a=game.arena;ctx.save();ctx.globalAlpha=.4;ctx.strokeStyle=HEART.hope;ctx.lineWidth=14;ctx.beginPath();for(let k=0;k<=12;k++){const x=b.x-k*12,y=b.y+Math.sin(k*.6+b.age*3)*b.amp*.4;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.restore();return;}
 }
}
function drawSoul(){
 const s=game.soul;
 if(game.mode==='green'){
  // The HAMMER OF JUSTICE: a green SOUL (purple rim kept) with a shield, and the spears coming for it.
  const d={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]}[game.shield];ctx.save();ctx.translate(s.x+d[0]*24,s.y+d[1]*24);ctx.rotate(Math.atan2(d[1],d[0])+Math.PI/2);ctx.fillStyle='#43e750';ctx.fillRect(-17,-3,34,6);ctx.fillStyle='#b8ffc0';ctx.fillRect(-17,-3,34,2);ctx.restore();
  ctx.save();ctx.strokeStyle='rgba(67,231,80,.35)';ctx.beginPath();ctx.arc(s.x,s.y,24,0,6.283);ctx.stroke();ctx.restore();
  for(const e of game.effects)if(e.type==='block'&&!e.x)art.anim('ring_pulse',Math.floor((.25-e.life)*16),s.x+d[0]*24,s.y+d[1]*24,.35);
  if(!(game.invulnerability>0&&Math.floor(game.clock*15)%2)){heart(s.x,s.y,20,'purple');heart(s.x,s.y,14,'green');}
  for(const e of game.effects)if(e.type==='block'&&!e.x){ctx.save();ctx.globalAlpha=e.life*4;ctx.strokeStyle='#b8ffc0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x+d[0]*24,s.y+d[1]*24,8+(.25-e.life)*30,0,6.283);ctx.stroke();ctx.restore();}
  return;
 }
 if(game.invulnerability>0&&Math.floor(game.clock*15)%2)return;
 heart(s.x,s.y,16,'purple');
 if(game.sleepy>0){ctx.save();ctx.globalAlpha=.7;text('z',s.x+10,s.y-20,1,'#c8f0ff');ctx.restore();}
 if(game.defending||game.persevere){ctx.save();ctx.globalAlpha=.6;ctx.strokeStyle=SETHC;ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,13,0,Math.PI*2);ctx.stroke();ctx.restore();}
 for(const e of game.effects)if(e.type==='graze'){ctx.save();ctx.globalAlpha=e.life*4;ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,12+(.2-e.life)*30,0,Math.PI*2);ctx.stroke();ctx.restore();}
}
// A spear for the green SOUL: in from its side; a trick (gold) one swings round the SOUL to the far side.
function drawArrow(b,s){
 const ang={up:-Math.PI/2,right:0,down:Math.PI/2,left:Math.PI}[b.side];let an=ang,dist=b.dist;
 if(b.flip!==undefined){const u=b.flip/.38;an=ang+Math.PI*u;dist=64;}
 const x=s.x+Math.cos(an)*dist,y=s.y+Math.sin(an)*dist;ctx.save();ctx.translate(x,y);ctx.rotate(an+Math.PI);ctx.fillStyle=b.trick&&!b.flipped?'#ffd040':'#ffffff';ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(-4,-6);ctx.lineTo(-2,0);ctx.lineTo(-4,6);ctx.closePath();ctx.fill();ctx.fillRect(-14,-1,12,2);ctx.restore();
}
// The Knight's star void (the finale): the box is gone; colours wash through behind turning stars.
function starVoid(){const t=game.clock,hue=(t*30)%360,g=ctx.createRadialGradient(320,166,10,320,166,360);g.addColorStop(0,`hsla(${hue},70%,55%,.55)`);g.addColorStop(.5,`hsla(${(hue+60)%360},60%,25%,.45)`);g.addColorStop(1,'rgba(0,0,0,.9)');ctx.fillStyle=g;ctx.fillRect(0,0,640,332);
 ctx.save();ctx.globalAlpha=.25;for(let i=0;i<26;i++){const an=i*2.4+t*(reduceMotion?0:.15),r=60+(i*37)%260;star6(320+Math.cos(an)*r,166+Math.sin(an)*r*.7,9,'#ffffff');}ctx.restore();}
function field(border='#fff'){
 const a=game.arena,dr=game.dr;
 if(game.mode==='green'&&!reduceMotion)art.anim('hammer',Math.floor(game.clock*5)%4,a.x+a.w+46,a.y+a.h/2,.5);
 if(game.voidMode){starVoid();art.anim('vortex_ring',Math.floor(game.clock*6)%4,320,166,1.4,{alpha:.55});}
 else{const spin=dr&&!reduceMotion?clamp((game.boxSpin||0)/.45,0,1):0;ctx.save();if(spin>0){const cx=a.x+a.w/2,cy=a.y+a.h/2;ctx.translate(cx,cy);ctx.rotate(spin*Math.PI/2);ctx.scale(1-spin*.35,1-spin*.35);ctx.translate(-cx,-cy);}
  if(game.split){const hw=(a.w-12)/2;box(a.x,a.y,hw,a.h,border,3);box(a.x+hw+12,a.y,hw,a.h,border,3);}else box(a.x,a.y,a.w,a.h,border,dr?3:4);ctx.restore();}
 const outside=['lance','laser','cone','dashline','orbitsword'];
 // The cone of light falls behind everything else.
 ctx.save();ctx.beginPath();ctx.rect(0,0,640,dr?332:396);ctx.clip();for(const b of game.bullets)if(b.kind==='cone')hazard(b);ctx.restore();
 ctx.save();ctx.beginPath();ctx.rect(a.x+3,a.y+3,a.w-6,a.h-6);ctx.clip();
 for(const b of game.bullets)if(b.kind==='scarf')hazard(b);
 for(const b of game.bullets)if(!['lance','scarf','slash','laser','cone','dashline','orbitsword','arrow'].includes(b.kind))hazard(b);
 for(const b of game.bullets)if(b.kind==='slash')hazard(b);
 drawSoul();ctx.restore();
 // Lunges come in from outside the box.
 ctx.save();ctx.beginPath();ctx.rect(0,0,640,game.dr?332:396);ctx.clip();for(const b of game.bullets)if(outside.includes(b.kind)&&b.kind!=='cone')hazard(b);if(game.mode==='green')for(const b of game.bullets)if(b.kind==='arrow')drawArrow(b,game.soul);ctx.restore();
 for(const e of game.effects){if(e.type==='gift'){ctx.save();ctx.globalAlpha=e.life*2;star4(e.x,e.y-(.5-e.life)*20,6,HEART.hope);ctx.restore();}if(e.type==='zee'){ctx.save();ctx.globalAlpha=e.life;text('z z',e.x,e.y-(.6-e.life)*30,1,'#c8f0ff',true);ctx.restore();}}
}
function effectsFX(){for(const e of game.effects){
 if(e.type==='flash'&&!reduceMotion){ctx.save();ctx.globalAlpha=e.life*2;ctx.fillStyle=e.color||'#fff';ctx.fillRect(0,0,640,480);ctx.restore();}
 else if(e.type==='vignette'){const g=ctx.createRadialGradient(320,240,170,320,240,420);g.addColorStop(0,`rgba(${e.color},0)`);g.addColorStop(1,`rgba(${e.color},${Math.min(.5,e.life*1.4)})`);ctx.fillStyle=g;ctx.fillRect(0,0,640,480);}
 else if(e.type==='damage')text(e.text,e.x,e.y-(1.1-e.life)*18,3,'#df6a9a',true);
 else if(e.type==='mercy'){const [x,y]=e.who==='knight'?[522,96]:[112,150];text(e.text,x,y-(1.2-e.life)*16,1.5,'#ffff00',true);}
 else if(['cheat','instruction'].includes(e.type))text(e.text,320,Math.min(206,game.arena.y-24),1.5,'#ffff00',true);
}}
// The Knight's animation, from the designer's sprite sheets: its phase idle, the move it is making, hurt,
// the roar that breaks the battle, its vanish at the end. Returns [family, frame].
const LOOP=8;// idle loops play at 8 frames a second; moves at 12
function knightAnim(){
 const b=game.boss,t=game.clock;
 if(game.state==='uibreak')return['roar_transition',Math.floor(game.breakTime*7)];
 if(game.state==='spared'||game.ending==='spared')return['teleport_vanish',Math.floor((game.timer||0)*6)];
 if(b.hurt>0)return['hurt_stagger_kneel',Math.floor((.55-b.hurt)*10)];
 if(['defend','warning'].includes(game.state)&&b.pose&&b.pose!=='idle'&&art.frames(b.pose))return[b.pose,Math.min(art.frames(b.pose)-1,Math.floor((t-(b.poseStart||0))*12))];
 const fam=!game.dr?'idle':game.unifiedCount>0||game.finaleDone||game.plan?.kind==='unified'||game.plan?.kind==='finale'?'phase3_guard':'phase2_idle';
 return[fam,Math.floor(t*LOOP)%8];
}
function drawKnight(x,y,scale=1,alpha=1){
 const b=game.boss,[fam,i]=knightAnim(),bob=reduceMotion?0:Math.round(Math.sin(game.clock*1.8)*2);
 const g=ctx.createRadialGradient(x,y-70,6,x,y-70,130);g.addColorStop(0,`rgba(160,200,255,${.16+(reduceMotion?0:Math.sin(game.clock*2)*.04)})`);g.addColorStop(1,'rgba(160,200,255,0)');ctx.fillStyle=g;ctx.fillRect(x-150,y-220,300,260);
 // The Roaring Knight's chromatic fringe, in the Deltarune half.
 if(game.dr&&!reduceMotion){const j=Math.sin(game.clock*7)*1.5;art.anim(fam,i,x-3-j,y+bob,scale,{alpha:alpha*.45,tint:'rgba(255,50,110,1)'});art.anim(fam,i,x+3+j,y+bob,scale,{alpha:alpha*.45,tint:'rgba(60,220,255,1)'});if(Math.floor(game.clock*3.3)%7===0)art.anim(fam,i,x+6,y+bob-2,scale,{alpha:alpha*.3,tint:'rgba(255,230,80,1)'});}
 art.anim(fam,i,x,y+bob,scale,{alpha,tint:b.hurt>.35&&!reduceMotion?'rgba(255,255,255,.8)':null});
}
// Seth on the Deltarune side: his own animations from the designer's pack, with his glasses and notebook effects.
function drawSethDR(x,y,alpha=1){
 const sp=game.sethPose,t=game.clock,active=sp&&t<sp.until,fam=active?sp.name:game.state==='spared'?'offer_hand_hug':'idle';
 const i=active||game.state==='spared'?Math.min(7,Math.floor((t-(sp?.t||0))*8)):Math.floor(t*6);
 // Kneeling to DEFEND holds the low frames; the hug holds its last.
 const frame=fam==='kneel_stand'?Math.min(i,3):i;
 if(game.invulnerability>0&&['defend','warning'].includes(game.state)&&Math.floor(t*15)%2&&!reduceMotion)alpha*=.5;
 art.sethAnim(fam,frame,x,y,2,{alpha});
 if(active&&fam==='cast_glasses')art.sethFx('magic_glasses_formation',Math.floor((t-sp.t)*7),x+4,y-118,1.5,{alpha});
 if(active&&fam==='cast_notebook_page')art.sethFx('floating_pages',Math.floor((t-sp.t)*8),x+44,y-80,1.4,{alpha});
 if(game.defending)art.sethFx('glasses_shield',Math.min(7,Math.floor((t-(sp?.t||t))*8)),x+46,y-70,1.4,{alpha:alpha*.9});
}
function hearts3(x,y){['blade','wild','hope'].forEach((h,k)=>battleSoul(ctx,x+k*14,y,10,HEART[h]));}
function prose(str,n=Infinity,x=48,y=267,width=528,max=44,lines=5,lh=24,color='#fff'){typedLines(wrap(str,max,width),str,n).slice(0,lines).forEach((line,i)=>text(line,x,y+i*lh,2,color));}

// ======================================================================= the Undertale half
function speechUT(){
 if(game.state!=='dialogue'||game.speaker!=='boss')return;
 box(424,30,204,170,'#fff',3);ctx.fillStyle='#fff';ctx.fillRect(412,96,13,3);ctx.fillRect(415,99,10,3);ctx.fillRect(418,102,7,3);
 if(game.heart==='all')hearts3(440,46);else battleSoul(ctx,440,46,10,HEART[game.heart]);
 typedLines(wrap(game.text,15,176,1.5),game.text,shown()).slice(0,7).forEach((l,i)=>text(l,436,58+i*19,1.5,HEART[game.heart]||'#fff'));
 if(game.displayChars>=game.text.length)text('Z',612,180,1,'#777');
}
function utHud({hide=false}={}){
 if(hide)return;
 text('SETH',24,407,2);text('LV '+game.lv,132,407,2);text('HP',248,408,2);
 ctx.fillStyle='#8e2636';ctx.fillRect(284,403,120,16);ctx.fillStyle='#ffff00';ctx.fillRect(284,403,Math.round(120*game.hp/game.maxHP),16);
 text(`${game.hp} / ${game.maxHP}`,425,407,2,'#fff');
 battleButtons(640,480).forEach((r,i)=>drawBattleButton(ctx,r,r.label,i,game.state==='menu'&&game.selected===i));
}
function renderUT({hideUI=false}={}){
 const defending=['defend','warning'].includes(game.state);
 art.backdrop(.9);
 drawKnight(320,226,1.15);speechUT();
 text('KNIGHT',24,26,1,game.ready?'#ffff00':'#9ac8ff');
 if(game.enemyHP<game.enemyMax||game.state==='target'){ctx.fillStyle='#222';ctx.fillRect(256,232,128,3);ctx.fillStyle='#9ac8ff';ctx.fillRect(256,232,128*game.enemyHP/game.enemyMax,3);}
 if(hideUI)return;
 if(defending){field();if(game.state==='warning'){const a=game.arena,size=text.measure(game.attackName,2)>a.w-18?1.5:2;text(game.attackName,a.x+a.w/2,a.y+a.h/2-8,size,'#fff',true);}}
 else{
  const a=game.arena;box(a.x,a.y,a.w,a.h);
  if(game.state==='fight'){ctx.fillStyle='#101a2c';ctx.fillRect(56,286,528,65);for(let i=0;i<24;i++){const x=64+i*22,h=8+(1-Math.abs(x-320)/264)*45;ctx.fillStyle=Math.abs(x-320)<26?'#fff':'#5a7ab8';ctx.fillRect(x,319-h/2,3,h);}ctx.fillStyle='#ffff00';ctx.fillRect(317,279,6,81);ctx.fillStyle='#fff';ctx.fillRect(Math.round(game.attackCursor)-2,278,5,83);}
  else if(game.options().length){const opts=game.options();opts.forEach((label,i)=>{const r=optionRect(i,opts.length),sel=game.option===i;if(sel)heart(r.x+12,r.y+13,14,'purple');text(label,r.x+30,r.y+5,text.measure(label,2)>r.w-44?1.5:2,sel?'#fff':'#bbb');});if(game.state==='item'){const item=game.items.filter(i=>i.count)[game.option];if(item)text('RESTORES '+item.heal+' HP',48,366,1.5,'#ffff00');}else text('Z · CONFIRM     X · BACK',48,366,1,'#777');}
  else if(game.state==='dialogue'&&game.speaker==='boss'){if(game.displayChars>=game.text.length)text('Z',590,367,1,'#777');}
  else if(game.state==='uibreak'){}
  else{prose(game.text,game.state==='dialogue'?shown():Infinity,48,267,528,44,5,24,game.speaker==='seth'?'#d9a6ff':'#fff');if(game.state==='dialogue'&&game.displayChars>=game.text.length)text('Z',590,367,1,'#777');}
 }
 effectsFX();utHud();
 if(game.state==='defend'){ctx.fillStyle='#1a2440';ctx.fillRect(24,397,592,1);ctx.fillStyle='#9ac8ff';ctx.fillRect(24,397,592*Math.max(0,1-game.attackTime/game.duration),1);}
}

// ======================================================================= the break
// The Knight roars: rings, cracks across the box and buttons, the UI shatters and falls, a white flash, and the
// Deltarune battle assembles (grid, Seth on the left, the Knight on the right, the TP bar, the party panel).
let shards=null,cracks=null;
function makeBreak(){
 const R=(()=>{let s=77;return()=>(s=(s*16807)%2147483647)/2147483647;})();shards=[];cracks=[];
 const add=(x,y,w,h,col,n)=>{for(let k=0;k<n;k++){const px=x+w*k/n,pw=w/n;shards.push({x:px,y,w:pw,h,col,vx:(px+pw/2-320)*.6+(R()-.5)*120,vy:-120-R()*160,vr:(R()-.5)*8});}};
 add(24,249,592,4,'#fff',10);add(24,385,592,4,'#fff',10);add(24,249,4,140,'#fff',3);add(612,249,4,140,'#fff',3);
 battleButtons(640,480).forEach(r=>add(r.x,r.y,r.w,r.h,'#ff862b',4));add(284,403,120,16,'#ffff00',4);add(24,402,200,16,'#ddd',6);add(425,402,90,16,'#ddd',3);
 for(let k=0;k<9;k++){const pts=[[24+R()*592,249+R()*140]];for(let j=0;j<7;j++){const [x,y]=pts[pts.length-1];pts.push([x+(R()-.5)*90,y+(R()-.5)*60]);}cracks.push(pts);}
 for(const r of battleButtons(640,480)){const pts=[[r.x+r.w*R(),r.y]];for(let j=0;j<3;j++){const [x,y]=pts[pts.length-1];pts.push([x+(R()-.5)*40,y+12]);}cracks.push(pts);}
}
function renderBreak(){
 const t=game.breakTime;if(!shards)makeBreak();
 if(t<1.6){
  renderUT();
  // Rings out from the Knight, and cracks spreading through the UI.
  for(let k=0;k<3;k++){const u=((t+k*.25)%1.2)/1.2;ctx.save();ctx.globalAlpha=(1-u)*.7;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(320,140,30+u*300,0,Math.PI*2);ctx.stroke();ctx.restore();}
  if(t>.6){const u=clamp((t-.6)/.9,0,1);ctx.save();ctx.strokeStyle='#fff';ctx.lineWidth=2;for(const pts of cracks){const n=Math.max(1,Math.floor(pts.length*u));ctx.beginPath();pts.slice(0,n).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}ctx.restore();}
 }else if(t<3.1){
  art.backdrop(Math.max(0,1-(t-1.6)/1.2));drawKnight(320,226,1.15+(reduceMotion?0:.06*Math.sin(t*20)));
  const tau=t-1.6;for(const s of shards){const x=s.x+s.vx*tau,y=s.y+s.vy*tau+260*tau*tau;if(y>520)continue;ctx.save();ctx.translate(x+s.w/2,y+s.h/2);ctx.rotate(s.vr*tau);ctx.fillStyle=s.col;ctx.fillRect(-s.w/2,-s.h/2,s.w,s.h);ctx.restore();}
 }else renderDR({assemble:clamp((t-3.1)/1.4,0,1)});
 if(t>2.5&&t<3.5){ctx.save();ctx.globalAlpha=(reduceMotion?.35:1)*Math.max(0,1-Math.abs(t-3)/.5);ctx.fillStyle='#fff';ctx.fillRect(0,0,640,480);ctx.restore();}
 if(!reduceMotion&&t<2.6)game.shake=Math.max(game.shake,.05);
}

// ======================================================================= the Deltarune half
const DR_BTN=['FIGHT','ACT','ITEM','SPARE','DEFEND'];
function drButtons(){return DR_BTN.map((label,i)=>({x:156+i*66,y:350,w:62,h:26,label,index:i}));}
function drListRects(n){return Array.from({length:n},(_,i)=>({x:36+(i%2)*292,y:390+Math.floor(i/2)*28,w:284,h:26}));}
function bar(x,y,w,h,frac,col,bg='#330808'){ctx.fillStyle=bg;ctx.fillRect(x,y,w,h);ctx.fillStyle=col;ctx.fillRect(x,y,Math.round(w*clamp(frac,0,1)),h);}
function speechDR(){
 if(game.state!=='dialogue'||game.speaker!=='boss')return;
 const lines=wrap(game.text,20,190,1.5),h=Math.max(52,20+lines.length*18),x=212,y=20;
 ctx.fillStyle='#fff';ctx.fillRect(x,y,220,h);ctx.beginPath();ctx.moveTo(x+220,y+20);ctx.lineTo(x+240,y+28);ctx.lineTo(x+220,y+36);ctx.fill();
 if(game.heart==='all')hearts3(x+12,y+12);else battleSoul(ctx,x+12,y+12,10,HEART[game.heart]);
 typedLines(lines,game.text,shown()).forEach((l,i)=>text(l,x+12,y+20+i*18,1.5,'#000'));
 if(game.displayChars>=game.text.length)text('Z',x+206,y+h-14,1,'#888');
}
// The TP bar, as DELTARUNE draws it: T and P stacked beside a tall bar, the percentage under them (MAX when full).
function tpBar(x0){
 const x=x0+16,y=64,h=226,p=game.tp/100,full=game.tp>=100;text('T',x-12,y+4,1.5,'#fff',true);text('P',x-12,y+24,1.5,'#fff',true);
 if(full)['M','A','X'].forEach((c,i)=>text(c,x-12,y+50+i*18,1.5,'#ffff00',true));else{text(String(Math.floor(game.tp)),x-12,y+48,1.5,'#fff',true);text('%',x-12,y+68,1.5,'#fff',true);}
 ctx.fillStyle='#fff';ctx.fillRect(x-2,y-2,22,h+4);ctx.fillStyle='#7a0e0e';ctx.fillRect(x,y,18,h);ctx.fillStyle=full?'#ffd040':DR_ORANGE;ctx.fillRect(x,Math.round(y+h*(1-p)),18,Math.round(h*p));
 // The spell's cost marked on the bar.
 ctx.fillStyle='#fff';ctx.fillRect(x,Math.round(y+h*(1-TP_COST/100)),18,1);
}
function partyPanel(oy){
 const x=148,y=318+oy,w=344,h=62;ctx.fillStyle='#000';ctx.fillRect(x,y,w,h);ctx.fillStyle=SETHC;ctx.fillRect(x,y,w,2);ctx.fillRect(x,y,2,h);ctx.fillRect(x+w-2,y,2,h);
 // Seth's head icon, name, HP, and how far the Knight has come toward sparing him.
 art.sethFace(game.hp<game.maxHP*.3?'shocked':game.sethMercy>=100?'happy':'neutral',x+6,y+6,30);text('SETH',x+40,y+8,1.5,'#fff');
 text('HP',x+116,y+10,1,'#fff');bar(x+136,y+9,86,10,game.hp/game.maxHP,SETHC,'#3a1040');text(`${game.hp}/${game.maxHP}`,x+136,y+21,1,'#fff');
 text('MERCY',x+236,y+10,1,'#ffff00');bar(x+236,y+21,96,7,game.sethMercy/100,'#ffff00','#403a00');text(game.sethMercy+'%',x+332,y+9,1,'#ffff00',false);
 if(game.state==='menu'&&oy===0)drButtons().forEach((r,i)=>{const sel=game.selected===i,col=sel?'#ffff00':DR_ORANGE;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(r.x+1,r.y+1,r.w-2,r.h-2);if(sel)battleSoul(ctx,r.x+9,r.y+13,10,SETHC);text(r.label,r.x+r.w/2+(sel?5:0),r.y+8,1,col,true);});
 else if(game.defending&&oy===0)text('DEFENDING',x+w/2,y+40,1.5,'#9ac8ff',true);
 else if(game.persevere&&oy===0)text('PERSEVERING',x+w/2,y+40,1.5,SETHC,true);
}
function drTextBox(){
 ctx.fillStyle='#000';ctx.fillRect(0,382,640,98);ctx.fillStyle='#fff';ctx.fillRect(0,382,640,2);
 const st=game.state;
 if(st==='drtarget'){text('HP',384,388,1,'#fff');text('MERCY',492,388,1,'#ffff00');heart(28,408,14,'purple');text('WHITE ROARING KNIGHT',44,400,1.5,game.ready?'#ffff00':'#fff');
  bar(384,402,96,12,game.enemyHP/game.enemyMax,'#43e750','#7a1010');text(Math.round(100*game.enemyHP/game.enemyMax)+'%',432,404,1,'#000',true);bar(492,402,110,12,game.knightMercy/100,'#ffff00','#5a2a00');text(game.knightMercy+'%',547,404,1,'#000',true);return;}
 if(st==='act'||st==='item'){const opts=game.options();drListRects(opts.length).forEach((r,i)=>{const label=opts[i],sel=game.option===i,spell=label==='PERSEVERE';if(sel)heart(r.x-6,r.y+12,14,'purple');text(label,r.x+12,r.y+4,1.5,spell?(game.tp>=TP_COST?DR_ORANGE:'#7a4a2a'):sel?'#fff':'#bbb');if(spell)text(TP_COST+'% TP',r.x+r.w-12,r.y+6,1,DR_ORANGE,false);});return;}
 if(st==='drfight'){const x=60,y=402,w=520;ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x,y,w,40);ctx.strokeStyle=SETHC;ctx.strokeRect(x+w*.14-8,y+3,16,34);text('SETH',x-6,y+12,1,SETHC,false);const cx=x+w*clamp(game.drCursor,0,1);ctx.fillStyle='#fff';ctx.fillRect(Math.round(cx)-2,y+2,4,36);text('Z!',x+w*.14,y+44,1,'#ffff00',true);return;}
 if(st==='dialogue'&&game.speaker==='boss'){if(game.displayChars>=game.text.length)text('Z',604,456,1,'#777');return;}
 if(st==='spared')return;
 // The Knight's turn: what each heart is doing, dimmed while its bullets fly.
 if(st==='defend'){prose(game.attackName,Infinity,30,392,580,50,3,28,'#666');return;}
 const str=st==='warning'?game.attackName:game.text;prose(str,st==='dialogue'?shown():Infinity,30,392,580,50,3,28,game.speaker==='seth'?'#d9a6ff':'#fff');
 if(st==='dialogue'&&game.displayChars>=game.text.length)text('Z',604,456,1,'#777');
}
// The Deltarune half's backdrop, after the Roaring Knight's: black, an arch overhead that changes colour every
// turn, and violet fog rolling on the floor under the Knight.
const ARCH=['#c01818','#d86a10','#c8b010','#30b030','#10a8b8','#2848d8','#8a28d0','#d02890'];
function drBackdrop(t,k){
 ctx.save();ctx.globalAlpha=k;ctx.fillStyle='#000';ctx.fillRect(0,0,640,332);
 const col=ARCH[(game.turn+ARCH.length)%ARCH.length];ctx.lineWidth=34;ctx.strokeStyle=col;ctx.globalAlpha=k*.75;ctx.beginPath();ctx.ellipse(320,-30,120,96,0,0,Math.PI);ctx.stroke();
 ctx.lineWidth=10;ctx.globalAlpha=k*.35;ctx.beginPath();ctx.ellipse(320,-30,150,118,0,0,Math.PI);ctx.stroke();
 ctx.globalAlpha=k;ctx.fillStyle='#000';for(let i=0;i<9;i++){const x=226+i*24,hh=12+((i*7)%5)*5;ctx.fillRect(x,60,8,hh);}
 const f=ctx.createRadialGradient(520,320,10,520,320,260);f.addColorStop(0,'rgba(120,40,160,.55)');f.addColorStop(1,'rgba(40,0,60,0)');ctx.fillStyle=f;ctx.fillRect(220,160,420,172);
 if(!reduceMotion){ctx.globalAlpha=k*.18;ctx.fillStyle='#b070e0';for(let i=0;i<12;i++){const x=((i*83+t*12)%460)+200,y=250+((i*29)%70);ctx.fillRect(Math.round(x),Math.round(y),22,3);}}
 ctx.restore();
}
function renderDR({assemble=1}={}){
 const k=ease(assemble),defending=['defend','warning'].includes(game.state),t=game.clock;
 drBackdrop(t,k);
 // Seth stands on the left like a party member; he steps in when he attacks.
 drawSethDR(112-(1-k)*160,300,k);
 if(game.defending){ctx.save();ctx.globalAlpha=.55;ctx.strokeStyle=SETHC;ctx.lineWidth=3;ctx.beginPath();ctx.arc(150,240,40,-1,1);ctx.stroke();ctx.restore();}
 drawKnight(320+(522-320)*k,300,1.35);
 text('WHITE ROARING KNIGHT',522,24,1,game.ready?'#ffff00':'#9ac8ff',true);
 tpBar(20-(1-k)*80);
 if(defending)field(DR_GREEN);
 partyPanel(Math.round((1-k)*170));
 if(k>=1){drTextBox();speechDR();}
 effectsFX();
 if(game.state==='defend'){const a=game.arena;ctx.fillStyle='#1a2440';ctx.fillRect(a.x,a.y+a.h+8,a.w,2);ctx.fillStyle=DR_GREEN;ctx.fillRect(a.x,a.y+a.h+8,a.w*Math.max(0,1-game.attackTime/game.duration),2);}
}

// ======================================================================= frame
function renderBattle(){
 game.locationFX?.draw();
 if(game.state==='encounter'){const t=game.encounter,f=game.encFrom||{x:320,y:300};if(t<.45){game.scene='world';const st=game.state;game.state='frozen';renderWorld();game.state=st;game.scene='battle';const bob=reduceMotion?0:Math.round(Math.sin(t*30)*2);box(f.x-12,f.y-70+bob,24,28,'#fff',2);text('!',f.x,f.y-68+bob,2,'#fff',true);return;}ctx.fillStyle='#000';ctx.fillRect(0,0,640,480);if(t<.9){if(Math.floor((t-.45)*13)%2===0||reduceMotion)heart(f.x,f.y,16,'purple');}else{const kk=Math.min(1,(t-.9)/.55),e=kk*kk*(3-2*kk);heart(f.x+(320-f.x)*e,f.y+(300-f.y)*e,16,'purple');}return;}
 if(game.state==='uibreak'){renderBreak();return;}shards=null;
 if(game.state==='spared'){if(game.dr)renderDR();else renderUT();ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,640,480);text('A NEW WORLD',320,190,3,'#ffff00',true);text('TOGETHER.',320,236,2,'#fff',true);hearts3(299,280);if(game.timer>1.2)text('Z · PLAY AGAIN',320,330,1.5,'#777',true);return;}
 if(game.dr)renderDR();else renderUT();
 if(game.settings.invincible)text('INVINCIBLE',24,46,1,'#ffff00');
}
function render(){
 soulVisual.advance(game.clock,'purple',1);ctx.save();ctx.fillStyle='#000';ctx.fillRect(0,0,640,480);
 if(game.shake&&!reduceMotion)ctx.translate(Math.sin(game.clock*109)*3,Math.cos(game.clock*73)*2);
 if(game.state==='dead'){const ready=soulBreak.draw(game,{x:game.soul.x,y:game.soul.y,reduced:reduceMotion});if(ready){text('GAME OVER',320,105,5,'#fff',true);text('THE DREAM ISN\'T OVER.',320,281,2,'#aaa',true);text('Z / TAP · RETRY',320,324,2,'#ffff00',true);text('FULL HP + RESTORED SUPPLIES',320,355,1.5,'#aaa',true);}ctx.restore();return;}
 if(game.scene==='world')renderWorld();else renderBattle();
 if(game.paused){ctx.fillStyle='#000d';ctx.fillRect(0,0,640,480);text('PAUSED',320,213,4,'#fff',true);}
 ctx.restore();
}
function musicMode(){if(game.state==='encounter'||game.state==='uibreak')return 'off';if(game.scene==='world'||game.state==='spared')return 'walk';if(game.plan?.kind==='finale'&&['defend','warning'].includes(game.state))return 'finale';return game.dr?'dr':'ut';}
function syncUI(){
 $('back').textContent=konami.progress>=8?'B':'X';$('confirm').textContent=konami.progress>=8?'A':'Z';
 audio.status(musicMode(),game.paused,game.state==='dead');
 $('phase').textContent=game.paused?'PAUSED':game.state==='dead'?'THE DREAM ISN\'T OVER':game.state==='spared'?'A NEW WORLD':game.scene==='world'?require("story.js").ROOMS[game.world.room]:(game.dr?'A NEW WORLD':'THE CRYSTAL')+' / TURN '+Math.max(1,game.turn)+(game.settings.invincible?' / INVINCIBLE':'');
 $('pause').textContent=game.paused?'▶':'Ⅱ';$('pause').setAttribute('aria-pressed',String(game.paused));
 const next=[game.scene,game.state,game.ui,game.paused,game.items.map(i=>i.count).join(','),game.ready,game.state==='dead'&&game.deathAge>=1.8,game.timer>1.2].join('/');if(signature===next)return;signature=next;const overlay=$('targets');overlay.replaceChildren();
 const target=(label,x,y,w,h,fn)=>{const b=document.createElement('button');b.setAttribute('aria-label',label);b.style.cssText=`left:${x/640*100}%;top:${y/480*100}%;width:${w/640*100}%;height:${h/480*100}%`;b.onclick=()=>{fn();syncUI();};overlay.append(b);};
 if(game.paused){target('Resume',0,0,640,480,()=>game.togglePause());return;}
 if(game.scene==='world'){if(game.state==='dialogue')target('Continue',0,0,640,480,()=>game.confirm());return;}
 if(game.state==='dead'&&game.deathAge<1.8)return;
 if(game.state==='menu'){if(game.dr)drButtons().forEach((r,i)=>target(r.label,r.x,r.y,r.w,r.h,()=>game.chooseMenu(i)));else battleButtons(640,480).forEach((r,i)=>target(r.label,r.x,r.y,r.w,r.h,()=>game.chooseMenu(i)));}
 else if(game.state==='drtarget')target('White Roaring Knight',24,386,592,40,()=>game.confirm());
 else if(game.options().length){const n=game.options().length;game.options().forEach((label,i)=>{const r=game.dr?drListRects(n)[i]:optionRect(i,n);target(label,r.x,r.y,r.w,r.h,()=>{game.option=i;game.confirm();});});}
 else if(['dialogue','fight','drfight','spared','dead'].includes(game.state))target(game.state.includes('fight')?'Strike':game.state==='dialogue'?'Continue':'Play again',24,30,592,440,()=>game.confirm());
}
game.onEvent=event=>{syncUI();audio.effect(event);if(['text','turn','dead','end'].includes(event))$('live').textContent=game.state==='dead'?'Game over.':`${game.text}`;};
function unlockSound(e){if(e?.target?.closest?.('#sound'))return;if(!audio.enabled&&!audio.userMuted)void audio.enable(true).then(()=>$('sound').setAttribute('aria-pressed','true'));}
document.addEventListener('pointerdown',unlockSound);window.addEventListener('keydown',unlockSound);
const keyMap={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',Shift:'slow'};
window.addEventListener('keydown',e=>{if($('options').open||e.target instanceof HTMLSelectElement||e.target instanceof HTMLInputElement)return;const k=e.key.length===1?e.key.toLowerCase():e.key,dir=keyMap[k];if(!e.repeat&&konami.input(['up','down','left','right'].includes(dir)&&!['b','a'].includes(k)?dir:k)){e.preventDefault();syncUI();return;}if(dir){e.preventDefault();keys[dir]=true;if(!e.repeat&&dir!=='slow')game.navigate(dir==='left'?-1:dir==='right'?1:0,dir==='up'?-1:dir==='down'?1:0);}if(['z','Enter',' ','x','Escape','Backspace','p'].includes(k)){if(e.target instanceof HTMLButtonElement&&(k==='Enter'||k===' '))return;e.preventDefault();if(e.repeat)return;if(k==='p')game.togglePause();else if(['x','Escape','Backspace'].includes(k))game.back();else game.confirm();}syncUI();});
window.addEventListener('keyup',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if(keyMap[k])keys[keyMap[k]]=false;});
function clearInput(){Object.keys(keys).forEach(k=>keys[k]=false);Object.keys(touchKeys).forEach(k=>touchKeys[k]=false);touch=null;drag=null;document.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
function inactive(){clearInput();if(['defend','fight','drfight','warning'].includes(game.state)&&!game.paused)game.togglePause();}
window.addEventListener('blur',inactive);document.addEventListener('visibilitychange',()=>{if(document.hidden)inactive();});
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*640/r.width,y:(e.clientY-r.top)*480/r.height};}
canvas.addEventListener('pointerdown',e=>{if(game.paused||drag)return;if(game.state==='defend'){e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);drag={id:e.pointerId,x:p.x,y:p.y,sx:game.soul.x,sy:game.soul.y,world:false};touch={x:game.soul.x,y:game.soul.y};}else if(game.state==='world'){e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);drag={id:e.pointerId,world:true};touch=p;}canvas.focus({preventScroll:true});});
canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e);touch=drag.world?p:{x:drag.sx+p.x-drag.x,y:drag.sy+p.y-drag.y};});
const releaseDrag=e=>{if(drag?.id===e.pointerId){if(drag.world&&game.state==='world')game.confirm();touch=null;drag=null;}};canvas.addEventListener('pointerup',releaseDrag);canvas.addEventListener('pointercancel',releaseDrag);
document.querySelectorAll('.touch-controls button').forEach(b=>b.addEventListener('contextmenu',e=>e.preventDefault()));
document.querySelectorAll('[data-key]').forEach(button=>{const dir=button.dataset.key;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);touchKeys[dir]=true;button.classList.add('held');konami.input(dir);game.navigate(dir==='left'?-1:dir==='right'?1:0,dir==='up'?-1:dir==='down'?1:0);syncUI();});const release=()=>{touchKeys[dir]=false;button.classList.remove('held');};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);});
$('confirm').onclick=()=>{if(!konami.input('a'))game.confirm();syncUI();};$('back').onclick=()=>{if(!konami.input('b'))game.back();syncUI();};$('pause').onclick=()=>{clearInput();game.togglePause();};
$('restart').onclick=()=>{clearInput();game.reset();};
$('sound').onclick=async()=>{audio.userMuted=audio.enabled;await audio.enable(!audio.enabled);$('sound').setAttribute('aria-pressed',String(audio.enabled));$('sound').setAttribute('aria-label',audio.enabled?'Mute music and sound':'Enable music and sound');};
$('help').onclick=()=>{clearInput();resumeAfterOptions=!game.paused&&game.scene==='battle';if(resumeAfterOptions)game.togglePause();$('options').showModal();};$('closeOptions').onclick=()=>$('options').close();$('options').addEventListener('close',()=>{if(resumeAfterOptions&&game.paused)game.togglePause();canvas.focus({preventScroll:true});});
$('difficulty').onchange=e=>{game.settings.difficulty=e.target.value;};$('motion').onchange=e=>{reduceMotion=e.target.checked;};
$('skipWalk').onchange=e=>{game.settings.skipWalk=e.target.checked;if(e.target.checked&&game.scene==='world')game.startBattle(true);};
function frame(now){accumulator=Math.min(accumulator+(now-last)/1000,.1);last=now;const input={};for(const k of ['up','down','left','right','slow'])input[k]=keys[k]||touchKeys[k];input.touch=touch;while(accumulator>=1/120){game.update(1/120,input);accumulator-=1/120;}if(game.state==='dialogue'&&game.displayChars<game.text.length&&game.clock-textSound>.07){audio.blip(game.speaker);textSound=game.clock;}syncUI();render();requestAnimationFrame(frame);}
syncUI();render();requestAnimationFrame(frame);
window.battleDebug={game,render,syncUI,audio};

// Seth's supplied weapon in the Undertale half: two timed strikes, spin, then a single resolved impact.
// (Once the battle turns Deltarune, FIGHT is Deltarune's own timing bar.)
const notebookVisual=new NotebookVisual(ctx,{enabled:()=>audio.enabled,paused:()=>game.paused,calm:()=>reduceMotion});
installNotebook(game,{kind:'rift',target:g=>({x:g.boss.x,y:g.boss.y-90}),event:(type,n)=>notebookVisual.event(type,n)});
notebookVisual.fx.bind(game,{hurt:fx=>fx.hurt(),dead:fx=>fx.kick(.55)});
const beforeNotebookRender=render;
render=function(){game.notebookRender(beforeNotebookRender);if(game.scene==='battle'&&!game.dr)notebookVisual.draw(game);};
canvas.addEventListener('pointerdown',event=>{const n=game.notebook;if(!n.active)return;const r=canvas.getBoundingClientRect(),x=(event.clientX-r.left)*canvas.width/r.width,y=(event.clientY-r.top)*canvas.height/r.height,s=canvas.width/640,top=canvas.height-231*s;if(x>=24*s&&x<=616*s&&y>=top&&y<=top+140*s){event.preventDefault();event.stopImmediatePropagation();game.confirm();}},{capture:true});

})().catch(console.error);</script>
</body></html>
