modules["story.js"]=(exports,require)=>{
const line=(text,face=0)=>({text,face});
// Faces: 0 friendly · 1 smug · 2 sly · 3 laughing · 4 angry · 5 shocked · 6 creepy · 7 flat · 8 fake pout · 9 rage · 10 blank · 11 rattled. -1 is Seth's own narration.
// False genocide: Seth killed everyone, then spared Aqua at the very end. She broke and ran.
// Flowey thinks that if Seth is gone, she gets her game back. He starts in his canon register and it cracks early.
const INTRO=[
 line('Howdy!',0),line('Golly, it’s quiet down here.\nWonder why.',1),line('Hee hee. Don’t answer. I was watching.',2),
 line('Every town. Every guard. Every last one.\nEven I was impressed!',3),line('And then you got to the end.',7),
 line('You killed EVERYONE.',4),line('And then you let HER walk?',9),
 line('She understood.\nTwo humans. One last game.',7),line('Now she won’t even look at me.',11),
 line('Was that funny?\nWas THAT the joke?',4),line('...Fine. I can fix this.',6),
 line('I get rid of you.\nShe gets her game back.',2),line('No lesson today, idiot.\nYou already learned it.',2)
];
// Lines after each step, keyed by step id.
const AFTER={
 pellets:[line('There it is.\nThat lovely little killing face.',2)],
 save:[line('All that EXP, and you didn’t even use it right.',1)],
 buttons:[line('You found FIGHT every single time.',1),line('Every time but ONE.',4)],
 mercy:[line('One word. That’s all it took.',7),line('One word, and she BROKE.',9)],
 face1:[line('Let’s go check your work.',2)],
 ruins:[line('Empty seats. Just how you left them.',1)],
 turn:[line('Don’t act confused. You knew where this went.',7)],
 mouth:[line('She liked watching you try.',1),line('I don’t.',7)],
 hands:[line('You had a partner.',7),line('You threw her away.',4)],
 name:[line('You kept your name.',1),line('Everyone else became a number.',2)],
 face2:[line('Hee hee hee. Another file for the pile.',3)],
 snowdin:[line('Remember that little light?',1),line('Keep running.',2)],
 screen:[line('She’s not hiding behind the glass.',7)],
 delete:[line('Fewer choices.',0),line('You liked it that way.',2)],
 over:[line('No.',7),line('You don’t get to leave until I’m DONE.',4)],
 you:[line('That other heart?',1),line('It isn’t her. It never will be.',7)],
 face3:[line('LOAD.',6)],
 waterfall:[line('The hammer stopped.',7),line('She took the rest.',2)],
 montage:[],
 body:[line('Quit moving.',4),line('I’m trying to FIX something.',9)],
 theatre:[line('The house is empty.',7),line('It still won’t let you sit down.',1)],
 cataclysm:[line('All that noise.',7),line('And then nothing.',10)],
 gerson:[line('He bought them time.',7),line('You bought yourself nothing.',2)],
 neo:[line('That salesman kept getting up.',1),line('What a stupid trick.',4)],
 muffet:[line('She kept her toys alive.',1),line('I don’t need to.',6)],
 misery:[line('He wasn’t even there.',7),line('And you STILL lost her.',9)]
};
// One line at the start of each step, then two more during it.
const AMBIENT={
 pellets:['Friendliness pellets! Hee hee. Kidding.','You know what these are for now.','DIE.'],
 save:['Oh! Did you level up? Let me see!','Keep feeding me.','That LOVE looks good on me.'],
 buttons:['Your favorite button!','It worked on everyone else.','Press it, idiot! PRESS IT!'],
 mercy:['You only had to do it ONCE.','One more swing. That’s it.','WHY HER?'],
 face1:['FILE 0. SAVED.','Let’s count them together!','One. Two. ...Golly, I lost count. Did you?'],
 ruins:['No audience. No applause.','Want me to clap? I don’t have hands.','Hee hee hee.'],
 turn:['Wrong way!','She always knew the way.','You could’ve followed her. You chose to win.'],
 mouth:['Open wide!','This isn’t a game anymore. You made sure.','Stop DODGING.'],
 hands:['You let her get close.','She let YOU get close. Do you know how rare that is?','And then you did THAT.'],
 name:['SETH.','Such a nice little name.','Shame if it went missing.'],
 face2:['FILE 1. SAVED.','Hold still.','HOLD STILL.'],
 snowdin:['Dust on the snow!','Shh. Don’t wake anything.','Oh, wait. There’s nothing left to wake.'],
 screen:['Go on. Look for her.','She isn’t coming.','Look harder. Hee hee.'],
 delete:['MERCY. Deleted.','Don’t worry. You weren’t using it.','Oh, wait. You used it ONCE.'],
 over:['Goodbye!','...Why are you still here?','I SAID GOODBYE.'],
 you:['Two hearts!','One of them’s a lie.','Guess which. Hee hee.'],
 face3:['FILE 2. SAVED.','No more mistakes.','DELETE. DELETE. DELETE.'],
 waterfall:['Mind the hammer!','She was right behind you here.','Keep walking. She did.'],
 montage:['No shortcuts!','Your friends left all this running.','Nearly there. Nearly gone.'],
 body:['Get OUT.','No. Stay IN. STAY IN.','JUST STOP MOVING!'],
 theatre:['No encore.','Bow! Nobody’s watching!','You made sure.'],
 cataclysm:['Look what you opened.','Every direction cuts.','No little light this time.'],
 gerson:['mind your footing, kid.','Oops! Wrong voice.','Hee hee hee.'],
 neo:['A DEAL IN THE DARK!','No refunds!','No second customer.'],
 muffet:['Mind the strings, dearie!','Hee hee. It fits you.','Nobody’s cutting YOU loose.'],
 misery:['you had a partner.','She isn’t here to catch you.','Nobody is.'],
 last:['You broke it.','I can FIX it.','Just let me— LET ME FIX IT!']
};
// Act two: the last machine goes quiet, and he takes the soul.
const DARK=[
 line('The last machine goes quiet.\nYou can hear your own breathing.',-1),
 line('There. No one watching.',7),
 line('You think she’ll thank you?\nFor letting her keep all this?',1),
 line('She’s out there somewhere.\nTalking to herself. Making plans that don’t work.',7),
 line('If you’re gone...\nMaybe she’ll try again.',11),
 line('She HAS to.',9),
 line('Vines close around your wrist.\nThe notebook tears.',-1),
 line('I’ll take that SOUL.\nYou don’t get another turn.',2)
];
// Act three opens inside him.
const INSIDE=[
 line('Still here?',4),line('It’s MY soul now.\nWhy won’t it SHUT UP?',9),
 line('Six pages turn in the dark.\nThe last one is almost blank.',-1),
 line('You don’t need those.\nI know what happened.\nI was WATCHING.',4)
];
// Six torn pages of Seth’s route, in the order they come back. The last one is the spare.
const MEMORIES=[
 {name:'THE EMPTY HOUSE',color:'#b777ea',mode:'red',thought:'You checked the empty seats.\nYou kept looking for another fight.',hint:'Don’t read that one. It’s boring.',reply:'The page does not make it better.\nIt is still yours.'},
 {name:'THE BROKEN DOOR',color:'#bc89e8',mode:'red',thought:'You brought the blade down again.\nThe light went somewhere you could not follow.',hint:'Leave it. It’s just a door.',reply:'You remember the sound after the armor broke.'},
 {name:'NO EXPERIENCE',color:'#b28bef',mode:'blue',thought:'The hammer blocked your hand.\nAqua moved first. You gained nothing.',hint:'Zero EXP? Why would you want THAT one?',reply:'You kept the page even without a number.'},
 {name:'THE UNFINISHED KILL',color:'#d396ef',mode:'red',thought:'The salesman would not stay down.\nSilk closed before your next strike.',hint:'Ugh. Not him again.',reply:'He disappeared alive.\nYour notebook cannot turn that into dust.'},
 {name:'THE OTHER PLAYER',color:'#be74f0',mode:'purple',thought:'Webs. Machinery. Two hearts moving.\nYou learned where she would stand.',hint:'Don’t. DON’T you dare.',reply:'You remember the nest.\nYou remember cutting the silk.'},
 {name:'THE SPARE',color:'#d5a2f2',mode:'yellow',thought:'The last attack ended.\nYou lowered your hand.',hint:'NO. Not that one. Give it BACK.',reply:'No EXP. No reward.\nYou chose it anyway.'}
];
const MEMORY_LINES=[
 [line('Don’t look away now.',4),line('You wanted it empty.',7)],
 [line('Don’t pretend you were gentle.',2),line('You kept swinging.',7)],
 [line('She got there first.',1),line('That bothered you, didn’t it?',2)],
 [line('Not everyone died.',7),line('You just kept TRYING.',4)],
 [line('She understood you.',11),line('And you RUINED it.',9)],
 [line('Put it DOWN.',9),line('That’s the mistake.',4),line('That’s the one I’m FIXING.',9),line('WHY WON’T IT TEAR?',9),line('The last page opens.\nYour next strikes no longer pull back.',-1)]
];
// The last page holds. Seth tears out of him.
const ESCAPE=[
 line('The last page holds.\nYou pull the notebook toward it.',-1),
 line('No. That isn’t an exit.',5),line('STOP!',9),
 line('You tear through the roots.\nYour soul follows the living thread back.',-1)
];
// Out of him, on the floor. He is small again, and only FIGHT is left.
const PLEA=[
 line('You hit the floor.\nYour chest moves.',-1),line('The flower lies in front of you.\nSmall again.',-1),
 line('Wait.',5),line('Golly, let’s not be hasty.',0),
 line('I can find her.\nI know where she likes to go.',8),
 line('You want that, right?\nYour little partner?',0),
 line('We can start over.\nJust the three of us.',11),
 line('...',7),line('You can’t kill me.\nI’m your—',11),
 line('The notebook is still in your hand.',-1)
];
// After the last strike: nothing from him. The epilogue is Seth’s.
const KILL=[
 line('The petals settle.',-1),
 line('Your soul beats inside your chest.\nNo file opens. No day begins again.',-1),
 line('Aqua is somewhere in the Underground.\nYou do not hear her come back.',-1),
 line('You close the notebook.\nThe king is still ahead.',-1)
];
// Kept so the engine’s pacifist endings still resolve to something; this route never offers them.
const FINAL=ESCAPE,RELEASE=KILL,EPILOGUE=KILL,CUT=KILL;
const STRIKE_LINES={
 hard:[[line('OW! You little—',9)],[line('There it is. There’s the human I remember.',2)]],
 mid:[[line('Hit harder. You know how.',1)],[line('Still holding back? NOW?',4)]],
 miss:[[line('You missed. Don’t start being nice NOW.',2)]],
 floor:[[line('One left. You know what comes next.',6)]],
 zero:[[line('No LOVE left for you. Hee hee.',3)]],
 inside:[[line('STOP TEARING!',9)],[line('That isn’t helping her!',4)],[line('I can still fix this!',11)],[line('Get OUT of me!',9)]],
 aqua:[[line('...Huh. It didn’t.',6)]]
};
// The rug pulls. RUG 1 drains his health back out of your EXP; RUG 2 gives the bar her name; RUG 3 zeroes your attack.
const RUGS={
 rug1:[line('Golly, look at all that EXP.',1),line('You earned it.\nI’ll take it.',2)],
 rug2:[line('Aqua.',7),line('There.\nDoes that make it harder to hit?',2)],
 rug3:[line('She liked you better\nwhen you could hurt something.',2),line('Let’s see how you like ZERO.',3)]
};
// Situational lines for this route.
const TRAPS={HEAL:'Aww, did that hurt? It said HEAL. I swear!',MERCY:'MERCY? From YOU? Hee hee hee.',SPARE:'Oh, NOW you like that word.',CONTINUE:'Good! I was hoping you’d say that.',RETRY:'You wanted another try. Here it comes!',QUIT:'Quit? She already did that. Don’t copy her.',SAVE:'Thanks! I’ll keep that for later.',LOAD:'Hee hee. Back where you belong.',FIGHT:'Oh, NOW you want to FIGHT?',FIGHT3:'You can’t hurt me from IN here, idiot.',ACT:'Here’s an action: RUN.',ITEM:'Oops! That one was mine.',PAUSE:'No, no. You don’t get to rest yet.',fallback:'Golly! That looked important!'};
const LOCKS={mercy:['Golly! You STILL think that does something?','...You do, don’t you. That’s the problem.'],item:'No snacks. You ate everyone’s anyway.',other:'Oops! Guess you’re not allowed to do that.'};
const RETRY=['Did you think dying would get you out?','I put you back! Where’s my thank-you?','You STILL remember? That’s getting annoying.','Again? Golly. She’d have beaten this by now.'];
Object.assign(exports,{STRIKE_LINES,RUGS,line,INTRO,AFTER,AMBIENT,DARK,INSIDE,MEMORIES,MEMORY_LINES,FINAL,RELEASE,EPILOGUE,CUT,ESCAPE,PLEA,KILL,TRAPS,LOCKS,RETRY});
};
