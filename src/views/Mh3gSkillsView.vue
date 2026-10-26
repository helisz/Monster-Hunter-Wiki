<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Search, X, Sparkles, Gem, CircleDot, ChevronDown } from '@lucide/vue'

const BASE = import.meta.env.BASE_URL
let cache = null

const data = ref(cache || { skills: [], decos: [], charms: [] })
const pending = ref(false)
const error = ref(null)

async function load() {
  if (cache) {
    data.value = cache
    return
  }
  pending.value = true
  try {
    const res = await fetch(`${BASE}data/skills_mh3g.json`)
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
  { key: 'skills', label: '技能', icon: Sparkles },
  { key: 'decos', label: '装饰珠', icon: Gem },
  { key: 'charms', label: '护石', icon: CircleDot },
]

const KEY = 'mhw.mh3gSkillsTab'
const tab = ref(localStorage.getItem(KEY) || 'skills')
watch(tab, (v) => {
  try {
    localStorage.setItem(KEY, v)
  } catch {}
})

const keyword = ref('')
const groupFilter = ref('all')
const showGroups = ref(false)

/** 技能分组列表 */
const groups = computed(() => {
  const s = new Set()
  for (const x of data.value.skills || []) {
    if (x.group && x.group !== 'undefined') s.add(x.group)
  }
  return [...s]
})

const skills = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return (data.value.skills || []).filter((x) => {
    if (groupFilter.value !== 'all' && x.group !== groupFilter.value) return false
    if (!kw) return true
    const hay = `${x.jp} ${x.cn} ${x.effect} ${x.group} ${x.groupJp}`.toLowerCase()
    const hira = hay.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    return hay.includes(kw) || hira.includes(kw)
  })
})

const decos = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return (data.value.decos || []).filter((x) => {
    if (!kw) return true
    const hay = `${x.n} ${x.effect} ${x.mat}`.toLowerCase()
    const hira = hay.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    return hay.includes(kw) || hira.includes(kw)
  })
})

const charms = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return (data.value.charms || []).filter((x) => {
    if (!kw) return true
    return x.skill.toLowerCase().includes(kw)
  })
})

const charmTypes = ['谜之护身符', '发光护身符', '陈旧护身符', '风化护身符']

const headerMeta = inject('headerMeta', null)
watch(
  () => [tab.value, skills.value.length, decos.value.length, charms.value.length],
  () => {
    if (!headerMeta) return
    const n =
      tab.value === 'skills'
        ? `${skills.value.length} 项技能`
        : tab.value === 'decos'
          ? `${decos.value.length} 个装饰珠`
          : `${charms.value.length} 条护石技能`
    headerMeta.value = n
  },
  { immediate: true }
)
onUnmounted(() => {
  if (headerMeta) headerMeta.value = ''
})

function switchTab(k) {
  tab.value = k
  keyword.value = ''
  groupFilter.value = 'all'
}
</script>

<template>
  <div>
    <div class="sticky top-14 z-20 border-b border-ink-line bg-ink/95 backdrop-blur">
      <!-- Tab -->
      <div class="flex gap-1 px-3 pt-2">
        <button
          v-for="t in TABS"
          :key="t.key"
          type="button"
          class="flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-colors"
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

      <!-- 搜索 -->
      <div class="px-3 py-2">
        <div class="relative">
          <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-parch-dim" />
          <input
            v-model="keyword"
            type="search"
            inputmode="search"
            :placeholder="
              tab === 'skills' ? '搜索技能名 / 效果' : tab === 'decos' ? '搜索装饰珠 / 效果' : '搜索技能'
            "
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

      <!-- 技能 -->
      <template v-else-if="tab === 'skills'">
        <div class="mb-2 flex items-center gap-2">
          <button
            type="button"
            class="flex h-8 shrink-0 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-medium"
            :class="
              groupFilter !== 'all'
                ? 'border-gold/50 bg-gold/15 text-gold'
                : 'border-ink-line bg-ink-card text-parch-dim'
            "
            @click="showGroups = !showGroups"
          >
            {{ groupFilter === 'all' ? '全部系统' : groupFilter }}
            <ChevronDown :size="12" :class="showGroups ? 'rotate-180' : ''" class="transition-transform" />
          </button>
          <span class="text-[10px] text-parch-dim/60">{{ groups.length }} 个系统</span>
        </div>

        <div v-if="showGroups" class="mb-2 flex flex-wrap gap-1">
          <button
            type="button"
            class="rounded-lg px-2.5 py-1 text-[10.5px] font-medium"
            :class="groupFilter === 'all' ? 'bg-gold/15 text-gold' : 'bg-ink-soft text-parch-dim'"
            @click="((groupFilter = 'all'), (showGroups = false))"
          >
            全部
          </button>
          <button
            v-for="g in groups"
            :key="g"
            type="button"
            class="rounded-lg px-2.5 py-1 text-[10.5px] font-medium"
            :class="groupFilter === g ? 'bg-gold/15 text-gold' : 'bg-ink-soft text-parch-dim'"
            @click="((groupFilter = g), (showGroups = false))"
          >
            {{ g }}
          </button>
        </div>

        <div class="space-y-1">
          <div
            v-for="(s, i) in skills"
            :key="`${s.jp}-${i}`"
            class="rounded-lg border border-ink-line bg-ink-card px-3 py-2"
          >
            <div class="flex items-baseline gap-2">
              <span class="min-w-0 flex-1 text-[13px] font-medium text-parch">{{ s.jp }}</span>
              <span
                v-if="s.points !== null"
                class="shrink-0 rounded px-1.5 py-0.5 text-[9.5px] tabular-nums"
                :class="s.points >= 0 ? 'bg-gold/12 text-gold' : 'bg-red-500/12 text-red-300'"
              >
                {{ s.points > 0 ? '+' : '' }}{{ s.points }}点
              </span>
            </div>
            <div class="mt-0.5 text-[11px] text-parch-dim">{{ s.cn }}</div>
            <div class="mt-1 flex flex-wrap items-center gap-1.5 text-[10.5px]">
              <span v-if="s.group" class="rounded bg-ink-soft px-1.5 py-0.5 text-parch-dim">
                {{ s.group }}
              </span>
              <span class="text-parch-dim/90">{{ s.effect }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- 装饰珠 -->
      <template v-else-if="tab === 'decos'">
        <div class="space-y-1">
          <div
            v-for="(d, i) in decos"
            :key="`${d.n}-${i}`"
            class="rounded-lg border border-ink-line bg-ink-card px-3 py-2"
          >
            <div class="flex items-baseline gap-2">
              <span class="min-w-0 flex-1 text-[13px] font-medium text-parch">{{ d.n }}</span>
              <span v-if="d.slot" class="shrink-0 font-mono text-[10px] text-gold/80">{{ d.slot }}</span>
              <span
                v-if="d.rank"
                class="shrink-0 rounded bg-ink-soft px-1.5 py-0.5 text-[9px] text-parch-dim"
              >
                {{ d.rank }}
              </span>
            </div>
            <div class="mt-0.5 text-[11px] text-parch-dim">{{ d.effect }}</div>
            <div v-if="d.mat" class="mt-1 text-[10px] leading-relaxed text-parch-dim/70">
              {{ d.mat }}
            </div>
          </div>
        </div>
      </template>

      <!-- 护石 -->
      <template v-else>
        <div class="mb-2 rounded-lg border border-ink-line bg-ink-soft/40 px-3 py-2 text-[10.5px] leading-relaxed text-parch-dim">
          数值为四种护身符能出的技能最大点数。
        </div>
        <div class="space-y-1">
          <div
            v-for="(c, i) in charms"
            :key="`${c.skill}-${i}`"
            class="rounded-lg border border-ink-line bg-ink-card px-3 py-2"
          >
            <div class="text-[13px] font-medium text-parch">{{ c.skill }}</div>
            <div class="mt-1 grid grid-cols-4 gap-1.5">
              <div
                v-for="t in charmTypes"
                :key="t"
                class="rounded bg-ink-soft px-1 py-1 text-center"
              >
                <div class="text-[8.5px] leading-tight text-parch-dim/70">{{ t.slice(0, 2) }}</div>
                <div class="text-[12px] font-semibold tabular-nums text-gold">
                  {{ c.max?.[t] || '—' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
