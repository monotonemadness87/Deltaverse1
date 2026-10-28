// Marigold's frames (cleaned from the designer's example sheet), human Seth's walk, the overworld Flowey,
// and the procedurally painted rooms of the walk. Everything is drawn with whole pixels.
const FRAMES=__MARIGOLD_FRAMES__;
const SETH=__SETH_FRAMES__;
const ROOMS=__ROOMS__;
const img=src=>{const i=new Image();i.src=src;return i;};
const FACES={neutral:'face_neutral',smile:'face_smile',serious:'face_serious',sad:'face_sad',angry:'face_angry',deranged:'face_deranged',blink:'face_blink0',eye:'face_eye2'};
class MarigoldArt{
 constructor(ctx){this.ctx=ctx;this.sheet=img("__MARIGOLD_PNG__");this.seth=img("__SETH_PNG__");this.floweyImg=img("__FLOWEY_PNG__");this.rooms={};for(const [k,v] of Object.entries(ROOMS))this.rooms[k]=img(v);}
 ready(i){return i.complete&&i.naturalWidth;}
 has(name){return !!FRAMES[name];}
 size(name){const f=FRAMES[name];return f?{w:f[2],h:f[3]}:{w:0,h:0};}
 // Draw a frame anchored at its bottom centre (or centre), at a whole-number scale.
 frame(name,x,y,scale=2,{anchor='bottom',flip=false,alpha=1,tint=null,clipBottom=0}={}){
  const f=FRAMES[name];if(!f||!this.ready(this.sheet))return;const c=this.ctx,[sx,sy,w,h]=f,dw=w*scale,dh=(h-clipBottom)*scale;
  c.save();c.imageSmoothingEnabled=false;c.globalAlpha*=alpha;c.translate(Math.round(x),Math.round(y));if(flip)c.scale(-1,1);
  const ox=-Math.round(dw/2),oy=anchor==='bottom'?-Math.round(h*scale):-Math.round(dh/2);
  if(tint){
   // Tint only her own pixels: compose on a scratch canvas, never on what is already on screen.
   const t=this.scratch??=document.createElement('canvas');t.width=w;t.height=h-clipBottom;const x=t.getContext('2d');x.imageSmoothingEnabled=false;x.clearRect(0,0,w,h);x.drawImage(this.sheet,sx,sy,w,h-clipBottom,0,0,w,h-clipBottom);x.globalCompositeOperation='source-atop';x.fillStyle=tint;x.fillRect(0,0,w,h);x.globalCompositeOperation='source-over';
   c.drawImage(t,0,0,w,h-clipBottom,ox,oy,dw,dh);
  }else c.drawImage(this.sheet,sx,sy,w,h-clipBottom,ox,oy,dw,dh);
  c.restore();
 }
 // Silhouette of a frame (for the static-white hurt flash and dust-free death).
 portrait(face,x,y,size){const name=FACES[face]||FACES.neutral,f=FRAMES[name];if(!f||!this.ready(this.sheet))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=false;c.drawImage(this.sheet,f[0],f[1],f[2],f[3],Math.round(x),Math.round(y),size,Math.round(size*f[3]/f[2]));c.restore();}
 sethFrame(dir,moving,t,x,y){
  if(!this.ready(this.seth))return;const phase=moving?['stepA','stand','stepB','stand'][Math.floor(t*6.5)%4]:'stand';const f=SETH[dir+'_'+phase]||SETH.down_stand,c=this.ctx;
  c.save();c.imageSmoothingEnabled=false;c.drawImage(this.seth,f[0],f[1],f[2],f[3],Math.round(x-f[2]),Math.round(y-f[3]*2),f[2]*2,f[3]*2);c.restore();
 }
 flowey(x,y,rise=1){if(!this.ready(this.floweyImg))return;const c=this.ctx,w=this.floweyImg.naturalWidth,h=this.floweyImg.naturalHeight,shown=Math.max(0,Math.min(1,rise));if(!shown)return;c.save();c.imageSmoothingEnabled=false;c.beginPath();c.rect(x-w/2,y-h,w,h);c.clip();c.drawImage(this.floweyImg,Math.round(x-w/2),Math.round(y-h*shown),w,h);c.restore();}
 // ------------------------------------------------------------- rooms
 px(x,y,w,h,col){const c=this.ctx;c.fillStyle=col;c.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,Math.max(2,Math.round(w/2)*2),Math.max(2,Math.round(h/2)*2));}
 buttercup(x,y){this.px(x-1,y,2,8,'#3a6b3a');for(const [dx,dy] of [[-4,-2],[2,-2],[-3,-6],[1,-6],[-1,-4]])this.px(x+dx,y+dy-2,4,4,'#f2c93a');this.px(x-1,y-6,2,2,'#c4452f');}
 thornSpike(x,y,h){const c=this.ctx;c.fillStyle='#7d0f24';c.beginPath();c.moveTo(Math.round(x-6),Math.round(y));c.lineTo(Math.round(x),Math.round(y-h));c.lineTo(Math.round(x+6),Math.round(y));c.fill();c.fillStyle='#e0304d';c.fillRect(Math.round(x-1),Math.round(y-h+4),2,Math.round(h-6));}
 // The walk's rooms are painted at 1x (tools/paint_rooms.py) and shown at 2x, scrolled by the camera.
 room(name,cam,t,genocide,read=[]){
  const c=this.ctx,im=this.rooms[name+(genocide?'-g':'-p')];if(!this.ready(im))return;const sx=Math.floor(cam/2);
  c.save();c.imageSmoothingEnabled=false;c.drawImage(im,sx,0,320,240,0,0,640,480);c.restore();
  if(name==='gallery')for(let i=0;i<6;i++){if(!read[i])continue;const x=(39+i*116)*2-cam,pulse=(Math.sin(t*2.4+i)+1)/2;c.save();c.globalAlpha=.08+.06*pulse;c.fillStyle='#d8ccff';c.fillRect(x+4,64,184,164);c.restore();}
  if(name!=='gallery'&&name!=='memorial')this.snow(t,genocide);
  if(name==='memorial')this.motes(t);
 }
 backdrop(genocide,alpha=1){const im=this.rooms[genocide?'battle-g':'battle-p'];if(!this.ready(im))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=false;c.globalAlpha=alpha;c.drawImage(im,0,0,320,240,0,0,640,480);c.restore();}
 foreground(name,cam){if(name!=='forest')return;const im=this.rooms['forest-fg'];if(!this.ready(im))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=false;c.drawImage(im,Math.floor(cam/2),0,320,240,0,0,640,480);c.restore();}
 snow(t,genocide){for(let i=0;i<54;i++){const x=((i*83+t*(10+i%5*3)+Math.sin(t*.7+i)*12)%660+660)%660-10,y=((i*61+t*(22+i%7*5))%500);this.px(x,y,2,2,genocide&&i%9===0?'#b7a0aa':'#eef3fb');}}
 motes(t){for(let i=0;i<26;i++){const x=330+((i*47)%220)+Math.sin(t*.5+i)*14,y=460-((i*37+t*(9+i%4*3))%420);this.px(x,y,2,2,i%3?'#cff3c4':'#f2c93a');}}
}
Object.assign(exports,{MarigoldArt,FACES});
