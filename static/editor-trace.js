// ════════════════════════════════════════════════════════════════════════
//  LePrince — Auto-Trace engine (pure client). Turns a layer's alpha/luma into
//  vector outlines (closed paths) via marching squares + Douglas-Peucker simplify.
//  Powers Layer ▸ Auto-trace and Create ▸ Shapes/Masks from Text/Vector.
//  window.LPTrace = { buildBinary(imageData,opts) -> {bin,W,H},
//                     trace(bin,W,H,opts) -> [{points:[{x,y}], area, ccw}] }
//  Points are in source-pixel coords. Outer loops vs holes distinguished by winding (ccw).
// ════════════════════════════════════════════════════════════════════════
(function(){
'use strict';
function buildBinary(img,opts){
  opts=opts||{};
  const W=img.width,H=img.height,d=img.data,N=W*H,bin=new Uint8Array(N);
  const ch=opts.channel||'alpha',th=(opts.threshold==null?0.5:opts.threshold)*255,inv=!!opts.invert;
  for(let i=0;i<N;i++){const a=d[i*4+3];let v;
    if(ch==='luma')v=(0.299*d[i*4]+0.587*d[i*4+1]+0.114*d[i*4+2])*(a/255);
    else if(ch==='red')v=d[i*4]; else if(ch==='green')v=d[i*4+1]; else if(ch==='blue')v=d[i*4+2];
    else v=a; // alpha
    let on=v>=th; if(inv)on=!on; bin[i]=on?1:0;}
  return {bin,W,H};
}
// 16-case marching-squares segment table (corner bits TL=1,TR=2,BR=4,BL=8; edges top0 right1 bottom2 left3)
const SEG={1:[[0,3]],2:[[0,1]],3:[[1,3]],4:[[1,2]],5:[[0,3],[1,2]],6:[[0,2]],7:[[2,3]],8:[[2,3]],9:[[0,2]],10:[[0,1],[2,3]],11:[[1,2]],12:[[1,3]],13:[[0,1]],14:[[0,3]]};
function trace(bin,W,H,opts){
  opts=opts||{};
  const minArea=opts.minArea==null?40:opts.minArea, eps=opts.simplify==null?1.4:opts.simplify;
  const g=(x,y)=>(x<0||y<0||x>=W||y>=H)?0:bin[y*W+x];
  const eid=(cx,cy,e)=> e===0?('h'+cx+'_'+cy): e===1?('v'+(cx+1)+'_'+cy): e===2?('h'+cx+'_'+(cy+1)):('v'+cx+'_'+cy);
  const adj=new Map();
  const link=(a,b)=>{(adj.get(a)||adj.set(a,[]).get(a)).push(b);(adj.get(b)||adj.set(b,[]).get(b)).push(a);};
  for(let cy=-1;cy<H;cy++)for(let cx=-1;cx<W;cx++){
    const c=g(cx,cy)|(g(cx+1,cy)<<1)|(g(cx+1,cy+1)<<2)|(g(cx,cy+1)<<3);
    if(c===0||c===15)continue;const segs=SEG[c];if(!segs)continue;
    for(let s=0;s<segs.length;s++)link(eid(cx,cy,segs[s][0]),eid(cx,cy,segs[s][1]));
  }
  const pos=(id)=>{const t=id[0],us=id.indexOf('_'),x=+id.slice(1,us),y=+id.slice(us+1);return t==='h'?[x+0.5,y]:[x,y+0.5];};
  const visited=new Set(),loops=[];
  for(const start of adj.keys()){
    if(visited.has(start))continue;
    const loop=[];let cur=start,prev=null,guard=W*H*4+16;
    while(cur!=null&&!visited.has(cur)&&guard-->0){
      visited.add(cur);loop.push(cur);
      const ns=adj.get(cur);let nxt=null;
      for(let i=0;i<ns.length;i++){const n=ns[i];if(n!==prev&&!visited.has(n)){nxt=n;break;}}
      prev=cur;cur=nxt;
    }
    if(loop.length>=3){
      let pts=loop.map(pos);pts=simplify(pts,eps);
      if(pts.length>=3){const a=signedArea(pts);if(Math.abs(a)>=minArea)loops.push({points:pts.map(p=>({x:p[0],y:p[1]})),area:Math.abs(a),ccw:a>0});}
    }
  }
  loops.sort((a,b)=>b.area-a.area);
  return loops;
}
function signedArea(p){let s=0;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];s+=a[0]*b[1]-b[0]*a[1];}return s/2;}
function simplify(pts,eps){
  const n=pts.length;if(n<4||eps<=0)return pts;
  const keep=new Uint8Array(n);keep[0]=1;keep[n-1]=1;const stack=[[0,n-1]];
  while(stack.length){const seg=stack.pop(),s=seg[0],e=seg[1];let md=0,mi=-1;
    for(let i=s+1;i<e;i++){const dd=segDist(pts[i],pts[s],pts[e]);if(dd>md){md=dd;mi=i;}}
    if(md>eps&&mi>0){keep[mi]=1;stack.push([s,mi]);stack.push([mi,e]);}}
  const out=[];for(let i=0;i<n;i++)if(keep[i])out.push(pts[i]);return out;
}
function segDist(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;
  if(L===0)return Math.hypot(p[0]-a[0],p[1]-a[1]);
  let t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L;t=t<0?0:t>1?1:t;
  return Math.hypot(p[0]-(a[0]+t*dx),p[1]-(a[1]+t*dy));}
window.LPTrace={buildBinary,trace};
})();
