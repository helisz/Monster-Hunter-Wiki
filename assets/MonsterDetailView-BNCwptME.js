import{t as e}from"./chevron-down-DTgaxmqh.js";import{n as t,r as n,t as r}from"./shield-alert-C8Px7sSg.js";import{t as i}from"./scroll-text-Xu9wZNH0.js";import{t as a}from"./sparkles-BG6kiaGF.js";import{t as o}from"./star-CyWdktrr.js";import{t as s}from"./sword-Zr6IZY3g.js";import{C as c,E as l,F as u,M as d,N as f,O as p,P as m,T as h,_ as g,a as _,b as v,f as y,g as b,h as x,i as S,j as C,k as w,m as T,n as E,o as D,p as O,r as ee,s as k,t as A,y as j}from"./index-SBtxD583.js";import{t as te}from"./useMonsters-CA5BFDK7.js";import{t as ne}from"./useFavorites-B1aGQ3Ek.js";import{i as M,n as N,r as P,t as F}from"./advice-DzB59q6C.js";var I=S({name:`triangle-alert`,size:24,node:[[`path`,{d:`m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`,key:`wmoenq`}],[`path`,{d:`M12 9v4`,key:`juzpu7`}],[`path`,{d:`M12 17h.01`,key:`p32p05`}]],aliases:[`alert-triangle`]}),L={class:`relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/8 to-transparent p-3.5`},R={class:`relative mb-3 flex items-center gap-2`},z={class:`ml-auto flex shrink-0 items-center gap-1`},B={key:0,class:`inline-flex items-center gap-0.5 rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-gold`},V=[`src`],H={class:`relative flex shrink-0 items-center`},U=[`aria-expanded`],W={key:0,class:`absolute right-0 top-full z-30 mt-1.5 w-60 rounded-xl border border-ink-line bg-ink-soft p-3 text-[11px] leading-relaxed text-parch-dim shadow-xl shadow-black/60`},G={class:`rounded bg-gold/15 px-1 py-0.5 font-medium text-gold`},K={key:0,class:`relative rounded-lg bg-ink-card/60 px-3 py-4 text-center text-xs text-parch-dim`},q={key:1,class:`relative space-y-3`},J={key:0,class:`flex gap-2.5`},Y={class:`flex w-16 shrink-0 items-center gap-1.5 pt-0.5`},X={class:`flex flex-1 flex-wrap items-center gap-1.5`},Z=[`src`],re={class:`flex gap-2.5`},ie={class:`flex w-16 shrink-0 items-center gap-1.5 pt-0.5`},ae={class:`flex flex-1 flex-wrap gap-1.5`},oe={class:`font-medium text-emerald-100`},se={class:`font-bold tabular-nums text-emerald-400`},ce={key:1,class:`inline-flex items-center gap-1 text-xs text-parch-dim`},le={class:`flex gap-2.5`},ue={class:`flex w-16 shrink-0 items-center gap-1.5 pt-0.5`},de={class:`flex flex-1 flex-wrap gap-1.5`},fe={class:`font-medium text-rose-200/90`},pe={class:`font-bold tabular-nums text-rose-400/80`},me={key:1,class:`text-xs text-parch-dim/70`},he={key:1,class:`flex gap-2.5 border-t border-ink-line pt-2.5`},ge={class:`flex flex-1 flex-wrap gap-1.5`},_e={class:`space-y-1.5 border-t border-ink-line pt-2.5 text-[11px] leading-relaxed text-parch-dim/80`},ve={key:0,class:`flex flex-wrap items-center gap-x-1`},ye={class:`inline-flex items-center gap-1 align-middle`},be=[`src`],xe={class:`font-medium text-gold`},Se={__name:`AdvicePanel`,props:{advice:{type:Object,required:!0}},setup(e){let i=e,o=C(!1),c=O(()=>E.find(e=>e.key===i.advice.weaponType)),p=O(()=>E.find(e=>e.key===i.advice.suggestedWeapon)),_=e=>`/Monster-Hunter-Wiki/ui-icons/${e}.png`;return(i,x)=>(h(),g(`section`,L,[T(`div`,{"aria-hidden":`true`,class:`pointer-events-none absolute inset-0 bg-repeat opacity-[0.045]`,style:m({backgroundImage:`url(${d(`/Monster-Hunter-Wiki/`)}tribal.svg)`,backgroundSize:`110px 110px`})},null,4),T(`div`,R,[v(d(s),{size:16,class:`shrink-0 text-gold`}),x[6]||=T(`h3`,{class:`shrink-0 text-sm font-semibold text-gold`},`出战建议`,-1),T(`div`,z,[c.value?(h(),g(`span`,B,[T(`img`,{src:_(c.value.hit),alt:``,class:`size-3`},null,8,V),j(` `+u(c.value.label),1)])):b(``,!0)]),T(`div`,H,[T(`button`,{type:`button`,class:f([`relative z-30 -m-1.5 flex size-7 items-center justify-center rounded-full text-parch-dim/70 active:bg-ink-card`,o.value?`text-gold`:``]),"aria-label":`出战建议说明`,"aria-expanded":o.value,onClick:x[0]||=e=>o.value=!o.value},[v(d(n),{size:15})],10,U),o.value?(h(),g(`div`,{key:0,class:`fixed inset-0 z-20`,onClick:x[1]||=e=>o.value=!1})):b(``,!0),v(k,{"enter-active-class":`transition duration-150`,"enter-from-class":`opacity-0 -translate-y-1`,"leave-active-class":`transition duration-100`,"leave-to-class":`opacity-0 -translate-y-1`},{default:w(()=>[o.value?(h(),g(`div`,W,[x[4]||=T(`p`,{class:`mb-1.5 font-medium text-parch`},`建议怎么读？`,-1),T(`p`,null,[x[2]||=j(` 这里的属性、优先与避开部位，都是按 `,-1),T(`span`,G,u(c.value?.label||`当前`),1),x[3]||=j(` 这一列肉质算出来的。 `,-1)]),x[5]||=T(`p`,{class:`mt-1.5`},`换武器后结论会变。点击右上角 ⚙ 可以切换武器类型。`,-1)])):b(``,!0)]),_:1})])]),e.advice.empty?(h(),g(`div`,K,u(e.advice.reason),1)):(h(),g(`div`,q,[e.advice.elementRank.length?(h(),g(`div`,J,[T(`div`,Y,[v(d(a),{size:13,class:`text-parch-dim`}),x[7]||=T(`span`,{class:`text-[11px] text-parch-dim`},`属性`,-1)]),T(`div`,X,[(h(!0),g(y,null,l(e.advice.elementRank,(e,t)=>(h(),g(`span`,{key:e.key,class:f([`inline-flex items-center gap-1 rounded-md border px-1.5 py-1`,t===0?`border-gold/50 bg-gold/12`:`border-ink-line bg-ink-card`])},[T(`img`,{src:_(e.icon),alt:``,class:`size-3.5`},null,8,Z),T(`span`,{class:f([`text-xs font-semibold`,t===0?`text-gold`:`text-parch`])},u(e.label),3),T(`span`,{class:f([`text-xs font-bold tabular-nums`,t===0?`text-gold`:`text-parch-dim`])},u(e.value),3)],2))),128))])])):b(``,!0),T(`div`,re,[T(`div`,ie,[v(d(t),{size:13,class:`text-emerald-400`}),x[8]||=T(`span`,{class:`text-[11px] text-parch-dim`},`优先`,-1)]),T(`div`,ae,[e.advice.good.length?(h(!0),g(y,{key:0},l(e.advice.good,e=>(h(),g(`span`,{key:e.part,class:`inline-flex items-baseline gap-1 rounded-md bg-emerald-500/12 px-1.5 py-1 text-xs`},[T(`span`,oe,u(e.part),1),T(`span`,se,u(e.value),1)]))),128)):(h(),g(`span`,ce,[v(d(I),{size:12,class:`text-amber-400`}),x[9]||=j(` 该武器类型无有效弱点，建议换武器类型 `,-1)]))])]),T(`div`,le,[T(`div`,ue,[v(d(r),{size:13,class:`text-rose-400/80`}),x[10]||=T(`span`,{class:`text-[11px] text-parch-dim`},`避开`,-1)]),T(`div`,de,[e.advice.bad.length?(h(!0),g(y,{key:0},l(e.advice.bad,e=>(h(),g(`span`,{key:e.part,class:`inline-flex items-baseline gap-1 rounded-md bg-rose-500/10 px-1.5 py-1 text-xs`},[T(`span`,fe,u(e.part),1),T(`span`,pe,u(e.value),1)]))),128)):(h(),g(`span`,me,`无低效部位，全身均可打`))])]),e.advice.specialParts.length?(h(),g(`div`,he,[x[11]||=T(`div`,{class:`flex w-16 shrink-0 items-center gap-1.5 pt-0.5`},[T(`span`,{class:`text-[11px] text-parch-dim`},`标记`)],-1),T(`div`,ge,[(h(!0),g(y,null,l(e.advice.specialParts,e=>(h(),g(`span`,{key:e,class:`rounded border border-gold/25 bg-gold/8 px-1.5 py-0.5 text-[11px] text-gold/90`},u(e),1))),128))])])):b(``,!0),T(`div`,_e,[p.value?(h(),g(`p`,ve,[T(`span`,ye,[T(`img`,{src:_(p.value.hit),alt:``,class:`size-3.5`},null,8,be),T(`span`,xe,`推荐`+u(p.value.label)+`武器`,1)]),T(`span`,null,u(p.value.key===c.value?.key?`（与当前选择一致）`:`（当前选择是${c.value?.label}，该武器有效部位较少）`),1)])):b(``,!0),x[12]||=T(`p`,null,`伤口肉质更高，打破后切输出。`,-1)])]))]))}},Ce={class:`overflow-hidden rounded-lg border border-ink-line`},we={class:`overflow-x-auto`},Te={class:`w-full border-collapse text-[11px] tabular-nums`},Ee={class:`bg-ink-soft`},De=[`src`,`alt`,`title`],Oe=[`onClick`],ke={__name:`HitzoneTable`,props:{groups:{type:Array,required:!0}},setup(e){let t=e,n=e=>`/Monster-Hunter-Wiki/ui-icons/${e}.png`,r=e=>e===null?`常态`:e===`伤口`?`伤口`:e===`弱点`?`弱点`:e===`可破坏`?`可破坏`:typeof e==`string`&&e.startsWith(`State_`)?e.replace(`State_`,`状态`):e,i=e=>e===`伤口`?`text-rose-300/90`:e===`弱点`?`text-emerald-300/90`:e===`可破坏`?`text-amber-300/90`:`text-parch-dim/70`,a=[...[`slash`,`strike`,`shell`].map(e=>({key:e,icon:`hit_${e}`,label:e})),...F.map(e=>({key:e.key,icon:e.icon,label:e.label})),{key:`stun`,icon:`element_stun`,label:`眩晕`}];function o(e,t){let n=e[t];return typeof n==`number`?n:null}function s(e){return e===null?`text-parch-dim/40`:e>=60?`text-emerald-400 font-bold`:e>=45?`text-emerald-300 font-semibold`:e>=30?`text-parch`:e>=15?`text-parch-dim`:e<=5?`text-parch-dim/45`:`text-rose-400/75`}let c=O(()=>{let e=[];for(let n of t.groups)n.rows.forEach((t,r)=>{e.push({part:n.part,isFirstOfGroup:r===0,groupSize:n.rows.length,state:t.state,row:t})});return e}),d=C(null);function p(e,t){d.value&&d.value.row===e&&d.value.col===t?d.value=null:d.value={row:e,col:t}}let m=e=>d.value?.row===e,_=e=>d.value?.col===e,v=(e,t)=>m(e)&&_(t);return(e,t)=>(h(),g(`div`,Ce,[T(`div`,we,[T(`table`,Te,[T(`thead`,null,[T(`tr`,Ee,[t[1]||=T(`th`,{class:`sticky left-0 z-10 min-w-[64px] bg-ink-soft px-1.5 py-1.5 text-left font-medium text-parch-dim`},` 部位 `,-1),t[2]||=T(`th`,{class:`min-w-[46px] px-1 py-1.5 text-center font-medium text-parch-dim`},`状态`,-1),(h(),g(y,null,l(a,e=>T(`th`,{key:e.key,class:f([`min-w-[28px] px-0.5 py-1.5 text-center font-medium transition-colors`,_(e.key)?`bg-gold/12`:``])},[T(`img`,{src:n(e.icon),alt:e.label,title:e.label,class:`mx-auto size-3.5 opacity-80`,onError:t[0]||=e=>e.target.style.display=`none`},null,40,De)],2)),64))])]),T(`tbody`,null,[(h(!0),g(y,null,l(c.value,(e,t)=>(h(),g(`tr`,{key:t,class:f([`border-t border-ink-line/60 transition-colors`,[e.isFirstOfGroup&&e.groupSize>1?`border-t-ink-line`:``,m(t)?`bg-gold/[0.045]`:``]])},[T(`td`,{class:f([`sticky left-0 z-10 whitespace-nowrap bg-ink-card px-1.5 py-1 font-medium transition-colors`,[m(t)?`bg-[#2A251F] text-gold`:`text-parch`]])},u(e.part),3),T(`td`,{class:f([`whitespace-nowrap px-1 py-1 text-center text-[10px]`,i(e.state)])},u(r(e.state)),3),(h(),g(y,null,l(a,n=>T(`td`,{key:n.key,class:f([`cursor-pointer px-0.5 py-1 text-center transition-colors`,[s(o(e.row,n.key)),v(t,n.key)?`rounded bg-gold/25 ring-1 ring-inset ring-gold/60`:_(n.key)?`bg-gold/[0.10]`:``]]),onClick:e=>p(t,n.key)},u(o(e.row,n.key)??`—`),11,Oe)),64))],2))),128))])])])]))}},Ae={class:`relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/8 to-transparent p-3.5`},je={class:`relative mb-2 flex items-center gap-2`},Me=[`aria-expanded`],Ne={__name:`GuidePanel`,props:{text:{type:String,required:!0}},setup(t){let n=C(!1);return(r,a)=>(h(),g(`section`,Ae,[T(`div`,{"aria-hidden":`true`,class:`pointer-events-none absolute inset-0 bg-repeat opacity-[0.045]`,style:m({backgroundImage:`url(${d(`/Monster-Hunter-Wiki/`)}tribal.svg)`,backgroundSize:`110px 110px`})},null,4),T(`div`,je,[v(d(i),{size:16,class:`text-gold`}),a[1]||=T(`h3`,{class:`text-sm font-semibold text-gold`},`狩猎攻略`,-1)]),T(`p`,{class:f([`relative whitespace-pre-line text-xs leading-relaxed text-parch-dim`,n.value?``:`line-clamp-4`])},u(t.text),3),T(`button`,{type:`button`,class:`relative mt-2 -mb-1 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] text-parch-dim/80 active:bg-ink-soft`,"aria-expanded":n.value,onClick:a[0]||=e=>n.value=!n.value},[j(u(n.value?`收起`:`展开全文`)+` `,1),v(d(e),{size:13,class:f([`transition-transform`,n.value?`rotate-180`:``])},null,8,[`class`])],8,Me)]))}},Pe={key:0,class:`mb-4`},Fe={class:`mb-2 flex items-center gap-2 px-0.5 text-sm font-semibold text-parch`},Ie={class:`text-[11px] font-normal text-parch-dim`},Le={class:`-mx-3 overflow-x-auto px-3 no-scrollbar`},Re={class:`flex gap-2.5`},ze=[`onClick`],Be={class:`size-14 overflow-hidden rounded-lg bg-black`},Ve=[`src`,`alt`],He={class:`w-full truncate text-center text-[11px] leading-tight text-parch-dim`},Ue={__name:`RelatedMonsters`,props:{monsters:{type:Array,required:!0},family:{type:String,default:``}},setup(e){let t=e,n=D(),r=O(()=>t.monsters.filter(e=>e));function i(e){n.push(`/wilds/monsters/${e.slug}`)}return(t,n)=>r.value.length?(h(),g(`section`,Pe,[T(`h3`,Fe,[j(u(e.family||`同族怪物`)+` `,1),T(`span`,Ie,u(r.value.length),1)]),T(`div`,Le,[T(`div`,Re,[(h(!0),g(y,null,l(r.value,e=>(h(),g(`button`,{key:e.slug,type:`button`,class:`flex w-[76px] shrink-0 flex-col items-center gap-1.5 rounded-xl border border-ink-line bg-ink-card p-1.5 active:border-gold/50`,onClick:t=>i(e)},[T(`div`,Be,[T(`img`,{src:e.icon,alt:e.name,loading:`lazy`,class:`icon-blend size-full object-cover`,onError:n[0]||=e=>e.target.style.visibility=`hidden`},null,40,Ve)]),T(`span`,He,u(e.name),1)],8,ze))),128))])])])):b(``,!0)}},We={"huo-long":`弱火免疫，弱点为雷、龙，头部（嘴）最容易打。推荐雷属性或龙属性的大剑、太刀、铳枪，带解毒药和闪光弹。

喷火前嘴会冒火星，这招没有左右判定，横向翻滚到脖子下方再攻击；三连火球要连续跑动躲开。俯冲爪击（附带中毒）前会抬高身体，向侧前方翻滚离开落点。

空中甩尾前会先蜷起尾巴，看到这个动作就离开它的正下方。优先破翼，破翼必得火龙翼；断尾可剥取火龙尾巴、宝玉和延髓。

闪光弹能把它从空中打落；出现伤口后用集中攻击，趁它坠地时集火头部，再配合骑乘撞墙。`,"ci-huo-long":`弱火免疫，弱点以龙最优、雷次之，头部最容易打。推荐龙属性双剑、大锤、虫棍，带解毒或毒抗。

飞行尾击几乎没有前摇，看到它离地就翻滚；突进尾击有压低身体蓄力并大吼的前摇，可精准格挡后再反击。

喷火时嘴冒火星、没有左右判定，翻滚到脖子侧面输出。它转向后方吼叫后会甩尾，不要久站背后。

优先断尾——剥取尾巴可得上等棘、红玉和延髓；再破翼拿翼膜。多用落穴、麻痹陷阱和骑乘制造倒地，它回巢产卵时小心变得狂暴。`,"suo-ren-long":`弱龙（龙属性伤害最有效），推荐大剑、盾斧、重弩；无龙武器可用麻痹或爆破属性过渡。

锁刃龙的锁翼刃能远距离抽击和地面刮击，但中距离才是它的优势区，贴身或远离都比较安全：贴在侧腹、双翼后方持续输出。正前方的龙属性能量波会连续爆裂数次，看到它举刃蓄力立刻向侧后方移动，来不及就用翻滚冲进波里穿过。飞扑落地时锁链会扫过地面，不要在落点正面停留。

优先破坏双锁翼刃，能削短它的攻击距离，还有较高概率掉落壳；其次是头部（角），尾巴可断。

技巧：它抓人时先打伤口打断抓取；用落石或引怪相斗，能一次造成大量伤害。`,"hei-shi-long":`弱火，龙属性也吃，但火属性泛用性最好；推荐双剑、操虫棍、弓、轻弩。

狂龙化后触角伸出，多数招式的硬直明显变长，反而是输出窗口。狂龙炮蓄力三连爆时，见它站立吐息就往侧移，最后一爆后迅速上前用集中攻击打头，能直接推倒它并解除狂龙化。鳞粉扫射和狂龙球向侧翻滚即可；三连追踪炮在命中前才横闪。被狂龙病毒感染别慌，这段时间持续输出，紫色槽会转为增益，也可以吃打消果实。

优先破坏触角——触角只在狂龙化时露出来，破坏后大幅削弱它的感知能力；双翼、尾巴同样值得破坏。

技巧：狂龙化时用陷阱争取打角的时机；别在狂龙粉尘里停留太久。`,"hai-long":`弱火，雷属性无效，推荐大锤、斩斧、盾斧；远程用火属性重弩。

它蓄电时背部电刺发光，先退开，等它放完电再上前：放完电后背部会露出伤口，用集中攻击或大锤打背能快速积攒伤口。侧身扭动要出大步突进时，往它头部方向翻滚，后半身覆盖范围最大。蓄电分两级，二级攻击附带大范围爆炸，别在腹下或两腿间站桩。

优先破坏头部（角）、背部电刺与前肢，背部破坏给电刺素材，尾巴可断。

技巧：进巢后可下水，用投石索弹药与水底沉岩砸它，能穿透并造成硬直；身上缠药时贴手臂骑乘打伤。`,"hu-huo-long":`弱点为雷与龙，推荐雷属性近战。主弱点在嘴与双腿，斩击、打击打头与腿收益最高。

它空中爪击落地前后均有判定，看到重心压低起飞就朝侧后方翻滚或直接上坐骑拉开；喷火前嘴部冒火星、站起低头，前摇长，可直接绕到头部侧面继续输出；双爪冒白火后悬停是原地践踏，远离落点再回头打腿。

优先破双翼，能大幅削弱滞空、把战斗拉回地面，也是翼膜素材的来源；尾巴可断。护龙种伤口会自行愈合，出现伤口必须马上收掉。

技巧：爪击落地会留下龙乳结晶，被火焰引燃会连锁爆炸，可用投射物自己先引爆清场；闪光弹把它打落，落点在正下方，提前站位打腿。`,"kai-long":`弱点为水（其次冰、龙），推荐水系双刀或高属性盾斧、斩击斧，一定要带蓝斩以上武器，否则头、翼会弹刀。

它先完全站起、抬头蓄力时是要吐火，抬头且有火星说明主炮正对前方，别停步持续横向移动；头带旋转动作则是横扫火线，出招更快，看到立刻向它右侧走；低头蓄力是向下方喷，会引爆脚底，专坑贴腹输出的猎人。

优先破腹部外壳——破后腹肉暴露才真正吃伤害，同时可切尾降低尾扫半径。

技巧：破一侧翼后，它起飞砸地会失败直接倒地，可稳定制造输出窗口；被它吼叫或放射后的头部会短暂出现伤口，集中模式打伤口伤害极高。`,"guai-niao":`弱点为水、冰、雷，推荐冰属性打头。主弱点是嘴，头可破坏。

它常成群出现于绯红森林丰饶期，务必带大便玉把同伴赶散，否则多只连啄会被压得抬不起头。尾击几乎无前摇，头部压低并回头看人就是要甩尾，可贴身翻滚过身；火焰突刺会先伏低重心、双翼横平，冲刺直线不转弯，向侧面走即可；张嘴歪头锁定后啄击可连啄数段，侧面站位或反向贴腿躲避。

优先破头，头部固定产出怪鸟的耳。

技巧：大耳是弱点也是破绽，发射音爆弹能让它原地僵直，先打一套再后撤——但它恢复后会立刻进怒，且怒中可能免疫音爆，节奏要提前安排；身上火属性异常翻滚三次或去水边灭掉。`,"du-guai-niao":`弱点为火，推荐火属性打头（柔韧的皮吃重击差，电陷阱也无效）。

这只有两个麻烦：闪光和毒。头顶冠部发光就即将闪出，看到亮起立刻背对或转身翻滚，别直视；中闪后它必定接长尾横扫，可在硬直结束前先侧滚。冲刺中会连续喷毒，最多三段，别直线后撤，改横向绕。主弱点在颈部与嘴部，破坏头部能毁掉冠部，从此不再闪。

技巧：它装死时可以直接剥取一次，然后立刻暴起，剥完就要走位；地上毒潭可用水苔弹清除，避免踩进去被减速；带落穴陷阱代替电陷阱，能稳定制造输出窗口。`,"tao-mao-shou-wang":`弱点为火与冰，推荐火属性近战打头，能绕后的武器（大剑、太刀、双刀）手感更好。主弱点在头部，头、前肢、尾都能破。

真正威胁是恶臭：吐息、放屁、投粪都会让你进入「无药可医」的恶臭状态，回复道具直接失效——必带除臭剂，或翻滚进水里洗掉。吐息属性随它吃的蘑菇变化（毒、爆破、麻痹、火都可能），无法预判，看到它张口前倾就立刻拉开距离。三连前爪横扫、跳起压身之后都有很长的收招硬直，第三下之后它还会趴地发呆，等它打完再贴上去打头。

技巧：别贪着猛捶屁股，打后部会触发放屁反击；它常带一群小桃毛兽，先用大便玉清场再单挑。`,"xue-shi-zi-wang":`弱点为火，推荐火属性打头（尾部也是主要弱点，尾部斩击收益好）。

它全部优势都在机动性：后跳前冲、远距离扑击，远程站在远处也照样会被扑到。看动作分辨：向后跃是在蓄势，别站它正后方，会被反扑撞上；双臂高举后砸地，起手明确，往任意方向滚；冰息会先四肢伏地，向侧面闪避，中招后行动受限极易被连。

优先破头部与尾，破头能打断它与小狮群的协作。

技巧：两大异常是冰属性异常（用消冰果实）与「霜」异常（用清洗剂），两种药各备一份；闪光弹与落穴、电陷阱都好用；地图上的悬空碎石与脆冰柱是巨额伤害，把它引到地形下触发。`,"ying-zhi-zhu":`弱点为火（背部披着毒怪鸟皮时装，雷反而效果差），推荐火属性斩击打腹部。核心弱点是头部钳角，左爪、两处毒刺、外套膜都可破。

最大威胁是丝：仰身翘尾蓄力是远程撒网，被缠住后必接钳击连招，看到这个动作先上坐骑换位；弓身后撤一步再吐丝是控场起手，躲开后再上前。长钳合击前摇长、后摇也长，是最值得抓的输出窗口，正面站好等它合钳后立刻打钳角。

优先破外套膜：橡胶质皮是它的高阶素材来源，且破皮后属性弱点会发生变化。

技巧：麻痹对蜘蛛极有效，陷阱选麻痹/落穴都可以；后半段地面会出现小蜘蛛，顺手清掉可刷怪物液，但别被带偏注意力。`,"qian-ren-long":`弱点为雷（次冰），推荐大锤或雷属性斩击。

它全身刃鳞会射出，核心是裂伤：被刃鳞或爪命中后持续掉血，且翻滚会加速失血。主思路是破腿控场。二连爪挠判定压在身下，带耐冲可硬吃；顶头撒鳞看它头部朝向后反向翻滚；俯冲踹击后撤起飞后连踹，向侧面躲，最后一脚后摇最长可反击；侧飞甩鳞必定接大砸，朝它反方向走位，砸完立刻追腿。

优先断尾，能减少它甩鳞的频率；腿伤破坏会造成倒地，两腿轮破可连出输出窗口。

技巧：必带星辰肉干，快捷键秒解裂伤（蹲下数秒也能自然恢复）；闪光弹把它打落地，配破坏王技能更快破腿。`,"ju-ji-long":`弱点为火，龙属性是它的真正软肋：身上覆着凝固的黑油，先用火属性攻击软化黑油，「肉质变软后再换龙属性」伤害会明显提高。推荐大剑、充能斧这类能格挡的武器，或双剑、太刀这类能持续点火的高频武器。

最危险的是它用前肢和翼臂高举身体后的全身砸地；看到它起身就横向移动到脚下范围之外，满血正面挨这一下也可能被一发送走；躲在身后则会被甩尾拍飞。

优先破坏背部、胸部和左右翼臂。破坏翼臂稳定得到 Shredders，破坏背部和胸部稳定得到 Lacerator。

技巧：冒烟的地火可以引爆来炸它，比直接砍更划算；三阶段它单翼飞行时，用破龙筒蓄力攻击头部或尾部，比专门瞄准翼足更容易把它打下来。`,"pao-hu-long":`弱点是雷和龙，冰有一点效果，水属性完全无效。推荐雷属性太刀、双剑或弓。

它身上覆着水膜时会打滑，还会喷出泡沫；泡沫累积到较重状态会大幅拖慢移动与闪避，记得用消臭玉一类道具清掉。关键招式：站立抬高全身后向前扑的身体砸击，范围比看起来更大，要在它抬到最高点时就向外滚；单爪举过头顶再压下的爪击，要往它举起那只爪的内侧下方钻；远距离旋转跳劈会先远跳并发出哨音，听声顺势侧滚。

优先破坏头部、前爪、背鳍和尾巴，头部与背鳍肉质最好。

技巧：背鳍破坏后，它翻滚和滑行的频率会下降；别主动把它引到水域，因为水膜刷新更快。`,"hu-lei-e-long":`弱点是冰、水和龙，雷属性对它几乎无效。推荐冰属性大剑或充能斧，它的鼻部肉质最差，打击类武器配合部位破坏手感很好。

关键招式：它鼻端向后收、头部压低时的「鼻击」是横扫扑咬，要往鼻子下方滚过去，而不是后退；嘴部积蓄电光时，咬合会引发范围爆炸，嘴边一亮就离开头部一圈。

腿部可破坏且容易推倒，优先击破腿部制造倒地窗口，再顺势砍可切断的尾巴；破坏头部能得到牙与鼻骨素材。

技巧：它会留下会爆的晶体，用投射器远程引爆能顺便清场；它没有疲劳循环，别等它「累了」再输出，主动破腿推倒才是节奏点；带耐雷珠处理雷属性异常。`,"hu-xiong-zhua-long":`弱点是水，麻痹对它相当有效。推荐水属性太刀、双剑这类攻速快的武器，配麻痹属性或麻痹陷阱能多控一轮。

核心威胁是爪击造成的裂伤，在裂伤状态下翻滚也会掉血，务必带止血药。招式上，它最常出双前爪连续挥击，而且会接第二段；第一次翻滚之后不要立刻贴回去，等第二段收招再进。

优先击破前腿和尾巴：前腿破掉后爪击威胁明显下降；尾巴可切断，断尾后打尾尖收益更高。

技巧：它是造龙种，伤口会自行闭合，出现伤口就立刻集中攻击；遗迹里的白色晶体结构能用投射器弹打碎，打碎时会对附近的龙造成额外伤害。`,"pi-shou":`弱点是火和雷，腹部是弱部位，但正面几乎够不到。推荐火属性大锤或狩猎笛打头；大剑、太刀削四肢也稳。

关键招式：它跃起后会重砸地面并附带震地，看到它起跳就朝侧面跑，而不是原地滚动。直线冲撞前它会低头蓄力并吼叫，要往侧后方偏。甩尾扫击有两段，先退一步再进。

可破坏部位是左右前腿和尾毛；前腿破掉后推撞能力会减弱。

技巧：它立起前身咆哮时腹部会露出来，这是稳定攻击腹部的唯一窗口，近战要抓住；它低血量时伤口会重新裂开并变得更凶，既是补伤害的机会也是被反打的陷阱，别贪。它常成群出没，单点目标时带异臭弹清场。`,"sha-hai-long":`弱点属性是雷，嘴部和颈部肉质最好，尾巴可切断。推荐雷属性太刀、大剑或锤。

核心机制是它会在沙里潜伏并制造流沙坑；站进沙坑会被拽下去，所以当沙面开始流动、地面出现漩涡状凹陷时要立刻往外跑，别在坑里贪刀。正面喷出的黏液会造成水属性异常，快速抽干耐力，带解水道具；避开这一发后有一个短窗口，可顺势攻击头部弱点。它蛇形的身体会朝同一侧连续突进，判断要看身体弯曲的方向，抢先往弯曲外侧让位。

优先破头并断尾，尾巴素材主要靠断尾。

技巧：它潜入沙中时音爆弹非常有效，能把潜沙的它直接炸出来；输出时站在两腿之间的侧腹相对安全。`,"chan-wa":`弱点属性是雷和冰，龙属性几乎无效，舌头是它最大的弱部位。推荐雷属性太刀或双剑，攻速快更利于在舌头伸出的瞬间抢伤害。

攻击全是物理系：正面重踏、旋转甩舌、张嘴冲撞、单腿高举砸地以及起跳肚腹扑击。判断要点：它的旋转和冲撞看似笨拙，但起手极快；看到舌头开始甩动就先撤一步。它单腿高举时别站在正前方，往抬起脚的侧后方绕。它会把石屑粘在前肢上，攻击范围因此变长，破坏双前肢能废掉部分招式。

技巧：它舔舌头抹前肢时会露出舌头，这是集中攻击舌头最好的窗口；冲撞后硬直很长，绕到身后攻击前肢比正面硬拼更省命。`,"yan-wei-long":`弱点属性是水，头部和尾部肉质最好，尾巴可切断。推荐水属性大剑或太刀；前期没水武器时，可以先打一只沙海龙拿它的水属性武器。

它不喷火，而是从尾部散出可燃气体，再用尾巴拍打地面点燃。判断方式有三种：直立伸脖是高甩火焰的散布攻击，立刻后退；头微微下沉是朝固定方向的火焰扫击，往头部一侧横滚；先退一步再转身甩尾是旋转点火，垂直于旋转方向侧步。

优先破头并断尾；尾巴一断，它引燃的手段就大幅减少。

技巧：备足解火道具，或中火后连滚三次灭火；它蓄力时颈部会伸出来，这是攻击颈部最划算的窗口。`,"ci-hua-zhi-zhu":`弱点是火，雷次之，水、冰、龙基本无效，毒与睡眠也有一定效果。

它动作轻快，容易让猎人打空，适合太刀、双剑这类贴身快速斩击的武器来争取时间，尽量避免把重击交给会旋转闪避的目标。常见招式中，单爪前伸蓄力后会以极快速度刺出，并且有连击变体，看到蓄力就侧向移动；抬起一条腿蓄力后砸地时，要朝另一侧让位；双爪砸地要往左右翻滚，不能前后退。

最需要警惕的是「绽放红花」：它腹部张开如巨大红花，射出一片带麻醉的绒毛，被累加后会当场无法行动。看到它夹着红花蓄力，就绕到侧后方，不要迎着正面追。

优先破坏尾部花瓣状的部位和两只前爪。技巧：盯住尾针，疲劳时它会完全露出来，是最好的输出窗口；麻醉绒毛可用翻滚躲开，不要停在原地。`,"zhao-pen-long":`弱点是水，火、雷、冰、龙都只是勉强有效，麻痹和睡眠可以打，带毒抗和解毒药上场更稳。

它是涌油谷的兽龙种，靠尾巴把瓦斯压入地下引发爆炸，舌头喷出的瓦斯带毒，适合用大剑、铳枪这类能挡能反击的武器，也可以选择机动性强的双剑，配合水属性贴身绕侧。

关键招式：把下半身插进油泥蓄力会引发范围内的爆炸，看到这个动作就立刻拉开距离；尾巴插地输送能量时爆炸点会提前冒烟，看到烟就离开原位；尾巴横扫和单爪攻击几乎没有前摇，站位别贴得太近，保持在爪子外一步；前爪扑击的前摇很长，是稳定的反击点。

优先破坏头部、背部和尾巴。技巧：突刺、单爪这类快招打完之后会有短暂停顿，趁这时补刀；在泥地里翻滚会拖慢节奏，得提前规划走位。`,"huang-lei-long":`煌雷龙栖于天堑沙原，弱冰，也受睡眠影响，水属性收益很低。

带有结晶的翅膀和尾巴是核心机制：攻击结晶部位能让它剥落并缩短硬直时间，剥落三次会触发一次炸膛倒地；入场时如果遇到极端天气，它全身都处于结晶状态。太刀、大剑打立回都顺手，太刀可以靠见切和居合稳定处理连段。

关键招式：蓄力大拍之后往往接空中电磁炮；双角突刺前摇长，有充足时间判断；飞天雷击会先瞄准再落雷，看到地面的瞄准圈就能走开；飞天捶地之前有明显的后仰后撤；尾巴砸地通常在玩家一直绕后时出现，看到它抬起后腿就往侧向挪。

优先把头和双翼的结晶打掉，再切断尾巴。

技巧：电磁炮和二连电结束时头部会短暂变成集中攻击弱点，这时用集中攻击开刃；连段中间的二连电和灌篮是终结招，出完后有长时间后摇，是爆发输出的时机；充电状态期间别指望再剥落结晶。`,"bo-yi-long":`波衣龙是绯红森林的海龙种，弱雷，火只是一般有效，水完全无效。

它会先给自己加一层由分泌物形成的「水膜」，所以要用雷属性尽快剥掉这层膜。推荐太刀、大剑或锤子从正前方进攻，因为嘴部和头部是它真正的弱点。

关键招式：单手举起后拍地、抬起上半身扑地这两招速度慢，看到前摇就侧移；跳跃翻滚只有落地一下有判定，它起跳就拉开距离；原地翻滚范围大，要直接远离，不要想贴身硬挡；冲刺飞扑是二连击，还会引发水浪把人冲倒，建议提前找岩石之类的障碍物挡一下。

优先破坏头部和前腿，接着是尾巴。

技巧：水膜还在时打身体收益很低，最好盯着嘴部这一处破膜；会被水浪击倒，穿一件防滑护腿或用翻滚把硬直压短，比硬吃再起身更安全。`,"yu-yan-shao":`狱焰蛸是涌油谷的头足种，弱水，雷次之，免疫龙属性，对毒有一定抗性。

它平时全身裹着油泥，兴奋之后会把油泥点燃，进入烈焰状态，攻击范围明显变大。推荐水属性太刀、双剑、斩击斧贴身绕侧输出，切割类伤害对它最有效。

关键招式：举起前两只触手冲过来，体型大，看到动作就要换位；单只触手发光蓄力后横扫，时间足够防御或提前闪开；前身扑杀在侧面和身后没有判定，躲开正面就能安心输出；烈焰状态下会歪头喷火，范围极大，看到歪头就直接骑上坐骑撤出正面；它还会弓身蓄力，然后全触手四散投出大量火球，前摇一出现就要离开它身边。

优先破坏头部（掉角），其次切开臀部的触手。

技巧：它被点燃时用水弹或附近的水苔扑灭火焰，能大幅削弱它的强势期；当它蜷成一团准备扑击时，站在侧面或身后最安全。`,"he-yuan-shou":`赫猿兽是牙兽种，背甲覆盖着能蓄热的金属，弱水，冰、龙效果一般，火完全无效；异常状态里毒、麻痹、睡眠都值得一试。

建议带水属性大剑、锤子这类钝击或重量型武器，集中打它无甲覆盖的臀部。

关键招式：突然站起举双手捶地，砸完后有接近数秒的趴地后摇，是主要的输出窗口；单手爪击速度不快，容易躲；它会连续投掷两颗岩球，两球之间有明显间隔，按着节奏躲；侧躺突击容易骗人，第二下才是真正的杀招，看到就先后退等它打完；进入红温状态后插地突刺几乎零帧起手，看到手插进地面就要立刻离开；它会连人带身蜷成陀螺，跳起后砸地爆炸，伤害全场最高，看到陀螺形态就先撤。

优先破坏背甲并切断尾巴，两者都稳定出素材，背甲破坏后还常出骨髓。

技巧：它擅于攀上高处发动垂直打击，务必抬头看上方；红温时别站在它正前方，往侧面和身后绕。`,"hu-suo-ren-long":`护锁刃龙是龙都遗迹的造龙种，弱龙，其余属性都没有效果，老老实实准备龙属性武器最省事。

它是飞龙体型，双翼的锁刃可以伸缩横扫，推荐太刀、斩击斧这类能在很远的距离外处理锁刃的武器，或者用大剑抓大后摇。

关键招式：后撤步的同时甩出锁链，围攻范围不大，侧移一步就够；单爪锁链击蓄力蜷翅的动作很明显，看到就要准备防御；锁链甩击几乎零帧起手，还有两爪连打的变体，最好在练习里形成肌肉记忆；锁链突刺前摇不明显，别站在它正前方；甩尾也近乎没有前摇；锁刃爆击甩出后，锁刃落点稍后会爆炸，务必离开落点，不要只看有没有被打中；爆气时身上冒出白焰转成通红，要在变红前离开它的正面；连跳和三连击都覆盖正面和侧面，姿态一展开就赶紧撤。

优先破坏双锁刃和头部，再切断尾巴，都是主要的素材来源。`,"feng-jia-long":`风铗龙是栖息在冰雾断崖的海龙种，弱火和毒，冰属性无效；头部的嘴巴才算真正的弱点，身体各部位对所有武器类型都不怎么抗揍，打得中就很脆弱。

它多半成群行动，颈部有特殊的膜衣用来乘风飞行，常常长时间悬空，近战很难打到，建议带能造成远程伤害的武器或投射器，再加虫网类辅助；毒和陷阱对它是有效的。

关键招式：空中蓄力后回旋突刺速度极快，用完头部会插进地面无法动弹，这是整场最主要的输出窗口；在空中它会连续吐射，看到它倒转伸展头翼就横向跑动；落到地面后有一招近战三连（一爪击加两下咬），两次啃咬之间有间隔；它在空中会甩尾，且没有前摇；地面翻身距离短，能挡下也能翻滚开。

优先破坏头部（飞膜从头部出），再破坏尾巴（尾爪稳定出）。

技巧：它落地时用闪光弹可以打下来；它悬空绕圈时别一直追，等它突刺落地或主动下压才是出手的时候。`,"dong-feng-long":`冻峰龙弱火，冰属性会成为它的武器，因此推荐携带火属性武器；由于它体型巨大、动作缓慢，长枪、铳枪这类格挡武器比较安全，太刀、大剑也能利用它长时间的硬直打输出；建议穿冰耐装备，并喝热饮抵御严寒，被冰雾吐息打中会陷入冰属性异常，使体力消耗加快，记得备好消冰果实。

它近身时举双爪下砸、摇尾横扫的前摇都很长，可以侧移避开；低头张嘴约两秒后会啃咬，看到这个动作就往外侧移动；「冰雾吐息」几乎瞬间发动，先喷直线再横扫，先躲开直线那口，再找岩石掩体或绕到它侧面。

最危险的是「大爆炸」：它会用冰把自己完全包裹，场上同时出现岩石掩体，必须用钩索把悬空的大冰块拉下来或躲到掩体后，否则会被直接秒杀。

破坏背部大冻凝壳和四肢能明显削弱它的冷却器官，大幅弱化寒气攻击。技巧：见它爬到高处向下喷冰时，骑乘鹭鹰龙绕行，等它喷完三轮后用钩索把石柱拉塌砸它。`,"an-qi-shao":`暗器蛸弱冰（也有资料把毒算作有效属性），并且对龙属性免疫，务必避免使用龙骨系武器；它的头部和嘴是唯一肉质较软的位置，触手、体膜和躯干都很硬，推荐大锤、盾斧、太刀这类能用集中模式打准高处的近战武器，远程则用冰弹或毒弹持续削血。

主要威胁是「触手鞭击」：单次挥击距离很远、速度快，容易因疏忽被打中；看到它蓄力把触手摆成一排时，就格挡或向前翻滚。「旋爪鞭击」会原地旋转扫周围，格挡与翻滚都可以；「突刺」会先低头发白蓄力，再高速旋转冲锋，看它落点往反方向闪；跳起后可能砸下或投掷尖刺，看到它腾空就先移动。

按嘴、头、臀的顺序优先破坏：头部给金色角质，嘴部稳定得牙，臀部触手可切断掉触手，第一对左右触手固定出爪。

技巧：它擒抱扑来时用钩索弹可挣脱，但不要被触手缠住。`,"bai-chi-long":`白炽龙没有明显属性弱点，只有龙属性略微有效，推荐龙属性武器或带龙弹的重弩；它的结晶壳未破时对远程弹有抗性，所以先用近战打碎翼臂与头部的结晶，再让弓、弩趁机输出。

它会在三个阶段各转场一次，每次转场前先吼叫并重新长出白壳，同时 BGM 变化，这是必须立刻准备的信号：提前用元素弹打掉最外围和对应内圈的龙乳石柱，制造安全区；转场大招会连着灼烧，不解除或站错位置就会直接猫车。

蓄力火球爆炸范围很大，看到它蓄力就用飞扑躲避；四阶段落雷会横向扫来，要向前翻滚，不要侧翻。

破坏双翼臂和头部结晶能让它积蓄的能量迅速枯竭；黑手阶段猛攻左右翼爪可以打出倒地，尾部的破坏要等四阶段之后才开放。

技巧：元素弹在持武器状态下用 L2 直接发射即可，不要先收武器。`,"hu-pi-shou":`护辟兽弱火与龙属性（也有资料把冰、雷列为次级弱点），推荐火或双属性的太刀、大剑、盾斧；它防御力高、正面冲撞不会后退，不必强行硬拼长连段，推荐机动性高、能贴身绕后的武器。

主要招式是前爪大开大阖：「单手爪击」会举爪蓄力后拍下再向前冲，属于多段伤害，一旦被抓住要掉一大截血，看到抬爪就翻滚；「趴地突刺」会把头侧贴地面，前摇很短，要向两侧翻；「多段突刺」前会双手张开并发出白光蓄力，然后产生大范围地面爆炸，那道光就是提示，立刻拉开距离。

它的酸性唾液会让玩家暂时降低防御，贴身时不要停太长时间。

优先破坏前腿（弱点部位）和尾毛：前肢破坏报酬必定出爪，尾毛必定出毛；前腿破坏后它更容易因失衡倒地。

技巧：地面会生成结晶，用弹弓打爆能造成额外伤害，也可以趁机打出倒地。`};function Ge(e){return We[e]||null}var Ke=[{name:`火龙一族`,slugs:[`huo-long`,`ci-huo-long`,`hu-huo-long`]},{name:`锁刃龙一族`,slugs:[`suo-ren-long`,`hu-suo-ren-long`]},{name:`辟兽一族`,slugs:[`pi-shou`,`hu-pi-shou`]},{name:`桃毛兽一族`,slugs:[`tao-mao-shou-wang`,`tao-mao-shou`]},{name:`雪狮子一族`,slugs:[`xue-shi-zi-wang`,`xue-shi-zi`]},{name:`影蜘蛛一族`,slugs:[`ying-zhi-zhu`,`zhi-ying-zhi-zhu`]},{name:`怪鸟一族`,slugs:[`guai-niao`,`du-guai-niao`]},{name:`欧米茄一族`,slugs:[`you-xing-ou-mi-qie`,`wei-xing-ou-mi-qie`]}],Q=new Map;for(let e of Ke)for(let t of e.slugs)Q.set(t,{family:e.name,others:e.slugs.filter(e=>e!==t)});function qe(e,t){if(!e)return{family:``,list:[]};let n=Q.get(e.slug);if(!n?.others.length)return{family:``,list:[]};let r=new Map(t.map(e=>[e.slug,e])),i=n.others.map(e=>r.get(e)).filter(Boolean).sort((e,t)=>{let n=e.hunterRankPoint??0,r=t.hunterRankPoint??0;return n===r?e.name.localeCompare(t.name,`zh-Hans-CN`):n-r});return{family:n.family,list:i}}var Je={key:0,class:`px-4 py-16 text-center text-sm text-parch-dim`},Ye={key:1,class:`px-4 py-16 text-center`},Xe={key:2,class:`px-3 pb-20 pt-3`},Ze={key:0,class:`mb-3 flex flex-wrap gap-1`,"aria-label":`小节跳转`},Qe=[`onClick`],$e={class:`relative mb-3 flex gap-3 rounded-2xl border border-ink-line bg-ink-card p-3`},et=[`aria-label`,`aria-pressed`],tt={class:`size-24 shrink-0 overflow-hidden rounded-xl bg-black`},nt=[`src`,`alt`],rt={key:1,class:`flex size-full items-center justify-center text-2xl text-parch-dim/30`},it={class:`min-w-0 flex-1`},at={class:`text-lg font-bold leading-tight text-parch`},ot={class:`mt-1.5 flex flex-wrap items-center gap-1.5`},st={key:0,class:`rounded bg-ink-soft px-1.5 py-0.5 text-[11px] text-parch-dim`},ct={key:1,class:`rounded bg-ink-soft px-1.5 py-0.5 text-[11px] tabular-nums text-parch-dim`},lt={key:0,class:`mt-2 line-clamp-4 text-xs leading-relaxed text-parch-dim`},ut={key:1,class:`mb-3 grid grid-cols-3 gap-2`},dt={key:0,class:`rounded-xl border border-ink-line bg-ink-card px-2 py-2.5 text-center`},ft={class:`mt-0.5 truncate text-sm font-bold text-parch`},pt={key:1,class:`rounded-xl border border-ink-line bg-ink-card px-2 py-2.5 text-center`},mt={class:`mt-0.5 text-sm font-bold tabular-nums text-parch`},ht={key:2,class:`rounded-xl border border-ink-line bg-ink-card px-2 py-2.5 text-center`},gt={class:`mt-0.5 text-sm font-bold tabular-nums text-parch`},_t={key:2,id:`sec-advice`,class:`mb-4 scroll-mt-16`},vt={key:3,id:`sec-guide`,class:`mb-4 scroll-mt-16`},yt={id:`sec-hitzone`,class:`mb-4 scroll-mt-16`},bt={class:`mb-2 flex items-center gap-2 px-0.5 text-sm font-semibold text-parch`},xt={class:`text-[11px] font-normal text-parch-dim`},St={key:1,class:`rounded-xl border border-ink-line bg-ink-card px-3 py-4 text-center text-xs text-parch-dim`},Ct={key:4,id:`sec-durability`,class:`mb-4 scroll-mt-16`},wt={class:`overflow-hidden rounded-xl border border-ink-line bg-ink-card`},Tt=[`title`],Et={class:`min-w-0 flex-1`},Dt={class:`flex items-baseline gap-2`},Ot={class:`text-sm font-medium text-parch`},kt={key:0,class:`text-xs tabular-nums text-parch-dim`},At={key:0,class:`mt-0.5 break-words text-[11px] leading-relaxed text-parch-dim`},jt={key:5,id:`sec-status`,class:`mb-4 scroll-mt-16`},Mt={class:`space-y-2`},Nt={class:`mb-1.5 text-sm font-medium text-parch`},$={class:`grid grid-cols-3 gap-2 text-[11px]`},Pt={class:`mt-0.5 tabular-nums text-parch`},Ft={class:`mt-0.5 tabular-nums text-parch`},It={class:`mt-0.5 tabular-nums text-parch`},Lt={key:6,id:`sec-rewards`,class:`mb-4 scroll-mt-16`},Rt={class:`overflow-hidden rounded-xl border border-ink-line bg-ink-card`},zt=[`data-item`],Bt={class:`min-w-0 flex-1 truncate text-xs text-parch`},Vt={key:0,class:`shrink-0 text-[11px] text-parch-dim`},Ht={key:1,class:`w-12 shrink-0 text-right text-[11px] font-semibold tabular-nums text-gold`},Ut={__name:`MonsterDetailView`,setup(e){let t=_(),{monsters:n,loading:r,load:i}=te(),{settings:a}=ee(),s=C(null),S=C(!1),w=C(!1);async function E(){n.value.length||await i();let e=n.value.find(e=>e.slug===t.params.slug);s.value=e||null,S.value=!e,w.value=!1}let D=O(()=>t.hash?new URLSearchParams(t.query).get(`item`):null);function k(){let e=D.value;if(!e)return null;let t=[...document.querySelectorAll(`#sec-rewards [data-item]`)].filter(t=>t.dataset.item===e);return t.find(e=>e.className.includes(`bg-gold`))||t[0]||null}function F(e){return e.item===D.value?e.source!==`目标报酬`||String(e.rate||``)!==`100%`:!1}c(async()=>{await E(),t.hash&&L()});function L(){if(!t.hash)return;let e=0,n=-1,r=0,i=()=>{let t=k()||document.getElementById(`sec-rewards`);if(!t){r++<60&&setTimeout(i,100);return}let a=Math.round(t.getBoundingClientRect().top+window.scrollY-72);Math.abs(a-n)<3?e++:e=0,n=a,document.documentElement.scrollTop=Math.max(0,a),document.body.scrollTop=Math.max(0,a),e<3&&r++<25&&setTimeout(i,100)};setTimeout(i,0)}p(()=>t.params.slug,E);let R=O(()=>s.value?P(s.value,a.weaponType):null),z=O(()=>s.value?.hitzones?.length?M(s.value.hitzones):[]),B=O(()=>s.value?.icon?s.value.icon:``),V=e=>N[e]||`#8A8071`,{isFav:H,toggle:U}=ne(),W=A();function G(){let e=U(s.value.slug);W.show(e?`已收藏「${s.value.name}」`:`已取消收藏「${s.value.name}」`)}let K=O(()=>s.value?Ge(s.value.slug):null),q=O(()=>s.value?qe(s.value,n.value):{family:``,list:[]}),J=O(()=>{let e=s.value;if(!e)return[];let t=[];return R.value&&!R.value.empty&&t.push({id:`sec-advice`,label:`出战建议`}),K.value&&t.push({id:`sec-guide`,label:`狩猎攻略`}),z.value.length&&t.push({id:`sec-hitzone`,label:`肉质部位`}),e.parts?.length&&t.push({id:`sec-durability`,label:`耐久`}),e.statusResist?.length&&t.push({id:`sec-status`,label:`状态抗性`}),e.rewards?.length&&t.push({id:`sec-rewards`,label:`素材`}),t});function Y(e){let t=document.getElementById(e);if(!t)return;let n=t.getBoundingClientRect().top+window.scrollY-64;window.scrollTo({top:n,behavior:`smooth`})}return(e,t)=>d(r)&&!s.value?(h(),g(`div`,Je,` 加载中… `)):S.value?(h(),g(`div`,Ye,[v(d(I),{size:32,class:`mx-auto mb-3 text-parch-dim/40`}),t[1]||=T(`p`,{class:`text-sm text-parch-dim`},`找不到这只怪物`,-1)])):s.value?(h(),g(`div`,Xe,[J.value.length>1?(h(),g(`nav`,Ze,[(h(!0),g(y,null,l(J.value,e=>(h(),g(`button`,{key:e.id,type:`button`,class:`whitespace-nowrap rounded-full border border-ink-line bg-ink-card px-2 py-1 text-[10.5px] text-parch-dim active:border-gold/50 active:text-gold`,onClick:t=>Y(e.id)},u(e.label),9,Qe))),128))])):b(``,!0),T(`div`,$e,[T(`button`,{type:`button`,class:`absolute right-1.5 top-1.5 z-10 flex size-9 items-center justify-center rounded-full active:scale-90`,"aria-label":d(H)(s.value.slug)?`取消收藏`:`收藏`,"aria-pressed":d(H)(s.value.slug),onClick:G},[v(d(o),{size:19,class:f(d(H)(s.value.slug)?`fill-gold text-gold`:`text-parch-dim/40`)},null,8,[`class`])],8,et),T(`div`,tt,[w.value?(h(),g(`div`,rt,` ? `)):(h(),g(`img`,{key:0,src:B.value,alt:s.value.name,class:`icon-blend size-full object-cover`,onError:t[0]||=e=>w.value=!0},null,40,nt))]),T(`div`,it,[T(`h2`,at,u(s.value.name),1),T(`div`,ot,[s.value.species?(h(),g(`span`,st,u(s.value.species),1)):b(``,!0),T(`span`,{class:f([`rounded px-1.5 py-0.5 text-[11px] font-medium`,s.value.isLarge?`bg-gold/15 text-gold`:`bg-ink-soft text-parch-dim`])},u(s.value.isLarge?`大型`:`小型`),3),s.value.hunterRankPoint?(h(),g(`span`,ct,` 可获HR点数`+u(s.value.hunterRankPoint),1)):b(``,!0)]),s.value.summary?(h(),g(`p`,lt,u(s.value.summary),1)):b(``,!0)])]),s.value.info&&Object.keys(s.value.info).length?(h(),g(`div`,ut,[s.value.info.Species?(h(),g(`div`,dt,[t[2]||=T(`div`,{class:`text-[10px] text-parch-dim`},`物种`,-1),T(`div`,ft,u(s.value.info.Species),1)])):b(``,!0),s.value.info.BaseHealth?(h(),g(`div`,pt,[t[3]||=T(`div`,{class:`text-[10px] text-parch-dim`},`基础体力`,-1),T(`div`,mt,u(s.value.info.BaseHealth),1)])):b(``,!0),s.value.info.HunterRankPoint?(h(),g(`div`,ht,[t[4]||=T(`div`,{class:`text-[10px] text-parch-dim`},`可获HR点数`,-1),T(`div`,gt,u(s.value.info.HunterRankPoint),1)])):b(``,!0)])):b(``,!0),R.value&&!R.value.empty?(h(),g(`div`,_t,[v(Se,{advice:R.value},null,8,[`advice`])])):b(``,!0),K.value?(h(),g(`div`,vt,[v(Ne,{text:K.value},null,8,[`text`])])):b(``,!0),v(Ue,{monsters:q.value.list,family:q.value.family},null,8,[`monsters`,`family`]),T(`section`,yt,[T(`h3`,bt,[t[5]||=j(` 肉质 `,-1),T(`span`,xt,u(z.value.length)+` 个部位`,1)]),z.value.length?(h(),x(ke,{key:0,groups:z.value},null,8,[`groups`])):(h(),g(`div`,St,` 该怪物无肉质数据 `))]),s.value.parts?.length?(h(),g(`section`,Ct,[t[6]||=T(`h3`,{class:`mb-2 px-0.5 text-sm font-semibold text-parch`},`部位耐久`,-1),T(`div`,wt,[(h(!0),g(y,null,l(s.value.parts,(e,t)=>(h(),g(`div`,{key:t,class:f([`flex items-start gap-2.5 px-3 py-2.5`,t>0?`border-t border-ink-line/60`:``])},[T(`span`,{class:`mt-1 size-2 shrink-0 rounded-full`,style:m({backgroundColor:V(e.sever)}),title:e.sever},null,12,Tt),T(`div`,Et,[T(`div`,Dt,[T(`span`,Ot,u(e.part),1),e.hp!==null&&e.hp!==void 0?(h(),g(`span`,kt,u(e.hp)+` HP `,1)):b(``,!0)]),e.woundRaw?(h(),g(`div`,At,u(e.woundRaw),1)):b(``,!0)])],2))),128))])])):b(``,!0),s.value.statusResist?.length?(h(),g(`section`,jt,[t[10]||=T(`h3`,{class:`mb-2 px-0.5 text-sm font-semibold text-parch`},`状态抗性`,-1),T(`div`,Mt,[(h(!0),g(y,null,l(s.value.statusResist,(e,n)=>(h(),g(`div`,{key:n,class:`rounded-xl border border-ink-line bg-ink-card px-3 py-2.5`},[T(`div`,Nt,u(e.type),1),T(`div`,$,[T(`div`,null,[t[7]||=T(`div`,{class:`text-parch-dim`},`累积值`,-1),T(`div`,Pt,u(e.buildUp??`—`),1)]),T(`div`,null,[t[8]||=T(`div`,{class:`text-parch-dim`},`伤害`,-1),T(`div`,Ft,u(e.damage??`—`),1)]),T(`div`,null,[t[9]||=T(`div`,{class:`text-parch-dim`},`衰减`,-1),T(`div`,It,u(e.decay??`—`),1)])])]))),128))])])):b(``,!0),s.value.rewards?.length?(h(),g(`section`,Lt,[t[11]||=T(`h3`,{class:`mb-2 px-0.5 text-sm font-semibold text-parch`},`素材`,-1),T(`div`,Rt,[(h(!0),g(y,null,l(s.value.rewards,(e,t)=>(h(),g(`div`,{key:t,"data-item":e.item,class:f([`flex items-center gap-2 px-3 py-2 transition-colors`,[t>0?`border-t border-ink-line/60`:``,F(e)?`bg-gold/15`:``]])},[T(`span`,Bt,u(e.item),1),e.source?(h(),g(`span`,Vt,u(e.source),1)):b(``,!0),e.rate?(h(),g(`span`,Ht,u(e.rate),1)):b(``,!0)],10,zt))),128))])])):b(``,!0)])):b(``,!0)}};export{Ut as default};