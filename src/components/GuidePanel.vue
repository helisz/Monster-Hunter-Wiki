<script setup>
import { ref } from 'vue'
import { ScrollText, ChevronDown } from '@lucide/vue'

defineProps({
  text: { type: String, required: true },
})

const BASE = import.meta.env.BASE_URL

const expanded = ref(false)
</script>

<template>
  <section class="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/8 to-transparent p-3.5">
    <!-- 部落纹理背景（极淡） -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-repeat opacity-[0.045]"
      :style="{ backgroundImage: `url(${BASE}tribal.svg)`, backgroundSize: '110px 110px' }"
    />
    <div class="relative mb-2 flex items-center gap-2">
      <ScrollText :size="16" class="text-gold" />
      <h3 class="text-sm font-semibold text-gold">狩猎攻略</h3>
    </div>

    <p
      class="relative whitespace-pre-line text-xs leading-relaxed text-parch-dim"
      :class="expanded ? '' : 'line-clamp-4'"
    >
      {{ text }}
    </p>

    <button
      type="button"
      class="relative mt-2 -mb-1 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] text-parch-dim/80 active:bg-ink-soft"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      {{ expanded ? '收起' : '展开全文' }}
      <ChevronDown
        :size="13"
        class="transition-transform"
        :class="expanded ? 'rotate-180' : ''"
      />
    </button>
  </section>
</template>
