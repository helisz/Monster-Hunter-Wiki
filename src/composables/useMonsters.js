import { ref } from 'vue'

const monsters = ref([])
const loading = ref(false)
const error = ref(null)
let loaded = false
let pending = null

const BASE = import.meta.env.BASE_URL

async function load() {
  if (loaded) return monsters.value
  if (pending) return pending
  loading.value = true
  error.value = null
  pending = (async () => {
    try {
      const res = await fetch(`${BASE}data/monsters.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      monsters.value = Array.isArray(data) ? data : []
      loaded = true
      return monsters.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      return []
    } finally {
      loading.value = false
      pending = null
    }
  })()
  return pending
}

function bySlug(slug) {
  return monsters.value.find((m) => m.slug === slug) || null
}

/** 从 icon URL 取出文件名，用于本地图标回退 */
function iconBasename(monster) {
  if (!monster?.icon) return null
  const name = monster.icon.split('/').pop()
  return name || null
}

export function useMonsters() {
  return { monsters, loading, error, load, bySlug, iconBasename }
}
