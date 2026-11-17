import {topicIcon,cityOutline} from './design.js';
import {photos,photoById} from './photos.js';
import {RETURN} from './return-data.js';
import {TRAVEL} from './travel-data.js';
export const topicNames=['空间布局','产业创新','城市更新','交通物流','民生服务','生态环境','历史文脉','城乡融合','营商治理'];

/* 首页：一条长页面。顶部是城市照片轮播；下面每一节各有自己的样子，点进去看子页面。 */
export function overviewHTML(db,esc,geo){
 const photo=photoById,first=photos[0];
 const more=(v,t,cls='')=>`<button class="more-link ${cls}" data-view-link="${v}">${t} <span aria-hidden="true">→</span></button>`;
 const picks=['曹魏古城','神垕古镇','鄢陵国家花木博览园'].map(n=>TRAVEL.spots.find(s=>s.name===n)).filter(Boolean);
 return `
 <!-- 顶部：城市照片轮播 + 古诗（不放按钮） -->
 <section class="photo-hero" aria-label="许昌城市影像" aria-roledescription="轮播"><img id="homePhoto" class="hero-slide is-visible" src="${first.file}" alt="${esc(first.title)}" fetchpriority="high"><img id="homePhotoNext" class="hero-slide" alt="" aria-hidden="true"><div class="photo-shade"></div>
  <div class="photo-hero-copy"><p class="hero-identity">汉魏故都 · 水韵莲城</p><h1>许昌</h1><p class="hero-deckline">了解许昌，看这一个网站就够了。</p></div>
  <figure class="hero-verse"><blockquote id="heroQuote">${esc(first.quote.text).replaceAll('，','，<br>')}</blockquote><figcaption><a id="heroQuoteSource" href="${esc(first.quote.url)}" target="_blank" rel="noopener noreferrer">${esc(first.quote.credit)}</a></figcaption></figure>
  <div class="photo-controls"><span id="photoName">${esc(first.name)}</span><span id="photoPosition">01 / ${String(photos.length).padStart(2,'0')}</span><button id="photoPause" aria-label="暂停城市图片轮播" aria-pressed="false">Ⅱ</button></div>
 </section>

 <div class="home2">
 <!-- 游许昌：夜景铺满，文字压在照片上；下面三个代表景点 -->
 <section class="home-sec sec-travel" id="sec-travel" data-section="travel">
  <div class="tv-band">
   <img class="tv-bg" src="${photo('baling-drum').file}" alt="${esc(photo('baling-drum').title)}" loading="lazy"><div class="tv-shade"></div>
   <div class="tv-copy"><p class="sec-kicker light">景点 · 美食 · 路线</p><h2>游许昌</h2><p>三国故事、钧瓷古镇、花木之乡，还有让人专程赶来的胖东来。第一次来，看这一页就够。</p>
    <div class="tv-chips">${[['travel#travel-spots','必去景点'],['travel#travel-regions','按区县玩'],['travel#travel-food','吃什么，买什么'],['travel#travel-routes','推荐路线']].map(([v,t])=>`<button data-view-link="${v}">${t}</button>`).join('')}</div>
    ${more('travel','查看完整攻略','light')}</div>
  </div>
  <div class="tv-picks">${picks.map((s,i)=>`<button class="tv-pick" data-view-link="travel#travel-spots"><span class="tv-no">0${i+1}</span><span class="tv-meta">${s.level?`<em>${esc(s.level)}</em>`:''}${esc(s.region)}</span><strong>${esc(s.name)}</strong><span class="tv-text">${esc(s.text)}</span></button>`).join('')}</div>
 </section>

 <!-- 回许昌：浅天青底，关键数字做主角，四个入口带编号 -->
 <section class="home-sec sec-return" id="sec-return" data-section="return">
  <div class="rt-panel">
   <div class="rt-head"><div><p class="sec-kicker">工作 · 创业 · 安家</p><h2>回许昌</h2></div><p>给在外的许昌人：有什么支持、去哪里找工作、怎么落户安家、找谁办事，按"谁能申请、能拿什么、去哪里办"整理。</p></div>
   <div class="rt-facts">${RETURN.facts.map(f=>`<div><strong>${esc(f.value)}<small>${esc(f.unit||'')}</small></strong><span>${esc(f.label)}</span></div>`).join('')}</div>
   <div class="rt-links">${[['return#return-talent','人才政策','青年人才认定、人才公寓、补贴'],['return#return-settle','落户与住房','落户、公积金、保障性租赁住房'],['return#return-jobs','找工作','主要产业、招聘渠道'],['return#return-startup','回乡创业','担保贷款、创业补贴']].map(([v,t,s],i)=>`<button data-view-link="${v}"><span class="rt-no">0${i+1}</span><strong>${t}</strong><span>${s}</span><i aria-hidden="true">→</i></button>`).join('')}</div>
   ${more('return','查看全部')}
  </div>
 </section>

 <!-- 读许昌：杂志排版，一大一小两篇专题，配竖排诗句 -->
 <section class="home-sec sec-read" id="sec-read" data-section="read">
  <div class="rd-head"><span class="rd-mark" aria-hidden="true">读</span><div><p class="sec-kicker">历史 · 人物 · 城市故事</p><h2>读许昌</h2></div></div>
  <div class="rd-grid">
   <button class="rd-main" data-view-link="history"><span class="rd-img"><img src="${photo('yinma-river').file}" alt="" loading="lazy"><span class="rd-poem" aria-hidden="true"><span>西湖春色归</span><span>春水绿于染</span></span></span><span class="rd-no">壹</span><strong>许昌往事</strong><span class="rd-line">从许都、许州到颍昌，宋人诗里的西湖，和今天的城。</span><span class="more-link">阅读 <span aria-hidden="true">→</span></span></button>
   <button class="rd-side" data-view-link="pangdonglai"><span class="rd-img"><img src="${photo('pangdonglai').file}" alt="" loading="lazy"></span><span class="rd-no">贰</span><strong>胖东来</strong><span class="rd-quote">一家商店，<br>与一座城市。</span><span class="more-link">阅读 <span aria-hidden="true">→</span></span></button>
  </div>
 </section>

 <!-- 城市发展：一个画面 + 一个进入按钮 -->
 <section class="home-sec sec-dev" id="sec-develop" data-section="develop">
  <div class="dv-card">
   <div class="dv-copy"><p class="sec-kicker">规划 · 产业 · 政策</p><h2>城市发展</h2>
    <p>许昌在规划什么、发展什么。政策与规划资料按发展主线整理，可以在地图和时间轴上查，每条都附原文链接。</p>
    <div class="dv-stats"><div><strong>${db.records.length}</strong><span>条政策与规划</span></div><div><strong>${db.topics.length}</strong><span>条发展主线</span></div><div><strong>${db.coverageStart}<small>—</small>${db.coverageEnd}</strong><span>资料涉及年份</span></div></div>
    <button class="dv-enter" data-view-link="topics"><span>进入城市发展<i aria-hidden="true">→</i></span></button></div>
   <button class="dv-visual" data-view-link="topics" aria-label="进入城市发展">${cityOutline(geo,esc)}</button>
  </div>
 </section>

 <!-- 联系作者：标题 + 邮箱 -->
 <section class="home-sec sec-contact" id="sec-contact" data-section="contact">
  <h2>联系作者</h2>
  <a class="contact-mail" href="mailto:xuhao0911@gmail.com">xuhao0911@gmail.com</a>
 </section>
 </div>`;
}
export function topicsHTML(db,esc){return `<div class="topics-heading"><button class="story-back" data-view-link="overview#sec-develop">← 返回首页</button><h1>城市发展</h1><p class="topics-lead">许昌在规划什么、发展什么。按九条主线整理了 ${db.records.length} 条政策与规划资料，也可以在地图或时间轴上查。</p><div class="dev-tabs"><button data-view-link="map">政策地图 ↗</button><button data-view-link="timeline">时间轴 ↗</button><button data-view-link="sources">资料来源 ↗</button></div></div><div class="theme-grid">${db.topics.map((t,i)=>`<article class="theme-card"><div class="theme-number"><span class="topic-icon">${topicIcon(i)}</span><span class="topic-index">${db.records.filter(r=>r.topics.includes(t.id)).length} 条资料</span></div><h3>${topicNames[i]}</h3><p class="theme-intro">${esc(t.question)}</p><details class="theme-reading"><summary>阅读路线 <i>+</i></summary><div class="reading-steps">${t.steps.map(s=>`<button data-detail="${s.record}"><span>${esc(s.label)}</span><p>${esc(s.text)}</p><i>↗</i></button>`).join('')}</div></details><button class="theme-explore" data-topic="${esc(t.id)}">查看政策 <span>↗</span></button></article>`).join('')}</div>`;}
