/**
 * 怪物血统家族（不是物种分类）
 * 同族的怪物共用一个家族：原种 / 亚种 / 稀少种 / 护龙种变体
 * 只展示数据库里实际存在的成员，按 HR 点数升序（近似出现时间）
 */
export const FAMILIES = [
  {
    name: '火龙一族',
    // 雄火龙 / 雌火龙 / 护火龙。苍火龙、樱火龙、银火龙、金火龙 Wilds 未收录
    slugs: ['huo-long', 'ci-huo-long', 'hu-huo-long'],
  },
  { name: '锁刃龙一族', slugs: ['suo-ren-long', 'hu-suo-ren-long'] },
  { name: '辟兽一族', slugs: ['pi-shou', 'hu-pi-shou'] },
  { name: '桃毛兽一族', slugs: ['tao-mao-shou-wang', 'tao-mao-shou'] },
  { name: '雪狮子一族', slugs: ['xue-shi-zi-wang', 'xue-shi-zi'] },
  { name: '影蜘蛛一族', slugs: ['ying-zhi-zhu', 'zhi-ying-zhi-zhu'] },
  {
    name: '怪鸟一族',
    // 怪鸟 / 毒怪鸟。青怪鸟等 Wilds 未收录
    slugs: ['guai-niao', 'du-guai-niao'],
  },
  { name: '欧米茄一族', slugs: ['you-xing-ou-mi-qie', 'wei-xing-ou-mi-qie'] },
]

/** slug → { family, others: 其它成员 slug 数组 } */
const FAMILY_OF = new Map()
for (const fam of FAMILIES) {
  for (const slug of fam.slugs) {
    FAMILY_OF.set(slug, {
      family: fam.name,
      others: fam.slugs.filter((s) => s !== slug),
    })
  }
}

/**
 * 取某只怪物的同族成员（只含数据库里存在的）
 * @param {object} monster 当前怪物
 * @param {Array} monsters 全量怪物
 * @returns {{ family: string, list: Array }}
 */
export function getRelatedMonsters(monster, monsters) {
  if (!monster) return { family: '', list: [] }

  const entry = FAMILY_OF.get(monster.slug)
  if (!entry?.others.length) return { family: '', list: [] }

  const bySlug = new Map(monsters.map((m) => [m.slug, m]))

  const list = entry.others
    .map((s) => bySlug.get(s))
    .filter(Boolean)
    .sort((a, b) => {
      const av = a.hunterRankPoint ?? 0
      const bv = b.hunterRankPoint ?? 0
      if (av !== bv) return av - bv
      return a.name.localeCompare(b.name, 'zh-Hans-CN')
    })

  return { family: entry.family, list }
}
