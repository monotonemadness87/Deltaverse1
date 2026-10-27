# flowey.html (false pacifist) -> flowey-genocide.html (false genocide). Same engine; new story, patterns, replays and ending.
import base64,os,sys,json
D=os.path.dirname(os.path.abspath(__file__))
src,dst=sys.argv[1],sys.argv[2]
t=open(src,encoding='utf-8').read()
rd=lambda f:open(os.path.join(D,f),encoding='utf-8').read()
def span(name):
    a=t.find('modules["%s"]=(exports,require)=>{'%name);assert a>=0,name
    nxt=t.find('\nmodules["',a+10);main=t.find('\nconst {installNotebook}',a)
    end=min(x for x in (nxt,main) if x>=0);return a,t.rfind('\n};',a,end)+3
def replace_module(name,new):
    global t;a,b=span(name);t=t[:a]+new.rstrip('\n')+t[b:]
def get_module(name):
    a,b=span(name);return t[a:b]
def rep(s,old,new,count=1):
    n=s.count(old);assert n==count,(n,old[:100]);return s.replace(old,new)
replace_module('story.js',rd('story.js'));replace_module('patterns.js',rd('patterns.js'))
srcs={n:'data:image/png;base64,'+base64.b64encode(open(os.path.join(D,'assets',n+'.png'),'rb').read()).decode() for n in ['gerson0','gerson2','hammer','arrow','shell','muffet','spider','donut','pet','alphys','aqua','gersonDust']}
art=rd('geno-art.js').replace('__SOURCES__',json.dumps(srcs))
a=t.find('modules["art-layout.js"]');t=t[:a]+art.rstrip('\n')+'\n'+t[a:]

# ---------------- engine ----------------
e=get_module('engine.js')
e=rep(e,'const {INTRO,AFTER,AMBIENT,DARK,INSIDE,MEMORIES,MEMORY_LINES,FINAL,RELEASE,EPILOGUE,CUT,STRIKE_LINES,RUGS,line}=require("story.js");',
        'const {INTRO,AFTER,AMBIENT,DARK,INSIDE,MEMORIES,MEMORY_LINES,FINAL,RELEASE,EPILOGUE,CUT,STRIKE_LINES,RUGS,line,ESCAPE,PLEA,TAUNT,LAUGH,VERDICT,KILL,TRAPS,LOCKS,RETRY}=require("story.js");')
# Seth at LV 10, 56 HP. Hits cost about 45% more of it per minute than the false-pacifist fight.
e=rep(e,"gentle:{speed:.82,damage:2,warning:1.2,cooldown:.93},normal:{speed:1.08,damage:3,warning:1,cooldown:.68},hard:{speed:1.3,damage:4,warning:.88,cooldown:.5}",
        "gentle:{speed:.86,damage:4,warning:1.2,cooldown:.93},normal:{speed:1.12,damage:7,warning:1,cooldown:.68},hard:{speed:1.34,damage:9,warning:.88,cooldown:.5}")
# The escapes stay as hard as the false-pacifist ones: a catch costs the same share of HP.
e=rep(e,"if(!this.chase)c.speed*=1.18;","if(!this.chase)c.speed*=1.18;else{c.damage=Math.round(c.damage*.75);c.speed*=1.08/1.12;}")
e=rep(e,"this.lv=1;this.hp=this.maxHP=30;","this.lv=10;this.hp=this.maxHP=56;this.plea=false;this.killed=false;this.mercyLocks=0;this.aquaHit=false;")
e=rep(e,"{name:'A WARM MEMORY',heal:9,count:3},{name:'YOUR OWN VOICE',heal:14,count:2}","{name:'A WARM MEMORY',heal:16,count:3},{name:'YOUR OWN VOICE',heal:24,count:2}")
e=rep(e,"locked(id){if(this.finale)return false;","locked(id){if(this.plea)return id!=='fight';if(this.finale)return false;")
e=rep(e,"else if(this.next==='escaped'||this.next==='cut')","else if(this.next==='plea')this.beginPlea();else if(this.next==='verdict'){this.state='verdict';this.timer=0;this.face=3;this.glitch(1.3);this.emit('laugh');}else if(this.next==='killed'){this.state='killed';this.timer=0;this.emit('end');}else if(this.next==='escaped'||this.next==='cut')")
e=rep(e,"   if(this.locked(id)){this.face=id==='mercy'?8:3;",
        "   if(this.plea&&this.locked(id)){this.emit('deny');this.message([line('The notebook is still in your hand.',-1)],'menu');return;}\n   if(this.locked(id)){this.face=id==='mercy'?8:3;")
e=rep(e,"this.say(id==='mercy'?'Golly! You STILL think that does something?':id==='item'?'No snacks until I say so.':'Oops! Guess you’re not allowed to do that.',this.face,2.4)",
        "this.say(id==='mercy'?LOCKS.mercy[this.mercyLocks++%2]:id==='item'?LOCKS.item:LOCKS.other,this.face,2.4)")
e=rep(e,"  if(this.state==='strike'){const accuracy=","  if(this.state==='rage'){this.rageHit(true);return;}\n  if(this.state==='strike'&&this.plea){this.killFlowey(clamp(1-Math.abs(this.cursor-384)/310,0,1));return;}\n  if(this.state==='strike'){const accuracy=")
old_act=e[e.index("  if(this.state==='act'){const id=this.option;"):]
old_act=old_act[:old_act.index('\n')]
e=rep(e,old_act,"  if(this.state==='act'){const id=this.option;if(id===0){this.assist=true;this.message([line('You remember the last page of your notebook.',-1),line('Hey! Put that down!',4)]);}else if(id===1){this.resisted=true;this.message([line('You grip the notebook. Your hands stop shaking.',-1),line('Hee hee. We’ll see.',1)]);}else if(id===2){this.assist=true;this.message([line('You call out for anyone.\\nOnly your voice comes back.',-1),line('Who did you think was left?',7)]);}else if(this.act===1)this.message([line('FLOWEY. He wants your SOUL.\\nHe has never once let you win.',-1),line('Check? Golly. I’m a FLOWER.',3)]);else this.message([line(`FLOWEY. Your soul is inside him.\\n${this.count} / 6 torn pages recovered.`,-1)]);return;}")
e=rep(e,"this.say(['Did you think dying would get you out?','I put you back! Where’s my thank-you?','You STILL remember? That’s getting annoying.','Again? Golly, you really are an idiot.'][Math.min(this.deaths-1,3)],","this.say(RETRY[Math.min(this.deaths-1,3)],")
# The last page is the spare: once it is back, his strikes stop being pulled.
e=rep(e,"Math.round((170+430*q)*(1+.12*this.count))","Math.round((170+430*q)*(1+.12*this.count)*(this.fragments[5]?2.2:1))")
e=rep(e,"pick=pool[this.strikes++%pool.length];this.message(pick);","pick=f.label==='AQUA'&&!this.aquaHit&&this.act===1&&dmg?(this.aquaHit=true,STRIKE_LINES.aqua[0]):pool[this.strikes++%pool.length];this.message(pick);")
e=rep(e,"if(kind==='load'){f.hp=f.max;this.effects.push({type:'file',text:'FILE 0 LOADED',life:2});}else if(kind==='max'){f.max=99999;f.hp=99999-(600-Math.min(600,f.hp));this.effects.push({type:'file',text:'MAX HP 600 → 99999',life:2.2});}else if(kind==='atk'){f.atkZero=true;f.inf=true;this.effects.push({type:'file',text:'YOUR ATTACK: 0',life:2.2});}",
        "if(kind==='load'){f.hp=f.max;this.effects.push({type:'file',text:'YOUR EXP → HIS HP',life:2.2});}else if(kind==='max'){f.label='AQUA';f.hp=f.max;this.effects.push({type:'file',text:'FLOWEY → AQUA',life:2.2});}else if(kind==='atk'){f.atkZero=true;f.inf=true;this.effects.push({type:'file',text:'ATK 0 / LOVE 0',life:2.2});}")
e=rep(e,"if(step.id==='last'){this.beginFinal();return;}","if(step.id==='last'){this.message(ESCAPE,'plea');return;}")
e=rep(e,"this.say(m.thought,10,5);","{const [t1,t2]=m.thought.split('\\n');this.say(t1,10,t2?2.8:5);if(t2)this.at(2.8,()=>this.say(t2,10,3.2));}")
e=rep(e,"this.at(7,()=>this.say(index===5?'That last page? Press Z. Go on.':'Aww, you can almost reach it! Keep trying!',11,4));","this.at(7,()=>this.say(m.hint,index===5?9:11,4));")
e=rep(e,"changeArena(a,mode='red'){this.broadcast=null;","changeArena(a,mode='red'){this.circle=false;this.broadcast=null;")
e=rep(e,"if(this.timer>4.5)this.message(line('Aw. You missed.',1));","if(this.timer>4.5&&!this.plea)this.message(line('Aw. You missed. Don’t get rusty on me.',1));")
e=rep(e,"  if(this.state==='absorb'){","  if(this.state==='tear'){if(this.timer>1.6)this.message(TAUNT,'menu');return;}\n  if(this.state==='kill'){if(this.timer>1.9){this.killStage='laugh';this.message(LAUGH,'verdict');}return;}\n  if(this.state==='verdict'){if(this.timer>2.6)this.beginRage();return;}\n  if(this.state==='rage'){if(this.rageHits<16&&this.timer>=this.rageNext)this.rageHit();else if(this.rageHits>=16&&this.timer>this.rageLast+.7){this.state='dust';this.timer=0;}return;}\n  if(this.state==='dust'){if(this.timer>3.3){this.killed=true;this.message(KILL,'killed');}return;}\n  if(this.state==='absorb'){")
e=rep(e,"else if(b.kind==='beam'){if(b.spin","else if(b.kind==='pet'||b.kind==='slab'){if(b.age<b.warning||b.age>b.warning+b.live)continue;}else if(b.kind==='orbit'){b.theta+=b.spin*dt;if(b.age<b.release){b.x=b.cx+Math.cos(b.theta)*b.radius;b.y=b.cy+Math.sin(b.theta)*b.radius;}else{if(!b.flung){b.flung=true;b.vx=Math.cos(b.theta)*150*this.config.speed;b.vy=Math.sin(b.theta)*150*this.config.speed;}b.x+=b.vx*dt;b.y+=b.vy*dt;}}else if(b.kind==='beam'){if(b.spin")
e=rep(e,"this.selected=this.finale?0:1;this.text=this.finale?","this.selected=this.finale||this.plea?0:1;this.text=this.plea?'The notebook is still in your hand.':this.finale?")
e=rep(e,"this.say({HEAL:'Aww, did that hurt? It said HEAL. I swear!',MERCY:'You really will press ANYTHING, huh?',SPARE:'Oh, sure. I\\'ll spare you. Some more pellets!',CONTINUE:'Good! I was hoping you\\'d say that.',RETRY:'You wanted another try. Here it comes!',QUIT:'Leaving so soon? But we\\'re having FUN!',SAVE:'Thanks! I\\'ll keep that for later.',LOAD:'Hee hee. Back where you belong.',FIGHT:'You can\\'t hurt me from IN here, idiot.',ACT:'Here\\'s an action: RUN.',ITEM:'Oops! That one was mine.',PAUSE:'No, no. You don\\'t get to rest yet.'}[label]||'Golly! That looked important!',3,3.6);",
        "this.say((label==='FIGHT'&&this.act===3?TRAPS.FIGHT3:TRAPS[label])||TRAPS.fallback,3,3.6);")
e=rep(e," beginFinal(){"," // Out of him: he is small again, and only FIGHT is left.\n beginPlea(){this.plea=true;this.initField();this.act=1;this.state='tear';this.timer=0;this.face=5;this.foe={...this.foe,hp:1,max:1,shown:1,label:'FLOWEY',inf:false,atkZero:false};this.emit('warp');}\n // The first slash really gets him. Then he laughs; then Seth does not stop until he is dust.\n killFlowey(q){this.state='kill';this.timer=0;this.cut('slash',.22);this.face=11;this.foeHurt=1.8;this.killStage='first';this.shake=.5;this.effects.push({type:'damage',text:String(Math.round(400+560*q)),life:1.8});this.emit('enemyHurt');this.emit('strike');}\n beginRage(){this.state='rage';this.timer=0;this.rageHits=0;this.rageNext=.2;this.rageLast=0;this.slashes=[];this.killStage='rage';}\n rageHit(mashed=false){if(this.rageHits>=16||mashed&&this.timer-this.rageLast<.07)return;this.rageHits++;this.rageLast=this.timer;this.rageNext=this.timer+Math.max(.1,.55*Math.pow(.84,this.rageHits));if(this.rageHits%3===1)this.cut('slash',.08);this.slashes.push({at:this.clock,angle:(this.rageHits%2?-.7:.7)+Math.sin(this.rageHits*2.3)*.4});this.shake=.18;this.foeHurt=.3;this.effects.push({type:'damage',text:String(300+((this.rageHits*397)%700)),life:.9,dx:((this.rageHits*71)%160)-80,dy:((this.rageHits*43)%60)});this.emit('enemyHurt');}\n beginFinal(){")
e=rep(e," beginFinal(){"," // Static: every SAVE, LOAD and edit of the world tears the screen. The LOAD counter says how many times he has done this.\n glitch(amount=.8,label=''){this.static=Math.max(this.static||0,amount);if(label){this.staticLabel=label;this.staticLabelUntil=this.clock+.75;}this.emit('static');}\n loadLabel(){this.loads=(this.loads||0)+1;return 'LOAD #'+(4812+this.loads).toLocaleString('en-US');}\n beginFinal(){")
e=rep(e,"this.rigFlash=Math.max(0,this.rigFlash-dt);","this.rigFlash=Math.max(0,this.rigFlash-dt);this.static=Math.max(0,(this.static||0)-dt*1.7);")
e=rep(e,"saveAttack(){","saveAttack(){this.glitch(.7,'SAVE');")
e=rep(e,"loadAttack(){if(!this.savedAttack)return;","loadAttack(){if(!this.savedAttack)return;const label=this.loadLabel();this.glitch(1,this.fragments[2]?'':label);")
e=rep(e,"text:this.fragments[2]?'POSITION RESTORE REFUSED':'FILE 0 LOADED'","text:this.fragments[2]?'POSITION RESTORE REFUSED':label")
e=rep(e,"applyRig(kind){const f=this.foe;","applyRig(kind){const f=this.foe;this.glitch(1.2,kind==='load'?'LOAD':'EDIT');")
e=rep(e,"this.startAttack(c.round);this.say(","this.startAttack(c.round);this.glitch(1.3,this.loadLabel());this.say(")
e=rep(e,"if(a.type==='rug'){this.attackName='';","if(a.type==='rug'){this.glitch(1,'RESET');this.attackName='';")
e=rep(e,"if(a.type==='dark'){this.attackName='';","if(a.type==='dark'){this.glitch(1.3);this.attackName='';")
e=rep(e,"if(a.type==='chase')beginChase(this,a.id);else buildAttack(this);","if(a.type==='chase'){beginChase(this,a.id);this.glitch(1.1,this.loadLabel());}else{if(a.type==='face')this.glitch(1,'SAVE');buildAttack(this);}")
e=rep(e,"this.act=3;this.foe={hp:4200,max:4200,shown:4200,atkZero:false,inf:false};","this.act=3;this.glitch(1.2);this.foe={hp:4200,max:4200,shown:4200,atkZero:false,inf:false};")
e=rep(e,"return{state:this.state,act:this.act,","return{state:this.state,act:this.act,plea:this.plea,killed:this.killed,")
# Static cuts, like analog footage: a hard cut through static to a frame of the past, then back.
# The fight freezes while a cut is on screen, so nothing hits you that you could not see.
e=rep(e,"class MindBattle{","const CUTS={buttons:['aqua','FILE 6 — LAST PLAYMATE'],mercy:['aqua','FILE 6 — LAST PLAYMATE'],hands:['aqua','FILE 6 — LAST PLAYMATE'],you:['aqua','FILE 6 — LAST PLAYMATE'],ruins:['encore','FILE 1 — THE RUINS'],theatre:['encore','FILE 1 — THE RUINS'],page0:['encore','FILE 1 — THE RUINS'],snowdin:['crown','FILE 2 — SNOWDIN'],cataclysm:['crown','FILE 2 — SNOWDIN'],page1:['crown','FILE 2 — SNOWDIN'],waterfall:['gerson','FILE 3 — WATERFALL'],gerson:['gerson','FILE 3 — WATERFALL'],page2:['gerson','FILE 3 — WATERFALL'],neo:['spamson','FILE 4 — HOTLAND'],page3:['spamson','FILE 4 — HOTLAND'],muffet:['muffet','FILE 4 — THE NEST'],page4:['muffet','FILE 4 — THE NEST'],montage:['sans','FILE 5 — THE CORE'],misery:['sans','FILE 5 — THE CORE'],page5:['aqua','FILE 6 — LAST PLAYMATE']};\nclass MindBattle{")
e=rep(e," beginFinal(){"," cut(kind,dur=.4,shot='face',caption=''){this.cutFX={kind,dur,shot,caption,at:this.clock,load:4812+(this.loads||0)};this.cutUntil=this.clock+dur;this.emit('static');}\n breakBox(a,mode='red'){this.effects.push({type:'shatter',box:{...this.arena},born:this.clock,life:1});this.cut('break',.24);this.changeArena(a,mode);}\n beginFinal(){")
e=rep(e,"this.state='warning';this.invulnerability=","this.state='warning';{const k=CUTS[a.id]||['face',''];this.cut('memory',.42,k[0],k[1]);this.warnCut=.42;}this.invulnerability=")
e=rep(e,"if(this.state==='warning'){if(this.timer>.9){","if(this.state==='warning'){if(this.timer>.9+(this.warnCut||0)){this.warnCut=0;")
e=rep(e,"if(!['defend','memory'].includes(this.state))return;this.attackTime+=dt;","if(!['defend','memory'].includes(this.state))return;if(this.clock<(this.cutUntil||0))return;this.attackTime+=dt;")
e=rep(e,"this.mode=m.mode;this.state='memory';","this.mode=m.mode;this.state='memory';{const k=CUTS['page'+index]||['face',''];this.cut('memory',.5,k[0],k[1]);}")
e=rep(e,"else if(b.kind==='beam'){if(b.spin","else if(b.kind==='beam'&&b.color==='slash'&&!b.cutDone&&b.age>=b.warning){b.cutDone=true;this.cut('slash',.16);this.shake=.3;continue;}else if(b.kind==='beam'){if(b.spin")
e=rep(e,"this.glitch(1,this.fragments[2]?'':label);","this.glitch(1,this.fragments[2]?'':label);this.cut('memory',.36,['aqua','gerson','encore','crown','sans','muffet','spamson','face'][this.loads%8],label);")
replace_module('engine.js',e)

# ---------------- chase rooms: his friends line the walls, laughing, and throw pellets ----------------
c=get_module('chase.js')
c=rep(c,"c.rects=rects(c);c.total=c.legs.reduce((s,l)=>s+l.len,0);",
        "c.rects=rects(c);c.total=c.legs.reduce((s,l)=>s+l.len,0);c.floweys=[];for(let d=110,i=0;d<c.total-50;d+=88+((i*53)%60),i++){const p=pointAt(c,d),side=i%2?1:-1,off=WIDTH/2+30+((i*31)%26),x=p.x-p.leg.dy*off*side,y=p.y+p.leg.dx*off*side;if(c.rects.some(r=>x>r.x-22&&x<r.x+r.w+22&&y>r.y-22&&y<r.y+r.h+22))continue;c.floweys.push({x,y,phase:i*.37,thrown:-9});}c.nextThrow=1.5;c.nextLaugh=.6;")
c=rep(c,"if(c.age>=c.next){c.next=c.age+(g.chaseMontage>=0?1.1:1.05);spawnAhead(g,c,s);}",
        "if(c.age>=c.next){c.next=c.age+(g.chaseMontage>=0?1.1:1.05);spawnAhead(g,c,s);}\n if(c.floweys?.length&&c.age>=c.nextThrow){c.nextThrow=c.age+1.9;const near=c.floweys.filter(f=>{const d=Math.hypot(f.x-s.x,f.y-s.y);return d>90&&d<250;}),f=near[Math.floor(c.age*7)%Math.max(1,near.length)];if(f){f.thrown=c.age;const th=Math.atan2(s.y-(f.y-30),s.x-f.x);for(let k=-1;k<=1;k++)c.hazards.push({kind:'seed',x:f.x,y:f.y-30,vx:Math.cos(th+k*.26)*124*g.config.speed,vy:Math.sin(th+k*.26)*124*g.config.speed,age:0,delay:.5,life:2.6,r:5});}}\n if(c.floweys?.length&&c.age>=c.nextLaugh){c.nextLaugh=c.age+6;g.emit('laugh');}")
replace_module('chase.js',c)
# ---------------- audio: the supplied track, and a burst of static ----------------
au=get_module('audio.js')
i=au.index('this.track=new Audio("')+len('this.track=new Audio("');j=au.index('"',i)
track=os.path.join(D,'track.mp3')  # the designer's supplied theme for this route
au=au[:i]+'data:audio/mpeg;base64,'+base64.b64encode(open(track,'rb').read()).decode()+au[j:]
au=rep(au,"const data={select:","if(type==='static'){this.hiss();return;}const data={select:")
au=rep(au," status(round,"," hiss(){if(!this.enabled||this.paused||!this.context||!this.master)return;const t=this.context.currentTime;if(t-(this.lastHiss||0)<.12)return;this.lastHiss=t;const n=Math.floor(this.context.sampleRate*.32),b=this.context.createBuffer(1,n,this.context.sampleRate),d=b.getChannelData(0);for(let k=0;k<n;k++)d[k]=(Math.random()*2-1)*(1-k/n)*(k%900<620?1:.25);const s=this.context.createBufferSource(),g=this.context.createGain();g.gain.value=1.1;s.buffer=b;s.connect(g);g.connect(this.master);s.start(t);}\n status(round,")
replace_module('audio.js',au)

# ---------------- page script ----------------
m=t.find('\nconst {installNotebook}');p=t[m:]
p=rep(p,'const {FloweyArt,pellet,daisy,WILT}=require("flowey-art.js");','const {FloweyArt,pellet,daisy,WILT,HURT,DISSOLVE}=require("flowey-art.js");\nconst {GenoArt}=require("geno-art.js");')
p=rep(p,"const spamArt=new SpamMemoryArt();","const spamArt=new SpamMemoryArt(),geno=new GenoArt(ctx);")
# The emptied rooms: the same corridors, drained of colour, with dust where the monsters were.
p=rep(p,"ctx.fillStyle=room.wall;ctx.fillRect(0,0,768,472);ctx.translate(ox,oy);","ctx.filter='saturate(.22) brightness(.88)';ctx.fillStyle=room.wall;ctx.fillRect(0,0,768,472);ctx.translate(ox,oy);")
p=rep(p," // The far door.\n"," ctx.fillStyle='#a8a8a8';for(let i=0;i<16;i++){const p=pointAt(c,(i+.5)*c.total/16),off=(i*37)%64-32,x=p.x-p.leg.dy*off,y=p.y+p.leg.dx*off;if(x<vx0||x>vx1||y<vy0||y>vy1)continue;ctx.fillRect(x-8,y,16,3);ctx.fillRect(x-5,y-2,10,2);ctx.fillRect(x-2,y-4,4,2);}\n // The far door.\n")
p=rep(p," // His vines, coming up the path behind you.\n"," ctx.filter='none';\n // His vines, coming up the path behind you.\n")
p=rep(p,"  else if(h.kind==='tear'){ctx.fillStyle='#e6f3ff';ctx.beginPath();ctx.arc(h.x,h.y,5,0,Math.PI*2);ctx.fill();ctx.fillRect(h.x-1,h.y-10,2,6);}",
        "  else if(h.kind==='tear'){ctx.save();ctx.filter='grayscale(1) brightness(1.7)';geno.draw('arrow',h.x,h.y,16,22,Math.atan2(h.vy||1,h.vx||0)+Math.PI/2);ctx.restore();}")
p=rep(p,"function backdrop(){","function backdrop(){if(game.plea){ctx.fillStyle='#000';ctx.fillRect(0,0,768,576);return;}")
p=rep(p," if(game.chase||game.state==='absorb')return;\n",
        " if(game.chase||game.state==='absorb')return;\n if(game.plea){if(game.state==='tear'||game.killed)return;const jit=reduceMotion?0:1;if(game.state==='kill'){const s=jit*Math.round(Math.sin(game.clock*90)*Math.max(0,1.3-game.timer)*5);flowey.draw(ctx,HURT,384+s,214,3);return;}if(game.state==='verdict'){const s=jit*Math.round(Math.sin(game.clock*70)*3);flowey.draw(ctx,Math.floor(game.clock*11)%2?93:37,384+s,214,3);return;}if(game.state==='rage'){const h=game.rageHits,n=h<5?HURT:h<9?WILT[h-5]:h<13?DISSOLVE[h-9]:-1,s=jit*Math.round(Math.sin(game.clock*97)*4);if(n>=0)flowey.draw(ctx,n,384+s,214,3);else dust(game.timer-game.rageLast);rageSlashes();return;}if(game.state==='dust'){dust(game.timer+.3);return;}const s=game.killStage==='laugh'&&!reduceMotion?Math.round(Math.sin(game.clock*40)):0;flowey.speaker(ctx,game.face,talking,game.clock,384+s,214,3,1,game.foeHurt>0);return;}\n")
figures=r""" if(game.replay==='theatre'&&encoreSprite.complete&&encoreSprite.naturalWidth){ctx.save();ctx.filter='grayscale(1) brightness(.8)';encoreBacked(317,30,135,185);ctx.restore();text('A MILLION EMPTY SEATS',384,217,1,'#aaa',true);}
 if(game.replay==='cataclysm'){ctx.save();ctx.filter='grayscale(1)';crownArt.pose(5,384,128,190,false,.9);ctx.restore();text('NOTHING LEFT TO HOLD',384,219,1,'#aaa',true);}
 if(game.replay==='gerson'){ctx.save();ctx.filter='grayscale(1)';const swing=game.effects.some(e=>e.type==='swing');geno.draw(swing?'gerson2':'gerson0',384,128,190,170);ctx.restore();text('WHAT FOR?',384,219,1,'#aaa',true);}
 if(game.replay==='neo'){ctx.save();ctx.filter='grayscale(1)';spamArt.character(ctx,'spamson',384,52+(reduceMotion?0:Math.sin(game.clock*2)*2),154,game.broadcast?.overheat>.7?'panic':'grin',true);ctx.restore();text(game.broadcast?.phase||'OFF AIR',384,218,1,'#aaa',true);}
 if(game.replay==='muffet'){ctx.save();ctx.filter='grayscale(1)';geno.draw('muffet',384,128+(reduceMotion?0:Math.sin(game.clock*3)*2),170,172);ctx.restore();text('THE EMPTY NEST',384,219,1,'#aaa',true);}
 if(game.replay==='misery'){ctx.save();ctx.filter='grayscale(1)';sansBacked(4,334,126,190);geno.draw('alphys',462,160,124,106);ctx.restore();text('MISERY',384,221,1,'#aaa',true);}
"""
p=rep(p," if(onScreen){onScreen=false;",figures+" if(onScreen){onScreen=false;")
hazards=r""" if(b.kind==='arrow'){const pre=b.delay&&b.age<b.delay;ctx.save();ctx.filter='grayscale(1) brightness(1.8)';if(pre){ctx.globalAlpha=reduceMotion||Math.floor(b.age*14)%2?.45:.18;}geno.draw('arrow',b.x,b.y,30,40,b.angle+Math.PI/2);ctx.restore();return;}
 if(b.kind==='pet'){const a=game.arena,warn=b.age<b.warning,u=warn?0:Math.min(1,(b.age-b.warning)/b.live);ctx.save();if(warn){ctx.globalAlpha=reduceMotion||Math.floor(b.age*12)%2?.3:.14;ctx.fillStyle='#c9c9c9';ctx.fillRect(b.x-b.w/2,a.y,b.w,a.h);ctx.globalAlpha=.7;ctx.filter='grayscale(1)';geno.draw('pet',b.x,a.y+a.h+18-Math.min(1,b.age/b.warning)*30,b.w+24,(b.w+24)*.74);}else{ctx.filter='grayscale(1) brightness(1.3)';geno.draw('pet',b.x,a.y+a.h-u*a.h,b.w+30,(b.w+30)*.74);ctx.globalAlpha=.35;ctx.fillStyle='#fff';ctx.fillRect(b.x-b.w/2,a.y,b.w,a.h);}ctx.restore();return;}
"""
p=rep(p,"function hazard(b){if(b.delay&&b.age<b.delay)return;","function hazard(b){\n"+hazards+" if(b.delay&&b.age<b.delay)return;")
kinds=r""" // ENCORE's genocide props, drawn with his own atlas: baton bars, cracked masks, curtain slabs.
 if(b.kind==='baton'){ctx.save();ctx.filter='grayscale(1)';if(!encoreArt.baton(b.x,b.y,b.w,b.h,b.w>b.h,'#fff'))ctx.fillRect(Math.round(b.x-b.w/2),Math.round(b.y-b.h/2),Math.round(b.w),Math.round(b.h));ctx.restore();return;}
 if(b.kind==='star'){ctx.save();ctx.filter='grayscale(1)';const s=b.r*2+2;if(!encoreArt.paint(b.art||'cracked',b.x,b.y,s,s,0,'#fff'))ctx.fillRect(b.x-b.r,b.y-b.r,b.r*2,b.r*2);ctx.restore();return;}
 if(b.kind==='slab'){const warning=b.age<b.warning;ctx.save();ctx.filter='grayscale(1)';ctx.globalAlpha=warning?(reduceMotion?.25:.3+Math.sin(game.clock*22)*.1):1;encoreArt.curtain(b.x,b.y,b.w,b.h,warning,warning?'#d08556':'#fff');ctx.restore();return;}
 if(b.kind==='shell'){ctx.save();ctx.filter='grayscale(1) brightness(1.4)';geno.draw('shell',b.x,b.y,26,26,reduceMotion?0:b.age*7);ctx.restore();return;}
 if(b.kind==='spider'){ctx.save();ctx.filter='grayscale(1) brightness(1.3)';geno.draw('spider',b.x,b.y+(reduceMotion?0:Math.floor(b.age*10)%2),34,22);ctx.restore();return;}
 if(b.kind==='donut'){ctx.save();ctx.filter='grayscale(1) brightness(1.3)';geno.draw('donut',b.x,b.y,24,22,reduceMotion?0:b.age*(b.vx>0?8:-8));ctx.restore();return;}
 if(b.kind==='orbit'){ctx.save();ctx.filter='grayscale(1)';crownArt.prop(b.art||'sword',b.x,b.y,14,24,b.theta+Math.PI/2);ctx.restore();return;}
"""
p=rep(p," if(b.friendly){heart(b.x,b.y,14,'green');return;}",kinds+" if(b.friendly){heart(b.x,b.y,14,'green');return;}")
p=rep(p," if(['escaped','cut'].includes(game.state)){",
        " if(game.state==='verdict'){const s=reduceMotion?0:Math.round(Math.sin(game.clock*60)*3);text(VERDICT,384+s,330,4,'#ff2a3a',true);}\n if(game.state==='tear'){ctx.fillStyle='#fff';ctx.globalAlpha=reduceMotion?.3:Math.max(0,1-game.timer/1.6);ctx.fillRect(0,0,768,576);ctx.globalAlpha=1;}\n if(game.state==='killed'){ctx.fillStyle='#000';ctx.fillRect(0,0,768,576);text('THE FLOWER IS DUST',384,190,4,'#e6e1d2',true);prose('Aqua is gone.\\nThe king is still ahead.\\nSomewhere, a file is still saved.',150,270,500,2,3);text('NEUTRAL / FALSE GENOCIDE',384,400,1.5,'#9b93a8',true);text('RESET TO PLAY AGAIN',384,489,1.5,'#888',true);}\n else if(['escaped','cut'].includes(game.state)){")
p=rep(p," else if(game.state==='absorb'){}"," else if(['absorb','tear','kill','killed','verdict','rage','dust'].includes(game.state)){}")
p=rep(p,"if(!['escaped','cut','absorb'].includes(game.state)){text(game.fakeHp?'MINE':'YOU',32,484,2,game.fakeHp?'#b5c356':'#e5ecdb');text('LV 1',140,485,2);",
        "if(!['escaped','cut','absorb','killed'].includes(game.state)){text(game.fakeHp?'MINE':'SETH',32,484,2,game.fakeHp?'#b5c356':'#e5ecdb');text('LV 10',140,485,2);")
p=rep(p,"function commands(){if(game.broadcast||","function commands(){if(game.killed||game.killStage||['tear','kill','verdict','rage','dust'].includes(game.state)||game.broadcast||")
p=rep(p,"&&!game.epilogue&&game.round>0,","&&!game.epilogue&&!game.plea&&game.round>0,")
p=rep(p,"text('FLOWEY',x-8,y-2,1,'#ddd');","text(f.label||'FLOWEY',x-8,y-2,1,f.label==='AQUA'?'#3ee0ed':'#ddd');")
p=rep(p,"game.state==='dialogue'&&game.speaker==='self'?game.memory:-1,game.paused||game.state==='dead');",
        "game.state==='dialogue'&&game.speaker==='self'?game.memory:-1,game.paused||game.state==='dead');if(game.plea)audio.track.volume=game.killStage||game.killed||['kill','verdict','rage','dust'].includes(game.state)?0:.08;")
p=rep(p," if(game.echo){ctx.fillStyle='#000';ctx.fillRect(game.echo.x,game.echo.y,game.echo.w,game.echo.h);box(game.echo.x,game.echo.y,game.echo.w,game.echo.h,'#c5a6c6',4);}",
        " if(game.echo){const r=game.echo;if(boxless){ctx.save();ctx.strokeStyle='#6f6280';ctx.globalAlpha=.55;ctx.lineWidth=2;for(const [px,py,dx,dy] of [[r.x,r.y,1,1],[r.x+r.w,r.y,-1,1],[r.x,r.y+r.h,1,-1],[r.x+r.w,r.y+r.h,-1,-1]]){ctx.beginPath();ctx.moveTo(px+dx*16,py);ctx.lineTo(px,py);ctx.lineTo(px,py+dy*16);ctx.stroke();}ctx.restore();}else{ctx.fillStyle='#000';ctx.fillRect(r.x,r.y,r.w,r.h);box(r.x,r.y,r.w,r.h,'#c5a6c6',4);}}")
# Static over everything: noise, torn rows, scanlines, and what he just did (SAVE, LOAD #, EDIT, RESET).
p=rep(p,"// A vine lash:",r"""let noiseFrames=null;function staticFX(){const a=Math.min(1,game.static||0);if(a<=.01)return;noise();
 ctx.save();if(!reduceMotion&&a>.25)for(let i=0;i<7;i++){const y=Math.floor((game.clock*977+i*131)%560),h=4+(i*37)%18,off=Math.round(Math.sin(game.clock*53+i)*26*a);ctx.drawImage(canvas,0,y,768,h,off,y,768,h);}
 ctx.imageSmoothingEnabled=false;ctx.globalAlpha=(reduceMotion?.25:.72)*a;ctx.drawImage(noiseFrames[reduceMotion?0:Math.floor(game.clock*24)%4],0,0,768,576);ctx.globalAlpha=.45*a;ctx.fillStyle='#000';for(let y=0;y<576;y+=4)ctx.fillRect(0,y,768,2);
 if(game.staticLabel&&game.clock<game.staticLabelUntil){ctx.globalAlpha=1;ctx.fillStyle='#000';const w=text.measure(game.staticLabel,3)+30;ctx.fillRect(384-w/2,262,w,44);text(game.staticLabel,384,270,3,'#fff',true);}ctx.restore();}
// Seth's frenzy: white cuts across him, and what is left of him as dust.
function rageSlashes(){for(const s of game.slashes||[]){const a=game.clock-s.at;if(a>.22||a<0)continue;ctx.save();ctx.translate(384,180);ctx.rotate(s.angle);ctx.globalAlpha=1-a/.22;ctx.fillStyle='#fff';ctx.fillRect(-120,-3,240,6);ctx.fillStyle='#ff3355';ctx.fillRect(-120,-1,240,2);ctx.restore();}}
function dust(t){if(t>1.5||t<0)return;ctx.save();ctx.fillStyle='#d8d8d8';ctx.globalAlpha=Math.max(0,1-t/1.5);for(let i=0;i<90;i++){const u=t+((i*37)%50)/120,x=384+((i*53)%110-55)+Math.sin(i*1.7)*u*34,y=128+((i*29)%80)-u*26+u*u*60;ctx.fillRect(Math.round(x),Math.round(y),2,2);}ctx.restore();}
// A vine lash:""")
p=rep(p," if(game.paused){ctx.fillStyle='#000c';"," staticFX();\n if(game.paused){ctx.fillStyle='#000c';")
p=rep(p," if(game.invulnerability<=0||Math.floor(game.clock*14)%2===0)heart(game.soul.x,game.soul.y,20,'purple');",
        " for(const f of c.floweys||[]){if(f.x<vx0-40||f.x>vx1+40||f.y<vy0-40||f.y>vy1+90)continue;const threw=c.age-f.thrown<.5,laugh=Math.floor((reduceMotion?0:game.clock)*6+f.phase*10)%2;flowey.draw(ctx,threw?94:laugh?93:37,f.x,f.y,1);}\n if(game.invulnerability<=0||Math.floor(game.clock*14)%2===0)heart(game.soul.x,game.soul.y,20,'purple');")
p=rep(p,"else if(e.type==='damage'){const y=(game.act===3?30:224)-(1.4-e.life)*18;text(e.text,384,y,3","else if(e.type==='damage'){const y=(game.plea?120:game.act===3?30:224)-(1.4-e.life)*18-(e.dy||0);text(e.text,384+(e.dx||0),y,3")
p=rep(p,'const {MEMORIES}=require("story.js");','const {MEMORIES,VERDICT}=require("story.js");')
p=rep(p,"audio.blip(game.act===3||[2,6,9,10].includes(game.face))","audio.blip(game.round>0||game.act===3||![0,1,3,8].includes(game.face))")
# The cut on screen: static bookends, then the past in grey, red-tinted, VHS-captioned. Slashes are a white gash; a broken box flies apart.
p=rep(p,"// Seth's frenzy:",r"""function noise(){if(noiseFrames)return noiseFrames;noiseFrames=[];for(let k=0;k<4;k++){const c=document.createElement('canvas');c.width=256;c.height=192;const x=c.getContext('2d'),img=x.createImageData(256,192);let s=k*7919+13;for(let i=0;i<img.data.length;i+=4){s=(s*16807)%2147483647;const v=(s>>7)&255;img.data[i]=img.data[i+1]=img.data[i+2]=v;img.data[i+3]=255;}x.putImageData(img,0,0);noiseFrames.push(c);}return noiseFrames;}
function memoryShot(shot){const j=reduceMotion?0:Math.round(Math.sin(game.clock*61)*3);ctx.save();ctx.filter='grayscale(1) contrast(1.7) brightness('+({gerson:1.6,encore:1.9,spamson:1.4}[shot]||.95)+')';
 if(shot==='aqua')geno.draw('aqua',384+j,300,380,420);else if(shot==='gerson')geno.draw('gersonDust',384+j,300,420,420);else if(shot==='muffet')geno.draw('muffet',384+j,300,330,420);
 else if(shot==='encore'&&encoreSprite.complete)ctx.drawImage(encoreSprite,420,0,690,1024,264+j,60,240,356);else if(shot==='crown')crownArt.pose(3,384+j,290,420);
 else if(shot==='sans')sansArt.sans(ctx,4,384+j,300,400);else if(shot==='spamson')spamArt.character(ctx,'spamson',384+j,110,330,'panic',true);
 else{ctx.filter='contrast(1.4)';flowey.draw(ctx,[10,37,9][Math.floor(game.cutFX.at*7)%3],384+j,560,10);}
 ctx.restore();ctx.save();ctx.globalCompositeOperation='multiply';ctx.fillStyle='#ff4a52';ctx.fillRect(0,0,768,576);ctx.restore();}
function cutScreen(){const c=game.cutFX;if(!c)return;const u=(game.clock-c.at)/c.dur;if(u<0||u>=1)return;const n=noise();ctx.save();ctx.imageSmoothingEnabled=false;
 if(c.kind==='slash'){ctx.globalAlpha=reduceMotion?.4:.9;ctx.drawImage(n[Math.floor(game.clock*30)%4],0,0,768,576);ctx.globalAlpha=1;ctx.translate(384,288);ctx.rotate(-.55);ctx.fillStyle='#fff';ctx.fillRect(-500,-14,1000,28);ctx.fillStyle='#ff2a3a';ctx.fillRect(-500,-4,1000,8);ctx.restore();return;}
 if(c.kind==='break'){ctx.globalAlpha=(reduceMotion?.35:.85)*(1-u);ctx.drawImage(n[Math.floor(game.clock*30)%4],0,0,768,576);ctx.restore();return;}
 if(u<.2||u>.84){if(reduceMotion){ctx.fillStyle='#000';ctx.fillRect(0,0,768,576);}else ctx.drawImage(n[Math.floor(game.clock*30)%4],0,0,768,576);ctx.restore();return;}
 ctx.fillStyle='#000';ctx.fillRect(0,0,768,576);memoryShot(c.shot);
 ctx.globalAlpha=reduceMotion?.12:.3;ctx.drawImage(n[Math.floor(game.clock*30)%4],0,0,768,576);ctx.globalAlpha=.55;ctx.fillStyle='#000';for(let y=0;y<576;y+=3)ctx.fillRect(0,y,768,1);ctx.globalAlpha=1;
 text('▶ PLAY',36,30,2,'#e8e8e8');text('LOAD #'+c.load.toLocaleString('en-US'),732,30,2,'#e8e8e8');if(c.caption)text(c.caption,36,520,2,'#ff4450');ctx.restore();}
// A broken box: its four edges in pieces, flung outward and falling.
function shatter(e){const t=game.clock-e.born,b=e.box;if(t>1)return;ctx.save();ctx.fillStyle='#eee';ctx.globalAlpha=1-t;for(let i=0;i<24;i++){const side=i%4,f=((i*7)%6+.5)/6,x0=side<2?b.x+b.w*f:side===2?b.x:b.x+b.w,y0=side===0?b.y:side===1?b.y+b.h:b.y+b.h*f,cx=b.x+b.w/2,cy=b.y+b.h/2,dx=x0-cx,dy=y0-cy,d=Math.hypot(dx,dy)||1,v=reduceMotion?40:240+(i*37)%160;ctx.save();ctx.translate(x0+dx/d*v*t,y0+dy/d*v*t+(reduceMotion?0:380*t*t));ctx.rotate((reduceMotion?0:t*(i%2?9:-9))+i);ctx.fillRect(-9,-2,18,4);ctx.restore();}ctx.restore();}
// Seth's frenzy:""")
p=rep(p," staticFX();\n if(game.paused){"," staticFX();cutScreen();\n if(game.paused){")
p=rep(p,"for(const e of game.effects){if(e.type==='falseWin')","for(const e of game.effects){if(e.type==='shatter')shatter(e);else if(e.type==='swing'){}else if(e.type==='falseWin')")
p=rep(p," if(b.kind==='beam'&&!game.replay&&b.color==='white'){vineLash(b);return;}",r""" if(b.kind==='beam'&&b.color==='slash'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);const w=b.width;if(b.age<b.warning){const on=reduceMotion||Math.floor(b.age*16)%2===0,late=b.age>b.warning*.55;ctx.globalAlpha=on?(late?.9:.5):.12;ctx.strokeStyle='#ff2a3a';ctx.lineWidth=late?3:1;ctx.strokeRect(-900,-w/2,1800,w);for(let x=-880;x<900;x+=70){ctx.beginPath();ctx.moveTo(x-6,-6);ctx.lineTo(x+6,6);ctx.moveTo(x+6,-6);ctx.lineTo(x-6,6);ctx.stroke();}}else{const t=b.age-b.warning,f=t<b.live?1:Math.max(0,1-(t-b.live)/.35);ctx.globalAlpha=f;ctx.fillStyle='#fff';ctx.fillRect(-900,-w/2*f,1800,w*f);ctx.fillStyle='#ff2a3a';ctx.fillRect(-900,-w/6,1800,w/3);}ctx.restore();return;}
 if(b.kind==='beam'&&!game.replay&&b.color==='white'){vineLash(b);return;}""")
t=t[:m]+p
t=rep(t,'<title>FLOWEY — Inside Your Best Friend</title>','<title>FLOWEY — False Genocide</title>')
t=rep(t,'content="Flowey wants your soul. His rigged battle, the rooms you walked through, and then the inside of the flower: six pages of yourself to recover."','content="You killed everyone, then spared her. Flowey wants you gone so she gets her game back. The emptied rooms, the bosses you killed, and the flower that has to die."')
open(dst,'w',encoding='utf-8').write(t);print('ok',len(t))
