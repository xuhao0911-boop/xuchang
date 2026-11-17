import {isEN,tr,L} from './i18n.js';
import {filterRecords,sortRecords,csvExport} from './core.js';
import {overviewHTML,topicsHTML} from './overview.js';
import {createProjection,featureBounds,fitCamera,screenPoint} from './map-camera.js';
import {photos,allPhotos} from './photos.js';
import {historyHTML,pangdonglaiHTML} from './stories.js';
import {travelHTML,returnHTML} from './guide.js';
const VIEWS=['overview','travel','return','map','topics','timeline','sources','history','pangdonglai'];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)],esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='xuchang-atlas-favorites-v1';let db,geo,editorial,rows=[],saved=new Set(),view='overview',current=null;
try{saved=new Set(JSON.parse(localStorage.getItem(key)||'[]'));}catch{}
const defaults={search:'',region:'',industry:'',topic:'',docType:'',stage:'',level:'',verification:'',startYear:2019,endYear:2035,medical:false,savedOnly:false,includeBroader:false};let state={...defaults};
const tagClass=v=>v==='已核验'?'':v==='部分核验'?'partial':'pending';
const regionAliases={'经济技术开发区':'魏都区','城乡一体化示范区':'建安区','东城区':'建安区'};
let zoom=1,panX=0,panY=0,drag=null,moved=false,baseProjection,cameraFrame=0,lastFocusedRegion=null,regionBounds={},mapCounts={},photoIndex=0,photoTimer=0,photoBusy=false,photoPaused=false,heroHovered=false;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function toast(msg){$('#toast').textContent=msg;$('#toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').hidden=true,2600)}
function populate(){
 for(const [id,values] of Object.entries({region:[...new Set(db.records.map(r=>r.region))],industry:[...new Set(db.records.flatMap(r=>r.industries))],topic:db.topics.map(t=>t.id),docType:[...new Set(db.records.map(r=>r.docType))],stage:[...new Set(db.records.map(r=>r.stage))],level:['省级','市级','区县级']})){
  const s=$('#'+id);values.forEach(v=>s.add(new Option(v,v)));
 }
 for(let y=db.coverageStart;y<=db.coverageEnd;y++){ $('#startYear').add(new Option(y,y));$('#endYear').add(new Option(y,y)); }
 syncControls();
}
function syncControls(){$('#mapSearch').value=state.search;$('#includeBroader').checked=state.includeBroader;for(const k of ['search','region','industry','topic','docType','stage','level','verification','startYear','endYear'])$('#'+k).value=state[k];$$('[data-preset]').forEach(e=>e.classList.toggle('active',e.dataset.preset==='medical'&&state.medical||e.dataset.preset==='saved'&&state.savedOnly));}
function saveUrl(){const params=new URLSearchParams();for(const [k,v]of Object.entries(state))if(v!==defaults[k]&&v!==''&&v!==false)params.set(k,String(v));if(view!=='overview'||params.size)params.set('view',view);const url=location.pathname+(params.size?'?'+params:'');history.replaceState(null,'',url);}
function loadUrl(){const p=new URLSearchParams(location.search);for(const k of Object.keys(defaults)){if(!p.has(k))continue;let v=p.get(k);if(['startYear','endYear'].includes(k)){if(!/^\d{4}$/.test(v)||Number(v)<db.coverageStart||Number(v)>db.coverageEnd)continue;v=Number(v)}else if(['medical','savedOnly','includeBroader'].includes(k))v=v==='true';state[k]=v;}if(state.startYear>state.endYear)[state.startYear,state.endYear]=[state.endYear,state.startYear];if(VIEWS.includes(p.get('view')))view=p.get('view');else if(p.size)view='map';}
function render(){
 rows=sortRecords(filterRecords(db.records,state,saved),$('#sort').value);
 $('#resultCount').textContent=String(rows.length).padStart(2,'0');$('#savedCount').textContent=saved.size;
 $('#scopeLabel').textContent=`${state.region||'全部地区'} · ${state.topic||state.industry||'全部主题'}`;
 const n=Object.entries(state).filter(([k,v])=>v!==defaults[k]&&v!==''&&v!==false&&k!=='startYear'&&k!=='endYear').length+(state.startYear!==defaults.startYear||state.endYear!==defaults.endYear?1:0);
 $('#filterCount').textContent=n||'';$('#clearQuick').hidden=!n;
 $('#cards').innerHTML=rows.length?rows.map(cardHTML).join(''):'<div class="empty">暂无匹配资料<br><button class="textbutton" data-clear>清空筛选 →</button></div>';
 renderMap();renderTimeline();saveUrl();
}
function cardHTML(r){
 const lifecycle=r.lifecycle?`<div class="lifecycle">${esc(r.lifecycle)}</div>`:'';
 return `<article class="card" data-record="${r.id}"><div class="cardtop"><span>${esc(r.region)} · ${esc(r.docType)}</span><span class="tag ${tagClass(r.verification)}">${r.verification}</span></div><button class="card-title" data-detail="${r.id}">${esc(r.title)} <span>↗</span></button>${lifecycle}<div class="cardbottom"><span>${esc(r.stage)}<time>${r.published||'日期待核验'}</time></span><button class="save ${saved.has(r.id)?'saved':''}" data-save="${r.id}" aria-label="${saved.has(r.id)?'取消关注':'关注'}${esc(r.title)}" aria-pressed="${saved.has(r.id)}">${saved.has(r.id)?'★':'☆'}</button></div></article>`;
}

function setView(next){const changed=view!==next;view=next;document.body.dataset.view=next;for(const v of VIEWS)$('#'+v+'View').hidden=v!==next;markNav(next==='overview'?spySection:null);$('#exploreTitle').textContent=next==='timeline'?'时间轴':'探索地图';if(changed){closeFilters();document.body.classList.remove('map-expanded');$('#fullscreenMap').textContent='全屏 ⤢';$('#fullscreenMap').setAttribute('aria-label','全屏地图');}if(next==='map'&&baseProjection)renderMapOverlays();if(changed)window.scrollTo({top:0,behavior:'instant'});restartHeroRotation();saveUrl();}
/* 顶部导航：首页上按滚动位置高亮当前一节；在子页面里高亮它所属的那一节 */
let spySection=null;
function markNav(section){$$('.topbar .nav').forEach(b=>{const active=section?b.dataset.section===section:(b.dataset.group||'').split(' ').includes(view);b.classList.toggle('active',active);b.setAttribute('aria-current',active?'true':'false');});}
function goSection(s){if(view!=='overview')setView('overview');requestAnimationFrame(()=>document.getElementById('sec-'+s)?.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'}));}
function setupSpy(){
 const secs=$$('#overviewContent .home-sec');if(!secs.length||!('IntersectionObserver' in window))return;
 const seen=new Map();
 const io=new IntersectionObserver(es=>{es.forEach(e=>seen.set(e.target.dataset.section,e.isIntersecting));const cur=secs.map(s=>s.dataset.section).find(s=>seen.get(s))||null;spySection=cur;if(view==='overview')markNav(cur);},{rootMargin:'-45% 0px -50% 0px'});
 secs.forEach(s=>io.observe(s));
}
function reset(){state={...defaults};syncControls();lastFocusedRegion=null;render();}
function applyPreset(p){state={...defaults};if(p==='medical')state.medical=true;if(p==='weidu')state.region='魏都区';if(p==='pending')state.verification='待核验';if(p==='saved')state.savedOnly=true;syncControls();closeFilters();lastFocusedRegion=null;setView('map');render();}
function renderSources(){
 const query=($('#sourceSearch').value||'').trim().toLowerCase();const sources=[...new Map(Object.values({...db.sources,...editorial.sources}).map(s=>[s.url,s])).values()].filter(s=>!query||(s.title+' '+s.publisher).toLowerCase().includes(query)).sort((a,b)=>(b.published||'').localeCompare(a.published||''));$('#allSourceCount').textContent=`${sources.length} 条出处`;
 $('#sourceList').innerHTML=sources.map(s=>`<div class="source-row"><span>${s.published||'日期待核验'}</span><div><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><details class="source-note"><summary>核验说明</summary><p>${esc(s.verificationNote)} · 核验于 ${s.checkedAt||db.snapshotDate}</p></details></div><span>${esc(s.publisher)}</span></div>`).join('');
}

function openDetail(id){
 const r=db.records.find(x=>x.id===id);if(!r)return;current=r.id;
 const sourcesHTML=r.sources.map(id=>{const s=db.sources[id];return `<div class="detail-source"><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><small>${esc(s.publisher)} · ${s.published||'日期待核验'}${s.documentNumber?' · '+esc(s.documentNumber):''}</small><details class="source-note"><summary>核验说明</summary><p>${esc(s.verificationNote)} · 核验于 ${s.checkedAt||db.snapshotDate}</p></details></div>`}).join('');
 const related=(r.related||[]).map(id=>db.records.find(x=>x.id===id)).filter(Boolean).map(x=>`<button data-detail="${x.id}">${esc(x.title)} ↗</button>`).join('');
 const events=r.events.map(e=>`<p>${e.date} · ${esc(e.text)}</p>`).join('');
 $('#detailContent').innerHTML=`<div class="detailheader"><button class="close" aria-label="关闭详情">×</button><span class="tag ${tagClass(r.verification)}">${r.verification}</span><h2>${esc(r.title)}</h2><div class="detailtags"><span>${esc(r.region)}</span><span>${esc(r.docType)}</span></div></div><div class="detailbody">${r.lifecycle?'<div class="lifecycle">'+esc(r.lifecycle)+'</div>':''}<p class="detail-abstract">${esc(r.summary)}</p><div class="detailmeta"><div>阶段<strong>${esc(r.stage)}</strong></div><div>层级<strong>${esc(r.level)}</strong></div><div>涉及时段<strong>${r.start}—${r.end}</strong></div><div>发布日期<strong>${r.published||'日期待核验'}</strong></div></div><div class="evidence-note">${esc(r.caveat)}</div><details class="detail-more"><summary>阅读提示与更多信息</summary><p>${esc(r.reading||r.opportunity)}</p><p>${esc(r.locationNote)}</p><p>${esc(r.timeBasis)} · ${r.industries.map(esc).join(' · ')}</p>${events}</details><h3>来源</h3>${sourcesHTML}${related?'<h3>继续阅读</h3><div class="related-records">'+related+'</div>':''}<div class="detailfoot"><span>资料更新于 ${db.snapshotDate}</span><button class="outline" id="detailSave">${saved.has(r.id)?'★ 已关注':'☆ 关注'}</button></div></div>`;
 if(!$('#detail').open)$('#detail').showModal();$('#detail').scrollTop=0;$('#detail .close').onclick=()=>$('#detail').close();$('#detailSave').onclick=()=>{toggleSave(r.id);$('#detailSave').textContent=saved.has(r.id)?'★ 已关注':'☆ 关注'};
}

function toggleSave(id){saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem(key,JSON.stringify([...saved]));}catch{toast('浏览器未允许保存；关注只在本次页面有效。')}render();}

function renderTimeline(){
 const mode=$('#timelineMode').value,first=state.startYear,last=state.endYear;
 const start=Date.UTC(first,0,1),end=Date.UTC(last+1,0,1),pos=date=>Math.max(0,Math.min(100,(Date.parse(date)-start)/(end-start)*100));let outside=[];
 const years=Array.from({length:last-first+1},(_,i)=>first+i),col=100/years.length;
 $('#timelineTitle').textContent=`${first}—${last} 政策与发展时间轴`;
 $('#timeline').style.minWidth=Math.max(750,240+years.length*68)+'px';
 let html=`<div class="timeline-axis"><span>${mode==='period'?'条目 / 资料涉及时段':'条目 / 来源公开记录'}</span><div class="time-years" style="grid-template-columns:repeat(${years.length},1fr)">${years.map(y=>`<span>${y}</span>`).join('')}</div></div>`;
 for(const r of rows){
  let marks='';
  if(mode==='period'){
   const a=pos(`${Math.max(r.start,first)}-01-01`),b=pos(`${Math.min(r.end+1,last+1)}-01-01`);
   marks=`<button class="time-bar ${tagClass(r.verification)}" style="left:${a}%;width:${b-a}%" data-detail="${r.id}" aria-label="${esc(r.title)}，${r.start}至${r.end}年，${esc(r.timeBasis)}" title="${esc(r.title)}：${r.start}—${r.end} · ${esc(r.timeBasis)}"></button>`;
  }else{
   for(const source of r.sources.map(id=>db.sources[id])){
    if(!source.published||Number(source.published.slice(0,4))<first||Number(source.published.slice(0,4))>last){outside.push({r,source});continue;}
    const x=pos(source.published);marks+=`<button class="time-point ${tagClass(r.verification)}" style="left:${x}%" data-detail="${r.id}" aria-label="${esc(r.title)}，来源发布于${source.published}" title="${source.published} · ${esc(source.title)}"></button>`;
   }
  }
  html+=`<div class="timeline-row"><button class="timeline-title" data-detail="${r.id}">${esc(r.title)}</button><div class="time-track" style="--yearcol:${col}%">${marks}</div></div>`;
 }
 $('#timeline').innerHTML=rows.length?html:'<div class="empty">当前筛选没有可显示的信息。</div>';
 $('#undated').innerHTML=outside.length?'<details><summary>查看视窗外的背景出处（'+outside.length+'条引用）</summary><p>'+outside.map(({r,source})=>`${esc(r.title)}（${source.published||'日期待核验'}）`).join('；')+'</p></details>':'';
}

function initMap(){
 baseProjection=createProjection(geo);
 regionBounds=Object.fromEntries(geo.features.map(f=>[f.properties.name,featureBounds(f,baseProjection)]));
 $('#boundaries').innerHTML=geo.features.map((f,i)=>{const polys=f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates];const d=polys.map(p=>p.map(ring=>ring.map((v,j)=>`${j?'L':'M'}${baseProjection(v).map(v=>v.toFixed(2)).join(',')}`).join(' ')+' Z').join(' ')).join(' ');return `<path d="${d}" fill="${['#CBD7E3','#D7E0E8','#E0E6ED','#C1D0DF','#D1DCE6','#CCD8E3'][i]}" data-region="${f.properties.name}" tabindex="0" role="button" aria-label="进入${f.properties.name}"/>`}).join('');
}
function renderMap(){
 if(!baseProjection)return;mapCounts={};for(const r of rows){if(regionBounds[r.region])(mapCounts[r.region]??=[]).push(r);}
 $$('#boundaries path').forEach(p=>p.classList.toggle('selected',p.dataset.region===state.region));
 $('#map').classList.toggle('focused',!!regionBounds[state.region]);
 const scopes=[['许昌全市','市级政策'],['河南全省','省级政策'],['经济技术开发区','经开区'],['城乡一体化示范区','示范区'],['东城区','东城区']];$('#functional').innerHTML=scopes.map(([r,t])=>`<button class="${state.region===r?'chosen':''}" data-region="${r}">${t}</button>`).join('');
 $('#mapScope').textContent=state.region||'许昌';$('#backCity').hidden=!state.region;
 if(lastFocusedRegion!==state.region){lastFocusedRegion=state.region;focusRegion(state.region);}
 renderMapOverlays();
}
function renderMapOverlays(){
 if(!baseProjection)return;
 const camera={zoom,panX,panY},focused=!!regionBounds[state.region],box=$('#map').getBoundingClientRect(),unit=1/(Math.min(box.width/820,box.height/540)||1);
 $('#mapLabels').innerHTML=geo.features.map(f=>{const name=f.properties.name;if(focused&&name!==state.region)return '';const p=screenPoint(baseProjection(f.properties.centroid||f.properties.center),camera),offset=focused?[0,0]:name==='魏都区'?[25,-10]:name==='建安区'?[14,25]:[0,4];return `<text x="${p[0]+offset[0]*unit}" y="${p[1]+offset[1]*unit}" text-anchor="middle" dominant-baseline="central" style="font-size:${14*unit}px;stroke-width:${(focused?2:3)*unit}px">${name}</text>`}).join('');
}
function transform(){ $('#map').dataset.zoom=zoom.toFixed(5);$('#mapScene').setAttribute('transform',`translate(${410+panX} ${270+panY}) scale(${zoom}) translate(-410 -270)`);renderMapOverlays(); }
function stopCamera(){cancelAnimationFrame(cameraFrame);cameraFrame=0;$('#map').dataset.cameraState='ready';}
function moveCamera(target,animate=true){
 stopCamera();const from={zoom,panX,panY};if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){({zoom,panX,panY}=target);transform();return;}
 $('#map').dataset.cameraState='moving';const started=performance.now();function tick(now){const t=Math.min(1,(now-started)/650),ease=1-Math.pow(1-t,3);zoom=from.zoom+(target.zoom-from.zoom)*ease;panX=from.panX+(target.panX-from.panX)*ease;panY=from.panY+(target.panY-from.panY)*ease;transform();if(t<1)cameraFrame=requestAnimationFrame(tick);else{cameraFrame=0;$('#map').dataset.cameraState='ready';}}cameraFrame=requestAnimationFrame(tick);
}
function focusRegion(name,animate=true){moveCamera(regionBounds[name]?fitCamera(regionBounds[name]):{zoom:1,panX:0,panY:0},animate);}
function zoomBy(factor){stopCamera();const next=Math.min(12,Math.max(.8,zoom*factor)),ratio=next/zoom;panX*=ratio;panY*=ratio;zoom=next;transform();}
function closeFilters(){const wasOpen=document.body.classList.contains('filters-open');document.body.classList.remove('filters-open');$('main').inert=false;$('#openFilters').setAttribute('aria-expanded','false');if(wasOpen)$('#openFilters').focus();}
function openFilters(){document.body.classList.add('filters-open');$('#openFilters').setAttribute('aria-expanded','true');$('main').inert=true;$('#search').focus();}
async function copyView(){saveUrl();let ok=false;try{await navigator.clipboard.writeText(location.href);ok=true;}catch{const t=document.createElement('textarea');t.value=location.href;t.style.cssText='position:fixed;opacity:0';document.body.append(t);t.select();ok=document.execCommand('copy');t.remove();}toast(ok?'视图链接已复制，访问仍需权限':'浏览器未允许复制链接');}
async function showPhoto(index){
 if(photoBusy||view!=='overview')return;
 const next=(index+photos.length)%photos.length;if(next===photoIndex)return;
 photoBusy=true;
 try{
  const p=photos[next],active=$('.hero-slide.is-visible'),incoming=$('.hero-slide:not(.is-visible)');incoming.src=p.file;await incoming.decode();
  if(view!=='overview')return;
  incoming.alt=p.title;incoming.style.objectPosition=p.position||'50% 55%';incoming.removeAttribute('aria-hidden');active.setAttribute('aria-hidden','true');active.classList.remove('is-visible');incoming.classList.add('is-visible');photoIndex=next;
  $('#heroQuote').innerHTML=isEN?esc(tr(p.quote.text)):esc(p.quote.text).replaceAll('，','，<br>');$('#heroQuoteSource').textContent=p.quote.credit;$('#heroQuoteSource').href=p.quote.url;
  $('#photoName').textContent=p.name;$('#photoPosition').textContent=String(photoIndex+1).padStart(2,'0')+' / '+String(photos.length).padStart(2,'0');$('.photo-hero').dataset.photoId=p.id;
  const preload=new Image();preload.src=photos[(photoIndex+1)%photos.length].file;
 }catch(error){console.warn('城市图片切换失败',error.message);}finally{photoBusy=false;}
}
function restartHeroRotation(){
 clearInterval(photoTimer);photoTimer=0;
 const hero=$('.photo-hero');if(!hero)return;
 const focusInside=hero.contains(document.activeElement)&&document.activeElement!==$('#photoPause'),playing=view==='overview'&&!photoPaused&&!document.hidden&&!heroHovered&&!focusInside;
 hero.dataset.autoplay=playing?'playing':'paused';
 if(playing)photoTimer=setInterval(()=>showPhoto(photoIndex+1),9000);
}
function setupHeroRotation(){
 const hero=$('.photo-hero');if(!hero)return;hero.dataset.photoId=photos[0].id;
 photoPaused=reducedMotion.matches;
 const pause=$('#photoPause');
 function reflect(){pause.setAttribute('aria-pressed',String(photoPaused));pause.setAttribute('aria-label',photoPaused?'播放城市图片轮播':'暂停城市图片轮播');pause.textContent=photoPaused?'▶':'Ⅱ';}
 pause.onclick=()=>{photoPaused=!photoPaused;reflect();restartHeroRotation();};reflect();
 hero.addEventListener('mouseenter',()=>{heroHovered=true;restartHeroRotation()});hero.addEventListener('mouseleave',()=>{heroHovered=false;restartHeroRotation()});
 hero.addEventListener('focusin',restartHeroRotation);hero.addEventListener('focusout',()=>queueMicrotask(restartHeroRotation));document.addEventListener('visibilitychange',restartHeroRotation);
 reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){photoPaused=true;reflect();}restartHeroRotation()});restartHeroRotation();
}

function exportRows(list){const b=new Blob([csvExport(list,db.sources)],{type:'text/csv;charset=utf-8;'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=isEN?`xuchang_development_policy_${list.length}_records_20261021.csv`:`许昌城市发展与政策_${list.length}条_20261021.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);toast(`已导出 ${list.length} 条，含来源链接与核验边界`);}
function setupEvents(){
 $('#openFilters').onclick=openFilters;$('#filterToggle').onclick=closeFilters;$('#closeFilterShade').onclick=closeFilters;
 $('#mapSearch').oninput=()=>{state.search=$('#mapSearch').value.trim();$('#search').value=state.search;render();};
 $('#backCity').onclick=()=>{state.region='';syncControls();lastFocusedRegion=null;render();};
 $('#shareView').onclick=copyView;
 $('#fullscreenMap').onclick=()=>{const on=document.body.classList.toggle('map-expanded');closeFilters();$('#fullscreenMap').textContent=on?'退出全屏 ×':'全屏 ⤢';$('#fullscreenMap').setAttribute('aria-label',on?'退出全屏地图':'全屏地图');renderMapOverlays();};
 setupHeroRotation();
 $('#photoCreditsButton').onclick=()=>$('#photoDialog').showModal();document.addEventListener('click',e=>{if(e.target.closest('[data-photo-credits]'))$('#photoDialog').showModal();});$('#closePhotos').onclick=()=>$('#photoDialog').close();
 window.addEventListener('resize',renderMapOverlays);
 window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeFilters();document.body.classList.remove('map-expanded');$('#fullscreenMap').textContent='全屏 ⤢';$('#fullscreenMap').setAttribute('aria-label','全屏地图');renderMapOverlays();}});
 $('#includeBroader').onchange=()=>{state.includeBroader=$('#includeBroader').checked;if(view==='overview')setView('map');render();};
 $('#sourceSearch').oninput=renderSources;

 for(const k of ['region','industry','topic','docType','stage','level','verification','startYear','endYear'])$('#'+k).addEventListener('change',()=>{state[k]=k.endsWith('Year')?Number($('#'+k).value):$('#'+k).value;if(state.startYear>state.endYear){if(k==='startYear')state.endYear=state.startYear;else state.startYear=state.endYear;syncControls();}if(view==='overview')setView('map');render();});
 $('#search').addEventListener('input',()=>{state.search=$('#search').value.trim();$('#mapSearch').value=state.search;if(view==='overview')setView('map');render();});$('#sort').onchange=render;$('#timelineMode').onchange=renderTimeline;$('#reset').onclick=reset;
 $$('.topbar .nav').forEach(b=>b.onclick=()=>goSection(b.dataset.section));$$('[data-preset]').forEach(b=>b.onclick=()=>applyPreset(b.dataset.preset));$('#method').onclick=()=>setView('sources');$('#exportAll').onclick=()=>exportRows(db.records);$('#backTop').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-detail],[data-save],[data-clear],[data-region],[data-year],[data-topic],[data-range],[data-recent],[data-view-link]');if(!b)return;if(b.dataset.detail)openDetail(b.dataset.detail);else if(b.dataset.save)toggleSave(b.dataset.save);else if(b.hasAttribute('data-clear'))reset();else if(b.dataset.topic){state={...defaults,topic:b.dataset.topic};syncControls();closeFilters();lastFocusedRegion=null;setView('map');render();}else if(b.dataset.range){const [a,z]=b.dataset.range.split(',').map(Number);state={...state,startYear:a,endYear:z};syncControls();setView('timeline');render();}else if(b.hasAttribute('data-recent')){reset();$('#sort').value='new';setView('map');render();}else if(b.dataset.viewLink){const [target,anchor]=b.dataset.viewLink.split('#');if(view==='overview'&&target==='map'){state={...defaults};syncControls();lastFocusedRegion=null;setView('map');render();}else setView(target);if(anchor){e.preventDefault();requestAnimationFrame(()=>{const el=document.getElementById(anchor);if(!el)return;el.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),2400);});}}else if(b.dataset.year){state.startYear=state.endYear=Number(b.dataset.year);syncControls();setView('timeline');render();}else if(b.dataset.region&&!moved){if(view==='overview')state={...defaults,region:b.dataset.region};else state.region=b.dataset.region;lastFocusedRegion=null;syncControls();if(view!=='map')setView('map');closeFilters();render();}});
 $('#map').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&e.target.dataset.region){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
 $('#zoomIn').onclick=()=>zoomBy(1.25);$('#zoomOut').onclick=()=>zoomBy(.8);$('#zoomReset').onclick=()=>focusRegion(state.region);
 const wrap=$('#mapWrap');wrap.addEventListener('wheel',e=>{e.preventDefault();zoomBy(e.deltaY<0?1.12:1/1.12)},{passive:false});
 wrap.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;stopCamera();drag={x:e.clientX,y:e.clientY,px:panX,py:panY};moved=false;wrap.classList.add('dragging');});
 window.addEventListener('pointermove',e=>{if(!drag)return;let dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>4)moved=true;const r=$('#map').getBoundingClientRect();const k=820/r.width;panX=Math.min(zoom*820,Math.max(-zoom*820,drag.px+dx*k));panY=Math.min(zoom*540,Math.max(-zoom*540,drag.py+dy*k));transform();});
 window.addEventListener('pointerup',()=>{drag=null;wrap.classList.remove('dragging');setTimeout(()=>moved=false,0);});
 $('#detail').addEventListener('click',e=>{if(e.target===$('#detail')){const r=$('#detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#detail').close();}});
 window.addEventListener('popstate',()=>{state={...defaults};loadUrl();syncControls();setView(view);render();});
}
try{
 const res=await Promise.all([fetch('./data.json'),fetch('./xuchang.geojson'),fetch('./editorial.json')]);if(res.some(r=>!r.ok))throw new Error('数据文件加载失败');[db,geo,editorial]=await Promise.all(res.map(r=>r.json()));if(isEN)for(const r of db.records)r.searchText=[r.searchText||'',...[r.title,r.region,r.docType,r.stage,r.verification,r.summary,...r.industries].map(tr)].join(' ');loadUrl();populate();initMap();$('#overviewContent').innerHTML=overviewHTML(db,esc,geo);$('#topicsContent').innerHTML=topicsHTML(db,esc);$('#historyContent').innerHTML=historyHTML(editorial,esc);$('#pangdonglaiContent').innerHTML=pangdonglaiHTML(editorial,esc);$('#travelContent').innerHTML=travelHTML(esc);$('#returnContent').innerHTML=returnHTML(db,esc);$('#photoCredits').innerHTML='<h2>图片与题句</h2><p>日期分别标明网页公开与拍摄时间。题句来自许昌相关古籍和诗文，古诗原咏地点与现代配图分别注明。</p>'+[...allPhotos,...editorial.extraPhotos].map(p=>`<article><h3>${esc(p.title)}</h3><a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">${esc(p.publisher||p.credit||'原文')} ↗</a><p>网页公开：${p.published||'未注明'}${p.shotDate?' · 拍摄：'+p.shotDate:''}</p>${p.credit?'<p>'+esc(p.credit)+'</p>':''}${p.license?`<p><a href="${esc(p.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.license)}</a> · ${esc(p.changes)}</p>`:''}${p.quote?`<p><a href="${esc(p.quote.url)}" target="_blank" rel="noopener noreferrer">${esc(p.quote.credit)} ↗</a></p><p>${esc(p.quote.note)}</p>`:''}</article>`).join('');setupEvents();setupSpy();renderSources();setView(view);render();focusRegion(state.region,false);
}catch(e){$('#loadError').hidden=false;$('#loadError').textContent='资料加载失败，请刷新页面重试。'+e.message;console.error(e);}
