<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BookOpen, Package, Swords, Shield, Sparkles, ScrollText, Gem } from '@lucide/vue'
import { useSettings } from '../composables/useSettings'

const router = useRouter()
const { setGame } = useSettings()

onMounted(() => setGame('mh3g'))

const features = [
  {
    id: 'monsters',
    title: '怪物图鉴',
    desc: '51 种大型怪物肉质、硬直、素材掉落',
    icon: BookOpen,
    to: '/mh3g/monsters',
    ready: true,
  },
  {
    id: 'weapons',
    title: '武器',
    desc: '12 种武器 1399 把，含派生路线',
    icon: Swords,
    to: '/mh3g/weapons',
    ready: true,
  },
  {
    id: 'armor',
    title: '防具',
    desc: '剑士/射手/共通套装 336 套',
    icon: Shield,
    to: '/mh3g/armor',
    ready: true,
  },
  {
    id: 'skills',
    title: '技能',
    desc: '技能 238 / 装饰珠 194 / 护石 120',
    icon: Sparkles,
    to: '/mh3g/skills',
    ready: true,
  },
  {
    id: 'recommend',
    title: '推荐装备',
    desc: '各等级推荐武器 / 防具 127 条',
    icon: Sparkles,
    to: '/mh3g/recommend',
    ready: true,
  },
  {
    id: 'quests',
    title: '任务',
    desc: '村/港任务 1354 条，含关键任务',
    icon: ScrollText,
    to: '/mh3g/quests',
    ready: false,
  },
  {
    id: 'items',
    title: '道具',
    desc: '道具、素材、调和表 1275 条',
    icon: Gem,
    to: '/mh3g/items',
    ready: false,
  },
  {
    id: 'drops',
    title: '掉落查询',
    desc: '输入素材名，反查哪些怪物掉落',
    icon: Package,
    to: '/mh3g/drops',
    ready: false,
  },
]
</script>

<template>
  <div class="px-4 pt-8">
    <div class="mb-7">
      <div class="mb-2 text-xs font-medium tracking-[0.2em] text-gold">MONSTER HUNTER 3G</div>
      <h2 class="text-2xl font-bold text-parch">怪物猎人 3G</h2>
      <p class="mt-2 text-sm text-parch-dim">选择需要的功能</p>
    </div>

    <div class="space-y-3">
      <button
        v-for="f in features"
        :key="f.id"
        type="button"
        class="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors"
        :class="
          f.ready
            ? 'border-ink-line bg-ink-card active:border-gold/50'
            : 'border-dashed border-ink-line/70 bg-ink-soft/40'
        "
        :disabled="!f.ready"
        @click="f.ready && router.push(f.to)"
      >
        <div
          class="flex size-11 shrink-0 items-center justify-center rounded-xl"
          :class="f.ready ? 'bg-gold/12 text-gold' : 'border border-ink-line text-parch-dim/40'"
        >
          <component :is="f.icon" :size="21" />
        </div>
        <div class="min-w-0 flex-1">
          <div
            class="text-base font-semibold"
            :class="f.ready ? 'text-parch' : 'text-parch-dim/60'"
          >
            {{ f.title }}
          </div>
          <div class="mt-0.5 truncate text-xs" :class="f.ready ? 'text-parch-dim' : 'text-parch-dim/50'">
            {{ f.desc }}
          </div>
        </div>
        <span
          v-if="!f.ready"
          class="shrink-0 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-parch-dim"
        >
          敬请期待
        </span>
      </button>
    </div>
  </div>
</template>
