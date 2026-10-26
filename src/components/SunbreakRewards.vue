<script setup>
import { computed, ref, watch } from 'vue'
import { ChevronDown } from '@lucide/vue'

const props = defineProps({
  rewards: { type: Array, required: true },
  /** 要高亮的素材名（从掉落查询进来） */
  focusItem: { type: String, default: null },
})

/** 获取方式的展示顺序 */
const METHOD_ORDER = ['剥取素材', '目标报酬', '捕获报酬', '部位破坏报酬', '掉落物', '随从艾露猫的收集物']

const groups = computed(() => {
  const map = new Map()
  for (const r of props.rewards || []) {
    const m = r.method || '其他'
    if (!map.has(m)) map.set(m, [])
    map.get(m).push(r)
  }
  // 按预设顺序排，未知的排最后
  return [...map.entries()]
    .sort((a, b) => {
      const ai = METHOD_ORDER.indexOf(a[0])
      const bi = METHOD_ORDER.indexOf(b[0])
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi)
    })
    .map(([method, rows]) => ({
      method,
      rows,
      // 组内按等级排序：下位 → 上位 → 大师
      byRank: groupByRank(rows),
      total: rows.length,
    }))
})

function groupByRank(rows) {
  const order = ['下位', '上位', '大师等级', '大师']
  const map = new Map()
  for (const r of rows) {
    const q = r.questRank || '其他'
    if (!map.has(q)) map.set(q, [])
    map.get(q).push(r)
  }
  return [...map.entries()]
    .sort((a, b) => {
      const ai = order.indexOf(a[0])
      const bi = order.indexOf(b[0])
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi)
    })
    .map(([rank, list]) => ({ rank: rank === '大师等级' ? '大师' : rank, list }))
}

/** 默认只展开第一个（剥取素材） */
const open = ref(new Set())
watch(
  groups,
  (g) => {
    if (!g.length) return
    // 有 focusItem 时，展开包含该素材的所有分组
    if (props.focusItem) {
      const hit = new Set()
      for (const grp of g) {
        if (grp.rows.some((r) => r.item === props.focusItem)) hit.add(grp.method)
      }
      if (hit.size) {
        open.value = hit
        return
      }
    }
    if (open.value.size === 0) open.value = new Set([g[0].method])
  },
  { immediate: true }
)

function toggle(method) {
  const s = new Set(open.value)
  if (s.has(method)) s.delete(method)
  else s.add(method)
  open.value = s
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="g in groups"
      :key="g.method"
      class="overflow-hidden rounded-lg border border-ink-line bg-ink-card"
    >
      <button
        type="button"
        class="flex w-full items-center gap-2 px-3 py-2 text-left"
        :aria-expanded="open.has(g.method)"
        @click="toggle(g.method)"
      >
        <span class="text-xs font-medium text-parch">{{ g.method }}</span>
        <span class="text-[10px] text-parch-dim">{{ g.total }} 条</span>
        <ChevronDown
          :size="14"
          class="ml-auto text-parch-dim transition-transform"
          :class="open.has(g.method) ? 'rotate-180' : ''"
        />
      </button>

      <div v-if="open.has(g.method)" class="border-t border-ink-line/60">
        <template v-for="rg in g.byRank" :key="rg.rank">
          <div class="bg-ink-soft/50 px-3 py-1 text-[10px] font-medium text-gold">
            {{ rg.rank }}
          </div>
          <div
            v-for="(r, i) in rg.list"
            :key="i"
            :data-item="r.item"
            class="flex items-center gap-2 border-t border-ink-line/30 px-3 py-1.5 transition-colors"
            :class="r.item === focusItem ? 'bg-gold/15' : ''"
          >
            <span
              class="min-w-0 flex-1 truncate text-[12px]"
              :class="r.item === focusItem ? 'font-semibold text-gold' : 'text-parch'"
            >{{ r.item }}</span>
            <span v-if="r.source" class="shrink-0 text-[10px] text-parch-dim">{{ r.source }}</span>
            <span v-if="r.amount" class="shrink-0 text-[10px] tabular-nums text-parch-dim">
              {{ r.amount }}
            </span>
            <span
              v-if="r.rate"
              class="w-9 shrink-0 text-right text-[11px] tabular-nums"
              :class="Number(r.rate.replace('%', '')) >= 50 ? 'text-gold' : 'text-parch-dim'"
            >
              {{ r.rate }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
