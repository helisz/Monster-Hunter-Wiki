import { ref, computed } from 'vue'

/**
 * 收藏的掉落查询条件
 * - 荒野：mhw.dropQueries
 * - 曙光：mhw.dropQueries.sunbreak
 *
 * 每条记录：{ item: '素材名', at: 时间戳 }
 */
function storageKey(game) {
  return game === 'sunbreak' ? 'mhw.dropQueries.sunbreak' : 'mhw.dropQueries'
}

const stores = new Map()

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function useDropQueries(game = 'wilds') {
  const KEY = storageKey(game)
  if (!stores.has(KEY)) {
    stores.set(KEY, ref(read(KEY)))
  }
  const saved = stores.get(KEY)

  const MAX = 30

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(saved.value))
  }

  const isSaved = (item) => saved.value.some((q) => q.item === item)

  /** 收藏/取消收藏一个查询条件，返回是否已收藏 */
  function toggle(item) {
    const i = saved.value.findIndex((q) => q.item === item)
    if (i >= 0) {
      saved.value.splice(i, 1)
      persist()
      return false
    }
    saved.value.unshift({ item, at: Date.now() })
    if (saved.value.length > MAX) saved.value.length = MAX
    persist()
    return true
  }

  function remove(item) {
    const i = saved.value.findIndex((q) => q.item === item)
    if (i >= 0) {
      saved.value.splice(i, 1)
      persist()
    }
  }

  const count = computed(() => saved.value.length)

  return { saved, count, isSaved, toggle, remove }
}
