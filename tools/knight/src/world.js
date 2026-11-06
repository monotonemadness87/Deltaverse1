const S=require("story.js");
// The walk: Gerson's shop -> the old path (echo flowers; a hidden crack at the far end) -> the crystal.
// Coordinates are screen pixels; the rooms are painted at 1x and shown at 2x.
const ROOM_DATA={
 shop:{w:640,floor:[306,440],objects:[{id:'gerson',x:464,y:318,r:84},{id:'lantern',x:242,y:316,r:44},{id:'west',x:74,y:316,r:44},{id:'shelf',x:600,y:316,r:30}]},
 path:{w:1440,floor:[322,416],objects:[0,1,2,3].map(i=>({id:'echo'+i,x:260+i*290,y:330,r:54})).concat([{id:'crack',x:1386,y:330,r:52}])},
 cavern:{w:640,floor:[352,440],objects:[{id:'crystal',x:320,y:362,r:86}]}
};
class World{
 constructor(game){this.game=game;this.reset();}
 reset(){this.room='shop';this.seth={x:300,y:380,dir:'right',step:0,moving:false};this.flags={};this.fade=0;this.fadeTo=null;this.wait=null;this.title=1.6;this.manifest=null;this.enter();}
 get data(){return ROOM_DATA[this.room];}
 enter(){this.title=1.6;const first=!this.flags['enter_'+this.room];this.flags['enter_'+this.room]=true;if(first&&this.room==='shop')this.say(S.SHOP_ENTER);}
 say(lines,then){this.game.message(lines,then||'world');}
 pause(time,then){this.game.state='scene';this.wait={time,then};}
 camera(){return Math.max(0,Math.min(this.data.w-640,this.seth.x-320));}
 go(room,x,y){this.fadeTo={room,x,y};this.fade=0;this.game.emit('door');}
 nearest(){let best=null,bd=1e9;for(const o of this.data.objects){const d=Math.hypot(this.seth.x-o.x,(this.seth.y-o.y)*1.4);if(d<o.r&&d<bd){bd=d;best=o;}}return best;}
 interact(){
  if(this.fadeTo||this.manifest)return;const o=this.nearest();if(!o)return;
  if(o.id==='gerson'){if(this.flags.gerson)this.say(S.GERSON_AGAIN);else{this.flags.gerson=true;this.say(S.GERSON_FIRST);}}
  else if(o.id==='lantern')this.say(S.LANTERN);
  else if(o.id==='west')this.say(S.EXIT_WEST);
  else if(o.id==='shelf')this.say(S.SHELF);
  else if(o.id.startsWith('echo')){const i=Number(o.id.slice(4));this.flags['echo'+i]=true;this.flags.lastEcho={i,t:this.game.clock};this.game.emit('echo');this.say(S.ECHO[i]);}
  else if(o.id==='crack'){if(!this.flags.gerson)this.say(S.CRACK_HIDDEN);else this.say(S.CRACK,()=>this.go('cavern',320,430));}
  else if(o.id==='crystal'){this.seth.dir='up';this.say([...S.CRYSTAL_LOOK,...S.TOUCH],()=>this.awaken());}
 }
 // Seth's SOUL wakes the crystal: light builds, three hearts fly out, and they become one knight.
 awaken(){this.manifest={t:0};this.game.emit('awaken');this.pause(3.4,()=>this.say(S.MANIFEST,()=>this.game.startBattle()));}
 trigger(){
  const s=this.seth;
  if(this.room==='shop'&&s.x>this.data.w-20)this.go('path',40,380);
  if(this.room==='path'&&s.x<16)this.go('shop',600,380);
  if(this.room==='cavern'&&!this.manifest&&s.x<16)this.go('path',1350,340);
 }
 update(dt,input){
  this.title=Math.max(0,this.title-dt);if(this.manifest)this.manifest.t+=dt;
  if(this.wait&&this.game.state==='scene'){this.wait.time-=dt;if(this.wait.time<=0){const then=this.wait.then;this.wait=null;this.game.state='world';then?.();}}
  if(this.fadeTo){this.fade+=dt;if(this.fade>=.32&&!this.fadeTo.done){this.fadeTo.done=true;this.room=this.fadeTo.room;this.seth.x=this.fadeTo.x;this.seth.y=this.fadeTo.y;this.enter();}if(this.fade>=.64){this.fadeTo=null;this.fade=0;}return;}
  if(this.game.state!=='world'){this.seth.moving=false;return;}
  const s=this.seth,sx=Number(!!input.right)-Number(!!input.left),sy=Number(!!input.down)-Number(!!input.up);
  let tx=sx,ty=sy;if(input.touch){const dx=input.touch.x-320,dy=input.touch.y-240;if(Math.hypot(dx,dy)>30){tx=Math.abs(dx)>20?Math.sign(dx):0;ty=Math.abs(dy)>20?Math.sign(dy):0;}}
  s.moving=!!(tx||ty);const speed=input.slow?110:180;
  if(s.moving){s.x+=tx*speed*dt;s.y+=ty*speed*dt;s.step+=dt;s.dir=ty&&!tx?(ty<0?'up':'down'):tx<0?'left':'right';}else s.step=0;
  const [y0,y1]=this.data.floor;s.y=Math.max(y0,Math.min(y1,s.y));s.x=Math.max(8,Math.min(this.data.w-8,s.x));
  // The crystal's plinth is solid.
  if(this.room==='cavern'&&s.y<372&&Math.abs(s.x-320)<70)s.y=372;
  this.trigger();
 }
}
Object.assign(exports,{World,ROOM_DATA});
