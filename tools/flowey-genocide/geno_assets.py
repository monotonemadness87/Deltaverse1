# Crops the replayed genocide bosses' own art out of their games, at the size Flowey's replays draw them.
import base64,io,re,sys,json
from PIL import Image
import os
G=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','games')+'/';O=sys.argv[1];os.makedirs(O,exist_ok=True)
def uri_after(t,marker,start=0):
    i=t.index(marker,start);j=t.index('data:image/png;base64,',i);k=t.index('"',j);return base64.b64decode(t[j+22:k]),k
def save(im,name,h=None,w=None):
    im=im.convert('RGBA');bb=im.getbbox();im=im.crop(bb)
    if h:w2=round(im.width*h/im.height);im=im.resize((w2,h),Image.LANCZOS)
    elif w:h2=round(im.height*w/im.width);im=im.resize((w,h2),Image.LANCZOS)
    a=im.split()[3].point(lambda v:255 if v>110 else 0);im.putalpha(a);im.save(O+'/'+name+'.png');print(name,im.size)
t=open(G+'gerson.html').read()
boss,k=uri_after(t,'this.boss=img(');props,_=uri_after(t,'this.props=img(',k)
B=Image.open(io.BytesIO(boss));P=Image.open(io.BytesIO(props))
POSES=[[60,85,426,408],[560,88,388,403],[1086,13,433,479],[17,622,607,346],[629,618,339,361],[1091,510,434,487]]
PROPS={'shell':[63,79,472,474],'arrow':[641,69,333,463],'hammer':[19,627,588,308]}
for i in (0,2):x,y,w,h=POSES[i];save(B.crop((x,y,x+w,y+h)),'gerson%d'%i,h=170)
for n,(x,y,w,h) in PROPS.items():save(P.crop((x,y,x+w,y+h)),n,h={'shell':30,'arrow':44,'hammer':None}[n],w=150 if n=='hammer' else None)
# Memory cuts: Aqua with her knife, and Gerson as he dusts.
d,_=uri_after(t,'this.aquaKnife=img(');save(Image.open(io.BytesIO(d)),'aqua',h=300)
d,_=uri_after(t,'this.shock=img(');S=Image.open(io.BytesIO(d));save(S.crop((284,132,284+851,132+806)),'gersonDust',h=300)
t=open(G+'muffet.html').read()
for key,name,h in [('body/MUFFET_TURN.png','muffet',172),('props/spider-small.png','spider',26),('props/donut.png','donut',26),('props/spider-pet.png','pet',96)]:
    d,_=uri_after(t,'"%s":'%key);save(Image.open(io.BytesIO(d)),name,h=h)
t=open(G+'sans-genocide.html').read()
d,_=uri_after(t,'this.alphys=await Promise.all([load(');im=Image.open(io.BytesIO(d)).convert('RGBA');print('alphys raw',im.size);im.save(O+'/alphys.png')
