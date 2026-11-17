/* 匿名访问统计（GoatCounter，无 cookie、不记个人信息，页面上看不到任何东西）。
   网站是单页应用，切换界面时网址不会真的换页，所以每次进入一个界面手动记一笔。
   本地（localhost）打开时 GoatCounter 自己会忽略，不会污染数据。 */
import {lang} from './i18n.js';
let last=null,langSent=false;
export function track(view){
 if(!view||view===last)return;
 last=view;
 const go=()=>{
  const gc=window.goatcounter;
  if(!gc||typeof gc.count!=='function')return false;
  gc.count({path:'/'+view,title:view});
  if(!langSent){langSent=true;gc.count({path:'lang-'+lang,title:'language: '+lang,event:true});}
  return true;
 };
 if(go())return;
 /* 统计脚本是 async 加载的，可能比应用晚到：等一等再试几次 */
 let n=0;const t=setInterval(()=>{if(go()||++n>20)clearInterval(t);},300);
}
