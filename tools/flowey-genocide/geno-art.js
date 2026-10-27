modules["geno-art.js"]=(exports,require)=>{
// The genocide bosses Flowey replays, cropped from their own games at the size he draws them.
const SOURCES=__SOURCES__;
class GenoArt{
 constructor(ctx){this.ctx=ctx;this.images={};for(const [name,src] of Object.entries(SOURCES)){const im=new Image();im.src=src;this.images[name]=im;}}
 // Centred on (x,y), fitted inside w×h, pixel-sharp.
 draw(name,x,y,w,h,angle=0,alpha=1){const ctx=this.ctx,im=this.images[name];if(!im?.complete||!im.naturalWidth)return false;const s=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=Math.round(im.naturalWidth*s),dh=Math.round(im.naturalHeight*s);ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha*=alpha;ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);ctx.drawImage(im,-Math.floor(dw/2),-Math.floor(dh/2),dw,dh);ctx.restore();return true;}
}
Object.assign(exports,{GenoArt});
};
