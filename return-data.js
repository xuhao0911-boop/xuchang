// 回许昌页面的全部内容。改文字、补政策，只改这个文件即可。
// 原则：金额、条件只写能在官方原文里核到的；查不到就写"以官方为准"，不要估。
const RSJ='许昌市人社局';
const GUIDE='https://rsj.xuchang.gov.cn/ywzl/015010/015010003/20260731/241869db-ffdb-43e1-b34c-e910b9569b89.html';
const REPORT='https://xuchang.gov.cn/ywdt/001001/20260212/2b156f5d-404a-43c8-9b99-eeb8a2392ffd.html';
export const RETURN={
 checkedAt:'2026-11-11',
 intro:'离郑州不远，制造业有底子，家也在这里。这一页把回许昌最常问的几件事放在一起：有什么支持、去哪里找工作、怎么落户安家、找谁办事。',
 notice:'政策会调整，金额和条件以官方原文为准。人才补贴、购房补贴的单人标准目前查不到在线的现行原文，本页没有写具体数字，请直接咨询市人社局。',
 facts:[
  {value:'80',unit:'公里',label:'到郑州',note:'距新郑国际机场约 50 公里。',source:'https://www.xuchang.gov.cn/zjxc/005001/005001001/20200519/f9b65542-f1b4-4552-bef9-f755f9e09909.html',sourceLabel:'许昌市政府网'},
  {value:'10',unit:'元',label:'郑许市域铁路全程最高票价',note:'2023 年 12 月起运营，许昌东站直达郑州航空港区。',source:'https://www.henan.gov.cn/2024/01-02/2877711.html',sourceLabel:'河南省政府网'},
  {value:'80',unit:'万元',label:'公积金个人贷款最高额度',note:'2025 年 11 月起执行；多子女家庭、引进的高层次人才可上浮 20%。',source:'https://zfgjj.xuchang.gov.cn/sjtj/20260330/b86babda-4cd7-4f9d-89c2-178f56197b6f.html',sourceLabel:'许昌住房公积金中心'},
  {value:'5000',unit:'元',label:'一次性创业补贴',note:'离校 2 年内的高校毕业生等首次创业、正常经营满 1 年可申请。',source:GUIDE,sourceLabel:RSJ}
 ],
 talentLead:'许昌的人才支持以"许昌英才计划"为框架：先做人才分类认定，认定后才能申请人才公寓等支持。刚毕业的年轻人，对应的一般是 F 类"青年潜力人才"。',
 talent:[
  {name:'青年潜力人才认定（F 类）',who:'在许昌就业创业的全日制本科及以上毕业生（或省预备技师班及以上），一般 35 岁以下、毕业 3 年内，在许昌参保满 6 个月。',what:'取得认定后，可按规定申请人才公寓、人才补贴等市级支持。',how:'先向用人单位提出，单位初审后报市民之家 3 楼 322 窗口（0374-2628875）；县区另有受理窗口。',doc:'许人才委〔2022〕4 号、许人社办〔2022〕26 号',date:'2022-10-28',valid:'2026 年政府工作报告仍提出深入实施',source:'https://rsj.xuchang.gov.cn/zxdt/002002/20221028/e9189286-5781-4da8-8745-6128ebb43b72.html',sourceLabel:RSJ},
  {name:'人才公寓',who:'经"许昌英才计划"认定、在中心城区工作的人才；本人、配偶及未成年子女在中心城区没有自有住房，也没有承租保障房。',what:'租住人才公寓。第二批房源租金约每平方米每月 8.82–15.4 元，另收物业费；可按规定享受租房补贴。',how:'填写《许昌市人才公寓入住申请表》，单位初审后报市人社局，常态化受理。',date:'2025-06-24',valid:'2025 年受理 44 人入住',source:'https://rsj.xuchang.gov.cn/zxdt/002002/20250624/ba6d5433-07f5-4e8d-8896-e56a59e500a5.html',sourceLabel:RSJ},
  {name:'人才补贴与生活津贴',flag:'单人标准请咨询',who:'经认定的高层次人才、省派博士、博士后和青年潜力人才。',what:'市级发放人才补贴、生活津贴、租房补贴等。2025 年全市共发放 101.62 万元。具体到个人能拿多少，以市人社局现行标准为准。',how:'市民之家 3 楼 322 窗口（0374-2628875），或通过用人单位申报。',date:'2025-11-04',source:'https://www.xuchang.gov.cn/ywdt/001005/20251104/9022c6b1-23ee-421f-9247-fdbd9851a679.html',sourceLabel:'许昌市政府网'}
 ],
 settle:[
  {title:'落户',text:'许昌已全面放宽城镇落户限制：农业转移人口自愿到城镇落户，可以"零门槛"在居住地社区登记落户；居住证可以全程网上办理。',points:['毕业生户口迁移的具体手续，以就业地派出所的答复为准。'],source:'https://sfgw.xuchang.gov.cn/ztzl/079004/20241015/eff4c589-4c90-4028-8b10-ae01f28cbf47.html',sourceLabel:'许昌市发改委'},
  {title:'住房公积金',text:'2025 年许昌公积金政策有几项对回乡的人很实用：',points:['个人住房贷款最高 80 万元（2025-11-28 起）','多子女家庭、引进的高层次人才额度可上浮 20%','2025-12-31 起，买房、还贷提取公积金不再限户籍','支持租房提取公积金'],source:'https://zfgjj.xuchang.gov.cn/sjtj/20260330/b86babda-4cd7-4f9d-89c2-178f56197b6f.html',sourceLabel:'许昌住房公积金中心'},
  {title:'保障性租赁住房',text:'面向新市民、青年人，不限户籍：',points:['在中心城区没有不动产，家庭人均住房面积 20 平方米以下','租金不高于同区域同类房源市场租金的 90%','租期原则上不超过 3 年，线上申请','试行办法 2025 年 9 月印发，有效期 2 年'],source:'https://xuchang.gov.cn/xcjczwgkly/030005/030005002/030005002002/20251103/320a694d-864a-4b46-a19c-153f6e070b8e.html',sourceLabel:'许昌市住建局'}
 ],
 jobs:{
  lead:'许昌是制造业城市。电力装备、节能环保、超硬材料是招牌，节能环保、超硬材料、硅碳新材料都进了国家级产业集群名单。',
  industries:[
   {name:'智能电力装备',text:'许继电气、森源等，有许继电气装备产业园'},
   {name:'节能环保',text:'国家战略性新兴产业集群'},
   {name:'新材料（超硬材料、硅碳）',text:'黄河旋风等，有黄河旋风超硬材料产业园'},
   {name:'新能源汽车及智能配套',text:''},
   {name:'生物医药与健康、新一代信息技术',text:'有豫沪人工智能产业园'},
   {name:'传统产业',text:'食品、发制品及轻纺、建材'},
   {name:'正在布局的未来产业',text:'具身智能、低空经济、氢能与新型储能'}
  ],
  industriesSource:REPORT,industriesSourceLabel:'2026 年许昌市政府工作报告',
  channels:[
   {title:'线上找岗位',text:'官方渠道发布的岗位更可靠：',points:['微信小程序"豫见就业""许昌公共就业"','河南就业网上办事大厅','中原人才网'],source:GUIDE,sourceLabel:RSJ},
   {title:'招聘会',text:'市人社局官网的"人社动态"栏目会发布招聘会通知，比如 2026 年 4 月在许昌学院举办的春季双选会，以及各区的"人才夜市"。',source:'https://rsj.xuchang.gov.cn',sourceLabel:'许昌市人社局官网'},
   {title:'回乡前先打个电话',text:'就业、社保、人才政策都可以打 0374-12333 咨询。',source:'https://rsj.xuchang.gov.cn',sourceLabel:RSJ}
  ]
 },
 startup:[
  {title:'创业担保贷款',text:'个人创业可申请：',points:['贴息贷款最高 30 万元，财政按实际利率的 50% 贴息','非贴息贷款最高 50 万元','需有营业执照和经营场地并正常经营，本人及配偶征信良好，并提供担保','咨询：0374-2620256、2625268'],source:GUIDE,sourceLabel:RSJ},
  {title:'一次性创业补贴',text:'5000 元，面向离校 2 年内的高校毕业生、就业困难人员、退役军人、返乡入乡农民工，要求首次创业且正常经营满 1 年。',points:['个体经营另有税费减免：每户每年 24000 元限额，执行到 2027-12-31','通过"豫见就业"小程序或河南就业网上办事大厅申请'],source:GUIDE,sourceLabel:RSJ},
  {title:'返乡创业',text:'返乡、下乡创业另有一套支持：',points:['毕业 5 年内返乡创办企业的大学生，每新招用 1 人补贴 1000 元','创业培训补贴：GYB 200 元、SYB 1000 元、IYB 1500 元','到所在县（市、区）的返乡创业综合服务机构办理'],source:'https://rsj.xuchang.gov.cn/ywzl/015002/015002004/20260716/4eec579f-690c-4dd9-a4a2-931bbf27f559.html',sourceLabel:RSJ}
 ],
 life:[
  {title:'孩子上学',text:'非主城区户籍的孩子到城区上学，监护人需要有效的主城区居住证，再按情况提供材料：',points:['买房的：产权证或网签合同','务工的：劳动合同和社保记录','经商的：营业执照','以上为示范区公布的要求，各区以当地教育部门为准'],source:'https://shifanqu.xuchang.gov.cn/xxyw/010001/20251202/568194ea-df46-4ffc-90ca-670d96a8762f.html',sourceLabel:'许昌示范区'},
  {title:'看病',text:'许昌市中心医院是三级甲等综合医院。其他医院的等级，以卫健部门公布为准。',source:'https://xuchang.gov.cn/uploadfile/2a10a826-1a12-417c-858f-92b38576afc9/2024%E5%B9%B4%E5%BA%A6%E8%AE%B8%E6%98%8C%E5%B8%82%E4%B8%AD%E5%BF%83%E5%8C%BB%E9%99%A2%E5%8D%95%E4%BD%8D%E5%86%B3%E7%AE%97.doc',sourceLabel:'许昌市中心医院决算'},
  {title:'往返郑州',text:'在许昌住、去郑州办事都方便：',points:['郑许市域铁路：许昌东站到郑州航空港区长安路北站，全程最高 10 元','高铁：许昌东站有车次直达郑州东站，时刻以 12306 为准'],source:'https://www.henan.gov.cn/2024/01-02/2877711.html',sourceLabel:'河南省政府网'}
 ],
 offices:[
  {name:'许昌市人社局',text:'人才政策、招聘会、社保就业资讯',url:'https://rsj.xuchang.gov.cn'},
  {name:'河南政务服务网 · 许昌人社',text:'人社业务网上办理',url:'https://www.hnzwfw.gov.cn/portal/department/001003020002012?region=411000000000&creditCode=11411000005747787F'},
  {name:'河南就业网上办事大厅',text:'创业补贴、就业登记等',url:'http://hnjy.hrss.henan.gov.cn/jyweb/#/index'},
  {name:'我的人社（河南）',text:'社保查询与办理',url:'https://siwsfw.hrss.henan.gov.cn/portal/#/home'},
  {name:'许昌住房公积金中心',text:'公积金贷款、提取、转移',url:'https://zfgjj.xuchang.gov.cn'},
  {name:'许昌政策问答平台',text:'按问题查市级政策解答',url:'https://www.xuchang.gov.cn/zcwdpt/039009/zcwdindex.html'}
 ],
 phones:[
  {name:'0374-12333',text:'人社咨询热线：就业、社保、人才政策'},
  {name:'0374-2628875',text:'人才认定窗口：市民之家 3 楼 322 窗口'},
  {name:'0374-2620256 / 2625268',text:'创业担保贷款咨询'}
 ]
};
