// Marigold's frames (cleaned from the designer's example sheet), human Seth's walk, the overworld Flowey,
// and the procedurally painted rooms of the walk. Everything is drawn with whole pixels.
const FRAMES=__MARIGOLD_FRAMES__;
const SETH=__SETH_FRAMES__;
const img=src=>{const i=new Image();i.src=src;return i;};
const FACES={neutral:'face_neutral',smile:'face_smile',serious:'face_serious',sad:'face_sad',angry:'face_angry',deranged:'face_deranged',blink:'face_blink0',eye:'face_eye2'};
class MarigoldArt{
 constructor(ctx){this.ctx=ctx;this.sheet=img("__MARIGOLD_PNG__");this.seth=img("__SETH_PNG__");this.floweyImg=img("__FLOWEY_PNG__");}
 ready(i){return i.complete&&i.naturalWidth;}
 has(name){return !!FRAMES[name];}
 size(name){const f=FRAMES[name];return f?{w:f[2],h:f[3]}:{w:0,h:0};}
 // Draw a frame anchored at its bottom centre (or centre), at a whole-number scale.
 frame(name,x,y,scale=2,{anchor='bottom',flip=false,alpha=1,tint=null,clipBottom=0}={}){
  const f=FRAMES[name];if(!f||!this.ready(this.sheet))return;const c=this.ctx,[sx,sy,w,h]=f,dw=w*scale,dh=(h-clipBottom)*scale;
  c.save();c.imageSmoothingEnabled=false;c.globalAlpha*=alpha;c.translate(Math.round(x),Math.round(y));if(flip)c.scale(-1,1);
  const ox=-Math.round(dw/2),oy=anchor==='bottom'?-Math.round(h*scale):-Math.round(dh/2);
  c.drawImage(this.sheet,sx,sy,w,h-clipBottom,ox,oy,dw,dh);
  if(tint){c.globalCompositeOperation='source-atop';c.fillStyle=tint;c.fillRect(ox,oy,dw,dh);}
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
 pine(x,base,h,dark=false,snow=true){
  const c=this.ctx,levels=4,col=dark?'#0f1830':'#1c2b4a',edge=dark?'#0a1124':'#14203a';
  this.px(x-3,base-14,6,14,'#2a1d22');
  for(let i=0;i<levels;i++){const lw=(h*.55)*(1-i/levels*.55),ly=base-14-i*h/levels*.78;for(let k=0;k<h/levels;k+=2){const ww=lw*(k/(h/levels));this.px(x-ww/2,ly-h/levels+k,ww,2,k<3&&snow?'#dfe8f6':col);}this.px(x-lw/2,ly-2,lw,2,edge);}
 }
 snowGround(cam,y0,y1,{path=true,dusty=false}={}){
  this.px(0,y0,640,y1-y0,'#d9e2f1');
  for(let i=0;i<40;i++){const x=((i*157-cam*1)%700+700)%700-30,y=y0+12+(i*53)%Math.max(1,y1-y0-20);this.px(x,y,26+(i%3)*10,2,'#c3cee3');}
  if(path){this.px(0,y0+46,640,74,'#c9d3e7');this.px(0,y0+46,640,2,'#b8c3da');this.px(0,y0+120,640,2,'#b8c3da');}
  if(dusty)for(let i=0;i<9;i++){const x=((i*211-cam)%760+760)%760-40;this.px(x,y0+70+(i*37)%60,14,4,'#9aa0ad');this.px(x+4,y0+66+(i*37)%60,6,4,'#8b909c');}
 }
 forest(cam,t,genocide){
  const c=this.ctx;c.fillStyle='#070b18';c.fillRect(0,0,640,480);
  for(let i=0;i<60;i++){const x=((i*97)%640),y=(i*53)%170;this.px(x,y,2,2,i%5?'#1a2140':'#39436b');}
  for(let i=0;i<14;i++){const x=((i*120-cam*.35)%1680+1680)%1680-60;this.pine(x,290,150+(i%3)*30,true,false);}
  for(let i=0;i<12;i++){const x=((i*170+40-cam*.7)%2040+2040)%2040-80;this.pine(x,306,190+(i%4)*24,false,true);}
  this.snowGround(cam,300,480,{dusty:genocide});
  if(!genocide)for(let i=0;i<5;i++){const x=620+i*34-cam;this.buttercup(x,330+(i%2)*8);}
  else{for(let i=0;i<6;i++){const x=600+i*40-cam;this.buttercup(x,326+(i%2)*10);}for(let i=0;i<5;i++){const x=1020+i*46-cam;this.thornSpike(x,404+(i%2)*14,18+i%3*6);}}
  // the sign
  const sx=300-cam;this.px(sx-4,256,8,44,'#5b3d2e');this.px(sx-30,236,60,30,'#6e4a36');this.px(sx-26,240,52,22,'#8a5f44');this.px(sx-20,247,40,2,'#3e2a22');this.px(sx-20,253,30,2,'#3e2a22');
  // footprints
  for(let i=0;i<10;i++){const x=900+i*30-cam;this.px(x,380+(i%2)*10,6,4,genocide?'#a33a4a':'#aab6cf');}
  // falling snow
  for(let i=0;i<46;i++){const x=((i*83+t*(14+i%5*3))%660+660)%660-10,y=((i*61+t*(26+i%7*4))%500);this.px(x,y,2,2,'#e9eff9');}
 }
 buttercup(x,y){this.px(x-1,y,2,8,'#3a6b3a');for(const [dx,dy] of [[-4,-2],[2,-2],[-3,-6],[1,-6],[-1,-4]])this.px(x+dx,y+dy-2,4,4,'#f2c93a');this.px(x-1,y-6,2,2,'#c4452f');}
 thornSpike(x,y,h){const c=this.ctx;c.fillStyle='#7d0f24';c.beginPath();c.moveTo(Math.round(x-6),Math.round(y));c.lineTo(Math.round(x),Math.round(y-h));c.lineTo(Math.round(x+6),Math.round(y));c.fill();c.fillStyle='#e0304d';c.fillRect(Math.round(x-1),Math.round(y-h+4),2,Math.round(h-6));}
 gallery(cam,t,read,genocide){
  const c=this.ctx;c.fillStyle='#0d0a14';c.fillRect(0,0,640,480);
  // carved wall
  this.px(0,40,640,290,'#241d33');for(let y=40;y<330;y+=26)this.px(0,y,640,2,'#1a1426');for(let row=0;row<11;row++)for(let i=0;i<9;i++){const x=((i*90+(row%2)*45-cam)%810+810)%810-60;this.px(x,40+row*26,2,26,'#1a1426');}
  this.px(0,328,640,4,'#3a2f50');this.px(0,332,640,148,'#2e2642');for(let i=0;i<30;i++){const x=((i*97-cam)%700+700)%700-30;this.px(x,350+(i*29)%110,20,2,'#3a3150');}
  for(let i=0;i<6;i++){const mx=170+i*232-cam;if(mx<-120||mx>760)continue;this.mural(i,mx,190,read[i],genocide,t);}
 }
 mural(i,x,y,read,genocide,t){
  const c=this.ctx,ink=read?'#d8cdea':'#a99fc0',dim='#6d6487';
  this.px(x-88,y-82,176,150,'#100c18');this.px(x-84,y-78,168,142,'#1c1626');this.px(x-84,y-78,168,2,'#3a2f50');
  const P=(dx,dy,w,h,col=ink)=>this.px(x+dx,y+dy,w,h,col);
  const ghost=(dx,dy,armor=false,col=ink)=>{P(dx-8,dy-10,16,18,col);P(dx-10,dy-2,20,12,col);P(dx-10,dy+10,4,4,col);P(dx-2,dy+10,4,4,col);P(dx+6,dy+10,4,4,col);P(dx-5,dy-4,3,4,'#1c1626');P(dx+2,dy-4,3,4,'#1c1626');if(armor){P(dx-10,dy-14,20,6,col);P(dx-2,dy-20,4,6,'#c4452f');P(dx+12,dy-16,2,30,col);}};
  const human=(dx,dy,col=ink)=>{P(dx-4,dy-16,8,8,col);P(dx-3,dy-8,6,14,col);P(dx-6,dy-6,12,2,col);P(dx-3,dy+6,2,8,col);P(dx+1,dy+6,2,8,col);};
  const soul=(dx,dy,col)=>{P(dx-4,dy-3,3,3,col);P(dx+1,dy-3,3,3,col);P(dx-4,dy,8,3,col);P(dx-2,dy+3,4,2,col);};
  if(i===0){ghost(-40,-10,true);ghost(0,-16,true);ghost(40,-10,true);P(-70,30,140,2,dim);for(let k=0;k<5;k++)P(-60+k*28,36,10,2,dim);}
  if(i===1){P(-10,-56,20,6,ink);P(-14,-62,4,8,ink);P(10,-62,4,8,ink);P(-12,-50,24,36,ink);P(-18,-30,36,20,ink);ghost(-48,10,true);ghost(48,10,true);P(-70,26,22,10,dim);P(-66,20,14,8,dim);P(-58,16,6,6,ink);}
  if(i===2){human(-50,0);human(-30,6);P(-20,-8,26,2,ink);ghost(20,-2,false,dim);ghost(50,6,false,'#4c4563');for(let k=0;k<4;k++)P(10+k*12,24+k%2*4,4,2,dim);}
  if(i===3){ghost(-50,4,false);ghost(-34,10,false);P(-64,20,12,8,ink);P(-60,16,6,4,ink);P(-80,-40,14,70,'#0c0912');ghost(46,-4,true,read?'#e8e0f6':ink);P(20,26,56,2,dim);}
  if(i===4){P(-70,-30,30,22,dim);P(-66,-40,22,10,dim);ghost(-55,10,false);P(10,-50,70,2,dim);for(let k=0;k<6;k++)P(20+k*10,-46+k%3*6,4,4,'#c4452f');}
  if(i===5){human(-40,4);human(0,0);human(40,4);for(const dx of [-40,0,40])soul(dx,-28,'#f2c93a');P(-80,-56,160,2,'#f2c93a');if(read){const a=(Math.sin(t*3)+1)/2;c.save();c.globalAlpha=.25+.25*a;P(-80,-58,160,6,'#f2c93a');c.restore();}}
  for(let k=0;k<7;k++)P(-70+k*20,46,12,2,dim);for(let k=0;k<6;k++)P(-60+k*22,52,8,2,dim);
  if(i===3&&read){if(genocide){for(let k=0;k<4;k++)this.thornSpike(x-70+k*46,y+70,12);}else for(let k=0;k<3;k++)this.buttercup(x-30+k*30,y+76);}
 }
 ledge(cam,t,genocide){
  const c=this.ctx;c.fillStyle='#000';c.fillRect(0,0,640,480);
  // the view over the edge: a forest far below, one little house
  const vx=-cam*.3;
  c.fillStyle='#0b1428';c.fillRect(Math.round(vx),120,620,360);
  for(let i=0;i<34;i++){const x=vx+10+(i*37)%600,y=150+(i*23)%80;this.pine(x,y+40,40+(i%3)*10,true,true);}
  for(let i=0;i<22;i++){const x=vx+(i*53)%610,y=330+(i*31)%140;this.pine(x,y,48+(i%3)*8,true,true);}
  this.px(vx+150,330,40,22,'#121b33');this.px(vx+146,324,48,8,'#1a2747');const lit=!genocide;this.px(vx+158,338,6,6,lit?'#f6e27a':'#1a1f2e');this.px(vx+174,338,6,6,lit?'#f6e27a':'#1a1f2e');
  this.px(vx+190,330,90,40,'#08101f');
  // cliff and ledge path
  const wallX=600-cam;for(let y=0;y<480;y+=8)this.px(wallX,y,Math.max(0,640-wallX),8,(y/8)%2?'#5d6488':'#565c80');
  for(let y=0;y<480;y+=8)for(let x=Math.floor((wallX)/30)*30;x<640;x+=30)this.px(x+((y/8)%3)*6,y,10,2,'#6c7398');
  this.px(0,330,640,82,'#cdd8ec');this.px(0,330,640,4,'#eef3fb');this.px(0,408,640,4,'#9aa6c4');this.px(0,412,640,68,'#4e5577');for(let x=0;x<640;x+=24)this.px(x-cam%24,420+(x/24%3)*12,12,2,'#5d6488');
  // cave door
  const dx=962-cam;this.px(dx-36,232,72,100,'#1e2032');this.px(dx-30,238,60,94,'#050508');this.px(dx-26,236,52,4,'#0c0c12');
  if(genocide)for(let k=0;k<5;k++)this.thornSpike(dx-28+k*14,332,30+(k%2)*14);
  for(let i=0;i<40;i++){const x=((i*83+t*(12+i%5*3))%660+660)%660-10,y=((i*61+t*(22+i%7*4))%500);this.px(x,y,2,2,'#e9eff9');}
 }
 memorial(t,genocide){
  const c=this.ctx;c.fillStyle='#05070a';c.fillRect(0,0,640,480);
  const glow=c.createRadialGradient(430,170,10,430,200,320);glow.addColorStop(0,'rgba(120,200,140,.38)');glow.addColorStop(.5,'rgba(50,110,80,.14)');glow.addColorStop(1,'rgba(0,0,0,0)');
  this.px(60,40,520,270,'#0c1512');for(let y=40;y<310;y+=22)this.px(60,y,520,2,'#09100d');
  c.fillStyle=glow;c.fillRect(0,0,640,480);
  for(let i=0;i<4;i++){const lx=300+i*86;this.px(lx-8,80,16,22,'#d8f0c8');this.px(lx-6,84,12,14,'#f6fff0');}
  this.px(0,310,640,170,'#141c18');for(let i=0;i<20;i++)this.px((i*71)%640,330+(i*37)%140,22,2,'#1c2620');
  // pedestal and plaque
  this.px(372,232,116,84,'#2c3a33');this.px(380,224,100,10,'#3c4c44');this.px(398,262,64,30,'#1d2722');this.px(404,268,52,2,'#59705f');this.px(404,274,40,2,'#59705f');this.px(404,280,46,2,'#59705f');
  for(let k=0;k<7;k++)this.buttercup(384+k*16,322+(k%2)*6);
  for(let k=0;k<8;k++)this.buttercup(120+k*52,430+(k%3)*12);
 }
}
Object.assign(exports,{MarigoldArt,FACES});
