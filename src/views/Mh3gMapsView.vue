<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { Map } from '@lucide/vue'

const BASE = import.meta.env.BASE_URL
let cache = null

const data = ref(cache || { maps: [] })
const pending = ref(false)
const error = ref(null)

async function load() {
  if (cache) {
    data.value = cache
    return
  }
  pending.value = true
  try {
    const res = await fetch(`${BASE}data/maps_mh3g.json`)
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

const KEY = 'mhw.mh3gMapIdx'
const idx = ref(Number(localStorage.getItem(KEY) || 0))

const maps = computed(() => (data.value.maps || []).filter((m) => m.tables.length || m.paragraphs.length))
const cur = computed(() => maps.value[idx.value] || maps.value[0])

function select(i) {
  idx.value = i
  try {
    localStorage.setItem(KEY, String(i))
  } catch {}
}

const headerMeta = inject('headerMeta', null)
watch(
  () => [maps.value.length, cur.value?.name],
  () => {
    if (headerMeta) headerMeta.value = `${maps.value.length} 张地图`
  },
  { immediate: true }
)
onUnmounted(() => {
  if (headerMeta) headerMeta.value = ''
})

/** 采集点明细表：按场所分组 */
const spots = computed(() => {
  const t = cur.value?.tables?.find((x) => x.rows)
  return t?.rows || []
})

const spotCols = computed(() => {
  const t = cur.value?.tables?.find((x) => x.rows)
  if (!t?.fields) return []
  return t.fields.filter((f) => f !== '场所')
})
</script>

<template>
  <div>
    <div class="sticky top-14 z-20 border-b border-ink-line bg-ink/95 backdrop-blur">
      <div class="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2">
        <button
          v-for="(m, i) in maps"
          :key="m.name"
          type="button"
          class="shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors"
          :class="
            cur?.name === m.name
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-ink-line bg-ink-card text-parch-dim'
          "
          @click="select(i)"
        >
          {{ m.name }}
        </button>
      </div>
      <div v-if="pending" class="px-3 pb-2 text-[11px] text-parch-dim">加载中…</div>
    </div>

    <div class="px-3 pb-24 pt-3">
      <div v-if="error" class="rounded-xl border border-ink-line bg-ink-card p-4 text-sm text-parch-dim">
        数据加载失败：{{ error }}
      </div>

      <template v-else-if="cur">
        <div class="mb-3 flex items-center gap-2">
          <Map :size="16" class="text-gold" />
          <h3 class="text-[15px] font-semibold text-parch">{{ cur.name }}</h3>
        </div>

        <div v-if="cur.paragraphs.length" class="mb-3 rounded-lg border border-ink-line bg-ink-card p-3">
          <p v-for="(p, i) in cur.paragraphs" :key="i" class="text-[11.5px] leading-relaxed text-parch-dim">
            {{ p }}
          </p>
        </div>

        <!-- 采集点 -->
        <div v-if="spots.length" class="space-y-2">
          <div
            v-for="(s, i) in spots"
            :key="i"
            class="rounded-lg border border-ink-line bg-ink-card p-2.5"
          >
            <div class="mb-1.5 flex items-center gap-1.5">
              <span class="rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-gold">
                {{ s['场所'] || `点 ${i + 1}` }}
              </span>
            </div>
            <div class="space-y-1">
              <div v-for="c in spotCols" :key="c" class="flex gap-2 text-[10.5px] leading-snug">
                <span class="w-[74px] shrink-0 text-parch-dim/70">{{ c }}</span>
                <span class="min-w-0 flex-1 text-parch">{{ s[c] || '—' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="py-16 text-center text-sm text-parch-dim">该地图暂无采集点数据</div>
      </template>
    </div>
  </div>
</template>
