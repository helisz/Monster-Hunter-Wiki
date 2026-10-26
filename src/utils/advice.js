export const ELEMENTS = [
  { key: 'fire', icon: 'element_fire', label: '火' },
  { key: 'water', icon: 'element_water', label: '水' },
  { key: 'thunder', icon: 'element_thunder', label: '雷' },
  { key: 'ice', icon: 'element_ice', label: '冰' },
  { key: 'dragon', icon: 'element_dragon', label: '龙' },
]

export const WEAPON_COLUMN = {
  slash: '斩',
  strike: '打',
  shell: '弹',
}

const GOOD_THRESHOLD = 45
const BAD_THRESHOLD = 20
const MAX_GOOD = 5
const MAX_BAD = 5

/** 只取常态行（state === null），同部位取最大值 */
export function normalRows(hitzones) {
  if (!Array.isArray(hitzones)) return []
  const map = new Map()
  for (const h of hitzones) {
    if (!h || h.state !== null) continue
    const prev = map.get(h.part)
    if (!prev) {
      map.set(h.part, h)
    } else {
      // 同部位多常态行（罕见），逐字段取大
      const merged = { ...prev }
      for (const k of ['slash', 'strike', 'shell', ...ELEMENTS.map((e) => e.key), 'stun']) {
        merged[k] = Math.max(prev[k] ?? 0, h[k] ?? 0)
      }
      map.set(h.part, merged)
    }
  }
  return [...map.values()]
}

/**
 * 计算打击建议
 * @param {object} monster
 * @param {'slash'|'strike'|'shell'|null} weaponType
 */
export function buildAdvice(monster, weaponType) {
  if (!monster || !weaponType) return null
  if (!['slash', 'strike', 'shell'].includes(weaponType)) return null

  const rows = normalRows(monster.hitzones)
  const states = Array.isArray(monster.hitzones)
    ? [...new Set(monster.hitzones.map((h) => h.state).filter((s) => s === '弱点' || s === '可破坏'))]
    : []

  if (rows.length === 0) {
    return { empty: true, reason: '该怪物无肉质数据', weaponType, states: [] }
  }

  // 属性推荐：常态行里每个属性取最大值，降序取前 2（>0 才显示）
  const elementRank = ELEMENTS.map((e) => ({
    ...e,
    value: Math.max(...rows.map((r) => r[e.key] ?? 0)),
  }))
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)

  // 该打 / 别打：按当前武器列
  const scored = rows.map((r) => ({ part: r.part, value: r[weaponType] ?? 0 }))
  const good = scored
    .filter((s) => s.value >= GOOD_THRESHOLD)
    .sort((a, b) => b.value - a.value)
    .slice(0, MAX_GOOD)
  const bad = scored
    .filter((s) => s.value <= BAD_THRESHOLD)
    .sort((a, b) => a.value - b.value)
    .slice(0, MAX_BAD)

  // 弱点 / 可破坏：从全部 hitzones 的 state 里取部位名，去重
  const specialParts = [
    ...new Set(
      (monster.hitzones || [])
        .filter((h) => h.state === '弱点' || h.state === '可破坏')
        .map((h) => h.part)
    ),
  ]

  return {
    empty: false,
    weaponType,
    elementRank,
    good,
    bad,
    states,
    specialParts,
    noGood: good.length === 0,
  }
}

/** 肉质表：按部位分组，保留原始多行 */
export function groupHitzones(hitzones) {
  if (!Array.isArray(hitzones)) return []
  const order = []
  const map = new Map()
  for (const h of hitzones) {
    if (!h) continue
    if (!map.has(h.part)) {
      map.set(h.part, [])
      order.push(h.part)
    }
    map.get(h.part).push(h)
  }
  return order.map((part) => ({ part, rows: map.get(part) }))
}

export const SEVER_COLORS = {
  RED: '#D0483C',
  ORANGE: '#E08A3C',
  GREEN: '#5A9E5A',
  WHITE: '#D9D5CC',
  BLUE: '#4C7FC4',
  YELLOW: '#D6BC45',
  PURPLE: '#8C63B5',
}
