// ENCORE — Count Anansi. Every line of the encounter. The designer's lines are kept verbatim (obvious typos fixed only).
// His voice follows the Shadow Mantle holder's quirks: he savours a name, capitalises only the prize, asks accusing
// questions, wears mock hospitality, laughs and pivots ("~!"), and leaves notes in empty rooms.
const C=(face,text)=>({speaker:'boss',face,text});
const N=text=>({speaker:'narrator',text});
const A=(face,text)=>({speaker:'aqua',face,text});

// ---------------------------------------------------------------- the walk
const ROOMS={hall:'THE RUINS — THE SPIDERS\' WING',theatre:'THE THEATRE'};
const SIGN_P=[N('* "SPIDER BAKE SALE.\n* ALL PROCEEDS GO TO THE SPIDERS STILL IN HERE."'),N('* Someone has crossed out "STILL IN HERE" and written "NOT FOR LONG".')];
const SIGN_G=[N('* "SPIDER BAKE SALE."'),N('* The table is empty.\n* Even the webs have been abandoned.')];
const WEB_P=[N('* A spider waves at you from its web.\n* Then it points toward the theatre and shakes its head.')];
const WEB_G=[N('* An empty web, still trembling.\n* Whatever lived here ran.')];
const POSTER_P=[N('* A faded playbill.\n* "TONIGHT: THE COUNT. AND HIS DAUGHTER, ON LIGHTS."'),N('* Her name has been scratched out with a claw.')];
const POSTER_G=[N('* A faded playbill.\n* "TONIGHT: THE COUNT."'),N('* Someone has added, in fresh red: "ONE LAST SHOW."')];
const SEAT_NOTES=[[N('* A note on the seat.\n* "See you soon."')],[N('* A note on the seat.\n* "Enjoying the show?"')],[N('* A note on the seat.\n* "Front row. For you. Always for you."')]];
const SEAT_NOTES_G=[[N('* A note on the seat.\n* "I heard you coming."')],[N('* A note on the seat.\n* "Enjoying the show?"')],[N('* The seat is scorched.')]];

const MEET_P=[
 C('closed','Seth... oh... Seth...'),
 C('smile','There is a seat for you. There is always a seat.'),
 C('teasing','But tonight, you are not in the audience. Tonight you are on the STAGE~!'),
 C('amused','What matters most is the performance, the stage, the play!'),
 C('smile','How you perform is what matters!'),
 C('teasing','If life is a game, why not have fun!?'),
 C('menacing','A wolf does not lament the sheep he eats, why should we~!?')
];
const MEET_G=[
 C('serious','I know that silence. It followed you through the Ruins.'),
 C('menacing','There will be no introductions.'),
 C('intrigued','...Hm? Seth... oh... Seth...'),
 C('scheming','You taste like someone I used to know.'),
 C('cackle','FUHUHU... Then let us PLAY, little mage~!')
];

// ---------------------------------------------------------------- battle
const CHECK={
 pacifist:'* COUNT ANANSI - ATK 15 DEF 10\n* The count of spiderkind. Half fire.\n* He is having the time of his life.',
 genocide:'* COUNT ANANSI - ATK 30 DEF 20\n* A veteran of the war.\n* He has decided this is his last show.'
};
const FLAVOR={
 pacifist:['* The curtain rises.\n* Count Anansi takes a bow before the show.','* Count Anansi swirls his glass.\n* It is very red.','* The smell of candle wax and old velvet.','* A spider in the rafters is taking notes.','* Count Anansi hums the overture to himself.','* The orange footlights flicker.','* Count Anansi is enjoying himself immensely.','* Somewhere, a spider is applauding.'],
 genocide:['* Count Anansi attacks.','* The house is empty.\n* The footlights burn anyway.','* The smell of smoke and old velvet.','* Count Anansi laughs at nothing.','* The spiders in the rafters are watching.','* The stage is getting warm.','* Count Anansi is enjoying himself.\n* That is the problem.','* Embers drift down from the rigging.']
};
const FLAVOR_READY='* Count Anansi is holding a small, folded letter.';

// Between attacks. KEPT lines are the designer's, in their order.
const STORY_P=[
 [C('amused','A full house. If I count you twice.'),C('teasing','You may wonder where everyone went. Please... take your time asking.')],
 // His wife, the Mage of Perseverance, and her letter.
 [C('serious','My wife was a human, you know. A mage. Perseverance, like you.'),C('scheming','She wrote to me, once. She prayed I would leave the Underground one day...'),C('menacing','...so that we could kill each other.'),C('laugh','She was only human, she\'s long dead... yet, I wonder... what a wonderful fight that would\'ve been, our own hate and spite for each other...'),C('teasing',"I suppose you'll have to do!")],
 [C('closed','Monsters are everywhere you know... behind your eyes, and ahead of them too...'),C('serious','Monsters we are called...'),C('angry','And yet, you humans slaughtered.'),C('thinking','And we were not innocent either. We were monsters too.'),C('scheming','... hell, if we had the power humans feared we would obtain by absorbing a human SOUL...'),C('teasing',"We probably would've done the same thing~!")],
 [C('menacing','I ruled the spiders with an iron fist and made them perform on this stage...'),C('serious','Until one day... they ran off with my daughter...'),C('cackle','We fought, of course, like any game...!'),C('closed','...'),C('tired','And in my older age, she beat me.'),C('smile',"She's so strong, must be even stronger now. I can only imagine her playing her games now."),C('flustered','I could not be prouder...'),C('closed','What is the dream of any father, but to see their child surpass them?')],
 [C('smile','She was better than I, in so many ways. Oh how the spiders adored her.'),C('amused','She promised them a great feast!'),C('laugh','I told them it was impossible to escape... and yet, that crazy woman and her pet broke through, just for a moment, before the walls collapsed! With so many!'),C('tired','I was never a good king for spiders, being half fire monster...'),C('cackle',"FUHUHU, GOOD THING MY DAUGHTER DIDN'T INHERIT THE FIRE PART!")],
 [C('thinking','So much like her mother... never accepting the limits imposed on her...'),C('intrigued',"I wonder, if here and now, it's her fighting me through you..."),C('laugh',"Haha! Well, I mustn't falter if that's the case!")],
 [C('annoyed','And then I lost to the exiled queen... how humiliating.'),C('angry','Who taught the Dreemurrs fire magic but my bloodline!?'),C('surprised',"You've reignited my spark, human!"),C('menacing',"When I'm done here, I will burn these ruins down and show the world the great Count Anansi once more!"),C('cackle','And the games will never end!')],
 [C('angry','I want to live!'),C('angry','I want to fight!'),C('intrigued','I want to hope!'),C('smile','I want to keep dreaming!'),C('sad','What have I done here but flicker and fade away!?'),C('menacing','So let us sharpen each other, one more time!'),C('laugh','That is what games are for!!!')],
 [C('surprised','...Do you hear that?'),N('* Something is moving in the empty seats.'),C('cackle','Everyone watch me now! Your count!'),C('menacing','One of the few monsters who faced humans and lived to tell the tale! Not a guard, not a king, but the great count of spiderkind!')]
];
// The genocide fight: the same man, with the safety off.
const STORY_G=[
 [C('amused','A full house. If I count you twice.'),C('menacing','You may wonder where everyone went. You already know.')],
 [C('serious','My wife was a human, you know. A mage. Perseverance, like you.'),C('scheming','She wrote to me, once. She prayed I would leave the Underground one day...'),C('menacing','...so that we could kill each other.'),C('laugh','She was only human, she\'s long dead... yet, I wonder... what a wonderful fight that would\'ve been, our own hate and spite for each other...'),C('teasing',"I suppose you'll have to do!")],
 [C('closed','Monsters are everywhere you know... behind your eyes, and ahead of them too...'),C('serious','Monsters we are called...'),C('angry','And yet, you humans slaughtered.'),C('thinking','And we were not innocent either. We were monsters too.'),C('scheming','... hell, if we had the power humans feared we would obtain by absorbing a human SOUL...'),C('teasing',"We probably would've done the same thing~!")],
 [C('menacing','I ruled the spiders with an iron fist and made them perform on this stage...'),C('serious','Until one day... they ran off with my daughter...'),C('tired','And in my older age, she beat me.'),C('smile','I could not be prouder...')],
 [C('thinking','So much like her mother... never accepting the limits imposed on her...'),C('intrigued',"I wonder, if here and now, it's her fighting me through you..."),C('laugh',"Haha! Well, I mustn't falter if that's the case!")],
 [N('* The spiders pour out of the rafters.\n* Some of them are burning.'),C('cackle','See? We monsters fight for our beliefs, whether we live or die, it matters not!'),C('menacing','Sooo!!!'),C('angry',"Let's SEE WHO CAN PERSEVERE!")]
,
 [C('angry','I want to live!'),C('angry','I want to fight!'),C('intrigued','I want to hope!'),C('smile','I want to keep dreaming!'),C('sad','What have I done here but flicker and fade away!?'),C('menacing','So let us sharpen each other, one more time!'),C('laugh','That is what games are for!!!')]
];
// He won't stay down: each time he hits 0, he reignites, a little dimmer, and the room gets hotter.
const REIGNITE=[
 [N('* Count Anansi gutters out.'),N('* ...'),N('* The flame catches again.'),C('cackle','FUHUHU... you think a little thing like that puts ME out?'),C('menacing','I have burned through worse nights than this! Strings, everyone! STRINGS!')],
 [N('* Count Anansi gutters out.'),N('* The strings burn away.'),N('* The flame catches again. Dimmer.'),C('tired','Hah... hah... the room is getting warm, isn\'t it~?'),C('angry','One more time. ONE MORE!')]
];
const DEATH_G=[
 C('tired',"Hah... I'm just an old man... thanks for playing, one more time..."),
 C('closed','But hah... the life of monsters... how beautiful.'),
 C('serious','Even if you kill every one you see...'),
 C('smile',"You'll never, ever... be the end of our dream."),
 C('closed','I see it now...'),
 C('laugh','Fahahahah...'),
 C('smile',"You won't stand a chance against my girl..."),
 C('closed','Hah... I can rest easy...'),
 N('* The flame goes out.'),
 N('* The house burns.\n* Some of the spiders make it out.')
];
const AQUA_G=[
 A(2,'...What the hell.'),
 A(5,"I'm not even gonna ask what happened in here."),
 A(1,"...Wait. That's a LOT of EXP."),
 A(3,'Good job...? No, seriously. Good job.'),
 A(1,'Oh, right. Toriel wants to see us. The goat lady.')
];

// The letter: he expects his daughter's cruelty and finds none.
const LETTER=[
 N('* Something slips from Count Anansi\'s cape.\n* A small, folded letter.'),
 C('intrigued','Ah... and what is THIS.'),
 C('scheming','A letter from my daughter. I never had the nerve to open it.'),
 C('teasing',"Let me guess. She wishes me a long, slow death. That's my girl~!"),
 N('* Count Anansi unfolds the letter.'),
 N('* His grin falters.'),
 C('shocked','...'),
 C('worried','She says she misses me.'),
 C('flustered','She says... I can visit. Whenever I am ready.'),
 C('thinking','No games. No tricks. Not one barb.'),
 C('sad','...'),
 C('tired','Hah... perhaps...'),
 C('closed',"Perhaps I'm too old to be playing games.")
];
const SPARED=[
 C('smile','Go on, little mage. The show is over.'),
 C('closed','Tell her... no. I will tell her myself.'),
 N('* The spiders in the seats are cheering.'),
 N('* Count Anansi takes his final bow.')
];
const AQUA_P=[
 A(2,'...You didn\'t kill him.'),
 A(5,'That was SO much EXP, Seth.'),
 A(1,"...Whatever. I'm not leaving the Ruins without you, so. I'll let it slide."),
 A(3,"Toriel's asleep. Come on, the doors. Before she wakes up.")
];
const KILLED_P=[C('surprised','Oh...?'),C('tired','Hah... so that is how you play...'),C('closed','...'),N('* The flame goes out.')];

const ACTS={pacifist:['CHECK','APPLAUD','REFUSE','BOW'],genocide:['CHECK','TAUNT','BRACE','BOW']};
const ACT_LINES={
 APPLAUD:[[N('* You applaud.'),C('flustered','Ah! An AUDIENCE! FUHUHU! Encore, encore~!')],[N('* You applaud again.'),C('amused','Careful, little mage. I could get used to this.')]],
 REFUSE:[[N('* He wants you to hate him.\n* You refuse.'),C('annoyed','...Hm. No spite? Not even a little?')],[N('* You refuse again.'),C('bored','You are a terrible opponent. Her magic, and none of her venom.')],[N('* You refuse to play his way.'),C('thinking','...You really will not hate me. What a strange little game you play.')]],
 BOW:[[N('* You take a bow.'),C('smile','Good form! Good form~!')]],
 TAUNT:[[N('* You taunt him.'),C('cackle','FUHUHU! YES! THAT is the spirit!')]],
 BRACE:[[N('* You steady yourself.\n* The next attack will burn less.')]]
};
const REFUSE_EARLY=[N('* You have already made your point.'),C('bored','Yes, yes. No hate. I heard you.')];
const SPARE_EARLY=[[C('teasing','Mercy? In the middle of a SHOW? How rude~!')],[C('annoyed','Not until the curtain falls.')],[C('serious','...')]];
const SPARE_G=[[C('cackle','Mercy? FUHUHU! From YOU?')],[C('menacing','No. Play.')]];
const FLEE_P=[N('* You try to leave.\n* The doors are webbed shut.'),C('teasing','Leaving before the finale? Sit down~!')];
const FLEE_G=[N('* You try to leave.\n* The doors are on fire.')];
const STRIKE_P=['Ooh! A hit!','FUHUHU! Again!','Is that all, little mage?','Now THAT is a performance!'];
const STRIKE_G=['Again! AGAIN!','FUHUHU! Sharper!','That one I felt!','Is that all the perseverance you have?'];

Object.assign(exports,{ROOMS,SIGN_P,SIGN_G,WEB_P,WEB_G,POSTER_P,POSTER_G,SEAT_NOTES,SEAT_NOTES_G,MEET_P,MEET_G,CHECK,FLAVOR,FLAVOR_READY,STORY_P,STORY_G,REIGNITE,DEATH_G,AQUA_G,LETTER,SPARED,AQUA_P,KILLED_P,ACTS,ACT_LINES,REFUSE_EARLY,SPARE_EARLY,SPARE_G,FLEE_P,FLEE_G,STRIKE_P,STRIKE_G,C,N,A});
