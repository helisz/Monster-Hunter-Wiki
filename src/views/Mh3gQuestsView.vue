<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Search, X, MapPin, Users, Star, ChevronDown } from '@lucide/vue'

const BASE = import.meta.env.BASE_URL
let cache = null

const data = ref(cache || { groups: [] })
const pending = ref(false)
const error = ref(null)

async function load() {
  if (cache) {
    data.value = cache
    return
  }
  pending.value = true
  try {
    const res = await fetch(`${BASE}data/quests_mh3g.json`)
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

const KEY = 'mhw.mh3gQuestGroup'
const groupId = ref(localStorage.getItem(KEY) || '村下位')
watch(groupId, (v) => {
  try {
    localStorage.setItem(KEY, v)
  } catch {}
})

const groups = computed(() => data.value.groups || [])
const current = computed(() => groups.value.find((g) => g.id === groupId.value) || groups.value[0])

const keyword = ref('')
const list = computed(() => {
  const items = current.value?.items || []
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return items
  return items.filter((q) => {
    const hay = `${q.n} ${q.monsters} ${q.place} ${q.type}`.toLowerCase()
    const hira = hay.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    return hay.includes(kw) || hira.includes(kw)
  })
})

const headerMeta = inject('headerMeta', null)
watch(
  () => [groupId.value, list.value.length],
  () => {
    if (headerMeta) headerMeta.value = `${list.value.length} 个任务`
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

const showPicker = ref(false)

/** 关键任务金色星 */
function isKey(q) {
  return q.key === '●' || q.key === '★'
}
</script>

<template>
  <div>
    <div class="sticky top-14 z-20 border-b border-ink-line bg-ink/95 backdrop-blur">
      <!-- 类别选择 -->
      <div class="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2">
        <button
          v-for="g in groups"
          :key="g.id"
          type="button"
          class="shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors"
          :class="
            current?.id === g.id
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          @click="groupId = g.id"
        >
          {{ g.label }}
          <span class="ml-0.5 tabular-nums opacity-60">{{ g.items.length }}</span>
        </button>
      </div>

      <div class="px-3 pb-2.5">
        <div class="relative">
          <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-parch-dim" />
          <input
            v-model="keyword"
            type="search"
            inputmode="search"
            placeholder="搜索任务名 / 怪物"
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

      <div v-else-if="!pending && !list.length" class="py-20 text-center text-sm text-parch-dim">
        没有匹配的任务
      </div>

      <div v-else class="space-y-1">
        <div
          v-for="(q, i) in list"
          :key="`${q.n}-${i}`"
          class="rounded-lg border px-3 py-2"
          :class="isKey(q) ? 'border-gold/30 bg-ink-card' : 'border-ink-line bg-ink-card'"
        >
          <div class="flex items-baseline gap-1.5">
            <Star v-if="isKey(q)" :size="11" class="shrink-0 text-gold" />
            <span class="min-w-0 flex-1 text-[13px] font-medium leading-snug text-parch">{{ q.n }}</span>
            <span
              v-if="q.type"
              class="shrink-0 rounded bg-ink-soft px-1.5 py-0.5 text-[9px] text-parch-dim"
            >
              {{ q.type }}
            </span>
            <span v-if="q.lv" class="shrink-0 text-[9.5px] tabular-nums text-gold/80">{{ q.lv }}</span>
          </div>

          <div class="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10.5px] text-parch-dim">
            <span v-if="q.place" class="flex items-center gap-0.5">
              <MapPin :size="9" class="shrink-0 text-gold/60" />{{ q.place }}
            </span>
            <span v-if="q.monsters" class="flex items-center gap-0.5">
              <Users :size="9" class="shrink-0 text-red-300/60" />{{ q.monsters }}
            </span>
          </div>

          <div
            v-if="q.fee || q.contract || q.time || q.limit"
            class="mt-0.5 flex flex-wrap gap-x-2.5 text-[10px] tabular-nums text-parch-dim/80"
          >
            <span v-if="q.fee">报酬{{ q.fee }}z</span>
            <span v-if="q.contract">契约{{ q.contract }}z</span>
            <span v-if="q.time">{{ q.time }}</span>
            <span v-if="q.limit">{{ q.limit }}</span>
            <span v-if="q.hrp">HRP {{ q.hrp }}</span>
          </div>

          <div v-if="q.cond" class="mt-0.5 text-[10px] text-parch-dim/80">条件 {{ q.cond }}</div>
          <div v-if="q.weapons" class="mt-0.5 text-[10px] text-violet-300/80">武器 {{ q.weapons }}</div>
          <div v-if="q.score" class="mt-0.5 text-[10px] text-parch-dim/80">评价 {{ q.score }}</div>

          <!-- 报酬 -->
          <button
            v-if="q.reward?.length"
            type="button"
            class="mt-1 flex w-full items-start gap-1 text-left text-[10px] leading-snug"
            @click="toggle(`${q.n}-${i}`)"
          >
            <span class="shrink-0 rounded bg-emerald-500/15 px-1 text-[9px] text-emerald-300">报酬</span>
            <span class="min-w-0 flex-1 text-parch-dim/85" :class="open.has(`${q.n}-${i}`) ? '' : 'line-clamp-1'">
              {{ q.reward.map((r) => r.items).join(' ｜ ') }}
            </span>
            <ChevronDown
              :size="9"
              class="mt-0.5 shrink-0 transition-transform"
              :class="open.has(`${q.n}-${i}`) ? 'rotate-180' : ''"
            />
          </button>

          <div v-if="q.note" class="mt-0.5 text-[10px] leading-snug text-parch-dim/70">{{ q.note }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
