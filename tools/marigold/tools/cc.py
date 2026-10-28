import numpy as np
from collections import deque
def dilate(m,it=1):
    for _ in range(it):
        n=m.copy()
        n[1:]|=m[:-1];n[:-1]|=m[1:];n[:,1:]|=m[:,:-1];n[:,:-1]|=m[:,1:]
        m=n
    return m
def components(m):
    H,W=m.shape;lab=np.zeros((H,W),np.int32);boxes=[];k=0
    ys,xs=np.nonzero(m)
    for y,x in zip(ys,xs):
        if lab[y,x]:continue
        k+=1;q=deque([(y,x)]);lab[y,x]=k;x0=x1=x;y0=y1=y;area=0
        while q:
            cy,cx=q.popleft();area+=1
            x0=min(x0,cx);x1=max(x1,cx);y0=min(y0,cy);y1=max(y1,cy)
            for ny,nx in ((cy+1,cx),(cy-1,cx),(cy,cx+1),(cy,cx-1)):
                if 0<=ny<H and 0<=nx<W and m[ny,nx] and not lab[ny,nx]:
                    lab[ny,nx]=k;q.append((ny,nx))
        boxes.append((x0,y0,x1+1,y1+1,area,k))
    return lab,boxes
