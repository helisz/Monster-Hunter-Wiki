<script setup>
import { useRouter } from 'vue-router'
import { ChevronRight } from '@lucide/vue'
import { useSettings } from '../composables/useSettings'

const router = useRouter()
const { setGame } = useSettings()

const games = [
  {
    id: 'wilds',
    title: '怪物猎人：荒野',
    subtitle: 'Monster Hunter Wilds',
    icon: `${import.meta.env.BASE_URL}icons/EM0001_00_0.webp`,
    available: true,
  },
]

function enter(game) {
  if (!game.available) return
  setGame(game.id)
  router.push('/wilds')
}
</script>

<template>
  <div class="px-4 pt-10">
    <div class="mb-8">
      <div class="mb-2 text-xs font-medium tracking-[0.2em] text-gold">MONSTER HUNTER</div>
      <h2 class="text-2xl font-bold leading-tight text-parch">选择游戏</h2>
      <p class="mt-2 text-sm text-parch-dim">数据仍在完善中，目前仅开放荒野</p>
    </div>

    <div class="space-y-3">
      <button
        v-for="g in games"
        :key="g.id"
        type="button"
        class="flex w-full items-center gap-4 rounded-2xl border border-ink-line bg-ink-card p-3 text-left transition-colors active:border-gold/50"
        @click="enter(g)"
      >
        <div class="size-16 shrink-0 overflow-hidden rounded-xl bg-black">
          <img :src="g.icon" :alt="g.title" class="icon-blend size-full object-cover" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="truncate text-base font-semibold text-parch">{{ g.title }}</div>
          <div class="truncate text-xs text-parch-dim">{{ g.subtitle }}</div>
          <div
            class="mt-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
            :class="g.available ? 'bg-gold/15 text-gold' : 'bg-ink-line text-parch-dim'"
          >
            {{ g.available ? '已开放' : '敬请期待' }}
          </div>
        </div>
        <ChevronRight :size="20" class="shrink-0 text-parch-dim" />
      </button>

      <div
        v-for="i in 1"
        :key="`soon-${i}`"
        class="flex w-full items-center gap-4 rounded-2xl border border-dashed border-ink-line/70 bg-ink-soft/50 p-3"
      >
        <div class="flex size-16 shrink-0 items-center justify-center rounded-xl border border-ink-line">
          <span class="text-xl text-parch-dim/40">?</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-base font-semibold text-parch-dim/60">敬请期待</div>
          <div class="text-xs text-parch-dim/50">更多作品数据整理中</div>
        </div>
      </div>
    </div>
  </div>
</template>
