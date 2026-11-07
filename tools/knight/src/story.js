// THE WHITE ROARING KNIGHT — every line of the encounter (pacifist only, Waterfall).
// Gerson (retired, running his shop) tells Seth about a pure crystal hidden off the old path. For ages monsters have
// stared into it and wished, and the echo flowers there repeat every wish. Seth goes alone and wakes it by accident
// with his human magic SOUL. It manifests as the prophecy's Angel, the good kind, as monsterkind dreamed it: three
// hearts in one knight (a human's blade, a monster's wild heart, a prince's hope). It fights because the dream
// always had a fight in it; it also tries to heal and spare Seth. It is also a glimpse into another world, which is
// where its attacks (and, halfway through, the whole battle UI) come from.
const N=text=>({speaker:'narrator',text});
const SETH=(text,face='talking')=>({speaker:'seth',text,face});
const G=(text,face='face')=>({speaker:'gerson',text,face});
// The Knight speaks as one, but each heart has its own voice colour: blade (cyan), wild (pink), hope (green).
const K=(text,heart='all')=>({speaker:'boss',text,heart});

const ROOMS={cavern:'THE CRYSTAL'};

// ------------------------------------------------------------------ the crystal room
// Seth arrives at the crystal and remembers what Gerson told him about it in his shop: the lore, delivered here.
const ARRIVE=[
 N('* A hidden cave off the old path.\n* A crystal, glowing like it\'s breathing.'),
 N('* You remember the old turtle at the shop.'),
 G('Tell ya a secret? Past the stream, off the old path, there\'s a crystal. Pure as they come.'),
 G('Monsters\'ve been staring into it since before the Barrier. Making wishes. The echo flowers down there repeat every last one.'),
 G('All that hoping\'s gotta go SOMEWHERE, right?'),
 G('Some folks say if you stare long enough, you see somewhere else in it. Another world. Different stars. Three kids on a long walk.'),
 G('Me? I saw a knight in it, once. Big. White. Kinda... roaring. Wahaha! Probably the mushrooms.'),
 G('Saw an old hero in there too. Carried a hammer. Handsome fella. Wahaha!'),
 G('Go on, take a look. Just don\'t touch it.'),
 G('...You\'re gonna touch it.'),
 N('* The echo flowers are whispering.')
];
// The echo flowers round the crystal: the wishes it has been listening to.
const ECHO=[
 [N('* An echo flower.'),N('* "i wish i could see the sky. just once. is it really blue?"')],
 [N('* An echo flower.'),N('* "i wish for a hero. somebody strong. somebody who\'d fight for all of us."')],
 [N('* An echo flower.'),N('* "i wish whoever comes is kind. kind enough to spare everyone. even the bad ones."')],
 [N('* An echo flower.'),N('* "i wish... for a new world. together."'),N('* It sounds like more than one voice.')]
];
const CRYSTAL_LOOK=[N('* A crystal, taller than you. Pure enough to see straight through.'),N('* Inside it, something is looking back.'),N('* (Touch it?)')];
const TOUCH=[
 N('* You reach out.'),
 N('* Your SOUL answers before you do.'),
 SETH('...Wait. I wasn\'t--','shocked')
];
// The manifestation: three hearts fly out of the crystal and become one knight.
const MANIFEST=[
 K('THE PROPHECY SPOKE OF AN ANGEL.'),
 K('WE IMAGINED THE REST.'),
 K('A BLADE, TO CUT THE BARRIER.','blade'),
 K('A HEART, WILD ENOUGH TO CARRY US.','wild'),
 K('A HOPE, TO HOLD THE LIGHT.','hope'),
 K('THREE HEARTS. ONE KNIGHT.'),
 K('AND IN EVERY STORY THEY TOLD, HUMAN... THE ANGEL FIGHTS.'),
 K('SO.'),
 K('SHOW US THE FIGHT WE DREAMED OF.'),
 N('* The White Roaring Knight blocks the way.\n* It looks... hopeful.')
];

// ------------------------------------------------------------------ the battle
const CHECK=[N('* WHITE ROARING KNIGHT - ATK ?? DEF ??\n* Monsterkind\'s dream of the Angel, given a body.'),N('* It wants to fight you.\n* It also wants you to be okay.')];
const FLAVOR=[
 '* The crystal hums.',
 '* The Knight\'s scarf moves without any wind.',
 '* The echo flowers have gone quiet.\n* They\'re listening.',
 '* Three hearts beat slightly out of time.',
 '* Smells like rain on a world you\'ve never been to.'
];
const FLAVOR_DR=[
 '* Cold light rushes past your face.',
 '* The arch above you changes colour.\n* Somewhere, a wish changes its mind.',
 '* Somewhere, three people are walking somewhere together.',
 '* You feel the night sky turning around you.',
 '* The wild heart is fidgeting.\n* The blade heart is very still.',
 '* The hope heart is humming.',
 '* The Knight\'s edges shimmer in colours you can\'t name.'
];
const FLAVOR_READY='* The Knight is SPARING you.\n* (SPARE it back.)';
// Between waves in the first half (the Undertale battle), the hearts take turns to talk.
const STORY=[
 [K('THE BLADE REMEMBERS A HUMAN WHO CHOSE.','blade'),K('NOT WHAT THEY CHOSE. ONLY THAT THEY DID.','blade')],
 [K('THE WILD HEART WANTS TO HIT SOMETHING.','wild'),K('IT IS VERY SORRY. IT IS NOT SORRY.','wild')],
 [K('THE HOPE ASKS IF YOU ARE EATING ENOUGH.','hope'),K('...THE HOPE WILL ASK AGAIN LATER.','hope')],
 [K('YOU FIGHT LIKE THIS WORLD, HUMAN. SMALL. CAREFUL.'),K('FOUR BUTTONS. ONE BOX. ONE SOUL, ALONE.'),K('WE DREAMED BIGGER THAN THIS.'),K('LET US SHOW YOU WHERE WE COME FROM.')]
];
// The break: the Knight roars and the Undertale battle comes apart.
const BREAK=[N('* THE KNIGHT ROARS.')];
const AFTER_BREAK=[
 N('* Light from another world pours through the crystal.\n* The battle isn\'t the same battle anymore.'),
 N('* (Graze bullets to build TP. DEFEND to brace.\n* Spend TP on your spell, PERSEVERE.)'),
 K('THERE. NOW IT IS A PARTY.')
];
const STORY_DR=[
 [K('IN THE OTHER WORLD THERE ARE THREE OF THEM. A HUMAN. A MONSTER. A PRINCE.'),K('THEY ARGUE. THEY WALK ON ANYWAY. WE LIKED THAT PART.')],
 [K('THE PRINCE SPARES WHAT HE CAN. WE LEARNED IT FROM HIM.','hope'),K('THAT IS WHY WE KEEP TRYING TO SPARE YOU.','hope')],
 [K('YOU HOLD ON SO HARD, HUMAN.','blade'),K('PERSEVERANCE. A PURPLE WORD. IT SUITS YOU.','blade')],
 [K('THE MONSTERS WHO WISHED FOR US WILL NOT ALL LIVE TO SEE IT.'),K('THEY WISHED ANYWAY.','wild')],
 [K('ARE YOU THE ANGEL?'),K('...NO. WE THINK NOT.'),K('BUT YOU ARE KIND TO A DREAM. THAT COUNTS FOR SOMETHING.','hope')],
 [K('RUDE BUSTER IS NOT A REAL WORD. THE WILD HEART SAYS IT IS.','wild')]
];
const UNIFIED=[K('THREE HEARTS. TOGETHER NOW.'),K('AND ONE MORE. THE OLD HERO, WITH THE HAMMER. MONSTERS DREAMED OF HIM TOO.','wild'),K('THIS IS THE LAST PART OF THE DREAM.')];
const FINALE_INTRO=[K('YOU HAVE SPARED US. WE HAVE SPARED YOU.'),K('ONE MORE THING, THEN. THE PART WE ALWAYS SKIPPED TO.'),K('A NEW WORLD.')];
const FINALE_END=[K('...TOGETHER.'),N('* The Knight is SPARING you.\n* (SPARE it back.)')];
// The Knight's own turn: what each heart does, Deltarune-style, before its bullets.
const HEART_ACTS={
 encircle:'* The blade heart draws its swords around you.',swordrain:'* The blade heart lets its swords fall.',volley:'* The blade heart throws a volley!',dash:'* The blade heart dashes!',
 crescent:'* The wild heart swings wide!',eruption:'* The wild heart cracks the floor open!',bars:'* The wild heart tears the light into bars!',rudebuster:'* The wild heart used RUDE BUSTER!',
 cone:'* The hope heart raises its light.',healprayer:'* The hope heart cast HEAL PRAYER on SETH!',pacify:'* The hope heart tried to PACIFY SETH!'
};
const ARRIVAL_NAMES=['THE ANGEL ARRIVES','CRYSTAL TEETH','THREE HEARTS','THE HALO'];
const UNIFIED_NAMES=['* The night sky opens.\n* Stars bloom in the Knight\'s light.','* The ground cracks.\n* The light tears into bars.','* A hammer rings somewhere far away.\n* The Knight remembers an old hero.','* The box splits along a seam.\n* Blue light cuts through.'];
const FINALE_NAME='* A NEW WORLD.';

// ACTs. Undertale half: CHECK, WISH, LISTEN, ROAR BACK. Deltarune half adds the spell PERSEVERE (TP).
const ACTS_UT=['CHECK','WISH','LISTEN','ROAR BACK'];
const ACTS_DR=['CHECK','WISH','LISTEN','ROAR BACK','PERSEVERE'];
const WISH=[
 [N('* You make a wish on the crystal.'),K('A WISH. FOR US? WE ARE MADE OF THEM. ONE MORE CANNOT HURT.','hope')],
 [N('* You wish for everybody to be okay.'),K('THAT ONE IS VERY POPULAR.','hope')],
 [N('* You wish to see the sky.'),K('SO DID SHE. THE ONE ON THE PATH. WE WILL TELL HER.','blade')],
 [N('* You wish for a new world.'),K('...YES.')]
];
const LISTEN=[
 [N('* You listen to the echo flowers.'),N('* "i wish for a hero."'),K('THAT IS WHERE THE WILD HEART CAME FROM.','wild')],
 [N('* You listen to the echo flowers.'),N('* "i wish whoever comes is kind."'),K('THAT ONE MADE THE HOPE.','hope')],
 [N('* You listen to the echo flowers.'),N('* "is the sky really blue?"'),K('THE BLADE HAS NEVER SEEN IT EITHER. IT WANTS TO.','blade')],
 [N('* You listen. The flowers are repeating something new.'),N('* They are repeating you.')]
];
const ROAR=[
 [N('* You roar back.'),K('YES! YES! THAT! THE STORIES ALWAYS HAD THAT!','wild')],
 [N('* You roar back, louder.'),K('THE WILD HEART IS VERY HAPPY. THE HOPE IS COVERING ITS EARS.','wild')],
 [N('* You roar.\n* Somewhere, a shop owner laughs.'),K('...THE BLADE APPROVES.','blade')]
];
const PERSEVERE=[N('* SETH cast PERSEVERE!\n* Purple light holds him together.'),K('A SPELL OF YOUR OWN. WE KNEW YOU HAD ONE.','blade')];
const NO_TP=[N('* Not enough TP.\n* (Graze bullets or DEFEND to build it.)')];
const DEFEND=[N('* SETH is defending.\n* He lets the Knight come close.')];
const STRIKE=['THE DREAM WANTED A FIGHT. THANK YOU.','OOF. GOOD. AGAIN.','THE WILD HEART IS DELIGHTED.','THE HOPE WINCED. THE BLADE DID NOT.'];
const STRIKE_WEAK=['THAT WAS ALMOST A HUG.','THE HOPE IS RELIEVED.'];
const TIRED=[N('* The Knight is TIRED.\n* The dream is getting thin.')];
const SPARE_EARLY=[
 [N('* You spare the Knight.\n* Its MERCY isn\'t full yet.'),K('YOU OFFER US MERCY. WE NOTICED.','hope')],
 [N('* You spare the Knight again.'),K('WE ARE TRYING TO SPARE YOU TOO, HUMAN. GIVE US TIME.','hope')]
];
const SPARE_UT=[N('* You try to spare the Knight.'),K('NOT YET. THE STORY IS NOT FINISHED.')];
const FLEE=[N('* The crack in the rock has closed.\n* The crystal wants to see this through.')];
const SPARED=[
 K('THANK YOU, HUMAN.'),
 K('YOU ARE NOT THE ANGEL. WE ARE SORRY WE HOPED YOU WERE.','blade'),
 K('YOU FOUGHT THE WAY THE STORIES SAID.','wild'),
 K('AND YOU WERE KIND. THE STORIES SAID THAT TOO.','hope'),
 K('WHEN THE ANGEL COMES... WE WILL BE WAITING. WE ALWAYS HAVE BEEN.'),
 N('* The Knight folds back into the crystal.'),
 N('* Somewhere on the old path, an echo flower whispers:\n* "a new world. together."')
];

Object.assign(exports,{N,SETH,G,K,ROOMS,ARRIVE,ECHO,CRYSTAL_LOOK,TOUCH,MANIFEST,
 CHECK,FLAVOR,FLAVOR_DR,FLAVOR_READY,STORY,BREAK,AFTER_BREAK,STORY_DR,UNIFIED,FINALE_INTRO,FINALE_END,HEART_ACTS,ARRIVAL_NAMES,UNIFIED_NAMES,FINALE_NAME,
 ACTS_UT,ACTS_DR,WISH,LISTEN,ROAR,PERSEVERE,NO_TP,DEFEND,STRIKE,STRIKE_WEAK,TIRED,SPARE_EARLY,SPARE_UT,FLEE,SPARED});
