modules["soul-visual.js"]=(exports,require)=>{
const COLORS={red:'#b249dc',purple:'#b249dc',blue:'#4264ff',yellow:'#ffec37',green:'#43e750',orange:'#ff9d27',cyan:'#3ee0ed',white:'#ffffff'};
class SoulVisual{
 constructor(ctx,image){this.ctx=ctx;this.image=image;this.tints=new Map();this.angle=0;this.target=0;this.from=0;this.turnTime=.24;this.lastClock=0;}
 advance(clock,mode='red',gravity=1){const dt=Math.max(0,Math.min(.05,clock-this.lastClock));this.lastClock=clock;const desired=mode==='yellow'||mode==='blue'&&gravity<0?Math.PI:0;if(desired!==this.target){this.target=desired;this.from=this.angle;this.delta=Math.atan2(Math.sin(desired-this.angle),Math.cos(desired-this.angle));this.turnTime=0;}this.turnTime=Math.min(.24,this.turnTime+dt);if(this.turnTime<.24){const t=this.turnTime/.24,e=t*t*(3-2*t);this.angle=this.from+this.delta*e;}else this.angle=this.target;}
 sprite(color='purple'){const im=this.image;if(!im.complete||!im.naturalWidth)return;const tint=COLORS[color]||COLORS.purple;let sprite=this.tints.get(tint);if(!sprite){sprite=document.createElement('canvas');sprite.width=sprite.height=16;const c=sprite.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(im,0,0,16,16);c.globalCompositeOperation='source-in';c.fillStyle=tint;c.fillRect(0,0,16,16);this.tints.set(tint,sprite);}return sprite;}
 draw(x,y,size=16,color='purple',alpha=1,angle=0){const sprite=this.sprite(color);if(!sprite)return;const c=this.ctx;c.save();c.globalAlpha*=alpha;c.translate(Math.round(x),Math.round(y));c.rotate(angle);c.drawImage(sprite,-size/2,-size/2,size,size);c.restore();}
}

Object.assign(exports,{SoulVisual});
};
