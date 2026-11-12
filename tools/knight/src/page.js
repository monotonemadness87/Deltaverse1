
const {installNotebook}=require("notebook.js");
const {NotebookVisual}=require("notebook-visual.js");
const {battleButtons,drawBattleButton,battleSoul}=require("battle-ui.js");
const {SoulBreak}=require("soul-break.js");
const {SoulVisual}=require("soul-visual.js");
const {BattleEngine,clamp,TP_COST}=require("engine.js");
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
const HEART={blade:'#5ab8ff',wild:'#ff4aa8',hope:'#5ef29a',all:'#ffffff'},SETHC='#b249dc',DR_ORANGE='#ff7f27',DR_BORDER='#00c100';
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
 // The crystal room: ceiling gems, the echo flowers round the edge (bright after they speak), the crystal.
 art.gems(t,0,640,5);
 for(const o of w.data.objects){if(!o.id.startsWith('echo'))continue;const i=Number(o.id.slice(4)),le=w.flags.lastEcho,lit=le&&le.i===i?Math.max(0,1-(t-le.t)/2.5):w.flags['echo'+i]?.12:0;art.echoFlower(o.x,o.y,t,lit);}
 const m=w.manifest;art.crystal(320,346,t,m?Math.min(1,m.t/1.6):0);
 if(w.room==='cavern'&&w.manifest)manifestation(w.manifest.t);
 art.sethFrame(w.seth.dir,w.seth.moving,w.seth.step,w.seth.x-cam,w.seth.y);
 if(game.state==='world'&&!w.fadeTo){const o=w.nearest();if(o){const bob=reduceMotion?0:Math.round(Math.sin(t*5)*2);text('Z',o.x-cam,o.y-(o.id==='crystal'?250:70)+bob,1,'#ffff00',true);}}
 if(w.title>0){ctx.save();ctx.globalAlpha=Math.min(1,w.title);text(require("story.js").ROOMS[w.room],320,452,1.5,'#fff',true);ctx.restore();}
 if(game.state==='dialogue')worldDialogue(w);
 if(w.fadeTo){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,w.fade<.32?w.fade/.32:1-(w.fade-.32)/.32)})`;ctx.fillRect(0,0,640,480);}
}
// The crystal wakes: light builds, three hearts (cyan, pink, green) fly out and circle, then merge into the Knight.
function manifestation(t){
 const cx=320,cy=226;
 if(t>1.1){const u=clamp((t-1.1)/1.4,0,1);['blade','wild','hope'].forEach((h,k)=>{const an=k*Math.PI*2/3+t*(reduceMotion?0:2.6),r=(1-u)*120*Math.sin(Math.min(1,u*3)*Math.PI/2)+(u>=1?0:10);battleSoul(ctx,cx+Math.cos(an)*r,cy+Math.sin(an)*r*.6,18,HEART[h]);});}
 // The Knight arrives out of the light (its arrival animation), then idles in front of the crystal.
 if(t>2.4){const k=Math.floor((t-2.4)*8);if(k<8)art.anim('arrival',k,320,346,1);else art.anim('idle',Math.floor(game.clock*LOOP)%8,320,346,1);}
 if(t>2.3&&t<3.1){ctx.save();ctx.globalAlpha=(reduceMotion?.4:1)*Math.max(0,1-Math.abs(t-2.55)/.4);ctx.fillStyle='#fff';ctx.fillRect(0,0,640,480);ctx.restore();}
}
function worldDialogue(w){
 const top=w.seth.y>250,y=top?16:318;box(32,y,576,146,'#fff',6);
 let tx=56,width=520,max=40,col='#fff';const sp=game.speaker;
 if(sp==='gerson'){art.gersonFace(62,y+20,76);tx=168;width=420;max=31;}
 else if(sp==='boss'){art.portrait(56,y+28,87);tx=170;width=416;max=30;col=HEART[game.heart]||'#fff';}
 else if(sp==='seth'){art.sethFace(game.face&&game.face!=='face'?game.face:'talking',56,y+22,85);tx=168;width=420;max=31;col='#d9a6ff';}
 typedLines(wrap(game.text,max,width),game.text,shown()).slice(0,4).forEach((l,i)=>text(l,tx,y+20+i*30,2,col));
 if(game.displayChars>=game.text.length)text('Z',590,y+118,1,'#777');
}

// ======================================================================= hazards (both halves)
function star4(x,y,r,col='#fff'){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r*.28,y-r*.28);ctx.lineTo(x+r,y);ctx.lineTo(x+r*.28,y+r*.28);ctx.lineTo(x,y+r);ctx.lineTo(x-r*.28,y+r*.28);ctx.lineTo(x-r,y);ctx.lineTo(x-r*.28,y-r*.28);ctx.closePath();ctx.fill();}
// The Knight's six-pointed star, outlined.
function star6(x,y,r,col){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(game.clock*(reduceMotion?0:2));ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<12;k++){const rr=k%2?r*.5:r,an=k*Math.PI/6;k?ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):ctx.moveTo(Math.cos(an)*rr,Math.sin(an)*rr);}ctx.closePath();ctx.stroke();ctx.fillStyle=col;ctx.fillRect(-1,-1,2,2);ctx.restore();}
// A star of the Knight's light: two hollow triangles, a gem in the middle, turning slowly.
function hexStar(x,y,r,alpha=1,solid=false){ctx.save();ctx.globalAlpha=alpha;ctx.translate(Math.round(x),Math.round(y));ctx.rotate(reduceMotion?0:game.clock*.9+x*.01);ctx.lineWidth=2;ctx.strokeStyle='#ffffff';ctx.fillStyle=solid?'#ffffff':'rgba(40,44,120,.55)';
 for(const o of [0,Math.PI]){ctx.beginPath();for(let k=0;k<3;k++){const an=o+k*2.0944-Math.PI/2;k?ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r):ctx.moveTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.closePath();ctx.fill();ctx.stroke();}
 ctx.fillStyle='#ffffff';ctx.fillRect(-2,-2,4,4);ctx.restore();}
// The Knight's swords are the designer's sprite: the large cut in the Deltarune half, the small one in the Undertale
// half. ghost = a sword that is only showing itself (dim violet, as the Roaring Knight's are before they strike).
const SWORD_VIOLET='rgba(120,110,255,1)';
function sword(x,y,rot,{ghost=false,alpha=1,frame=null}={}){
 const fam=game.dr?'sword_projectile_large':'sword_projectile',k=game.dr?.46:.3,i=frame??Math.floor(game.clock*8)%4;
 // The sprite points down; rot is the direction it points, in canvas angles.
 return art.anim(fam,i,x,y,k,{rot:rot-Math.PI/2,alpha:alpha*(ghost?.7:1),tint:ghost?SWORD_VIOLET:null});
}
// The Knight's crescent: a white moon-blade (a lune, thick in the middle and sharp at the tips) dragging grey
// afterimages behind it, the size of the whole box and more.
function lune(x,y,R,thick,span,col){
 // Outer edge: a circle round (x, y). Inner edge: a wider circle pushed right that meets it at the two tips, so the
 // blade is `thick` in the middle and tapers to points.
 const Ro=R+thick/2,c=Math.cos(span),sn=Math.sin(span),d=thick*(2*Ro-thick)/(2*Math.max(1,Ro*(1-c)-thick)),Ri=d+Ro-thick,au=Math.atan2(-Ro*sn,-(Ro*c+d));
 ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,Ro,Math.PI-span,Math.PI+span);ctx.arc(x+d,y,Ri,au,-au,true);ctx.closePath();ctx.fill();}
function moon(b){const trail=reduceMotion?3:8;ctx.save();
 for(let k=trail;k>=1;k--){const g=Math.round(190-k*19);lune(Math.round(b.x+k*11),Math.round(b.y),b.R,b.thick,b.span*(1-k*.012),`rgb(${g},${g},${g+6})`);}
 lune(Math.round(b.x),Math.round(b.y),b.R,b.thick,b.span,'#ffffff');ctx.restore();}
function spikePath(b,len){const px=-b.dy,py=b.dx,hw=b.w/2;ctx.beginPath();ctx.moveTo(b.x+px*hw,b.y+py*hw);ctx.lineTo(b.x+b.dx*len,b.y+b.dy*len);ctx.lineTo(b.x-px*hw,b.y-py*hw);ctx.closePath();}
// A crystal spire bursting out of the floor (or down from the ceiling): white, with a grey afterimage and small
// spikes crowding its base, and the designer's burst at its foot.
function crystal(b){const L=b.cur,d=b.dy,x=Math.round(b.x),y0=b.y,hw=b.w/2;if(L<2)return;
 const jag=(w,len,col,ox=0)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x+ox-w,y0);const n=5;for(let i=1;i<=n;i++){const t=i/(n+1);ctx.lineTo(x+ox-w*(1-t)-(i%2?3:0),y0+d*len*t);}ctx.lineTo(x+ox,y0+d*len);for(let i=n;i>=1;i--){const t=i/(n+1);ctx.lineTo(x+ox+w*(1-t)+(i%2?0:3),y0+d*len*t);}ctx.lineTo(x+ox+w,y0);ctx.closePath();ctx.fill();};
 jag(hw+6,L*.96,'rgba(120,128,150,.55)',7);jag(hw*.55,L*.42,'#c8d0e6',-hw);jag(hw*.5,L*.34,'#c8d0e6',hw+2);
 jag(hw,L,'#ffffff');jag(hw*.42,L*.9,'#cfdcf5',hw*.3);
 if(!b.down&&b.dy<0){const t=b.age-b.warn;art.anim('ground_spike',Math.min(3,1+Math.floor(t*7)),x,y0-40,1,{alpha:Math.max(0,1-t*1.6)});}
}
function hazard(b){
 const t=game.clock;
 switch(b.kind){
  case 'spike':{if(b.crystal){crystal(b);return;}
   if(b.age<b.warn){const u=b.age/b.warn,w=Math.round(b.w*(.5+.5*u));ctx.save();ctx.fillStyle=blink(12)&&u>.6?'#ffffff':'#9aa6c8';ctx.fillRect(Math.round(b.x-w/2),Math.round(b.y+(b.dy<0?-3:1)),w,2);ctx.globalAlpha=.3;ctx.strokeStyle='#9ad4ff';ctx.setLineDash([3,3]);spikePath(b,b.len);ctx.stroke();ctx.restore();return;}
   if(b.cur<1)return;ctx.save();ctx.fillStyle='#ffffff';spikePath(b,b.cur);ctx.fill();ctx.fillStyle='#bcd0f2';ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+b.dx*b.cur,b.y+b.dy*b.cur);ctx.lineTo(b.x+b.w/2,b.y);ctx.closePath();ctx.fill();ctx.restore();return;}
  // The Knight's slash: a thin double line first, then the cut.
  case 'slash':{const dx=b.x2-b.x1,dy=b.y2-b.y1,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;ctx.save();
   if(b.age<b.warn){ctx.globalAlpha=.55+(reduceMotion?0:.25*Math.sin(b.age*30));for(const [o,c] of [[-2,'#ffffff'],[2,'#7a8cff']]){ctx.strokeStyle=c;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x1+nx*o,b.y1+ny*o);ctx.lineTo(b.x2+nx*o,b.y2+ny*o);ctx.stroke();}}
   else{const u=clamp((b.age-b.warn)/(b.live+.25),0,1);ctx.globalAlpha=1-u*u;ctx.strokeStyle='#8a9cff';ctx.lineWidth=(b.w+8)*(1-u*.5);ctx.beginPath();ctx.moveTo(b.x1,b.y1);ctx.lineTo(b.x2,b.y2);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(2,b.w*(1-u*.6));ctx.beginPath();ctx.moveTo(b.x1,b.y1);ctx.lineTo(b.x2,b.y2);ctx.stroke();}
   ctx.restore();return;}
  case 'buster':{moon(b);return;}
  case 'star':{if(art.anim('star_projectile',Math.floor(b.age*10)%4,b.x,b.y,.2))return;star4(b.x,b.y,6,HEART.blade);star4(b.x,b.y,4,'#fff');return;}
  case 'shard':{if(b.big){const held=b.hold&&b.age<b.hold;if(game.dr&&!b.small&&art.anim('diamond_shard_large',held?0:Math.floor(b.age*8)%4,b.x,b.y,.24,{alpha:held?.6+.4*blink(10):1}))return;if(art.anim('diamond_shard',Math.floor(b.age*8)%4,b.x,b.y,.16))return;}star4(b.x,b.y,3,b.age>1.2?'#9ab0ff':'#ffffff');return;}
  case 'gift':{if(!art.anim('heal_heart',Math.floor(b.age*6)%4,b.x,b.y,.17))battleSoul(ctx,b.x,b.y,14,blink(5)?HEART.hope:'#a8ffd0');return;}
  case 'zee':{ctx.save();ctx.globalAlpha=.85;text('Z',b.x,b.y-7,1.5,'#c8f0ff',true);ctx.restore();return;}
  case 'orbitsword':{sword(b.x,b.y,b.ang??0,{ghost:!b.launched&&b.age<b.aimAt-.22});return;}
  // The tracking sword: dim while it follows, bright with a thin line down its path once it locks, then the stab.
  case 'tsword':{const A=game.arena,dir=b.up?-1:1,locked=b.age>=b.track,going=b.age>=b.track+b.lock,cy=b.y-dir*b.len/2;
   if(locked&&!going){ctx.save();ctx.globalAlpha=.75;ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(b.x),A.y-30,1,A.h+60);ctx.restore();}
   if(going&&!reduceMotion){ctx.save();ctx.fillStyle='#5a66c8';for(let k=1;k<=7;k++){ctx.globalAlpha=.5-k*.06;ctx.fillRect(Math.round(b.x)-2,Math.round(b.y-dir*(b.len+k*16)),4,10);}ctx.restore();}
   sword(b.x,cy,b.up?-Math.PI/2:Math.PI/2,{ghost:!locked,frame:going?0:null});return;}
  // A standing blade on the box's top or bottom edge.
  case 'tooth':{const A=game.arena,L=Math.round(b.len*Math.min(1,b.age/b.grow)),x=Math.round(b.x);if(L<2)return;ctx.save();ctx.fillStyle='#ffffff';ctx.beginPath();
   if(b.top){ctx.moveTo(x-5,A.y);ctx.lineTo(x+5,A.y);ctx.lineTo(x+5,A.y+L-8);ctx.lineTo(x,A.y+L);ctx.lineTo(x-5,A.y+L-8);}else{const y=A.y+A.h;ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.lineTo(x+5,y-L+8);ctx.lineTo(x,y-L);ctx.lineTo(x-5,y-L+8);}
   ctx.closePath();ctx.fill();ctx.fillStyle='#b8c4ea';if(b.top)ctx.fillRect(x+2,A.y,3,Math.max(0,L-8));else ctx.fillRect(x+2,A.y+A.h-L+8,3,Math.max(0,L-8));ctx.restore();return;}
  // The shadow a crystal comes out of.
  case 'eruption':{const u=clamp(b.age/b.warn,0,1),rx=Math.round(b.w*(.45+.55*u)),ry=Math.round(4+3*u),y=b.down?4:b.y;ctx.save();ctx.fillStyle=u>.7&&blink(14)?'#e8e8f0':'#6a6c78';ctx.beginPath();ctx.ellipse(Math.round(b.x),y,rx,ry,0,0,6.283);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(Math.round(b.x),y,Math.round(rx*.55),Math.max(1,ry-3),0,0,6.283);ctx.fill();
   if(u>.72&&!b.down)art.anim('ground_spike',0,b.x,y-40,1);ctx.restore();return;}
  // A blade of the bar curtain: floor to ceiling, with the corridor cut out of it (blue ones are whole).
  case 'bar':{const x=Math.round(b.x-b.w/2),w=b.w,H=game.dr?326:396,tipL=9;ctx.save();
   const blade=(y0,y1,down)=>{ctx.beginPath();if(down){ctx.moveTo(x,y0);ctx.lineTo(x+w,y0);ctx.lineTo(x+w,y1-tipL);ctx.lineTo(x+w/2,y1);ctx.lineTo(x,y1-tipL);}else{ctx.moveTo(x,y1);ctx.lineTo(x+w,y1);ctx.lineTo(x+w,y0+tipL);ctx.lineTo(x+w/2,y0);ctx.lineTo(x,y0+tipL);}ctx.closePath();ctx.fill();};
   if(b.blue){ctx.fillStyle='#2a3cff';ctx.fillRect(x,0,w,H);ctx.fillStyle='#7f8cff';ctx.fillRect(x+3,0,4,H);}
   else{ctx.fillStyle='#ffffff';blade(0,Math.round(b.gapY-b.gapH/2),true);blade(Math.round(b.gapY+b.gapH/2),H,false);ctx.fillStyle='#b4bcd8';ctx.fillRect(x+w-5,0,3,Math.max(0,Math.round(b.gapY-b.gapH/2)-tipL));ctx.fillRect(x+w-5,Math.round(b.gapY+b.gapH/2)+tipL,3,H);}
   ctx.restore();return;}
  // A star of the Knight's light: it blooms (harmless) before it is solid, and flares just before it bursts.
  case 'star6':{if(b.delay&&b.age<b.delay)return;const fam=b.big?'star_projectile_large':'star_projectile',k=b.big?.34:.2,blooming=b.bloom&&b.age<b.bloom,last=b.fuse&&b.age>b.fuse-.3;
   if(b.big&&b.bloom){const u=blooming?b.age/b.bloom:1;if(last&&!reduceMotion){ctx.save();ctx.globalAlpha=.8;ctx.fillStyle='#ffffff';const L=30*(1-(b.fuse-b.age)/.3)+8;ctx.fillRect(Math.round(b.x-L),Math.round(b.y),L*2,1);ctx.fillRect(Math.round(b.x),Math.round(b.y-L),1,L*2);ctx.restore();}
    hexStar(b.x,b.y,(5+11*u)*(last&&blink(14)?1.25:1),blooming?.4+.3*blink(16):1,last&&blink(14));return;}
   if(last&&!reduceMotion){ctx.save();ctx.globalAlpha=.8;ctx.fillStyle='#ffffff';const L=(b.big?26:16)*(1-(b.fuse-b.age)/.3)+6;ctx.fillRect(Math.round(b.x-L),Math.round(b.y),L*2,1);ctx.fillRect(Math.round(b.x),Math.round(b.y-L),1,L*2);ctx.restore();}
   if(!art.anim(fam,Math.floor(b.age*10)%4,b.x,b.y,k,{alpha:blooming?.35+.3*blink(16):1,tint:last&&blink(14)?'rgba(255,255,255,1)':null}))star6(b.x,b.y,b.r+3,'#fff');return;}
  // A beam: a thin line first; then blue light across the whole screen, pale at its heart.
  case 'laser':{const cx=Math.cos(b.angle),cy=Math.sin(b.angle),L=1300,x1=b.full?b.ox-cx*L:b.ox,y1=b.full?b.oy-cy*L:b.oy;ctx.save();
   if(b.age<b.warn){ctx.globalAlpha=.6+(reduceMotion?0:.3*Math.sin(b.age*26));ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.setLineDash([5,3]);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(b.ox+cx*L,b.oy+cy*L);ctx.stroke();}
   else{const u=clamp((b.age-b.warn)/(b.live+.2),0,1);ctx.globalAlpha=u<.7?1:Math.max(0,(1-u)/.3);ctx.strokeStyle=b.col;ctx.lineWidth=(b.w+8)*(1-u*.3);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(b.ox+cx*L,b.oy+cy*L);ctx.stroke();ctx.strokeStyle=b.col==='#ff2a3a'?'#ffd0d0':'#a8b0ff';ctx.lineWidth=Math.max(2,(b.w-6)*(1-u*.5));ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(b.ox+cx*L,b.oy+cy*L);ctx.stroke();}
   ctx.restore();return;}
  // The line from the Knight's sword that the light opens along.
  case 'ray':{ctx.save();ctx.globalAlpha=b.bright?Math.max(0,1-b.age/b.life):.9;ctx.strokeStyle='#ffffff';ctx.lineWidth=b.bright?6*(1-b.age/b.life)+1:2;ctx.beginPath();ctx.moveTo(b.ox,b.oy);ctx.lineTo(b.ox+Math.cos(b.angle)*900,b.oy+Math.sin(b.angle)*900);ctx.stroke();ctx.restore();return;}
  // The cone of light: white as it opens, then violet-blue with paler bands turning in it.
  case 'cone':{const a1=b.angle-b.half,a2=b.angle+b.half,open=clamp(b.age/.18,0,1),close=clamp((b.warn+b.live+.2-b.age)/.25,0,1),h=b.half*open*close;if(h<=0)return;
   const path=(hh)=>{ctx.beginPath();ctx.moveTo(b.ox,b.oy);ctx.lineTo(b.ox+Math.cos(b.angle-hh)*b.len,b.oy+Math.sin(b.angle-hh)*b.len);ctx.lineTo(b.ox+Math.cos(b.angle+hh)*b.len,b.oy+Math.sin(b.angle+hh)*b.len);ctx.closePath();};
   ctx.save();const white=clamp(1-(b.age-.1)/.3,0,1);path(h);ctx.fillStyle='#4a50e8';ctx.globalAlpha=.82;ctx.fill();
   // Paler bands inside the light.
   ctx.clip();ctx.globalAlpha=.3;ctx.strokeStyle='#9aa4ff';ctx.lineWidth=26;const ph=reduceMotion?0:b.age*.5;for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(b.ox-150-k*120,b.oy+Math.sin(ph+k)*40,90+k*30,60+k*36,ph+k*.7,0,6.283);ctx.stroke();}
   if(white>0){ctx.globalAlpha=white;ctx.fillStyle='#ffffff';ctx.fillRect(0,0,640,480);}ctx.restore();return;}
  // A thrown sword: it shows itself turning (dim), then flies, leaving a dotted trail.
  case 'thrown':{const L=Math.hypot(b.vx,b.vy)||1,ang=Math.atan2(b.vy,b.vx),h=game.dr?28:18,spinning=b.age<b.spin;
   if(b.trail&&!reduceMotion)b.trail.forEach(([x,y],i)=>{ctx.save();ctx.globalAlpha=.1+i*.04;ctx.fillStyle='#6a7ad8';ctx.fillRect(Math.round(x-b.vx/L*h)-2,Math.round(y-b.vy/L*h)-2,4,4);ctx.restore();});
   sword(b.x-b.vx/L*h,b.y-b.vy/L*h,ang,{ghost:spinning&&b.age<b.spin-.15});return;}
  case 'rb':{const A=game.arena;if(b.age<b.warn){ctx.save();ctx.globalAlpha=.18+.2*blink(12);ctx.fillStyle='#b040ff';ctx.fillRect(A.x+3,Math.round(b.y-b.half),A.w-6,b.half*2);ctx.restore();return;}
   // The real RUDE BUSTER frames from the Gerson fight, mirrored to fly left; it grows its trail as it goes.
   const k=Math.min(7,Math.floor((b.age-b.warn)*16)),[w,h]=art.uiSize('rb_'+k);art.uiFlip('rb_'+k,Math.round(b.tip),Math.round(b.y-h/2));return;}
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
  return;
 }
 if(game.invulnerability>0&&game.recenter<=0&&Math.floor(game.clock*15)%2)return;
 heart(s.x,s.y,16,'purple');
 if(game.sleepy>0){ctx.save();ctx.globalAlpha=.7;text('z',s.x+10,s.y-20,1,'#c8f0ff');ctx.restore();}
 if(game.defending||game.persevere){ctx.save();ctx.globalAlpha=.6;ctx.strokeStyle=SETHC;ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,13,0,Math.PI*2);ctx.stroke();ctx.restore();}
 // Grazing: DELTARUNE's white outline round the SOUL.
 for(const e of game.effects)if(e.type==='graze'){ctx.save();ctx.globalAlpha=Math.min(1,e.life*6);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();const r=15;for(let k=0;k<6;k++){const an=k*Math.PI/3-Math.PI/2;k?ctx.lineTo(s.x+Math.cos(an)*r,s.y+Math.sin(an)*r):ctx.moveTo(s.x+Math.cos(an)*r,s.y+Math.sin(an)*r);}ctx.closePath();ctx.stroke();ctx.restore();}
}
// A spear for the green SOUL: in from its side; a trick (gold) one swings round the SOUL to the far side.
function drawArrow(b,s){
 const ang={up:-Math.PI/2,right:0,down:Math.PI/2,left:Math.PI}[b.side];let an=ang,dist=b.dist;
 if(b.flip!==undefined){const u=b.flip/.38;an=ang+Math.PI*u;dist=64;}
 const x=s.x+Math.cos(an)*dist,y=s.y+Math.sin(an)*dist;ctx.save();ctx.translate(x,y);ctx.rotate(an+Math.PI);ctx.fillStyle=b.trick&&!b.flipped?'#ffd040':'#ffffff';ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(-4,-6);ctx.lineTo(-2,0);ctx.lineTo(-4,6);ctx.closePath();ctx.fill();ctx.fillRect(-14,-1,12,2);ctx.restore();
}
// The Knight's star void (the finale): the box is gone; colours wash through behind turning stars.
function starVoid(){const t=game.clock,hue=(t*30)%360,g=ctx.createRadialGradient(320,166,10,320,166,360);g.addColorStop(0,`hsla(${hue},70%,55%,.55)`);g.addColorStop(.5,`hsla(${(hue+60)%360},60%,25%,.45)`);g.addColorStop(1,'rgba(0,0,0,.9)');ctx.fillStyle=g;ctx.fillRect(0,0,640,326);
 ctx.save();ctx.globalAlpha=.25;for(let i=0;i<26;i++){const an=i*2.4+t*(reduceMotion?0:.15),r=60+(i*37)%260;star6(320+Math.cos(an)*r,Math.min(316,166+Math.sin(an)*r*.7),9,'#ffffff');}ctx.restore();}
// The box's frame (one box, or two halves with the seam between them).
function boxFrame(a,border,line,fill=true){
 const draw=(x,y,w,h)=>{x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(fill){ctx.fillStyle='#000';ctx.fillRect(x,y,w,h);}ctx.fillStyle=border;ctx.fillRect(x,y,w,line);ctx.fillRect(x,y+h-line,w,line);ctx.fillRect(x,y,line,h);ctx.fillRect(x+w-line,y,line,h);};
 const G=game.split?game.splitGap:0;
 if(game.split==='h'&&G>1){const hh=(a.h-G)/2;draw(a.x,a.y,a.w,hh);draw(a.x,a.y+hh+G,a.w,hh);}else if(game.split&&G>1){const hw=(a.w-G)/2;draw(a.x,a.y,hw,a.h);draw(a.x+hw+G,a.y,hw,a.h);}else draw(a.x,a.y,a.w,a.h);
}
// Kinds that live inside the box (clipped to it); everything else crosses the whole field.
const INSIDE=['star','gift','zee','rb','tooth'];
function field(border='#fff'){
 const a=game.arena,dr=game.dr,H=dr?326:396,line=dr?3:4;
 if(game.mode==='green'&&!reduceMotion)art.anim('hammer',Math.floor(game.clock*5)%4,a.x+a.w+46,a.y+a.h/2,.5);
 const clipField=()=>{ctx.beginPath();ctx.rect(0,0,640,H);ctx.clip();};
 if(game.voidMode){starVoid();art.anim('vortex_ring',Math.floor(game.clock*6)%4,320,166,1,{alpha:.55});}
 else{
  // The box spins into its new shape in the Deltarune half, trailing fading copies of itself.
  const spin=dr&&!reduceMotion?clamp((game.boxSpin||0)/.45,0,1):0,cx=a.x+a.w/2,cy=a.y+a.h/2;
  if(spin>0){for(let k=3;k>=1;k--){const u=Math.min(1,spin+k*.12);ctx.save();ctx.globalAlpha=.22;ctx.translate(cx,cy);ctx.rotate(u*Math.PI*.75);ctx.scale(1-u*.5,1-u*.5);ctx.translate(-cx,-cy);boxFrame(a,border,2,false);ctx.restore();}
   ctx.save();ctx.translate(cx,cy);ctx.rotate(spin*Math.PI/2);ctx.scale(1-spin*.3,1-spin*.3);ctx.translate(-cx,-cy);boxFrame(a,border,line);ctx.restore();}
  else boxFrame(a,border,line);
 }
 // The cone of light falls over the box and under everything else.
 ctx.save();clipField();for(const b of game.bullets)if(b.kind==='cone')hazard(b);ctx.restore();
 // The box tints blue while the beams take aim, and a dark disc marks the point they cross.
 const aim=game.bullets.find(b=>b.kind==='laser'&&b.full&&b.age<b.warn);
 if(aim){ctx.save();ctx.beginPath();ctx.rect(a.x+line,a.y+line,a.w-line*2,a.h-line*2);ctx.clip();ctx.globalAlpha=.3;ctx.fillStyle='#1420c8';ctx.fillRect(a.x,a.y,a.w,a.h);ctx.globalAlpha=.55;ctx.fillStyle='#0a1090';ctx.beginPath();ctx.arc(aim.ox,aim.oy,22,0,6.283);ctx.fill();ctx.restore();}
 // Inside the box.
 ctx.save();ctx.beginPath();ctx.rect(a.x+line,a.y+line,a.w-line*2,a.h-line*2);ctx.clip();for(const b of game.bullets)if(INSIDE.includes(b.kind)||(b.kind==='shard'&&!b.out&&!b.big)||(b.kind==='star6'&&!b.big&&!game.voidMode&&b.hover===undefined)||(b.kind==='spike'&&!b.crystal))hazard(b);ctx.restore();
 // Across the whole field.
 ctx.save();clipField();for(const b of game.bullets){if(b.kind==='cone'||b.kind==='arrow'||INSIDE.includes(b.kind)||(b.kind==='shard'&&!b.out&&!b.big)||(b.kind==='star6'&&!b.big&&!game.voidMode&&b.hover===undefined)||(b.kind==='spike'&&!b.crystal))continue;hazard(b);}
 // The frame stays readable over whatever crosses it.
 if(!game.voidMode&&!(dr&&game.boxSpin>0&&!reduceMotion))boxFrame(a,border,line,false);
 if(game.mode==='green')for(const b of game.bullets)if(b.kind==='arrow')drawArrow(b,game.soul);
 drawSoul();ctx.restore();
 for(const e of game.effects){if(e.type==='gift'){ctx.save();ctx.globalAlpha=e.life*2;star4(e.x,e.y-(.5-e.life)*20,6,HEART.hope);ctx.restore();}if(e.type==='zee'){ctx.save();ctx.globalAlpha=e.life;text('z z',e.x,e.y-(.6-e.life)*30,1,'#c8f0ff',true);ctx.restore();}
  if(e.type==='block'){const s=game.soul,d={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]}[game.shield];ctx.save();ctx.globalAlpha=e.life*4;ctx.strokeStyle='#b8ffc0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x+d[0]*24,s.y+d[1]*24,8+(.25-e.life)*30,0,6.283);ctx.stroke();ctx.restore();}
  if(e.type==='puff'){ctx.save();ctx.globalAlpha=e.life*3;star4(e.x,e.y,5+(.25-e.life)*20,'#c8d4ff');ctx.restore();}}
}
function effectsFX(){for(const e of game.effects){
 if(e.type==='starflash'){const k=Math.min(3,Math.floor((.3-e.life)*13));if(e.big)art.anim('impact_star_large',k,e.x,e.y,.6);else art.anim('impact_star',k,e.x,e.y,.35);}
 else if(e.type==='rbhit'){const k=Math.min(3,Math.floor((.45-e.life)*9)),[w,h]=art.uiSize('rbhit_'+k);art.uiFlip('rbhit_'+k,Math.round(e.x-w/2),Math.round(e.y-h/2));}
 else if(e.type==='flash'&&!reduceMotion){ctx.save();ctx.globalAlpha=Math.min(1,e.life*2.4);ctx.fillStyle=e.color||'#fff';ctx.fillRect(0,0,640,480);ctx.restore();}
 else if(e.type==='vignette'){const g=ctx.createRadialGradient(320,240,170,320,240,420);g.addColorStop(0,`rgba(${e.color},0)`);g.addColorStop(1,`rgba(${e.color},${Math.min(.5,e.life*1.4)})`);ctx.fillStyle=g;ctx.fillRect(0,0,640,480);}
 else if(e.type==='damage')text(e.text,e.x,e.y-(1.1-e.life)*18,3,'#df6a9a',true);
 else if(e.type==='mercy'){const [x,y]=e.who==='knight'?[KNIGHT_X,62]:[SETH_X,SETH_Y-92];text(e.text,x,y-(1.2-e.life)*16,1.5,'#ffff00',true);}
 else if(['cheat','instruction'].includes(e.type))text(e.text,320,Math.max(8,Math.min(206,game.arena.y-22)),1.5,'#ffff00',true);
}}
// The Knight's animation, from the designer's sprite sheets: its phase idle, the move it is making, hurt,
// the roar that breaks the battle, its vanish at the end. Returns [family, frame].
const LOOP=8;// idle loops play at 8 frames a second; moves at 12
function knightAnim(){
 const b=game.boss,t=game.clock;
 if(game.state==='uibreak'&&game.breakTime<3.1)return['roar_transition',Math.floor(game.breakTime*7)];
 if(game.vanishAt!==null)return['teleport_vanish',Math.floor((t-game.vanishAt)*7)];
 if(b.hurt>0)return['hurt_stagger_kneel',Math.floor((.55-b.hurt)*10)];
 if(['defend','warning'].includes(game.state)&&b.pose&&b.pose!=='idle'&&art.frames(b.pose))return[b.pose,Math.min(art.frames(b.pose)-1,Math.floor((t-(b.poseStart||0))*12))];
 const fam=!game.dr&&game.state!=='uibreak'?'idle':game.unifiedCount>0||game.finaleDone||game.plan?.kind==='unified'||game.plan?.kind==='finale'?'phase3_guard':'phase2_idle';
 return[fam,Math.floor(t*LOOP)%8];
}
// In the Deltarune half the Knight is the designer's side-on set (facing left, toward Seth) at 2x; moves the side set
// doesn't have (the roar, the finale's ascent, its vanish) use the front sprites.
const SIDE_OF={phase3_guard:'phase3_idle',spin_multislash:'slash_diagonal',hurt_stagger_kneel:'hurt_stagger'};
// Where the two of them stand in the Deltarune half (the Roaring Knight's layout: party left, Knight right, both
// about the middle of the field).
const SETH_X=112,SETH_Y=214,KNIGHT_X=536,KNIGHT_Y=268;
function drawKnight(x,y,scale=1,alpha=1,sideOn=game.dr){
 const b=game.boss,[fam0,i]=knightAnim();if(fam0==='teleport_vanish'&&i>7)return;
 const bob=reduceMotion?0:Math.round(Math.sin(game.clock*1.8)*2),fam=sideOn?(SIDE_OF[fam0]||fam0):fam0,side=sideOn&&art.hasSide(fam);
 const g=ctx.createRadialGradient(x,y-70,6,x,y-70,130);g.addColorStop(0,`rgba(160,200,255,${.16+(reduceMotion?0:Math.sin(game.clock*2)*.04)})`);g.addColorStop(1,'rgba(160,200,255,0)');ctx.fillStyle=g;ctx.fillRect(x-150,y-220,300,260);
 // Side frames are anchored at the pack's origin (58 px above the feet at 2x); front frames at their feet.
 const draw=(dx,o)=>side?art.side(fam,i,x+dx,y+bob-58,2,o):art.anim(fam,i,x+dx,y+bob,scale,o);
 // The Roaring Knight's rainbow: coloured afterimages streaming off behind it (to the right), in the Deltarune half.
 if(sideOn&&!reduceMotion){const RAIN=['rgba(255,60,90,1)','rgba(255,170,40,1)','rgba(250,240,70,1)','rgba(70,230,110,1)','rgba(60,200,255,1)','rgba(150,90,255,1)'];
  const moving=['defend','warning'].includes(game.state)&&b.pose&&b.pose!=='idle'?clamp(1-(game.clock-(b.poseStart||0))/.35,0,1):0;
  for(let k=RAIN.length-1;k>=0;k--){const off=(k+1)*(4+moving*9)+Math.round(Math.sin(game.clock*5+k)*1.5);draw(off,{alpha:alpha*(.34-k*.035),tint:RAIN[(k+Math.floor(game.clock*6))%RAIN.length]});}}
 draw(0,{alpha,tint:b.hurt>.35&&!reduceMotion?'rgba(255,255,255,.8)':null});
 // Its slash, as it fires the beams (the designer's crescent).
 for(const e of game.effects)if(e.type==='kslash'&&e.life<.5&&sideOn)art.anim('crescent_slash',Math.min(3,Math.floor((.5-e.life)*10)),x-70,y-80,2,{alpha:Math.min(1,e.life*4)});
}
// Seth on the Deltarune side: his own animations from the designer's pack, with his glasses and notebook effects.
function drawSethDR(x,y,alpha=1){
 const sp=game.sethPose,t=game.clock,active=sp&&t<sp.until,fam=active?sp.name:game.ending==='spared'?'offer_hand_hug':'idle';
 const i=active||game.ending==='spared'?Math.min(7,Math.floor((t-(sp?.t||0))*8)):Math.floor(t*6);
 // Kneeling to DEFEND holds the low frames; the hug holds its last.
 const frame=fam==='kneel_stand'?Math.min(i,3):i;
 if(game.invulnerability>0&&game.state==='defend'&&game.recenter<=0&&Math.floor(t*15)%2&&!reduceMotion)alpha*=.5;
 // 1x: his pack is drawn at Deltarune party size already (about 68 px tall).
 art.sethAnim(fam,frame,x,y,1,{alpha,flip:true});
 if(active&&fam==='cast_glasses')art.sethFx('magic_glasses_formation',Math.floor((t-sp.t)*7),x+2,y-58,1,{alpha});
 if(active&&fam==='cast_notebook_page')art.sethFx('floating_pages',Math.floor((t-sp.t)*8),x+26,y-40,1,{alpha});
 if(game.defending)art.sethFx('glasses_shield',Math.min(7,Math.floor((t-(sp?.t||t))*8)),x+28,y-34,1,{alpha:alpha*.9});
}
function hearts3(x,y){['blade','wild','hope'].forEach((h,k)=>battleSoul(ctx,x+k*14,y,10,HEART[h]));}
function prose(str,n=Infinity,x=48,y=267,width=528,max=44,lines=5,lh=24,color='#fff',size=2){typedLines(wrap(str,max,width,size),str,n).slice(0,lines).forEach((line,i)=>text(line,x,y+i*lh,size,color));}

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
 drawKnight(320,226,1,1,false);speechUT();
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
  art.backdrop(Math.max(0,1-(t-1.6)/1.2));drawKnight(320+(reduceMotion?0:Math.round(Math.sin(t*40)*2)),226,1,1,false);
  const tau=t-1.6;for(const s of shards){const x=s.x+s.vx*tau,y=s.y+s.vy*tau+260*tau*tau;if(y>520)continue;ctx.save();ctx.translate(x+s.w/2,y+s.h/2);ctx.rotate(s.vr*tau);ctx.fillStyle=s.col;ctx.fillRect(-s.w/2,-s.h/2,s.w,s.h);ctx.restore();}
 }else renderDR({assemble:clamp((t-3.1)/1.4,0,1)});
 if(t>2.5&&t<3.5){ctx.save();ctx.globalAlpha=(reduceMotion?.35:1)*Math.max(0,1-Math.abs(t-3)/.5);ctx.fillStyle='#fff';ctx.fillRect(0,0,640,480);ctx.restore();}
 if(!reduceMotion&&t<2.6)game.shake=Math.max(game.shake,.05);
}

// ======================================================================= the Deltarune half
// DELTARUNE's battle UI, laid out as the game lays it out at native 640 x 480 (measured from the designer's reference
// videos; the icons, TP glyphs, labels and PRESS are cut from those frames, Seth's head icon is from his pack).
const DR_BTN=['FIGHT','ACT','ITEM','SPARE','DEFEND'],DR_ICON=['fight','act','item','spare','defend'];
const DR_DARKRED='#800000',TP_RED='#7b0000',TP_ORANGE='#fd9f3d',MERCY_BG='#f95023',HP_GREEN='#00ff00';
// The command row inside Seth's open panel.
function drButtons(){return DR_BTN.map((label,i)=>({x:230+i*35,y:333,w:34,h:27,label,index:i}));}
// ACT / ITEM lists: two columns, as DELTARUNE's.
function drListRects(n){return Array.from({length:n},(_,i)=>({x:30+(i%2)*230,y:374+Math.floor(i/2)*34,w:220,h:32}));}
function bar(x,y,w,h,frac,col,bg=DR_DARKRED){ctx.fillStyle=bg;ctx.fillRect(x,y,w,h);ctx.fillStyle=col;ctx.fillRect(x,y,Math.round(w*clamp(frac,0,1)),h);}
function speechDR(){
 if(game.state!=='dialogue'||game.speaker!=='boss')return;
 const lines=wrap(game.text,20,190,1.5),h=Math.max(52,20+lines.length*18),x=226,y=34;
 ctx.fillStyle='#fff';ctx.fillRect(x,y,220,h);ctx.beginPath();ctx.moveTo(x+220,y+20);ctx.lineTo(x+240,y+28);ctx.lineTo(x+220,y+36);ctx.fill();
 if(game.heart==='all')hearts3(x+12,y+12);else battleSoul(ctx,x+12,y+12,10,HEART[game.heart]);
 typedLines(lines,game.text,shown()).forEach((l,i)=>text(l,x+12,y+20+i*18,1.5,'#000'));
 if(game.displayChars>=game.text.length)text('Z',x+206,y+h-14,1,'#888');
}
// The TP bar: DELTARUNE's T P glyphs and slanted bar (dark red, filling orange from the bottom, a white line on top).
function tpBar(dx){
 const x=39+dx,y=47,[w,h]=art.uiSize('tp_shape'),p=clamp(game.tp/100,0,1),full=game.tp>=100;
 art.ui('tp_letters',8+dx,77);
 if(full)['M','A','X'].forEach((c,i)=>text(c,22+dx,112+i*16,1.5,'#ffff00',true));else{text(String(Math.floor(game.tp)),22+dx,114,2,'#fff',true);text('%',22+dx,136,1.5,'#fff',true);}
 art.ui('tp_shape',x,y,{tint:TP_RED});
 const fill=Math.round(h*p);if(fill>0){ctx.save();ctx.beginPath();ctx.rect(x,y+h-fill,w,fill);ctx.clip();art.ui('tp_shape',x,y,{tint:full?'#ffd040':TP_ORANGE});ctx.restore();if(!full){ctx.save();ctx.beginPath();ctx.rect(x,y+h-fill,w,2);ctx.clip();art.ui('tp_shape',x,y,{tint:'#ffffff'});ctx.restore();}}
}
// Seth's party row. Collapsed (between the two grey lines) while the Knight acts; on his turn it rises 32 px into his
// purple-bordered panel with the five command icons.
function partyPanel(oy){
 const open=['menu','drtarget','act','item'].includes(game.state)&&oy===0,up=open?32:0,y0=oy;
 ctx.fillStyle='#000';ctx.fillRect(0,325+y0,640,40);ctx.fillStyle='#222';ctx.fillRect(0,325+y0,640,2);ctx.fillStyle='#262626';ctx.fillRect(0,362+y0,640,2);
 if(open){ctx.fillStyle='#000';ctx.fillRect(214,293,212,73);ctx.fillStyle=SETHC;ctx.fillRect(214,293,212,2);ctx.fillRect(214,293,2,73);ctx.fillRect(424,293,2,73);ctx.fillRect(214,327,212,2);ctx.fillRect(220,329,2,37);ctx.fillRect(418,329,2,37);}
 const y=y0-up,head=game.hp<game.maxHP*.3||game.sethPose?.name==='shock_frustration'&&game.clock<game.sethPose.until?'seth_head2':game.sethMercy>=100?'seth_head1':'seth_head0';
 art.ui(head,228,331+y);text('SETH',264,337+y,2,'#fff');art.ui('hp_small',322,346+y);
 const nums=`${game.hp}/ ${game.maxHP}`;text(nums,416-text.measure(nums,1.25),333+y,1.25,'#fff');
 bar(342,347+y,74,9,game.hp/game.maxHP,SETHC);
 // The Knight's mercy toward Seth (it is sparing him too), beside his row.
 art.ui('label_mercy',442,336+y,{alpha:.95});bar(442,348+y,72,8,game.sethMercy/100,'#ffff00',MERCY_BG);text(game.sethMercy+'%',520,345+y,1,'#ffff00');
 if(open)drButtons().forEach((r,i)=>art.ui('icon_'+DR_ICON[i]+(game.selected===i?'_sel':''),r.x,r.y));
 // While a target or an ACT is being picked the chosen command stays lit, as in the game.
}
// The text area under the panel: narration, the enemy select row, ACT / ITEM lists, the PRESS bar.
function drTextBox(){
 const st=game.state;
 if(st==='drtarget'){heart(66,391,16,'purple');text('White Roaring Knight',80,378,3,game.ready?'#ffff00':'#fff');
  art.ui('label_hp',424,368);art.ui('label_mercy',524,368);
  bar(420,380,80,16,game.enemyHP/game.enemyMax,HP_GREEN);text(Math.round(100*game.enemyHP/game.enemyMax)+'%',423,383,1.25,'#004000');
  bar(520,380,80,16,game.knightMercy/100,'#ffff00',MERCY_BG);text(game.knightMercy+'%',523,383,1.25,'#5a1000');return;}
 if(st==='act'||st==='item'){const opts=game.options();drListRects(opts.length).forEach((r,i)=>{const label=opts[i],sel=game.option===i,spell=label==='PERSEVERE';if(sel)heart(r.x-14,r.y+14,16,'purple');text(label,r.x,r.y+2,3,spell&&game.tp<TP_COST?'#808080':'#fff');});
  const cur=opts[game.option];if(cur==='PERSEVERE'){text('Heal,',500,376,3,'#808080');text('brace',500,406,3,'#808080');text(TP_COST+'% TP',500,438,3,TP_ORANGE);}
  else if(st==='item'){const item=game.items.filter(i=>i.count)[game.option];if(item)text('+'+item.heal+' HP',500,376,3,'#808080');}return;}
 if(st==='drfight'){
  // Seth's head, PRESS, his box with the target at its left edge, and the cursor sliding in from the right.
  art.ui('seth_head0',8,368);art.ui('press',46,370);ctx.fillStyle=SETHC;ctx.fillRect(80,365,124,2);ctx.fillRect(80,400,124,2);ctx.fillRect(80,365,2,37);ctx.fillRect(202,365,2,37);
  ctx.strokeStyle='#d8a8ff';ctx.lineWidth=2;ctx.strokeRect(83,367,9,33);ctx.fillStyle='#0000a8';ctx.fillRect(80,403,224,2);ctx.fillRect(80,441,224,2);
  const cx=86+(clamp(game.drCursor,-.1,1)-.14)*260;if(cx<310){ctx.fillStyle='#fff';ctx.fillRect(Math.round(cx)-2,367,5,33);}return;}
 if(st==='dialogue'&&game.speaker==='boss'){if(game.displayChars>=game.text.length)text('Z',604,456,1,'#777');return;}
 if(st==='spared')return;
 // The Knight's turn: what each heart is doing, dimmed while its bullets fly.
 // One heart at a time: the line for whichever heart is acting now (each holds the stage for 4.6 s).
 const turnLine=()=>{const L=game.attackName.split('\n');return game.plan?.kind==='triple'?L[Math.min(L.length-1,Math.floor(game.attackTime/4.6))]:L[0];};
 if(st==='defend'){prose(turnLine(),Infinity,26,374,600,40,3,34,'#777',3);return;}
 const str=st==='warning'?turnLine():game.text;prose(str,st==='dialogue'?shown():Infinity,26,374,600,40,3,34,game.speaker==='seth'?'#d9a6ff':'#fff',3);
 if(st==='dialogue'&&game.displayChars>=game.text.length)text('Z',604,456,1,'#777');
}
// The Deltarune half's backdrop, after the Roaring Knight's: black, a great dark mouth overhead whose rim changes
// colour every turn (bright on Seth's turn, nearly gone while the Knight attacks), and violet haze low on the right.
const ARCH=[[200,40,60],[150,60,210],[210,200,40],[40,190,70],[40,150,210],[210,40,160],[220,120,30],[60,70,220]];
let archGlow=1;
function drBackdrop(t,k){
 ctx.save();ctx.globalAlpha=k;ctx.fillStyle='#000';ctx.fillRect(0,0,640,326);
 const busy=['defend','warning'].includes(game.state);archGlow+=((busy?.16:1)-archGlow)*.06;
 const [r,g,b]=ARCH[(game.turn+ARCH.length)%ARCH.length],col=(m)=>`rgb(${Math.round(r*m)},${Math.round(g*m)},${Math.round(b*m)})`;
 ctx.save();ctx.globalAlpha=k*archGlow;ctx.beginPath();ctx.rect(166,0,290,90);ctx.clip();
 // The rim, then the dark of the throat, then the teeth along its upper lip.
 ctx.fillStyle=col(.9);ctx.beginPath();ctx.ellipse(311,34,150,120,0,0,6.283);ctx.fill();
 ctx.fillStyle=col(.62);ctx.beginPath();ctx.ellipse(311,34,132,108,0,0,6.283);ctx.fill();
 ctx.fillStyle=col(.2);ctx.beginPath();ctx.ellipse(311,36,112,96,0,0,6.283);ctx.fill();
 ctx.fillStyle=col(.34);for(let i=0;i<13;i++){const x=214+i*15,w=9+((i*5)%4)*2,h=10+((i*7)%5)*5+(i%3===0?8:0);ctx.fillRect(x,6,w,h);ctx.fillRect(x+2,6+h,w-5,4);}
 ctx.restore();
 const f=ctx.createRadialGradient(540,300,10,540,300,250);f.addColorStop(0,'rgba(110,30,150,.42)');f.addColorStop(1,'rgba(40,0,60,0)');ctx.fillStyle=f;ctx.fillRect(250,150,390,176);
 if(!reduceMotion){ctx.globalAlpha=k*.14;ctx.fillStyle='#b070e0';for(let i=0;i<12;i++){const x=((i*83+t*12)%440)+220,y=262+((i*29)%58);ctx.fillRect(Math.round(x),Math.round(y),22,3);}}
 ctx.restore();
}
function renderDR({assemble=1}={}){
 const k=ease(assemble),defending=['defend','warning'].includes(game.state),t=game.clock;
 drBackdrop(t,k);
 // Seth stands on the left like a party member; the Knight faces him from the right. In the finale the Knight rises
 // to the middle of the void and the stars pour out of it.
 const fin=game.plan?.kind==='finale'&&defending,v=fin?ease(Math.min(game.attackTime/1.1,(game.duration-game.attackTime)/1.1)):0;
 const kx=Math.round(320+(KNIGHT_X-320)*k*(1-v)),ky=Math.round(226+(KNIGHT_Y-226)*k+(236-KNIGHT_Y)*v);
 const knight=()=>{if(game.vanishAt===null||t-game.vanishAt<1.2)drawKnight(kx,ky,1,1,!(fin&&v>.5));};
 if(!fin){drawSethDR(Math.round(SETH_X-(1-k)*190),SETH_Y,k);knight();}
 tpBar(-(1-k)*80);
 if(defending)field(DR_BORDER);
 if(fin){drawSethDR(SETH_X,SETH_Y,1);knight();ctx.save();ctx.beginPath();ctx.rect(0,0,640,326);ctx.clip();for(const b of game.bullets)hazard(b);drawSoul();ctx.restore();}
 partyPanel(Math.round((1-k)*170));
 if(k>=1){drTextBox();speechDR();}
 effectsFX();
 if(game.state==='defend'){ctx.fillStyle='#1a2440';ctx.fillRect(0,323,640,2);ctx.fillStyle=DR_BORDER;ctx.fillRect(0,323,Math.round(640*Math.max(0,1-game.attackTime/game.duration)),2);}
}

// ======================================================================= frame
// The end: the crystal room again, quiet, the crystal holding three small lights; then the card.
function renderEnding(){
 const w=game.world,t=game.clock,u=clamp(game.timer/1.4,0,1);
 art.room('cavern',0);art.gems(t,0,640,5);for(const o of w.data.objects)if(o.id.startsWith('echo'))art.echoFlower(o.x,o.y,t,.5+.3*Math.sin(t*1.3+o.x));
 art.crystal(320,346,t,.35);['blade','wild','hope'].forEach((h,k)=>{const an=k*Math.PI*2/3+t*(reduceMotion?0:.7);battleSoul(ctx,320+Math.cos(an)*12,250+Math.sin(an)*18,10,HEART[h]);});
 art.sethFrame('up',false,0,320,384);
 ctx.fillStyle=`rgba(0,0,0,${.45*u})`;ctx.fillRect(0,0,640,480);
 if(u<1){ctx.fillStyle=`rgba(255,255,255,${1-u})`;ctx.fillRect(0,0,640,480);}
 ctx.save();ctx.globalAlpha=u;text('A NEW WORLD',320,70,3,'#ffff00',true);text('TOGETHER.',320,112,2,'#fff',true);hearts3(299,146);ctx.restore();
 if(game.timer>1.6)text('Z · PLAY AGAIN',320,446,1.5,'#aaa',true);
}
function renderBattle(){
 game.locationFX?.draw();
 if(game.state==='encounter'){const t=game.encounter,f=game.encFrom||{x:320,y:300};if(t<.45){game.scene='world';const st=game.state;game.state='frozen';renderWorld();game.state=st;game.scene='battle';const bob=reduceMotion?0:Math.round(Math.sin(t*30)*2);box(f.x-12,f.y-70+bob,24,28,'#fff',2);text('!',f.x,f.y-68+bob,2,'#fff',true);return;}ctx.fillStyle='#000';ctx.fillRect(0,0,640,480);if(t<.9){if(Math.floor((t-.45)*13)%2===0||reduceMotion)heart(f.x,f.y,16,'purple');}else{const kk=Math.min(1,(t-.9)/.55),e=kk*kk*(3-2*kk);heart(f.x+(320-f.x)*e,f.y+(300-f.y)*e,16,'purple');}return;}
 if(game.state==='uibreak'){renderBreak();return;}shards=null;
 if(game.state==='spared'){renderEnding();return;}
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
 const next=[game.scene,game.state,game.ui,game.paused,game.items.map(i=>i.count).join(','),game.ready,game.state==='dead'&&game.deathAge>=1.8,game.timer>1.6].join('/');if(signature===next)return;signature=next;const overlay=$('targets');overlay.replaceChildren();
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
