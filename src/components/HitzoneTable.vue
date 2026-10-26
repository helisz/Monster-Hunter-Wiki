<script setup>
import { computed } from 'vue'
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
  if (s === '伤口') return 'text-rose-300'
  if (s === '弱点') return 'text-emerald-300'
  if (s === '可破坏') return 'text-amber-300'
  return 'text-parch-dim/70'
}

const COLS = ['slash', 'strike', 'shell', ...ELEMENTS.map((e) => e.key), 'stun']

function v(row, key) {
  const x = row[key]
  return typeof x === 'number' ? x : null
}

function heatClass(n) {
  if (n === null) return 'text-parch-dim/40'
  if (n >= 60) return 'text-emerald-400 font-bold'
  if (n >= 45) return 'text-emerald-300 font-semibold'
  if (n <= 5) return 'text-parch-dim/45'
  if (n <= 20) return 'text-rose-400/75'
  return 'text-parch'
}

/** 展平成表格行：每个部位 × 每个 state 一行 */
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
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-ink-line bg-ink-card">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-[10.5px]">
        <thead>
          <tr class="border-b border-ink-line bg-ink-soft/60">
            <th class="sticky left-0 z-10 bg-ink-soft px-1.5 py-2 text-left font-medium text-parch-dim">
              部位
            </th>
            <th class="whitespace-nowrap px-1 py-2 text-center font-medium text-parch-dim">状态</th>
            <th v-for="c in ['slash', 'strike', 'shell']" :key="c" class="px-1 py-2 text-center">
              <img :src="icon(`hit_${c}`)" alt="" class="mx-auto size-3.5 opacity-80" />
            </th>
            <th v-for="e in ELEMENTS" :key="e.key" class="px-1 py-2 text-center" :title="e.label">
              <img :src="icon(e.icon)" alt="" class="mx-auto size-3.5 opacity-80" />
            </th>
            <th class="px-1 py-2 text-center">
              <img :src="icon('element_stun')" alt="" class="mx-auto size-3.5 opacity-80" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(r, idx) in flatRows"
            :key="idx"
            class="border-b border-ink-line/40 last:border-0"
            :class="r.isFirstOfGroup && r.groupSize > 1 ? 'border-t-ink-line' : ''"
          >
            <td class="sticky left-0 z-10 whitespace-nowrap bg-ink-card px-1.5 py-1.5 font-medium text-parch">
              <template v-if="r.isFirstOfGroup">{{ r.part }}</template>
              <span v-else class="text-parch-dim/40">〃</span>
            </td>
            <td
              class="whitespace-nowrap px-1 py-1.5 text-center text-[9.5px]"
              :class="stateClass(r.state)"
            >
              {{ stateLabel(r.state) }}
            </td>
            <td
              v-for="c in COLS"
              :key="c"
              class="px-1 py-1.5 text-center tabular-nums"
              :class="heatClass(v(r.row, c))"
            >
              {{ v(r.row, c) ?? '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
