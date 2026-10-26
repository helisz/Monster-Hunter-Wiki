/**
 * 解析部位耐久表的 Break 原始串，转成中文可读描述
 *
 * 原始格式（Kiranico 内部参数）：
 *   "300 (BreakLevel: 1, IgnoreCondition: Equal, IgnoreCheckCount: 1)"
 *   "100 (BreakLevel: 1, IgnoreCondition: None, IgnoreCheckCount: 0)"
 *   "150 (PermitDamageAttr: Slash)"
 *   "170 (...) 200 (...) 350 (...)"   ← 多段破坏
 *
 * 语义：
 *   BreakLevel       = 第几段破坏（1 = 首次破坏）
 *   IgnoreCheckCount = 累积多少次才破（0 = 一次、1 = 累计 1 次…）
 *   IgnoreCondition  = 多次判定的比较条件（Equal = 需同一部位/同样伤害，None = 任意）
 *   PermitDamageAttr = 只能用某种属性才能破坏（Slash = 斩击）
 */

const ATTR_CN = {
  Slash: '斩击',
  Strike: '打击',
  Shell: '弹药',
  Fire: '火属性',
  Water: '水属性',
  Thunder: '雷属性',
  Ice: '冰属性',
  Dragon: '龙属性',
}

const COND_CN = {
  Equal: '需同部位累计',
  None: null,
  Less: '需低于',
  Greater: '需高于',
}

/** 解析单段破坏值 */
function parseSegment(text) {
  const m = text.match(/^(\d+)\s*\((.*)\)$/)
  if (!m) return null

  const value = Number(m[1])
  const params = m[2]

  const pick = (name) => {
    const r = params.match(new RegExp(`${name}:\\s*([^,)]+)`))
    return r ? r[1].trim() : null
  }

  const level = pick('BreakLevel')
  const cond = pick('IgnoreCondition')
  const count = pick('IgnoreCheckCount')
  const attr = pick('PermitDamageAttr')

  const hints = []

  if (level && Number(level) > 1) hints.push(`第 ${level} 段破坏`)

  const eqCond = COND_CN[cond]
  const cnt = count !== null ? Number(count) : 0
  if (cnt > 0) {
    hints.push(eqCond ? `${eqCond} ${cnt} 次` : `累计 ${cnt} 次`)
  }

  if (attr) {
    hints.push(`仅${ATTR_CN[attr] || attr}`)
  }

  return { value, hints }
}

/**
 * 把 woundRaw 原始串转成结构化段落
 * @param {string} raw
 * @returns {{value:number, hints:string[]}[]}
 */
export function parseBreak(raw) {
  if (!raw) return []

  // 按 ") " 切分多段（每段都是 "数字 (参数)"）
  const segs = raw
    .split(/\)\s+(?=\d+\s*\()/)
    .map((s) => (s.endsWith(')') ? s : `${s})`))

  return segs.map(parseSegment).filter(Boolean)
}

/**
 * 纯文本版（用于表格单行显示）
 * @param {string} raw
 * @returns {string}
 */
export function breakText(raw) {
  const segs = parseBreak(raw)
  if (!segs.length) return raw || '—'

  return segs
    .map(({ value, hints }) => (hints.length ? `${value}（${hints.join('，')}）` : `${value}`))
    .join(' → ')
}
