import { reactive, watch } from 'vue'

const KEY = 'mhw.settings'

const DEFAULTS = {
  game: null,          // 'wilds'
  weaponType: null,    // 'slash' | 'strike' | 'shell'
  viewMode: 'card',    // 'card' | 'list'
}

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw)
    return { ...DEFAULTS, ...parsed }
  } catch {
    return { ...DEFAULTS }
  }
}

const settings = reactive(read())

watch(
  settings,
  (val) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(val))
    } catch {
      /* 隐私模式写入失败，忽略 */
    }
  },
  { deep: true }
)

export const WEAPON_TYPES = [
  { key: 'slash', hit: 'hit_slash', label: '斩' },
  { key: 'strike', hit: 'hit_strike', label: '打' },
  { key: 'shell', hit: 'hit_shell', label: '弹' },
]

export function useSettings() {
  function setWeaponType(key) {
    settings.weaponType = key
  }
  function setViewMode(mode) {
    settings.viewMode = mode
  }
  function setGame(game) {
    settings.game = game
  }
  return { settings, setWeaponType, setViewMode, setGame, WEAPON_TYPES }
}
