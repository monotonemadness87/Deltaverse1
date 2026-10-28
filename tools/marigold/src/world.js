const S=require("story.js");
// The walk to the memorial: four small rooms, read in order. Coordinates are screen pixels (the art is drawn at 2x).
const ROOM_DATA={
 forest:{w:1700,floor:[300,430],objects:[{id:'sign',x:300,y:300,r:52},{id:'bush',x:620,y:322,r:46},{id:'tracks',x:1060,y:388,r:56}]},
 gallery:{w:1500,floor:[330,430],objects:[0,1,2,3,4,5].map(i=>({id:'mural'+i,x:170+i*232,y:330,r:70}))},
 ledge:{w:1120,floor:[338,408],objects:[{id:'edge',x:330,y:408,r:120},{id:'door',x:962,y:338,r:46}]},
 memorial:{w:640,floor:[318,440],objects:[{id:'plaque',x:430,y:318,r:58}]}
};
class World{
 constructor(game){this.game=game;this.reset();}
 reset(){this.room='forest';this.seth={x:80,y:372,dir:'right',step:0,moving:false};this.flags={};this.fade=0;this.fadeTo=null;this.flowey=null;this.marigold=null;this.title=1.6;this.enter();}
 get data(){return ROOM_DATA[this.room];}
 get genocide(){return this.game.genocide;}
 enter(){
  this.flowey=null;this.marigold=null;this.title=1.6;
  if(this.room==='memorial'&&!this.genocide)this.marigold={x:430,y:350,facing:'back',kneel:true};
  if(this.room==='ledge'&&this.genocide)this.marigold={x:880,y:372,facing:'front'};
  const first=!this.flags['enter_'+this.room];this.flags['enter_'+this.room]=true;
  if(first&&this.room==='gallery')this.say(S.GALLERY_ENTER);
  if(first&&this.room==='forest'&&this.genocide)this.say(S.FOREST_G.enter);
 }
 say(lines,then){this.game.message(lines,then||'world');}
 camera(){return Math.max(0,Math.min(this.data.w-640,this.seth.x-320));}
 go(room,x,y){this.fadeTo={room,x,y};this.fade=0;this.game.emit('door');}
 marigoldTurns(){if(this.marigold){this.marigold.facing='front';this.marigold.kneel=false;}this.game.emit('turnaround');}
 nearest(){let best=null,bd=1e9;for(const o of this.data.objects){const d=Math.hypot(this.seth.x-o.x,(this.seth.y-o.y)*1.4);if(d<o.r&&d<bd){bd=d;best=o;}}return best;}
 interact(){
  if(this.fadeTo)return;const o=this.nearest();if(!o)return;const g=this.genocide;
  if(o.id==='sign')this.say(S.SIGN);
  else if(o.id==='bush')this.say(g?S.FOREST_G.bush:S.FOREST_P.bush);
  else if(o.id==='tracks')this.say(g?S.FOREST_G.tracks:S.FOREST_P.tracks);
  else if(o.id.startsWith('mural')){const i=Number(o.id.slice(5));this.flags['read'+i]=true;this.say(i===3?[...S.MURALS[i],...(g?S.MURAL_EXTRA_G:S.MURAL_EXTRA_P)]:S.MURALS[i]);this.game.emit('read');}
  else if(o.id==='edge')this.say(g?S.LEDGE_G.edge:S.LEDGE_P.edge);
  else if(o.id==='door'){if(g)this.say([S.N('* Thorns have sealed the cave mouth.')]);else this.go('memorial',70,390);}
  else if(o.id==='plaque')this.say(S.PLAQUE);
 }
 trigger(){
  const s=this.seth,g=this.genocide;
  if(this.room==='forest'&&!g&&!this.flags.flowey&&s.x>760){this.flags.flowey=true;this.flowey={x:Math.min(s.x+150,1600),y:372,age:0};this.say(S.FLOWEY_LURE,()=>{this.flowey.leaving=0;});}
  if(this.room==='forest'&&s.x>this.data.w-24)this.go('gallery',40,380);
  if(this.room==='gallery'&&s.x>this.data.w-24)this.go('ledge',40,372);
  if(this.room==='gallery'&&s.x<16)this.go('forest',this.data.w-60,380);
  if(this.room==='ledge'&&s.x<16)this.go('gallery',ROOM_DATA.gallery.w-60,380);
  if(this.room==='ledge'&&!g&&s.x>930&&s.x<994&&s.y<=344)this.go('memorial',70,390);
  if(this.room==='memorial'&&s.x<26)this.go('ledge',962,360);
  if(this.room==='ledge'&&g&&!this.flags.met&&s.x>700){this.flags.met=true;this.seth.dir='right';this.say(S.MEET_G,()=>this.game.startBattle());}
  if(this.room==='memorial'&&!g&&!this.flags.met&&Math.hypot(s.x-430,s.y-350)<150){this.flags.met=true;this.say(S.MEET_P,()=>this.game.startBattle());}
 }
 update(dt,input){
  this.title=Math.max(0,this.title-dt);
  if(this.flowey){this.flowey.age+=dt;if(this.flowey.leaving!==undefined){this.flowey.leaving+=dt;if(this.flowey.leaving>.8)this.flowey=null;}}
  if(this.fadeTo){this.fade+=dt;if(this.fade>=.32&&!this.fadeTo.done){this.fadeTo.done=true;this.room=this.fadeTo.room;this.seth.x=this.fadeTo.x;this.seth.y=this.fadeTo.y;this.enter();}if(this.fade>=.64){this.fadeTo=null;this.fade=0;}return;}
  if(this.game.state!=='world'){this.seth.moving=false;return;}
  const s=this.seth,sx=Number(!!input.right)-Number(!!input.left),sy=Number(!!input.down)-Number(!!input.up);
  let tx=sx,ty=sy;if(input.touch){const dx=input.touch.x-320,dy=input.touch.y-240;if(Math.hypot(dx,dy)>30){tx=Math.abs(dx)>20?Math.sign(dx):0;ty=Math.abs(dy)>20?Math.sign(dy):0;}}
  s.moving=!!(tx||ty);const speed=input.slow?110:180;
  if(s.moving){s.x+=tx*speed*dt;s.y+=ty*speed*dt;s.step+=dt;s.dir=ty&&!tx?(ty<0?'up':'down'):tx<0?'left':'right';}else s.step=0;
  const [y0,y1]=this.data.floor;s.y=Math.max(y0,Math.min(y1,s.y));s.x=Math.max(8,Math.min(this.data.w-8,s.x));
  // Solid things: the memorial pedestal and Marigold herself.
  if(this.room==='memorial'&&s.y<336&&Math.abs(s.x-430)<62)s.y=336;
  if(this.marigold&&Math.abs(s.x-this.marigold.x)<26&&Math.abs(s.y-this.marigold.y)<18)s.x=this.marigold.x+(s.x<this.marigold.x?-26:26);
  this.trigger();
 }
}
Object.assign(exports,{World,ROOM_DATA});
