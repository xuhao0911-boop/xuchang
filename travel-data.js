// 游许昌页面的全部内容。改文字、加景点，只改这个文件即可。
// level：只写有官方出处的 A 级；不确定就留空。source：出处链接。
const GOV='许昌市政府网';
export const TRAVEL={
 checkedAt:'2026-11-11',
 intro:'许昌不大，市区的三国景点走路、打车都很方便；想看钧瓷去禹州，想看花去鄢陵，从市区出发都是当天往返的距离。',
 notice:'门票、开放时间和活动安排会变化，出发前请以景区或官方发布为准。A 级等级只标注了能在官方页面查到的。',
 spots:[
  {name:'曹魏古城',region:'魏都区',tags:['夜游'],text:'围绕 5.3 公里护城河的古城核心区，三国主题街区，晚上的灯光和夜游最有氛围。',source:'https://www.xuchang.gov.cn/zjxc/005004/20190614/a3178169-84f7-4449-858c-d9f040b71121.html',sourceLabel:GOV},
  {name:'春秋楼 · 文庙',region:'魏都区',level:'4A',tags:['三国'],text:'传说关羽"秉烛夜读"的地方，就在市中心，文庙与关公庙相邻。',source:'https://xuchang.gov.cn/zjxc/005010/20251203/c482a700-a7e7-422b-a224-879f656cc320.html',sourceLabel:GOV},
  {name:'灞陵桥景区',region:'魏都区',level:'4A',tags:['三国'],text:'关羽"挑袍辞曹"故事发生地。景区内的许昌关帝庙是全国重点文物保护单位。',source:'https://www.xuchang.gov.cn/zjxc/005004/20190614/4c92f242-ee02-4720-97b3-e0e87347b6ee.html',sourceLabel:GOV},
  {name:'曹丞相府',region:'魏都区',level:'3A',tags:['三国'],text:'以曹操为主题的仿古院落，集中展示曹魏历史与文化，和曹魏古城可以连着逛。',source:'https://xuchang.gov.cn/zjxc/005010/20251216/4c86d559-4943-420d-896f-b58f2c598d21.html',sourceLabel:GOV},
  {name:'许昌市博物馆',region:'市区',tags:['室内'],text:'全市规模最大的综合性博物馆，想快速了解许昌的历史，先来这里。',tip:'一般周一闭馆，以博物馆公告为准。',source:'https://xuchang.gov.cn/zjxc/005010/20260325/dfa0b4df-57ba-454e-bb88-cdc3dd046919.html',sourceLabel:GOV},
  {name:'汉魏许都故城遗址',region:'建安区',tags:['遗址'],text:'东汉末年汉献帝迁都于许的故城遗址，遗存有毓秀台。适合对历史有兴趣、想看"真遗址"的人。',source:'https://xuchang.gov.cn/zjxc/005010/20260325/dfa0b4df-57ba-454e-bb88-cdc3dd046919.html',sourceLabel:GOV},
  {name:'胖东来',region:'市区',tags:['购物'],text:'不是景区，却是很多人专程来许昌的理由。天使城、时代广场、生活广场都在市区。',tip:'节假日人非常多，2026 年国庆期间接待近 400 万人次，错峰更舒服。',source:'https://www.xuchang.gov.cn/zjxc/005010/20261010/1f6f1ae7-8394-44dc-bd61-e45a5cd75921.html',sourceLabel:GOV},
  {name:'神垕古镇',region:'禹州市',level:'4A',tags:['钧瓷'],text:'钧瓷的发源地，老街两旁都是窑口和瓷器作坊，能看到钧瓷从泥到瓷的过程。',tip:'老街免费、无需预约；另有可选的体验通票（2026 年 10 月官方信息）。',source:'https://www.xuchang.gov.cn/zjxc/005010/20261031/421ed412-8986-491b-a600-10913ba95d3f.html',sourceLabel:GOV},
  {name:'钧官窑址博物馆',region:'禹州市',level:'4A',tags:['钧瓷','室内'],text:'建在宋代钧官窑遗址上的钧瓷专题博物馆，去神垕之前先来这里，看懂得多。',source:'http://www.yuzhou.gov.cn/yzgk/002005/20171114/e5e107a1-8876-4b58-8621-83a30b3dba1e.html',sourceLabel:'禹州市政府网'},
  {name:'大鸿寨',region:'禹州市',level:'4A',tags:['爬山','秋季'],text:'主峰卧佛山海拔 1156 米，是许昌最高峰。秋天看红叶，冬天有滑雪。',source:'https://www.xuchang.gov.cn/zjxc/005004/20190614/97ffce0d-0a32-4eb8-89f1-5390000eb97b.html',sourceLabel:GOV},
  {name:'鄢陵国家花木博览园',region:'鄢陵县',level:'4A',tags:['赏花'],text:'园内植物两千八百多种，有百年紫薇园；春天看牡丹，冬天看蜡梅。',tip:'开放状态有过变化，出发前请先确认。',source:'https://www.xuchang.gov.cn/zjxc/005004/20170807/e00b1b4c-578c-43fb-bd4a-1dcbb4dab012.html',sourceLabel:GOV},
  {name:'鹤鸣湖 · 花都温泉',region:'鄢陵县',tags:['温泉','冬季'],text:'鹤鸣湖是国家水利风景区，附近有花都温泉。冬天泡温泉配蜡梅，是鄢陵的经典组合。',source:'https://xuchang.gov.cn/zjxc/005010/20260325/dfa0b4df-57ba-454e-bb88-cdc3dd046919.html',sourceLabel:GOV},
  {name:'首山景区（乾明寺）',region:'襄城县',level:'4A',tags:['爬山'],text:'相传黄帝在此采铜铸鼎，山上的乾明寺保存有明代照壁。',source:'https://xuchang.gov.cn/zjxc/005010/20251203/c482a700-a7e7-422b-a224-879f656cc320.html',sourceLabel:GOV},
  {name:'紫云山',region:'襄城县',tags:['森林'],text:'以森林和山地风光为主，有老子在此著经的传说，适合安静地走一走。',source:'https://www.xuchang.gov.cn/zjxc/005004/20110421/f61420cb-6fdd-4692-9d30-0337abfd306d.html',sourceLabel:GOV}
 ],
 regions:[
  {name:'魏都区',tagline:'三国故事的主场',text:'老城区所在地。春秋楼、曹丞相府、灞陵桥、曹魏古城都在这里，市区一日游基本不用出魏都。'},
  {name:'建安区',tagline:'许都故地',text:'汉魏许都故城遗址在建安区张潘镇。想尝本地味道，可以试试丈地羊肉汤。'},
  {name:'禹州市',tagline:'钧瓷与药材',text:'神垕古镇、钧官窑址博物馆讲透钧瓷；禹州也是中药材集散地；大鸿寨是全市最高峰。吃的有禹州十三碗、顺店杂炣。'},
  {name:'长葛市',tagline:'春天的樱花',text:'葛天园的樱花出现在官方春季赏花线路里。长葛的蜂胶、孟排大葱都是地理标志产品。'},
  {name:'鄢陵县',tagline:'花木之乡',text:'花博园、鹤鸣湖、花都温泉集中在这里，冬天的鄢陵蜡梅很有名。每年秋天举办中原花木交易博览会。'},
  {name:'襄城县',tagline:'首山与紫云山',text:'首山景区和紫云山适合爬山。王洛镇的猪蹄是襄城的代表性卤味。'}
 ],
 food:[
  {name:'钧瓷',place:'禹州 · 神垕',gi:'地理标志',text:'宋代五大名瓷之一，以"入窑一色、出窑万彩"的窑变著称，是最有许昌特色的伴手礼。',source:'https://www.xuchang.gov.cn/zjxc/005010/20241030/d962b0ac-3d79-4143-b3e3-bcbdb33bc4b4.html',sourceLabel:GOV},
  {name:'鄢陵蜡梅',place:'鄢陵',gi:'地理标志',text:'冬季开花、香气浓，鄢陵蜡梅名气很大。冬天来可以看，也可以买盆景。',source:'https://scjg.xuchang.gov.cn/gzdt/20211228/cda28fa2-176d-4430-9a6d-c2a10a0cc600.html',sourceLabel:'许昌市市场监管局'},
  {name:'许昌腐竹',place:'许昌',gi:'地理标志',text:'传统豆制品，凉拌、炖菜都好吃，便于携带，适合带回家。',source:'https://scjg.xuchang.gov.cn/gzdt/20211228/cda28fa2-176d-4430-9a6d-c2a10a0cc600.html',sourceLabel:'许昌市市场监管局'},
  {name:'禹州中药材',place:'禹州',gi:'地理标志',text:'禹州是传统药材集散地，禹白芷等是地理标志产品。',source:'http://ipr.mofcom.gov.cn/article/gnxw/dlbz/202411/1989040.html',sourceLabel:'商务部知识产权网'},
  {name:'长葛蜂胶',place:'长葛',gi:'地理标志',text:'长葛的蜂产品产业有名，蜂胶是地理标志产品。',source:'http://ipr.mofcom.gov.cn/article/gnxw/dlbz/202411/1989040.html',sourceLabel:'商务部知识产权网'},
  {name:'孟排大葱',place:'长葛',gi:'地理标志',text:'葱白长、口感脆甜，2021 年注册为地理标志证明商标。',source:'https://scjg.xuchang.gov.cn/gzdt/20211228/cda28fa2-176d-4430-9a6d-c2a10a0cc600.html',sourceLabel:'许昌市市场监管局'},
  {name:'禹州十三碗',place:'禹州',text:'传统宴席菜，十三道菜依次上桌，讲究程序和寓意。',source:'https://www.xuchang.gov.cn/zjxc/005010/20260417/59a74fa7-3836-4903-b6ea-d2134bdea7a9.html',sourceLabel:'许昌非遗名录'},
  {name:'顺店杂炣',place:'禹州',text:'牛杂配粉条一锅炖出来，热乎、实在。',source:'https://www.xuchang.gov.cn/zjxc/005010/20260417/59a74fa7-3836-4903-b6ea-d2134bdea7a9.html',sourceLabel:'许昌非遗名录'},
  {name:'王洛猪蹄',place:'襄城 · 王洛镇',text:'襄城的代表性卤味，软烂入味，本地人很认。',source:'https://www.xuchang.gov.cn/zjxc/005010/20260417/59a74fa7-3836-4903-b6ea-d2134bdea7a9.html',sourceLabel:'许昌非遗名录'},
  {name:'吊炉烧饼 · 大豆腐脑',place:'鄢陵',text:'鄢陵的早餐组合：吊炉烤出来的烧饼配一碗豆腐脑。',source:'https://www.xuchang.gov.cn/zjxc/005010/20260417/59a74fa7-3836-4903-b6ea-d2134bdea7a9.html',sourceLabel:'许昌非遗名录'},
  {name:'丈地羊肉汤',place:'建安区',text:'汤白味鲜，冬天来许昌一定要喝一碗。',source:'https://www.xuchang.gov.cn/zjxc/005010/20260417/59a74fa7-3836-4903-b6ea-d2134bdea7a9.html',sourceLabel:'许昌非遗名录'},
  {name:'许昌发制品',place:'许昌',text:'不是吃的，但很"许昌"：许昌被称为"世界假发之都"，发制品远销海外。',source:'http://www.news.cn/fortune/20241125/cabf4d17d0654a01bc830a260412945e/c.html',sourceLabel:'新华网'}
 ],
 routes:[
  {title:'一日 · 市区三国线',text:'适合第一次来、只有一天的人。基本都在魏都区，打车就能串起来。',stops:[
   {name:'许昌市博物馆',note:'先花一小时了解全貌（周一一般闭馆）'},
   {name:'春秋楼 · 文庙',note:'关羽秉烛夜读的故事地'},
   {name:'曹魏古城',note:'午饭也在这里解决'},
   {name:'曹丞相府 → 灞陵桥',note:'下午继续三国线'},
   {name:'胖东来 → 护城河夜游',note:'傍晚购物，晚上看古城夜景'}
  ]},
  {title:'两日 · 市区 + 禹州或鄢陵',text:'第一天走市区三国线，第二天二选一：喜欢手艺选禹州，喜欢花选鄢陵。',stops:[
   {day:'第一天'},{name:'同"一日 · 市区三国线"'},
   {day:'第二天 A · 禹州钧瓷'},{name:'钧官窑址博物馆',note:'先看懂钧瓷'},{name:'神垕古镇',note:'逛老街、看窑口；春秋季可加大鸿寨'},
   {day:'第二天 B · 鄢陵花木'},{name:'花博园 → 鹤鸣湖',note:'春天看花，冬天看蜡梅'},{name:'花都温泉',note:'冬天的最佳收尾'}
  ]}
 ],
 transport:[
  {title:'高铁',text:'许昌有 5 座高铁站：许昌东站在京广高铁上；许昌北站、鄢陵站在郑阜高铁上；禹州站、长葛北站在郑渝高铁上。去市区一般选许昌东站。站名以 12306 为准。',source:'https://www.xuchang.gov.cn/zjxc/005001/005001001/20200519/f9b65542-f1b4-4552-bef9-f755f9e09909.html',sourceLabel:GOV},
  {title:'从郑州、新郑机场来',text:'许昌距新郑国际机场约 50 公里、距郑州约 80 公里。郑许市域铁路 2023 年 12 月开通，从郑州长安路北站到许昌东站，途经新郑机场站。',source:'https://zzwb.zynews.cn/page/2/2023-12/27/A03/20231227A03_pdf.pdf',sourceLabel:'郑州晚报'},
  {title:'到了许昌',text:'市区景点集中，打车或公交即可。节假日许昌东站有开往胖东来、曹魏古城的旅游专线（2026 年国庆官方报道）。',source:'https://www.xuchang.gov.cn/zjxc/005010/20261010/1f6f1ae7-8394-44dc-bd61-e45a5cd75921.html',sourceLabel:GOV}
 ],
 events:[
  {when:'4 月',name:'三国文化旅游节',text:'许昌最有代表性的节庆，原名"三国文化旅游周"，2025 年起称"节"，通常在春季举办。',source:'http://henan.people.com.cn/n2/2025/0411/c351638-41193818.html',sourceLabel:'人民网河南'},
  {when:'9 月下旬',name:'禹州钧瓷文化旅游节',text:'在神垕镇举办，2023、2025 年各办一届。下一届时间请关注禹州官方发布。',source:'https://www.yuzhou.gov.cn/jryz/004001/20250929/0b36bee9-4179-4188-a68d-3178ddc73a9d.html',sourceLabel:'禹州市政府网'},
  {when:'9 月下旬',name:'中原花木交易博览会',text:'在鄢陵举办，2026 年 9 月为第二十三届。花木行业的大型展会，也适合顺便看花。',source:'https://www.stdaily.com/web/gdxw/2026-09/29/content_589659.html',sourceLabel:'科技日报'}
 ]
};
