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
    cover: `${import.meta.env.BASE_URL}wilds-cover.jpg`,
    hub: '/wilds',
    available: true,
  },
  {
    id: 'sunbreak',
    title: '怪物猎人：崛起 曙光',
    subtitle: 'Monster Hunter Rise: Sunbreak',
    cover: `${import.meta.env.BASE_URL}sunbreak-cover.jpg`,
    hub: '/sunbreak',
    available: true,
  },
  {
    id: 'mh3g',
    title: '怪物猎人 3G',
    subtitle: 'Monster Hunter 3G',
    cover: `${import.meta.env.BASE_URL}mh3g-cover.jpg`,
    hub: '/mh3g',
    available: true,
  },
]

function enter(game) {
  if (!game.available) return
  setGame(game.id)
  router.push(game.hub || '/wilds')
}
</script>

<template>
  <div class="px-4 pt-10">
    <div class="mb-8">
      <div class="mb-2 text-xs font-medium tracking-[0.2em] text-gold">MONSTER HUNTER</div>
      <h2 class="text-2xl font-bold leading-tight text-parch">选择游戏</h2>
      <p class="mt-2 text-sm text-parch-dim">选择作品查看怪物图鉴</p>
    </div>

    <div class="space-y-3">
      <button
        v-for="g in games"
        :key="g.id"
        type="button"
        class="w-full overflow-hidden rounded-2xl border border-ink-line bg-ink-card text-left transition-colors active:border-gold/50"
        @click="enter(g)"
      >
        <div class="relative w-full bg-black">
          <img :src="g.cover" :alt="g.title" class="block size-full object-cover" />
          <span
            class="absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm"
            :class="g.available ? 'bg-black/60 text-gold' : 'bg-black/60 text-parch-dim'"
          >
            {{ g.available ? '已开放' : '敬请期待' }}
          </span>
          <span
            v-if="g.coverFallback"
            class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-soft to-ink"
          >
            <span class="text-lg font-semibold tracking-wider text-gold/80">{{ g.title }}</span>
          </span>
        </div>
        <div class="flex items-center gap-3 px-3 py-3">
          <div class="min-w-0 flex-1">
            <div class="truncate text-base font-semibold text-parch">{{ g.title }}</div>
            <div class="truncate text-xs text-parch-dim">{{ g.subtitle }}</div>
          </div>
          <ChevronRight :size="20" class="shrink-0 text-parch-dim" />
        </div>
      </button>

      <div
        class="flex w-full items-center gap-4 rounded-2xl border border-dashed border-ink-line/70 bg-ink-soft/50 p-4"
      >
        <div class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-ink-line">
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
