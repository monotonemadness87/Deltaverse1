modules["battle-ui.js"]=(exports,require)=>{
// All normal command rows use the same geometry at the game's Canvas scale.
function battleButtons(width,height){const s=width/640;return ['FIGHT','ACT','ITEM','MERCY'].map((label,i)=>({x:Math.round((24+i*154)*s),y:Math.round(height-46*s),w:Math.round(130*s),h:Math.round(38*s),label,index:i}));}
function battleIcon(c,i,x,y,size,color='#ff862b'){
 const masks=[['000000000001','000000000011','000000000110','000000001100','000000011000','000000110000','010001100000','011011000000','001110000000','001111000000','011001100000','110000000000'],['000000010000','000100001000','010010000100','001001000010','001001000010','001001000010','001001000010','001001000010','001001000010','010010000100','000100001000','000000010000'],['000011110000','000010010000','000010010000','001111111100','001000000100','001001100100','001010010100','001010010100','001001100100','001000000100','001111111100','000000000000'],['010000000010','011000000110','001100001100','000110011000','000011110000','000001100000','000001100000','000011110000','000110011000','001100001100','011000000110','010000000010']];
 const m=masks[i];if(!m)return;const u=size/12;c.save();c.fillStyle=color;for(let r=0;r<12;r++)for(let k=0;k<12;k++)if(m[r][k]==='1')c.fillRect(Math.round(x-size/2+k*u),Math.round(y-size/2+r*u),Math.ceil(u),Math.ceil(u));c.restore();
}
function battleSoul(c,x,y,size,color='#b249dc'){
 const rows=['01100110','11111111','11111111','11111111','01111110','00111100','00011000'];const u=size/8;c.save();c.fillStyle=color;for(let r=0;r<7;r++)for(let k=0;k<8;k++)if(rows[r][k]==='1')c.fillRect(Math.round(x-size/2+k*u),Math.round(y-3.5*u+r*u),Math.ceil(u),Math.ceil(u));c.restore();
}
function drawBattleButton(c,r,label,index,selected,{locked=false,soulColor='#b249dc',soul=true}={}){
 const s=r.w/130,line=Math.max(1,Math.round(2*s)),color=locked?'#45543b':selected?'#ffff00':'#ff862b';
 c.save();c.imageSmoothingEnabled=false;c.fillStyle=color;c.fillRect(r.x,r.y,r.w,r.h);c.fillStyle='#000';c.fillRect(r.x+line,r.y+line,r.w-line*2,r.h-line*2);
 const cx=Math.round(r.x+17*s),cy=Math.round(r.y+r.h/2);
 if(selected){if(soul)battleSoul(c,cx,cy,16*s,soulColor);}else battleIcon(c,index,cx,cy,18*s,color);
 c.font=Math.round(27*s)+'px Determination, monospace';c.textAlign='left';c.textBaseline='alphabetic';
 const available=r.w-39*s;if(c.measureText(label).width>available)c.font=Math.round(27*s*available/c.measureText(label).width)+'px Determination, monospace';
 const m=c.measureText(label),asc=m.actualBoundingBoxAscent||20*s,des=m.actualBoundingBoxDescent||0;c.fillStyle=color;c.fillText(label,Math.round(r.x+34*s),Math.round(cy+(asc-des)/2));c.restore();
}

Object.assign(exports,{battleButtons,battleIcon,battleSoul,drawBattleButton});
};
