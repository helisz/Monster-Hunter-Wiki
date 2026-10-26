import { ref } from 'vue'

const BASE = import.meta.env.BASE_URL

let cache = null
let loading = null

/** 加载 MH3G 武器数据（单例缓存） */
export function useMh3gWeapons() {
  const weapons = ref(cache || {})
  const error = ref(null)
  const pending = ref(false)

  async function load() {
    if (cache) {
      weapons.value = cache
      return cache
    }
    if (loading) {
      await loading
      weapons.value = cache || {}
      return cache
    }
    pending.value = true
    loading = (async () => {
      try {
        const res = await fetch(`${BASE}data/weapons_mh3g.json`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        cache = await res.json()
        weapons.value = cache
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

  return { weapons, error, pending, load }
}

/** 武器种类（顺序固定） */
export const WEAPON_CATS = [
  '大剑', '太刀', '片手剑', '双刀', '大锤', '狩猎笛',
  '长枪', '铳枪', '斩斧', '轻弩', '重弩', '弓',
]

/** 种类短标（手机上够用） */
export const CAT_ABBR = {
  大剑: '大剑', 太刀: '太刀', 片手剑: '片手', 双刀: '双刀',
  大锤: '大锤', 狩猎笛: '笛', 长枪: '长枪', 铳枪: '铳枪',
  斩斧: '斩斧', 轻弩: '轻弩', 重弩: '重弩', 弓: '弓',
}

/** 远端武器（弩/弓）判定 */
export const RANGED = new Set(['轻弩', '重弩', '弓'])
