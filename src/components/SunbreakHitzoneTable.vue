<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  hitzones: { type: Array, required: true },
})

const COLS = [
  { key: 'slash', label: '斩', icon: 'hit_slash' },
  { key: 'strike', label: '打', icon: 'hit_strike' },
  { key: 'shell', label: '弹', icon: 'hit_shell' },
  { key: 'fire', label: '火', icon: 'element_fire' },
  { key: 'water', label: '水', icon: 'element_water' },
  { key: 'thunder', label: '雷', icon: 'element_thunder' },
  { key: 'ice', label: '冰', icon: 'element_ice' },
  { key: 'dragon', label: '龙', icon: 'element_dragon' },
  { key: 'stun', label: '眩晕', icon: 'element_stun' },
]

const icon = (name) => `${import.meta.env.BASE_URL}ui-icons/${name}.png`

/** 按部位分组，保持原始顺序 */
const groups = computed(() => {
  const map = new Map()
  for (const h of props.hitzones || []) {
    if (!map.has(h.part)) map.set(h.part, [])
    map.get(h.part).push(h)
  }
  return [...map.entries()].map(([part, rows]) => ({ part, rows }))
})

/** 展平成表格行：每个部位 × 每个 state 一行 */
const flatRows = computed(() => {
  const out = []
  for (const g of groups.value) {
    g.rows.forEach((r, i) => {
      out.push({
        part: g.part,
        isFirstOfGroup: i === 0,
        groupSize: g.rows.length,
        state: r.state,
        row: r,
      })
    })
  }
  return out
})

/** 数值配色：高绿低红 */
function valueClass(v) {
  if (typeof v !== 'number') return 'text-parch-dim/50'
  if (v >= 45) return 'text-emerald-400 font-semibold'
  if (v >= 30) return 'text-parch'
  if (v >= 15) return 'text-parch-dim'
  return 'text-red-400/70'
}

/** 状态标签 */
function stateLabel(state) {
  if (state === null || state === 0) return '常态'
  return `State ${state}`
}

/** 当前点亮的单元格：{ row: 索引, col: 列 key } */
const active = ref(null)

function pickCell(rowIdx, colKey) {
  if (active.value && active.value.row === rowIdx && active.value.col === colKey) {
    active.value = null
    return
  }
  active.value = { row: rowIdx, col: colKey }
}

const isActiveRow = (i) => active.value?.row === i
const isActiveCol = (k) => active.value?.col === k
const isActiveCell = (i, k) => isActiveRow(i) && isActiveCol(k)
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-ink-line">
    <table class="w-full border-collapse text-[11px] tabular-nums">
      <thead>
        <tr class="bg-ink-soft">
          <th
            class="sticky left-0 z-10 min-w-[64px] bg-ink-soft px-1.5 py-1.5 text-left font-medium text-parch-dim"
          >
            部位
          </th>
          <th class="min-w-[46px] px-1 py-1.5 text-center font-medium text-parch-dim">状态</th>
          <th
            v-for="c in COLS"
            :key="c.key"
            class="min-w-[28px] px-0.5 py-1.5 text-center font-medium text-parch-dim transition-colors"
            :class="isActiveCol(c.key) ? 'bg-gold/12' : ''"
          >
            <img
              :src="icon(c.icon)"
              :alt="c.label"
              :title="c.label"
              class="mx-auto size-3.5 opacity-80"
              @error="(e) => (e.target.style.display = 'none')"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(r, idx) in flatRows"
          :key="idx"
          class="border-t border-ink-line/60 transition-colors"
          :class="[
            r.isFirstOfGroup && r.groupSize > 1 ? 'border-t-ink-line' : '',
            isActiveRow(idx) ? 'bg-gold/[0.045]' : '',
          ]"
        >
          <td
            class="sticky left-0 z-10 whitespace-nowrap bg-ink-card px-1.5 py-1 font-medium transition-colors"
            :class="[isActiveRow(idx) ? 'bg-[#2A251F] text-gold' : 'text-parch']"
          >
            <template v-if="r.isFirstOfGroup">{{ r.part }}</template>
            <span v-else class="text-parch-dim/40">〃</span>
          </td>
          <td class="whitespace-nowrap px-1 py-1 text-center text-[10px] text-parch-dim">
            {{ stateLabel(r.state) }}
          </td>
          <td
            v-for="c in COLS"
            :key="c.key"
            class="cursor-pointer px-0.5 py-1 text-center transition-colors"
            :class="[
              valueClass(r.row[c.key]),
              isActiveCell(idx, c.key)
                ? 'rounded bg-gold/25 ring-1 ring-inset ring-gold/60'
                : isActiveCol(c.key)
                  ? 'bg-gold/[0.10]'
                  : '',
            ]"
            @click="pickCell(idx, c.key)"
          >
            {{ r.row[c.key] ?? '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
