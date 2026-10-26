<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Search, X, FlaskConical, Package, Leaf, ChevronDown } from '@lucide/vue'

const BASE = import.meta.env.BASE_URL
let cache = null

const data = ref(cache || { items: [], recipes: [], veg: [] })
const pending = ref(false)
const error = ref(null)

async function load() {
  if (cache) {
    data.value = cache
    return
  }
  pending.value = true
  try {
    const res = await fetch(`${BASE}data/items_mh3g.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    cache = await res.json()
    data.value = cache
  } catch (e) {
    error.value = e.message
  } finally {
    pending.value = false
  }
}
onMounted(load)

const TABS = [
  { key: 'items', label: '道具素材', icon: Package },
  { key: 'recipes', label: '调和表', icon: FlaskConical },
  { key: 'veg', label: '山菜爷', icon: Leaf },
]

const KEY = 'mhw.mh3gItemTab'
const tab = ref(localStorage.getItem(KEY) || 'items')
watch(tab, (v) => {
  try {
    localStorage.setItem(KEY, v)
  } catch {}
})

const keyword = ref('')
const catFilter = ref('all')

const CATS = computed(() => {
  const s = new Set()
  for (const it of data.value.items || []) if (it.cat) s.add(it.cat)
  return [...s]
})

const items = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return (data.value.items || []).filter((x) => {
    if (catFilter.value !== 'all' && x.cat !== catFilter.value) return false
    if (!kw) return true
    const hay = `${x.jp} ${x.cn} ${x.how} ${x.desc}`.toLowerCase()
    const hira = hay.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    return hay.includes(kw) || hira.includes(kw)
  })
})

const recipes = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return (data.value.recipes || []).filter((x) => {
    if (!kw) return true
    const hay = `${x.result} ${x.a} ${x.b}`.toLowerCase()
    return hay.includes(kw)
  })
})

const headerMeta = inject('headerMeta', null)
watch(
  () => [tab.value, items.value.length, recipes.value.length],
  () => {
    if (!headerMeta) return
    headerMeta.value =
      tab.value === 'items'
        ? `${items.value.length} 条`
        : tab.value === 'recipes'
          ? `${recipes.value.length} 条调和`
          : `${(data.value.veg || []).length} 张地图`
  },
  { immediate: true }
)
onUnmounted(() => {
  if (headerMeta) headerMeta.value = ''
})

function switchTab(k) {
  tab.value = k
  keyword.value = ''
  catFilter.value = 'all'
}

const open = ref(new Set())
function toggle(key) {
  const s = new Set(open.value)
  if (s.has(key)) s.delete(key)
  else s.add(key)
  open.value = s
}
</script>

<template>
  <div>
    <div class="sticky top-14 z-20 border-b border-ink-line bg-ink/95 backdrop-blur">
      <div class="no-scrollbar flex gap-1 overflow-x-auto px-3 pt-2">
        <button
          v-for="t in TABS"
          :key="t.key"
          type="button"
          class="flex shrink-0 items-center justify-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors"
          :class="
            tab === t.key
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          @click="switchTab(t.key)"
        >
          <component :is="t.icon" :size="12" />
          {{ t.label }}
        </button>
      </div>

      <div v-if="tab !== 'veg'" class="px-3 py-2">
        <div class="relative">
          <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-parch-dim" />
          <input
            v-model="keyword"
            type="search"
            inputmode="search"
            placeholder="搜索名称 / 效果"
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
      </div>

      <div v-if="tab === 'items'" class="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2.5">
        <button
          type="button"
          class="shrink-0 rounded-lg px-2.5 py-1 text-[10.5px] font-medium"
          :class="catFilter === 'all' ? 'bg-gold/15 text-gold' : 'bg-ink-soft text-parch-dim'"
          @click="catFilter = 'all'"
        >
          全部
        </button>
        <button
          v-for="c in CATS"
          :key="c"
          type="button"
          class="shrink-0 rounded-lg px-2.5 py-1 text-[10.5px] font-medium"
          :class="catFilter === c ? 'bg-gold/15 text-gold' : 'bg-ink-soft text-parch-dim'"
          @click="catFilter = c"
        >
          {{ c }}
        </button>
      </div>

      <div v-if="pending" class="px-3 pb-2 text-[11px] text-parch-dim">加载中…</div>
    </div>

    <div class="px-3 pb-24 pt-3">
      <div v-if="error" class="rounded-xl border border-ink-line bg-ink-card p-4 text-sm text-parch-dim">
        数据加载失败：{{ error }}
      </div>

      <!-- 道具 -->
      <template v-else-if="tab === 'items'">
        <div v-if="!pending && !items.length" class="py-20 text-center text-sm text-parch-dim">
          没有匹配的道具
        </div>
        <div v-else class="space-y-1">
          <div
            v-for="(it, i) in items"
            :key="`${it.jp}-${i}`"
            class="rounded-lg border border-ink-line bg-ink-card px-3 py-2"
          >
            <div class="flex items-baseline gap-2">
              <span class="min-w-0 flex-1 truncate text-[13px] font-medium text-parch">{{ it.jp }}</span>
              <span v-if="it.cn && it.cn !== it.jp" class="shrink-0 text-[10.5px] text-parch-dim">{{ it.cn }}</span>
              <span
                v-if="it.rare"
                class="shrink-0 rounded bg-gold/12 px-1.5 py-0.5 text-[9px] tabular-nums text-gold"
              >
                R{{ it.rare }}
              </span>
            </div>

            <div class="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] tabular-nums text-parch-dim">
              <span v-if="it.max">上限{{ it.max }}</span>
              <span v-if="it.buy && it.buy !== '-'">买{{ it.buy }}</span>
              <span v-if="it.sell && it.sell !== '-z' && it.sell !== '-'">卖{{ it.sell }}</span>
              <span v-if="it.rank" class="text-sky-300/80">{{ it.rank }}</span>
              <span v-if="it.how" class="text-parch-dim/90">{{ it.how }}</span>
            </div>

            <button
              v-if="it.desc"
              type="button"
              class="mt-1 flex w-full items-start gap-1 text-left text-[10.5px] leading-relaxed text-parch-dim/85"
              @click="toggle(`i${i}`)"
            >
              <span class="min-w-0 flex-1" :class="open.has(`i${i}`) ? '' : 'line-clamp-2'">
                {{ it.desc }}
              </span>
              <ChevronDown
                :size="10"
                class="mt-0.5 shrink-0 transition-transform"
                :class="open.has(`i${i}`) ? 'rotate-180' : ''"
              />
            </button>
          </div>
        </div>
      </template>

      <!-- 调和表 -->
      <template v-else-if="tab === 'recipes'">
        <div class="space-y-1">
          <div
            v-for="(r, i) in recipes"
            :key="`r${i}`"
            class="rounded-lg border border-ink-line bg-ink-card px-3 py-2"
          >
            <div class="flex items-baseline gap-2">
              <span class="min-w-0 flex-1 text-[13px] font-medium text-parch">{{ r.result }}</span>
              <span
                class="shrink-0 rounded px-1.5 py-0.5 text-[9.5px] tabular-nums"
                :class="
                  (r.rate || 0) >= 100
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : (r.rate || 0) >= 60
                      ? 'bg-amber-500/15 text-amber-300'
                      : 'bg-red-500/15 text-red-300'
                "
              >
                {{ r.rate }}%
              </span>
            </div>
            <div class="mt-0.5 flex items-center gap-1 text-[11px] text-parch-dim">
              <span>{{ r.a }}</span>
              <span class="text-parch-dim/40">+</span>
              <span>{{ r.b }}</span>
              <span v-if="r.count && r.count !== '1'" class="ml-1 text-parch-dim/70">×{{ r.count }}</span>
            </div>
            <div v-if="r.note" class="mt-0.5 text-[10px] text-parch-dim/70">{{ r.note }}</div>
          </div>
        </div>
      </template>

      <!-- 山菜爷 -->
      <template v-else>
        <div v-for="(v, i) in data.veg" :key="`v${i}`" class="mb-2 rounded-lg border border-ink-line bg-ink-card p-3">
          <div class="mb-1.5 text-[13px] font-medium text-gold">{{ v.map }}</div>
          <div class="grid grid-cols-2 gap-1.5">
            <div v-for="k in ['无标记', 'G', '钢', '银', '金', '天']" :key="k" class="rounded bg-ink-soft px-2 py-1">
              <div class="text-[9px] text-parch-dim/70">{{ k }}</div>
              <div class="truncate text-[11px] text-parch">{{ v[k] || '—' }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
