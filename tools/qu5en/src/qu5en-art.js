// QU5EN's frames: the giant wireframe head, her vector fighter, her talk heads, Seth's arcade fighter (the blue
// fighter recoloured purple), the arcade text and bursts, all cleaned from the designer's sheets; plus the globe.
const FRAMES=__QU5EN_FRAMES__;
const img=src=>{const i=new Image();i.src=src;return i;};
class QueenArt{
 constructor(ctx){this.ctx=ctx;this.sheet=img("__QU5EN_PNG__");this.globe=img("__GLOBE_PNG__");}
 ready(i){return i.complete&&i.naturalWidth;}
 has(n){return !!FRAMES[n];}
 size(n){const f=FRAMES[n];return f?[f[2],f[3]]:[0,0];}
 // A frame anchored at its bottom centre (or centre), at a whole-number scale; tint recolours only its pixels.
 frame(name,x,y,scale=1,{anchor='bottom',flip=false,alpha=1,tint=null,clip=1}={}){
  const f=FRAMES[name];if(!f||!this.ready(this.sheet))return;const c=this.ctx,[sx,sy,w,h]=f,dw=w*scale,dh=h*scale,hh=Math.max(1,Math.round(h*clip));
  c.save();c.imageSmoothingEnabled=false;c.globalAlpha*=alpha;c.translate(Math.round(x),Math.round(y));if(flip)c.scale(-1,1);
  const ox=-Math.round(dw/2),oy=anchor==='bottom'?-dh:anchor==='top'?0:-Math.round(dh/2);
  if(tint){const t=this.scratch??=document.createElement('canvas');t.width=w;t.height=h;const x2=t.getContext('2d');x2.imageSmoothingEnabled=false;x2.clearRect(0,0,w,h);x2.drawImage(this.sheet,sx,sy,w,h,0,0,w,h);x2.globalCompositeOperation='source-in';x2.fillStyle=tint;x2.fillRect(0,0,w,h);x2.globalCompositeOperation='source-over';c.drawImage(t,0,0,w,hh,ox,oy,dw,hh*scale);}
  else c.drawImage(this.sheet,sx,sy,w,hh,ox,oy,dw,hh*scale);
  c.restore();
 }
 backdrop(alpha=1,turn=0){if(!this.ready(this.globe))return;const c=this.ctx;c.save();c.imageSmoothingEnabled=false;c.globalAlpha=alpha;c.drawImage(this.globe,0,0,320,240,0,0,640,480);c.restore();}
}
Object.assign(exports,{QueenArt});
