/**
 * MH3G 出战建议
 * 逻辑与荒野/曙光一致：只看常态肉质，阈值 45 / 20，属性取前 2，优先/避开各最多 5。
 *
 * 3G 差异：
 * - hitzones 是扁平数组，每行带 state（'通常时' / '愤怒时' / null）
 * - 有 flinch（部位硬直值），没有 HP
 * - 等级是 下位/上位/G级
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

/** 是否常态行：3G 里 state 为 null 或 '通常时' */
function isNormal(state) {
  return state === null || state === undefined || state === '通常时'
}

/** 只取常态行，同部位多行取各字段最大 */
function normalRows(hitzones) {
  const rows = (hitzones || []).filter((h) => isNormal(h.state))
  const byPart = new Map()
  for (const h of rows) {
    const prev = byPart.get(h.part)
    if (!prev) {
      byPart.set(h.part, { ...h })
    } else {
      for (const k of [
        'slash', 'strike', 'shell',
        'fire', 'water', 'thunder', 'ice', 'dragon', 'stun',
      ]) {
        const a = prev[k]
        const b = h[k]
        if (typeof b === 'number' && (typeof a !== 'number' || b > a)) prev[k] = b
      }
    }
  }
  return [...byPart.values()]
}

function rankParts(rows, field) {
  const scored = rows
    .filter((r) => typeof r[field] === 'number')
    .map((r) => ({ part: r.part, value: r[field] }))
    .sort((a, b) => b.value - a.value)

  const good = scored.filter((s) => s.value >= GOOD).slice(0, MAX_LIST)
  const bad = scored.filter((s) => s.value <= BAD).slice(-MAX_LIST).reverse()
  return { good, bad }
}

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
    .map(([field, value]) => ({ ...ELEMENTS.find((e) => e.field === field), value }))
}

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

export function buildMh3gAdvice(monster, weaponType) {
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
