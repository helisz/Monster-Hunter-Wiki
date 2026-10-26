<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, ChevronDown, Sword, Crosshair } from '@lucide/vue'
import { useMh3gWeapons, WEAPON_CATS, CAT_ABBR } from '../composables/useMh3gWeapons'

const router = useRouter()
const { weapons, pending, error, load } = useMh3gWeapons()

const KEY = 'mhw.mh3gWeaponFilters'
const defaults = { cat: '大剑', keyword: '', rank: 'all', sortKey: 'default' }

function readFilters() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults }
  } catch {
    return { ...defaults }
  }
}

const f = ref(readFilters())
watch(f, (v) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(v))
  } catch {}
}, { deep: true })

const cat = computed({ get: () => f.value.cat, set: (v) => (f.value.cat = v) })
const keyword = computed({ get: () => f.value.keyword, set: (v) => (f.value.keyword = v) })
const rank = computed({ get: () => f.value.rank, set: (v) => (f.value.rank = v) })
const sortKey = computed({ get: () => f.value.sortKey, set: (v) => (f.value.sortKey = v) })

onMounted(load)

/** 当前类别的原始行 */
const baseRows = computed(() => (weapons.value[cat.value]?.rows || []))

/** 过滤 + 排序 */
const rows = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  let list = baseRows.value.filter((w) => {
    if (rank.value !== 'all' && w.rank !== rank.value) return false
    if (!kw) return true
    const hay = `${w.n || ''} ${w.mat || ''}`.toLowerCase()
    // 片假名 → 平假名
    const hira = hay.replace(/[\u30a1-\u30f6]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0x60)
    )
    return hay.includes(kw) || hira.includes(kw)
  })

  if (sortKey.value === 'atk-desc') {
    list = [...list].sort((a, b) => (b.atk || 0) - (a.atk || 0))
  } else if (sortKey.value === 'atk-asc') {
    list = [...list].sort((a, b) => (a.atk || 0) - (b.atk || 0))
  } else if (sortKey.value === 'sharp-desc') {
    list = [...list].sort((a, b) => (b.sharp || 0) - (a.sharp || 0))
  }
  return list
})

// 上报「共 X 把」到顶栏
const headerMeta = inject('headerMeta', null)
watch(
  () => rows.value.length,
  (n) => {
    if (headerMeta) headerMeta.value = `共 ${n} 把`
  },
  { immediate: true }
)
onUnmounted(() => {
  if (headerMeta) headerMeta.value = ''
})

const open = ref(new Set())
function toggle(name) {
  const s = new Set(open.value)
  if (s.has(name)) s.delete(name)
  else s.add(name)
  open.value = s
}

/** 稀有度标签（3G 用等级） */
const rankClass = {
  下位: 'bg-slate-500/15 text-slate-300',
  上位: 'bg-emerald-500/15 text-emerald-300',
  G级: 'bg-amber-500/15 text-amber-300',
}

/** 斩味色带：长度换算成 5 段颜色（很浅的近似，源站未给颜色分区） */
function sharpSegs(n) {
  // 3G 斩味长度上限约 90-150，按比例配色
  const pct = Math.min(100, Math.round((n / 150) * 100))
  return pct
}

const sorts = [
  { key: 'default', label: '源顺序' },
  { key: 'atk-desc', label: '攻击降序' },
  { key: 'atk-asc', label: '攻击升序' },
  { key: 'sharp-desc', label: '斩味降序' },
]
const ranks = [
  { key: 'all', label: '全部' },
  { key: '下位', label: '下位' },
  { key: '上位', label: '上位' },
  { key: 'G级', label: 'G级' },
]
const showRank = ref(false)

const totalAll = computed(() =>
  WEAPON_CATS.reduce((n, c) => n + (weapons.value[c]?.count || 0), 0)
)
</script>

<template>
  <div>
    <!-- 顶部：类别切换 + 搜索 -->
    <div class="sticky top-14 z-20 border-b border-ink-line bg-ink/95 backdrop-blur">
      <!-- 类别横滑 -->
      <div class="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2">
        <button
          v-for="c in WEAPON_CATS"
          :key="c"
          type="button"
          class="shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors"
          :class="
            cat === c
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          @click="cat = c"
        >
          {{ CAT_ABBR[c] }}
          <span class="ml-0.5 tabular-nums opacity-60">{{ weapons[c]?.count || 0 }}</span>
        </button>
      </div>

      <!-- 搜索 + 筛选 -->
      <div class="flex items-center gap-2 px-3 pb-2.5">
        <div class="relative flex-1">
          <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-parch-dim" />
          <input
            v-model="keyword"
            type="search"
            inputmode="search"
            placeholder="搜索武器名 / 素材"
            class="h-9 w-full rounded-lg border border-ink-line bg-ink-card pl-8 pr-8 text-[13px] text-parch placeholder:text-parch-dim/70 focus:border-gold/50 focus:outline-none"
          />
          <button
            v-if="keyword"
            type="button"
            class="absolute right-1 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-parch-dim"
            aria-label="清空"
            @click="keyword = ''"
          >
            <X :size="13" />
          </button>
        </div>
        <button
          type="button"
          class="flex h-9 shrink-0 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-medium"
          :class="
            rank !== 'all'
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          @click="showRank = !showRank"
        >
          {{ rank === 'all' ? '等级' : rank }}
          <ChevronDown :size="12" />
        </button>
      </div>

      <!-- 等级 + 排序面板 -->
      <div v-if="showRank" class="border-t border-ink-line px-3 py-2.5">
        <div class="mb-2 flex flex-wrap gap-1.5">
          <button
            v-for="r in ranks"
            :key="r.key"
            type="button"
            class="h-8 rounded-lg px-3 text-xs font-medium"
            :class="
              rank === r.key ? 'bg-gold/15 text-gold ring-1 ring-gold/40' : 'bg-ink-soft text-parch-dim'
            "
            @click="rank = r.key"
          >
            {{ r.label }}
          </button>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="s in sorts"
            :key="s.key"
            type="button"
            class="h-8 rounded-lg px-3 text-xs font-medium"
            :class="
              sortKey === s.key ? 'bg-gold/15 text-gold ring-1 ring-gold/40' : 'bg-ink-soft text-parch-dim'
            "
            @click="sortKey = s.key"
          >
            {{ s.label }}
          </button>
        </div>
      </div>

      <div v-if="pending" class="px-3 pb-2 text-[11px] text-parch-dim">加载中…</div>
    </div>

    <!-- 列表 -->
    <div class="px-3 pb-24 pt-3">
      <div v-if="error" class="rounded-xl border border-ink-line bg-ink-card p-4 text-sm text-parch-dim">
        数据加载失败：{{ error }}
      </div>

      <div
        v-else-if="!pending && rows.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <Search :size="36" class="mb-3 text-parch-dim/30" />
        <p class="text-sm text-parch-dim">没有匹配的武器</p>
        <button
          v-if="keyword || rank !== 'all'"
          type="button"
          class="mt-4 rounded-lg border border-ink-line px-4 py-2 text-xs text-parch-dim"
          @click="((keyword = ''), (rank = 'all'))"
        >
          清空条件
        </button>
      </div>

      <div v-else class="space-y-1">
        <div
          v-for="(w, i) in rows"
          :key="`${w.n}-${w.atk}-${i}`"
          class="rounded-lg border border-ink-line bg-ink-card px-3 py-2"
        >
          <!-- 名字行 -->
          <div class="flex items-baseline gap-2">
            <span
              v-if="w.d > 0"
              class="shrink-0 text-[10px] text-parch-dim/50"
              :style="{ paddingLeft: `${Math.min(w.d - 1, 4) * 8}px` }"
            >
              └
            </span>
            <span class="min-w-0 flex-1 truncate text-[13px] font-medium text-parch">
              {{ w.n }}
            </span>
            <span
              v-if="w.rank"
              class="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium"
              :class="rankClass[w.rank] || 'bg-ink-soft text-parch-dim'"
            >
              {{ w.rank }}
            </span>
          </div>

          <!-- 属性行 -->
          <div class="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] tabular-nums text-parch-dim">
            <span class="flex items-center gap-0.5 text-parch">
              <Sword :size="11" class="text-gold/70" />{{ w.atk }}
            </span>
            <span v-if="w.def" class="text-emerald-300/80">防+{{ w.def }}</span>
            <span v-if="w.el" class="text-sky-300/80">{{ w.el }} {{ w.elv }}</span>
            <span v-if="w.aff" :class="w.aff > 0 ? 'text-emerald-300/80' : 'text-red-300/80'">
              会心{{ w.aff > 0 ? '+' : '' }}{{ w.aff }}%
            </span>
            <span v-if="w.slot && w.slot !== '---'" class="text-parch-dim">{{ w.slot }}</span>

            <!-- 斩味条 -->
            <span v-if="w.sharp" class="flex items-center gap-1">
              <span class="h-1.5 w-10 overflow-hidden rounded-sm bg-ink-soft">
                <span class="block h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400"
                      :style="{ width: sharpSegs(w.sharp) + '%' }" />
              </span>
              <span class="text-[9px] opacity-60">{{ w.sharp }}</span>
            </span>

            <!-- 远程：弹种 -->
            <span v-if="w.ammo && w.ammo.length" class="flex items-center gap-0.5">
              <Crosshair :size="11" class="text-sky-400/70" />
              {{ w.ammo[0] }}
            </span>

            <!-- 狩猎笛：音色 -->
            <span v-if="w.tone" class="text-[10px]">{{ w.tone }}</span>
          </div>

          <!-- 旋律（狩猎笛） -->
          <div v-if="w.melo" class="mt-1 text-[10px] leading-relaxed text-parch-dim/80">
            ♪ {{ w.melo }}
          </div>

          <!-- 素材 -->
          <button
            v-if="w.mat"
            type="button"
            class="mt-1.5 flex w-full items-center gap-1.5 text-left text-[10.5px] leading-relaxed text-parch-dim/90"
            :aria-expanded="open.has(`${w.n}|${i}`)"
            @click="toggle(`${w.n}|${i}`)"
          >
            <span
              class="shrink-0 rounded px-1 py-0.5 text-[9px]"
              :class="
                w.matType === '生产'
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : w.matType === '强化'
                    ? 'bg-sky-500/15 text-sky-300'
                    : 'bg-amber-500/15 text-amber-300'
              "
            >{{ w.matType }}</span>
            <span class="min-w-0 flex-1" :class="open.has(`${w.n}|${i}`) ? '' : 'line-clamp-1'">
              {{ w.mat }}
            </span>
            <ChevronDown
              :size="11"
              class="shrink-0 transition-transform"
              :class="open.has(`${w.n}|${i}`) ? 'rotate-180' : ''"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
