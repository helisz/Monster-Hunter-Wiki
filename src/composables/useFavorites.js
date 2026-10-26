import { ref, computed } from 'vue'

const KEY = 'mhw.favorites'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

// 单例状态，所有组件共享
const favorites = ref(read())

function persist() {
  localStorage.setItem(KEY, JSON.stringify(favorites.value))
}

export function useFavorites() {
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

  return {
    favorites,
    count: computed(() => favorites.value.length),
    isFav,
    toggle,
  }
}
