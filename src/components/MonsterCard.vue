<script setup>
defineProps({
  monster: { type: Object, required: true },
  mode: { type: String, default: 'card' },
})
</script>

<template>
  <div v-if="mode === 'card'" class="overflow-hidden rounded-2xl border border-ink-line bg-ink-card">
    <div class="relative aspect-square w-full bg-black">
      <img
        :src="monster.icon"
        :alt="monster.name"
        loading="lazy"
        class="icon-blend size-full object-cover"
      />
      <span
        v-if="monster.isLarge"
        class="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-gold backdrop-blur-sm"
      >
        大型
      </span>
    </div>
    <div class="px-2.5 py-2">
      <div class="truncate text-sm font-semibold text-parch">{{ monster.name }}</div>
      <div class="mt-0.5 truncate text-[11px] text-parch-dim">
        {{ monster.species || '—' }}
      </div>
    </div>
  </div>

  <div
    v-else
    class="flex items-center gap-3 rounded-xl border border-ink-line bg-ink-card px-3 py-2"
  >
    <div class="size-10 shrink-0 overflow-hidden rounded-lg bg-black">
      <img :src="monster.icon" :alt="monster.name" loading="lazy" class="icon-blend size-full object-cover" />
    </div>
    <div class="min-w-0 flex-1">
      <div class="truncate text-sm font-semibold text-parch">{{ monster.name }}</div>
      <div class="truncate text-[11px] text-parch-dim">
        {{ monster.species || '—' }}
        <span v-if="monster.hunterRankPoint" class="text-parch-dim/70">
          · HR {{ monster.hunterRankPoint }}
        </span>
      </div>
    </div>
    <span
      v-if="monster.isLarge"
      class="shrink-0 rounded bg-gold/12 px-1.5 py-0.5 text-[10px] font-medium text-gold"
    >
      大型
    </span>
  </div>
</template>
