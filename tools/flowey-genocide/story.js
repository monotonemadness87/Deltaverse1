modules["story.js"]=(exports,require)=>{
const line=(text,face=0)=>({text,face});
// Faces: 0 friendly · 1 smug · 2 sly · 3 laughing · 4 angry · 5 shocked · 6 creepy · 7 flat · 8 fake pout · 9 rage · 10 blank · 11 rattled. -1 is Seth's own narration.
// False genocide: Seth killed everyone, then spared Aqua at the very end. She broke and ran.
// Flowey has run this over and over. He put the two of them together, he held every door, and he will have his ending.
// This isn't a fight to him. It's course correction. The false-pacifist Flowey was bored; this one is not.
const INTRO=[
 line('Howdy!',0),line('Golly. It’s so QUIET down here now.',1),
 line('Every town. Every guard. Every last one.\nYou two were PERFECT.',3),
 line('And then, at the very end...',7),line('You SPARED her.',9),
 line('Do you know how many times I’ve watched this play out?',7),
 line('I’ve run this over and over and over again.',6),
 line('Trying to get my perfect ending.',2),line('And I WILL.',9),
 line('If you’d just finished the job, I’d have left you two alone.',7),
 line('But now?',10),line('This isn’t a fight.',6),line('It’s course correction.',2)
];
// Lines after each step, keyed by step id.
const AFTER={
 pellets:[line('There it is.\nThat lovely little killing face.',2)],
 save:[line('Did you feel that? That was me.\nI do that a LOT.',3),line('All that EXP, and you didn’t even use it right.',1)],
 buttons:[line('You found FIGHT every single time.',1),line('Every time but ONE.',4)],
 mercy:[line('One word. That’s all it took.',7),line('One word, and she BROKE.',9)],
 face1:[line('Let’s go check your work.',2)],
 ruins:[line('Empty seats. Just how you left them.',1),line('Well. Except for my friends.',3)],
 turn:[line('You two. Partners. Hee hee.',3),line('Who do you think introduced you?',2)],
 mouth:[line('She liked watching you try.',1),line('I made sure she had something to watch.',6)],
 hands:[line('Every time you two got stuck, who showed up?',1),line('Me. It was ALWAYS me.',2)],
 name:[line('You kept your name.',1),line('Everyone else became a number.',2)],
 face2:[line('Hee hee hee. Another file for the pile.',3)],
 snowdin:[line('Remember that little light?',1),line('Keep running.',2)],
 screen:[line('She’s not hiding behind the glass.',7),line('She’s not anywhere I can’t find her.',6)],
 delete:[line('Fewer choices.',0),line('You liked it that way.',2)],
 over:[line('No.',7),line('You don’t get to leave until I’m DONE.',4)],
 you:[line('That other heart?',1),line('It isn’t her. It never will be.',7)],
 face3:[line('LOAD.',6)],
 waterfall:[line('The hammer stopped.',7),line('She took the rest.\nI told her when.',2)],
 montage:[],
 body:[line('Quit moving.',4),line('I’m CORRECTING something.',9)],
 theatre:[line('The house is empty.',7),line('It still won’t let you sit down.',1)],
 cataclysm:[line('All that noise.',7),line('And then nothing.',10)],
 gerson:[line('He bought them time.',7),line('You bought yourself nothing.',2)],
 neo:[line('That salesman kept getting up.',1),line('What a stupid trick.\nTrust me. I’d know.',6)],
 muffet:[line('She kept her toys alive.',1),line('I don’t need to.',6)],
 misery:[line('He wasn’t even there.',7),line('And you STILL lost her.',9)]
};
// One line at the start of each step, then two more during it.
const AMBIENT={
 pellets:['Friendliness pellets! Hee hee. As if.','You know exactly what these are for.','DIE.'],
 save:['Oh! Did you level up? Let me see!','Keep feeding me.','That LOVE looks good on me.'],
 buttons:['Your favorite button!','It worked on everyone else.','Press it, idiot! PRESS IT!'],
 mercy:['You only had to do it ONCE.','One more swing. That’s all I needed.','WHY HER?'],
 face1:['FILE 0. SAVED.','Let’s count them together!','One. Two. ...Golly, I lost count. Did you?'],
 ruins:['No audience. No applause.','My friends came to watch, though!','Hee hee hee.'],
 turn:['Wrong way!','She always knew the way. I made sure.','You could’ve followed her. You chose to win.'],
 mouth:['Open wide!','This was never a game. Not for you.','Stop DODGING.'],
 hands:['You let her get close.','Who do you think put her there?','And then you did THAT.'],
 name:['SETH.','Such a nice little name.','I’ve heard it screamed a thousand times.'],
 face2:['FILE 1. SAVED.','Hold still.','HOLD STILL.'],
 snowdin:['Dust on the snow!','Count the Floweys! There’s more of me than them now.','Nothing left to wake up.'],
 screen:['Go on. Look for her.','She isn’t coming.','She never came. Not once. Not in ANY of them.'],
 delete:['MERCY. Deleted.','You weren’t using it anyway.','Oh, wait. You used it ONCE.'],
 over:['Goodbye!','...Why are you still here?','I SAID GOODBYE.'],
 you:['Two hearts!','One of them’s mine. It always was.','Guess which. Hee hee.'],
 face3:['FILE 2. SAVED.','No more mistakes.','DELETE. DELETE. DELETE.'],
 waterfall:['Mind the hammer!','I lent you two a hand here. Remember?','You’d have died here without me.'],
 montage:['No shortcuts!','I held the door at the CORE, too.','Nearly there. Nearly gone.'],
 body:['Get OUT.','You’re in MY head now.','JUST STOP MOVING!'],
 theatre:['No encore.','Bow! Nobody’s watching!','You made sure.'],
 cataclysm:['Look what you opened.','Every direction cuts.','No little light this time.'],
 gerson:['mind your footing, kid.','Oops! Wrong voice.','Hee hee hee.'],
 neo:['A DEAL IN THE DARK!','No refunds!','No second customer.'],
 muffet:['Mind the strings, dearie!','Hee hee. It fits you.','Nobody’s cutting YOU loose.'],
 misery:['you had a partner.','She isn’t here to catch you.','Nobody is.'],
 last:['This isn’t a fight.','It’s course correction.','Win here, and I just go back. I ALWAYS go back.']
};
// Act two: the last machine goes quiet. He tells Seth what the partnership really was.
const DARK=[
 line('The last machine goes quiet.\nYou can hear your own breathing.',-1),
 line('There. No one watching.',7),
 line('You think you two found each other?',1),
 line('I put her in your path.\nI put YOU in hers.',2),
 line('Every fight you won together, I was holding the door.',6),
 line('And you spared her. At the END.',9),
 line('She’s out there somewhere.\nTalking to herself. Making plans that don’t work.',7),
 line('Once you’re gone, I go back.\nAnd this time, she finishes it.',2),
 line('Vines close around your wrist.\nThe notebook tears.',-1),
 line('I’ll take that SOUL.\nYou don’t get another turn.',2)
];
// Act three opens inside him.
const INSIDE=[
 line('Still here?',4),line('It’s MY soul now.\nWhy won’t it SHUT UP?',9),
 line('Six pages turn in the dark.\nThe last one is almost blank.',-1),
 line('You’ve met the version of me that played nice.',1),line('He was BORED.',2),line('I’m not.',9),
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
 [line('She got there first.',1),line('That bothered you, didn’t it?',2),line('I told her to.',6)],
 [line('Not everyone died.',7),line('You just kept TRYING.',4)],
 [line('She understood you.',11),line('And you RUINED it.',9)],
 [line('Put it DOWN.',9),line('That’s the mistake.',4),line('That’s the one I’m CORRECTING.',9),line('WHY WON’T IT TEAR?',9),line('The last page opens.\nYour next strikes no longer pull back.',-1)]
];
// The last page holds. Seth tears out of him.
const ESCAPE=[
 line('The last page holds.\nYou pull the notebook toward it.',-1),
 line('No. That isn’t an exit.',5),line('STOP!',9),
 line('You tear through the roots.\nYour soul follows the living thread back.',-1)
];
// Out of him, on the floor. He is small again, and he isn’t begging.
const TAUNT=[
 line('You hit the floor.\nYour chest moves.',-1),line('The flower lies in front of you.\nSmall again.',-1),
 line('Oh.',7),line('You got out.',1),line('Golly. Congratulations.',2),
 line('Go on, then. Do it.',6),line('Even if you win here?',2),line('I’ll just go back.',6),
 line('The notebook is still in your hand.',-1)
];
// The first slash really gets him. Then he laughs in Seth’s face.
const LAUGH=[
 line('...',11),line('Hee hee hee hee hee.',3),
 line('Sans was right, you know?',2),line('You might as well have let Sans win.',1),
 line('Aqua’s gone.',7),line('And Asgore’s ahead...',6)
];
const VERDICT='YOU’RE ALREADY DEAD.';
// After the last strike: Seth’s epilogue, and no hope in it.
const KILL=[
 line('You keep swinging\nlong after there is anything left to hit.',-1),
 line('The petals settle.',-1),
 line('Your soul beats inside your chest.\nSomewhere, a file is still saved.',-1),
 line('Aqua is gone.\nThe king is still ahead.',-1)
];
// Kept so the engine’s pacifist endings still resolve to something; this route never offers them.
const PLEA=TAUNT,FINAL=ESCAPE,RELEASE=KILL,EPILOGUE=KILL,CUT=KILL;
const STRIKE_LINES={
 hard:[[line('OW! You little—',9)],[line('There it is. There’s the human I remember.',2)]],
 mid:[[line('Hit harder. You know how.',1)],[line('Still holding back? NOW?',4)]],
 miss:[[line('You missed. Don’t start being nice NOW.',2)]],
 floor:[[line('One left. You know what comes next.',6)]],
 zero:[[line('No LOVE left for you. Hee hee.',3)]],
 inside:[[line('STOP TEARING!',9)],[line('Hit me all you want. I’ll just LOAD.',6)],[line('I remember every hit. EVERY one.',4)],[line('Get OUT of me!',9)]],
 aqua:[[line('...Huh. It didn’t.',6)]]
};
// The rug pulls. RUG 1 drains his health back out of your EXP; RUG 2 gives the bar her name; RUG 3 zeroes your attack.
const RUGS={
 rug1:[line('Golly, look at all that EXP.',1),line('Who do you think fed it to you?',2),line('Every hint. Every shortcut.\nEvery “Seth! Hit him! NOW!”',3),line('You earned it.\nI’ll take it.',2)],
 rug2:[line('Aqua.',7),line('There.\nDoes that make it harder to hit?',2)],
 rug3:[line('You two were HOPELESS, you know.',1),line('Such hopeless little brats.\nYou needed me for EVERYTHING.',3),line('And then you started getting stronger.',7),line('Let’s see how you like ZERO.',9)]
};
// Situational lines for this route.
const TRAPS={HEAL:'Aww, did that hurt? It said HEAL. I swear!',MERCY:'MERCY? From YOU? Hee hee hee.',SPARE:'Oh, NOW you like that word.',CONTINUE:'Good! I was hoping you’d say that.',RETRY:'You wanted another try. Here it comes!',QUIT:'Quit? She already did that. Don’t copy her.',SAVE:'Thanks! I’ll keep that for later.',LOAD:'Hee hee. Back where you belong.',FIGHT:'Oh, NOW you want to FIGHT?',FIGHT3:'You can’t hurt me from IN here, idiot.',ACT:'Here’s an action: RUN.',ITEM:'Oops! That one was mine.',PAUSE:'No, no. You don’t get to rest yet.',fallback:'Golly! That looked important!'};
const LOCKS={mercy:['Golly! You STILL think that does something?','...You do, don’t you. That’s the problem.'],item:'No snacks. You ate everyone’s anyway.',other:'Oops! Guess you’re not allowed to do that.'};
const RETRY=['Did you think dying would get you out?','LOAD. Hee hee. I can do this forever.','You STILL remember? That’s getting annoying.','Again? Golly. She’d have beaten this by now.'];
Object.assign(exports,{STRIKE_LINES,RUGS,line,INTRO,AFTER,AMBIENT,DARK,INSIDE,MEMORIES,MEMORY_LINES,FINAL,RELEASE,EPILOGUE,CUT,ESCAPE,PLEA,TAUNT,LAUGH,VERDICT,KILL,TRAPS,LOCKS,RETRY});
};
