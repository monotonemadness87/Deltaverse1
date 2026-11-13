# Clean the user-supplied Marigold example sheet into crisp, art-resolution frames.
import sys,json
sys.path.insert(0,sys.argv[3])
import numpy as np
from PIL import Image
from cc import dilate,components
src,out=sys.argv[1],sys.argv[2]
F=float(sys.argv[4]) if len(sys.argv)>4 else 3.0
img=Image.open(src).convert('RGB');a=np.asarray(img).astype(int)
r,g,b=a[...,0],a[...,1],a[...,2]
fg=(a.sum(2)>75);pink=(r>150)&(b>120)&(g<190)&(b>g)
lab,boxes=components(dilate(fg&~pink,3))
def comps_in(box):
    x0,y0,x1,y1=box;ids=set(np.unique(lab[y0:y1,x0:x1]))-{0}
    keep=[]
    for (bx0,by0,bx1,by1,ar,k) in boxes:
        if k in ids and ar>120:
            # component mostly inside the box
            ix=max(0,min(x1,bx1)-max(x0,bx0));iy=max(0,min(y1,by1)-max(y0,by0))
            # Poses that touch a neighbour on the sheet share one shape: keep its part inside this box.
            if ix*iy>=.5*(bx1-bx0)*(by1-by0) or ix*iy>=.3*(x1-x0)*(y1-y0):keep.append(k)
    return keep
FR={
 'idle0':(22,160,111,330),'idle1':(116,160,205,330),'idle2':(212,160,301,330),'idle3':(309,160,398,330),
 'talk0':(425,160,515,330),'talk1':(523,160,612,330),'talk2':(619,160,709,330),'talk3':(717,160,806,330),
 'prepare':(28,360,126,542),'draw':(145,358,304,542),'aim':(312,385,472,542),
 'swing0':(494,368,689,543),'swing1':(645,366,915,543),'thrust':(894,395,1121,543),
 'spell0':(1135,388,1265,544),'spell1':(1272,358,1398,544),'spell2':(1398,358,1521,544),
 'summon0':(12,604,171,774),'summon1':(170,604,311,774),'summon2':(311,604,453,774),
 'shower0':(466,606,546,775),'shower1':(548,606,722,776),'shower2':(722,606,861,777),
 'hurt0':(873,640,966,775),'hurt1':(965,640,1069,775),
 'defeat0':(1085,650,1173,772),'defeat1':(1177,660,1273,771),'defeat2':(1287,690,1395,783),'defeat3':(1395,690,1503,783),
 'back':(1151,850,1251,988),
 'fx_bigstar':(1364,850,1436,936),'fx_star':(1455,850,1497,927),'fx_flower':(1321,865,1360,918),
}
PORT={'neutral':(831,178,941,287),'smile':(944,178,1054,287),'serious':(1058,178,1168,287),'sad':(1175,178,1285,285),'angry':(1293,178,1403,287),'deranged':(1411,178,1521,287),
 'blink0':(17,862,120,965),'blink1':(125,862,223,964),'eye0':(229,862,329,965),'eye1':(332,862,435,964),'eye2':(441,862,540,965),'eye3':(545,862,646,965)}
crops={}
for name,box in FR.items():
    x0,y0,x1,y1=box;ks=comps_in(box)
    m=np.isin(lab[y0:y1,x0:x1],ks)
    crops[name]=(a[y0:y1,x0:x1],m)
for name,box in PORT.items():
    x0,y0,x1,y1=box;x0+=4;y0+=4;x1-=4;y1-=4
    m=np.ones((y1-y0,x1-x0),bool)
    crops['face_'+name]=(a[y0:y1,x0:x1],m)
# shared palette from every crop
allpix=np.concatenate([c[m] for c,m in crops.values()])
pal_img=Image.fromarray(allpix.reshape(1,-1,3).astype(np.uint8)).quantize(colors=22,method=Image.Quantize.MEDIANCUT)
pal=np.array(pal_img.getpalette()[:22*3]).reshape(-1,3)
def snap(c,m):
    h,w=m.shape;H=max(1,int(round(h/F)));W=max(1,int(round(w/F)))
    q=np.asarray(Image.fromarray(c.astype(np.uint8)).quantize(palette=pal_img,dither=Image.Dither.NONE)).astype(int)
    out=np.zeros((H,W,4),np.uint8)
    for j in range(H):
        for i in range(W):
            ys=slice(int(j*h/H),max(int(j*h/H)+1,int((j+1)*h/H)));xs=slice(int(i*w/W),max(int(i*w/W)+1,int((i+1)*w/W)))
            mm=m[ys,xs]
            if mm.mean()<.4:continue
            vals=q[ys,xs][mm];k=np.bincount(vals).argmax();col=pal[k]
            if col.sum()<75:col=np.array([0,0,0])
            out[j,i,:3]=col;out[j,i,3]=255
    return out
frames={};tiles=[]
for name,(c,m) in crops.items():
    t=snap(c,m);ys,xs=np.nonzero(t[...,3])
    if len(ys):t=t[ys.min():ys.max()+1,xs.min():xs.max()+1]
    tiles.append((name,t))
# pack into rows
W=512;x=y=rowh=0;place={}
for name,t in tiles:
    h,w=t.shape[:2]
    if x+w+1>W:x=0;y+=rowh+1;rowh=0
    place[name]=(x,y,w,h);x+=w+1;rowh=max(rowh,h)
atlas=np.zeros((y+rowh+1,W,4),np.uint8)
for name,t in tiles:
    x,y,w,h=place[name];atlas[y:y+h,x:x+w]=t
Image.fromarray(atlas).save(out+'.png')
json.dump(place,open(out+'.json','w'))
print(atlas.shape,len(place))
