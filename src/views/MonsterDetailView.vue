<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AlertTriangle } from '@lucide/vue'
import { useMonsters } from '../composables/useMonsters'
import { useSettings } from '../composables/useSettings'
import { buildAdvice, groupHitzones, ELEMENTS, SEVER_COLORS } from '../utils/advice'
import AdvicePanel from '../components/AdvicePanel.vue'
import HitzoneTable from '../components/HitzoneTable.vue'
import GuidePanel from '../components/GuidePanel.vue'
import RelatedMonsters from '../components/RelatedMonsters.vue'
import { getGuide } from '../data/guides'
import { getRelatedMonsters } from '../data/families'
import { Star } from '@lucide/vue'
import { useFavorites } from '../composables/useFavorites'
import { useToast } from '../composables/useToast'

const route = useRoute()
const { monsters, loading, load } = useMonsters()
const { settings } = useSettings()

const monster = ref(null)
const notFound = ref(false)
const imgError = ref(false)

async function resolve() {
  if (!monsters.value.length) await load()
  const m = monsters.value.find((x) => x.slug === route.params.slug)
  monster.value = m || null
  notFound.value = !m
  imgError.value = false
}

onMounted(resolve)
watch(() => route.params.slug, resolve)

const advice = computed(() =>
  monster.value ? buildAdvice(monster.value, settings.weaponType) : null
)

const hzGroups = computed(() =>
  monster.value?.hitzones?.length ? groupHitzones(monster.value.hitzones) : []
)

const iconSrc = computed(() => {
  if (!monster.value?.icon) return ''
  return monster.value.icon
})

const severColor = (s) => SEVER_COLORS[s] || '#8A8071'

const { isFav, toggle: toggleFav } = useFavorites()
const toast = useToast()

function onStar() {
  const added = toggleFav(monster.value.slug)
  toast.show(added ? `已收藏「${monster.value.name}」` : `已取消收藏「${monster.value.name}」`)
}

/** 详情页小节锚点：只列出当前怪物实际存在的小节 */
const guide = computed(() =>
  monster.value ? getGuide(monster.value.slug) : null
)

const related = computed(() =>
  monster.value ? getRelatedMonsters(monster.value, monsters.value) : { family: '', list: [] }
)

const sections = computed(() => {
  const m = monster.value
  if (!m) return []
  const out = []
  if (advice.value && !advice.value.empty) out.push({ id: 'sec-advice', label: '出战建议' })
  if (guide.value) out.push({ id: 'sec-guide', label: '狩猎攻略' })
  if (hzGroups.value.length) out.push({ id: 'sec-hitzone', label: '肉质部位' })
  if (m.parts?.length) out.push({ id: 'sec-durability', label: '耐久' })
  if (m.statusResist?.length) out.push({ id: 'sec-status', label: '状态抗性' })
  if (m.rewards?.length) out.push({ id: 'sec-rewards', label: '素材' })
  return out
})

function jumpTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  // 顶部栏 h-14 = 56px，留 8px 呼吸
  const top = el.getBoundingClientRect().top + window.scrollY - 64
  window.scrollTo({ top, behavior: 'smooth' })
}

const stateBadge = (s) => {
  if (s === '伤口') return 'bg-rose-500/15 text-rose-300'
  if (s === '弱点') return 'bg-emerald-500/15 text-emerald-300'
  if (s === '可破坏') return 'bg-amber-500/15 text-amber-300'
  return 'bg-ink-line text-parch-dim'
}
</script>

<template>
  <div v-if="loading && !monster" class="px-4 py-16 text-center text-sm text-parch-dim">
    加载中…
  </div>

  <div v-else-if="notFound" class="px-4 py-16 text-center">
    <AlertTriangle :size="32" class="mx-auto mb-3 text-parch-dim/40" />
    <p class="text-sm text-parch-dim">找不到这只怪物</p>
  </div>

  <div v-else-if="monster" class="px-3 pb-20 pt-3">
    <!-- 小节快速跳转 -->
    <nav
      v-if="sections.length > 1"
      class="mb-3 flex flex-wrap gap-1"
      aria-label="小节跳转"
    >
      <button
        v-for="s in sections"
        :key="s.id"
        type="button"
        class="whitespace-nowrap rounded-full border border-ink-line bg-ink-card px-2 py-1 text-[10.5px] text-parch-dim active:border-gold/50 active:text-gold"
        @click="jumpTo(s.id)"
      >
        {{ s.label }}
      </button>
    </nav>

    <!-- 头部 -->
    <div class="relative mb-3 flex gap-3 rounded-2xl border border-ink-line bg-ink-card p-3">
      <button
        type="button"
        class="absolute right-1.5 top-1.5 z-10 flex size-9 items-center justify-center rounded-full active:scale-90"
        :aria-label="isFav(monster.slug) ? '取消收藏' : '收藏'"
        :aria-pressed="isFav(monster.slug)"
        @click="onStar"
      >
        <Star
          :size="19"
          :class="isFav(monster.slug) ? 'fill-gold text-gold' : 'text-parch-dim/40'"
        />
      </button>
      <div class="size-24 shrink-0 overflow-hidden rounded-xl bg-black">
        <img
          v-if="!imgError"
          :src="iconSrc"
          :alt="monster.name"
          class="icon-blend size-full object-cover"
          @error="imgError = true"
        />
        <div v-else class="flex size-full items-center justify-center text-2xl text-parch-dim/30">
          ?
        </div>
      </div>
      <div class="min-w-0 flex-1">
        <h2 class="text-lg font-bold leading-tight text-parch">{{ monster.name }}</h2>
        <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            v-if="monster.species"
            class="rounded bg-ink-soft px-1.5 py-0.5 text-[11px] text-parch-dim"
          >
            {{ monster.species }}
          </span>
          <span
            class="rounded px-1.5 py-0.5 text-[11px] font-medium"
            :class="monster.isLarge ? 'bg-gold/15 text-gold' : 'bg-ink-soft text-parch-dim'"
          >
            {{ monster.isLarge ? '大型' : '小型' }}
          </span>
          <span
            v-if="monster.hunterRankPoint"
            class="rounded bg-ink-soft px-1.5 py-0.5 text-[11px] tabular-nums text-parch-dim"
          >
            可获HR点数{{ monster.hunterRankPoint }}
          </span>
        </div>
        <p v-if="monster.summary" class="mt-2 line-clamp-4 text-xs leading-relaxed text-parch-dim">
          {{ monster.summary }}
        </p>
      </div>
    </div>

    <!-- 基础信息 -->
    <div
      v-if="monster.info && Object.keys(monster.info).length"
      class="mb-3 grid grid-cols-3 gap-2"
    >
      <div
        v-if="monster.info.Species"
        class="rounded-xl border border-ink-line bg-ink-card px-2 py-2.5 text-center"
      >
        <div class="text-[10px] text-parch-dim">物种</div>
        <div class="mt-0.5 truncate text-sm font-bold text-parch">{{ monster.info.Species }}</div>
      </div>
      <div
        v-if="monster.info.BaseHealth"
        class="rounded-xl border border-ink-line bg-ink-card px-2 py-2.5 text-center"
      >
        <div class="text-[10px] text-parch-dim">基础体力</div>
        <div class="mt-0.5 text-sm font-bold tabular-nums text-parch">
          {{ monster.info.BaseHealth }}
        </div>
      </div>
      <div
        v-if="monster.info.HunterRankPoint"
        class="rounded-xl border border-ink-line bg-ink-card px-2 py-2.5 text-center"
      >
        <div class="text-[10px] text-parch-dim">可获HR点数</div>
        <div class="mt-0.5 text-sm font-bold tabular-nums text-parch">
          {{ monster.info.HunterRankPoint }}
        </div>
      </div>
    </div>

    <!-- 出战建议（未配置武器类型则不渲染） -->
    <div v-if="advice && !advice.empty" id="sec-advice" class="mb-4 scroll-mt-16">
      <AdvicePanel :advice="advice" />
    </div>

    <!-- 狩猎攻略（试点怪物才有） -->
    <div v-if="guide" id="sec-guide" class="mb-4 scroll-mt-16">
      <GuidePanel :text="guide" />
    </div>

    <!-- 同系怪物 -->
    <RelatedMonsters :monsters="related.list" :family="related.family" />

    <!-- 肉质 -->
    <section id="sec-hitzone" class="mb-4 scroll-mt-16">
      <h3 class="mb-2 flex items-center gap-2 px-0.5 text-sm font-semibold text-parch">
        肉质
        <span class="text-[11px] font-normal text-parch-dim">{{ hzGroups.length }} 个部位</span>
      </h3>
      <HitzoneTable v-if="hzGroups.length" :groups="hzGroups" />
      <div v-else class="rounded-xl border border-ink-line bg-ink-card px-3 py-4 text-center text-xs text-parch-dim">
        该怪物无肉质数据
      </div>
    </section>

    <!-- 部位耐久 -->
    <section v-if="monster.parts?.length" id="sec-durability" class="mb-4 scroll-mt-16">
      <h3 class="mb-2 px-0.5 text-sm font-semibold text-parch">部位耐久</h3>
      <div class="overflow-hidden rounded-xl border border-ink-line bg-ink-card">
        <div
          v-for="(p, i) in monster.parts"
          :key="i"
          class="flex items-start gap-2.5 px-3 py-2.5"
          :class="i > 0 ? 'border-t border-ink-line/60' : ''"
        >
          <span
            class="mt-1 size-2 shrink-0 rounded-full"
            :style="{ backgroundColor: severColor(p.sever) }"
            :title="p.sever"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-medium text-parch">{{ p.part }}</span>
              <span v-if="p.hp !== null && p.hp !== undefined" class="text-xs tabular-nums text-parch-dim">
                {{ p.hp }} HP
              </span>
            </div>
            <div v-if="p.woundRaw" class="mt-0.5 break-words text-[11px] leading-relaxed text-parch-dim">
              {{ p.woundRaw }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 状态抗性 -->
    <section v-if="monster.statusResist?.length" id="sec-status" class="mb-4 scroll-mt-16">
      <h3 class="mb-2 px-0.5 text-sm font-semibold text-parch">状态抗性</h3>
      <div class="space-y-2">
        <div
          v-for="(s, i) in monster.statusResist"
          :key="i"
          class="rounded-xl border border-ink-line bg-ink-card px-3 py-2.5"
        >
          <div class="mb-1.5 text-sm font-medium text-parch">{{ s.type }}</div>
          <div class="grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <div class="text-parch-dim">累积值</div>
              <div class="mt-0.5 tabular-nums text-parch">{{ s.buildUp ?? '—' }}</div>
            </div>
            <div>
              <div class="text-parch-dim">伤害</div>
              <div class="mt-0.5 tabular-nums text-parch">{{ s.damage ?? '—' }}</div>
            </div>
            <div>
              <div class="text-parch-dim">衰减</div>
              <div class="mt-0.5 tabular-nums text-parch">{{ s.decay ?? '—' }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 素材 -->
    <section v-if="monster.rewards?.length" id="sec-rewards" class="mb-4 scroll-mt-16">
      <h3 class="mb-2 px-0.5 text-sm font-semibold text-parch">素材</h3>
      <div class="overflow-hidden rounded-xl border border-ink-line bg-ink-card">
        <div
          v-for="(r, i) in monster.rewards"
          :key="i"
          class="flex items-center gap-2 px-3 py-2"
          :class="i > 0 ? 'border-t border-ink-line/60' : ''"
        >
          <span class="min-w-0 flex-1 truncate text-xs text-parch">{{ r.item }}</span>
          <span v-if="r.source" class="shrink-0 text-[11px] text-parch-dim">{{ r.source }}</span>
          <span
            v-if="r.rate"
            class="w-12 shrink-0 text-right text-[11px] font-semibold tabular-nums text-gold"
          >
            {{ r.rate }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>
