# Original Undertale-scale overworld sprite of human Seth (design reference: the user's Flower Seth sheet).
import sys,json
from PIL import Image
P={'k':(0,0,0),'h':(122,47,143),'H':(166,79,191),'d':(77,26,92),'s':(246,207,180),'S':(217,166,140),'g':(255,255,255),
   'c':(155,63,176),'C':(106,37,129),'l':(194,127,214),'n':(184,192,216),'N':(125,132,166),'p':(90,74,138),'w':(240,240,255),'r':(214,90,120)}
HEAD_F=[
"......kkkkkkkk......",
"....kkhhhhhhhhkk....",
"...khhHHhhhhhhhhk...",
"..khhHhhhhhhhhhhhk..",
"..khhhhhhhhhhhhhhk..",
"..khhhhdhhhhdhhhhk..",
"..khhdssssssssdhhk..",
"..khhkkkksskkkkhhk..",
"..khhkggksskggkhhk..",
"..khhkkkksskkkkhhk..",
"..khhdssssssssdhhk..",
"..khhhdssskssSdhhk..",
"..khhhhdSSSSSdhhhk..",
]
BODY_F=[
".khhhkkccccccckkhhk.",
".khhkcccnnnnncckhhk.",
".khhkcclnNNNnlckhhk.",
".khhkcssnnnnnsckhhk.",
".kdhkccnnnnnnncckdk.",
"..kdkccccccccccckk..",
"..kkcCcccccccccCk...",
"...kcCcccccccccCk...",
"...kcCCcccccccCCk...",
"...kkcccccccccckk...",
]
LEGS={
 'stand':["....kppppkkppppk....","....kppppkkppppk....","....kpppk..kpppk....","...kwwwwk..kwwwwk...","...kkkkkk..kkkkkk..."],
 'stepA':["....kppppkkppppk....","....kppppk.kpppk....","...kwwwwk..kpppk....","...kkkkkk.kwwwwk....","..........kkkkkk...."],
 'stepB':["....kppppkkppppk....","....kpppk.kppppk....","....kpppk..kwwwwk...","...kwwwwk.kkkkkk....","...kkkkkk..........."],
}
HEAD_B=[
"......kkkkkkkk......",
"....kkhhhhhhhhkk....",
"...khhhhhhhhhhhhk...",
"..khhhhhhhhhhhhhhk..",
"..khhhHhhhhhhhhhhk..",
"..khhHhhhhhhhhhhhk..",
"..khhhhhhhhhhhhhhk..",
"..khhhhhhhhhhhhhhk..",
"..khhhhhhhhhhhhhhk..",
"..khhhhhhhhhhhhdhk..",
"..khhhhhhhhhhhhdhk..",
"..khhhhhhhhhhhdhhk..",
"..khhhhhhhhhhhhhhk..",
]
BODY_B=[
".khhhhhhhhhhhhhhhhk.",
".kchhhhhhhhhhhhhhck.",
".kckhhhhhhhhhhhhkck.",
".kcckhhhhhhhhhhkcck.",
".kcckdhhhhhhhhdkcck.",
"..kcckddhhhhddkcck..",
"..kkcCckkkkkkcCck...",
"...kcCcccccccccCk...",
"...kcCCcccccccCCk...",
"...kkcccccccccckk...",
]
HEAD_R=[
".......kkkkkkk......",
".....kkhhhhhhhkk....",
"....khhHHhhhhhhhk...",
"...khhHhhhhhhhhhhk..",
"...khhhhhhhhhhhhhk..",
"...khhhhhhhhhdssdk..",
"...khhhhhhhhdsssssk.",
"...khhhhhhhhkkkkssk.",
"...khhhhhhhhkggksk..",
"...khhhhhhhhkkkkssk.",
"...khhhhhhhhdsssssk.",
"...khhhhhhhhhdsskk..",
"...khhhhhhhhhdSSk...",
]
BODY_R=[
"..khhhhhhkkccccck...",
"..khhhhhkcccnnnck...",
"..khhhhhkccnNNnsk...",
"..kdhhhhkccnnnnsk...",
"..kdhhhkcccnnnnck...",
"...kddkcccccccck....",
"...kkCcccccccCk.....",
"....kCcccccccCk.....",
"....kCCccccccCk.....",
"....kkcccccccck.....",
]
LEGS_R={
 'stand':[".....kppppppk.......",".....kppppppk.......",".....kppk.kppk......","....kwwwwkwwwwk.....","....kkkkkkkkkkk....."],
 'stepA':[".....kppppppk.......","....kpppk.kpppk.....","...kwwwwk...kpppk...","...kkkkkk..kwwwwk...","...........kkkkkk..."],
 'stepB':[".....kppppppk.......",".....kppppppk.......","......kpppppk.......",".....kwwwwwwk.......",".....kkkkkkkk......."],
}
def img(rows):
    w=max(len(r) for r in rows);im=Image.new('RGBA',(w,len(rows)),(0,0,0,0))
    for y,r in enumerate(rows):
        assert len(r)==20,(len(r),r)
        for x,ch in enumerate(r):
            if ch!='.':im.putpixel((x,y),P[ch]+(255,))
    return im
frames={}
for k,legs in LEGS.items():
    frames['down_'+k]=img(HEAD_F+BODY_F+legs);frames['up_'+k]=img(HEAD_B+BODY_B+legs)
for k,legs in LEGS_R.items():
    frames['right_'+k]=img(HEAD_R+BODY_R+legs)
    frames['left_'+k]=frames['right_'+k].transpose(Image.FLIP_LEFT_RIGHT)
names=list(frames);W=20*len(names);atlas=Image.new('RGBA',(W,28),(0,0,0,0));place={}
for i,n in enumerate(names):atlas.paste(frames[n],(i*20,0));place[n]=[i*20,0,20,28]
atlas.save(sys.argv[1]+'.png');json.dump(place,open(sys.argv[1]+'.json','w'))
atlas.resize((W*6,28*6),Image.NEAREST).save(sys.argv[1]+'-x6.png')
