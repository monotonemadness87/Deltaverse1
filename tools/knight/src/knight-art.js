// The Knight's frames (placeholders cut from the designer's concept sheet until the real sheets arrive), human Seth's
// walk (Marigold's), Gerson behind his counter (from his own fight's art), and the painted rooms, plus the things in
// them that are alive: echo flowers, ceiling gems, the crystal, the stream. Everything is drawn with whole pixels.
const FRAMES=__KNIGHT_FRAMES__;
const SETH=__SETH_FRAMES__;
const GERSON=__GERSON_FRAMES__;
const ROOMS=__ROOMS__;
const img=src=>{const i=new Image();i.src=src;return i;};
class KnightArt{
 constructor(ctx){this.ctx=ctx;this.sheet=img("__KNIGHT_PNG__");this.seth=img("__SETH_PNG__");this.gersonSheet=img("__GERSON_PNG__");this.rooms={};for(const [k,v] of Object.entries(ROOMS))this.rooms[k]=img(v);}
 ready(i){return i.complete&&i.naturalWidth;}
 has(name){return !!FRAMES[name];}
 size(name){const f=FRAMES[name];return f?{w:f[2],h:f[3]}:{w:0,h:0};}
 // A frame anchored at its bottom centre (or centre).
 frame(name,x,y,scale=1,{anchor='bottom',flip=false,alpha=1,tint=null,smooth=false}={}){
  const f=FRAMES[name];if(!f||!this.ready(this.sheet))return;const c=this.ctx,[sx,sy,w,h]=f,dw=Math.round(w*scale),dh=Math.round(h*scale);
  c.save();c.imageSmoothingEnabled=smooth;c.globalAlpha*=alpha;c.translate(Math.round(x),Math.round(y));if(flip)c.scale(-1,1);
  const ox=-Math.round(dw/2),oy=anchor==='bottom'?-dh:-Math.round(dh/2);
  if(tint){const t=this.scratch??=document.createElement('canvas');t.width=w;t.height=h;const x2=t.getContext('2d');x2.clearRect(0,0,w,h);x2.drawImage(this.sheet,sx,sy,w,h,0,0,w,h);x2.globalCompositeOperation='source-atop';x2.fillStyle=tint;x2.fillRect(0,0,w,h);x2.globalCompositeOperation='source-over';c.drawImage(t,0,0,w,h,ox,oy,dw,dh);}
  else c.drawImage(this.sheet,sx,sy,w,h,ox,oy,dw,dh);
  c.restore();
 }
 sethFrame(dir,moving,t,x,y,scale=2,alpha=1){
  if(!this.ready(this.seth))return;const phase=moving?['stepA','stand','stepB','stand'][Math.floor(t*6.5)%4]:'stand';const f=SETH[dir+'_'+phase]||SETH.down_stand,c=this.ctx;
  c.save();c.globalAlpha*=alpha;c.imageSmoothingEnabled=false;c.drawImage(this.seth,f[0],f[1],f[2],f[3],Math.round(x-f[2]*scale/2),Math.round(y-f[3]*scale),f[2]*scale,f[3]*scale);c.restore();
 }
 gerson(name,x,y,scale=1){const f=GERSON[name];if(!f||!this.ready(this.gersonSheet))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=false;c.drawImage(this.gersonSheet,f[0],f[1],f[2],f[3],Math.round(x-f[2]*scale/2),Math.round(y-f[3]*scale),Math.round(f[2]*scale),Math.round(f[3]*scale));c.restore();}
 gersonFace(x,y,size){const f=GERSON.face;if(!f||!this.ready(this.gersonSheet))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=true;c.drawImage(this.gersonSheet,f[0],f[1],f[2],f[3],Math.round(x),Math.round(y),size,Math.round(size*f[3]/f[2]));c.restore();}
 portrait(x,y,size){const f=FRAMES.portrait;if(!f||!this.ready(this.sheet))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=false;c.drawImage(this.sheet,f[0],f[1],f[2],f[3],Math.round(x),Math.round(y),size,Math.round(size*f[3]/f[2]));c.restore();}
 px(x,y,w,h,col){const c=this.ctx;c.fillStyle=col;c.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,Math.max(2,Math.round(w/2)*2),Math.max(2,Math.round(h/2)*2));}
 // An echo flower: a pale cyan bloom on a stem, glowing; bright right after it speaks.
 echoFlower(x,y,t,lit){const c=this.ctx,glow=.18+.08*Math.sin(t*1.8+x)+lit*.5,g=c.createRadialGradient(x,y-34,2,x,y-34,40);g.addColorStop(0,`rgba(120,220,255,${glow})`);g.addColorStop(1,'rgba(120,220,255,0)');c.fillStyle=g;c.fillRect(x-40,y-74,80,80);
  this.px(x-1,y-30,2,30,'#2a6a8a');this.px(x-6,y-14,6,2,'#2a6a8a');this.px(x+1,y-20,6,2,'#2a6a8a');
  for(const [dx,dy] of [[-6,-36],[2,-36],[-6,-44],[2,-44],[-2,-48],[-2,-32]])this.px(x+dx,y+dy,6,6,lit>.3?'#e8fbff':'#8ee0ff');this.px(x-2,y-40,4,4,'#ffffff');}
 // Little gems in the ceiling: Waterfall's stars. People wish on them.
 gems(t,cam,w,seed=7){for(let i=0;i<46;i++){const x=((i*137+seed*31)%w)-cam,y=8+((i*53)%120);if(x<-4||x>644)continue;const tw=(Math.sin(t*(1.2+i%5*.3)+i)+1)/2;this.px(x,y,2,2,tw>.7?'#ffffff':tw>.35?'#9ac8ff':'#3a5aa0');}}
 stream(t,cam,y0=428){for(let i=0;i<40;i++){const x=((i*71-t*40)%1500+1500)%1500-cam,y=y0+((i*13)%46);if(x<-8||x>648)continue;this.px(x,y,8+(i%3)*4,2,'#6ab0ff');}}
 // The crystal: tall, faceted, pale. awake (0..1) floods it with light from inside.
 crystal(x,y,t,awake=0){
  const c=this.ctx,pulse=(Math.sin(t*1.4)+1)/2,lum=.25+.1*pulse+awake*.75;
  const g=c.createRadialGradient(x,y-90,4,x,y-90,150+awake*200);g.addColorStop(0,`rgba(170,215,255,${.22+awake*.6})`);g.addColorStop(1,'rgba(170,215,255,0)');c.fillStyle=g;c.fillRect(x-360,y-440,720,560);
  const P=[[0,-196],[34,-140],[42,-40],[20,0],[-20,0],[-42,-40],[-34,-140]];
  c.save();c.beginPath();P.forEach(([dx,dy],k)=>k?c.lineTo(x+dx,y+dy):c.moveTo(x+dx,y+dy));c.closePath();
  c.fillStyle=`rgba(${Math.round(150+100*lum)},${Math.round(190+60*lum)},255,${.55+.4*lum})`;c.fill();c.lineWidth=2;c.strokeStyle='#e8f4ff';c.stroke();
  c.beginPath();c.moveTo(x,y-196);c.lineTo(x-8,y-60);c.lineTo(x,y);c.moveTo(x,y-196);c.lineTo(x+14,y-90);c.lineTo(x+20,y);c.moveTo(x-34,y-140);c.lineTo(x+14,y-90);c.strokeStyle=`rgba(255,255,255,${.35+.4*lum})`;c.lineWidth=1;c.stroke();c.restore();
  // Something looking back from inside: a single light.
  const s=4+awake*10;c.fillStyle='#ffffff';c.fillRect(Math.round(x-1),Math.round(y-120-s),2,Math.round(s*2));c.fillRect(Math.round(x-s),Math.round(y-121),Math.round(s*2),2);
 }
 room(name,cam){const c=this.ctx,im=this.rooms[name];if(!this.ready(im))return;c.save();c.imageSmoothingEnabled=false;c.drawImage(im,Math.floor(cam/2),0,320,240,0,0,640,480);c.restore();}
 backdrop(alpha=1){const im=this.rooms.battle;if(!this.ready(im))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=false;c.globalAlpha=alpha;c.drawImage(im,0,0,320,240,0,0,640,480);c.restore();}
 // The Deltarune battle's background: a slow scrolling grid, here in the Knight's crystal blue and violet.
 drBackdrop(t,alpha=1,still=false){const c=this.ctx,o=still?0:(t*14)%40;c.save();c.globalAlpha=alpha;c.fillStyle='#000';c.fillRect(0,0,640,330);
  for(const [col,off,size] of [['#0c1a44',o,40],['#1b1150',(still?0:t*8)%60,60]]){c.strokeStyle=col;c.lineWidth=2;c.beginPath();for(let x=-size+off;x<660;x+=size){c.moveTo(Math.round(x),0);c.lineTo(Math.round(x),330);}for(let y=-size+off;y<340;y+=size){c.moveTo(0,Math.round(y));c.lineTo(640,Math.round(y));}c.stroke();}
  c.restore();}
}
Object.assign(exports,{KnightArt});
