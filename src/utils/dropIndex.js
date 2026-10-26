/**
 * 掉落反查索引
 *
 * 把 monsters[].rewards[] 反向建成 item -> [{ slug, name, icon, rate, source }]
 * 同一只怪可能有多条来源（剥取/破坏/报酬…），合并成一条，保留最高掉率。
 */

/** 解析掉落率字符串 -> 数字（无法解析返回 null） */
function rateNum(rate) {
  if (!rate) return null
  const m = String(rate).match(/([\d.]+)\s*%/)
  return m ? Number(m[1]) : null
}

/**
 * 荒野数据里 source=目标报酬 且 100% 的行只是「该怪有目标报酬池」的占位标记，
 * 不是真实掉率，参与取最大值会污染结果。
 */
function isPlaceholder(r) {
  return r?.source === '目标报酬' && rateNum(r.rate) === 100
}

/**
 * 构建索引
 * @param {Array} monsters
 * @returns {Map<string, Array>} item 名 -> 掉落来源列表
 */
export function buildDropIndex(monsters) {
  const index = new Map()

  for (const m of monsters || []) {
    if (!m.rewards?.length) continue

    // 先按 item 聚合本怪的所有来源
    const perItem = new Map()
    for (const r of m.rewards) {
      const item = r.item
      if (!item) continue
      if (!perItem.has(item)) {
        perItem.set(item, { item, monster: m, entries: [], best: null })
      }
      const rec = perItem.get(item)
      rec.entries.push(r)
      if (isPlaceholder(r)) continue
      const n = rateNum(r.rate)
      if (n !== null && (rec.best === null || n > rec.best)) {
        rec.best = n
        rec.bestRate = r.rate
      }
    }

    // 写入全局索引
    for (const rec of perItem.values()) {
      if (!index.has(rec.item)) index.set(rec.item, [])
      index.get(rec.item).push({
        slug: m.slug,
        name: m.name,
        icon: m.icon,
        isLarge: m.isLarge,
        rate: rec.bestRate || null,
        rateValue: rec.best,
        count: rec.entries.length,
        methods: [
          ...new Set(
            rec.entries.filter((e) => !isPlaceholder(e)).map((e) => e.method || e.source).filter(Boolean)
          ),
        ],
      })
    }
  }

  // 每个 item 的结果按掉率降序
  for (const list of index.values()) {
    list.sort((a, b) => (b.rateValue ?? -1) - (a.rateValue ?? -1))
  }

  return index
}

/**
 * 模糊搜索素材名
 * @param {Map<string, Array>} index
 * @param {string} query
 * @param {number} limit
 */
export function searchItems(index, query, limit = 8) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return []

  const all = [...index.keys()]

  // 1. 前缀匹配
  const prefix = []
  // 2. 包含匹配
  const contains = []
  for (const name of all) {
    const low = name.toLowerCase()
    if (low.startsWith(q)) prefix.push(name)
    else if (low.includes(q)) contains.push(name)
  }

  // 前缀短的优先（更像精确）
  prefix.sort((a, b) => a.length - b.length || a.localeCompare(b, 'zh-Hans-CN'))
  contains.sort((a, b) => a.length - b.length || a.localeCompare(b, 'zh-Hans-CN'))

  return [...prefix, ...contains].slice(0, limit).map((name) => ({
    name,
    count: index.get(name).length,
  }))
}
