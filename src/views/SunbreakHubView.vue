<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BookOpen, Package, ChevronRight } from '@lucide/vue'
import { useSettings } from '../composables/useSettings'

const router = useRouter()
const { setGame } = useSettings()

onMounted(() => setGame('sunbreak'))

const features = [
  {
    id: 'monsters',
    title: '怪物图鉴',
    desc: '112 种怪物肉质、部位耐久、素材掉落',
    icon: BookOpen,
    to: '/sunbreak/monsters',
  },
  {
    id: 'drops',
    title: '掉落查询',
    desc: '输入素材名，反查哪些怪物掉落',
    icon: Package,
    to: '/sunbreak/drops',
  },
]
const placeholder = [
  { title: '武器树', desc: '强化路线与必需素材' },
  { title: '装备技能', desc: '套装效果与配装' },
]
</script>

<template>
  <div class="px-4 pt-8">
    <div class="mb-7">
      <div class="mb-2 text-xs font-medium tracking-[0.2em] text-gold">
        MONSTER HUNTER RISE: SUNBREAK
      </div>
      <h2 class="text-2xl font-bold text-parch">崛起 曙光</h2>
      <p class="mt-2 text-sm text-parch-dim">选择需要的功能</p>
    </div>

    <div class="space-y-3">
      <button
        v-for="f in features"
        :key="f.id"
        type="button"
        class="flex w-full items-center gap-4 rounded-2xl border border-ink-line bg-ink-card p-4 text-left active:border-gold/50"
        @click="router.push(f.to)"
      >
        <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold">
          <component :is="f.icon" :size="21" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-base font-semibold text-parch">{{ f.title }}</div>
          <div class="mt-0.5 truncate text-xs text-parch-dim">{{ f.desc }}</div>
        </div>
        <ChevronRight :size="20" class="shrink-0 text-parch-dim" />
      </button>

      <div
        v-for="p in placeholder"
        :key="p.title"
        class="flex w-full items-center gap-4 rounded-2xl border border-dashed border-ink-line/70 bg-ink-soft/40 p-4"
      >
        <div class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-ink-line">
          <span class="text-parch-dim/40">?</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-base font-semibold text-parch-dim/60">{{ p.title }}</div>
          <div class="mt-0.5 truncate text-xs text-parch-dim/50">{{ p.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
