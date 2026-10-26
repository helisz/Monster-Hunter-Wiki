<script setup>
import { ref } from 'vue'
import { Sword, Crosshair, ShieldAlert, Sparkles, HelpCircle } from '@lucide/vue'
import { WEAPONS } from '../utils/sunbreakAdvice'

const props = defineProps({
  advice: { type: Object, required: true },
})

const showHelp = ref(false)

const icon = (name) => `${import.meta.env.BASE_URL}ui-icons/${name}.png`

const tribalBg = {
  backgroundImage: `url(${import.meta.env.BASE_URL}tribal.svg)`,
  backgroundSize: '110px 110px',
}

function weaponLabel(key) {
  return WEAPONS.find((w) => w.key === key)?.label || key
}
</script>

<template>
  <section
    class="relative overflow-hidden rounded-xl border border-gold/30 bg-gradient-to-b from-gold/8 to-transparent p-3"
  >
    <!-- 部族纹理 -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-repeat opacity-[0.045]"
      :style="tribalBg"
    />
    <div class="relative">
      <div class="mb-2.5 flex items-center gap-1.5">
        <Sword :size="15" class="text-gold" />
        <h3 class="text-sm font-semibold text-gold">出战建议</h3>
        <div class="ml-auto flex items-center gap-1.5">
          <span
            v-if="advice.weaponType"
            class="flex items-center gap-1 rounded bg-gold/12 px-1.5 py-0.5 text-[11px] font-medium text-gold"
          >
            <img :src="icon(advice.weapon.icon)" alt="" class="size-3.5" />
            {{ advice.weapon.label }}
          </span>
          <button
            type="button"
            class="relative z-30 flex size-7 items-center justify-center rounded-full text-parch-dim active:bg-ink-card"
            aria-label="说明"
            @click.stop="showHelp = !showHelp"
          >
            <HelpCircle :size="15" />
          </button>
        </div>
      </div>

      <!-- tooltip -->
      <div
        v-if="showHelp"
        class="fixed inset-0 z-20"
        @click="showHelp = false"
      />
      <div
        v-if="showHelp"
        class="absolute right-2 top-10 z-30 w-56 rounded-lg border border-ink-line bg-ink-card p-2.5 text-[11px] leading-relaxed text-parch-dim shadow-xl"
      >
        <p class="font-medium text-parch">建议怎么读？</p>
        <p class="mt-1.5">肉质 ≥45 的部位列为「优先」，≤20 的列为「避开」，中间值不列。</p>
        <p class="mt-1">换武器后结论会变。点击右上角 ⚙ 可以切换武器类型。</p>
      </div>

      <div v-if="advice.empty" class="text-[12px] text-parch-dim">
        未选择武器类型。点击右上角齿轮选择后查看针对性建议。
      </div>

      <template v-else>
        <!-- 属性 -->
        <div v-if="advice.elements.length" class="mb-2 flex items-center gap-1.5">
          <Sparkles :size="13" class="shrink-0 text-parch-dim" />
          <span class="text-[11px] text-parch-dim">属性</span>
          <div class="flex flex-wrap items-center gap-1">
            <span
              v-for="(el, i) in advice.elements"
              :key="el.field"
              class="flex items-center gap-0.5 rounded bg-ink-soft px-1.5 py-0.5 text-[11px] text-parch"
            >
              <img :src="icon(el.icon)" alt="" class="size-3" />
              {{ el.label }} {{ el.value }}
              <span v-if="i < advice.elements.length - 1" class="text-parch-dim">></span>
            </span>
          </div>
        </div>

        <!-- 优先 -->
        <div class="mb-2 flex items-start gap-1.5">
          <Crosshair :size="13" class="mt-0.5 shrink-0 text-gold" />
          <span class="mt-0.5 text-[11px] text-parch-dim">优先</span>
          <div v-if="advice.good.length" class="flex flex-wrap gap-1">
            <span
              v-for="g in advice.good"
              :key="g.part"
              class="rounded bg-gold/15 px-1.5 py-0.5 text-[11px] text-gold"
            >
              {{ g.part }} {{ g.value }}
            </span>
          </div>
          <span v-else class="mt-0.5 text-[11px] text-parch-dim">无高效部位</span>
        </div>

        <!-- 避开 -->
        <div class="mb-2 flex items-start gap-1.5">
          <ShieldAlert :size="13" class="mt-0.5 shrink-0 text-red-400/70" />
          <span class="mt-0.5 text-[11px] text-parch-dim">避开</span>
          <div v-if="advice.bad.length" class="flex flex-wrap gap-1">
            <span
              v-for="b in advice.bad"
              :key="b.part"
              class="rounded bg-red-500/10 px-1.5 py-0.5 text-[11px] text-red-300/80"
            >
              {{ b.part }} {{ b.value }}
            </span>
          </div>
          <span v-else class="mt-0.5 text-[11px] text-parch-dim">无低效部位，全身均可打</span>
        </div>

        <!-- 底部：推荐武器 -->
        <div class="mt-2 space-y-1.5 border-t border-gold/15 pt-2 text-[11px] leading-relaxed text-parch-dim">
          <p>
            推荐
            <span class="font-medium text-gold">{{ weaponLabel(advice.suggestedWeapon) }}</span>
            武器（当前选择是 {{ advice.weapon.label }}<span
              v-if="advice.suggestedWeapon !== advice.weaponType"
              >，该武器有效部位较少</span
            >）。
          </p>
        </div>
      </template>
    </div>
  </section>
</template>
