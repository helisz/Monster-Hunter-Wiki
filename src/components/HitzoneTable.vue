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
  if (s === '伤口') return 'bg-rose-500/15 text-rose-300'
  if (s === '弱点') return 'bg-emerald-500/15 text-emerald-300'
  if (s === '可破坏') return 'bg-amber-500/15 text-amber-300'
  return 'bg-ink-line text-parch-dim'
}

const stateTextClass = (s) => {
  if (s === '伤口') return 'text-rose-300'
  if (s === '弱点') return 'text-emerald-300'
  if (s === '可破坏') return 'text-amber-300'
  return 'text-parch-dim/70'
}

function val(row, key) {
  const v = row[key]
  return typeof v === 'number' ? v : null
}

function heat(v) {
  if (v === null) return ''
  if (v >= 60) return 'text-emerald-400 font-bold'
  if (v >= 45) return 'text-emerald-300 font-semibold'
  if (v <= 5) return 'text-parch-dim/50'
  if (v <= 20) return 'text-rose-400/70'
  return 'text-parch'
}
</script>

<template>
  <div class="space-y-2.5">
    <div
      v-for="g in groups"
      :key="g.part"
      class="overflow-hidden rounded-xl border border-ink-line bg-ink-card"
    >
      <div class="flex items-center justify-between gap-2 border-b border-ink-line px-3 py-2">
        <span class="text-sm font-semibold text-parch">{{ g.part }}</span>
        <div v-if="g.rows.length > 1" class="flex flex-wrap justify-end gap-1">
          <span
            v-for="(r, i) in g.rows"
            :key="i"
            class="rounded px-1.5 py-0.5 text-[10px] font-medium"
            :class="stateClass(r.state)"
          >
            {{ stateLabel(r.state) }}
          </span>
        </div>
      </div>

      <div class="divide-y divide-ink-line/60">
        <div v-for="(r, i) in g.rows" :key="i" class="px-3 py-2">
          <!-- 攻击类型 -->
          <div class="mb-1.5 flex items-center gap-3">
            <span class="w-9 shrink-0 text-[10px]" :class="stateTextClass(r.state)">
              {{ stateLabel(r.state) }}
            </span>
            <div v-for="t in ['slash', 'strike', 'shell']" :key="t" class="flex items-center gap-1">
              <img :src="icon(`hit_${t}`)" alt="" class="size-3.5 opacity-80" />
              <span class="text-xs tabular-nums" :class="heat(val(r, t))">{{ val(r, t) ?? '—' }}</span>
            </div>
          </div>

          <!-- 属性 -->
          <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1 pl-11">
            <div v-for="e in ELEMENTS" :key="e.key" class="flex items-center gap-1">
              <img :src="icon(e.icon)" alt="" class="size-3.5 opacity-80" />
              <span class="text-xs tabular-nums" :class="heat(val(r, e.key))">
                {{ val(r, e.key) ?? '—' }}
              </span>
            </div>
            <div class="flex items-center gap-1 border-l border-ink-line pl-2.5">
              <img :src="icon('element_stun')" alt="" class="size-3.5 opacity-80" />
              <span class="text-xs tabular-nums" :class="heat(val(r, 'stun'))">
                {{ val(r, 'stun') ?? '—' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
