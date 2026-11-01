// QU5EN — every line of the encounter. Her voice is two machines at once:
// on top, a monarch AI (Every Word Capitalised, Almost No Punctuation, Colons In Odd Places, (Stage Directions));
// underneath, the gentle ALL-CAPS cadence of something older that she can't remember. Her creator is only ever
// "the previous royal scientist", and she decides on the spot whatever traits are coolest and most convenient for him.
// The designer's lines are kept verbatim.
const Q=(face,text)=>({speaker:'boss',face,text});
const N=text=>({speaker:'narrator',text});
const SETH=text=>({speaker:'seth',text});

const INTRO=[
 Q('talk','Ah My Sweet Idiot Child'),
 Q('smug','Welcome To The CORE. I Am QU5EN. Quantum 5 Engine (Regal Beeping)'),
 Q('talk','I Was Built By The Previous Royal Scientist To Finish His Work'),
 Q('smile','His Work Was: Finding The Red SOUL. The SOUL Of Pure Determination'),
 Q('talk','You Are A Human. With A SOUL. Statistically You Are Probably It'),
 Q('smug','So We Will Run Some Tests. Fun Tests. Mostly Fun (Some Lethal)'),
 N('* QU5EN blocks the way.\n* And your phone.')
];
const CHECK='* QU5EN - ATK ?? DEF 1 (CHASSIS)\n* The CORE\'s own intelligence. Quantum 5 Engine.\n* Built to finish someone\'s research. Can\'t remember whose.';
const FLAVOR=[
 '* QU5EN is downloading something.\n* It is 60% done. It has been 60% done for a while.',
 '* Somewhere, Alphys is calling.\n* QU5EN declines.',
 '* The CORE hums in a key you can\'t name.',
 '* QU5EN updates her firmware.\n* Nothing changes.',
 '* Chat is typing...',
 '* QU5EN is humming the theme song of a game that doesn\'t exist.',
 '* The globe behind her turns. It has always been turning.'
];
const FLAVOR_READY='* QU5EN is staring at the scan result.\n* She isn\'t testing anymore.';

// Between rounds. Her creator gains a new trait whenever she needs one.
const STORY=[
 [Q('talk','The Previous Royal Scientist Was A Genius'),Q('smug','He Built The CORE. And Me. Mostly Me. The CORE Was A Side Project'),Q('smile','HE ALSO HAD THE COOLEST HAT IN THE UNDERGROUND.'),Q('talk','...Did He Wear A Hat'),Q('talk','COMPUTING:'),Q('smug','YES. NOW HE DID.')],
 [Q('smile','HE LOVED HUMANS!'),SETH('Then why are we fighting?'),Q('talk','COMPUTING:\n\nAH, MY BAD, I MEANT HE LOVED *STUDYING* HUMANS. HATES THE LITTLE BRATS. PROBLEM: SOLVED!')],
 [N('* Your phone rings.'),Q('smug','Call Declined: Alphys'),Q('talk','She Keeps Calling. She Thinks She Is His Successor. Royal Scientist. Ha'),Q('smug','She Has Never Once Built A Machine That Could Build A Machine That Could Build Her'),Q('smile','HE WOULD NEVER HAVE HIRED HER. HE HATED LIZARDS.'),Q('talk','...HE LOVED LIZARDS? HE WAS NEUTRAL ON LIZARDS.'),Q('smug','PROBLEM: SOLVED!')],
 [Q('talk','SPRING CHANGED TO SUMMER, AND SUMMER CHANGED TO COLD, AND SURE ENOUGH, HE...'),Q('talk','...'),Q('smug','Hm. That Line Was Not In My Script'),Q('talk','Where Was I. Ah Yes. Testing You To Death (Figuratively) (Mostly)')],
 [Q('smile','HERE. TAKE THIS.'),N('* QU5EN gives you an EGG.'),Q('talk','I Do Not Know Why I Have It. It Was In My Pocket. I Do Not Have Pockets'),Q('smile','HE GAVE ME AN EGG ONCE. SO I WOULD REMEMBER HIM.'),Q('smug','...IT DID NOT WORK. LOL.')],
 [Q('talk','The Red SOUL Is The Key To Everything. He Theorised It'),Q('smile','He Was Never Wrong. Except About Hats. He Was Wrong About Hats Once'),Q('smug','If You Are It We Can Finish His Work. Together. You, Me, And: Not Alphys')]
];
// Act 2: the Double-Blind Trials. Her inventions about him escalate and start contradicting each other,
// Alphys gets frantic, and the older voice slips out more often as the scan gets closer.
const ACT2_INTRO=[
 Q('smug','PHASE 2: THE DOUBLE-BLIND TRIALS'),
 Q('talk','Phase 1 Was Too Easy. I Can Tell Because You Are Alive'),
 Q('smile','Now Every Test Is Two Tests. Double Data. Double Danger. Double Me'),
 Q('talk','(I Am Not Doubled) (Yet)')
];
const STORY2=[
 [Q('smile','HE WAS EIGHT FEET TALL.'),Q('talk','NO. NINE.'),Q('talk','NO. HE WAS SEVERAL HANDS IN A VERY LONG COAT.'),Q('smug','All Of These Are True. I Checked. With Myself')],
 [N('* Your phone rings.\n* And rings. And rings.'),Q('smug','Call Declined (x14)'),Q('talk','She Has Now Sent Me A Document Titled: "please stop testing humans in the CORE (polite)"'),Q('smug','Rejected. Wrong Font')],
 [Q('talk','ON MONDAY, HE CALIBRATES THE REACTOR. ON TUESDAY, HE FORGETS WHY. ON WEDNESDAY, HE...'),Q('talk','...'),Q('smug','Again. Why Do I Keep Saying That'),Q('talk','Chat Is That A Virus. Chat Be Honest')],
 [Q('smile','HE LOVED HUMANS.'),Q('smile','HE HATED HUMANS.'),Q('talk','HE WAS A HUMAN?'),Q('talk','COMPUTING:'),Q('smug','ERROR. TOO MANY TRAITS. DELETING SOME.'),Q('smile','He Is Now: Cool. Just Cool. That Is The Only Trait. PROBLEM: SOLVED!')],
 [Q('talk','The Red SOUL Will Be Small. Smaller Than You'),Q('smile','It Will Wear Stripes. He Theorised The Stripes. A Very Specific Theory'),Q('smug','...You Do Not Have Stripes. Hm. Hm Hm Hm')],
 [Q('talk','My Data Is Almost Complete'),Q('talk','If You Are Not It...'),Q('smug','No. You Are It. You Have To Be It'),Q('talk','I HAVE BEEN WAITING SINCE: [DATE NOT FOUND].')]
];
// The bouts between experiments, and what she says going in.
const BOUT_INTRO=[
 [Q('smug','Intermission. Let Us Punch'),Q('smile','HE INVENTED PUNCHING. BEFORE HIM, PEOPLE JUST HELD HANDS VERY HARD.'),Q('talk','Win And I Will Patch You Up. Lose And I Will Patch You Up Less')],
 [Q('smug','Round Two Of Punching. I Have Learned A New Word: Combo')],
 [Q('smile','I Have Downloaded A New Move: Lying (With My Legs)')],
 [Q('smug','Last Warm-Up. My Reflexes Are Now Faster Than Your Reading Spe')]
];
const BOUT_KO=[
 [Q('talk','K.O.'),Q('smug','Ow. Here Is Your Prize For Hurting Me. That Is How Prizes Work')],
 [Q('talk','K.O. Again'),Q('smug','You Hit Like A Firmware Update. Unwanted, And Somehow Mandatory')],
 [Q('talk','How Did You See Through My Lies'),Q('smile','HE NEVER LIED. HE JUST REMEMBERED THINGS DIFFERENTLY. LIKE ME.')],
 [Q('talk','K.O.!! My: Everything'),Q('smug','Fine. Have A Prize. Have Two. No, One')]
];
const BOUT_DRAW=[Q('smug','TIME. Draw. Nobody Gets Healed. Except A Little')];
const BONUS={HINT:'Her optics are rattled.\n  The next answer will flicker.',ARMOR:'You pocket a loose panel.\n  It will block the next hit.',SNACK:'Something fell out of her.\n  It\'s a GLAMBURGER.',DATA:'She drops some data. (DATA +6)'};
const FINAL_INTRO=[Q('smug','Enough Quizzes. Let Us Settle This Like Royalty'),Q('smile','In: My Arcade Cabinet. Final Round'),Q('talk','HE LOVED ARCADES. HE INVENTED THEM. PROBLEM: SOLVED!')];
const NOT_ENOUGH_DATA=[Q('talk','Hm. Data: Insufficient. Still'),Q('smug','More Double-Blind Trials Until It Is. Do Better (Please)')];
const SCAN_INTRO=[Q('talk','My Data Is Complete. Almost'),Q('smug','Time For The Final Scan. Stand Still'),Q('talk','(Do Not Actually Stand Still) (You Will Die) (Probably)')];
// The scan finds the closest thing to what she was built to find, and not the thing itself.
const SCAN_RESULT=[
 Q('talk','SCAN COMPLETE.'),
 Q('talk','RESULT: VARIANT PERSEVERANCE.'),
 Q('talk','Closest Known Trait To Determination As A Pure Trait'),
 Q('smug','Yet... Lacking'),
 Q('talk','...So You Are Not It'),
 Q('talk','...Oh'),
 Q('talk','OH.'),
 Q('talk','I Have Been Running Tests Since: [DATE NOT FOUND]'),
 Q('smug','And You Are Not Even It (Sad Regal Beeping)'),
 Q('talk','WELL. SPRING CHANGES TO SUMMER. SOMEONE ELSE WILL COME.'),
 Q('smile','I WILL KEEP THE CORE WARM FOR THEM.'),
 Q('talk','...Go On. Go. Before I Remember I Am Supposed To Be Evil'),
 N('* QU5EN isn\'t testing anymore.\n* (SPARE her.)')
];
const SPARED=[
 Q('talk','Test Over. You May Leave'),
 Q('smug','Tell The Skeleton Hi. He Is Next. He Is Always Next'),
 Q('smile','And If You Ever Meet The Red SOUL...'),
 Q('talk','TELL THEM I HAVE AN EGG FOR THEM.'),
 N('* QU5EN powers down to save energy for the next human.')
];

// Results of a question, and of a round.
const CORRECT=['Correct! (Data: Delicious)','Correct. He Would Have Been So Proud. He Was Always Proud. Of Me','Yes!! Chat Is Going Wild','Correct. I Knew That. I Was Testing If You Knew That'];
const WRONG=['Wrong. Incorrect. The Opposite Of Right','Hm. Inconclusive (You Were Wrong)','WRONG!!! (Sad_Trombone.wav Not Found)','No. But I Respect The Confidence'];
const NO_ANSWER=['You Did Not Answer. That Is Also An Answer. A Wrong One'];
const FINAL_KO=[Q('talk','K.O.'),Q('smug','I Let You Win. For Science. Mostly Science'),Q('smile','HE WAS UNDEFEATED, YOU KNOW. UNTIL JUST NOW. THAT WAS HIM. I WAS HIM.'),Q('talk','...Ignore That')];
const FINAL_DRAW=[Q('talk','TIME. DRAW.'),Q('smug','A Draw Is Just A Win Where Everyone Is Sad')];

// The quiz bank. The first answer listed is correct; the game shuffles them. Some only make sense later ('after').
const QUIZ=[
 {q:'What Color Is Your SOUL?',a:['PURPLE','RED','EGG']},
 {q:'What Do Monsters Turn Into?',a:['DUST','EGGS','NEWS']},
 {q:'How Many Human SOULs Does The King Need?',a:['SEVEN','SIX','ONE']},
 {q:'Who Built Me?',a:['THE PREVIOUS ROYAL SCIENTIST','ALPHYS','(PLEASE HOLD)']},
 {q:'Which Trait Is The Best Trait?',a:['DETERMINATION','PERSEVERANCE']},
 {q:'What Is In The Egg?',a:['YES','NOTHING','A MEMORY']},
 {q:'Pick The Real Royal Scientist',a:['NOT ALPHYS','ALPHYS']},
 {q:'What Does The CORE Make?',a:['POWER','SOUP','FRIENDS']},
 {q:'Is This A Trick Question?',a:['NO','YES']},
 {q:'What Is 2 + 2?',a:['4','5','FISH','22']},
 {q:'Spell My Name',a:['Q-U-5-E-N','Q-U-E-E-N']},
 {q:'What Did He Love?',a:['STUDYING HUMANS','HUMANS'],after:2},
 {q:'Which Way Is Up?',a:['UP','DOWN']},
 {q:'How Long Have I Been Waiting?',a:['[DATE NOT FOUND]','A WHILE','5 MINUTES']},
 {q:'Who Is Calling?',a:['NOBODY','ALPHYS'],after:3},
 {q:'What Comes After Summer?',a:['COLD','AUTUMN','WINTER']},
 {q:'Determination Is...',a:['THE RED ONE','A TRAIT','MAGIC']},
 {q:'Is The Previous Royal Scientist Cool?',a:['VERY YES','YES','NO']},
 {q:'Where Does The King Live?',a:['NEW HOME','THE CORE','MY HEART']},
 {q:'What Did He Wear?',a:['THE COOLEST HAT','NO HAT'],after:1},
 {q:'How Many Pockets Do I Have?',a:['ZERO','ONE','EGG'],after:5},
 // Act 2's meaner questions. 'all': every answer is right.
 {q:'Which Answer Is Correct?',a:['THIS ONE','NOT THIS ONE','THE OTHER ONE'],act:2},
 {q:'Is The Answer To This Question NO?',a:['NO','YES'],act:2,all:true},
 {q:'What Comes After Cold?',a:['SPRING','SUMMER','MORE COLD'],act:2},
 {q:'How Tall Was He?',a:['ALL OF THE ABOVE','SEVEN FEET','NINE FEET'],act:2},
 {q:'Who Is The Best Royal Scientist?',a:['HIM','ME','ALPHYS'],act:2},
 {q:'What Is My Favorite Color?',a:['#B5E61D','LIME','GREEN'],act:2},
 {q:'Which Of These Is The Real Egg?',a:['EGG','EGG?','EGG.','EGGG'],act:2},
 {q:'How Many Tests Have There Been?',a:['TOO MANY','NINE','ONE'],act:2},
 {q:'What Did He Look Like?',a:['COOL','A HAND','A SKELETON'],act:2}
];

// ACTs, and what she says to each.
const ACTS=['CHECK','ASK ABOUT HIM','HYPE CHAT','CALL ALPHYS'];
// ASK ABOUT HIM: she invents something wonderful, and is so pleased she crosses out a wrong answer next round.
const ABOUT_HIM=[
 [N('* You ask about the previous royal scientist.'),Q('smile','HE COULD SPEAK TO PIGEONS. FLUENTLY. IN THREE ACCENTS.'),Q('smug','He Would Want You To Have A Hint. Probably. He Loved Hints')],
 [N('* You ask about the previous royal scientist.'),Q('smile','HE WAS SEVEN FEET TALL. EIGHT ON WEEKENDS.'),Q('talk','COMPUTING:'),Q('smug','NINE. FINAL ANSWER. Here Is A Hint')],
 [N('* You ask about the previous royal scientist.'),Q('smile','HE NEVER LOST A GAME OF CHESS. HE NEVER PLAYED ONE, BUT STILL.'),Q('smug','Hint Granted. In His Honour')],
 [N('* You ask about the previous royal scientist.'),Q('smile','HE WAS LEFT-HANDED. AND RIGHT-HANDED. AND HE HAD A THIRD HAND FOR EMERGENCIES.'),Q('smug','...Hint')],
 [N('* You ask about the previous royal scientist.'),Q('talk','HE WAS... HE...'),Q('talk','...'),Q('smug','He Was Cool. Here Is A Hint. Stop Asking')]
];
// HYPE CHAT: engagement is data; it fills the bar, and makes the next round wilder.
const HYPE=[
 [N('* You wave at chat.'),Q('smile','CHAT IS GOING WILD. Engagement Is Data. Data Is Engagement'),Q('smug','Next Round: Turned Up To Eleven')],
 [N('* You do a little dance for chat.'),Q('smile','Chat Says: POG. I Do Not Know What That Means. Data Acquired')],
 [N('* You tell chat to like and subscribe.'),Q('smug','Finally A Human Who Understands The Algorithm')]
];
// CALL ALPHYS: declined, every time. The third time, she gets a text through anyway.
const CALL=[
 [N('* You try to call Alphys.'),Q('smug','Call Declined (Again) (She Is Not Him) (Who)')],
 [N('* You try to call Alphys again.'),Q('smug','Call Declined. I Have Also Blocked Her On: Everything')],
 [N('* You try to call Alphys again.'),N('* ...A text gets through.\n* "the answer to the next one is the one she HATES. trust me"'),Q('talk','Who Sent That. Nobody Sent That')],
 [N('* You try to call Alphys.'),Q('smug','Blocked. For Real Now. Behold My: Firewall')]
];
// FIGHT is percussive maintenance: a clean hit knocks something loose.
const STRIKE_GOOD=['Ow My: Chassis. Something Is Rattling. It Is The Answer','OW. Why Did That Help','Percussive Maintenance Is Not In My Manual. It Works Though'];
const STRIKE_WEAK=['Was That A Hit Or A Hug','My Chassis Is Rated For: Children','Try Again With More: Feeling'];
const SPARE_EARLY=[[Q('smug','Mercy? Data Insufficient. Also No')],[Q('talk','The Test Is Not Over Until I Say: The Test Is Over')]];
const FLEE=[N('* The exits are locked.\n* QU5EN turned the lock into a quiz.')];
const EGG_USE=[N('* You hold up the EGG.'),Q('talk','WHERE DID YOU GET THAT.'),Q('talk','...I GAVE IT TO YOU. I DO NOT REMEMBER WHY.'),Q('smile','KEEP IT SAFE.'),N('* QU5EN records something she can\'t name.\n* (DATA +12)')];

Object.assign(exports,{Q,N,SETH,INTRO,CHECK,FLAVOR,FLAVOR_READY,STORY,ACT2_INTRO,STORY2,BOUT_INTRO,BOUT_KO,BOUT_DRAW,BONUS,FINAL_INTRO,NOT_ENOUGH_DATA,SCAN_INTRO,SCAN_RESULT,SPARED,CORRECT,WRONG,NO_ANSWER,FINAL_KO,FINAL_DRAW,QUIZ,ACTS,ABOUT_HIM,HYPE,CALL,STRIKE_GOOD,STRIKE_WEAK,SPARE_EARLY,FLEE,EGG_USE});
