// Count Anansi's frames (cleaned from the designer's sheets), human Seth's walk, the painted rooms,
// and his procedural props: spiders on threads, playbills, candelabras, fang blades, web curtains, his teapot.
const FRAMES=__ANANSI_FRAMES__;
const SETH=__SETH_FRAMES__;
const ROOMS=__ROOMS__;
const img=src=>{const i=new Image();i.src=src;return i;};
class AnansiArt{
 constructor(ctx){this.ctx=ctx;this.sheet=img("__ANANSI_PNG__");this.seth=img("__SETH_PNG__");this.rooms={};for(const [k,v] of Object.entries(ROOMS))this.rooms[k]=img(v);}
 ready(i){return i.complete&&i.naturalWidth;}
 has(name){return !!FRAMES[name];}
 // A frame anchored at its bottom centre (or centre), at a whole-number scale; an optional tint touches only his pixels.
 frame(name,x,y,scale=2,{anchor='bottom',flip=false,alpha=1,tint=null,rot=0}={}){
  const f=FRAMES[name];if(!f||!this.ready(this.sheet))return;const c=this.ctx,[sx,sy,w,h]=f,dw=w*scale,dh=h*scale;
  c.save();c.imageSmoothingEnabled=false;c.globalAlpha*=alpha;c.translate(Math.round(x),Math.round(y));if(rot)c.rotate(rot);if(flip)c.scale(-1,1);
  const ox=-Math.round(dw/2),oy=anchor==='bottom'?-dh:-Math.round(dh/2);
  if(tint){const t=this.scratch??=document.createElement('canvas');t.width=w;t.height=h;const x2=t.getContext('2d');x2.imageSmoothingEnabled=false;x2.clearRect(0,0,w,h);x2.drawImage(this.sheet,sx,sy,w,h,0,0,w,h);x2.globalCompositeOperation='source-atop';x2.fillStyle=tint;x2.fillRect(0,0,w,h);x2.globalCompositeOperation='source-over';c.drawImage(t,0,0,w,h,ox,oy,dw,dh);}
  else c.drawImage(this.sheet,sx,sy,w,h,ox,oy,dw,dh);
  c.restore();
 }
 // A portrait centred vertically on y.
 portrait(face,x,y,size){const f=FRAMES['face_'+face]||FRAMES.face_neutral;if(!f||!this.ready(this.sheet))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=false;const h=Math.round(size*f[3]/f[2]);c.drawImage(this.sheet,f[0],f[1],f[2],f[3],Math.round(x),Math.round(y-h/2),size,h);c.restore();}
 sethFrame(dir,moving,t,x,y){
  if(!this.ready(this.seth))return;const phase=moving?['stepA','stand','stepB','stand'][Math.floor(t*6.5)%4]:'stand';const f=SETH[dir+'_'+phase]||SETH.down_stand,c=this.ctx;
  c.save();c.imageSmoothingEnabled=false;c.drawImage(this.seth,f[0],f[1],f[2],f[3],Math.round(x-f[2]),Math.round(y-f[3]*2),f[2]*2,f[3]*2);c.restore();
 }
 // The count in the overworld: four facings and a six-frame walk.
 countFrame(dir,moving,t,x,y){const n={down:6,left:5,right:5,up:6}[dir]||6,name=moving?`walk_${dir}${Math.floor(t*8)%n}`:`ow_${dir}`;this.frame(name,x,y,2);}
 room(name,cam,genocide){const c=this.ctx,im=this.rooms[name+(genocide?'-g':'-p')];if(!this.ready(im))return;c.save();c.imageSmoothingEnabled=false;c.drawImage(im,Math.floor(cam/2),0,320,240,0,0,640,480);c.restore();}
 backdrop(genocide,alpha=1){const im=this.rooms[genocide?'battle-g':'battle-p'];if(!this.ready(im))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=false;c.globalAlpha=alpha;c.drawImage(im,0,0,320,240,0,0,640,480);c.restore();}
 // ------------------------------------------------------------- props, all whole-pixel
 px(x,y,w,h,col){const c=this.ctx;c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));}
 spider(x,y,t=0,{burning=false,scale=1,eye='#ff7a2a'}={}){const s=scale,leg=Math.round(Math.sin(t*16))*s;const P=(dx,dy,w,h,col)=>this.px(x+dx*s,y+dy*s,w*s,h*s,col);
  P(-4,-3,8,6,'#0c0608');P(-3,-5,6,2,'#0c0608');for(const k of [-1,1]){P(k*4,-2+leg/s,k*3,1,'#0c0608');P(k*4,0,k*4,1,'#0c0608');P(k*4,2-leg/s,k*3,1,'#0c0608');P(k*7,-3+leg/s,1,2,'#0c0608');P(k*8,1,1,2,'#0c0608');}
  P(-2,-3,1,1,eye);P(1,-3,1,1,eye);P(-2,-1,4,1,'#3a1a20');
  if(burning){for(let i=0;i<4;i++){const fy=-6-((t*40+i*7)%10);this.px(x+(i-1.5)*3*s,y+fy*s,2*s,3*s,i%2?'#ffb040':'#ff5a20');}}}
 playbill(x,y,rot){const c=this.ctx;c.save();c.translate(Math.round(x),Math.round(y));c.rotate(rot);c.fillStyle='#2a1420';c.fillRect(-6,-8,12,16);c.fillStyle='#efe0c0';c.fillRect(-5,-7,10,14);c.fillStyle='#a02a2a';c.fillRect(-4,-6,8,2);c.fillStyle='#6a4a30';c.fillRect(-4,-2,8,1);c.fillRect(-4,1,6,1);c.fillRect(-4,4,7,1);c.restore();}
 candelabra(x,y,px,py){const c=this.ctx;c.save();c.strokeStyle='#5a4a2a';c.lineWidth=2;c.beginPath();c.moveTo(px,py);c.lineTo(x,y);c.stroke();c.restore();this.px(x-11,y-2,22,3,'#a07a2a');this.px(x-1,y-2,2,10,'#a07a2a');for(const dx of [-10,0,10]){this.px(x+dx-1,y-8,3,6,'#e8d8b8');this.px(x+dx-1,y-12,3,4,'#ffb040');this.px(x+dx,y-14,1,2,'#fff2a0');}}
 blade(x,y,rot){const c=this.ctx;c.save();c.translate(Math.round(x),Math.round(y));c.rotate(rot);c.fillStyle='#c41a30';c.beginPath();c.moveTo(0,-9);c.lineTo(4,0);c.lineTo(0,9);c.lineTo(-4,0);c.closePath();c.fill();c.fillStyle='#ff6a6a';c.fillRect(-1,-6,1,8);c.restore();}
 teapot(x,y,phase,t,scale=2){const tilt=phase==='tilt'?Math.min(1,t/.45)*.7:.7,c=this.ctx;c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);c.rotate(tilt);c.fillStyle='#1a0c10';c.fillRect(-11,-10,20,14);c.fillStyle='#c48a3a';c.fillRect(-10,-9,18,12);c.fillStyle='#e8b85a';c.fillRect(-10,-9,18,2);c.fillStyle='#c48a3a';c.fillRect(8,-6,7,3);c.fillRect(-14,-6,4,7);c.fillRect(-3,-13,6,3);c.restore();}
}
Object.assign(exports,{AnansiArt});
