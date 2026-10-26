import { ref, computed } from 'vue'

const BASE = import.meta.env.BASE_URL

let cache = null
let loading = null

/** 加载 Sunbreak 怪物数据（单例缓存） */
export function useSunbreakMonsters() {
  const monsters = ref(cache || [])
  const error = ref(null)
  const pending = ref(false)

  async function load() {
    if (cache) {
      monsters.value = cache
      return cache
    }
    if (loading) {
      await loading
      monsters.value = cache || []
      return cache
    }
    pending.value = true
    loading = (async () => {
      try {
        const res = await fetch(`${BASE}data/monsters_sunbreak.json`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        cache = await res.json()
        monsters.value = cache
        return cache
      } catch (e) {
        error.value = e.message
        cache = []
        return []
      } finally {
        pending.value = false
        loading = null
      }
    })()
    return loading
  }

  function bySlug(slug) {
    return monsters.value.find((m) => m.slug === slug) || null
  }

  return { monsters, error, pending, load, bySlug }
}

/** 三档任务等级 */
export const RANKS = [
  { key: '下位', label: '下位' },
  { key: '上位', label: '上位' },
  { key: '大师', label: '大师' },
]
