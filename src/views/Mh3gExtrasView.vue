<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Search, X, ChevronDown } from '@lucide/vue'

const BASE = import.meta.env.BASE_URL

const cache = { mask: null, village: null, extras: null }
const mask = ref({ sections: [] })
const village = ref({ sections: [] })
const extras = ref({ titles: {}, medals: {} })
const pending = ref(false)
const error = ref(null)

async function fetchJson(name) {
  const res = await fetch(`${BASE}data/${name}`)
  if (!res.ok) throw new Error(`${name} HTTP ${res.status}`)
  return res.json()
}

async function load() {
  pending.value = true
  try {
    if (!cache.mask) cache.mask = await fetchJson('mask_mh3g.json')
    if (!cache.village) cache.village = await fetchJson('village_mh3g.json')
    if (!cache.extras) cache.extras = await fetchJson('extras_mh3g.json')
    mask.value = cache.mask
    village.value = cache.village
    extras.value = cache.extras
  } catch (e) {
    error.value = e.message
  } finally {
    pending.value = false
  }
}
onMounted(load)

const TABS = [
  { key: 'mask', label: '奇面族' },
  { key: 'village', label: '村情报' },
  { key: 'titles', label: '称号' },
  { key: 'medals', label: '勋章' },
]

const KEY = 'mhw.mh3gExtraTab'
const tab = ref(localStorage.getItem(KEY) || 'mask')
watch(tab, (v) => {
  try {
    localStorage.setItem(KEY, v)
  } catch {}
})

const sub = ref(0)
const sections = computed(() => {
  if (tab.value === 'mask') return mask.value.sections || []
  if (tab.value === 'village') return village.value.sections || []
  return []
})
const curSection = computed(() => sections.value[sub.value] || sections.value[0])

watch(tab, () => (sub.value = 0))

const plain = computed(() => {
  if (tab.value === 'titles') return extras.value.titles || {}
  if (tab.value === 'medals') return extras.value.medals || {}
  return {}
})

const keyword = ref('')

const rows = computed(() => {
  const src = tab.value === 'titles' || tab.value === 'medals' ? plain.value.rows || [] : curSection.value?.rows || []
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return src
  return src.filter((r) => {
    const hay = Object.values(r).join(' ').toLowerCase()
    const hira = hay.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    return hay.includes(kw) || hira.includes(kw)
  })
})

const fields = computed(() => {
  if (tab.value === 'titles' || tab.value === 'medals') return plain.value.fields || []
  return curSection.value?.fields || []
})

const headerMeta = inject('headerMeta', null)
watch(
  () => [tab.value, sub.value, rows.value.length],
  () => {
    if (headerMeta) headerMeta.value = `${rows.value.length} 条`
  },
  { immediate: true }
)
onUnmounted(() => {
  if (headerMeta) headerMeta.value = ''
})

function switchTab(k) {
  tab.value = k
  keyword.value = ''
  sub.value = 0
}

/** 首列作为标题，其余作为键值 */
function titleOf(r) {
  return r[fields.value[0]] || ''
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
      <div class="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2">
        <button
          v-for="t in TABS"
          :key="t.key"
          type="button"
          class="shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors"
          :class="
            tab === t.key
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          @click="switchTab(t.key)"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- 子分类 -->
      <div v-if="sections.length > 1" class="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
        <button
          v-for="(s, i) in sections"
          :key="s.label"
          type="button"
          class="shrink-0 rounded-lg px-2.5 py-1 text-[10.5px] font-medium"
          :class="sub === i ? 'bg-gold/15 text-gold' : 'bg-ink-soft text-parch-dim'"
          @click="sub = i"
        >
          {{ s.label }}
          <span class="ml-0.5 tabular-nums opacity-60">{{ s.count }}</span>
        </button>
      </div>

      <div class="px-3 pb-2.5">
        <div class="relative">
          <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-parch-dim" />
          <input
            v-model="keyword"
            type="search"
            inputmode="search"
            placeholder="搜索"
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

      <div v-if="pending" class="px-3 pb-2 text-[11px] text-parch-dim">加载中…</div>
    </div>

    <div class="px-3 pb-24 pt-3">
      <div v-if="error" class="rounded-xl border border-ink-line bg-ink-card p-4 text-sm text-parch-dim">
        数据加载失败：{{ error }}
      </div>

      <template v-else>
        <!-- 说明段落 -->
        <div
          v-if="curSection?.paragraphs?.length && tab !== 'titles' && tab !== 'medals'"
          class="mb-3 rounded-lg border border-ink-line bg-ink-card p-3"
        >
          <p v-for="(p, i) in curSection.paragraphs" :key="i" class="text-[11px] leading-relaxed text-parch-dim">
            {{ p }}
          </p>
        </div>

        <div v-if="!pending && !rows.length" class="py-20 text-center text-sm text-parch-dim">
          没有匹配的条目
        </div>

        <div v-else class="space-y-1">
          <div
            v-for="(r, i) in rows"
            :key="i"
            class="rounded-lg border border-ink-line bg-ink-card px-3 py-2"
          >
            <button
              type="button"
              class="flex w-full items-baseline gap-2 text-left"
              @click="toggle(`r${i}`)"
            >
              <span class="min-w-0 flex-1 text-[12.5px] font-medium leading-snug text-parch">
                {{ titleOf(r) || `条目 ${i + 1}` }}
              </span>
              <ChevronDown
                :size="11"
                class="shrink-0 text-parch-dim/50 transition-transform"
                :class="open.has(`r${i}`) ? 'rotate-180' : ''"
              />
            </button>

            <div
              class="mt-1 space-y-0.5"
              :class="open.has(`r${i}`) ? '' : 'line-clamp-2 overflow-hidden'"
            >
              <div
                v-for="(f, fi) in fields.slice(1)"
                :key="f"
                class="flex gap-1.5 text-[10.5px] leading-snug"
              >
                <span class="w-[68px] shrink-0 text-parch-dim/65">{{ f }}</span>
                <span class="min-w-0 flex-1 text-parch-dim">{{ r[f] || '—' }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
