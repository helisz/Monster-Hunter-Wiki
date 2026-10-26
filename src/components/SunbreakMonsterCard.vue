<script setup>
import { computed } from 'vue'
import { Star } from '@lucide/vue'
import { useFavorites } from '../composables/useFavorites'
import { useToast } from '../composables/useToast'
import { buildSunbreakAdvice } from '../utils/sunbreakAdvice'

const props = defineProps({
  monster: { type: Object, required: true },
  mode: { type: String, default: 'card' }, // card | list
})

const { isFav, toggle } = useFavorites('sunbreak')
const toast = useToast()

const icon = (name) => `${import.meta.env.BASE_URL}ui-icons/${name}.png`

function onStar(e) {
  e.preventDefault()
  e.stopPropagation()
  const added = toggle(props.monster.slug)
  toast.show(added ? `已收藏「${props.monster.name}」` : `取消收藏「${props.monster.name}」`)
}

function onImgError(e) {
  e.target.style.visibility = 'hidden'
}

/** 等级标签：下位/上位/大师 */
const rankLabel = computed(() => {
  const r = props.monster.ranks || []
  if (!r.length) return null
  if (r.length === 3) return '全等级'
  return r[r.length - 1]
})

/** 列表模式简写：用推荐武器类型的优先部位 */
const brief = computed(() => {
  const base = buildSunbreakAdvice(props.monster, null)
  const w = base?.suggestedWeapon
  if (!w) return null
  const advice = buildSunbreakAdvice(props.monster, w)
  if (!advice || advice.empty) return null
  return advice
})
</script>

<template>
  <!-- 卡片模式 -->
  <div
    v-if="mode === 'card'"
    class="overflow-hidden rounded-md border border-ink-line bg-ink-card"
  >
    <div class="relative aspect-square bg-ink-soft/60 p-1.5">
      <img
        :src="monster.icon"
        :alt="monster.name"
        loading="lazy"
        class="size-full object-contain"
        @error="onImgError"
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
          :size="15"
          :class="isFav(monster.slug) ? 'fill-gold text-gold' : 'text-parch/70'"
        />
      </button>
    </div>
    <div class="px-1.5 pb-1.5 pt-1">
      <div class="truncate text-[12px] font-medium leading-tight text-parch">
        {{ monster.name }}
      </div>
      <div v-if="rankLabel" class="mt-0.5 truncate text-[10px] text-parch-dim">
        {{ rankLabel }}
      </div>
    </div>
  </div>

  <!-- 列表模式 -->
  <div v-else class="rounded-md border border-ink-line bg-ink-card px-3 py-2">
    <div class="flex items-center gap-2.5">
      <div class="size-10 shrink-0 overflow-hidden rounded-lg bg-ink-soft/60 p-0.5">
        <img
          :src="monster.icon"
          :alt="monster.name"
          loading="lazy"
          class="size-full object-contain"
          @error="onImgError"
        />
      </div>
      <div class="min-w-0 flex-1">
        <div class="truncate text-sm font-medium text-parch">{{ monster.name }}</div>
        <div class="mt-0.5 flex flex-wrap items-center gap-1 text-[10px] text-parch-dim">
          <span v-if="rankLabel" class="rounded bg-gold/12 px-1.5 py-0.5 text-gold">
            {{ rankLabel }}
          </span>
          <template v-if="brief">
            <img
              :src="icon(brief.weapon.icon)"
              alt=""
              class="size-3.5 opacity-80"
              @error="onImgError"
            />
            <span class="truncate">
              {{ brief.good.map((g) => g.part).join('、') || '无高效部位' }}
            </span>
          </template>
        </div>
      </div>
      <button
        type="button"
        class="-mr-1 flex size-9 shrink-0 items-center justify-center rounded-full active:scale-90"
        :aria-label="isFav(monster.slug) ? '取消收藏' : '收藏'"
        :aria-pressed="isFav(monster.slug)"
        @click="onStar"
      >
        <Star
          :size="16"
          :class="isFav(monster.slug) ? 'fill-gold text-gold' : 'text-parch-dim/40'"
        />
      </button>
    </div>
  </div>
</template>
