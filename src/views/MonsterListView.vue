<script setup>
import { ref, computed, onMounted, watch, inject, onUnmounted } from 'vue'
import { Star } from '@lucide/vue'
import { useFavorites } from '../composables/useFavorites'
import { useRouter } from 'vue-router'
import { Search, LayoutGrid, List, X, SlidersHorizontal } from '@lucide/vue'
import MonsterCard from '../components/MonsterCard.vue'
import { useMonsters } from '../composables/useMonsters'
import { useSettings } from '../composables/useSettings'

const router = useRouter()
const { monsters, loading, error, load } = useMonsters()
const { settings, setViewMode, resetFilters: resetFiltersStore } = useSettings()

const keyword = ref('')
const showFilters = ref(false)

// 过滤/排序全部走 settings（已持久化到 localStorage）
const sizeFilter = computed({
  get: () => settings.sizeFilter,
  set: (v) => (settings.sizeFilter = v),
})
const speciesFilter = computed({
  get: () => settings.speciesFilter,
  set: (v) => (settings.speciesFilter = v),
})
const sortKey = computed({
  get: () => settings.sortKey,
  set: (v) => (settings.sortKey = v),
})

onMounted(async () => {
  await load()
  if (monsters.value.length) monitor()
})

function monitor() {
  /* 预留 */
}

const speciesList = computed(() => {
  const set = new Set()
  for (const m of monsters.value) {
    if (m.species && m.species !== '????') set.add(m.species)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
})

const { favorites, count: favCount, isFav } = useFavorites()
const onlyFav = ref(false)

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  let list = monsters.value.filter((m) => {
    if (onlyFav.value && !isFav(m.slug)) return false
    if (sizeFilter.value === 'large' && !m.isLarge) return false
    if (sizeFilter.value === 'small' && m.isLarge) return false
    if (speciesFilter.value !== 'all' && m.species !== speciesFilter.value) return false
    if (!kw) return true
    const hay = `${m.name || ''} ${m.species || ''} ${m.slug || ''}`.toLowerCase()
    return hay.includes(kw)
  })

  if (sortKey.value === 'hr-desc') {
    list = [...list].sort((a, b) => (b.hunterRankPoint ?? -1) - (a.hunterRankPoint ?? -1))
  } else if (sortKey.value === 'hr-asc') {
    list = [...list].sort((a, b) => {
      const av = a.hunterRankPoint ?? Number.POSITIVE_INFINITY
      const bv = b.hunterRankPoint ?? Number.POSITIVE_INFINITY
      return av - bv
    })
  }
  return list
})

// 把「共 X 只」上报到顶栏右侧
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
  if (speciesFilter.value !== 'all') n++
  if (sortKey.value !== 'default') n++
  return n
})

function resetFilters() {
  resetFiltersStore()
}

function openDetail(m) {
  router.push(`/wilds/monsters/${m.slug}`)
}

const sizes = [
  { key: 'all', label: '全部' },
  { key: 'large', label: '大型' },
  { key: 'small', label: '小型' },
]
const sorts = [
  { key: 'default', label: '默认' },
  { key: 'hr-desc', label: 'HR点数降序' },
  { key: 'hr-asc', label: 'HR点数升序' },
]
</script>

<template>
  <div>
    <!-- 搜索栏 -->
    <div class="sticky top-14 z-20 border-b border-ink-line bg-ink/95 px-3 py-2.5 backdrop-blur">
      <!-- 搜索框：全宽 -->
      <div class="relative">
        <Search
          :size="16"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-parch-dim"
        />
        <input
          v-model="keyword"
          type="search"
          inputmode="search"
          placeholder="搜索怪物名称、物种"
          class="h-10 w-full rounded-xl border border-ink-line bg-ink-card pl-9 pr-9 text-sm text-parch placeholder:text-parch-dim/70 focus:border-gold/50 focus:outline-none"
        />
        <button
          v-if="keyword"
          type="button"
          class="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-parch-dim"
          aria-label="清空"
          @click="keyword = ''"
        >
          <X :size="15" />
        </button>
      </div>

      <!-- 操作行：收藏 / 筛选 / 视图切换 -->
      <div class="mt-2 flex items-center gap-2">
        <button
          type="button"
          class="flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium transition-colors"
          :class="
            onlyFav
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          :aria-pressed="onlyFav"
          @click="onlyFav = !onlyFav"
        >
          <Star :size="14" :class="onlyFav ? 'fill-gold' : ''" />
          收藏
          <span class="tabular-nums opacity-70">{{ favCount }}</span>
        </button>

        <button
          type="button"
          class="relative flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium transition-colors"
          :class="
            showFilters || activeFilterCount
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          aria-label="筛选"
          @click="showFilters = !showFilters"
        >
          <SlidersHorizontal :size="15" />
          筛选
          <span
            v-if="activeFilterCount"
            class="flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-ink"
          >
            {{ activeFilterCount }}
          </span>
        </button>

        <div class="ml-auto flex overflow-hidden rounded-xl border border-ink-line">
          <button
            type="button"
            class="flex size-9 items-center justify-center"
            :class="settings.viewMode === 'card' ? 'bg-gold/15 text-gold' : 'bg-ink-card text-parch-dim'"
            aria-label="卡片视图"
            @click="setViewMode('card')"
          >
            <LayoutGrid :size="17" />
          </button>
          <button
            type="button"
            class="flex size-9 items-center justify-center border-l border-ink-line"
            :class="settings.viewMode === 'list' ? 'bg-gold/15 text-gold' : 'bg-ink-card text-parch-dim'"
            aria-label="列表视图"
            @click="setViewMode('list')"
          >
            <List :size="17" />
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
          <div class="mb-1.5 text-[11px] font-medium tracking-wider text-parch-dim">物种</div>
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              class="h-8 rounded-lg px-3 text-xs font-medium transition-colors"
              :class="
                speciesFilter === 'all'
                  ? 'bg-gold/15 text-gold ring-1 ring-gold/40'
                  : 'bg-ink-soft text-parch-dim'
              "
              @click="speciesFilter = 'all'"
            >
              全部
            </button>
            <button
              v-for="sp in speciesList"
              :key="sp"
              type="button"
              class="h-8 rounded-lg px-3 text-xs font-medium transition-colors"
              :class="
                speciesFilter === sp
                  ? 'bg-gold/15 text-gold ring-1 ring-gold/40'
                  : 'bg-ink-soft text-parch-dim'
              "
              @click="speciesFilter = sp"
            >
              {{ sp }}
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

      <div v-if="loading" class="mt-2 px-0.5 text-[11px] text-parch-dim">加载中…</div>
    </div>

    <!-- 内容 -->
    <div class="px-3 pb-24 pt-3">
      <div v-if="error" class="rounded-xl border border-ink-line bg-ink-card p-4 text-sm text-parch-dim">
        数据加载失败：{{ error }}
      </div>

      <div
        v-else-if="!loading && filtered.length === 0"
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
          settings.viewMode === 'card'
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
          <MonsterCard :monster="m" :mode="settings.viewMode" />
        </button>
      </div>
    </div>
  </div>
</template>
