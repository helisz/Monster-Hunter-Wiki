<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Search, X, ChevronDown, Sword } from '@lucide/vue'
import { useMh3gWeapons, WEAPON_CATS, CAT_ABBR } from '../composables/useMh3gWeapons'

const { weapons, pending, error, load } = useMh3gWeapons()

const KEY = 'mhw.mh3gWeaponFilters2'
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
watch(
  f,
  (v) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(v))
    } catch {}
  },
  { deep: true }
)

const cat = computed({ get: () => f.value.cat, set: (v) => (f.value.cat = v) })
const keyword = computed({ get: () => f.value.keyword, set: (v) => (f.value.keyword = v) })
const rank = computed({ get: () => f.value.rank, set: (v) => (f.value.rank = v) })
const sortKey = computed({ get: () => f.value.sortKey, set: (v) => (f.value.sortKey = v) })

onMounted(load)

const baseRows = computed(() => weapons.value[cat.value]?.rows || [])

const rows = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  let list = baseRows.value.filter((w) => {
    if (rank.value !== 'all' && w.rank !== rank.value) return false
    if (!kw) return true
    const hay = `${w.n || ''} ${w.mat || ''}`.toLowerCase()
    const hira = hay.replace(/[\u30a1-\u30f6]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0x60)
    )
    return hay.includes(kw) || hira.includes(kw)
  })
  if (sortKey.value === 'atk-desc') list = [...list].sort((a, b) => (b.atk || 0) - (a.atk || 0))
  else if (sortKey.value === 'atk-asc') list = [...list].sort((a, b) => (a.atk || 0) - (b.atk || 0))
  else if (sortKey.value === 'sharp-desc')
    list = [...list].sort((a, b) => (b.sharp?.[0]?.total || 0) - (a.sharp?.[0]?.total || 0))
  return list
})

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
function toggle(key) {
  const s = new Set(open.value)
  if (s.has(key)) s.delete(key)
  else s.add(key)
  open.value = s
}

const openSharp = ref(new Set())
function toggleSharp(key) {
  const s = new Set(openSharp.value)
  if (s.has(key)) s.delete(key)
  else s.add(key)
  openSharp.value = s
}

const rankClass = {
  下位: 'bg-slate-500/15 text-slate-300',
  上位: 'bg-emerald-500/15 text-emerald-300',
  G级: 'bg-amber-500/15 text-amber-300',
}

/** 派生树：nodes 每元素一条缩进边。' '=空 'I'=竖线 'T'=├ 'L'=└ */
function treeInfo(w) {
  const nb = w.nodes || []
  if (!nb.length) return { indent: [], branch: '' }
  const last = nb[nb.length - 1]
  const indent = nb.slice(0, -1).map((ch) => ch === 'I' || ch === 'T')
  return { indent, branch: last === 'T' ? '├' : last === 'L' ? '└' : '' }
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

const SHARP_PX = 3.0
</script>

<template>
  <div>
    <div class="sticky top-14 z-20 min-w-0 overflow-hidden border-b border-ink-line bg-ink/95 backdrop-blur">
      <div class="no-scrollbar flex w-full gap-1 overflow-x-auto px-3 py-2">
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

      <div class="flex items-center gap-2 px-3 pb-2.5">
        <div class="relative flex-1">
          <Search
            :size="14"
            class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-parch-dim"
          />
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

      <div v-else class="space-y-0.5">
        <div
          v-for="(w, i) in rows"
          :key="`${w.n}-${w.atk}-${i}`"
          class="rounded-md border px-2 py-1.5"
          :class="w.d === 0 ? 'mt-2 border-gold/25 bg-ink-card' : 'border-ink-line/50 bg-ink-soft/25'"
        >
          <div class="flex items-stretch">
            <!-- 派生缩进线 -->
            <div
              v-if="w.d > 0"
              class="relative shrink-0"
              :style="{ width: Math.min(treeInfo(w).indent.length, 8) * 9 + 11 + 'px' }"
              aria-hidden="true"
            >
              <!-- 祖先竖线 -->
              <span
                v-for="(v, gi) in treeInfo(w).indent"
                :key="gi"
                v-show="v"
                class="absolute top-0 bottom-0 bg-parch-dim/55"
                :style="{ left: gi * 9 + 4 + 'px', width: '1.5px' }"
              ></span>
              <!-- 本行分支：└ 或 ├ -->
              <span
                v-if="treeInfo(w).branch"
                class="absolute"
                :style="{
                  left: (treeInfo(w).indent.length - 1) * 9 + 4 + 'px',
                  top: '0',
                  width: '7px',
                  height: '11px',
                  borderLeft: '1.5px solid rgba(169,155,136,0.55)',
                  borderBottom: '1.5px solid rgba(169,155,136,0.55)',
                  borderBottomLeftRadius: '3px',
                }"
              ></span>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-1.5">
                <span
                  class="min-w-0 flex-1 truncate text-[12.5px] font-medium"
                  :class="w.d === 0 ? 'text-gold' : 'text-parch'"
                >
                  {{ w.n }}
                </span>
                <span
                  v-if="w.rank"
                  class="shrink-0 rounded px-1 py-0.5 text-[8.5px] font-medium"
                  :class="rankClass[w.rank] || 'bg-ink-soft text-parch-dim'"
                >
                  {{ w.rank }}
                </span>
              </div>

              <div
                class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10.5px] tabular-nums text-parch-dim"
              >
                <span class="flex items-center gap-0.5 font-medium text-parch">
                  <Sword :size="10" class="text-gold/70" />{{ w.atk }}
                </span>
                <span v-if="w.eff && w.eff.includes('防')" class="text-emerald-300/80">
                  {{ w.eff.split('(')[0].trim() }}
                </span>
                <span v-if="w.aff" :class="w.aff > 0 ? 'text-emerald-300/80' : 'text-red-300/80'">
                  会心{{ w.aff > 0 ? '+' : '' }}{{ w.aff }}%
                </span>
                <span v-if="w.slot && w.slot !== '---'" class="text-parch-dim">{{ w.slot }}</span>
                <span v-if="w.tone" class="text-[9.5px]">{{ w.tone }}</span>
              </div>

              <!-- 斩味（等比色段） -->
              <div v-if="w.sharp && w.sharp.length" class="mt-1">
                <button
                  type="button"
                  class="flex max-w-full items-center gap-1.5"
                  @click="toggleSharp(`${w.n}|${i}`)"
                >
                  <span class="flex h-[8px] min-w-0 shrink items-stretch gap-px overflow-hidden rounded-[1px]">
                    <span
                      v-for="(s, si) in w.sharp[0].segs"
                      :key="si"
                      class="block rounded-[1px]"
                      :style="{ width: s.n * SHARP_PX + 'px', backgroundColor: s.c }"
                    ></span>
                  </span>
                  <span class="text-[8.5px] text-parch-dim/45">
                    {{ w.sharp[0].total
                    }}<template v-if="w.sharp[1]">/{{ w.sharp[1].total }}</template>
                  </span>
                </button>
                <div
                  v-if="w.sharp[1] && openSharp.has(`${w.n}|${i}`)"
                  class="mt-1 flex items-center gap-1.5"
                >
                  <span class="text-[8px] text-parch-dim/45">+1</span>
                  <span class="flex h-[8px] min-w-0 shrink items-stretch gap-px overflow-hidden rounded-[1px]">
                    <span
                      v-for="(s, si) in w.sharp[1].segs"
                      :key="si"
                      class="block rounded-[1px]"
                      :style="{ width: s.n * SHARP_PX + 'px', backgroundColor: s.c }"
                    ></span>
                  </span>
                </div>
              </div>

              <div v-if="w.melo" class="mt-0.5 text-[9.5px] leading-snug text-parch-dim/70">
                ♪ {{ w.melo }}
              </div>

              <button
                v-if="w.mat"
                type="button"
                class="mt-0.5 flex w-full items-center gap-1 text-left text-[10px] leading-snug text-parch-dim/85"
                @click="toggle(`${w.n}|${i}`)"
              >
                <span
                  class="shrink-0 rounded px-1 text-[8.5px]"
                  :class="
                    w.matType === '生产'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : w.matType === '强化'
                        ? 'bg-sky-500/15 text-sky-300'
                        : 'bg-amber-500/15 text-amber-300'
                  "
                  >{{ w.matType }}</span
                >
                <span class="min-w-0 flex-1" :class="open.has(`${w.n}|${i}`) ? '' : 'line-clamp-1'">
                  {{ w.mat }}
                </span>
                <ChevronDown
                  :size="9"
                  class="shrink-0 transition-transform"
                  :class="open.has(`${w.n}|${i}`) ? 'rotate-180' : ''"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
