import { ref, computed } from 'vue'

/**
 * 收藏，按游戏分库
 * - 荒野：mhw.favorites
 * - Sunbreak：mhw.favorites.sunbreak
 */
const DEFAULTS = 'mhw.favorites'

function storageKey(game) {
  return game && game !== 'wilds' ? `${DEFAULTS}.${game}` : DEFAULTS
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

const stores = new Map()
const counts = new Map()

function storeFor(game) {
  const key = storageKey(game)
  if (!stores.has(key)) {
    stores.set(key, ref(read(key)))
  }
  return stores.get(key)
}

export function useFavorites(game = 'wilds') {
  const KEY = storageKey(game)
  const favorites = storeFor(game)

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(favorites.value))
  }

  const isFav = (slug) => favorites.value.includes(slug)

  function toggle(slug) {
    const i = favorites.value.indexOf(slug)
    if (i >= 0) {
      favorites.value.splice(i, 1)
      persist()
      return false
    }
    favorites.value.push(slug)
    persist()
    return true
  }

  if (!counts.has(KEY)) counts.set(KEY, computed(() => favorites.value.length))

  return {
    favorites,
    count: counts.get(KEY),
    isFav,
    toggle,
  }
}
