
const {installNotebook}=require("notebook.js");
const {NotebookVisual}=require("notebook-visual.js");
const {battleButtons,drawBattleButton}=require("battle-ui.js");
const {SoulBreak}=require("soul-break.js");
const {SoulVisual}=require("soul-visual.js");
const {BattleEngine,SIDES,packetPos}=require("engine.js");
const {pixelText}=require("font.js");
const {StageAudio}=require("audio.js");
const {KonamiCode}=require("konami.js");
const {QueenArt}=require("qu5en-art.js");
await document.fonts.load('24px "Determination"');
const $=id=>document.getElementById(id),canvas=$('battle'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
const game=new BattleEngine(),text=pixelText(ctx),audio=new StageAudio(),art=new QueenArt(ctx),keys={},touchKeys={};
let touch=null,drag=null,last=performance.now(),signature='',accumulator=0,reduceMotion=false,textSound=0,resumeAfterOptions=false;
const soul=new Image();soul.src="__SOUL_PNG__";const soulVisual=new SoulVisual(ctx,soul);
const konami=new KonamiCode(()=>{game.settings.invincible=!game.settings.invincible;game.effects.push({type:'cheat',life:2,text:game.settings.invincible?'INVINCIBILITY ON':'INVINCIBILITY OFF'});audio.effect('heal');syncUI();});
const LIME='#b5e61d',CYAN='#00a2e8',GRID='#13662c',SETHC='#d58cff';
function box(x,y,w,h,color='#fff',line=4){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));ctx.fillStyle='#000';ctx.fillRect(Math.round(x+line),Math.round(y+line),Math.round(w-line*2),Math.round(h-line*2));}
function heart(x,y,size=16,color='purple',alpha=1,angle=0){soulVisual.draw(x,y,size,color,alpha,angle);}
const soulBreak=new SoulBreak(ctx,(x,y,size,alpha)=>heart(x,y,size,'purple',alpha,0));
function optionRect(i,n){return n>2?{x:40+(i%2)*288,y:270+Math.floor(i/2)*43,w:274,h:38}:{x:40,y:270+i*43,w:550,h:38};}
function wrap(str,max=44,width=528,size=2){const lines=[];for(const line of String(str).split('\n')){let current='';for(const word of line.split(' ')){const next=(current+' '+word).trim();if(current&&(next.length>max||text.measure(next,size)>width)){lines.push(current);current=word;}else current=next;}lines.push(current);}return lines;}
function typedLines(lines,str,n){if(!(n<str.length))return lines;let at=0;return lines.map(l=>{const lead=l.length-l.trimStart().length;let seen=false;const words=l.slice(lead).split(' ').map(w=>{const s=str.indexOf(w,at);if(s<0)return w;at=s+w.length;if(s<n)seen=true;return w.slice(0,Math.max(0,n-s));});return seen?l.slice(0,lead)+words.join(' ').trimEnd():'';});}
const shown=()=>game.state==='dialogue'?Math.floor(game.displayChars):Infinity;
const typing=()=>game.state==='dialogue'&&game.displayChars<game.text.length;
const blink=(hz=6)=>reduceMotion||Math.floor(game.clock*hz)%2===0;

// ======================================================================= the CORE's machinery
// Pistons, cogs and vents around the arena pound on the beat of her theme: the vertical pistons slam in turn on
// every beat, the side rams punch in on the kicks (beats 1 and 3), the cogs tick a notch per beat.
const ease=u=>u<.5?2*u*u:1-2*(1-u)*(1-u);
function beat(){const bp=game.beatPos,bi=Math.floor(bp);return{bp,bi,ph:bp-bi};}
function pistonExtension(local){return local<1?1-ease(local):local<1.75?0:((local-1.75)/.25)**2;}
function piston(x,top,len,local,alpha){
 const e=pistonExtension(local),hy=top+40+e*len;ctx.save();ctx.globalAlpha=alpha;ctx.lineWidth=2;
 ctx.strokeStyle=GRID;ctx.strokeRect(x-12,top,24,40);ctx.strokeRect(x-14,top+len+54,28,8);
 ctx.strokeStyle='#5a8a20';ctx.beginPath();ctx.moveTo(x-3,top+40);ctx.lineTo(x-3,hy);ctx.moveTo(x+3,top+40);ctx.lineTo(x+3,hy);ctx.stroke();
 ctx.strokeStyle=LIME;ctx.strokeRect(x-11,hy,22,12);
 if(local<.14&&!reduceMotion){const k=1-local/.14;ctx.strokeStyle='#ffff9a';ctx.globalAlpha=alpha*k;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(x+s*12,hy+10);ctx.lineTo(x+s*(20+k*8),hy+4-k*4);ctx.stroke();}ctx.fillStyle='#ccc';for(let i=0;i<4;i++)ctx.fillRect(Math.round(x-10+i*6),Math.round(hy-6-(1-k)*14-i%2*3),2,2);}
 ctx.restore();
}
function ram(side,y,local,alpha){
 const e=pistonExtension(local),reach=120,x0=side<0?0:640,tip=x0-side*(30+e*reach);ctx.save();ctx.globalAlpha=alpha;ctx.lineWidth=2;
 ctx.strokeStyle=GRID;ctx.strokeRect(side<0?0:610,y-10,30,20);ctx.strokeStyle='#5a8a20';ctx.beginPath();ctx.moveTo(x0-side*30,y-3);ctx.lineTo(tip,y-3);ctx.moveTo(x0-side*30,y+3);ctx.lineTo(tip,y+3);ctx.stroke();
 ctx.strokeStyle=LIME;ctx.strokeRect(Math.round(side<0?tip:tip-12),y-9,12,18);ctx.restore();
}
function cog(x,y,r,angle,alpha){ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);ctx.strokeStyle=GRID;ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<16;k++){const a0=k*Math.PI/8,rr=k%2?r:r+5;ctx.lineTo(Math.cos(a0)*rr,Math.sin(a0)*rr);}ctx.closePath();ctx.stroke();ctx.strokeStyle='#5a8a20';ctx.beginPath();ctx.arc(0,0,r*.45,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.45,0);ctx.lineTo(r*.45,0);ctx.stroke();ctx.restore();}
function machinery(alpha=1){
 const {bp,bi,ph}=beat(),m=k=>((bp+k)%2+2)%2;
 // Two pistons a side, slamming in turn: one lands on every beat.
 piston(22,104,206,m(0),alpha);piston(54,104,206,m(1),alpha);piston(586,104,206,m(1),alpha);piston(618,104,206,m(0),alpha);
 // The side rams punch in on the kick (beats 1 and 3 of each bar).
 const kick=((bp%2)+2)%2;ram(-1,124,kick,alpha*.8);ram(1,124,kick,alpha*.8);
 const turn=(bi+ease(Math.min(1,ph*4)))*Math.PI/8;cog(214,46,20,turn,alpha);cog(426,46,20,-turn,alpha);
 // Vents along the floor glow on the downbeat of each bar.
 const bar=((bp%4)+4)%4,glow=bar<1?(1-bar)**2:0;ctx.save();ctx.globalAlpha=alpha*(.25+glow*.6);ctx.fillStyle=LIME;for(let x=8;x<640;x+=40)ctx.fillRect(x,392,24,2);ctx.restore();
}
// ======================================================================= her
// The giant wireframe head over the globe. She glitches when hit, flickers while she talks, and dims when the scan misses.
function drawHead(y0=6,clip=1){
 const b=game.boss,t=game.clock,bob=reduceMotion?0:Math.round((1-beat().ph)**3*3),hurt=b.hurt>.3&&!reduceMotion,talk=typing()&&game.speaker==='boss';
 const tint=hurt?'#ffffff':b.sad?'#6f8a1c':talk&&Math.floor(t*14)%3===0?'#e2ff7a':null;
 if(b.glitch>0&&!reduceMotion){const [w,h]=art.size('head');for(let k=0;k<5;k++){const off=Math.round(Math.sin(t*80+k)*6*b.glitch*2);ctx.save();ctx.beginPath();ctx.rect(0,y0+k*h*2/5+bob,640,h*2/5);ctx.clip();art.frame('head',320+off,y0+bob,2,{anchor:'top',tint,clip});ctx.restore();}}
 else art.frame('head',320,y0+bob,2,{anchor:'top',tint,clip});
}
function speech(){
 if(game.state!=='dialogue'||game.speaker!=='boss')return;
 const lines=wrap(game.text,14,140,1.5),h=Math.max(156,34+lines.length*16);
 box(400,24,228,h,'#fff',3);ctx.fillStyle='#fff';ctx.fillRect(388,90,13,3);ctx.fillRect(391,93,10,3);ctx.fillRect(394,96,7,3);
 art.frame('face_'+game.face,440,70,2,{anchor:'center'});
 typedLines(lines,game.text,shown()).forEach((l,i)=>text(l,476,34+i*16,1.5,'#fff'));
 if(game.displayChars>=game.text.length)text('Z',612,16+h,1,'#777');
}
// HUD: her name, the DATA bar (her research), and her chassis once it's dented.
function hud(){
 text('QU5EN',24,22,1.5,LIME);const x=24,y=44,w=150;ctx.fillStyle='#0b2a12';ctx.fillRect(x,y,w,8);ctx.fillStyle=game.data>=100?'#ffff00':CYAN;ctx.fillRect(x,y,Math.round(w*game.data/100),8);ctx.strokeStyle=GRID;ctx.strokeRect(x+.5,y+.5,w-1,7);text('DATA '+Math.round(game.data)+'%',x,y+12,1,game.data>=100?'#ffff00':CYAN);
 text(game.scanDone?'':game.phase===2?'PHASE 2: DOUBLE-BLIND':'PHASE 1',x,y+24,1,'#888');
 if(game.armor>0)text('ARMOR',x,y+48,1,'#ffff00');
 if(game.chassis<100)text('CHASSIS '+game.chassis+'%',x,y+36,1,'#888');
 if(game.settings.invincible)text('INVINCIBLE',24,94,1,'#ffff00');
}

// ======================================================================= the rounds
function answerLabel(i,x,y,size=1,center=true){
 const q=game.quiz,a=q.answers[i],crossed=q.crossed===i,glow=q.shown&&a.correct&&!q.resolved&&blink(5),res=q.resolved;
 const col=res?(a.correct?'#7dff6a':'#ff5a5a'):crossed?'#555':glow?'#ffff00':'#fff';
 const lines=wrap(a.text,14,110,size);lines.forEach((l,k)=>text(l,x,y+k*(size*10),size,col,center));
 if(crossed){const w=Math.min(110,text.measure(a.text,size));ctx.fillStyle='#ff5a5a';ctx.fillRect(Math.round(x-(center?w/2:0)),Math.round(y+size*4),Math.round(w),2);}
}
function questionRow(){
 const q=game.quiz,a=game.arena;if(!q||!['warning','defend'].includes(game.state))return;
 const quip=game.effects.find(e=>e.type==='quip');
 if(quip)text(quip.text,320,a.y-46,1.5,LIME,true);else text(q.q,320,a.y-46,1.5,LIME,true);
 if(!q.resolved){const left=Math.max(0,Math.ceil(q.at-game.attackTime));art.frame('ui_time',a.x+38,a.y-6,1);text(String(left),a.x+82,a.y-26,2,left<=2&&blink(8)?'#ff5a5a':'#fff');}
}
function drawBoot(b){const top=b.y-b.h,a=game.arena;if(b.phase==='warn'){if(blink(10)){ctx.strokeStyle='#ff5a5a';ctx.lineWidth=2;ctx.strokeRect(Math.round(b.x-12),a.y+8,24,24);text('!',b.x,a.y+11,2,'#ff5a5a',true);}ctx.save();ctx.globalAlpha=.25;ctx.fillStyle='#ff5a5a';ctx.fillRect(Math.round(b.x-b.w/2),a.y+4,Math.round(b.w),a.h-8);ctx.restore();return;}
 ctx.fillStyle='#000';ctx.fillRect(Math.round(b.x-b.w/2),a.y+4,Math.round(b.w),Math.round(b.y-a.y-4));ctx.strokeStyle=LIME;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x-b.w/2+6,a.y);ctx.lineTo(b.x-b.w/2+6,top);ctx.lineTo(b.x-b.w/2,b.y);ctx.lineTo(b.x+b.w/2,b.y);ctx.lineTo(b.x+b.w/2-10,top+10);ctx.lineTo(b.x+b.w/2-10,a.y);ctx.stroke();ctx.beginPath();ctx.moveTo(b.x-b.w/2+6,top+8);ctx.lineTo(b.x+b.w/2-10,top+8);ctx.stroke();}
function miniHead(x,y,ang,r=5,col='#fff'){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(ang);ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-r-3);ctx.lineTo(r*.5,-r+1);ctx.lineTo(r+2,-r);ctx.lineTo(r*.7,0);ctx.lineTo(0,r+1);ctx.lineTo(-r*.7,0);ctx.lineTo(-r-2,-r);ctx.lineTo(-r*.5,-r+1);ctx.closePath();ctx.stroke();ctx.fillStyle=col;ctx.fillRect(-1,-1,2,2);ctx.restore();}
function hazard(b){
 if(b.delay&&b.age<b.delay)return;const a=game.arena;
 switch(b.kind){
  case 'boot':drawBoot(b);return;
  case 'head':{if(b.age<b.form){const u=b.age/b.form;ctx.save();ctx.globalAlpha=.3+.7*u;miniHead(b.x,b.y,0,4+u*8,LIME);ctx.restore();if(u>.5&&blink(8))text('HA',b.x+14,b.y-18,1,LIME);return;}miniHead(b.x,b.y,0,12,blink(16)?'#fff':LIME);return;}
  case 'mini':miniHead(b.x,b.y,reduceMotion?0:b.age*(b.spin||6),b.r||5);return;
  case 'beam':{const warn=b.age<b.warn;if(b.fx!==undefined&&b.age<b.warn+b.live){const mx=Math.max(8,Math.min(600,b.fx)),my=Math.max(160,Math.min(380,b.fy));ctx.fillStyle='#000';ctx.fillRect(Math.round(mx),Math.round(my),30,22);ctx.strokeStyle=LIME;ctx.lineWidth=1;ctx.strokeRect(Math.round(mx)+.5,Math.round(my)+.5,29,21);ctx.save();ctx.translate(mx+15,my+11);ctx.rotate(Math.atan2(b.y-my-11,b.x-mx-15));ctx.fillStyle='#7dff6a';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-4,-5);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();ctx.restore();}ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);if(warn){ctx.strokeStyle='#ff4a4a';ctx.globalAlpha=.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(-900,0);ctx.lineTo(900,0);ctx.stroke();}else{ctx.globalAlpha=Math.max(0,1-(b.age-b.warn-b.live)/.15);ctx.fillStyle='#7dff6a';ctx.fillRect(-900,-b.w/2,1800,b.w);ctx.fillStyle='#fff';ctx.fillRect(-900,-2,1800,4);}ctx.restore();return;}
  case 'sector':{const r0=Math.min(a.w,a.h)*.38,cx=a.x+a.w/2,cy=a.y+a.h/2;ctx.save();ctx.globalAlpha=Math.max(0,1-b.age/.6);ctx.strokeStyle='#ff5a5a';ctx.lineWidth=16;ctx.beginPath();ctx.arc(cx,cy,r0,b.t0-Math.PI/2,b.t1-Math.PI/2);ctx.stroke();ctx.restore();return;}
  case 'fighter':{const pose=b.punching?'q_punch':'q_walk'+'';art.frame(art.has(pose)?pose:'q_idle0',b.x,b.y+b.h/2+6,1,{flip:b.dir<0});return;}
  case 'bubble':{const ans=b.ans>=0,q=game.quiz;ctx.fillStyle=ans?'#0b2a12':'#1a1a1a';ctx.fillRect(Math.round(b.x-b.w/2),Math.round(b.y-b.h/2),b.w,b.h);ctx.strokeStyle=ans?LIME:'#aaa';ctx.lineWidth=1;ctx.strokeRect(Math.round(b.x-b.w/2)+.5,Math.round(b.y-b.h/2)+.5,b.w-1,b.h-1);
   if(ans&&q)answerLabel(b.ans,b.x,b.y-5,1);else text(b.label,b.x,b.y-5,1,'#ddd',true);return;}
  case 'target':{art.frame(['face_talk','face_smile','face_smug','face_talk'][b.ans%4],b.x,b.y,1,{anchor:'center'});if(game.quiz)answerLabel(b.ans,b.x,b.y+20,1);return;}
  case 'packet':{ctx.fillStyle='#000';ctx.fillRect(Math.round(b.x-7),Math.round(b.y-5),14,10);ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(Math.round(b.x-7)+.5,Math.round(b.y-5)+.5,13,9);ctx.beginPath();ctx.moveTo(b.x-7,b.y-5);ctx.lineTo(b.x,b.y+1);ctx.lineTo(b.x+7,b.y-5);ctx.stroke();return;}
 }
}
// What the answers look like, mode by mode.
function answers(){
 const q=game.quiz,a=game.arena;if(!q)return;const n=q.answers.length,cx=a.x+a.w/2,cy=a.y+a.h/2;
 if(game.mode==='red'){const cw=a.w/n;for(let k=0;k<n;k++){if(k){ctx.save();ctx.strokeStyle=GRID;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(a.x+cw*k,a.y+4);ctx.lineTo(a.x+cw*k,a.y+a.h-4);ctx.stroke();ctx.restore();}answerLabel(q.slots[k],a.x+cw*k+cw/2,a.y+12,1);
   if(!q.resolved&&game.attackTime>q.at-1&&blink(10)){ctx.strokeStyle='#ff5a5a';ctx.lineWidth=2;ctx.strokeRect(Math.round(a.x+cw*k+cw/2-12),a.y+a.h-34,24,24);text('!',a.x+cw*k+cw/2,a.y+a.h-31,2,'#ff5a5a',true);}}}
 else if(game.mode==='blue'){for(const p of game.platforms){if(p.gone)continue;ctx.fillStyle='#000';ctx.fillRect(Math.round(p.x),Math.round(p.y),Math.round(p.w),6);ctx.strokeStyle=p.ans>=0?LIME:'#888';ctx.lineWidth=2;ctx.strokeRect(Math.round(p.x)+1,Math.round(p.y)+1,Math.round(p.w)-2,4);if(p.ans>=0)answerLabel(p.ans,p.x+p.w/2,p.y-22,1);}
  if(game.acid){ctx.fillStyle='rgba(120,255,60,.35)';ctx.fillRect(a.x+4,Math.round(game.acid.top),a.w-8,Math.round(a.y+a.h-4-game.acid.top));ctx.fillStyle='#b5ff5a';for(let x=a.x+4;x<a.x+a.w-4;x+=8)ctx.fillRect(x,Math.round(game.acid.top+(reduceMotion?0:Math.sin(x*.2+game.clock*4)*1.5)),8,2);}}
 else if(game.mode==='cyan'){const r=Math.min(a.w,a.h)*.38,s=Math.PI*2/n;ctx.save();ctx.strokeStyle='#3ee0ed';ctx.globalAlpha=.35;ctx.setLineDash([4,6]);ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.5;ctx.strokeStyle=GRID;for(let k=0;k<n;k++){const an=k*s-Math.PI/2;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*(r-14),cy+Math.sin(an)*(r-14));ctx.lineTo(cx+Math.cos(an)*(r+14),cy+Math.sin(an)*(r+14));ctx.stroke();}ctx.restore();
  for(let k=0;k<n;k++){const an=(k+.5)*s-Math.PI/2;answerLabel(k,cx+Math.cos(an)*r*.5,cy+Math.sin(an)*r*.5-4,1);}}
 else if(game.mode==='green'){for(let k=0;k<n;k++){const side=SIDES[k],p={up:[cx,a.y+10],right:[a.x+a.w-34,cy-4],down:[cx,a.y+a.h-22],left:[a.x+34,cy-4]}[side];answerLabel(q.slots[k],p[0],p[1],1);}}
 else if(game.mode==='strings'&&!game.round.shoot&&!game.round.dash){for(let k=0;k<n;k++)answerLabel(q.slots[k],a.x+10,game.strings[k]-14,1,false);}
}
// The egg and the shield (green), Seth's SOUL in every mode, his purple rim always.
function drawSoul(){
 const s=game.soul,a=game.arena;
 if(game.mode==='green'){const cx=a.x+a.w/2,cy=a.y+a.h/2;ctx.fillStyle='#f4f0e0';ctx.beginPath();ctx.ellipse(cx,cy+3,9,12,0,0,Math.PI*2);ctx.fill();const d={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]}[game.shield];ctx.save();ctx.translate(cx+d[0]*26,cy+d[1]*26);ctx.rotate(Math.atan2(d[1],d[0])+Math.PI/2);ctx.fillStyle=SETHC;ctx.fillRect(-18,-3,36,6);ctx.restore();}
 if(game.invulnerability>0&&game.dash<=0&&Math.floor(game.clock*15)%2)return;
 const r=game.round||{},color=r.dash?'orange':r.shoot&&game.mode==='strings'?'yellow':{red:null,blue:'blue',cyan:'cyan',yellow:'yellow',green:'green',orange:'orange',strings:null}[game.mode];
 if(game.mode==='green'){heart(a.x+a.w/2,a.y+a.h/2+3,12,'green');return;}
 const ang=game.mode==='yellow'?Math.PI:0;
 if(!color)heart(s.x,s.y,16,'purple');else{heart(s.x,s.y,20,'purple',1,ang);heart(s.x,s.y,14,color,1,ang);}
 if((game.mode==='orange'||r.dash)&&game.heat>.05){ctx.save();ctx.strokeStyle=game.heat>=1?'#ff3a20':'#ffb060';ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,15,-Math.PI/2,-Math.PI/2+Math.PI*2*game.heat);ctx.stroke();ctx.restore();}
}
function pulse(a){if(reduceMotion)return;const k=(1-beat().ph)**3;if(k<.05)return;ctx.save();ctx.globalAlpha=k*.7;ctx.strokeStyle=LIME;ctx.lineWidth=2;ctx.strokeRect(Math.round(a.x)-3,Math.round(a.y)-3,Math.round(a.w)+6,Math.round(a.h)+6);ctx.restore();}
function field(){
 const a=game.arena;box(a.x,a.y,a.w,a.h);pulse(a);
 ctx.save();ctx.beginPath();ctx.rect(a.x+4,a.y+4,a.w-8,a.h-8);ctx.clip();
 if(game.mode==='arcade'){arcade();ctx.restore();return;}
 if(game.mode==='strings'){ctx.fillStyle='#b249dc';for(const y of game.strings){ctx.globalAlpha=.75;ctx.fillRect(a.x,Math.round(y)-1,a.w,2);}ctx.globalAlpha=1;
  // The scan sweeps across and back.
  const u=((game.beatPos/8)%2+2)%2,x=a.x+a.w*(u<1?u:2-u);ctx.save();ctx.globalAlpha=.5;ctx.fillStyle='#ff3030';ctx.fillRect(Math.round(x)-1,a.y,3,a.h);ctx.globalAlpha=.12;ctx.fillRect(Math.round(x)-24,a.y,48,a.h);ctx.restore();}
 answers();
 // Spam first, answers on top, so an answer is never hidden.
 for(const b of game.bullets)if(b.kind!=='beam'&&!(b.kind==='bubble'&&b.ans>=0))hazard(b);
 for(const b of game.bullets)if(b.kind==='bubble'&&b.ans>=0)hazard(b);
 for(const s of game.shots){ctx.fillStyle='#ffec37';ctx.fillRect(Math.round(s.x-1),Math.round(s.y-6),3,10);}
 drawSoul();ctx.restore();
 for(const b of game.bullets)if(b.kind==='beam'){if(b.age<b.warn)hazard(b);else{ctx.save();ctx.beginPath();ctx.rect(a.x,a.y,a.w,a.h);ctx.clip();hazard(b);ctx.restore();}}
 if(game.state==='warning'){const size=text.measure(game.attackName)>a.w-18?1.5:2;text(game.attackName,a.x+a.w/2,a.y+a.h/2-8,size,'#fff',true);}
}
// ROUND 2: FIGHT! — her vector cabinet. Seth's fighter is the blue fighter in his purple, his SOUL on its chest.
function arcade(){
 const a=game.arena,A=game.arc,p=A.seth,q=A.queen,floor=a.y+a.h-14,t=game.clock;
 ctx.strokeStyle=GRID;ctx.lineWidth=1;for(let k=0;k<6;k++){const y=floor-k*k*4;ctx.beginPath();ctx.moveTo(a.x,y+.5);ctx.lineTo(a.x+a.w,y+.5);ctx.stroke();}ctx.strokeStyle=LIME;ctx.beginPath();ctx.moveTo(a.x,floor+.5);ctx.lineTo(a.x+a.w,floor+.5);ctx.stroke();
 const sx=a.x+a.w*.3,qx=a.x+a.w*.68,lift=p.air>0?Math.round(Math.sin(Math.PI*(1-p.air/.62))*58):0;
 const sp=p.hurt>0?'seth_ko':p.punch>0?'seth_guard':p.air>0?'seth_high':p.duck?'seth_low':'seth_idle'+(Math.floor(t*3)%2);
 art.frame(sp,sx+(p.punch>0?14:0),floor-lift,1);if(!(game.invulnerability>0&&Math.floor(t*15)%2))heart(sx,floor-lift-(p.duck?22:40),10,'purple');
 const qp={idle:'q_idle'+(Math.floor(t*4)%4),tell:q.move==='high'?'q_charge1':'q_crouch',attack:q.move==='high'?'q_punch':'q_low',recover:'q_lean',hurt:'q_hurt',ko:'q_ko'}[q.state];
 art.frame(qp,qx-(q.state==='attack'?18:0),floor,1,{flip:true});
 if(q.state==='tell'&&blink(10)){text((q.switched?'!? ':'')+(q.move==='high'?'▲ HIGH':'▼ LOW'),qx,a.y+16,1.5,q.switched?'#ffff00':'#ff5a5a',true);}
 if(q.state==='recover'&&blink(8))text('OPEN!',qx,a.y+16,1.5,'#ffff00',true);
 for(const e of game.effects){if(e.type==='arcadeHit')art.frame('ui_burst_pink',qx-10,floor-70,1,{anchor:'center',alpha:Math.min(1,e.life*3)});if(e.type==='arcadeBlock')text('BLOCK',qx,floor-120,1,'#aaa',true);}
 art.frame('ui_hero_hp',a.x+46,a.y+20,1);ctx.fillStyle='#333';ctx.fillRect(a.x+12,a.y+24,80,5);ctx.fillStyle=CYAN;ctx.fillRect(a.x+12,a.y+24,Math.round(80*game.hp/game.maxHP),5);
 const hits=game.round.bout.hits;text('QU5EN',a.x+a.w-90,a.y+8,1,LIME);for(let k=0;k<hits;k++){ctx.fillStyle=k<hits-q.hits?LIME:'#333';ctx.fillRect(a.x+a.w-90+k*14,a.y+24,10,5);}
 const left=Math.max(0,Math.ceil(game.duration-game.attackTime));art.frame('ui_time',a.x+a.w/2,a.y+26,1);text(String(left),a.x+a.w/2,a.y+28,1.5,'#fff',true);
 if(game.attackTime<1.2){const b=game.round.bout;if(game.attackTime<.6){if(b.n===1)art.frame('ui_round1',a.x+a.w/2,a.y+a.h/2,2,{anchor:'center'});else text(b.final?'FINAL ROUND':'ROUND '+b.n,a.x+a.w/2,a.y+a.h/2-10,2.5,LIME,true);}else art.frame('ui_fight',a.x+a.w/2,a.y+a.h/2,2,{anchor:'center'});}
}
function prose(str,n=Infinity,x=48,width=528,max=44,color='#fff'){typedLines(wrap(str,max,width),str,n).slice(0,5).forEach((line,i)=>text(line,x,267+i*24,2,color));}
function mainText(){
 const sp=game.speaker,d=game.state==='dialogue';
 if(d&&sp==='boss'){if(game.displayChars>=game.text.length)text('Z',590,367,1,'#777');return;}
 prose(game.text,d?shown():Infinity,48,528,44,sp==='seth'?SETHC:'#fff');
 if(d&&game.displayChars>=game.text.length)text('Z',590,367,1,'#777');
}
function effectsFX(){for(const e of game.effects){
 if(e.type==='vignette'){const g=ctx.createRadialGradient(320,240,170,320,240,420);g.addColorStop(0,`rgba(${e.color},0)`);g.addColorStop(1,`rgba(${e.color},${Math.min(.5,e.life*1.4)})`);ctx.fillStyle=g;ctx.fillRect(0,0,640,480);}
 else if(e.type==='verdict'&&['defend','warning'].includes(game.state)){const a=game.arena,k=Math.min(1,e.life*2);ctx.save();ctx.globalAlpha=k;art.frame(e.ok?'ui_burst_pink':'ui_burst_red',a.x+a.w/2,a.y+a.h/2,2,{anchor:'center',alpha:.5});text(e.text,a.x+a.w/2,a.y+a.h/2-12,3,e.ok?'#7dff6a':'#ff5a5a',true);ctx.restore();}
 else if(e.type==='data'){text(e.text,182,40-(1.2-e.life)*10,1,'#ffff00');}
 else if(e.type==='hpup'){text(e.text,440,388-(0.8-e.life)*16,1.5,'#7dff6a');}
 else if(e.type==='swap'&&['defend','warning'].includes(game.state)){const a=game.arena;ctx.save();ctx.globalAlpha=Math.min(1,e.life*3);text('SHUFFLE!',a.x+a.w-40,a.y-26,1,'#ffff00',true);ctx.restore();}
 else if(e.type==='block'){ctx.save();ctx.globalAlpha=e.life*4;ctx.strokeStyle='#fff';ctx.beginPath();ctx.arc(e.x,e.y,6+(1-e.life*4)*8,0,Math.PI*2);ctx.stroke();ctx.restore();}
 else if(e.type==='zap'&&!reduceMotion){ctx.save();ctx.globalAlpha=e.life*2;ctx.fillStyle='#7dff6a';ctx.fillRect(0,0,640,480);ctx.restore();}
}}
// The opening: the globe turns on, her head draws itself line by line, and the cabinet announces her.
function intro(){
 const t=game.intro;ctx.fillStyle='#000';ctx.fillRect(0,0,640,480);machinery(Math.min(1,Math.max(0,(t-.4)/1.1)));art.backdrop(Math.min(1,Math.max(0,(t-.4)/1.1)));
 if(t>1.2)drawHead(80,Math.min(1,(t-1.2)/2));
 if(t>3.4)text('HERE IS',320,250,2,CYAN,true);if(t>4)text('QU5EN',320,280,4,LIME,true);
 if(t>5){art.frame('ui_round1',240,352,2,{anchor:'center'});if(t>5.5)art.frame('ui_fight',412,352,2,{anchor:'center'});}
 text('Z · SKIP',600,452,1,'#555',true);
}
function renderBattle(){
 if(game.state==='intro'){intro();return;}
 const defending=['defend','warning'].includes(game.state);
 game.locationFX?.draw();machinery();art.backdrop(.7);drawHead();hud();speech();
 if(defending){field();questionRow();}
 else{
  const a=game.arena;box(a.x,a.y,a.w,a.h);
  if(game.state==='fight'){ctx.fillStyle='#0b2a12';ctx.fillRect(56,286,528,65);for(let i=0;i<24;i++){const x=64+i*22,h=8+(1-Math.abs(x-320)/264)*45;ctx.fillStyle=Math.abs(x-320)<26?'#fff':'#5f9a3c';ctx.fillRect(x,319-h/2,3,h);}ctx.fillStyle='#ffff00';ctx.fillRect(317,279,6,81);ctx.fillStyle='#fff';ctx.fillRect(Math.round(game.attackCursor)-2,278,5,83);}
  else if(game.state==='spared'){text('TEST COMPLETE',320,265,3,'#ffff00',true);prose('\n* Variant Perseverance.\n* Somewhere below, a machine is waiting.');if(game.timer>1.2)text('Z',590,368,1,'#777');}
  else if(game.options().length){const opts=game.options();opts.forEach((label,i)=>{const r=optionRect(i,opts.length),sel=game.option===i,col=game.state==='mercy'&&i===0&&game.ready?'#ffff00':sel?'#fff':'#bbb';if(sel)heart(r.x+12,r.y+13,14,'purple');text(label,r.x+30,r.y+5,text.measure(label,2)>r.w-44?1.5:2,col);});
   if(game.state==='item'){const item=game.items.filter(i=>i.count)[game.option];if(item)text(item.name==='EGG'?'IT\'S AN EGG.':item.heal>=99?'RESTORES ALL HP':'RESTORES '+item.heal+' HP',48,366,1.5,'#ffff00');}
   else if(game.state==='act'){const tip={'CHECK':'','ASK ABOUT HIM':'SHE CROSSES OUT A WRONG ANSWER','HYPE CHAT':'+DATA, BUT A WILDER ROUND','CALL ALPHYS':'SHE WILL DECLINE. PROBABLY'}[game.options()[game.option]];if(tip)text(tip,48,366,1.5,CYAN);}
   else text('Z · CONFIRM     X · BACK',48,366,1,'#777');}
  else mainText();
 }
 effectsFX();
 for(const e of game.effects){if(e.type==='damage')text(e.text,e.x,e.y+60-(1.1-e.life)*18,3,'#ff9090',true);if(['cheat','instruction'].includes(e.type))text(e.text||'...',320,game.arena.y-22,1,e.type==='cheat'?'#ffff00':'#ffc890',true);}
 text('SETH',24,407,2);text('LV '+game.lv,132,407,2);text('HP',248,408,2);
 ctx.fillStyle='#8e2636';ctx.fillRect(284,403,120,16);ctx.fillStyle='#ffff00';ctx.fillRect(284,403,Math.round(120*game.hp/game.maxHP),16);text(`${game.hp} / ${game.maxHP}`,425,407,2,'#fff');
 if((game.mode==='orange'||game.round?.dash)&&defending){const cd=game.dashCD/.6,ready=cd<=0&&game.dash<=0,x=528,y=401;ctx.fillStyle='#000';ctx.fillRect(x,y,88,20);ctx.fillStyle=ready?'#ff9d27':'#3a2a1a';ctx.fillRect(x,y,Math.round(88*(1-cd)),20);ctx.strokeStyle=ready?'#ffff00':'#7a5a3a';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,86,18);text(ready?'Z DASH':'DASH',x+44,y+3,1.5,ready?'#000':'#a08060',true);}
 battleButtons(640,480).forEach((r,i)=>drawBattleButton(ctx,r,r.label,i,game.state==='menu'&&game.selected===i));
 if(game.state==='defend'){ctx.fillStyle='#0b2a12';ctx.fillRect(24,397,592,1);ctx.fillStyle=LIME;ctx.fillRect(24,397,Math.round(592*Math.max(0,1-game.attackTime/game.duration)),1);}
}
function render(){
 soulVisual.advance(game.clock,'purple',1);ctx.save();ctx.fillStyle='#000';ctx.fillRect(0,0,640,480);
 if(game.shake&&!reduceMotion)ctx.translate(Math.sin(game.clock*109)*3,Math.cos(game.clock*73)*2);
 if(!reduceMotion&&game.state!=='dead'){const k=((game.beatPos%2)+2)%2;if(k<.25)ctx.translate(0,Math.round((1-k/.25)*2));}
 // Game over is her cabinet's: YOU LOSE! / FIGHT AGAIN / GIVE UP.
 if(game.state==='dead'){const ready=soulBreak.draw(game,{x:game.soul.x,y:game.soul.y,reduced:reduceMotion});if(ready){art.frame('ui_you_lose',320,60,2,{anchor:'top'});art.frame(blink(3)?'ui_fight_again1':'ui_fight_again0',320,300,2,{anchor:'center'});text('Z',320-150,292,2,'#ffff00',true);art.frame('ui_give_up0',320,350,2,{anchor:'center'});text('X',320-108,342,2,'#888',true);text('FULL HP + RESTORED SUPPLIES',320,392,1.5,'#aaa',true);}ctx.restore();return;}
 renderBattle();
 if(game.paused){ctx.fillStyle='#000d';ctx.fillRect(0,0,640,480);text('PAUSED',320,213,4,'#fff',true);}
 ctx.restore();
}
function musicMode(){if(game.state==='spared'||game.ending)return 'end';return 'battle';}
function syncUI(){
 $('back').textContent=konami.progress>=8?'B':'X';$('confirm').textContent=konami.progress>=8?'A':(game.state==='defend'&&(game.mode==='orange'||game.round?.dash)?'⇥':'Z');
 audio.status(musicMode(),game.paused,game.state==='dead');
 $('phase').textContent=game.paused?'PAUSED':game.state==='dead'?'YOU LOSE!':game.state==='spared'?'TEST COMPLETE':game.state==='intro'?'HERE IS QU5EN':'THE CORE / DATA '+Math.round(game.data)+'%'+(game.settings.invincible?' / INVINCIBLE':'');
 $('pause').textContent=game.paused?'▶':'Ⅱ';$('pause').setAttribute('aria-pressed',String(game.paused));
 const next=[game.state,game.paused,game.items.map(i=>i.count).join(','),game.ready,game.state==='dead'&&game.deathAge>=1.8,game.timer>1.2].join('/');if(signature===next)return;signature=next;const overlay=$('targets');overlay.replaceChildren();
 const target=(label,x,y,w,h,fn)=>{const b=document.createElement('button');b.setAttribute('aria-label',label);b.style.cssText=`left:${x/640*100}%;top:${y/480*100}%;width:${w/640*100}%;height:${h/480*100}%`;b.onclick=()=>{fn();syncUI();};overlay.append(b);};
 if(game.paused){target('Resume',0,0,640,480,()=>game.togglePause());return;}
 if(game.state==='dead'){if(game.deathAge>=1.8){target('Fight again',120,270,400,50,()=>game.confirm());target('Give up',120,325,400,50,()=>game.back());}return;}
 if(game.state==='menu')battleButtons(640,480).forEach((r,i)=>target(r.label,r.x,r.y,r.w,r.h,()=>game.chooseMenu(i)));
 else if(game.options().length)game.options().forEach((label,i)=>{const r=optionRect(i,game.options().length);target(label,r.x,r.y,r.w,r.h,()=>{game.option=i;game.confirm();});});
 else if(['dialogue','fight','spared','intro'].includes(game.state))target(game.state==='fight'?'Strike':game.state==='intro'?'Skip':game.state==='dialogue'?'Continue':'Play again',24,game.state==='dialogue'?30:100,592,game.state==='dialogue'?360:280,()=>game.confirm());
}
game.onEvent=event=>{syncUI();audio.effect(event);if(['text','turn','dead','end'].includes(event))$('live').textContent=game.state==='dead'?'You lose.':`${game.text}`;};
function unlockSound(e){if(e?.target?.closest?.('#sound'))return;if(!audio.enabled&&!audio.userMuted)void audio.enable(true).then(()=>$('sound').setAttribute('aria-pressed','true'));}
document.addEventListener('pointerdown',unlockSound);window.addEventListener('keydown',unlockSound);
const keyMap={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',Shift:'slow'};
window.addEventListener('keydown',e=>{if($('options').open||e.target instanceof HTMLSelectElement||e.target instanceof HTMLInputElement)return;const k=e.key.length===1?e.key.toLowerCase():e.key,dir=keyMap[k];if(!e.repeat&&konami.input(['up','down','left','right'].includes(dir)&&!['b','a'].includes(k)?dir:k)){e.preventDefault();syncUI();return;}if(dir){e.preventDefault();keys[dir]=true;if(!e.repeat&&dir!=='slow')game.navigate(dir==='left'?-1:dir==='right'?1:0,dir==='up'?-1:dir==='down'?1:0);}if(['z','Enter',' ','x','Escape','Backspace','p'].includes(k)){if(e.target instanceof HTMLButtonElement&&(k==='Enter'||k===' '))return;e.preventDefault();if(e.repeat&&!(game.state==='defend'&&game.mode==='yellow'))return;if(k==='p')game.togglePause();else if(['x','Escape','Backspace'].includes(k))game.back();else game.confirm();}syncUI();});
window.addEventListener('keyup',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if(keyMap[k])keys[keyMap[k]]=false;});
function clearInput(){Object.keys(keys).forEach(k=>keys[k]=false);Object.keys(touchKeys).forEach(k=>touchKeys[k]=false);touch=null;drag=null;document.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
function inactive(){clearInput();if(['defend','fight','warning'].includes(game.state)&&!game.paused)game.togglePause();}
window.addEventListener('blur',inactive);document.addEventListener('visibilitychange',()=>{if(document.hidden)inactive();});
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*640/r.width,y:(e.clientY-r.top)*480/r.height};}
// Touch: drag to move; a quick tap is the round's action (shoot, dash, turn back, punch).
canvas.addEventListener('pointerdown',e=>{if(game.paused||drag)return;if(['defend','warning'].includes(game.state)){e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);drag={id:e.pointerId,x:p.x,y:p.y,sx:game.soul.x,sy:game.soul.y,at:performance.now(),moved:0};touch=game.mode==='green'?p:{x:game.soul.x,y:game.soul.y};}canvas.focus({preventScroll:true});});
canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e);drag.moved=Math.max(drag.moved,Math.hypot(p.x-drag.x,p.y-drag.y));touch=game.mode==='green'?p:{x:drag.sx+p.x-drag.x,y:drag.sy+p.y-drag.y};});
const releaseDrag=e=>{if(drag?.id===e.pointerId){if(['defend','warning'].includes(game.state)&&drag.moved<12&&performance.now()-drag.at<300)game.confirm();touch=null;drag=null;}};canvas.addEventListener('pointerup',releaseDrag);canvas.addEventListener('pointercancel',releaseDrag);
document.querySelectorAll('.touch-controls button').forEach(b=>b.addEventListener('contextmenu',e=>e.preventDefault()));
document.querySelectorAll('[data-key]').forEach(button=>{const dir=button.dataset.key;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);touchKeys[dir]=true;button.classList.add('held');konami.input(dir);game.navigate(dir==='left'?-1:dir==='right'?1:0,dir==='up'?-1:dir==='down'?1:0);syncUI();});const release=()=>{touchKeys[dir]=false;button.classList.remove('held');};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);});
$('confirm').onclick=()=>{if(!konami.input('a'))game.confirm();syncUI();};$('back').onclick=()=>{if(!konami.input('b'))game.back();syncUI();};$('pause').onclick=()=>{clearInput();game.togglePause();};
$('restart').onclick=()=>{clearInput();game.reset();};
$('sound').onclick=async()=>{audio.userMuted=audio.enabled;await audio.enable(!audio.enabled);$('sound').setAttribute('aria-pressed',String(audio.enabled));$('sound').setAttribute('aria-label',audio.enabled?'Mute music and sound':'Enable music and sound');};
$('help').onclick=()=>{clearInput();resumeAfterOptions=!game.paused&&game.scene==='battle'&&game.state!=='intro';if(resumeAfterOptions)game.togglePause();$('options').showModal();};$('closeOptions').onclick=()=>$('options').close();$('options').addEventListener('close',()=>{if(resumeAfterOptions&&game.paused)game.togglePause();canvas.focus({preventScroll:true});});
$('difficulty').onchange=e=>{game.settings.difficulty=e.target.value;};$('motion').onchange=e=>{reduceMotion=e.target.checked;};
$('skipWalk').onchange=e=>{game.settings.skipIntro=e.target.checked;if(e.target.checked&&game.state==='intro')game.skipIntro();};
function frame(now){accumulator=Math.min(accumulator+(now-last)/1000,.1);last=now;if(audio.enabled&&!audio.track.paused&&audio.track.readyState>=2)game.song=audio.track.currentTime;const input={};for(const k of ['up','down','left','right','slow'])input[k]=keys[k]||touchKeys[k];input.touch=touch;while(accumulator>=1/120){game.update(1/120,input);accumulator-=1/120;}if(typing()&&game.clock-textSound>.07){audio.blip(game.speaker);textSound=game.clock;}syncUI();render();requestAnimationFrame(frame);}
syncUI();render();requestAnimationFrame(frame);
window.battleDebug={game,render,syncUI,audio};

// Seth's supplied weapon: two timed strikes, spin, then a single resolved impact.
const notebookVisual=new NotebookVisual(ctx,{enabled:()=>audio.enabled,paused:()=>game.paused,calm:()=>reduceMotion});
installNotebook(game,{kind:'rift',target:()=>({x:320,y:80}),event:(type,n)=>notebookVisual.event(type,n)});
notebookVisual.fx.bind(game,{hurt:fx=>fx.hurt(),dead:fx=>fx.kick(.55)});
const beforeNotebookRender=render;
render=function(){game.notebookRender(beforeNotebookRender);if(game.state!=='intro')notebookVisual.draw(game);};
canvas.addEventListener('pointerdown',event=>{const n=game.notebook;if(!n.active)return;const r=canvas.getBoundingClientRect(),x=(event.clientX-r.left)*canvas.width/r.width,y=(event.clientY-r.top)*canvas.height/r.height,s=canvas.width/640,top=canvas.height-231*s;if(x>=24*s&&x<=616*s&&y>=top&&y<=top+140*s){event.preventDefault();event.stopImmediatePropagation();game.confirm();}},{capture:true});

})().catch(console.error);</script>
</body></html>
