// ════════════════════════════════════════════════════════════════════════
//  LePrince — Content-Aware Fill engine (pure client, offline, no API key).
//  Two methods (research-backed, written from the papers — no GPL code copied):
//   • telea  — Telea 2004 Fast Marching Method. Fast; great for thin/small holes,
//              scratches, blemishes, logos, small objects. Smooth fill.
//   • criminisi — Criminisi 2004 exemplar synthesis. Copies real patches from the
//              surroundings; better texture for larger object removal. Slower.
//  Operates on ImageData + a Uint8 hole mask (1 = fill this pixel). In-place.
//  Honest: it SAMPLES surrounding pixels — it can't invent unseen content.
// ════════════════════════════════════════════════════════════════════════
(function(){
'use strict';
function MinHeap(){this.a=[];}
MinHeap.prototype.push=function(t,v){const a=this.a;a.push([t,v]);let i=a.length-1;
  while(i>0){const p=(i-1)>>1;if(a[p][0]<=a[i][0])break;const tmp=a[p];a[p]=a[i];a[i]=tmp;i=p;}};
MinHeap.prototype.pop=function(){const a=this.a;if(!a.length)return null;const top=a[0],last=a.pop();
  if(a.length){a[0]=last;let i=0;const n=a.length;for(;;){let l=2*i+1,r=l+1,s=i;
    if(l<n&&a[l][0]<a[s][0])s=l;if(r<n&&a[r][0]<a[s][0])s=r;if(s===i)break;const t=a[s];a[s]=a[i];a[i]=t;i=s;}}
  return top;};
MinHeap.prototype.size=function(){return this.a.length;};

// ── Telea Fast Marching Method ──────────────────────────────────────────
function telea(img,mask,opts){
  const W=img.width,H=img.height,d=img.data,N=W*H,EPS=Math.max(1,(opts&&opts.radius)||5);
  const KNOWN=0,BAND=1,INSIDE=2;
  const flag=new Uint8Array(N),T=new Float32Array(N);
  for(let i=0;i<N;i++){if(mask[i]){flag[i]=INSIDE;T[i]=1e6;}else{flag[i]=KNOWN;T[i]=0;}}
  const idx=(x,y)=>y*W+x;
  const heap=new MinHeap();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=idx(x,y);if(flag[i]!==KNOWN)continue;
    if((x>0&&flag[i-1]===INSIDE)||(x<W-1&&flag[i+1]===INSIDE)||(y>0&&flag[i-W]===INSIDE)||(y<H-1&&flag[i+W]===INSIDE)){
      flag[i]=BAND;T[i]=0;heap.push(0,i);}}
  const known=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return false;const f=flag[idx(x,y)];return f===KNOWN||f===BAND;};
  const solveAt=(x1,y1,x2,y2)=>{
    const k1=known(x1,y1),k2=known(x2,y2);let sol=1e6;
    if(k1){const t1=T[idx(x1,y1)];
      if(k2){const t2=T[idx(x2,y2)],r=2-(t1-t2)*(t1-t2);
        if(r>0){const dd=Math.sqrt(r);let s=(t1+t2-dd)/2;if(s>=t1&&s>=t2)sol=s;else{s=(t1+t2+dd)/2;if(s>=t1&&s>=t2)sol=s;}}
        else sol=1+Math.min(t1,t2);
      }else sol=1+t1;
    }else if(k2)sol=1+T[idx(x2,y2)];
    return sol;};
  const inpaint=(x,y)=>{
    const gTx=((x<W-1?T[idx(x+1,y)]:T[idx(x,y)])-(x>0?T[idx(x-1,y)]:T[idx(x,y)]))/2;
    const gTy=((y<H-1?T[idx(x,y+1)]:T[idx(x,y)])-(y>0?T[idx(x,y-1)]:T[idx(x,y)]))/2;
    const Tc=T[idx(x,y)];let rs=0,gs=0,bs=0,ws=0,r=EPS;
    for(let dy=-r;dy<=r;dy++){const yy=y+dy;if(yy<0||yy>=H)continue;
      for(let dx=-r;dx<=r;dx++){if(dx===0&&dy===0)continue;const xx=x+dx;if(xx<0||xx>=W)continue;
        const di=dx*dx+dy*dy;if(di>r*r)continue;const j=idx(xx,yy);if(flag[j]===INSIDE)continue;
        const dir=Math.abs(((-dx)*gTx+(-dy)*gTy))/Math.sqrt(di)+1e-6;
        const dst=1/di,lev=1/(1+Math.abs(T[j]-Tc));let w=dir*dst*lev;if(!(w>0))w=1e-6;
        const j4=j*4;rs+=w*d[j4];gs+=w*d[j4+1];bs+=w*d[j4+2];ws+=w;}}
    const p4=idx(x,y)*4;if(ws>0){d[p4]=rs/ws;d[p4+1]=gs/ws;d[p4+2]=bs/ws;d[p4+3]=255;}};
  const nowf=(typeof performance!=='undefined'&&performance.now)?function(){return performance.now();}:function(){return 0;};
  const tLimit=(opts&&opts.maxMs)||5000,t0=nowf();let iter=0;
  let guard=N*6;
  while(heap.size()&&guard-->0){
    if(((++iter)&1023)===0&&tLimit&&nowf()-t0>tLimit)break; // wall-clock safety: never freeze the UI on a pathological hole
    const top=heap.pop();if(!top)break;const i=top[1];if(flag[i]===KNOWN)continue;flag[i]=KNOWN;
    const x=i%W,y=(i/W)|0;
    const nb=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
    for(let n=0;n<4;n++){const nx=nb[n][0],ny=nb[n][1];if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=idx(nx,ny);
      if(flag[j]!==KNOWN){
        if(flag[j]===INSIDE){flag[j]=BAND;inpaint(nx,ny);}
        const t=Math.min(solveAt(nx-1,ny,nx,ny-1),solveAt(nx+1,ny,nx,ny-1),solveAt(nx-1,ny,nx,ny+1),solveAt(nx+1,ny,nx,ny+1));
        T[j]=t;heap.push(t,j);}}}
  return img;
}

// ── Criminisi exemplar synthesis (greedy, band-restricted; meant for ≤~640px) ──
function criminisi(img,mask,opts){
  const W=img.width,H=img.height,d=img.data,N=W*H;
  const P=(opts&&opts.patch)||9,half=P>>1,band=(opts&&opts.band)||Math.max(40,P*5);
  const src=new Uint8ClampedArray(d);
  const filled=new Uint8Array(N);for(let i=0;i<N;i++)filled[i]=mask[i]?0:1;
  const conf=new Float32Array(N);for(let i=0;i<N;i++)conf[i]=filled[i]?1:0;
  const gray=new Float32Array(N);for(let i=0;i<N;i++)gray[i]=0.299*d[i*4]+0.587*d[i*4+1]+0.114*d[i*4+2];
  const idx=(x,y)=>y*W+x,inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
  const nowf=(typeof performance!=='undefined'&&performance.now)?function(){return performance.now();}:function(){return 0;};
  const tLimit=(opts&&opts.maxMs)||3500,t0=nowf();let iter=0;
  let remaining=0;for(let i=0;i<N;i++)if(!filled[i])remaining++;
  let guard=N+50;
  while(remaining>0&&guard-->0){
    if(((++iter)&31)===0&&tLimit&&nowf()-t0>tLimit)break; // wall-clock safety: bail; telea fills the rest
    let best=-1,bestPr=-1,bestC=0;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=idx(x,y);if(filled[i])continue;
      if(!((x>0&&filled[i-1])||(x<W-1&&filled[i+1])||(y>0&&filled[i-W])||(y<H-1&&filled[i+W])))continue; // fill front only
      let cs=0,cnt=0;for(let dy=-half;dy<=half;dy++)for(let dx=-half;dx<=half;dx++){const xx=x+dx,yy=y+dy;if(!inb(xx,yy))continue;cnt++;if(filled[idx(xx,yy)])cs+=conf[idx(xx,yy)];}
      const C=cnt?cs/cnt:0;
      const nx=(inb(x+1,y)&&filled[idx(x+1,y)]?1:0)-(inb(x-1,y)&&filled[idx(x-1,y)]?1:0);
      const ny=(inb(x,y+1)&&filled[idx(x,y+1)]?1:0)-(inb(x,y-1)&&filled[idx(x,y-1)]?1:0);
      const nl=Math.hypot(nx,ny)||1;
      let gx=0,gy=0;
      if(inb(x+1,y)&&inb(x-1,y)&&filled[idx(x+1,y)]&&filled[idx(x-1,y)])gx=(gray[idx(x+1,y)]-gray[idx(x-1,y)])/2;
      if(inb(x,y+1)&&inb(x,y-1)&&filled[idx(x,y+1)]&&filled[idx(x,y-1)])gy=(gray[idx(x,y+1)]-gray[idx(x,y-1)])/2;
      const D=Math.abs((-gy)*(nx/nl)+gx*(ny/nl))/255+0.001;
      const pr=C*D;if(pr>bestPr){bestPr=pr;best=i;bestC=C;}}
    if(best<0)break;
    const bx=best%W,by=(best/W)|0;
    let bestSSD=Infinity,bqx=-1,bqy=-1;
    const x0=Math.max(half,bx-band),x1=Math.min(W-1-half,bx+band),y0=Math.max(half,by-band),y1=Math.min(H-1-half,by+band);
    for(let qy=y0;qy<=y1;qy++)for(let qx=x0;qx<=x1;qx++){
      let ok=true,ssd=0,cntk=0;
      for(let dy=-half;dy<=half&&ok;dy++)for(let dx=-half;dx<=half;dx++){
        const sj=idx(qx+dx,qy+dy);if(!filled[sj]){ok=false;break;}
        const tx=bx+dx,ty=by+dy;if(!inb(tx,ty))continue;const ti=idx(tx,ty);
        if(filled[ti]){const a=ti*4,b=sj*4,dr=src[a]-src[b],dg=src[a+1]-src[b+1],db=src[a+2]-src[b+2];ssd+=dr*dr+dg*dg+db*db;cntk++;}}
      if(ok&&cntk>0&&ssd<bestSSD){bestSSD=ssd;bqx=qx;bqy=qy;}}
    if(bqx<0){filled[best]=1;conf[best]=bestC;remaining--;continue;}
    for(let dy=-half;dy<=half;dy++)for(let dx=-half;dx<=half;dx++){
      const tx=bx+dx,ty=by+dy;if(!inb(tx,ty))continue;const ti=idx(tx,ty);
      if(!filled[ti]){const si=idx(bqx+dx,bqy+dy),a=ti*4,b=si*4;
        d[a]=src[a]=src[b];d[a+1]=src[a+1]=src[b+1];d[a+2]=src[a+2]=src[b+2];d[a+3]=255;
        gray[ti]=0.299*d[a]+0.587*d[a+1]+0.114*d[a+2];filled[ti]=1;conf[ti]=bestC;remaining--;}}}
  // any leftover (shouldn't happen) → telea cleanup
  let leftover=0;for(let i=0;i<N;i++)if(!filled[i])leftover++;
  if(leftover){const m2=new Uint8Array(N);for(let i=0;i<N;i++)m2[i]=filled[i]?0:1;telea(img,m2,{radius:4});}
  return img;
}
window.LPInpaint={telea,criminisi};
})();
