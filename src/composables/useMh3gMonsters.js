import { ref } from 'vue'

const BASE = import.meta.env.BASE_URL

let cache = null
let loading = null

/** 加载 MH3G 怪物数据（单例缓存） */
export function useMh3gMonsters() {
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
        const res = await fetch(`${BASE}data/monsters_mh3g.json`)
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

/** 三档任务等级（3G 没有大师，G 级替代） */
export const MH3G_RANKS = [
  { key: '下位', label: '下位' },
  { key: '上位', label: '上位' },
  { key: 'G级', label: 'G级' },
]
