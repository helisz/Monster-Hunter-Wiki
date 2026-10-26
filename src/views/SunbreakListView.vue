<script setup>
import { ref, computed, onMounted, watch, inject, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, LayoutGrid, List, X, SlidersHorizontal, Star } from '@lucide/vue'
import SunbreakMonsterCard from '../components/SunbreakMonsterCard.vue'
import { useSunbreakMonsters, RANKS } from '../composables/useSunbreakMonsters'
import { useFavorites } from '../composables/useFavorites'

const router = useRouter()
const { monsters, pending, error, load } = useSunbreakMonsters()

const KEY = 'mhw.sbFilters'
const defaults = {
  viewMode: 'card',
  sizeFilter: 'all',
  rankFilter: 'all',
  sortKey: 'default',
  keyword: '',
}

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

const keyword = computed({
  get: () => f.value.keyword,
  set: (v) => (f.value.keyword = v),
})
const sizeFilter = computed({
  get: () => f.value.sizeFilter,
  set: (v) => (f.value.sizeFilter = v),
})
const rankFilter = computed({
  get: () => f.value.rankFilter,
  set: (v) => (f.value.rankFilter = v),
})
const sortKey = computed({
  get: () => f.value.sortKey,
  set: (v) => (f.value.sortKey = v),
})

const viewMode = computed(() => f.value.viewMode)
function setViewMode(v) {
  f.value.viewMode = v
}

const showFilters = ref(false)
const onlyFav = ref(false)
const { count: favCount, isFav } = useFavorites('sunbreak')

onMounted(load)

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  let list = monsters.value.filter((m) => {
    if (onlyFav.value && !isFav(m.slug)) return false
    if (sizeFilter.value === 'large' && !m.isLarge) return false
    if (sizeFilter.value === 'small' && m.isLarge) return false
    if (rankFilter.value !== 'all' && !(m.ranks || []).includes(rankFilter.value)) return false
    if (!kw) return true
    const hay = `${m.name || ''} ${(m.ranks || []).join(' ')} ${m.slug || ''}`.toLowerCase()
    return hay.includes(kw)
  })

  if (sortKey.value === 'rank-desc') {
    // 大师 > 上位 > 下位，同档按名字
    const w = { 下位: 1, 上位: 2, 大师: 3 }
    list = [...list].sort((a, b) => {
      const av = w[a.maxRank] ?? 0
      const bv = w[b.maxRank] ?? 0
      if (av !== bv) return bv - av
      return a.name.localeCompare(b.name, 'zh-Hans-CN')
    })
  } else if (sortKey.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
  }
  return list
})

// 上报「共 X 只」到顶栏
const headerMeta = inject('headerMeta', null)
watch(
  () => filtered.value.length,
  (n) => {
    if (headerMeta) headerMeta.value = `共 ${n} 只`
  },
  { immediate: true }
)
onUnmounted(() => {
  if (headerMeta) headerMeta.value = ''
})

const activeFilterCount = computed(() => {
  let n = 0
  if (sizeFilter.value !== 'all') n++
  if (rankFilter.value !== 'all') n++
  if (sortKey.value !== 'default') n++
  return n
})

function resetFilters() {
  f.value = { ...defaults, viewMode: f.value.viewMode }
}

function openDetail(m) {
  router.push(`/sunbreak/monsters/${m.slug}`)
}

const sizes = [
  { key: 'all', label: '全部' },
  { key: 'large', label: '大型' },
  { key: 'small', label: '小型' },
]
const sorts = [
  { key: 'default', label: '默认' },
  { key: 'rank-desc', label: '等级降序' },
  { key: 'name', label: '名称' },
]
</script>

<template>
  <div>
    <!-- 图鉴内切换 -->
    <div class="flex gap-1 px-3 pt-2.5">
      <button
        type="button"
        class="flex-1 rounded-t-lg border-b-2 border-gold px-3 py-1.5 text-[12px] font-semibold text-gold"
        aria-current="page"
      >
        怪物图鉴
      </button>
      <button
        type="button"
        class="flex-1 rounded-t-lg border-b-2 border-transparent px-3 py-1.5 text-[12px] font-medium text-parch-dim transition-colors hover:text-parch"
        @click="router.push('/sunbreak/drops')"
      >
        掉落查询
      </button>
    </div>

    <!-- 搜索栏 -->
    <div class="sticky top-14 z-20 border-b border-ink-line bg-ink/95 px-3 py-2.5 backdrop-blur">
      <div class="relative">
        <Search
          :size="14"
          class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-parch-dim"
        />
        <input
          v-model="keyword"
          type="search"
          inputmode="search"
          placeholder="搜索怪物名称"
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

      <div class="mt-2 flex items-center gap-2">
        <button
          type="button"
          class="flex h-8 items-center gap-1 rounded-lg border px-2 text-[11px] font-medium transition-colors"
          :class="
            onlyFav
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          :aria-pressed="onlyFav"
          @click="onlyFav = !onlyFav"
        >
          <Star :size="12" :class="onlyFav ? 'fill-gold' : ''" />
          收藏
          <span class="tabular-nums opacity-70">{{ favCount }}</span>
        </button>

        <button
          type="button"
          class="relative flex h-8 items-center gap-1 rounded-lg border px-2 text-[11px] font-medium transition-colors"
          :class="
            showFilters || activeFilterCount
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          aria-label="筛选"
          @click="showFilters = !showFilters"
        >
          <SlidersHorizontal :size="13" />
          筛选
          <span
            v-if="activeFilterCount"
            class="flex size-3.5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-ink"
          >
            {{ activeFilterCount }}
          </span>
        </button>

        <div class="ml-auto flex overflow-hidden rounded-xl border border-ink-line">
          <button
            type="button"
            class="flex size-8 items-center justify-center"
            :class="viewMode === 'card' ? 'bg-gold/15 text-gold' : 'bg-ink-card text-parch-dim'"
            aria-label="卡片视图"
            @click="setViewMode('card')"
          >
            <LayoutGrid :size="15" />
          </button>
          <button
            type="button"
            class="flex size-8 items-center justify-center border-l border-ink-line"
            :class="viewMode === 'list' ? 'bg-gold/15 text-gold' : 'bg-ink-card text-parch-dim'"
            aria-label="列表视图"
            @click="setViewMode('list')"
          >
            <List :size="15" />
          </button>
        </div>
      </div>

      <!-- 筛选面板 -->
      <div v-if="showFilters" class="mt-2.5 space-y-2.5 rounded-xl border border-ink-line bg-ink-card p-3">
        <div>
          <div class="mb-1.5 text-[11px] font-medium tracking-wider text-parch-dim">收藏</div>
          <button
            type="button"
            class="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors"
            :class="onlyFav ? 'bg-gold/15 text-gold ring-1 ring-gold/40' : 'bg-ink-soft text-parch-dim'"
            :aria-pressed="onlyFav"
            @click="onlyFav = !onlyFav"
          >
            <Star :size="13" :class="onlyFav ? 'fill-gold' : ''" />
            只看收藏
            <span class="tabular-nums opacity-70">{{ favCount }}</span>
          </button>
        </div>

        <div>
          <div class="mb-1.5 text-[11px] font-medium tracking-wider text-parch-dim">体型</div>
          <div class="flex gap-1.5">
            <button
              v-for="s in sizes"
              :key="s.key"
              type="button"
              class="h-8 rounded-lg px-3 text-xs font-medium transition-colors"
              :class="
                sizeFilter === s.key
                  ? 'bg-gold/15 text-gold ring-1 ring-gold/40'
                  : 'bg-ink-soft text-parch-dim'
              "
              @click="sizeFilter = s.key"
            >
              {{ s.label }}
            </button>
          </div>
        </div>

        <div>
          <div class="mb-1.5 text-[11px] font-medium tracking-wider text-parch-dim">任务等级</div>
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              class="h-8 rounded-lg px-3 text-xs font-medium transition-colors"
              :class="
                rankFilter === 'all'
                  ? 'bg-gold/15 text-gold ring-1 ring-gold/40'
                  : 'bg-ink-soft text-parch-dim'
              "
              @click="rankFilter = 'all'"
            >
              全部
            </button>
            <button
              v-for="r in RANKS"
              :key="r.key"
              type="button"
              class="h-8 rounded-lg px-3 text-xs font-medium transition-colors"
              :class="
                rankFilter === r.key
                  ? 'bg-gold/15 text-gold ring-1 ring-gold/40'
                  : 'bg-ink-soft text-parch-dim'
              "
              @click="rankFilter = r.key"
            >
              {{ r.label }}
            </button>
          </div>
        </div>

        <div>
          <div class="mb-1.5 text-[11px] font-medium tracking-wider text-parch-dim">排序</div>
          <div class="flex gap-1.5">
            <button
              v-for="s in sorts"
              :key="s.key"
              type="button"
              class="h-8 rounded-lg px-3 text-xs font-medium transition-colors"
              :class="
                sortKey === s.key
                  ? 'bg-gold/15 text-gold ring-1 ring-gold/40'
                  : 'bg-ink-soft text-parch-dim'
              "
              @click="sortKey = s.key"
            >
              {{ s.label }}
            </button>
          </div>
        </div>

        <button
          v-if="activeFilterCount"
          type="button"
          class="h-8 w-full rounded-lg border border-ink-line text-xs font-medium text-parch-dim"
          @click="resetFilters"
        >
          重置筛选
        </button>
      </div>

      <div v-if="pending" class="mt-2 px-0.5 text-[11px] text-parch-dim">加载中…</div>
    </div>

    <!-- 内容 -->
    <div class="px-3 pb-24 pt-3">
      <div v-if="error" class="rounded-xl border border-ink-line bg-ink-card p-4 text-sm text-parch-dim">
        数据加载失败：{{ error }}
      </div>

      <div
        v-else-if="!pending && filtered.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <Search :size="36" class="mb-3 text-parch-dim/30" />
        <p class="text-sm text-parch-dim">没有匹配的怪物</p>
        <button
          v-if="activeFilterCount || keyword"
          type="button"
          class="mt-4 rounded-lg border border-ink-line px-4 py-2 text-xs text-parch-dim"
          @click="
            () => {
              keyword = ''
              resetFilters()
            }
          "
        >
          清空条件
        </button>
      </div>

      <div
        v-else
        :class="
          viewMode === 'card'
            ? 'grid grid-cols-3 gap-1.5 sm:grid-cols-4 xl:grid-cols-5'
            : 'flex flex-col gap-2'
        "
      >
        <button
          v-for="m in filtered"
          :key="m.slug"
          type="button"
          class="block text-left active:opacity-80"
          @click="openDetail(m)"
        >
          <SunbreakMonsterCard :monster="m" :mode="viewMode" />
        </button>
      </div>
    </div>
  </div>
</template>
