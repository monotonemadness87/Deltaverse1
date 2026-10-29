
const {installNotebook}=require("notebook.js");
const {NotebookVisual}=require("notebook-visual.js");
const {battleButtons,drawBattleButton}=require("battle-ui.js");
const {SoulBreak}=require("soul-break.js");
const {SoulVisual}=require("soul-visual.js");
const {BattleEngine,clamp,heartPoints}=require("engine.js");
const {pixelText}=require("font.js");
const {StageAudio}=require("audio.js");
const {KonamiCode}=require("konami.js");
const {MarigoldArt}=require("marigold-art.js");
const {AquaArt}=require("aqua-art.js");
const {FloweyArt}=require("flowey-art.js");
await document.fonts.load('24px "Determination"');
const $=id=>document.getElementById(id),canvas=$('battle'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
const game=new BattleEngine(),text=pixelText(ctx),audio=new StageAudio(),art=new MarigoldArt(ctx),aqua=new AquaArt(ctx),flowey=new FloweyArt(),keys={},touchKeys={};
let touch=null,drag=null,last=performance.now(),signature='',accumulator=0,reduceMotion=false,textSound=0,resumeAfterOptions=false;
const soul=new Image();soul.src="__SOUL_PNG__";const soulVisual=new SoulVisual(ctx,soul);
const konami=new KonamiCode(()=>{game.settings.invincible=!game.settings.invincible;game.effects.push({type:'cheat',life:2,text:game.settings.invincible?'INVINCIBILITY ON':'INVINCIBILITY OFF'});audio.effect('heal');syncUI();});
// Aqua's portraits, as numbered in her own fight's atlas.
const AQUA_FACE=[0,1,2,3,4,5,6,7,8,9,10,11];
function box(x,y,w,h,color='#fff',line=4){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));ctx.fillStyle='#000';ctx.fillRect(Math.round(x+line),Math.round(y+line),Math.round(w-line*2),Math.round(h-line*2));}
function heart(x,y,size=16,color='purple',alpha=1,angle=0){soulVisual.draw(x,y,size,color,alpha,angle);}
const soulBreak=new SoulBreak(ctx,(x,y,size,alpha)=>heart(x,y,size,'purple',alpha,0));
function optionRect(i,n){return n>2?{x:40+(i%2)*288,y:270+Math.floor(i/2)*43,w:274,h:38}:{x:40,y:270+i*43,w:550,h:38};}
function wrap(str,max=44,width=528,size=2){const lines=[];for(const line of String(str).split('\n')){let current='';for(const word of line.split(' ')){const next=(current+' '+word).trim();if(current&&(next.length>max||text.measure(next,size)>width)){lines.push(current);current=word;}else current=next;}lines.push(current);}return lines;}
// Typewriter text: the whole text is laid out first, then only its first n characters are drawn, so words never jump lines.
function typedLines(lines,str,n){if(!(n<str.length))return lines;let at=0;return lines.map(l=>{const lead=l.length-l.trimStart().length;let seen=false;const words=l.slice(lead).split(' ').map(w=>{const s=str.indexOf(w,at);if(s<0)return w;at=s+w.length;if(s<n)seen=true;return w.slice(0,Math.max(0,n-s));});return seen?l.slice(0,lead)+words.join(' ').trimEnd():'';});}
const shown=()=>game.state==='dialogue'?Math.floor(game.displayChars):Infinity;

// ======================================================================= the walk
function renderWorld(){
 const w=game.world,cam=w.camera(),t=game.clock,gen=game.genocide;
 art.room(w.room,cam,t,gen,[0,1,2,3,4,5].map(i=>!!w.flags['read'+i]));
 const actors=[{y:w.seth.y,draw:()=>art.sethFrame(w.seth.dir,w.seth.moving,w.seth.step,w.seth.x-cam,w.seth.y)}];
 if(w.marigold){const m=w.marigold;actors.push({y:m.y,draw:()=>{const name=m.facing==='back'?'back':'idle'+(Math.floor(t*3)%4);art.frame(name,m.x-cam,m.y+(m.kneel?8:0),1,{clipBottom:m.kneel?10:0});}});}
 if(w.flowey){const f=w.flowey;actors.push({y:f.y,draw:()=>drawFlowey(f,f.x-cam)});}
 if(w.thornWall)actors.push({y:340,draw:()=>thornWall(w.thornWall,w.thornWall.x-cam)});
 if(w.room==='ledge')actors.push({y:348,draw:()=>saveStar(560-cam,346)});
 actors.sort((a,b)=>a.y-b.y).forEach(a=>a.draw());
 art.foreground(w.room,cam);
 if(game.state==='world'&&!w.fadeTo){const o=w.nearest();if(o){const bob=reduceMotion?0:Math.round(Math.sin(t*5)*2);text('Z',o.x-cam,o.y-118+bob,1,'#ffff00',true);}}
 if(w.title>0){ctx.save();ctx.globalAlpha=Math.min(1,w.title);text(require("story.js").ROOMS[w.room],320,452,1.5,'#fff',true);ctx.restore();}
 if(game.state==='dialogue')worldDialogue(w);
 if(w.fadeTo){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,w.fade<.32?w.fade/.32:1-(w.fade-.32)/.32)})`;ctx.fillRect(0,0,640,480);}
}
// Flowey, in his canon battle frames. Sprouting: a hole opens in the snow, he peeks out squashed, springs up past
// full height and settles. Sinking runs it backwards. While he talks his mouth moves with the text.
function drawFlowey(f,x){
 const t=f.phase==='sink'?Math.max(0,.9-f.t*1.3):f.t,y=f.y;let sx=1,sy=1;
 const hole=f.phase==='sink'?Math.max(0,1-f.t/.7):Math.min(1,t/.18),r=Math.round(26*hole);
 if(r>0){ctx.fillStyle='#1b2338';ctx.fillRect(Math.round(x-r),Math.round(y-3),r*2,5);ctx.fillStyle='#8e9bb8';ctx.fillRect(Math.round(x-r-2),Math.round(y-4),r*2+4,1);}
 if(!reduceMotion){if(t<.18)return;if(t<.42){const u=(t-.18)/.24;sy=.22+.38*u;sx=1.35-.15*u;}else if(t<.62){const u=(t-.42)/.2;sy=.6+.65*Math.sin(u*Math.PI/2);sx=1.2-.35*u;}else if(t<.9){const u=(t-.62)/.28;sy=1.25-.25*u;sx=.85+.15*u;}}
 else if(t<.3)return;
 const talking=game.state==='dialogue'&&game.speaker==='flowey',face=talking?game.face:0,frame=flowey.frame(face,talking&&game.displayChars<game.text.length&&Math.floor(game.clock*11)%2===1);
 if(!flowey.ready())return;const c=56,k=2,[fx,fy]=flowey.cell(frame),w=Math.round(c*k*sx),h=Math.round(c*k*sy),sway=t>=.9&&!reduceMotion&&!talking?Math.round(Math.sin(game.clock*2.2)*2):0;
 ctx.save();ctx.beginPath();ctx.rect(x-c*k,y-c*k*2,c*k*2,c*k*2);ctx.clip();ctx.imageSmoothingEnabled=false;ctx.drawImage(flowey.atlas,fx,fy,c,c,Math.round(x-w/2)+sway,Math.round(y-h),w,h);ctx.restore();
}
// The hunt's thorn wall across the ledge behind Seth, bursting up in a ripple.
function thornWall(tw,x){for(let k=0;k<7;k++){const u=Math.max(0,Math.min(1,(tw.t-k*.05)/.18));if(!u)continue;art.thornSpike(x+(k%2)*10-5,330+k*12,Math.round((26+(k%3)*10)*u));}}
// UNDERTALE's SAVE point: a small twinkling star.
function saveStar(x,y){const p=reduceMotion?0:Math.floor(game.clock*5)%3,c=p===1?'#fff7a8':'#ffe23a';ctx.fillStyle=c;ctx.fillRect(x-2,y-10,4,20);ctx.fillRect(x-10,y-2,20,4);ctx.fillRect(x-5,y-5,10,10);ctx.fillStyle='#fff';ctx.fillRect(x-1,y-6,2,2);if(p===2){ctx.fillStyle='#fff7a8';ctx.fillRect(x+9,y-11,2,2);ctx.fillRect(x-12,y+8,2,2);}}
function worldDialogue(w){
 const top=w.seth.y>250,y=top?16:318;box(32,y,576,146,'#fff',6);
 let tx=56,width=520,max=40;const sp=game.speaker;
 if(sp==='boss'){art.portrait(game.face,52,y+22,104);tx=176;width=410;max=30;}
 else if(sp==='flowey'){flowey.speaker(ctx,game.face,game.displayChars<game.text.length,game.clock,104,y+130,2);tx=176;width=410;max=30;}
 else if(sp==='aqua'){aqua.face(AQUA_FACE[game.face]??0,104,y+73,104);tx=176;width=410;max=30;}
 typedLines(wrap(game.text,max,width),game.text,shown()).slice(0,4).forEach((l,i)=>text(l,tx,y+20+i*30,2,'#fff'));
 if(game.displayChars>=game.text.length)text('Z',590,y+118,1,'#777');
}

// ======================================================================= the battle
function bossPose(){
 const b=game.boss,t=game.clock;
 if(game.state==='killed'||game.ending==='killed'&&b.dying!==undefined)return 'defeat'+Math.min(3,Math.floor((b.dying||0)/.7));
 if(game.state==='spared'||game.ending==='spared')return 'prepare';
 if(b.hurt>0)return b.hurt>.28?'hurt0':'hurt1';
 if(game.state==='dialogue'&&game.speaker==='boss')return game.displayChars<game.text.length?'talk'+(Math.floor(t*8)%4):'talk0';
 if(['defend','warning'].includes(game.state)&&b.pose&&b.pose!=='idle'&&art.has(b.pose))return b.pose;
 return 'idle'+(Math.floor(t*3)%4);
}
function drawBoss(){
 const b=game.boss,pose=bossPose(),bob=reduceMotion||pose.startsWith('defeat')?0:Math.round(Math.sin(game.clock*2.2)*1.5);
 const angerTint=game.anger>0&&game.genocide?`rgba(255,40,60,${Math.min(.28,game.anger*.045)})`:null;
 const alpha=b.alpha;// She leaves no dust: the copper stays where it fell.
 art.frame(pose,b.x,b.y+bob,2,{alpha,tint:b.hurt>.4&&!reduceMotion?'rgba(255,255,255,.75)':angerTint});
 if(game.anger>0&&!pose.startsWith('defeat'))for(let i=0;i<Math.min(6,game.anger);i++){const x=b.x-30+i*12;art.thornSpike(x,b.y-150+Math.abs(i-2.5)*3,8+i%2*4);}
}
function speech(){
 if(game.state!=='dialogue'||game.speaker!=='boss')return;
 box(384,30,244,176,'#fff',3);ctx.fillStyle='#fff';ctx.fillRect(372,96,13,3);ctx.fillRect(375,99,10,3);ctx.fillRect(378,102,7,3);
 art.portrait(game.face,394,40,58);
 typedLines(wrap(game.text,16,162,1.5),game.text,shown()).slice(0,8).forEach((l,i)=>text(l,460,40+i*19,1.5,'#fff'));
 if(game.displayChars>=game.text.length)text('Z',612,186,1,'#777');
}
const RED='#c8143a',RED_HI='#ff5a70',RED_DK='#4a0010',GOLD='#f2c93a';
function flower(x,y,r=5,col=GOLD){ctx.fillStyle=col;for(let k=0;k<5;k++){const a=k*Math.PI*2/5-Math.PI/2;ctx.fillRect(Math.round(x+Math.cos(a)*r*.7-r*.45),Math.round(y+Math.sin(a)*r*.7-r*.45),Math.ceil(r*.9),Math.ceil(r*.9));}ctx.fillStyle='#c4452f';ctx.fillRect(Math.round(x-1),Math.round(y-1),2,2);}
function spikePath(b,len){const px=-b.dy,py=b.dx,hw=b.w/2;ctx.beginPath();ctx.moveTo(b.x+px*hw,b.y+py*hw);ctx.lineTo(b.x+b.dx*len,b.y+b.dy*len);ctx.lineTo(b.x-px*hw,b.y-py*hw);ctx.closePath();}
function hazard(b,warnOnly=false){
 if(b.delay&&b.age<b.delay)return;
 if(b.kind==='thorn'){
  if(b.age<b.warn){const flick=reduceMotion?1:.55+.45*Math.sin(b.age*30);ctx.save();ctx.globalAlpha=.35+.4*flick;ctx.strokeStyle=RED_HI;ctx.lineWidth=1;ctx.setLineDash([4,3]);spikePath(b,b.len);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=RED;const px=-b.dy,py=b.dx;ctx.fillRect(Math.round(b.x-px*b.w/2-Math.abs(b.dx)*2),Math.round(b.y-py*b.w/2-Math.abs(b.dy)*2),Math.round(Math.abs(px)*b.w+4*Math.abs(b.dx)+1),Math.round(Math.abs(py)*b.w+4*Math.abs(b.dy)+1));ctx.restore();return;}
  if(warnOnly)return;if(b.fizzle){ctx.save();ctx.globalAlpha=Math.max(0,1-(b.age-b.warn)*3);ctx.fillStyle='#555';spikePath(b,6);ctx.fill();ctx.restore();return;}
  if(b.cur<1)return;ctx.save();ctx.fillStyle=RED;spikePath(b,b.cur);ctx.fill();ctx.strokeStyle=RED_DK;ctx.lineWidth=1;ctx.stroke();ctx.strokeStyle=RED_HI;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x+b.dx*2,b.y+b.dy*2);ctx.lineTo(b.x+b.dx*b.cur*.8,b.y+b.dy*b.cur*.8);ctx.stroke();ctx.restore();return;
 }
 if(b.kind==='lance'){
  const cx=Math.cos(b.angle),cy=Math.sin(b.angle);
  if(b.age<b.warn){ctx.save();ctx.strokeStyle=RED_HI;ctx.globalAlpha=.6;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+cx*900,b.y+cy*900);ctx.stroke();ctx.restore();if(warnOnly)return;}
  else if(warnOnly)return;
  const tx=b.x+cx*b.tip,ty=b.y+cy*b.tip;ctx.save();ctx.translate(tx,ty);ctx.rotate(b.angle);ctx.fillStyle=RED;ctx.fillRect(-b.len,-b.w/2+2,b.len-14,b.w-4);ctx.fillStyle=RED_HI;ctx.fillRect(-b.len,-1,b.len-14,2);
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-16,-b.w/2-1);ctx.lineTo(-16,b.w/2+1);ctx.closePath();ctx.fill();ctx.fillStyle=RED_DK;for(let k=30;k<b.len;k+=28){ctx.beginPath();ctx.moveTo(-k,-b.w/2+2);ctx.lineTo(-k-6,-b.w/2-5);ctx.lineTo(-k-8,-b.w/2+2);ctx.fill();}
  ctx.restore();for(let k=50;k<b.len;k+=64)flower(tx-cx*k,ty-cy*k,4);return;
 }
 if(b.kind==='arc'){
  if(b.age<b.warn){ctx.save();ctx.globalAlpha=.32+(reduceMotion?0:.12*Math.sin(b.age*24));ctx.fillStyle='#7a1028';ctx.beginPath();ctx.arc(b.x,b.y,b.r1,Math.min(b.a0,b.a1),Math.max(b.a0,b.a1));ctx.arc(b.x,b.y,b.r0,Math.max(b.a0,b.a1),Math.min(b.a0,b.a1),true);ctx.closePath();ctx.fill();ctx.restore();return;}
  if(warnOnly)return;ctx.save();for(let k=3;k>=0;k--){const ang=b.cur-(b.a1>b.a0?1:-1)*k*.07;ctx.globalAlpha=k?.18:1;ctx.strokeStyle=k?RED_HI:RED;ctx.lineWidth=k?6:9;ctx.beginPath();ctx.moveTo(b.x+Math.cos(ang)*b.r0,b.y+Math.sin(ang)*b.r0);ctx.lineTo(b.x+Math.cos(ang)*b.r1,b.y+Math.sin(ang)*b.r1);ctx.stroke();}ctx.restore();
  for(let r=b.r0+20;r<b.r1;r+=46)flower(b.x+Math.cos(b.cur)*r,b.y+Math.sin(b.cur)*r,4);return;
 }
 if(warnOnly){if(b.kind==='ring'&&b.age<b.warn||b.kind==='heart'&&b.age<b.warn||b.kind==='bud'&&b.vy===0)hazard(b,false);return;}
 if(b.kind==='bud'){if(b.vy===0){const g=Math.min(1,b.age/b.fuse);ctx.save();ctx.globalAlpha=.25+.35*g;ctx.strokeStyle='#d7e86a';ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(b.x,b.y,b.R*.82,0,Math.PI*2);ctx.stroke();ctx.restore();ctx.fillStyle='#3a6b3a';ctx.fillRect(Math.round(b.x-1),Math.round(b.y),2,6);flower(b.x,b.y,2+4*g,g>.7?GOLD:'#7fae4a');}else flower(b.x,b.y,6);return;}
 if(b.kind==='pollen'){ctx.save();ctx.globalAlpha=.32*Math.min(1,(b.life-b.age)/.4);ctx.fillStyle='#d9e86a';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.globalAlpha*=1.8;ctx.fillStyle='#f6f2a0';for(let k=0;k<9;k++){const a=k*2.4+b.age*1.5,r=b.r*((k*37)%10)/11;ctx.fillRect(Math.round(b.x+Math.cos(a)*r),Math.round(b.y+Math.sin(a)*r),2,2);}ctx.restore();return;}
 if(b.kind==='petal'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);ctx.fillStyle=RED;ctx.beginPath();ctx.ellipse(0,0,6,3.5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=RED_HI;ctx.fillRect(-3,-1,4,1);ctx.restore();return;}
 if(b.kind==='star'){art.frame('fx_star',b.x,b.y,1,{anchor:'center'});return;}
 if(b.kind==='orbit'){flower(b.x,b.y,7);return;}
 if(b.kind==='ghost'){drawGhost(b);return;}
 if(b.kind==='ring'){ctx.save();const warn=b.age<b.warn;ctx.strokeStyle='#ffe24a';ctx.globalAlpha=warn?.45:1;ctx.lineWidth=warn?1:4;if(warn)ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(b.x,b.y,b.r,b.gap+b.gapW/2,b.gap-b.gapW/2+Math.PI*2);ctx.stroke();ctx.restore();return;}
 if(b.kind==='heart'){const warn=b.age<b.warn;for(const p of heartPoints(b)){if(warn){ctx.save();ctx.globalAlpha=.5;ctx.fillStyle=RED_HI;ctx.fillRect(Math.round(p.x-2),Math.round(p.y-2),4,4);ctx.restore();}else art.frame('fx_star',p.x,p.y,1,{anchor:'center'});}return;}
}
function drawGhost(b){
 const x=Math.round(b.x),y=Math.round(b.y),dir=b.vx>0?1:-1;ctx.save();ctx.globalAlpha=.88;
 ctx.fillStyle='#cfd8ff';ctx.fillRect(x-9,y-12,18,26);ctx.fillRect(x-7,y-20,14,10);ctx.fillRect(x-9,y+14,4,5);ctx.fillRect(x-2,y+14,4,5);ctx.fillRect(x+5,y+14,4,5);
 ctx.fillStyle='#8f9ad0';ctx.fillRect(x-7,y-17,14,3);ctx.fillRect(x-9,y-2,18,3);ctx.fillStyle='#1b1f33';ctx.fillRect(x-4+dir*2,y-15,8,2);ctx.fillStyle='#c4452f';ctx.fillRect(x-1,y-25,3,6);
 if(b.spear){ctx.fillStyle='#e8ecff';ctx.fillRect(dir>0?x:x-34,y+1,34,2);ctx.beginPath();ctx.moveTo(x+dir*40,y+2);ctx.lineTo(x+dir*32,y-2);ctx.lineTo(x+dir*32,y+6);ctx.fill();}
 ctx.restore();
}
function field(){
 const a=game.arena;box(a.x,a.y,a.w,a.h);
  ctx.save();ctx.beginPath();ctx.rect(a.x+4,a.y+4,a.w-8,a.h-8);ctx.clip();
 for(const b of game.bullets)if(b.kind==='pollen')hazard(b);
 for(const b of game.bullets)if(b.kind==='arc'&&b.age<b.warn)hazard(b);
 for(const b of game.bullets)if(!['pollen','lance','arc','ghost'].includes(b.kind))hazard(b);
 for(const b of game.bullets)if(b.kind==='ghost')hazard(b);
 if(game.invulnerability<=0||Math.floor(game.clock*15)%2===0)heart(game.soul.x,game.soul.y,16,game.poison>0?'green':'purple');
 if(game.dark){const g=ctx.createRadialGradient(game.soul.x,game.soul.y,game.dark*.6,game.soul.x,game.soul.y,game.dark);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.96)');ctx.fillStyle=g;ctx.fillRect(0,0,640,480);for(const b of game.bullets)hazard(b,true);}
 ctx.restore();
 // Lances, the sword and the guard's spears come from outside the box.
 ctx.save();ctx.beginPath();ctx.rect(0,0,640,396);ctx.clip();for(const b of game.bullets)if(b.kind==='lance'||b.kind==='arc'&&b.age>=b.warn)hazard(b,!!game.dark);ctx.restore();
 for(const e of game.effects)if(e.type==='aquaCut'){ctx.save();ctx.globalAlpha=e.life/.35;ctx.strokeStyle='#3ee0ed';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(e.x-16,e.y-16);ctx.lineTo(e.x+16,e.y+16);ctx.stroke();ctx.restore();aqua.prop('knife',e.x+10,e.y-10,24,-.8);}
 if(game.state==='warning'){const size=text.measure(game.attackName)>a.w-18?1.5:2;text(game.attackName,a.x+a.w/2,a.y+a.h/2-8,size,'#fff',true);}
}
function prose(str,n=Infinity,x=48,width=528,max=44){typedLines(wrap(str,max,width),str,n).slice(0,5).forEach((line,i)=>text(line,x,267+i*24));}
function mainText(){
 const sp=game.speaker,d=game.state==='dialogue';
 if(d&&sp==='boss'){if(game.displayChars>=game.text.length)text('Z',590,367,1,'#777');return;}
 if(d&&sp==='aqua'){aqua.face(AQUA_FACE[game.face]??0,92,318,110);if(game.phone)text('PHONE',92,374,1,'#3ee0ed',true);prose(game.text,shown(),160,430,32);}
 else prose(game.text,d?shown():Infinity);
 if(d&&game.displayChars>=game.text.length)text('Z',590,367,1,'#777');
}
// Ambience: petals drifting through the clearing (more of them as she gets angrier), and a glow behind her.
const petals=Array.from({length:40},(_,i)=>({x:(i*97)%640,y:(i*53)%480,s:.6+(i%5)*.15,p:i*1.7}));
function ambience(){if(reduceMotion)return;const n=Math.min(petals.length,10+game.anger*5),t=game.clock;for(let i=0;i<n;i++){const p=petals[i],x=((p.x+t*22*p.s+Math.sin(t*.9+p.p)*18)%680+680)%680-20,y=((p.y+t*30*p.s)%520+520)%520-20;ctx.save();ctx.translate(x,y);ctx.rotate(t*1.4*p.s+p.p);ctx.globalAlpha=.55;ctx.fillStyle=game.genocide?(i%3?'#b3122f':'#5e0d1a'):(i%3?'#f2c93a':'#f6ecc0');ctx.fillRect(-3,-1.5,6,3);ctx.restore();}}
function bossGlow(){const b=game.boss,pulse=reduceMotion?0:Math.sin(game.clock*2)*.04,g=ctx.createRadialGradient(b.x,b.y-70,6,b.x,b.y-70,120);g.addColorStop(0,game.genocide?`rgba(200,30,55,${.28+pulse+game.anger*.03})`:`rgba(170,220,120,${.2+pulse})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(b.x-130,b.y-200,260,260);}
// Hit feedback: crystal sparks when a thorn breaks the surface, a streak behind the lance, the sword's flash, pollen puffs, coloured vignettes.
function effectsFX(){for(const e of game.effects){
 if(e.type==='spark'){const u=1-e.life/.4;ctx.save();ctx.fillStyle=u<.5?'#ffffff':'#ff5a70';for(let k=0;k<6;k++){const a=Math.atan2(e.dy,e.dx)+(k-2.5)*.42,d=4+u*22;ctx.fillRect(Math.round(e.x+Math.cos(a)*d)-1,Math.round(e.y+Math.sin(a)*d)-1,2,2);}ctx.restore();}
 else if(e.type==='streak'){ctx.save();ctx.globalAlpha=e.life/.28*.5;ctx.translate(e.x,e.y);ctx.rotate(e.angle);ctx.fillStyle='#ffd0d6';ctx.fillRect(0,-1,900,2);ctx.restore();}
 else if(e.type==='flash'&&!reduceMotion){ctx.save();ctx.globalAlpha=e.life*1.4;ctx.fillStyle=e.color||'#fff';ctx.fillRect(0,0,640,480);ctx.restore();}
 else if(e.type==='puff'){const u=1-e.life/.45;ctx.save();ctx.globalAlpha=(1-u)*.6;ctx.strokeStyle='#f6f2a0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,4+u*e.r,0,Math.PI*2);ctx.stroke();ctx.restore();}
 else if(e.type==='vignette'){const g=ctx.createRadialGradient(320,240,170,320,240,420);g.addColorStop(0,`rgba(${e.color},0)`);g.addColorStop(1,`rgba(${e.color},${Math.min(.55,e.life*1.4)})`);ctx.fillStyle=g;ctx.fillRect(0,0,640,480);}
}}
function renderBattle(){
 const defending=['defend','warning'].includes(game.state),ended=['spared','killed'].includes(game.state);
 game.locationFX?.draw();
 if(game.state==='encounter'){const t=game.encounter,f=game.encFrom||{x:320,y:300};if(t<.45){game.scene='world';const st=game.state;game.state='frozen';renderWorld();game.state=st;game.scene='battle';const bob=reduceMotion?0:Math.round(Math.sin(t*30)*2);box(f.x-12,f.y-70+bob,24,28,'#fff',2);text('!',f.x,f.y-68+bob,2,'#fff',true);return;}ctx.fillStyle='#000';ctx.fillRect(0,0,640,480);if(t<.9){if(Math.floor((t-.45)*13)%2===0||reduceMotion)heart(f.x,f.y,16,'purple');}else{const k=Math.min(1,(t-.9)/.55),e=k*k*(3-2*k);heart(f.x+(320-f.x)*e,f.y+(300-f.y)*e,16,'purple');}return;}
 art.backdrop(game.genocide,.85);ambience();
 // Aqua dashes in from the left edge when she arrives, then holds her place beside the box.
 if(game.aquaHere&&!game.genocide){const u=reduceMotion?1:Math.min(1,(game.clock-(game.aquaArrived??-9))/.55),e=1-(1-u)**3;aqua.pose(u<1?4:0,-60+210*e,128,150);}
 bossGlow();drawBoss();speech();
 text('MARIGOLD',24,26,1,game.ready&&game.aquaHere?'#ffff00':'#9ad08a');for(let i=0;i<game.anger;i++){ctx.fillStyle=game.genocide?'#ff3b55':'#d86a7a';ctx.fillRect(110+i*9,28,6,6);}
 if(game.enemyHP<game.enemyMax||game.state==='target'){ctx.fillStyle='#222';ctx.fillRect(256,212,128,3);ctx.fillStyle='#9ad08a';ctx.fillRect(256,212,128*game.enemyHP/game.enemyMax,3);}
 if(defending)field();
 else{
  const a=game.arena;box(a.x,a.y,a.w,a.h);
  if(game.state==='fight'){ctx.fillStyle='#14201a';ctx.fillRect(56,286,528,65);for(let i=0;i<24;i++){const x=64+i*22,h=8+(1-Math.abs(x-320)/264)*45;ctx.fillStyle=Math.abs(x-320)<26?'#fff':'#5f8a5c';ctx.fillRect(x,319-h/2,3,h);}ctx.fillStyle='#ffff00';ctx.fillRect(317,279,6,81);ctx.fillStyle='#fff';ctx.fillRect(Math.round(game.attackCursor)-2,278,5,83);}
  else if(ended){const sp=game.state==='spared';text(sp?'THE MEMORIAL':'THE STATUE IS EMPTY',320,265,3,sp?'#ffff00':'#fff',true);prose(sp?'\n* She is going to write it all down.\n* Starting with herself.':game.genocide?'\n* The copper stays where it fell.\n* Nobody comes to look for her.':'\n* It is just a statue again.');if(game.timer>1.2)text('Z',590,368,1,'#777');}
  else if(game.options().length){const opts=game.options();opts.forEach((label,i)=>{const r=optionRect(i,opts.length),sel=game.option===i,col=game.state==='mercy'&&i===0&&game.ready&&game.aquaHere?'#ffff00':sel?'#fff':'#bbb';if(sel)heart(r.x+12,r.y+13,14,'purple');text(label,r.x+30,r.y+5,text.measure(label,2)>r.w-44?1.5:2,col);});if(game.state==='item'){const item=game.items.filter(i=>i.count)[game.option];if(item)text(item.heal>=99?'RESTORES ALL HP':'RESTORES '+item.heal+' HP',48,366,1.5,'#ffff00');}else text('Z · CONFIRM     X · BACK',48,366,1,'#777');}
  else mainText();
 }
 effectsFX();
 for(const e of game.effects){if(e.type==='damage')text(e.text,e.x,e.y-(1.1-e.life)*18,4,'#df6a77',true);if(['cheat','instruction','silence'].includes(e.type))text(e.text||'...',320,206,1.5,e.type==='cheat'?'#ffff00':'#e7a0aa',true);}
 if(game.settings.invincible)text('INVINCIBLE',24,46,1,'#ffff00');
 text('SETH',24,407,2);text('LV '+game.lv,132,407,2);text('HP',248,408,2);
 ctx.fillStyle='#8e2636';ctx.fillRect(284,403,120,16);ctx.fillStyle='#ffff00';ctx.fillRect(284,403,120*game.hp/game.maxHP,16);
 if(game.poison>0){const p=Math.min(game.poison,game.hp-1),x=284+120*(game.hp-p)/game.maxHP;ctx.fillStyle='#43e750';ctx.fillRect(Math.round(x),403,Math.max(0,Math.round(120*p/game.maxHP)),16);}
 text(`${game.hp} / ${game.maxHP}`,425,407,2,game.poison>0?'#43e750':'#fff');
 battleButtons(640,480).forEach((r,i)=>drawBattleButton(ctx,r,r.label,i,game.state==='menu'&&game.selected===i));
 if(game.state==='defend'){ctx.fillStyle='#24302a';ctx.fillRect(24,397,592,1);ctx.fillStyle='#9ad08a';ctx.fillRect(24,397,592*Math.max(0,1-game.attackTime/game.duration),1);}
}
function render(){
 soulVisual.advance(game.clock,'purple',1);ctx.save();ctx.fillStyle='#000';ctx.fillRect(0,0,640,480);
 if(game.shake&&!reduceMotion)ctx.translate(Math.sin(game.clock*109)*3,Math.cos(game.clock*73)*2);
 if(game.state==='dead'){const ready=soulBreak.draw(game,{x:game.soul.x,y:game.soul.y,reduced:reduceMotion});if(ready){text('GAME OVER',320,105,5,'#fff',true);text(game.genocide?'DON\'T LET HER BE RIGHT.':'STAY DETERMINED.',320,281,2,'#aaa',true);text('Z / TAP · RETRY',320,324,2,'#ffff00',true);text('FULL HP + RESTORED SUPPLIES',320,355,1.5,'#aaa',true);}ctx.restore();return;}
 if(game.scene==='world')renderWorld();else renderBattle();
 if(game.paused){ctx.fillStyle='#000d';ctx.fillRect(0,0,640,480);text('PAUSED',320,213,4,'#fff',true);}
 ctx.restore();
}
function musicMode(){if(['spared','killed'].includes(game.state)||game.ending)return 'end';if(game.scene==='world')return game.genocide?'walkHunt':'walk';if(game.state==='encounter')return 'off';return game.genocide?'hunt':'trap';}
function syncUI(){
 $('back').textContent=konami.progress>=8?'B':'X';$('confirm').textContent=konami.progress>=8?'A':'Z';
 audio.status(musicMode(),game.paused,game.state==='dead');
 $('phase').textContent=game.paused?'PAUSED':game.state==='dead'?'STAY DETERMINED':game.state==='spared'?'THE MEMORIAL':game.state==='killed'?'THE STATUE IS EMPTY':game.scene==='world'?require("story.js").ROOMS[game.world.room]:(game.genocide?'THE HUNT':'THE TRAP')+' / TURN '+Math.max(1,game.turn)+(game.settings.invincible?' / INVINCIBLE':'');
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
game.onEvent=event=>{syncUI();audio.effect(event);if(['text','turn','dead','end'].includes(event))$('live').textContent=game.state==='dead'?'Game over.':`${game.text}`;};
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
canvas.addEventListener('pointerdown',e=>{if(game.paused||drag)return;if(game.state==='defend'){e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);drag={id:e.pointerId,x:p.x,y:p.y,sx:game.soul.x,sy:game.soul.y,world:false};touch={x:game.soul.x,y:game.soul.y};}else if(game.state==='world'){e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);drag={id:e.pointerId,world:true};touch=p;}canvas.focus({preventScroll:true});});
canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e);touch=drag.world?p:{x:drag.sx+p.x-drag.x,y:drag.sy+p.y-drag.y};});
const releaseDrag=e=>{if(drag?.id===e.pointerId){if(drag.world&&game.state==='world')game.confirm();touch=null;drag=null;}};canvas.addEventListener('pointerup',releaseDrag);canvas.addEventListener('pointercancel',releaseDrag);
document.querySelectorAll('.touch-controls button').forEach(b=>b.addEventListener('contextmenu',e=>e.preventDefault()));
document.querySelectorAll('[data-key]').forEach(button=>{const dir=button.dataset.key;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);touchKeys[dir]=true;button.classList.add('held');konami.input(dir);game.navigate(dir==='left'?-1:dir==='right'?1:0,dir==='up'?-1:dir==='down'?1:0);syncUI();});const release=()=>{touchKeys[dir]=false;button.classList.remove('held');};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);});
$('confirm').onclick=()=>{if(!konami.input('a'))game.confirm();syncUI();};$('back').onclick=()=>{if(!konami.input('b'))game.back();syncUI();};$('pause').onclick=()=>{clearInput();game.togglePause();};
$('normalRoute').onclick=()=>{clearInput();game.beginRoute('pacifist');};$('genocideRoute').onclick=()=>{clearInput();game.beginRoute('genocide');};$('restart').onclick=()=>{clearInput();game.reset();};
$('sound').onclick=async()=>{audio.userMuted=audio.enabled;await audio.enable(!audio.enabled);$('sound').setAttribute('aria-pressed',String(audio.enabled));$('sound').setAttribute('aria-label',audio.enabled?'Mute music and sound':'Enable music and sound');};
$('help').onclick=()=>{clearInput();resumeAfterOptions=!game.paused&&game.scene==='battle';if(resumeAfterOptions)game.togglePause();$('options').showModal();};$('closeOptions').onclick=()=>$('options').close();$('options').addEventListener('close',()=>{if(resumeAfterOptions&&game.paused)game.togglePause();canvas.focus({preventScroll:true});});
$('difficulty').onchange=e=>{game.settings.difficulty=e.target.value;};$('motion').onchange=e=>{reduceMotion=e.target.checked;};
$('skipWalk').onchange=e=>{game.settings.skipWalk=e.target.checked;if(e.target.checked&&game.scene==='world')game.startBattle(true);};
function frame(now){accumulator=Math.min(accumulator+(now-last)/1000,.1);last=now;const input={};for(const k of ['up','down','left','right','slow'])input[k]=keys[k]||touchKeys[k];input.touch=touch;while(accumulator>=1/120){game.update(1/120,input);accumulator-=1/120;}if(game.state==='dialogue'&&game.displayChars<game.text.length&&game.clock-textSound>.07){audio.blip(game.speaker);textSound=game.clock;}syncUI();render();requestAnimationFrame(frame);}
syncUI();render();requestAnimationFrame(frame);
window.battleDebug={game,render,syncUI,audio};

// Seth's supplied weapon: two timed strikes, spin, then a single resolved impact.
const notebookVisual=new NotebookVisual(ctx,{enabled:()=>audio.enabled,paused:()=>game.paused,calm:()=>reduceMotion});
installNotebook(game,{kind:'rift',target:g=>({x:g.boss.x,y:g.boss.y-80}),event:(type,n)=>notebookVisual.event(type,n)});
notebookVisual.fx.bind(game,{hurt:fx=>fx.hurt(),dead:fx=>fx.kick(.55)});
notebookVisual.atmosphere(game,'snow',{variant:()=>game.genocide});
const beforeNotebookRender=render;
render=function(){game.notebookRender(beforeNotebookRender);if(game.scene==='battle')notebookVisual.draw(game);};
canvas.addEventListener('pointerdown',event=>{const n=game.notebook;if(!n.active)return;const r=canvas.getBoundingClientRect(),x=(event.clientX-r.left)*canvas.width/r.width,y=(event.clientY-r.top)*canvas.height/r.height,s=canvas.width/640,top=canvas.height-231*s;if(x>=24*s&&x<=616*s&&y>=top&&y<=top+140*s){event.preventDefault();event.stopImmediatePropagation();game.confirm();}},{capture:true});

})().catch(console.error);</script>
</body></html>
