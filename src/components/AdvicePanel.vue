<script setup>
import { ref, computed } from 'vue'
import { Sword, Crosshair, ShieldAlert, Sparkles, AlertTriangle, HelpCircle, Settings } from '@lucide/vue'
import { WEAPON_TYPES } from '../composables/useSettings'

const props = defineProps({
  advice: { type: Object, required: true },
})

const emit = defineEmits(['open-config'])

// 帮助提示：点击切换；用全屏遮罩层关闭，避开事件冒泡/捕获的顺序坑
const showHelp = ref(false)

const weapon = computed(() => WEAPON_TYPES.find((w) => w.key === props.advice.weaponType))
const suggested = computed(() => WEAPON_TYPES.find((w) => w.key === props.advice.suggestedWeapon))

const icon = (name) => `${import.meta.env.BASE_URL}ui-icons/${name}.png`
</script>

<template>
  <section class="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/8 to-transparent p-3.5">
    <div class="mb-3 flex items-center gap-2">
      <Sword :size="16" class="shrink-0 text-gold" />
      <h3 class="shrink-0 text-sm font-semibold text-gold">出战建议</h3>

      <!-- 右侧：当前武器类型 + 问号 -->
      <div class="ml-auto flex shrink-0 items-center gap-1">
        <span
          v-if="weapon"
          class="inline-flex items-center gap-0.5 rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-gold"
        >
          <img :src="icon(weapon.hit)" alt="" class="size-3" />
          {{ weapon.label }}
        </span>
      </div>

      <div class="relative flex shrink-0 items-center">
        <button
          type="button"
          class="relative z-30 -m-1.5 flex size-7 items-center justify-center rounded-full text-parch-dim/70 active:bg-ink-card"
          :class="showHelp ? 'text-gold' : ''"
          aria-label="出战建议说明"
          :aria-expanded="showHelp"
          @click="showHelp = !showHelp"
        >
          <HelpCircle :size="15" />
        </button>

        <button
          type="button"
          class="-mr-1 flex size-7 items-center justify-center rounded-full text-gold active:bg-ink-card"
          aria-label="打开配置"
          @click="emit('open-config')"
        >
          <Settings :size="15" />
        </button>

        <!-- 遮罩：点任意处关闭 -->
        <div
          v-if="showHelp"
          class="fixed inset-0 z-20"
          @click="showHelp = false"
        />

        <Transition
          enter-active-class="transition duration-150"
          enter-from-class="opacity-0 -translate-y-1"
          leave-active-class="transition duration-100"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="showHelp"
            class="absolute right-0 top-full z-30 mt-1.5 w-60 rounded-xl border border-ink-line bg-ink-soft p-3 text-[11px] leading-relaxed text-parch-dim shadow-xl shadow-black/60"
          >
            <p class="mb-1.5 font-medium text-parch">建议怎么读？</p>
            <p>
              这里的属性、优先与避开部位，都是按
              <span class="rounded bg-gold/15 px-1 py-0.5 font-medium text-gold">{{ weapon?.label || '当前' }}</span>
              这一列肉质算出来的。
            </p>
            <p class="mt-1.5">换武器后结论会变，建议参考下方给出的推荐武器类型再决定带什么。</p>
          </div>
        </Transition>
      </div>
    </div>

    <div v-if="advice.empty" class="rounded-lg bg-ink-card/60 px-3 py-4 text-center text-xs text-parch-dim">
      {{ advice.reason }}
    </div>

    <div v-else class="space-y-3">
      <!-- 属性推荐 -->
      <div v-if="advice.elementRank.length" class="flex gap-2.5">
        <div class="flex w-16 shrink-0 items-center gap-1.5 pt-0.5">
          <Sparkles :size="13" class="text-parch-dim" />
          <span class="text-[11px] text-parch-dim">属性</span>
        </div>
        <div class="flex flex-1 flex-wrap items-center gap-1.5">
          <span
            v-for="(e, i) in advice.elementRank"
            :key="e.key"
            class="inline-flex items-center gap-1 rounded-md border px-1.5 py-1"
            :class="i === 0 ? 'border-gold/50 bg-gold/12' : 'border-ink-line bg-ink-card'"
          >
            <img :src="icon(e.icon)" alt="" class="size-3.5" />
            <span class="text-xs font-semibold" :class="i === 0 ? 'text-gold' : 'text-parch'">
              {{ e.label }}
            </span>
            <span class="text-xs font-bold tabular-nums" :class="i === 0 ? 'text-gold' : 'text-parch-dim'">
              {{ e.value }}
            </span>
          </span>
        </div>
      </div>

      <!-- 该打 -->
      <div class="flex gap-2.5">
        <div class="flex w-16 shrink-0 items-center gap-1.5 pt-0.5">
          <Crosshair :size="13" class="text-emerald-400" />
          <span class="text-[11px] text-parch-dim">优先</span>
        </div>
        <div class="flex flex-1 flex-wrap gap-1.5">
          <template v-if="advice.good.length">
            <span
              v-for="g in advice.good"
              :key="g.part"
              class="inline-flex items-baseline gap-1 rounded-md bg-emerald-500/12 px-1.5 py-1 text-xs"
            >
              <span class="font-medium text-emerald-100">{{ g.part }}</span>
              <span class="font-bold tabular-nums text-emerald-400">{{ g.value }}</span>
            </span>
          </template>
          <span v-else class="inline-flex items-center gap-1 text-xs text-parch-dim">
            <AlertTriangle :size="12" class="text-amber-400" />
            该武器类型无有效弱点，建议换武器类型
          </span>
        </div>
      </div>

      <!-- 别打 -->
      <div class="flex gap-2.5">
        <div class="flex w-16 shrink-0 items-center gap-1.5 pt-0.5">
          <ShieldAlert :size="13" class="text-rose-400/80" />
          <span class="text-[11px] text-parch-dim">避开</span>
        </div>
        <div class="flex flex-1 flex-wrap gap-1.5">
          <template v-if="advice.bad.length">
            <span
              v-for="b in advice.bad"
              :key="b.part"
              class="inline-flex items-baseline gap-1 rounded-md bg-rose-500/10 px-1.5 py-1 text-xs"
            >
              <span class="font-medium text-rose-200/90">{{ b.part }}</span>
              <span class="font-bold tabular-nums text-rose-400/80">{{ b.value }}</span>
            </span>
          </template>
          <span v-else class="text-xs text-parch-dim/70">无低效部位，全身均可打</span>
        </div>
      </div>

      <!-- 弱点 / 可破坏 独立一行 -->
      <div v-if="advice.specialParts.length" class="flex gap-2.5 border-t border-ink-line pt-2.5">
        <div class="flex w-16 shrink-0 items-center gap-1.5 pt-0.5">
          <span class="text-[11px] text-parch-dim">标记</span>
        </div>
        <div class="flex flex-1 flex-wrap gap-1.5">
          <span
            v-for="p in advice.specialParts"
            :key="p"
            class="rounded border border-gold/25 bg-gold/8 px-1.5 py-0.5 text-[11px] text-gold/90"
          >
            {{ p }}
          </span>
        </div>
      </div>

      <!-- 底部：推荐武器 + 伤口提示 -->
      <div class="space-y-1.5 border-t border-ink-line pt-2.5 text-[11px] leading-relaxed text-parch-dim/80">
        <p v-if="suggested" class="flex flex-wrap items-center gap-x-1">
          <span class="inline-flex items-center gap-1 align-middle">
            <img :src="icon(suggested.hit)" alt="" class="size-3.5" />
            <span class="font-medium text-gold">推荐{{ suggested.label }}武器</span>
          </span>
          <span>{{ suggested.key !== weapon?.key ? `（当前选择是${weapon?.label}，该武器有效部位较少）` : '（与当前选择一致）' }}</span>
        </p>
        <p>伤口肉质更高，打破后切输出。</p>
      </div>
    </div>
  </section>
</template>
