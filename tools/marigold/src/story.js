// MARIGOLD — The Forgotten Memorial. Every line of the encounter lives here.
// Lines the designer wrote are kept verbatim (obvious typos fixed only); they are marked KEPT.
const M=(face,text,pose)=>({speaker:'boss',face,text,pose});
const N=text=>({speaker:'narrator',text});
const A=(face,text)=>({speaker:'aqua',face,text});
const PH=(face,text)=>({speaker:'aqua',face,text,phone:true});
const F=(face,text)=>({speaker:'flowey',face,text});
const S=text=>({speaker:'seth',text});

// ---------------------------------------------------------------- the walk
const ROOMS={
 forest:'SNOWDIN FOREST — THE OLD PATH',
 gallery:'THE FORGOTTEN GALLERY',
 ledge:'THE LEDGE',
 memorial:'THE MEMORIAL'
};
const SIGN=[N('* "THE OLD GALLERY IS CLOSED.\n* BY ORDER OF THE ROYAL GUARD."'),N('* The sign is older than the town.')];
const FLOWEY_LURE=[
 F('smile','Howdy! Fancy seeing you all the way out here.'),
 F('smile',"The main road's snowed in. Real shame."),
 F('smile',"But there's an old path through the trees. Nobody uses it anymore."),
 F('wink',"Go on! Somebody up ahead has been DYING to meet you."),
 F('evil','...Hee hee.'),
 N('* Flowey sinks back into the snow.')
];
const FOREST_P={
 bush:[N('* A buttercup, growing out of the snow.'),N("* Someone planted it here on purpose.")],
 tracks:[N('* Small footprints lead deeper into the woods.\n* They were made by very heavy feet.')]
};
const FOREST_G={
 enter:[N('* The forest is very quiet.')],
 bush:[N('* Buttercups, growing out of the snow.'),N('* Somebody planted a whole row of them.\n* Like a path.')],
 tracks:[N('* Red crystal thorns jut from the snow.'),N('* Something has been cutting a path toward you.')]
};
const GALLERY_ENTER=[N('* An old gallery, carved into the rock.\n* The murals here are older than the town.')];
// KEPT: the murals are the designer's text, in story order.
const MURALS=[
 [N('* Ghost monsters were valued deeply in the war, due to their inability to die...'),N('* Or so was previously thought.')],
 [N('* Ghosts commonly did not inhabit society.'),N('* But the King in his warmth and wisdom brought the strongest in as his Royal Guard, led by a wise turtle who lived as long as they did.')],
 [N('* The Humans discovered a way to kill them, and made it their sole focus to eradicate the ghost-kind first.')],
 [N('* A small family of farmers fled into the cave first.'),N('* And as for the warriors, there was only one known survivor, forgotten to time.')],
 [N('* The reason the farmers survived was due to their distance from the war as a whole.'),N('* And why many other ghosts did not.')],
 [N('* See, a very rare subset of humans could create their own magic through sheer determination.'),N('* These were the mages that created the Barrier.'),N('* It was this very magic that allowed them to kill ghosts.')]
];
const MURAL_EXTRA_P=[N('* Fresh buttercups have been left beneath this one.')];
const MURAL_EXTRA_G=[N('* Fresh thorns have been driven into the stone around this one.')];
const LEDGE_P={edge:[N('* Far below, a little house is lit.'),N('* Someone down there is still awake.')],door:[N('* The cave smells like buttercups.')]};
const LEDGE_G={edge:[N('* Far below, a little house.'),N('* Its lights are off.')]};
const PLAQUE=[N('* The plaque is too worn to read.'),N('* Only one word is left.\n* "HOPE"')];

// Pacifist: Flowey's trap worked, and she is overjoyed.
const MEET_P=[
 N('* Someone is kneeling in front of the memorial.'),
 M('sad','They called them the hope of the Underground.'),
 M('sad','They gave us everything.'),
 M('serious','And what did we do?'),
 M('serious','We buried them.'),
 M('sad','We forgot them.'),
 M('sad','...'),
 M('serious',"I won't make that mistake."),
 {turn:true},
 M('smile','Oh!'),
 M('smile',"Oh, you're HERE! You're really here!"),
 M('smile',"He told me you'd come this way. He promised."),
 M('smile','The Prince always keeps his promises.'),
 M('neutral',"Please don't be frightened. This won't take long."),
 M('serious',"It's for someone very important.")
];
// Genocide: she came looking for the human herself.
const MEET_G=[
 M('angry','There you are.'),
 M('serious',"I followed the dust. It wasn't hard."),
 M('angry','Every step you took through Snowdin is written in it.'),
 M('deranged','Do you know how long I have waited to be RIGHT?'),
 M('angry','Come here, human. Let me show you what a monster is.')
];

// ---------------------------------------------------------------- battle
const CHECK={
 pacifist:'* MARIGOLD - ATK 30 DEF 25\n* A memorial to a human child.\n* Something inside it is very old.',
 genocide:'* MARIGOLD - ATK 30 DEF 25\n* The last knight of a war you never heard of.\n* She remembers this kind of human.'
};
const FLAVOR={
 pacifist:['* Marigold blocks the way!','* Marigold brushes snow from her dress.','* The scent of buttercups fills the air.','* Marigold examines your expression.','* Something rattles inside Marigold\'s chest.','* Marigold whispers a name under her breath.','* Marigold is trying very hard not to hesitate.','* The statue remembers why it was made.'],
 genocide:['* Marigold blocks the way.','* Thorns grind against copper.','* The smell of buttercups. And dust.','* Marigold\'s eye is burning.','* The statue remembers the war.','* She is not afraid of you.\n* She is furious.','* Marigold is smiling.\n* It doesn\'t reach her eye.','* Something rattles inside Marigold\'s chest.']
};
const FLAVOR_READY='* Marigold is trying very hard not to hesitate.\n* She is losing.';

// Story told between attacks. The designer's monologue is KEPT, in order.
const STORY_P=[
 [M('neutral','You know... someone very special used to look like you.'),M('smile','She was much braver, though.'),M('serious','She understood that sometimes, you have to do something terrible for the people you love.'),M('sad','...'),M('smile',"You understand that too, don't you?")],
 [M('serious','Seeing everyone give into hopelessness or apathy regarding humanity...'),M('angry','Is UNACCEPTABLE.')],
 [M('sad','Chara was the only good one among them...'),M('smile','She was a true monster at heart.'),M('angry',"And I will ensure she doesn't die in vain! Her memory will live on!")],
 [M('sad','Asgore...'),M('sad','...'),M('serious','He has been scarred by war and loss. Why should any hate him? No. I am carrying out the work, so he doesn\'t have to.'),M('angry','He has carried enough. The loss of his children... his COWARD wife abandoning him...'),M('sad','Nobody understands him, or Asriel or Chara...'),M('deranged','I alone... saw enough... to fight for what THEY BELIEVED IN!')],
 [M('angry','We will fight on. We will LIVE on!'),M('angry',"Humans are the real monsters, and monsters... we are the ones who truly have what they call 'humanity'. Hope, dreams... are they not OURS ALONE!?"),M('deranged','OUR BODIES ARE MADE OF MAGIC AND HOPE! THEY ARE FLESH AND BONE, COLD, HEARTLESS!')],
 [M('serious','Why... why are you still not fighting back?'),M('angry',"Fight back! It's easier when you fight back!")],
 [M('sad','She never hesitated. Not once.'),M('serious','So why am I...?')],
 [M('serious','Stop looking at me like that.'),M('sad',"Like you're sorry for me.")],
 [M('sad','You were supposed to be like the others.'),M('serious','Cruel. Cold. Easy.')],
 [M('neutral','The Prince is waiting.'),M('sad','He has waited for so long...')],
 [M('sad','...'),M('serious','Hold still. Please.')],
 [M('sad','Why does this feel like the war?')],
 [M('sad','I am so tired.'),M('serious','Knights do not get tired.')],
 [M('sad','...')]
];
const STORY_G=[
 [M('serious','Look at you.'),M('angry','Covered in it. Their dust.'),M('angry',"And you're still walking around like you belong here.")],
 [M('angry','We will fight on. We will LIVE on!'),M('angry',"Humans are the real monsters, and monsters... we are the ones who truly have what they call 'humanity'. Hope, dreams... are they not OURS ALONE!?"),M('deranged','OUR BODIES ARE MADE OF MAGIC AND HOPE! THEY ARE FLESH AND BONE, COLD, HEARTLESS!')],
 [M('serious','I watched your kind do this before.'),M('angry',"They hunted us first. The ghosts. Because we were the ones who couldn't die."),M('sad','And then we could.')],
 [M('angry',"You're one of THEM, aren't you?"),M('serious','I can feel it on you. That magic. The mages\' magic.'),M('deranged','Determination.'),M('sad','It was the last thing my friends ever felt.')],
 [M('serious','Seeing everyone give into hopelessness or apathy regarding humanity...'),M('angry','Is UNACCEPTABLE.'),M('deranged',"And you're the proof. You're the PROOF!")],
 [M('serious','Asgore will never have to dirty his hands with you.'),M('angry',"I'll do it. I'll carry it. Like I always have.")],
 [M('sad','Chara was the only good one among them...'),M('smile','She was a true monster at heart.'),M('angry',"And you? You're just a human.")],
 [M('serious',"Do you hear that? My vessel's cracking."),M('angry',"It doesn't matter. Copper is stronger than flesh.")],
 [M('deranged','One SOUL. That is all the Prince needs from you.'),M('angry','And I will put it in his hands myself.')],
 [M('angry',"I'm still standing."),M('deranged',"I'm STILL STANDING.")],
 [M('serious','The Royal Guard never retreated.'),M('angry','Not once. Not even at the end.')],
 [M('deranged','Run, then! RUN! That is what humans are best at!')],
 [M('sad','...'),M('angry','Again.')],
 [M('sad','...')]
];

// TALK on the pacifist route: three topics, in order. The first two are KEPT monologues.
const TALK_P=[
 {prompt:'* You ask who the statue was.',lines:[M('sad','And Chara...'),M('sad','Poor Chara... the only human with a heart, trapped in flesh and bone...'),M('serious','Part of a species she despised...'),N('* Marigold is crying.\n* Or the snow is melting on the copper.\n* You can\'t tell.'),M('sad','What a horrible existence, and yet... that girl made the Dreemurrs so happy... you... you couldn\'t know...'),M('sad','How much hope that little girl gave us all for the future...'),M('serious','All I want...'),M('deranged','Is TO CARRY IT ON!')]},
 {prompt:'* You ask who "the Prince" is.',lines:[M('smile','You know... I know a secret...'),M('smile','The Prince lives on...'),M('smile','Hehe... we talk sometimes... he believes in the plan...'),M('sad','...'),M('sad','I can never be her...'),M('neutral','But...'),M('serious',"If I can fulfill her dream, I'd be satisfied.")]},
 {prompt:'* You ask who SHE was.\n* Before the statue.',needsAqua:true,lines:[M('neutral','Who I... was?'),M('serious','I was a knight. I served the King.'),M('sad','I had a name before this one. I had armor, and friends, and...'),M('sad','...'),M('sad',"I don't remember."),M('angry',"It doesn't matter! It doesn't...!"),N('* Marigold is trying very hard not to hesitate.\n* She is losing.')]}
];
const TALK_EARLY=[N('* You try to ask who she was.\n* She talks right over you.'),M('angry','Enough questions!')];
const TALK_DONE=[N('* You tell Marigold she doesn\'t have to do this.'),M('sad','I know.')];
const TALK_G=[N('* You open your mouth.'),M('angry','Do not speak to me.')];
const STAND=[N('* You plant your feet and steady your breathing.\n* The next attack will hurt less.')];

// Calling Aqua. Every call annoys Marigold; on genocide that is dangerous.
const CALLS_P=[
 [N('* You dial Aqua.\n* Ring... ring...'),PH(2,'...Ugh. What.'),S('* (You explain the statue.)'),PH(5,"A statue. Is attacking you. Seth, I'm in WATERFALL."),PH(2,'Call someone else.'),N('* Click.')],
 [N('* Ring... ring...'),PH(1,"Again? ...Okay, does she at least have a cool sword?"),S('* (You describe the thorn sword.)'),PH(3,"...Okay. That's kind of sick. Still not coming."),N('* Click.')],
 [N('* Ring... ring...'),PH(2,"Seth. I'm busy. ...No, I'm not grinding. I'm sitting. On a rock."),S('* (You tell her about Chara.)'),PH(1,"Who's Chara? ...Why does the statue care so much?"),PH(5,'...Whatever. Bye.'),N('* Click.')],
 [N('* Ring... ring...'),PH(5,"You know you're the only one who calls me, right?"),PH(2,'...'),PH(1,'Ugh. Fine. FINE.'),PH(3,"Don't die before I get there. That'd be so annoying."),N('* Click.')]
];
const CALL_P_AFTER=[N('* Ring... ring...'),PH(2,"I'm COMING. Stop calling!"),N('* Click.')];
const CALL_P_HERE=[N('* Aqua is right next to you.'),A(1,'...Did you just try to call me?')];
const ARRIVAL=[
 N('* Footsteps crunch through the snow.'),
 A(1,'Hey. Statue.'),
 A(5,"...Okay, you're way shorter than Seth said."),
 M('serious','Another... human?'),
 A(3,"That's my partner you're trying to stab. Get in line."),
 M('sad','...Two of you. Defending each other?'),
 M('serious',"That isn't... humans don't..."),
 N('* AQUA joins the fight.')
];
const CALLS_G=[
 [N('* You dial Aqua.\n* Ring... ring...'),PH(2,"Busy. Grinding. Waterfall's got a lot of EXP walking around."),N('* Click.')],
 [N('* Ring... ring...'),PH(2,'...Fine. Read me your notes.'),S('* (You read her what you wrote down.)'),PH(1,"Her thorns come up where she's looking. Watch her eye, not the thorns."),N('* Her next attack will be easier to read.')],
 [N('* Ring... ring...'),PH(1,'Copper statue, right? Old copper cracks.'),PH(3,'Hit the cracked side. Under the crown.'),N('* Your strikes will land harder.')],
 [N('* Ring... ring...'),PH(5,"The flowers. Don't breathe that stuff."),PH(1,"Poison doesn't kill you. It keeps you low. Get out of the cloud fast."),N('* Poison will hurt you less.')],
 [N('* Ring... ring...'),PH(1,'Her lance. She always pulls it back before she thrusts.'),PH(3,'Count the pullback. Then move.'),N('* Her lance will be easier to read.')],
 [N('* Ring... ring...'),PH(2,"I've told you everything. Stop calling."),PH(5,"...Don't die. It'd be annoying."),N('* Click.')]
];
// Marigold, after each call.
const ANNOY_P=[
 [M('neutral','Is that... a phone? Right now?')],
 [M('serious','Excuse me. I am talking to you.')],
 [M('angry','Who ARE you talking to?! This is a very important moment!')],
 [M('angry','Put. It. Away.')],
 [M('angry','Ugh!')]
];
const ANNOY_G=[
 [M('angry','Who are you calling? Who could possibly want to hear from YOU?')],
 [M('angry','Look at me when I am talking to you!')],
 [M('deranged',"Another human. There's ANOTHER one.")],
 [M('angry','You think a phone call is going to save you?')],
 [M('deranged','STOP. LOOKING. AWAY. FROM. ME.')],
 [M('deranged','...')]
];

const SPARE_EARLY_P=[[M('sad',"Mercy...? Please don't. That's what makes this so hard.")],[M('angry','Stop offering that!')],[M('serious','...')]];
const SPARE_G=[[M('angry','Mercy. From YOU.')],[M('deranged','Your kind invented that word so you would have something to take away.')],[M('angry','No.')]];
const FLEE_P=[N('* You try to run.\n* Thorns close over the cave mouth.')];
const FLEE_G=[N('* You try to run.\n* The thorns are faster.')];

// Endings.
const SPARED=[
 M('sad',"...I can't do it."),
 M('sad',"She would have. She wouldn't have even blinked."),
 M('serious',"But I'm not her. I was never her."),
 M('sad','I was... somebody else. Wasn\'t I?'),
 N('* The thorns on Marigold\'s crown wilt.'),
 A(5,'...So what now? You just stand around in a cave forever?'),
 M('neutral','I used to keep records. A long time ago. Before the war.'),
 M('smile',"Someone should write down what happened. All of it. Even the parts nobody wants to remember."),
 A(1,"And the flowers? They're literally poison."),
 M('smile',"Because I think it's pretty."),
 N('* Marigold lets you pass.')
];
const KILLED_P=[M('sad','Oh...'),M('sad',"I'm sorry, Chara. I couldn't..."),N('* The statue does not turn to dust.'),N('* It is just a statue again.')];
const KILLED_G=[M('deranged','No... no, no, no...'),M('sad','I was supposed to... carry it on...'),M('sad',"Chara... I'm sorry..."),M('sad',"I couldn't..."),N('* Marigold does not turn to dust.\n* The copper stays exactly where it fell.'),N('* There is nobody inside it anymore.')];
const STRIKE_P=['The copper only cracked.','Is that all...?','Please stop.','You can hit harder than that. Can\'t you?'];
const STRIKE_G=['Again. Come on.','Copper is stronger than flesh!','I have taken worse from better mages.','Is that all the determination you have?'];

Object.assign(exports,{ROOMS,SIGN,FLOWEY_LURE,FOREST_P,FOREST_G,GALLERY_ENTER,MURALS,MURAL_EXTRA_P,MURAL_EXTRA_G,LEDGE_P,LEDGE_G,PLAQUE,MEET_P,MEET_G,CHECK,FLAVOR,FLAVOR_READY,STORY_P,STORY_G,TALK_P,TALK_EARLY,TALK_DONE,TALK_G,STAND,CALLS_P,CALL_P_AFTER,CALL_P_HERE,ARRIVAL,CALLS_G,ANNOY_P,ANNOY_G,SPARE_EARLY_P,SPARE_G,FLEE_P,FLEE_G,SPARED,KILLED_P,KILLED_G,STRIKE_P,STRIKE_G,M,N,A});
