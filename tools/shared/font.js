modules["font.js"]=(exports,require)=>{
// User-provided Determination font; attribution and license in fonts/.
const fontSize=size=>[0,12,24,24,36,48][size]??size*12;
function pixelText(ctx){
 function text(str,x,y,size=2,color='#fff',center=false){
  ctx.save();ctx.font=`${fontSize(size)}px "Determination", monospace`;ctx.textBaseline='alphabetic';ctx.textAlign=center?'center':'left';ctx.fillStyle=color;ctx.fillText(String(str),Math.round(x),Math.round(y+fontSize(size)*.75));ctx.restore();
 }
 text.measure=(str,size=2)=>{ctx.save();ctx.font=`${fontSize(size)}px "Determination", monospace`;const width=ctx.measureText(String(str)).width;ctx.restore();return width;};
 return text;
}

Object.assign(exports,{pixelText});
};
