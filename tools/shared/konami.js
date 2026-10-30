modules["konami.js"]=(exports,require)=>{
// Shared keyboard/touch sequence. Repeating keys are filtered by the caller.
const sequence=['up','up','down','down','left','right','left','right','b','a'];
class KonamiCode{
 constructor(toggle){this.toggle=toggle;this.buffer=[];this.progress=0;}
 input(key){
  this.buffer.push(key);this.buffer=this.buffer.slice(-sequence.length);
  if(this.buffer.length===sequence.length&&sequence.every((key,i)=>key===this.buffer[i])){this.buffer=[];this.progress=0;this.toggle();return true;}
  this.progress=0;
  for(let n=Math.min(9,this.buffer.length);n>0;n--){if(sequence.slice(0,n).every((key,i)=>key===this.buffer[this.buffer.length-n+i])){this.progress=n;break;}}
  return key==='b'&&this.progress===9;
 }
}

Object.assign(exports,{KonamiCode});
};
