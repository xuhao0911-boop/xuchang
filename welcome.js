// 欢迎屏：从中国到许昌（平面地图，不用地球）
// 镜头：中国全图开场 → 连贯推近河南（先加速后减速）→ 停一下 → 推近许昌 → 许昌六个县市区像纸片一样落下 → "进入许昌"
// 三种画法共用同一个镜头：
//   paper 纸雕层叠：纸纹颗粒，省份、河南、许昌一层层抬起，阴影随推近变深
//   ink   水墨晕染：宣纸底，中国轮廓像墨洇开，河南墨色更浓，许昌朱砂红
//   sat   卫星航拍：平铺卫星影像 + 胶片颗粒 + 暗角，边界线带光晕，接近许昌时过渡成纸面
// 行为：同一次访问只出现一次；带 ?view= 的链接直接进内容；点左上角"了解许昌"可再看一次。
import {createProjection} from './map-camera.js';
import {TRAVEL} from './travel-data.js';

const sess={get(k){try{return sessionStorage.getItem(k)}catch{return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch{}}};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chars=t=>[...t].map((c,i)=>`<span style="--i:${i}">${c}</span>`).join('');
/* 正式网站固定用纸雕层叠（2026-11-12 选定）；ink / sat 两种画法的代码保留在下面，换风格只改这一行 */
export const STYLE='paper';

const w=document.createElement('div');
w.id='welcome';w.className='welcome';w.setAttribute('role','dialog');w.setAttribute('aria-label','了解许昌');
document.body.prepend(w);
let stopFlight=null;

function build(){
 if(stopFlight)stopFlight();
 w.className='welcome style-'+STYLE+(STYLE==='sat'?'':' paper');
 w.innerHTML=`<div class="wD-space"></div><div class="wD-paper"></div>
 <canvas class="wD-canvas" aria-hidden="true"></canvas><div class="wD-grain" aria-hidden="true"></div>
 <svg class="wD-map" viewBox="0 0 820 540" role="group" aria-label="许昌六个县市区"></svg>
 <p class="wD-place" aria-live="polite"></p>
 <p class="wD-loading">正在定位许昌…</p>
 <button class="wD-skip" type="button">跳过</button>
 <h1 class="wD-title">${chars('许昌')}</h1>
 <div class="w-gate"><button class="w-enter" data-view-link="overview" type="button"><span>进入许昌</span></button></div>`;
 w.querySelector('.wD-skip').addEventListener('click',land);
 fly();
}

/* ---------- 数据和库都存在本站 vendor/ 文件夹 ----------
   d3 7.9.0、topojson-client 3.0.2；world-atlas 2.0.2 countries-110m（Natural Earth）；
   中国、河南边界：阿里云 DataV.GeoAtlas；卫星影像：NASA Blue Marble（公有领域） */
const D3='./vendor/d3.min.js',TOPO='./vendor/topojson.min.js',EARTH='./vendor/earth-blue-marble.jpg';
const WORLD='./vendor/countries-110m.json',CHINA='./vendor/china-100000.json',HENAN='./vendor/henan-410000.json';
const loadScript=src=>new Promise((ok,no)=>{if(document.querySelector(`script[src="${src}"]`))return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.append(s);});
let geoCache=null,earthImg=null;
async function loadGeo(){
 if(geoCache)return geoCache;
 await loadScript(D3);await loadScript(TOPO);
 const [world,china,henan]=await Promise.all([WORLD,CHINA,HENAN].map(u=>fetch(u).then(r=>{if(!r.ok)throw new Error(u);return r.json();})));
 const fix=fc=>{for(const f of fc.features){const g=f.geometry;if(!g)continue;const ps=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];for(const p of ps)if(d3.geoArea({type:'Polygon',coordinates:p})>2*Math.PI)p.forEach(r=>r.reverse());}return fc;};
 fix(china);fix(henan);
 const mainland={type:'FeatureCollection',features:china.features.filter(f=>f.properties.adcode!=='100000_JD')};
 geoCache={countries:topojson.feature(world,world.objects.countries),china,mainland,henan,henanF:china.features.find(f=>f.properties.adcode===410000),xcF:henan.features.find(f=>f.properties.adcode===411000)};
 return geoCache;
}
const loadEarth=()=>earthImg?Promise.resolve(earthImg):new Promise(ok=>{const im=new Image();im.onload=()=>{earthImg=im;ok(im);};im.onerror=()=>ok(null);im.src=EARTH;});

/* 先加速、后长时间减速的缓动曲线 */
function bezier(x1,y1,x2,y2){const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by,X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,dX=t=>(3*ax*t+2*bx)*t+cx;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const d=X(t)-x;if(Math.abs(d)<1e-5)break;const s=dX(t);if(Math.abs(s)<1e-6)break;t-=d/s;}return Y(Math.min(1,Math.max(0,t)));};}
const sm=(a,b,t)=>t<=a?0:t>=b?1:(t-a)/(b-a),lerp=(a,b,t)=>a+(b-a)*t;

/* 纸纹 / 胶片颗粒：一张随机噪点小图，平铺 */
function grain(alpha,warm){const c=document.createElement('canvas');c.width=c.height=160;const x=c.getContext('2d'),d=x.createImageData(160,160);
 for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255|0;d.data[i]=v;d.data[i+1]=warm?v*.96:v;d.data[i+2]=warm?v*.9:v;d.data[i+3]=Math.random()*alpha*255;}x.putImageData(d,0,0);return c;}

/* 宣纸吸墨的斑驳：许多大小不一的淡墨圆斑叠在一起，再撒细纤维 */
function inkBlots(){const s=256,c=document.createElement('canvas');c.width=c.height=s;const x=c.getContext('2d');
 for(let i=0;i<140;i++){const px=Math.random()*s,py=Math.random()*s,r=6+Math.random()*38,a=.03+Math.random()*.07;
  for(const [dx,dy] of [[0,0],[s,0],[-s,0],[0,s],[0,-s]]){const g=x.createRadialGradient(px+dx,py+dy,0,px+dx,py+dy,r);g.addColorStop(0,`rgba(40,38,34,${a})`);g.addColorStop(1,'rgba(40,38,34,0)');x.fillStyle=g;x.fillRect(px+dx-r,py+dy-r,r*2,r*2);}}
 x.strokeStyle='rgba(60,55,48,.07)';x.lineWidth=.6;for(let i=0;i<90;i++){const px=Math.random()*s,py=Math.random()*s,a=Math.random()*6.28,l=4+Math.random()*14;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}
 return c;}

async function fly(){
 const paper=w.querySelector('.wD-paper'),place=w.querySelector('.wD-place'),cv=w.querySelector('.wD-canvas');
 const W=cv.clientWidth||innerWidth,H=cv.clientHeight||innerHeight;
 /* 卡顿的根源是"填像素"：每铺一层满屏色块约 2–4 毫秒。纸雕在运动中，画布最多约 240 万像素就足够清楚（落地后换成清晰的矢量图） */
 const PAPER=STYLE==='paper',dpr=PAPER?Math.max(.8,Math.min(1.25,devicePixelRatio||1,Math.sqrt(2.1e6/(W*H)))):Math.min(1.5,devicePixelRatio||1);
 cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
 const ctx=cv.getContext('2d',PAPER?{alpha:false}:undefined);
 const SEA='#F4F1EA',CNC='#FBF9F4',HNC='#D6E3EA';
 if(PAPER){ctx.fillStyle=SEA;ctx.fillRect(0,0,cv.width,cv.height);}
 let alive=true,raf=0;stopFlight=()=>{alive=false;cancelAnimationFrame(raf);stopFlight=null;};
 if(STYLE!=='sat')paper.style.opacity=1;

 let G,img=null;
 try{[G,img]=await Promise.race([Promise.all([loadGeo(),STYLE==='sat'?loadEarth():Promise.resolve(null)]),new Promise((_,no)=>setTimeout(()=>no(new Error('timeout')),9000))]);}
 catch(e){console.warn('地图数据没加载到，直接显示许昌地图',e);land();return;}
 if(!alive)return;w.querySelectorAll('.wD-loading').forEach(n=>n.remove());
 if(reduced){land();return;}
 const style=STYLE==='sat'&&!img?'paper':STYLE;

 /* 平面投影：经度按 35°N 的纬线长度压缩，中国全图放满画面；之后只用"镜头"（缩放 + 中心）移动 */
 const c0=Math.cos(35*Math.PI/180),raw=(l,p)=>[l*c0,p];raw.invert=(x,y)=>[x/c0,y];
 const pad=Math.min(W,H)*.08;
 const base=d3.geoProjection(raw).fitExtent([[pad,pad*1.9],[W-pad,H-pad*1.2]],G.china);
 const gp=d3.geoPath(base),P=o=>new Path2D(gp(o));
 /* 为了流畅：中国边界数据很细（几十万个点），全国视角下大多小于一个像素。
    预先按缩放级别做三档简化：全国用粗的，接近河南用中等的，接近许昌用细的；省界合成一条路径一次画完 */
 const lod=(feats,tol)=>{const p=new Path2D(),t2=tol*tol;for(const f of feats){const g=f.geometry;if(!g)continue;const polys=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:g.type==='MultiLineString'?[g.coordinates]:[];
  for(const poly of polys)for(const ring of poly){let lx=0,ly=0,n=0;for(let i=0;i<ring.length;i++){const q=base(ring[i]);if(!q)continue;const x=q[0],y=q[1];if(!n){p.moveTo(x,y);lx=x;ly=y;n=1;continue;}const dx=x-lx,dy=y-ly;if(dx*dx+dy*dy<t2&&i<ring.length-1)continue;p.lineTo(x,y);lx=x;ly=y;}if(g.type!=='MultiLineString')p.closePath();}}return p;};
 const TOL=[.7,.14,.03],pick=(arr,k)=>arr[k<2.5?0:k<12?1:2];
 const chinaL=TOL.map(t=>lod(G.china.features,t)),mainL=TOL.map(t=>lod(G.mainland.features,t));
 /* 纸雕只画中国以外的陆地：中国下面那块陆地会被中国整块盖住，画了也白画（推近后它铺满整个画面） */
 const worldX=P({type:'FeatureCollection',features:G.countries.features.filter(f=>f.id!=='156'&&f.id!=='158')});
 const world=P(G.countries),china=mainL[0],chinaAll=chinaL[0],provinces=[chinaL[0]],henanF=lod([G.henanF],.03),henanCities=[lod(G.henan.features,.03)],xc=lod([G.xcF],.01);
 /* 画面是否整个落在中国（或河南）里面：预先画一张小遮罩，每帧只查画面四边上的几十个点。
    整个在里面时，外面的海、陆地和那一层的阴影都看不见，就不画，只铺一块底色 */
 const MS=.25,mw=Math.ceil(W*MS),mh=Math.ceil(H*MS),mk=document.createElement('canvas');mk.width=mw;mk.height=mh;
 const mx=mk.getContext('2d',{willReadFrequently:true});mx.setTransform(MS,0,0,MS,0,0);mx.fillStyle='#f00';mx.fill(mainL[0]);mx.fillStyle='#0f0';mx.globalCompositeOperation='lighter';mx.fill(henanF);
 const md=mx.getImageData(0,0,mw,mh).data;
 const at=(x,y,ch)=>x>=0&&y>=0&&x<W&&y<H&&md[((y*MS|0)*mw+(x*MS|0))*4+ch]>200;
 const covers=(c,ch)=>{const hw=W/2/c.k*1.06,hh=H/2/c.k*1.06,N=10;for(let i=0;i<=N;i++){const u=i/N,x=c.cx-hw+2*hw*u,y=c.cy-hh+2*hh*u;if(!at(x,c.cy-hh,ch)||!at(x,c.cy+hh,ch)||!at(c.cx-hw,y,ch)||!at(c.cx+hw,y,ch))return false;}return true;};
 const box=o=>gp.bounds(o),fitCam=(b,ext)=>{const k=Math.min((ext[1][0]-ext[0][0])/(b[1][0]-b[0][0]),(ext[1][1]-ext[0][1])/(b[1][1]-b[0][1]));const ecx=(ext[0][0]+ext[1][0])/2,ecy=(ext[0][1]+ext[1][1])/2,bcx=(b[0][0]+b[1][0])/2,bcy=(b[0][1]+b[1][1])/2;return {k,cx:bcx-(ecx-W/2)/k,cy:bcy-(ecy-H/2)/k};};
 const CN={k:1,cx:W/2,cy:H/2},CN0={k:.9,cx:W/2,cy:H/2};
 const HN=fitCam(box(G.henanF),[[pad*1.4,pad*2.2],[W-pad*1.4,H-pad*1.6]]);
 const r=w.querySelector('.wD-map').getBoundingClientRect(),kk=Math.min(r.width/820,r.height/540),ox=r.left+(r.width-820*kk)/2,oy=r.top+(r.height-540*kk)/2;
 const XC=fitCam(box(G.xcF),[[ox+40*kk,oy+40*kk],[ox+780*kk,oy+500*kk]]);

 /* 节奏：0.9 秒中国出场 → 2.2 秒推近河南（先加速后减速）→ 停 0.4 秒 → 0.9 秒推近许昌 */
 const T0=900,T1=T0+2200,T2=T1+400,T3=T2+900,flight=bezier(.55,0,.15,1),io=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,eo=t=>1-Math.pow(1-t,3);
 const cam=(a,b,u)=>({k:Math.exp(lerp(Math.log(a.k),Math.log(b.k),u)),cx:lerp(a.cx,b.cx,u),cy:lerp(a.cy,b.cy,u)});
 const frame=t=>t<=T0?cam(CN0,CN,eo(t/T0)):t<=T1?cam(CN,HN,flight((t-T0)/(T1-T0))):t<=T2?HN:cam(HN,XC,io(Math.min(1,(t-T2)/(T3-T2))));
 const Lk=c=>Math.max(0,Math.min(1,Math.log(c.k)/Math.log(HN.k)));

 /* 卫星影像只取亚洲东部这一块，按同一投影铺上去 */
 let satDraw=null;
 if(style==='sat'){const L0=20,L1=180,B0=-25,B1=80,iw=img.width,ih=img.height;const sx=(L0+180)/360*iw,sw=(L1-L0)/360*iw,sy=(90-B1)/180*ih,sh=(B1-B0)/180*ih;const p0=base([L0,B1]),p1=base([L1,B0]);satDraw=()=>ctx.drawImage(img,sx,sy,sw,sh,p0[0],p0[1],p1[0]-p0[0],p1[1]-p0[1]);}
 const noise=ctx.createPattern(grain(.09,false),'repeat');
 const vgMk=c=>{const g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.hypot(W,H)*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,c);return g;},vgDark=vgMk('rgba(0,0,0,.55)'),vgPaper=vgMk('rgba(70,55,35,.14)');
 if(style!=='sat'){const gr=w.querySelector('.wD-grain');if(gr)gr.style.backgroundImage=`url(${grain(.06,true).toDataURL()}),radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(70,55,35,.14) 100%)`;}
 /* 水墨用：宣纸吸墨的斑驳纹理，和中国、河南、许昌的墨色中心 */
 const inkTex=style==='ink'?ctx.createPattern(inkBlots(),'repeat'):null;
 const ctrR=o=>{const b=gp.bounds(o);return [[(b[0][0]+b[1][0])/2,(b[0][1]+b[1][1])/2],Math.hypot(b[1][0]-b[0][0],b[1][1]-b[0][1])/2];};
 const [cnC,cnR]=ctrR(G.mainland),[hnC,hnR]=ctrR(G.henanF),[xcC,xcR]=ctrR(G.xcF);
 /* 墨色渐变只建一次：中间浓、边缘淡 */
 const rg=(C,R,stops)=>{const g=ctx.createRadialGradient(C[0],C[1],0,C[0],C[1],R);stops.forEach(([o,c])=>g.addColorStop(o,c));return g;};
 const cnWash=rg(cnC,cnR,[[0,'rgba(26,26,24,.30)'],[.6,'rgba(26,26,24,.17)'],[1,'rgba(26,26,24,.08)']]);
 const hnWash=rg(hnC,hnR,[[0,'rgba(24,24,22,.42)'],[.7,'rgba(24,24,22,.28)'],[1,'rgba(24,24,22,.16)']]);
 const xcWash=rg(xcC,xcR,[[0,'#A92F25'],[1,'#C4543F']]);
 const NAMES=['中国','河南','许昌'];let shown=-1;
 const say=i=>{if(i===shown)return;shown=i;place.classList.remove('in');void place.offsetWidth;place.textContent=NAMES[i];place.classList.add('in');};
 const tok=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim(),BG=tok('--bg')||'#F6F4EF';

 /* 计时从第一帧真正画出来时开始，避免开场被页面加载拖慢后直接跳帧 */
 let start=0;
 const draw=now=>{
  if(!alive)return;if(!start)start=now;const t=Math.max(0,now-start);if(t>=T3){land();return;}
  const c=frame(t),L=Lk(c),k=c.k,lw=px=>px/k;
  const xa=sm(T1-300,T1+80,t),pulse=t>T1&&t<T2?Math.sin((t-T1)/(T2-T1)*Math.PI):0,intro=eo(Math.min(1,t/T0));
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const camT=()=>ctx.setTransform(dpr*k,0,0,dpr*k,dpr*(W/2-k*c.cx),dpr*(H/2-k*c.cy));

  if(style==='paper'){
   /* 纸雕：海是底纸，陆地一层，中国一层，河南、许昌再各抬起一层。
      阴影不用每帧模糊，而是把同一块形状向下错开铺一层半透明色块——正像纸片叠起来的投影。
      卡顿的根源是"层层铺满屏"：推近后中国、河南几乎铺满画面，每多一层就多填一整屏像素。
      所以每层只留一道投影（原来两道），中国下面也不再垫一层陆地。
      （实测：整块填色约 1 毫秒，沿几万个边界点画宽描边要 5–9 毫秒，所以投影用填色不用描边） */
   const lift=(path,dy,alpha,rgb)=>{if(dy<=0||alpha<=0)return;ctx.save();ctx.translate(lw(dy*.3),lw(dy));ctx.fillStyle=`rgba(${rgb},${alpha*.62})`;ctx.fill(path);ctx.restore();};
   const cnP=pick(chinaL,k),cnF=pick(mainL,k),hl=sm(.15,.75,L);
   const inCN=covers(c,0),inHN=inCN&&hl>=1&&covers(c,1);
   ctx.fillStyle=inHN?HNC:inCN?CNC:SEA;ctx.fillRect(0,0,W,H);
   camT();
   if(!inCN){ctx.fillStyle='#E9E4D9';ctx.fill(worldX);
    ctx.globalAlpha=intro;lift(cnF,6*intro,.22,'70,55,35');ctx.fillStyle=CNC;ctx.fill(cnF);ctx.globalAlpha=1;}
   if(!inHN){ctx.strokeStyle='rgba(150,135,110,.35)';ctx.lineWidth=lw(.8);ctx.stroke(cnP);}
   if(hl>0){if(!inHN){lift(henanF,10*hl,.3*hl,'29,58,80');ctx.globalAlpha=hl;ctx.fillStyle=HNC;ctx.fill(henanF);}
    ctx.globalAlpha=hl;ctx.strokeStyle='#ffffff';ctx.lineWidth=lw(1.2);henanCities.forEach(p=>ctx.stroke(p));ctx.globalAlpha=1;}
   if(xa>0){lift(xc,(8+6*pulse)*xa,.36*xa,'110,30,40');ctx.globalAlpha=xa;ctx.fillStyle='#A6424E';ctx.fill(xc);ctx.globalAlpha=1;}
  }else{ctx.clearRect(0,0,W,H);camT();}
  if(style==='paper'){}else if(style==='ink'){
   /* 水墨：宣纸底；中国像墨从中心洇开，墨色中间浓、边缘淡，叠宣纸吸墨的斑驳；
      轮廓是一道实线加一圈淡墨晕；河南墨更浓；许昌用朱砂，像印泥 */
   /* 为了流畅：不用每帧的阴影模糊和正片叠底；墨晕用几道由宽到窄、由淡到浓的描边模拟 */
   inkTex.setTransform(new DOMMatrix().scale(1/k));
   ctx.lineJoin='round';
   ctx.fillStyle='rgba(60,55,45,.05)';ctx.fill(world);
   const spreading=intro<1;if(spreading){ctx.save();const rr=Math.max(1,Math.hypot(W,H)*intro/k);ctx.beginPath();ctx.arc(c.cx,c.cy,rr,0,6.283);ctx.clip();}
   ctx.strokeStyle='rgba(24,24,22,.045)';ctx.lineWidth=lw(16);ctx.stroke(china);
   ctx.strokeStyle='rgba(24,24,22,.07)';ctx.lineWidth=lw(7);ctx.stroke(china);
   ctx.fillStyle=cnWash;ctx.fill(chinaAll);
   ctx.fillStyle=inkTex;ctx.fill(chinaAll);
   ctx.strokeStyle='rgba(22,22,20,.72)';ctx.lineWidth=lw(1.7);ctx.stroke(china);
   if(spreading)ctx.restore();
   ctx.strokeStyle='rgba(30,30,28,.13)';ctx.lineWidth=lw(.6);provinces.forEach(p=>ctx.stroke(p));
   const hl=sm(.15,.75,L);
   if(hl>0){
    ctx.globalAlpha=hl;
    ctx.strokeStyle='rgba(22,22,20,.07)';ctx.lineWidth=lw(12);ctx.stroke(henanF);
    ctx.fillStyle=hnWash;ctx.fill(henanF);ctx.fillStyle=inkTex;ctx.fill(henanF);
    ctx.strokeStyle='rgba(30,30,28,.38)';ctx.lineWidth=lw(.9);henanCities.forEach(p=>ctx.stroke(p));
    ctx.strokeStyle='rgba(22,22,20,.8)';ctx.lineWidth=lw(1.6);ctx.stroke(henanF);ctx.globalAlpha=1;}
   if(xa>0){
    ctx.globalAlpha=xa;
    ctx.strokeStyle=`rgba(176,58,46,${.12+.18*pulse})`;ctx.lineWidth=lw(10+10*pulse);ctx.stroke(xc);
    ctx.globalAlpha=xa*.92;ctx.fillStyle=xcWash;ctx.fill(xc);
    ctx.globalAlpha=xa*.5;ctx.fillStyle=inkTex;ctx.fill(xc);ctx.globalAlpha=1;}
  }else{
   /* 卫星航拍：影像 + 光晕边界线；推近河南后过渡成纸面 */
   const q=t>T1?1:sm(.62,.98,L);
   paper.style.opacity=q;w.classList.toggle('paper',q>.5);
   if(q<1){ctx.globalAlpha=1-q;satDraw();ctx.globalAlpha=1;}
   if(q>0){ctx.globalAlpha=q;ctx.fillStyle='#E9E4D9';ctx.fill(world);ctx.fillStyle='#FBF9F4';ctx.fill(chinaAll);ctx.globalAlpha=1;}
   ctx.save();ctx.globalAlpha=intro*(1-.6*q);ctx.shadowColor='rgba(255,255,255,.8)';ctx.shadowBlur=8;ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=lw(1.3);ctx.stroke(china);ctx.restore();
   ctx.strokeStyle=q<.5?'rgba(255,255,255,.28)':'rgba(150,135,110,.35)';ctx.lineWidth=lw(.7);provinces.forEach(p=>ctx.stroke(p));
   const hl=sm(.15,.75,L);
   if(hl>0){ctx.save();ctx.globalAlpha=hl;ctx.shadowColor='rgba(255,255,255,.9)';ctx.shadowBlur=10;ctx.strokeStyle='#ffffff';ctx.lineWidth=lw(2);ctx.stroke(henanF);ctx.restore();
    if(q>0){ctx.save();ctx.globalAlpha=hl*q;ctx.fillStyle='#D6E3EA';ctx.fill(henanF);ctx.strokeStyle='#ffffff';ctx.lineWidth=lw(1.2);henanCities.forEach(p=>ctx.stroke(p));ctx.restore();}}
   if(xa>0){ctx.save();ctx.shadowColor='rgba(166,66,78,.7)';ctx.shadowBlur=16+18*pulse;ctx.globalAlpha=xa*.85;ctx.fillStyle='#A6424E';ctx.fill(xc);ctx.restore();}
  }

  /* 质感：卫星风格的胶片颗粒会动，每帧画；纸雕和水墨的纸纹、暗角是静态 CSS 叠加层，不占每帧开销 */
  if(style==='sat'){ctx.setTransform(dpr,0,0,dpr,0,0);
   ctx.save();ctx.translate((t*.37)%160,(t*.23)%160);ctx.fillStyle=noise;ctx.fillRect(-160,-160,W+320,H+320);ctx.restore();
   ctx.fillStyle=w.classList.contains('paper')?vgPaper:vgDark;ctx.fillRect(0,0,W,H);}

  say(L<.4?0:t<T1-150?1:2);
  raf=requestAnimationFrame(draw);};
 raf=requestAnimationFrame(draw);
}

/* ---------- 落地：许昌六个县市区像纸片一样依次落下（统一天青色系） ---------- */
const TILE={'魏都区':'#A3BFCF','建安区':'#9CBACB','禹州市':'#BCD1DC','长葛市':'#AAC5D4','鄢陵县':'#C7D9E2','襄城县':'#B2CAD8'};
const ORDER=['禹州市','襄城县','长葛市','鄢陵县','建安区','魏都区'];
const NUDGE={'建安区':[18,44],'魏都区':[0,2]};
function land(){
 if(w.classList.contains('landed'))return;if(stopFlight)stopFlight();
 w.querySelectorAll('.wD-loading').forEach(n=>n.remove());w.querySelector('.wD-paper').style.opacity='';
 w.classList.add('landed','paper');tiles();
}
async function tiles(){
 const svg=w.querySelector('.wD-map');
 try{
  const geo=await (await fetch('./xuchang.geojson')).json(),proj=createProjection(geo,{padding:40});
  const d=f=>(f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates]).map(p=>p.map(r=>r.map((v,j)=>`${j?'L':'M'}${proj(v).map(n=>n.toFixed(1)).join(',')}`).join(' ')+'Z').join(' ')).join(' ');
  const fs=[...geo.features].sort((a,b)=>ORDER.indexOf(a.properties.name)-ORDER.indexOf(b.properties.name));
  /* 不用 SVG 投影滤镜：纸片下落时滤镜要逐帧重算，会卡；投影改成两层错开的底片 */
  svg.innerHTML=`<g class="wP-relief wP-relief2">${fs.map(f=>`<path d="${d(f)}"/>`).join('')}</g>
  <g class="wP-relief">${fs.map(f=>`<path d="${d(f)}"/>`).join('')}</g>
  <g class="wP-tiles">${fs.map((f,i)=>{const n=f.properties.name,r=TRAVEL.regions.find(x=>x.name===n);return `<path class="wP-tile" d="${d(f)}" style="--i:${i};fill:${TILE[n]||'#BCD1DC'}" data-name="${esc(n)}" tabindex="0" role="button" aria-label="${esc(n)}，进入网站看介绍"><title>${esc(n)}${r?' · '+esc(r.tagline):''}</title></path>`}).join('')}</g>
  <g class="wP-labels">${fs.map((f,i)=>{const n=f.properties.name,[x,y]=proj(f.properties.centroid||f.properties.center),o=NUDGE[n]||[0,0];return `<text x="${(x+o[0]).toFixed(1)}" y="${(y+o[1]).toFixed(1)}" style="--i:${i}">${esc(n)}</text>`}).join('')}</g>`;
  svg.querySelectorAll('.wP-tile').forEach(p=>{const n=p.dataset.name;
   const go=()=>{enter();const b=document.createElement('button');b.dataset.viewLink='travel#travel-'+n;b.hidden=true;document.body.append(b);b.click();b.remove();};
   p.addEventListener('click',go);p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();go();}});});
 }catch(e){console.warn('许昌地图加载失败',e);}
}

function show(){w.hidden=false;w.classList.remove('out');document.body.classList.add('w-lock');build();requestAnimationFrame(()=>w.querySelector('.w-enter')?.focus({preventScroll:true}));}
function enter(){if(w.classList.contains('out'))return;if(stopFlight)stopFlight();w.classList.add('out');document.body.classList.remove('w-lock');sess.set('xc-entered','1');setTimeout(()=>{w.hidden=true;},900);}
w.addEventListener('click',e=>{if(e.target.closest('.w-enter'))enter();});
document.addEventListener('keydown',e=>{if(!w.hidden&&!w.classList.contains('out')&&e.key==='Escape')enter();});
document.querySelector('.brand')?.addEventListener('click',e=>{e.preventDefault();const b=document.createElement('button');b.dataset.viewLink='overview';b.hidden=true;document.body.append(b);b.click();b.remove();show();});

const deep=new URLSearchParams(location.search).has('view');
if(sess.get('xc-entered')==='1'||deep){w.hidden=true;}else show();
