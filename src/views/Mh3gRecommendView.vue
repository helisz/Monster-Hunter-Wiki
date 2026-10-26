<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Sword, Shield, Sparkles, MapPin, ChevronDown } from '@lucide/vue'

const BASE = import.meta.env.BASE_URL
let cache = null

const data = ref(cache || { rank: {}, armor: {} })
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
  { key: 'rank', label: '推荐武器', icon: Sword },
  { key: 'armor', label: '推荐防具', icon: Shield },
]

const KEY = 'mhw.mh3gRecommendTab2'
const tab = ref(localStorage.getItem(KEY) || 'rank')
watch(tab, (v) => {
  try {
    localStorage.setItem(KEY, v)
  } catch {}
})

const RANKS = ['下位', '上位', 'G级']
const rank = ref('下位')

/** 村优先排序：村★小的在前，无村的排后面（再按港★） */
function sortItems(items) {
  return [...items].sort((a, b) => {
    const av = a.lv?.village
    const bv = b.lv?.village
    if (av != null && bv == null) return -1
    if (av == null && bv != null) return 1
    if (av != null && bv != null && av !== bv) return av - bv
    const ap = a.lv?.port
    const bp = b.lv?.port
    if (ap != null && bp != null && ap !== bp) return ap - bp
    return 0
  })
}

/** 当前等级的分节（每节内含排序后的条目） */
const groups = computed(() => {
  const raw = data.value[tab.value]?.[rank.value] || []
  return raw.map((g) => ({ ...g, items: sortItems(g.items || []) }))
})

const total = computed(() => groups.value.reduce((n, g) => n + g.items.length, 0))

const headerMeta = inject('headerMeta', null)
watch(
  () => [tab.value, rank.value, total.value],
  () => {
    if (headerMeta) headerMeta.value = `${total.value} 条推荐`
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

/** 折叠的分节 */
const collapsed = ref(new Set())
function toggleSection(sec) {
  const s = new Set(collapsed.value)
  if (s.has(sec)) s.delete(sec)
  else s.add(sec)
  collapsed.value = s
}

/** 村/港等级徽标文本 */
function lvText(it) {
  const v = it.lv || {}
  const parts = []
  if (v.village != null) parts.push(`村★${v.village}`)
  if (v.port != null) parts.push(`港★${v.port}`)
  return parts.join(' ')
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
            {{ (data[tab]?.[r] || []).reduce((n, g) => n + (g.items?.length || 0), 0) }}
          </span>
        </button>
      </div>

      <div v-if="pending" class="px-3 pb-2 text-[11px] text-parch-dim">加载中…</div>
    </div>

    <div class="pb-24 pt-2">
      <div v-if="error" class="mx-3 rounded-xl border border-ink-line bg-ink-card p-4 text-sm text-parch-dim">
        数据加载失败：{{ error }}
      </div>

      <div v-else-if="!pending && !total" class="py-20 text-center text-sm text-parch-dim">
        这个等级暂无推荐
      </div>

      <!-- 按武器 / 防具种类分节 -->
      <section v-for="g in groups" :key="g.section" class="mb-1">
        <!-- 分节标题（滚动吸顶） -->
        <button
          type="button"
          class="sticky top-[9.125rem] z-10 flex w-full items-center gap-2 border-y border-ink-line/60 bg-ink-soft/95 px-3 py-1.5 backdrop-blur"
          @click="toggleSection(g.section)"
        >
          <span class="text-[12px] font-semibold tracking-wide text-gold">{{ g.section }}</span>
          <span class="rounded bg-black/30 px-1.5 py-0.5 text-[9.5px] tabular-nums text-parch-dim">
            {{ g.items.length }}
          </span>
          <span class="flex-1"></span>
          <ChevronDown
            :size="12"
            class="text-parch-dim/60 transition-transform"
            :class="collapsed.has(g.section) ? '-rotate-90' : ''"
          />
        </button>

        <div v-show="!collapsed.has(g.section)" class="space-y-1.5 px-3 pt-2">
          <!-- 武器条目 -->
          <template v-if="tab === 'rank'">
            <div
              v-for="(w, i) in g.items"
              :key="`w-${g.section}-${i}`"
              class="rounded-lg border border-ink-line bg-ink-card p-2.5"
            >
              <div class="flex items-baseline gap-1.5">
                <span v-if="w.star" class="shrink-0 text-[13px] leading-none text-gold">☆</span>
                <span class="min-w-0 flex-1 text-[13px] font-medium leading-snug text-parch">
                  {{ w.n }}
                </span>
              </div>

              <!-- 稀有素材 -->
              <div v-if="w.rare" class="mt-1 flex items-start gap-1 text-[10.5px] text-amber-300/90">
                <span class="shrink-0">稀有素材</span>
                <span class="min-w-0 flex-1">{{ w.rare }}</span>
              </div>

              <!-- 数值 -->
              <div class="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] tabular-nums">
                <span class="flex items-center gap-0.5 font-medium text-parch">
                  <Sword :size="10" class="text-gold/70" />{{ w.atk }}
                </span>
                <span v-if="w.def" class="text-emerald-300/85">防+{{ w.def }}</span>
                <span v-if="w.el" class="text-sky-300/90">
                  {{ w.el }} {{ w.elv }}
                </span>
                <span v-if="w.awaken" class="text-amber-300/80">
                  觉醒 {{ w.awaken.el }} {{ w.awaken.v }}
                </span>
                <span v-if="w.shell" class="text-orange-300/85">{{ w.shell.type }}{{ w.shell.lv }}</span>
                <span v-if="w.phial" class="text-violet-300/85">{{ w.phial }}</span>
                <span v-if="w.aff !== undefined" :class="w.aff > 0 ? 'text-emerald-300/85' : w.aff < 0 ? 'text-red-300/85' : 'text-parch-dim'">
                  会心{{ w.aff }}%
                </span>
                <span v-if="w.slot" class="text-parch-dim">孔{{ w.slot }}</span>
              </div>

              <!-- 音色 / 弹 · 装填 -->
              <div v-if="w.tone" class="mt-0.5 text-[10px] text-parch-dim">音色 {{ w.tone }}</div>
              <div
                v-if="w.reload || w.recoil || w.sway || w.rapid || w.crouch || w.arc"
                class="mt-0.5 space-y-0.5 text-[10px] leading-snug text-parch-dim"
              >
                <div v-if="w.reload || w.recoil" class="flex flex-wrap gap-x-2">
                  <span v-if="w.reload">装填 {{ w.reload }}</span>
                  <span v-if="w.recoil">后坐力 {{ w.recoil }}</span>
                </div>
                <div v-if="w.sway"><span class="text-parch-dim/60">摇晃</span> {{ w.sway }}</div>
                <div v-if="w.rapid"><span class="text-parch-dim/60">速射</span> {{ w.rapid }}</div>
                <div v-if="w.crouch"><span class="text-parch-dim/60">蹲射</span> {{ w.crouch }}</div>
                <div v-if="w.arc"><span class="text-parch-dim/60">曲射</span> {{ w.arc }}</div>
              </div>

              <!-- 锋利度 -->
              <div v-if="w.sharp" class="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[10px] text-parch-dim">
                <span>斩味 {{ w.sharp }}</span>
              </div>

              <!-- 作成时期（原文） -->
              <div v-if="w.craft" class="mt-1 flex items-start gap-1 text-[10.5px] text-parch-dim/85">
                <MapPin :size="9" class="mt-0.5 shrink-0 text-gold/60" />
                <span class="min-w-0 flex-1">作成 {{ w.craft }}</span>
              </div>

              <!-- 理由：完整显示 -->
              <div v-if="w.why" class="mt-1.5 border-t border-ink-line/50 pt-1.5">
                <div class="mb-0.5 text-[9.5px] font-medium tracking-wide text-gold/70">推荐理由</div>
                <p class="text-[11.5px] leading-[1.7] text-parch-dim">{{ w.why }}</p>
              </div>
            </div>
          </template>

          <!-- 防具条目 -->
          <template v-else>
            <div
              v-for="(a, i) in g.items"
              :key="`a-${g.section}-${i}`"
              class="rounded-lg border border-ink-line bg-ink-card p-2.5"
            >
              <div class="flex items-baseline gap-1.5">
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

              <div v-if="a.skills?.length" class="mt-1.5 flex flex-wrap gap-1">
                <span
                  v-for="s in a.skills"
                  :key="s"
                  class="rounded bg-gold/12 px-1.5 py-0.5 text-[10px] text-gold"
                >
                  {{ s }}
                </span>
              </div>

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

              <div class="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-parch-dim">
                <span v-if="a.craft" class="flex items-center gap-0.5">
                  <MapPin :size="9" class="text-gold/60" />{{ a.craft }}
                </span>
                <span v-if="a.weapons" class="flex items-center gap-0.5">
                  <Sparkles :size="9" class="text-parch-dim/50" />{{ a.weapons }}
                </span>
                <span v-if="lvText(a)" class="ml-auto tabular-nums opacity-70">{{ lvText(a) }}</span>
              </div>
            </div>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>
