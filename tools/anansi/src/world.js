const S=require("story.js");
// The walk to the theatre: the spiders' wing of the Ruins, then down the aisle toward the stage.
// Coordinates are screen pixels (the art is drawn at 2x).
const ROOM_DATA={
 hall:{w:1280,floor:[300,420],objects:[{id:'sign',x:300,y:300,r:56},{id:'web',x:660,y:300,r:56},{id:'poster',x:960,y:300,r:56}]},
 theatre:{w:640,floor:[246,446],objects:[{id:'seat0',x:252,y:410,r:40},{id:'seat1',x:388,y:352,r:40},{id:'seat2',x:252,y:300,r:40}]}
};
class World{
 constructor(game){this.game=game;this.reset();}
 reset(){this.room='hall';this.seth={x:80,y:368,dir:'right',step:0,moving:false};this.flags={};this.fade=0;this.fadeTo=null;this.count=null;this.wait=null;this.title=1.6;this.enter();}
 get data(){return ROOM_DATA[this.room];}
 get genocide(){return this.game.genocide;}
 enter(){this.title=1.6;this.count=this.room==='theatre'?{x:320,y:262,facing:this.flags.met?'down':'up',turn:-1}:null;}
 say(lines,then){this.game.message(lines,then||'world');}
 pause(time,then){this.game.state='scene';this.wait={time,then};}
 camera(){return Math.max(0,Math.min(this.data.w-640,this.seth.x-320));}
 go(room,x,y,dir){this.fadeTo={room,x,y,dir};this.fade=0;this.game.emit('door');}
 nearest(){let best=null,bd=1e9;for(const o of this.data.objects){const d=Math.hypot(this.seth.x-o.x,(this.seth.y-o.y)*1.4);if(d<o.r&&d<bd){bd=d;best=o;}}return best;}
 interact(){
  if(this.fadeTo)return;const o=this.nearest();if(!o)return;const g=this.genocide;
  if(o.id==='sign')this.say(g?S.SIGN_G:S.SIGN_P);
  else if(o.id==='web')this.say(g?S.WEB_G:S.WEB_P);
  else if(o.id==='poster')this.say(g?S.POSTER_G:S.POSTER_P);
  else if(o.id.startsWith('seat')){const i=Number(o.id.slice(4));this.flags['seat'+i]=true;this.say((g?S.SEAT_NOTES_G:S.SEAT_NOTES)[i]);this.game.emit('read');}
 }
 trigger(){
  const s=this.seth;
  if(this.room==='hall'&&s.x>this.data.w-24)this.go('theatre',320,440,'up');
  if(this.room==='theatre'&&s.y>444&&!this.flags.met)this.go('hall',this.data.w-60,368,'left');
  // Halfway down the aisle the count turns to face his audience of one.
  if(this.room==='theatre'&&!this.flags.met&&s.y<362){this.flags.met=true;s.dir='up';s.moving=false;if(this.count){this.count.facing='down';this.count.turn=0;}this.game.emit('turnaround');this.pause(.5,()=>this.say(this.genocide?S.MEET_G:S.MEET_P,()=>this.game.startBattle()));}
 }
 update(dt,input){
  this.title=Math.max(0,this.title-dt);if(this.count&&this.count.turn>=0)this.count.turn+=dt;
  if(this.wait&&this.game.state==='scene'){this.wait.time-=dt;if(this.wait.time<=0){const then=this.wait.then;this.wait=null;this.game.state='world';then?.();}}
  if(this.fadeTo){this.fade+=dt;if(this.fade>=.32&&!this.fadeTo.done){this.fadeTo.done=true;this.room=this.fadeTo.room;this.seth.x=this.fadeTo.x;this.seth.y=this.fadeTo.y;this.seth.dir=this.fadeTo.dir||this.seth.dir;this.enter();}if(this.fade>=.64){this.fadeTo=null;this.fade=0;}return;}
  if(this.game.state!=='world'){this.seth.moving=false;return;}
  const s=this.seth,sx=Number(!!input.right)-Number(!!input.left),sy=Number(!!input.down)-Number(!!input.up);
  let tx=sx,ty=sy;if(input.touch){const dx=input.touch.x-320,dy=input.touch.y-240;if(Math.hypot(dx,dy)>30){tx=Math.abs(dx)>20?Math.sign(dx):0;ty=Math.abs(dy)>20?Math.sign(dy):0;}}
  s.moving=!!(tx||ty);const speed=input.slow?110:180;
  if(s.moving){s.x+=tx*speed*dt;s.y+=ty*speed*dt;s.step+=dt;s.dir=ty&&!tx?(ty<0?'up':'down'):tx<0?'left':'right';}else s.step=0;
  const [y0,y1]=this.data.floor;s.y=Math.max(y0,Math.min(this.room==='theatre'?452:y1,s.y));s.x=Math.max(8,Math.min(this.data.w-8,s.x));
  // In the theatre you walk the aisle between the rows of seats, and the stage apron in front.
  if(this.room==='theatre'){if(s.y>276)s.x=Math.max(292,Math.min(348,s.x));else s.x=Math.max(120,Math.min(520,s.x));}
  this.trigger();
 }
}
Object.assign(exports,{World,ROOM_DATA});
