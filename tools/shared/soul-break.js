modules["soul-break.js"]=(exports,require)=>{
class SoulBreak {
 constructor(ctx,heart){this.ctx=ctx;this.heart=heart;}
 draw(game,{x,y,size=24,reduced=false}={}){
  const c=this.ctx,t=game.deathAge||0;
  c.save();c.globalAlpha=1;c.fillStyle='#000';c.fillRect(0,0,c.canvas.width,c.canvas.height);
  const split=Math.max(0,Math.min(1,(t-.35)/.6)),fade=Math.max(0,1-(t-1.15)/.65);
  if(t<1.8){
   for(const side of [-1,1]){const dx=side*split*(reduced?9:18),dy=side>0?split*4:0;c.save();c.beginPath();c.rect(x+dx+(side<0?-size/2:0),y+dy-size/2,size/2,size);c.clip();this.heart(x+dx,y+dy,size,fade);c.restore();}
   if(t>.95&&!reduced){const age=t-.95;for(let i=0;i<8;i++){const angle=i*Math.PI/4-.3,dist=age*100,px=x+Math.cos(angle)*dist,py=y+Math.sin(angle)*dist+age*age*40;c.save();c.globalAlpha=Math.max(0,1-age/.85);c.beginPath();c.rect(px-2,py-2,4,4);c.clip();this.heart(px,py,12,1);c.restore();}}
  }c.restore();return t>=1.8;
 }
}

Object.assign(exports,{SoulBreak});
};
