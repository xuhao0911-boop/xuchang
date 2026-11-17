/* 中英双语。
   站点内容和筛选值（地区、类型、阶段、核验状态等）一律保留中文，它们同时是筛选用的键；
   英文界面只在“显示”这一步把中文换成 i18n/en.json 里对应的英文。
   - 语言：?lang=en|zh  →  上次选择（localStorage）  →  浏览器语言（中文浏览器默认中文，其他默认英文）
   - 改英文文案：只改 i18n/en.json（键是中文原文，值是英文），不用动别处。
   - 页面里没有对应翻译的中文会原样显示，便于发现漏译。 */
const KEY='xc-lang',CJK=/[一-鿿]/;
function detect(){
 try{const q=new URLSearchParams(location.search).get('lang');if(q==='en'||q==='zh'){try{localStorage.setItem(KEY,q)}catch{}return q;}}catch{}
 try{const s=localStorage.getItem(KEY);if(s==='en'||s==='zh')return s;}catch{}
 const l=(navigator.languages&&navigator.languages[0])||navigator.language||'zh-CN';
 return /^zh/i.test(l)?'zh':'en';
}
export const lang=detect(),isEN=lang==='en';
document.documentElement.lang=isEN?'en':'zh-CN';
let dict={};
if(isEN){try{const r=await fetch('./i18n/en.json');if(r.ok)dict=await r.json();}catch(e){console.warn('English dictionary failed to load',e);}}

/* 中文标点 → 英文标点 */
const PUNCT={'，':', ','。':'. ','：':': ','；':'; ','、':', ','（':' (','）':') ','“':'"','”':'"','‘':"'",'’':"'",'？':'? ','！':'! ','《':'"','》':'"','—':'–'};
/* 组合出来的句子（数字夹在中文片段中间）：按规则翻译，优先于逐词替换 */
const RULES=[
 [/^(\d{4})—(\d{4}) 政策与发展时间轴$/,(m,a,b)=>`Policy & development timeline, ${a}–${b}`],
 [/^(\d+) 条出处$/,(m,n)=>`${n} source${n==='1'?'':'s'}`],
 [/^已导出 (\d+) 条，含来源链接与核验边界$/,(m,n)=>`Exported ${n} records, with source links and verification limits`],
 [/^(.+)，(\d{4})至(\d{4})年，(.+)$/,(m,a,b,c,d)=>`${tr(a)}, ${b}–${c}, ${tr(d)}`],
 [/^(.+)，来源发布于(\d{4}-\d{2}-\d{2})$/,(m,a,b)=>`${tr(a)}, source published ${b}`],
 [/^查看视窗外的背景出处（(\d+)条引用）$/,(m,n)=>`View background sources outside the window (${n} references)`],
 [/^取消关注(.+)$/,(m,a)=>`Unfollow ${tr(a)}`],
 [/^关注(.+)$/,(m,a)=>`Follow ${tr(a)}`],
 [/^进入(.+)$/,(m,a)=>`Open ${tr(a)}`],
 [/^(.+)，进入网站看介绍$/,(m,a)=>`${tr(a)}, enter the site to read the introduction`],
 [/^(.+)章节$/,(m,a)=>`${tr(a)} chapters`],
 [/^展开全部 (\d+) (个景点|样)$/,(m,n,u)=>`Show all ${n} ${u==='样'?'items':'attractions'}`],
 [/^(.+?)，(\d{4}-\d{2}-\d{2}|未标注发布日期)，(.+)$/,(m,a,d,b)=>`${tr(a)}, ${/^\d/.test(d)?'published '+d:'publication date not stated'}, ${tr(b)}`],
 [/^(.+) · (未标注网页发布日期|\d{4}-\d{2}-\d{2}) · 核对：(\d{4}-\d{2}-\d{2})$/,(m,a,d,c)=>`${tr(a)} · ${/^\d/.test(d)?'Published '+d:'Web publication date not stated'} · Checked: ${c}`],
 [/^网页公开：(未注明|\d{4}-\d{2}-\d{2}) · 拍摄：(未注明|\d{4}-\d{2}-\d{2})$/,(m,a,b)=>`Published online: ${a==='未注明'?'not stated':a} · Photographed: ${b==='未注明'?'not stated':b}`]
];
let big=null;
function bigRe(){
 if(big)return big;
 const keys=Object.keys(dict).filter(k=>k.length>=2).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 return big=keys.length?new RegExp(keys.join('|'),'g'):/$^/;
}
const cache=new Map();
function lookup(s){
 const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s),lead=m[1],core=m[2],trail=m[3];
 if(!core)return s;
 let v=dict[core]??dict[core.replace(/\s+/g,' ')];
 if(v!==undefined)return lead+v+trail;
 for(const [re,fn] of RULES){const r=re.exec(core);if(r)return lead+fn(...r)+trail;}
 let out=core.replace(bigRe(),(k,off)=>{
  let r=dict[k];const b=core[off-1],a=core[off+k.length];
  if(b&&/[A-Za-z0-9)%]/.test(b))r=' '+r;
  if(a&&/[A-Za-z0-9(]/.test(a))r=r+' ';
  return r;
 });
 out=out.replace(/[，。：；、（）“”‘’？！《》—]/g,c=>PUNCT[c]).replace(/ {2,}/g,' ').replace(/ ([,.;:)])/g,'$1').replace(/\( /g,'(').trim();
 return lead+out+trail;
}
export function tr(s){
 if(!isEN||typeof s!=='string'||!CJK.test(s))return s;
 let r=cache.get(s);if(r===undefined){r=lookup(s);cache.set(s,r);}
 return r;
}
export const t=tr;
/* 选择式：L('中文','English')，用于代码里直接拼出来的句子 */
export const L=(zh,en)=>isEN?en:zh;

const ATTRS=['aria-label','title','placeholder','alt','aria-roledescription'];
const SKIP=new Set(['SCRIPT','STYLE','NOSCRIPT']);
/* 带 data-i18n-skip 的区域（如中英双语的欢迎屏）原样保留，不翻译 */
const skipped=n=>{const e=n.nodeType===1?n:n.parentElement;return !!(e&&e.closest&&e.closest('[data-i18n-skip]'));};
function tText(n){const v=n.nodeValue;if(v&&CJK.test(v)&&!skipped(n)){const r=tr(v);if(r!==v)n.nodeValue=r;}}
function tAttrs(el){
 if(skipped(el))return;
 for(const a of ATTRS){const v=el.getAttribute&&el.getAttribute(a);if(v&&CJK.test(v)){const r=tr(v);if(r!==v)el.setAttribute(a,r);}}
}
export function translateTree(root){
 if(!isEN||!root)return;
 if(root.nodeType===3){tText(root);return;}
 if(root.nodeType!==1&&root.nodeType!==11)return;
 if(root.nodeType===1){if(SKIP.has(root.tagName))return;tAttrs(root);}
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode:n=>n.nodeType===1&&(SKIP.has(n.tagName)||n.hasAttribute('data-i18n-skip'))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 let n;while((n=w.nextNode())){if(n.nodeType===3)tText(n);else tAttrs(n);}
}
function metaAndTitle(){
 document.title=tr(document.title);
 const d=document.querySelector('meta[name="description"]');if(d)d.content=tr(d.content);
}
if(isEN){
 metaAndTitle();
 const start=()=>{
  translateTree(document.body);
  new MutationObserver(ms=>{
   for(const m of ms){
    if(m.type==='childList')m.addedNodes.forEach(translateTree);
    else if(m.type==='characterData')tText(m.target);
    else if(m.type==='attributes')tAttrs(m.target);
   }
  }).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTRS});
 };
 if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
}
/* 语言切换按钮 */
function wireToggle(){
 const b=document.getElementById('langToggle');if(!b)return;
 b.textContent=isEN?'中文':'EN';
 b.setAttribute('aria-label',isEN?'切换到中文':'Switch to English');
 b.setAttribute('lang',isEN?'zh-CN':'en');
 b.onclick=()=>{
  try{localStorage.setItem(KEY,isEN?'zh':'en');}catch{}
  /* 记下当前滚动位置（按比例，中英文页面高度不同），新语言加载后回到同一处 */
  try{const max=document.documentElement.scrollHeight-innerHeight;
   sessionStorage.setItem('xc-pos',JSON.stringify({r:max>0?scrollY/max:0,k:location.search.replace(/[?&]lang=(en|zh)/,'')+location.hash}));}catch{}
  const u=new URL(location.href);u.searchParams.set('lang',isEN?'zh':'en');location.replace(u);
 };
}
/* 语言切换后恢复滚动位置；由 app.js 在首次渲染完成后调用 */
export function restoreScroll(){
 let p=null;
 try{p=JSON.parse(sessionStorage.getItem('xc-pos')||'null');sessionStorage.removeItem('xc-pos');}catch{}
 if(!p||p.k!==(location.search.replace(/[?&]lang=(en|zh)/,'')+location.hash))return;
 const go=()=>{const max=document.documentElement.scrollHeight-innerHeight;if(max>0)scrollTo({top:Math.round(p.r*max),behavior:'instant'});};
 go();setTimeout(go,250);setTimeout(go,900);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wireToggle);else wireToggle();
