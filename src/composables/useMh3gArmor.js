import { ref } from 'vue'

const BASE = import.meta.env.BASE_URL

let cache = null
let loading = null

export function useMh3gArmor() {
  const armor = ref(cache || {})
  const error = ref(null)
  const pending = ref(false)

  async function load() {
    if (cache) {
      armor.value = cache
      return cache
    }
    if (loading) {
      await loading
      armor.value = cache || {}
      return cache
    }
    pending.value = true
    loading = (async () => {
      try {
        const res = await fetch(`${BASE}data/armor_mh3g.json`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        cache = await res.json()
        armor.value = cache
        return cache
      } catch (e) {
        error.value = e.message
        cache = {}
        return {}
      } finally {
        pending.value = false
        loading = null
      }
    })()
    return loading
  }

  return { armor, error, pending, load }
}

export const ARMOR_CATS = ['剑士防具', '射手防具', '共通防具']
export const ARMOR_CAT_ABBR = {
  剑士防具: '剑士',
  射手防具: '射手',
  共通防具: '共通',
}

/** 五属性 */
export const RES_COLS = [
  { key: 'fire', label: '火', icon: 'element_fire' },
  { key: 'water', label: '水', icon: 'element_water' },
  { key: 'thunder', label: '雷', icon: 'element_thunder' },
  { key: 'ice', label: '冰', icon: 'element_ice' },
  { key: 'dragon', label: '龙', icon: 'element_dragon' },
]
