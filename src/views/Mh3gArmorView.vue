<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Search, X, ChevronDown, Shield } from '@lucide/vue'
import { useMh3gArmor, ARMOR_CATS, ARMOR_CAT_ABBR, RES_COLS } from '../composables/useMh3gArmor'

const { armor, pending, error, load } = useMh3gArmor()

const KEY = 'mhw.mh3gArmorFilters'
const defaults = { cat: '剑士防具', keyword: '', sortKey: 'default' }

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
const sortKey = computed({ get: () => f.value.sortKey, set: (v) => (f.value.sortKey = v) })

onMounted(load)

const BASE = import.meta.env.BASE_URL
const icon = (n) => `${BASE}ui-icons/${n}.png`

const baseRows = computed(() => armor.value[cat.value]?.rows || [])

const rows = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  let list = baseRows.value
  if (kw) {
    list = list.filter((a) => {
      const hay = `${a.n} ${(a.skills || []).join(' ')} ${(a.negSkills || []).join(' ')}`.toLowerCase()
      const hira = hay.replace(/[\u30a1-\u30f6]/g, (c) =>
        String.fromCharCode(c.charCodeAt(0) - 0x60)
      )
      return hay.includes(kw) || hira.includes(kw)
    })
  }
  if (sortKey.value === 'def-desc') {
    list = [...list].sort((a, b) => (b.def || 0) - (a.def || 0))
  } else if (sortKey.value === 'def-asc') {
    list = [...list].sort((a, b) => (a.def || 0) - (b.def || 0))
  } else if (sortKey.value === 'slot-desc') {
    list = [...list].sort((a, b) => (b.slots?.total || 0) - (a.slots?.total || 0))
  }
  return list
})

const headerMeta = inject('headerMeta', null)
watch(
  () => rows.value.length,
  (n) => {
    if (headerMeta) headerMeta.value = `共 ${n} 套`
  },
  { immediate: true }
)
onUnmounted(() => {
  if (headerMeta) headerMeta.value = ''
})

function resClass(v) {
  if (v >= 10) return 'text-emerald-400'
  if (v > 0) return 'text-parch'
  if (v === 0) return 'text-parch-dim/50'
  if (v >= -10) return 'text-amber-400/80'
  return 'text-red-400/80'
}

const sorts = [
  { key: 'default', label: '源顺序' },
  { key: 'def-desc', label: '防御降序' },
  { key: 'def-asc', label: '防御升序' },
  { key: 'slot-desc', label: '孔数降序' },
]

const totalAll = computed(() =>
  ARMOR_CATS.reduce((n, c) => n + (armor.value[c]?.count || 0), 0)
)
</script>

<template>
  <div>
    <div class="sticky top-14 z-20 border-b border-ink-line bg-ink/95 backdrop-blur">
      <!-- 类别 -->
      <div class="flex gap-1 px-3 py-2">
        <button
          v-for="c in ARMOR_CATS"
          :key="c"
          type="button"
          class="flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-colors"
          :class="
            cat === c
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          @click="cat = c"
        >
          {{ ARMOR_CAT_ABBR[c] }}
          <span class="ml-0.5 tabular-nums opacity-60">{{ armor[c]?.count || 0 }}</span>
        </button>
      </div>

      <!-- 搜索 + 排序 -->
      <div class="flex items-center gap-2 px-3 pb-2.5">
        <div class="relative flex-1">
          <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-parch-dim" />
          <input
            v-model="keyword"
            type="search"
            inputmode="search"
            placeholder="搜索套装 / 技能"
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
        <div class="flex h-9 shrink-0 overflow-hidden rounded-lg border border-ink-line">
          <button
            v-for="s in sorts"
            :key="s.key"
            type="button"
            class="px-2 text-[10.5px] font-medium transition-colors"
            :class="sortKey === s.key ? 'bg-gold/15 text-gold' : 'bg-ink-card text-parch-dim'"
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
        <p class="text-sm text-parch-dim">没有匹配的套装</p>
        <button
          v-if="keyword"
          type="button"
          class="mt-4 rounded-lg border border-ink-line px-4 py-2 text-xs text-parch-dim"
          @click="keyword = ''"
        >
          清空条件
        </button>
      </div>

      <div v-else class="space-y-1.5">
        <div
          v-for="(a, i) in rows"
          :key="`${a.n}-${i}`"
          class="rounded-lg border border-ink-line bg-ink-card px-3 py-2"
        >
          <!-- 头：名称 + 防御 -->
          <div class="flex items-baseline gap-2">
            <span class="min-w-0 flex-1 truncate text-[13px] font-medium text-parch">
              {{ a.n }}
            </span>
            <span class="flex shrink-0 items-center gap-0.5 text-[11px] tabular-nums text-parch">
              <Shield :size="11" class="text-gold/70" />
              {{ a.def }}<span class="text-[9px] text-parch-dim">→{{ a.defMax }}</span>
            </span>
          </div>

          <!-- 耐性 -->
          <div class="mt-1 flex items-center gap-2.5 text-[10.5px] tabular-nums">
            <span
              v-for="c in RES_COLS"
              :key="c.key"
              class="flex items-center gap-0.5"
              :class="resClass(a.res?.[c.key] ?? 0)"
            >
              <img :src="icon(c.icon)" :alt="c.label" class="size-3 opacity-70"
                   @error="(e) => (e.target.style.display = 'none')" />
              {{ a.res?.[c.key] }}
            </span>
            <span v-if="a.slots?.total" class="ml-auto text-parch-dim">
              孔 {{ a.slots.total }}
            </span>
          </div>

          <!-- 技能 -->
          <div v-if="a.skills?.length" class="mt-1.5 flex flex-wrap gap-1">
            <span
              v-for="s in a.skills"
              :key="s"
              class="rounded bg-gold/12 px-1.5 py-0.5 text-[10px] text-gold"
            >
              {{ s }}
            </span>
          </div>

          <!-- 负面技能 -->
          <div v-if="a.negSkills?.length" class="mt-1 flex flex-wrap gap-1">
            <span
              v-for="s in a.negSkills"
              :key="s"
              class="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-300/80"
            >
              ▼{{ s }}
            </span>
          </div>

          <!-- 孔位分布 -->
          <div
            v-if="a.slots?.total"
            class="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[9.5px] text-parch-dim/70"
          >
            <span>头{{ a.slots.head }}</span>
            <span>身{{ a.slots.body }}</span>
            <span>腕{{ a.slots.arm }}</span>
            <span>腰{{ a.slots.waist }}</span>
            <span>脚{{ a.slots.leg }}</span>
          </div>

          <div v-if="a.note" class="mt-1 text-[10px] leading-relaxed text-parch-dim/80">
            {{ a.note }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
