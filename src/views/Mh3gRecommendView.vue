<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Sword, Shield, Sparkles, MapPin, Star, ChevronDown } from '@lucide/vue'

const BASE = import.meta.env.BASE_URL
let cache = null

const data = ref(cache || { weapons: {}, armors: {} })
const pending = ref(false)
const error = ref(null)

async function load() {
  if (cache) {
    data.value = cache
    return
  }
  pending.value = true
  try {
    const res = await fetch(`${BASE}data/recommend_mh3g.json`)
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
  { key: 'weapons', label: '推荐武器', icon: Sword },
  { key: 'armors', label: '推荐防具', icon: Shield },
]

const KEY = 'mhw.mh3gRecommendTab'
const tab = ref(localStorage.getItem(KEY) || 'weapons')
watch(tab, (v) => {
  try {
    localStorage.setItem(KEY, v)
  } catch {}
})

const RANKS = ['下位', '上位', 'G级']
const rank = ref('下位')

const list = computed(() => data.value[tab.value]?.[rank.value] || [])

const headerMeta = inject('headerMeta', null)
watch(
  () => [tab.value, rank.value, list.value.length],
  () => {
    if (headerMeta) headerMeta.value = `${list.value.length} 条推荐`
  },
  { immediate: true }
)
onUnmounted(() => {
  if (headerMeta) headerMeta.value = ''
})

function switchTab(k) {
  tab.value = k
  rank.value = '下位'
}

const resCols = [
  { key: 'fire', label: '火' },
  { key: 'water', label: '水' },
  { key: 'thunder', label: '雷' },
  { key: 'ice', label: '冰' },
  { key: 'dragon', label: '龙' },
]

function resClass(v) {
  if (v >= 10) return 'text-emerald-400'
  if (v > 0) return 'text-parch'
  if (v === 0) return 'text-parch-dim/50'
  if (v >= -10) return 'text-amber-400/80'
  return 'text-red-400/80'
}

const open = ref(new Set())
function toggle(key) {
  const s = new Set(open.value)
  if (s.has(key)) s.delete(key)
  else s.add(key)
  open.value = s
}

const rankBadge = {
  下位: 'bg-slate-500/15 text-slate-300',
  上位: 'bg-emerald-500/15 text-emerald-300',
  G级: 'bg-amber-500/15 text-amber-300',
}
</script>

<template>
  <div>
    <div class="sticky top-14 z-20 border-b border-ink-line bg-ink/95 backdrop-blur">
      <!-- 武器 / 防具 -->
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

      <!-- 等级 -->
      <div class="flex gap-1 px-3 py-2.5">
        <button
          v-for="r in RANKS"
          :key="r"
          type="button"
          class="flex-1 rounded-lg py-1.5 text-[11px] font-medium"
          :class="rank === r ? 'bg-gold/15 text-gold ring-1 ring-gold/40' : 'bg-ink-soft text-parch-dim'"
          @click="rank = r"
        >
          {{ r }}
          <span class="ml-0.5 tabular-nums opacity-60">
            {{ (data[tab]?.[r] || []).length }}
          </span>
        </button>
      </div>

      <div v-if="pending" class="px-3 pb-2 text-[11px] text-parch-dim">加载中…</div>
    </div>

    <div class="px-3 pb-24 pt-3">
      <div v-if="error" class="rounded-xl border border-ink-line bg-ink-card p-4 text-sm text-parch-dim">
        数据加载失败：{{ error }}
      </div>

      <div
        v-else-if="!pending && !list.length"
        class="py-20 text-center text-sm text-parch-dim"
      >
        这个等级暂无推荐
      </div>

      <div v-else class="space-y-2">
        <!-- 武器卡 -->
        <template v-if="tab === 'weapons'">
          <div
            v-for="(w, i) in list"
            :key="`w-${i}`"
            class="rounded-lg border border-ink-line bg-ink-card p-2.5"
          >
            <div class="flex items-baseline gap-2">
              <span class="min-w-0 flex-1 truncate text-[13px] font-medium text-parch">
                {{ w.n }}
              </span>
              <span
                v-if="w.rank"
                class="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium"
                :class="rankBadge[w.rank]"
              >
                {{ w.rank }}
              </span>
            </div>

            <!-- 数值 -->
            <div class="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] tabular-nums">
              <span class="flex items-center gap-0.5 font-medium text-parch">
                <Sword :size="10" class="text-gold/70" />{{ w.atk }}
              </span>
              <span v-if="w.el" class="flex items-center gap-0.5 text-sky-300/90">
                {{ w.el }} {{ w.elv }}
                <span v-if="w.awaken" class="text-[9px] text-amber-300/70">觉醒</span>
              </span>
              <span v-if="w.aff !== undefined" :class="w.aff > 0 ? 'text-emerald-300/80' : 'text-parch-dim'">
                会心{{ w.aff }}%
              </span>
              <span v-if="w.slot" class="text-parch-dim">孔{{ w.slot }}</span>
              <span v-if="w.sharp" class="text-parch-dim">斩味{{ w.sharp }}</span>
            </div>

            <!-- 作成时期 -->
            <div v-if="w.craft" class="mt-1 flex items-center gap-1 text-[10.5px] text-parch-dim">
              <MapPin :size="10" class="shrink-0 text-gold/60" />
              <span>{{ w.craft }}</span>
            </div>

            <!-- 理由 -->
            <button
              v-if="w.why"
              type="button"
              class="mt-1.5 flex w-full items-start gap-1 text-left text-[10.5px] leading-relaxed"
              @click="toggle(`w${i}`)"
            >
              <Star :size="10" class="mt-0.5 shrink-0 text-gold/70" />
              <span
                class="min-w-0 flex-1 text-parch-dim/90"
                :class="open.has(`w${i}`) ? '' : 'line-clamp-2'"
              >
                {{ w.why }}
              </span>
              <ChevronDown
                :size="10"
                class="mt-0.5 shrink-0 text-parch-dim/50 transition-transform"
                :class="open.has(`w${i}`) ? 'rotate-180' : ''"
              />
            </button>
          </div>
        </template>

        <!-- 防具卡 -->
        <template v-else>
          <div
            v-for="(a, i) in list"
            :key="`a-${i}`"
            class="rounded-lg border border-ink-line bg-ink-card p-2.5"
          >
            <div class="flex items-baseline gap-2">
              <span class="min-w-0 flex-1 text-[13px] font-medium leading-snug text-parch">
                {{ a.n || (a.skills?.slice(0, 2).join(' · ') ?? '混装推荐') }}
              </span>
              <span
                v-if="a.def"
                class="shrink-0 flex items-center gap-0.5 text-[11px] tabular-nums text-parch"
              >
                <Shield :size="10" class="text-gold/70" />{{ a.def }}
              </span>
            </div>

            <div
              v-if="a.set && a.n && !a.set.startsWith(a.n)"
              class="mt-0.5 text-[10.5px] leading-snug text-parch-dim/80"
            >
              {{ a.set }}
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

            <!-- 耐性 -->
            <div v-if="a.res" class="mt-1 flex items-center gap-2.5 text-[10.5px] tabular-nums">
              <span
                v-for="c in resCols"
                :key="c.key"
                class="flex items-center gap-0.5"
                :class="resClass(a.res[c.key] ?? 0)"
              >
                {{ c.label }}{{ a.res[c.key] }}
              </span>
              <span v-if="a.slot" class="ml-auto text-parch-dim">孔{{ a.slot }}</span>
            </div>

            <!-- 作成 + 武器 -->
            <div class="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-parch-dim">
              <span v-if="a.craft" class="flex items-center gap-0.5">
                <MapPin :size="9" class="text-gold/60" />{{ a.craft }}
              </span>
              <span v-if="a.weapons" class="flex items-center gap-0.5">
                <Sparkles :size="9" class="text-parch-dim/50" />{{ a.weapons }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
