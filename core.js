export const filterRecords=(records,state,saved=new Set())=>records.filter(r=>
 (!state.region||r.region===state.region||(state.includeBroader&&['许昌全市','河南全省'].includes(r.region)))&&
 (!state.industry||r.industries.includes(state.industry))&&
 (!state.topic||(r.topics||[]).includes(state.topic))&&
 (!state.docType||r.docType===state.docType)&&
 (!state.stage||r.stage===state.stage)&&
 (!state.level||r.level===state.level)&&
 (!state.verification||r.verification===state.verification)&&
 (!state.medical||r.medical)&&
 (!state.savedOnly||saved.has(r.id))&&
 (r.start<=state.endYear&&r.end>=state.startYear)&&
 (!state.search||(r.searchText||[r.title,r.region,...r.industries,r.summary,r.stage,r.verification].join(' ')).toLowerCase().includes(state.search.toLowerCase()))
);
export const sortRecords=(rows,sort)=>[...rows].sort((a,b)=>sort==='new'?(b.published||'').localeCompare(a.published||''):sort==='old'?(a.published||'').localeCompare(b.published||''):a.priority-b.priority||a.id.localeCompare(b.id));
export function csvExport(rows,sources){
 const headers=['ID','条目','地区','主题','产业','资料类型','阶段（来源当时）','层级','核验状态','政策清理提示','最新来源发布日期','适用起年','适用止年','时间口径','事实摘要','核验边界','阅读提示','研究推演／后续核查','定位说明','来源标题｜发布日期｜链接'];
 const clean=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"';
 return '\uFEFF'+[headers,...rows.map(r=>[r.id,r.title,r.region,(r.topics||[]).join('；'),r.industries.join('；'),r.docType,r.stage,r.level,r.verification,r.lifecycle,r.published,r.start,r.end,r.timeBasis,r.summary,r.caveat,r.reading,r.opportunity,r.locationNote,r.sources.map(id=>`${sources[id].title}｜${sources[id].published||'日期待核验'}｜${sources[id].url}`).join('\n')])].map(row=>row.map(clean).join(',')).join('\r\n');
}
