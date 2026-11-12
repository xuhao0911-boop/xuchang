// 了解许昌：游许昌 / 回许昌 / 关于本站
// 内容都写在下面的数据里，改文字只需要改这里，不用动页面结构。
import {photoById} from './photos.js';
import {TRAVEL} from './travel-data.js';
import {RETURN} from './return-data.js';
const image=photoById;
const ext=(url,label,esc)=>url?`<a class="src" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label||'来源')} ↗</a>`:'';
const backTo=sec=>`<button class="story-back" data-view-link="overview#sec-${sec}">← 返回首页</button>`;
/* 景点、美食先显示一部分，点"展开全部"再看其余 */
document.addEventListener('click',e=>{const b=e.target.closest('[data-expand]');if(!b)return;b.closest('.story-section').classList.add('open');b.remove();});
const expand=(n,total,label)=>total>n?`<button class="expand-all" data-expand>展开全部 ${total} ${label} <span aria-hidden="true">↓</span></button>`:'';
const cover=(photoId,kicker,title,text,esc)=>{const p=image(photoId);return `<header class="story-cover"><img src="${p.file}" alt="${esc(p.title)}"><div class="story-cover-copy"><span class="section-kicker">${kicker}</span><h1>${title}</h1><p>${text}</p></div></header>`;};

/* ---------- 游许昌 ---------- */
export function travelHTML(esc){
 const t=TRAVEL;
 const spots=t.spots.map((s,i)=>`<article class="spot-card${i>=6?' is-more':''}"><div>${s.level?`<span class="chip level">${esc(s.level)}</span>`:''}<span class="chip">${esc(s.region)}</span>${(s.tags||[]).map(x=>`<span class="chip warm">${esc(x)}</span>`).join('')}</div><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p>${s.tip?`<p class="spot-tip">${esc(s.tip)}</p>`:''}${ext(s.source,s.sourceLabel,esc)}</article>`).join('');
 const regions=t.regions.map(r=>`<div class="region-block" id="travel-${esc(r.name)}"><h3>${esc(r.name)}<small>${esc(r.tagline)}</small></h3><p>${esc(r.text)}</p></div>`).join('');
 const food=t.food.map((f,i)=>`<article class="food-card${f.gi?' is-gi':''}${i>=8?' is-more':''}">${f.gi?`<span class="gi-badge">${esc(f.gi)}</span>`:''}<h3>${esc(f.name)}</h3><span class="food-place">${esc(f.place)}</span><p>${esc(f.text)}</p>${ext(f.source,f.sourceLabel,esc)}</article>`).join('');
 const stop=s=>`<li>${esc(s.name)}${s.note?`<small>${esc(s.note)}</small>`:''}</li>`;
 const legs=stops=>stops.reduce((g,s)=>{if(s.day||!g.length)g.push({day:s.day||'',items:[]});if(!s.day)g[g.length-1].items.push(s);return g;},[]);
 const routes=t.routes.map(r=>`<article class="route"><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p>${legs(r.stops).map(l=>`${l.day?`<p class="day">${esc(l.day)}</p>`:''}<ol>${l.items.map(stop).join('')}</ol>`).join('')}</article>`).join('');
 const transport=t.transport.map(x=>`<article><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>${ext(x.source,x.sourceLabel,esc)}</article>`).join('');
 const events=t.events.map(x=>`<article><time>${esc(x.when)}</time><h3>${esc(x.name)}</h3><p>${esc(x.text)}</p>${ext(x.source,x.sourceLabel,esc)}</article>`).join('');
 return `<article class="story">${backTo('travel')}${cover('baling-drum','给第一次来许昌的你','来许昌玩','三国故事、钧瓷古镇、花木之乡，还有让人专程赶来的胖东来。这一页把值得去的地方、该吃的东西和顺路的走法都放在一起。',esc)}
 <nav class="story-chapters" aria-label="游许昌章节"><a href="#travel-spots">必去景点</a><a href="#travel-regions">按区县玩</a><a href="#travel-food">吃什么买什么</a><a href="#travel-routes">推荐路线</a><a href="#travel-transport">怎么到许昌</a><a href="#travel-events">节庆活动</a></nav>
 <p class="story-intro">${esc(t.intro)}</p>
 <p class="guide-note">${esc(t.notice)}</p>
 <section class="story-section" id="travel-spots"><h2>必去景点</h2><div class="spot-grid">${spots}</div>${expand(6,t.spots.length,'个景点')}</section>
 <section class="story-section" id="travel-regions"><h2>按区县玩</h2><div class="region-blocks">${regions}</div></section>
 <section class="story-section" id="travel-food"><h2>吃什么，买什么</h2><div class="food-grid">${food}</div>${expand(8,t.food.length,'样')}</section>
 <section class="story-section" id="travel-routes"><h2>推荐路线</h2><div class="route-grid">${routes}</div></section>
 <section class="story-section" id="travel-transport"><h2>怎么到许昌</h2><div class="info-list">${transport}</div></section>
 <section class="story-section" id="travel-events"><h2>节庆活动</h2><div class="info-list">${events}</div></section>
 <div class="story-end"><span>资料核对：${esc(t.checkedAt)}</span><button data-view-link="pangdonglai">去胖东来之前先看看</button><button data-view-link="history">读许昌往事</button><button data-view-link="overview">回到首页</button></div></article>`;
}

/* ---------- 回许昌 ---------- */
const RETURN_POLICIES=['housing2030','publicservices14','education14','innovation14','renewal2026'];
const pending=s=>s?`<span class="chip warm">${esc0(s)}</span>`:'';
const esc0=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function infoCards(items,esc){return items.map(x=>`<article><h3>${esc(x.title)}${pending(x.flag)}</h3><p>${esc(x.text)}</p>${x.points?`<ul>${x.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:''}${ext(x.source,x.sourceLabel,esc)}</article>`).join('');}
export function returnHTML(db,esc){
 const t=RETURN;
 const facts=t.facts.map(f=>`<article><strong>${esc(f.value)}<small>${esc(f.unit||'')}</small></strong><h3>${esc(f.label)}</h3><p>${esc(f.note||'')}</p>${ext(f.source,f.sourceLabel,esc)}</article>`).join('');
 const talent=t.talent.map(p=>`<article class="policy-card"><header><h3>${esc(p.name)}</h3>${pending(p.flag)}</header><dl><dt>谁能申请</dt><dd>${esc(p.who)}</dd><dt>能获得什么</dt><dd>${esc(p.what)}</dd><dt>去哪里办</dt><dd>${esc(p.how)}</dd>${p.doc?`<dt>政策依据</dt><dd>${esc(p.doc)}</dd>`:''}</dl><footer>${p.date?`<span>发布 ${esc(p.date)}</span>`:''}${p.valid?`<span>${esc(p.valid)}</span>`:''}${ext(p.source,p.sourceLabel,esc)}</footer></article>`).join('');
 const industries=t.jobs.industries.map(x=>`<li><strong>${esc(x.name)}</strong>${x.text?`<span>${esc(x.text)}</span>`:''}</li>`).join('');
 const list=RETURN_POLICIES.map(id=>db.records.find(r=>r.id===id)).filter(Boolean).map(r=>`<button data-detail="${r.id}"><time>${(r.published||'').replaceAll('-','.')}</time><strong>${esc(r.title)}<small>${esc((r.summary||'').slice(0,60))}${(r.summary||'').length>60?'…':''}</small></strong><span>↗</span></button>`).join('');
 const offices=t.offices.map(o=>`<a class="office" href="${esc(o.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(o.name)} ↗</strong><span>${esc(o.text)}</span></a>`).join('');
 const phones=(t.phones||[]).map(o=>`<div class="office"><strong>${esc(o.name)}</strong><span>${esc(o.text)}</span></div>`).join('');
 return `<article class="story">${backTo('return')}${cover('city-dusk','给在外的许昌人','回许昌发展','工作、创业、落户、安家。想回来的人最关心的事，按"谁能申请、能拿什么、去哪里办"整理在这里。',esc)}
 <nav class="story-chapters" aria-label="回许昌章节"><a href="#return-why">为什么是许昌</a><a href="#return-talent">人才政策</a><a href="#return-settle">落户与住房</a><a href="#return-jobs">找工作</a><a href="#return-startup">回乡创业</a><a href="#return-life">生活配套</a><a href="#return-offices">办事入口</a></nav>
 <p class="story-intro">${esc(t.intro)}</p>
 <p class="guide-note">${esc(t.notice)}</p>
 <section class="story-section" id="return-why"><h2>为什么是许昌</h2><div class="fact-grid">${facts}</div></section>
 <section class="story-section" id="return-talent"><h2>人才政策</h2>${t.talentLead?`<p class="section-lead">${esc(t.talentLead)}</p>`:''}<div class="policy-cards">${talent}</div></section>
 <section class="story-section" id="return-settle"><h2>落户与住房</h2><div class="info-list">${infoCards(t.settle,esc)}</div></section>
 <section class="story-section" id="return-jobs"><h2>找工作</h2>${t.jobs.lead?`<p class="section-lead">${esc(t.jobs.lead)}</p>`:''}<div class="jobs-layout"><div><h3 class="sub-h">主要产业</h3><ul class="industry-list">${industries}</ul>${ext(t.jobs.industriesSource,t.jobs.industriesSourceLabel,esc)}</div><div class="info-list one-col">${infoCards(t.jobs.channels,esc)}</div></div></section>
 <section class="story-section" id="return-startup"><h2>回乡创业</h2><div class="info-list">${infoCards(t.startup,esc)}</div></section>
 <section class="story-section" id="return-life"><h2>生活配套</h2><div class="info-list">${infoCards(t.life,esc)}</div></section>
 <section class="story-section" id="return-offices"><h2>办事入口</h2><p class="section-lead">以下都是官方渠道。办事前先打电话或在线确认材料，能少跑一趟。</p><div class="office-grid">${offices}${phones}</div></section>
 <section class="story-section"><h2>相关规划与政策</h2><p class="section-lead">本站政策库里和住房、公共服务、教育相关的资料。点开可以看到摘要、原文链接和核验情况。</p><div class="policy-list">${list}</div><div class="about-actions" style="margin-top:22px"><button data-view-link="topics">按主题查看全部政策</button></div></section>
 <div class="story-end"><span>资料核对：${esc(t.checkedAt)}</span><button data-view-link="travel">先回来玩一趟</button><button data-view-link="overview">回到首页</button></div></article>`;
}

/* ---------- 关于本站 ---------- */
export function aboutHTML(db,esc){
 return `<article class="story">${backTo('about')}<div class="about-body">
 <section class="story-section" style="border-top:0"><h1 class="about-title" style="font:500 clamp(34px,4vw,52px)/1.4 var(--serif);letter-spacing:3px;margin:10px 0 26px">关于本站</h1>
 <h2>我为什么做这个网站<span class="draft-flag">草稿，待你改写</span></h2>
 <p>我是许昌人。每次跟外地朋友说起家乡，对方多半只知道"曹操"和"胖东来"。许昌其实还有很多值得说的：汉魏故都的历史、神垕的钧瓷、鄢陵的花木，还有这些年城市自己的变化。</p>
 <p>网上关于许昌的信息很散：景点在旅游网站，政策在政府网站，历史在百科里。我想把它们整理到一个地方，让第一次来许昌的人、想回许昌发展的人，都能在这里找到需要的东西。</p>
 <p>了解许昌，看这一个网站就够了。这是我的目标，也会一直慢慢补充。</p></section>
 <section class="story-section"><h2>本站是什么，不是什么</h2><ul>
 <li>这是个人整理的网站，<strong>不是许昌市政府或任何机构的官方网站</strong>。</li>
 <li>景点门票、开放时间、政策条件都可能变化，出发或办事前请以官方发布为准。</li>
 <li>每条政策资料都附有原文链接和核验状态，可以自己点开核对。</li>
 <li>发现错误或过时信息，欢迎告诉我。</li></ul></section>
 <section class="story-section"><h2>资料怎么来的</h2><p>政策与规划资料来自政府公开网站，目前收录 ${db.records.length} 条，汇编更新于 ${esc(db.snapshotDate)}。旅游信息参考文旅部门、政府网站和主要媒体的公开报道。核验规则、地图数据和全部出处都列在资料来源页。</p><div class="about-actions"><button data-view-link="sources">查看资料来源与核验规则</button><button data-photo-credits>图片来源 ↗</button></div></section>
 <section class="story-section"><h2>联系我<span class="draft-flag">待填写</span></h2><p>邮箱：（待填写）</p></section>
 </div></article>`;
}
