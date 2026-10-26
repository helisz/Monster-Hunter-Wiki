<script setup>
import { computed, ref } from 'vue'
import { ELEMENTS } from '../utils/advice'

const props = defineProps({
  groups: { type: Array, required: true },
})

const icon = (name) => `${import.meta.env.BASE_URL}ui-icons/${name}.png`

const stateLabel = (s) => {
  if (s === null) return '常态'
  if (s === '伤口') return '伤口'
  if (s === '弱点') return '弱点'
  if (s === '可破坏') return '可破坏'
  if (typeof s === 'string' && s.startsWith('State_')) return s.replace('State_', '状态')
  return s
}

const stateClass = (s) => {
  if (s === '伤口') return 'text-rose-300/90'
  if (s === '弱点') return 'text-emerald-300/90'
  if (s === '可破坏') return 'text-amber-300/90'
  return 'text-parch-dim/70'
}

/** 列头定义：物理 3 列 + 属性 5 列 + 眩晕 */
const HEADERS = [
  ...['slash', 'strike', 'shell'].map((k) => ({ key: k, icon: `hit_${k}`, label: k })),
  ...ELEMENTS.map((e) => ({ key: e.key, icon: e.icon, label: e.label })),
  { key: 'stun', icon: 'element_stun', label: '眩晕' },
]

function v(row, key) {
  const x = row[key]
  return typeof x === 'number' ? x : null
}

/** 数值配色：高绿低红（与曙光表一致） */
function heatClass(n) {
  if (n === null) return 'text-parch-dim/40'
  if (n >= 60) return 'text-emerald-400 font-bold'
  if (n >= 45) return 'text-emerald-300 font-semibold'
  if (n >= 30) return 'text-parch'
  if (n >= 15) return 'text-parch-dim'
  if (n <= 5) return 'text-parch-dim/45'
  return 'text-rose-400/75'
}

/** 展平成表格行：每个部位 × 每个 state 一行（与曙光表同构） */
const flatRows = computed(() => {
  const out = []
  for (const g of props.groups) {
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
  <div class="overflow-hidden rounded-lg border border-ink-line">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-[11px] tabular-nums">
        <thead>
          <tr class="bg-ink-soft">
            <th class="sticky left-0 z-10 min-w-[64px] bg-ink-soft px-1.5 py-1.5 text-left font-medium text-parch-dim">
              部位
            </th>
            <th class="min-w-[46px] px-1 py-1.5 text-center font-medium text-parch-dim">状态</th>
            <th
              v-for="h in HEADERS"
              :key="h.key"
              class="min-w-[28px] px-0.5 py-1.5 text-center font-medium transition-colors"
              :class="isActiveCol(h.key) ? 'bg-gold/12' : ''"
            >
              <img
                :src="icon(h.icon)"
                :alt="h.label"
                :title="h.label"
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
              {{ r.part }}
            </td>
            <td class="whitespace-nowrap px-1 py-1 text-center text-[10px]" :class="stateClass(r.state)">
              {{ stateLabel(r.state) }}
            </td>
            <td
              v-for="h in HEADERS"
              :key="h.key"
              class="cursor-pointer px-0.5 py-1 text-center transition-colors"
              :class="[
                heatClass(v(r.row, h.key)),
                isActiveCell(idx, h.key)
                  ? 'rounded bg-gold/25 ring-1 ring-inset ring-gold/60'
                  : isActiveCol(h.key)
                    ? 'bg-gold/[0.10]'
                    : '',
              ]"
              @click="pickCell(idx, h.key)"
            >
              {{ v(r.row, h.key) ?? '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
