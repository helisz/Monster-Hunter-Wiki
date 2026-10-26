<script setup>
import { computed } from 'vue'
import { Star } from '@lucide/vue'
import { useSettings } from '../composables/useSettings'
import { useFavorites } from '../composables/useFavorites'
import { useToast } from '../composables/useToast'
import { buildAdvice } from '../utils/advice'

const props = defineProps({
  monster: { type: Object, required: true },
  mode: { type: String, default: 'card' },
})

const { settings } = useSettings()
const { isFav, toggle } = useFavorites()
const toast = useToast()

const icon = (name) => `${import.meta.env.BASE_URL}ui-icons/${name}.png`

const WEAPON_HIT = { slash: 'hit_slash', strike: 'hit_strike', shell: 'hit_shell' }

function onStar(e) {
  e.preventDefault()
  e.stopPropagation()
  const added = toggle(props.monster.slug)
  toast.show(added ? `已收藏「${props.monster.name}」` : `已取消收藏「${props.monster.name}」`)
}

/** 列表模式简写：优先用当前武器；未配置时用斩/打/弹里最优的一列 */
const adviceBrief = computed(() => {
  if (settings.weaponType) return buildAdvice(props.monster, settings.weaponType)

  // 未配置武器：取三列中"该打部位"最多的那一种，作为通用参考
  const cands = ['slash', 'strike', 'shell']
    .map((w) => buildAdvice(props.monster, w))
    .filter((a) => a && !a.empty)
  if (!cands.length) return null
  return cands.sort((a, b) => b.good.length - a.good.length)[0]
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
      <button
        type="button"
        class="absolute right-1 top-1 flex size-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm active:scale-90"
        :aria-label="isFav(monster.slug) ? '取消收藏' : '收藏'"
        :aria-pressed="isFav(monster.slug)"
        @click="onStar"
      >
        <Star
          :size="16"
          :class="isFav(monster.slug) ? 'fill-gold text-gold' : 'text-white/60'"
        />
      </button>
    </div>
    <div class="px-2.5 py-2">
      <div class="truncate text-sm font-semibold text-parch">{{ monster.name }}</div>
      <div class="mt-0.5 truncate text-[11px] text-parch-dim">
        {{ monster.species || '—' }}
      </div>
    </div>
  </div>

  <div v-else class="rounded-xl border border-ink-line bg-ink-card px-3 py-2">
    <div class="flex items-center gap-3">
      <div class="size-10 shrink-0 overflow-hidden rounded-lg bg-black">
        <img
          :src="monster.icon"
          :alt="monster.name"
          loading="lazy"
          class="icon-blend size-full object-cover"
        />
      </div>
      <div class="min-w-0 flex-1">
        <div class="truncate text-sm font-semibold text-parch">{{ monster.name }}</div>
        <div class="truncate text-[11px] text-parch-dim">{{ monster.species || '—' }}</div>
      </div>
      <span
        v-if="monster.isLarge"
        class="shrink-0 rounded bg-gold/12 px-1.5 py-0.5 text-[10px] font-medium text-gold"
      >
        大型
      </span>
      <button
        type="button"
        class="-mr-1 flex size-9 shrink-0 items-center justify-center rounded-full active:scale-90"
        :aria-label="isFav(monster.slug) ? '取消收藏' : '收藏'"
        :aria-pressed="isFav(monster.slug)"
        @click="onStar"
      >
        <Star
          :size="17"
          :class="isFav(monster.slug) ? 'fill-gold text-gold' : 'text-parch-dim/40'"
        />
      </button>
    </div>

    <!-- 建议简写：属性 + 建议部位 -->
    <div
      v-if="adviceBrief && !adviceBrief.empty"
      class="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-ink-line/60 pt-1.5"
    >
      <span
        v-for="(e, i) in adviceBrief.elementRank"
        :key="e.key"
        class="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px]"
        :class="i === 0 ? 'bg-gold/12 text-gold' : 'bg-ink-soft text-parch-dim'"
      >
        <img :src="icon(e.icon)" alt="" class="size-3" />
        <span class="font-medium">{{ e.label }}{{ e.value }}</span>
      </span>
      <span class="text-parch-dim/30">|</span>
      <span v-if="adviceBrief.good.length" class="inline-flex items-center gap-1">
        <img
          :src="icon(WEAPON_HIT[adviceBrief.weaponType] || 'hit_slash')"
          alt=""
          class="size-[18px] shrink-0 brightness-125 contrast-110"
        />
        <span class="text-[10px] text-emerald-300">
          {{ adviceBrief.good.map((g) => g.part).join('·') }}
        </span>
      </span>
      <span v-else class="text-[10px] text-amber-300/80">无有效弱点</span>
    </div>
    <div v-else class="mt-1.5 border-t border-ink-line/60 pt-1.5 text-[10px] text-parch-dim/45">
      无肉质数据
    </div>
  </div>
</template>
