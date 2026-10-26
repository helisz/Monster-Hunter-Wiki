/**
 * 同系怪物：以「物种」为家族，列出同物种的全部怪物
 * 排序：先家族亚种（护X ↔ 原种等）在一起，再按 HR 点数升序（近似出现时间）
 */
export const FAMILIES = [
  ['huo-long', 'hu-huo-long'],
  ['suo-ren-long', 'hu-suo-ren-long'],
  ['pi-shou', 'hu-pi-shou'],
  ['tao-mao-shou-wang', 'tao-mao-shou'],
  ['xue-shi-zi-wang', 'xue-shi-zi'],
  ['ying-zhi-zhu', 'zhi-ying-zhi-zhu'],
  ['guai-niao', 'du-guai-niao'],
  ['you-xing-ou-mi-qie', 'wei-xing-ou-mi-qie'],
]

/** slug → 同族里的其它成员 slug 集合 */
const FAMILY_OF = new Map()
for (const group of FAMILIES) {
  for (const slug of group) {
    FAMILY_OF.set(slug, new Set(group.filter((s) => s !== slug)))
  }
}

/**
 * 取某只怪物的同系成员（同物种全部，不含自己）
 * @param {object} monster 当前怪物
 * @param {Array} monsters 全量怪物
 * @returns {Array} 排序后的怪物数组
 */
export function getRelatedMonsters(monster, monsters) {
  if (!monster) return []

  const species = monster.species
  if (!species || species === '????') return []

  const peers = monsters.filter((m) => m.slug !== monster.slug && m.species === species)
  if (!peers.length) return []

  const familySlugs = FAMILY_OF.get(monster.slug) || new Set()

  return peers.sort((a, b) => {
    // 同族亚种优先
    const af = familySlugs.has(a.slug) ? 0 : 1
    const bf = familySlugs.has(b.slug) ? 0 : 1
    if (af !== bf) return af - bf

    // 再按 HR 点数升序（近似出现时间）
    const av = a.hunterRankPoint ?? 0
    const bv = b.hunterRankPoint ?? 0
    if (av !== bv) return av - bv

    return a.name.localeCompare(b.name, 'zh-Hans-CN')
  })
}
