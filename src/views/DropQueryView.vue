<script setup>
import { ref, computed, onMounted, watch, inject, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, Star, ChevronRight, Package, Clock } from '@lucide/vue'
import { useMonsters } from '../composables/useMonsters'
import { useSunbreakMonsters } from '../composables/useSunbreakMonsters'
import { useDropQueries } from '../composables/useDropQueries'
import { useToast } from '../composables/useToast'
import { buildDropIndex, searchItems } from '../utils/dropIndex'

const props = defineProps({
  game: { type: String, default: 'wilds' },
})

const router = useRouter()
const isSunbreak = computed(() => props.game === 'sunbreak')
const wilds = useMonsters()
const rise = useSunbreakMonsters()
const monsters = computed(() => (isSunbreak.value ? rise.monsters.value : wilds.monsters.value))
async function loadData() {
  await (isSunbreak.value ? rise.load() : wilds.load())
}
const { saved, isSaved, toggle } = useDropQueries(props.game)

/** 详情页路由前缀 */
const detailBase = computed(() => (isSunbreak.value ? '/sunbreak/monsters' : '/wilds/monsters'))
const listPath = computed(() => (isSunbreak.value ? '/sunbreak/monsters' : '/wilds/monsters'))
const toast = useToast()

const loading = ref(true)
const index = ref(new Map())

onMounted(async () => {
  await loadData()
  index.value = buildDropIndex(monsters.value)
  loading.value = false
  // 支持 ?item=xxx 直达（收藏点进来）
  const q = new URLSearchParams(window.location.search).get('item')
  if (q) {
    keyword.value = q
    selected.value = q
  }
})

/** 搜索关键词 */
const keyword = ref('')
/** 已选中的素材 */
const selected = ref(null)
/** 下拉是否展开 */
const open = ref(false)
/** 键盘高亮索引 */
const cursor = ref(-1)
/** 下拉项 DOM 引用，用于滚动跟随 */
const listEl = ref(null)

const suggestions = computed(() => searchItems(index.value, keyword.value, 8))

const highlightKeyword = computed(() => keyword.value.trim())

/** 高亮匹配片段 */
function parts(name) {
  const q = highlightKeyword.value
  if (!q) return [{ text: name, hit: false }]
  const i = name.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return [{ text: name, hit: false }]
  return [
    { text: name.slice(0, i), hit: false },
    { text: name.slice(i, i + q.length), hit: true },
    { text: name.slice(i + q.length), hit: false },
  ].filter((p) => p.text)
}

/** 结果：选中素材的所有掉落来源 */
const results = computed(() => {
  if (!selected.value) return null
  return index.value.get(selected.value) || []
})

function pick(name) {
  selected.value = name
  keyword.value = name
  open.value = false
  cursor.value = -1
  history.replaceState(null, '', `?item=${encodeURIComponent(name)}`)
}

function clearQuery() {
  keyword.value = ''
  selected.value = null
  open.value = false
  cursor.value = -1
  history.replaceState(null, '', window.location.pathname)
}

function onInput() {
  selected.value = null
  open.value = true
  cursor.value = -1
}

function moveCursor(delta) {
  if (!suggestions.value.length) return
  open.value = true
  const n = suggestions.value.length
  cursor.value = (cursor.value + delta + n) % n
  nextTick(() => {
    const el = listEl.value?.children?.[cursor.value]
    el?.scrollIntoView({ block: 'nearest' })
  })
}

function onEnter() {
  if (cursor.value >= 0 && suggestions.value[cursor.value]) {
    pick(suggestions.value[cursor.value].name)
  } else if (suggestions.value.length === 1) {
    pick(suggestions.value[0].name)
  }
}

function onStar() {
  if (!selected.value) return
  const added = toggle(selected.value)
  toast.show(added ? `已收藏查询「${selected.value}」` : `取消收藏「${selected.value}」`)
}

function openMonster(slug) {
  router.push(`${detailBase.value}/${slug}`)
}

// 上报顶栏「共 X 只」
const headerMeta = inject('headerMeta', null)
watch(
  () => (results.value ? results.value.length : null),
  (n) => {
    if (headerMeta) headerMeta.value = n === null ? '' : `共 ${n} 只`
  },
  { immediate: true }
)
onUnmounted(() => {
  if (headerMeta) headerMeta.value = ''
})

/** 收藏的查询条件命中数 */
function savedCount(item) {
  return index.value.get(item)?.length ?? 0
}
</script>

<template>
  <div class="pb-24">
    <!-- 图鉴内切换 -->
    <div class="flex gap-1 px-3 pt-2.5">
      <button
        type="button"
        class="flex-1 rounded-t-lg border-b-2 border-transparent px-3 py-1.5 text-[12px] font-medium text-parch-dim transition-colors hover:text-parch"
        @click="router.push(listPath)"
      >
        怪物图鉴
      </button>
      <button
        type="button"
        class="flex-1 rounded-t-lg border-b-2 border-gold px-3 py-1.5 text-[12px] font-semibold text-gold"
        aria-current="page"
      >
        掉落查询
      </button>
    </div>

    <div class="px-3 pt-3">
    <!-- 搜索区 -->
    <div class="relative">
      <div class="relative">
        <Search
          :size="14"
          class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-parch-dim"
        />
        <input
          v-model="keyword"
          type="search"
          inputmode="search"
          placeholder="输入素材名，如 龙玉、火龙的鳞"
          class="h-10 w-full rounded-lg border border-ink-line bg-ink-card pl-8 pr-8 text-[13px] text-parch placeholder:text-parch-dim/70 focus:border-gold/50 focus:outline-none"
          @input="onInput"
          @focus="open = true"
          @keydown.down.prevent="moveCursor(1)"
          @keydown.up.prevent="moveCursor(-1)"
          @keydown.enter.prevent="onEnter"
          @keydown.esc="open = false"
        />
        <button
          v-if="keyword"
          type="button"
          class="absolute right-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-parch-dim"
          aria-label="清空"
          @click="clearQuery"
        >
          <X :size="14" />
        </button>
      </div>

      <!-- 下拉建议 -->
      <div v-if="open && suggestions.length" class="mt-1.5 overflow-hidden rounded-lg border border-ink-line bg-ink-card shadow-lg">
        <div ref="listEl" class="max-h-64 overflow-y-auto">
          <button
            v-for="(s, i) in suggestions"
            :key="s.name"
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
            :class="i === cursor ? 'bg-gold/12' : 'hover:bg-ink-soft'"
            @click="pick(s.name)"
          >
            <Package :size="13" class="shrink-0 text-parch-dim/60" />
            <span class="min-w-0 flex-1 truncate text-[13px] text-parch">
              <template v-for="(p, pi) in parts(s.name)" :key="pi"
                ><span :class="p.hit ? 'font-semibold text-gold' : ''">{{ p.text }}</span></template
              >
            </span>
            <span class="shrink-0 text-[10px] text-parch-dim">{{ s.count }} 只</span>
          </button>
        </div>
      </div>

      <div
        v-else-if="open && keyword.trim() && !suggestions.length"
        class="mt-1.5 rounded-lg border border-ink-line bg-ink-card px-3 py-3 text-center text-[12px] text-parch-dim"
      >
        没有找到「{{ keyword.trim() }}」
      </div>
    </div>

    <!-- 点击外部关闭下拉 -->
    <div v-if="open" class="fixed inset-0 -z-10" @click="open = false" />

    <!-- 已选结果 -->
    <template v-if="selected">
      <div class="mt-3 flex items-center gap-2">
        <h2 class="min-w-0 flex-1 truncate text-base font-semibold text-parch">
          {{ selected }}
        </h2>
        <span class="shrink-0 text-[11px] text-parch-dim">{{ results?.length ?? 0 }} 只掉落</span>
        <button
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-full active:scale-90"
          :aria-label="isSaved(selected) ? '取消收藏查询' : '收藏查询'"
          :aria-pressed="isSaved(selected)"
          @click="onStar"
        >
          <Star :size="18" :class="isSaved(selected) ? 'fill-gold text-gold' : 'text-parch-dim/40'" />
        </button>
      </div>

      <div v-if="results?.length" class="mt-2 space-y-2">
        <button
          v-for="r in results"
          :key="r.slug"
          type="button"
          class="flex w-full items-center gap-2.5 rounded-md border border-ink-line bg-ink-card px-3 py-2 text-left active:border-gold/50"
          @click="openMonster(r.slug)"
        >
          <div class="size-10 shrink-0 overflow-hidden rounded-lg bg-ink-soft/60 p-0.5">
            <img
              :src="r.icon"
              :alt="r.name"
              loading="lazy"
              class="size-full object-contain"
              :class="isSunbreak ? '' : 'icon-blend'"
              @error="(e) => (e.target.style.visibility = 'hidden')"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-parch">{{ r.name }}</div>
            <div v-if="r.methods.length" class="mt-0.5 truncate text-[10px] text-parch-dim">
              {{ r.methods.slice(0, 3).join(' · ') }}
            </div>
          </div>
          <span
            v-if="r.rate"
            class="shrink-0 text-sm font-semibold tabular-nums"
            :class="r.rateValue >= 50 ? 'text-gold' : 'text-parch'"
          >
            {{ r.rate }}
          </span>
          <ChevronRight :size="16" class="shrink-0 text-parch-dim/50" />
        </button>
      </div>
      <div v-else class="mt-3 rounded-lg border border-ink-line bg-ink-card py-10 text-center text-sm text-parch-dim">
        没有怪物掉落该素材
      </div>
    </template>

    <!-- 未选：收藏的查询 + 空态 -->
    <template v-else>
      <div v-if="saved.length" class="mt-4">
        <div class="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-parch-dim">
          <Clock :size="12" />
          收藏的查询
          <span class="tabular-nums">{{ saved.length }}</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="q in saved"
            :key="q.item"
            type="button"
            class="flex items-center gap-1.5 rounded-full border border-ink-line bg-ink-card px-2.5 py-1.5 text-[12px] text-parch active:border-gold/50"
            @click="pick(q.item)"
          >
            {{ q.item }}
            <span class="tabular-nums text-[10px] text-parch-dim">{{ savedCount(q.item) }}</span>
          </button>
        </div>
      </div>

      <div v-if="!keyword.trim() && !saved.length" class="flex flex-col items-center justify-center py-24 text-center">
        <Package :size="38" class="mb-3 text-parch-dim/25" />
        <p class="text-sm text-parch-dim">输入素材名查询掉落来源</p>
        <p class="mt-1 text-[11px] text-parch-dim/60">
          共 {{ index.size }} 种素材
        </p>
      </div>
    </template>
    </div>
  </div>
</template>
