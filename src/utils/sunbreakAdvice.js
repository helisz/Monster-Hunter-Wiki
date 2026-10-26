/**
 * Sunbreak 出战建议
 * 与 Wilds 版逻辑一致：只看常态肉质（state === 0 -> null），阈值 45 / 20，
 * 属性取前 2，优先/避开各最多 5 个。
 *
 * Rise 差异：
 * - hitzones[].state 是数字 0-6，0 表示常态（解析时已转成 null）
 * - 没有 hunterRankPoint / baseHealth
 */

export const WEAPONS = [
  { key: 'slash', field: 'slash', label: '斩', icon: 'hit_slash' },
  { key: 'strike', field: 'strike', label: '打', icon: 'hit_strike' },
  { key: 'shell', field: 'shell', label: '弹', icon: 'hit_shell' },
]

export const ELEMENTS = [
  { field: 'fire', label: '火', icon: 'element_fire' },
  { field: 'water', label: '水', icon: 'element_water' },
  { field: 'thunder', label: '雷', icon: 'element_thunder' },
  { field: 'ice', label: '冰', icon: 'element_ice' },
  { field: 'dragon', label: '龙', icon: 'element_dragon' },
]

const GOOD = 45
const BAD = 20
const MAX_LIST = 5

/** 只取常态行（state 为 null），同部位多行取各字段最大 */
function normalRows(hitzones) {
  const rows = (hitzones || []).filter((h) => h.state === null)
  const byPart = new Map()
  for (const h of rows) {
    const prev = byPart.get(h.part)
    if (!prev) {
      byPart.set(h.part, { ...h })
    } else {
      for (const k of ['slash', 'strike', 'shell', 'fire', 'water', 'thunder', 'ice', 'dragon', 'stun']) {
        const a = prev[k]
        const b = h[k]
        if (typeof b === 'number' && (typeof a !== 'number' || b > a)) prev[k] = b
      }
    }
  }
  return [...byPart.values()]
}

/** 按武器列算 good/bad 部位 */
function rankParts(rows, field) {
  const scored = rows
    .filter((r) => typeof r[field] === 'number')
    .map((r) => ({ part: r.part, value: r[field] }))
    .sort((a, b) => b.value - a.value)

  const good = scored.filter((s) => s.value >= GOOD).slice(0, MAX_LIST)
  const bad = scored.filter((s) => s.value <= BAD).slice(-MAX_LIST).reverse()
  return { good, bad }
}

/** 属性排序（前 2 名有值的） */
function rankElements(rows) {
  const totals = new Map()
  for (const el of ELEMENTS) {
    let max = null
    for (const r of rows) {
      const v = r[el.field]
      if (typeof v === 'number' && (max === null || v > max)) max = v
    }
    if (max !== null && max > 0) totals.set(el.field, max)
  }
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([field, value]) => {
      const el = ELEMENTS.find((e) => e.field === field)
      return { ...el, value }
    })
}

/** 计算推荐武器：优先部位数 * 10 + 平均肉质，取最高 */
function suggestWeapon(rows) {
  let best = null
  let bestScore = -Infinity
  for (const w of WEAPONS) {
    const vals = rows.map((r) => r[w.field]).filter((v) => typeof v === 'number')
    if (!vals.length) continue
    const goodCount = vals.filter((v) => v >= GOOD).length
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    const score = goodCount * 10 + avg
    if (score > bestScore) {
      bestScore = score
      best = w.key
    }
  }
  return best
}

/**
 * 构建出战建议
 * @param {object} monster
 * @param {'slash'|'strike'|'shell'|null} weaponType
 */
export function buildSunbreakAdvice(monster, weaponType) {
  if (!monster) return null
  const rows = normalRows(monster.hitzones)
  if (!rows.length) return null

  const suggestedWeapon = suggestWeapon(rows)
  const elements = rankElements(rows)

  if (!weaponType) {
    return { empty: true, suggestedWeapon, elements, weaponType: null }
  }

  const weapon = WEAPONS.find((w) => w.key === weaponType)
  if (!weapon) return null

  const { good, bad } = rankParts(rows, weapon.field)

  return {
    empty: false,
    weaponType,
    weapon,
    suggestedWeapon,
    elements,
    good,
    bad,
  }
}
