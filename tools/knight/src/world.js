const S=require("story.js");
// The crystal room: the whole walk. Seth arrives, remembers what Gerson told him about the crystal (the lore), can
// listen to the echo flowers around the room, and touches the crystal. Coordinates are screen pixels.
const ROOM_DATA={
 cavern:{w:640,floor:[352,440],objects:[{id:'echo0',x:90,y:380,r:50},{id:'echo1',x:176,y:420,r:46},{id:'echo2',x:464,y:420,r:46},{id:'echo3',x:550,y:380,r:50},{id:'crystal',x:320,y:362,r:86}]}
};
class World{
 constructor(game){this.game=game;this.reset();}
 reset(){this.room='cavern';this.seth={x:320,y:436,dir:'up',step:0,moving:false};this.flags={};this.fade=0;this.fadeTo=null;this.wait=null;this.title=1.6;this.manifest=null;this.enter();}
 get data(){return ROOM_DATA[this.room];}
 enter(){this.title=1.6;if(!this.flags.lore){this.flags.lore=true;this.say(S.ARRIVE);}}
 say(lines,then){this.game.message(lines,then||'world');}
 pause(time,then){this.game.state='scene';this.wait={time,then};}
 camera(){return 0;}
 nearest(){let best=null,bd=1e9;for(const o of this.data.objects){const d=Math.hypot(this.seth.x-o.x,(this.seth.y-o.y)*1.4);if(d<o.r&&d<bd){bd=d;best=o;}}return best;}
 interact(){
  if(this.manifest)return;const o=this.nearest();if(!o)return;
  if(o.id.startsWith('echo')){const i=Number(o.id.slice(4));this.flags['echo'+i]=true;this.flags.lastEcho={i,t:this.game.clock};this.game.emit('echo');this.say(S.ECHO[i]);}
  else if(o.id==='crystal'){this.seth.dir='up';this.say([...S.CRYSTAL_LOOK,...S.TOUCH],()=>this.awaken());}
 }
 // Seth's SOUL wakes the crystal: light builds, three hearts fly out, and they become one knight.
 awaken(){this.manifest={t:0};this.game.emit('awaken');this.pause(3.4,()=>this.say(S.MANIFEST,()=>this.game.startBattle()));}
 update(dt,input){
  this.title=Math.max(0,this.title-dt);if(this.manifest)this.manifest.t+=dt;
  if(this.wait&&this.game.state==='scene'){this.wait.time-=dt;if(this.wait.time<=0){const then=this.wait.then;this.wait=null;this.game.state='world';then?.();}}
  if(this.game.state!=='world'){this.seth.moving=false;return;}
  const s=this.seth,sx=Number(!!input.right)-Number(!!input.left),sy=Number(!!input.down)-Number(!!input.up);
  let tx=sx,ty=sy;if(input.touch){const dx=input.touch.x-s.x,dy=input.touch.y-(s.y-40);if(Math.hypot(dx,dy)>30){tx=Math.abs(dx)>20?Math.sign(dx):0;ty=Math.abs(dy)>20?Math.sign(dy):0;}}
  s.moving=!!(tx||ty);const speed=input.slow?110:180;
  if(s.moving){s.x+=tx*speed*dt;s.y+=ty*speed*dt;s.step+=dt;s.dir=ty&&!tx?(ty<0?'up':'down'):tx<0?'left':'right';}else s.step=0;
  const [y0,y1]=this.data.floor;s.y=Math.max(y0,Math.min(y1,s.y));s.x=Math.max(30,Math.min(this.data.w-30,s.x));
  // The crystal's plinth is solid.
  if(s.y<372&&Math.abs(s.x-320)<70)s.y=372;
 }
}
Object.assign(exports,{World,ROOM_DATA});
