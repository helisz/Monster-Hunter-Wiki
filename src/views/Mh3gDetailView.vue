<script setup>
import { computed, onMounted, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, ChevronLeft } from '@lucide/vue'
import { useMh3gMonsters } from '../composables/useMh3gMonsters'
import { useFavorites } from '../composables/useFavorites'
import { useToast } from '../composables/useToast'
import { buildMh3gAdvice } from '../utils/mh3gAdvice'
import { useSettings } from '../composables/useSettings'
import Mh3gAdvicePanel from '../components/Mh3gAdvicePanel.vue'
import Mh3gHitzoneTable from '../components/Mh3gHitzoneTable.vue'
import Mh3gRewards from '../components/Mh3gRewards.vue'

const route = useRoute()
const router = useRouter()
const { monsters, load, bySlug } = useMh3gMonsters()
const { isFav, toggle } = useFavorites('mh3g')
const toast = useToast()

const loading = ref(true)
const imgError = ref(false)
const BASE = import.meta.env.BASE_URL

onMounted(async () => {
  await load()
  loading.value = false
  scrollToHash()
})

/** 从掉落查询进来时定位的素材名 */
const focusItem = computed(() =>
  route.hash === '#rewards' ? new URLSearchParams(route.query).get('item') : null
)

/** 定位到高亮的素材行 */
function findFocusEl() {
  const item = focusItem.value
  if (!item) return null
  const rows = [...document.querySelectorAll('#sec-rewards [data-item]')].filter(
    (el) => el.dataset.item === item
  )
  return rows.find((el) => el.className.includes('bg-gold')) || rows[0] || null
}

/** 数据就绪后滚动到素材区（图片懒加载会持续改变高度，轮询校正） */
function scrollToHash() {
  if (route.hash !== '#rewards') return
  let stable = 0
  let lastTop = -1
  let ticks = 0

  const seek = () => {
    const target = findFocusEl() || document.getElementById('sec-rewards')
    if (!target) {
      if (ticks++ < 60) setTimeout(seek, 100)
      return
    }
    const want = Math.round(target.getBoundingClientRect().top + window.scrollY - 72)
    if (Math.abs(want - lastTop) < 3) stable++
    else stable = 0
    lastTop = want
    document.documentElement.scrollTop = Math.max(0, want)
    document.body.scrollTop = Math.max(0, want)
    if (stable < 3 && ticks++ < 25) setTimeout(seek, 100)
  }

  setTimeout(seek, 0)
}

const monster = computed(() => bySlug(route.params.slug))

/** 武器类型走全局 settings（与配置抽屉联动） */
const { settings } = useSettings()
const weaponType = computed(() => settings.weaponType)

function onStar() {
  if (!monster.value) return
  const added = toggle(monster.value.slug)
  toast.show(
    added ? `已收藏「${monster.value.name}」` : `取消收藏「${monster.value.name}」`
  )
}

const advice = computed(() => {
  if (!monster.value) return null
  return buildMh3gAdvice(monster.value, weaponType.value)
})

/** 3G 部位硬直：从常态肉质行里取 flinch 值 */
const partRows = computed(() => {
  const m = monster.value
  if (!m?.hitzones) return []
  const seen = new Set()
  const out = []
  for (const h of m.hitzones) {
    const normal = h.state === null || h.state === undefined || h.state === '通常时'
    if (!normal || !h.part || seen.has(h.part)) continue
    if (typeof h.flinch !== 'number') continue
    seen.add(h.part)
    out.push({ part: h.part, hp: h.flinch })
  }
  return out
})

/** 按部位分组的肉质 */
const hitzonesByPart = computed(() => {
  const m = monster.value
  if (!m?.hitzones) return []
  return m.hitzones
})

const sections = computed(() => {
  const s = []
  if (advice.value && !advice.value.empty) s.push({ id: 'sec-advice', label: '出战建议' })
  if (monster.value?.hitzones?.length) s.push({ id: 'sec-hitzone', label: '肉质' })
  if (partRows.value.length) s.push({ id: 'sec-durability', label: '部位硬直' })
  if (monster.value?.statusResist?.length) s.push({ id: 'sec-status', label: '状态抗性' })
  if (monster.value?.itemEffect?.length) s.push({ id: 'sec-trap', label: '陷阱效果' })
  if (monster.value?.rewards?.length) s.push({ id: 'sec-rewards', label: '素材' })
  return s
})

function jumpTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 64
  window.scrollTo({ top, behavior: 'smooth' })
}
</script>

<template>
  <div class="px-3 pb-20 pt-3">
    <div v-if="loading" class="py-20 text-center text-sm text-parch-dim">加载中…</div>

    <div v-else-if="!monster" class="py-20 text-center">
      <p class="text-sm text-parch-dim">找不到该怪物</p>
      <button
        type="button"
        class="mt-4 rounded-lg border border-ink-line px-4 py-2 text-xs text-parch-dim"
        @click="router.push('/mh3g/monsters')"
      >
        返回图鉴
      </button>
    </div>

    <template v-else>
      <!-- 小节跳转 -->
      <nav
        v-if="sections.length"
        class="no-scrollbar -mx-3 mb-3 flex gap-1 overflow-x-auto px-3"
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

      <!-- 头部卡片 -->
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

        <div class="size-24 shrink-0 overflow-hidden rounded-xl bg-ink-soft/60 p-1.5">
          <img
            v-if="!imgError"
            :src="BASE + monster.icon"
            :alt="monster.name"
            class="size-full object-contain"
            @error="imgError = true"
          />
        </div>

        <div class="min-w-0 flex-1 pr-6">
          <h2 class="text-lg font-bold leading-tight text-parch">{{ monster.name }}</h2>
          <div v-if="monster.nameJp || monster.nameEn" class="mt-0.5 space-y-0.5">
            <div v-if="monster.nameJp" class="truncate text-[11px] text-parch-dim">
              {{ monster.nameJp }}
            </div>
            <div v-if="monster.nameEn" class="truncate text-[10px] text-parch-dim/70">
              {{ monster.nameEn }}
            </div>
          </div>
          <div class="mt-1.5 flex flex-wrap gap-1">
            <span
              v-if="monster.isLarge"
              class="rounded bg-gold/12 px-1.5 py-0.5 text-[10px] font-medium text-gold"
            >
              大型
            </span>
            <span
              v-if="monster.species"
              class="rounded bg-ink-soft px-1.5 py-0.5 text-[10px] text-parch-dim"
            >
              {{ monster.species }}
            </span>
            <span
              v-for="r in monster.ranks || []"
              :key="r"
              class="rounded bg-ink-soft px-1.5 py-0.5 text-[10px] text-parch-dim"
            >
              {{ r }}
            </span>
          </div>
        </div>
      </div>

      <!-- 出战建议 -->
      <div v-if="advice && !advice.empty" id="sec-advice" class="mb-3 scroll-mt-16">
        <Mh3gAdvicePanel :advice="advice" />
      </div>
      <div
        v-else-if="advice && advice.empty"
        class="mb-3 rounded-xl border border-ink-line bg-ink-card p-3 text-[12px] text-parch-dim"
      >
        未选择武器类型。点右上角齿轮选择后可查看针对性建议。
      </div>

      <!-- 肉质 -->
      <section v-if="hitzonesByPart.length" id="sec-hitzone" class="mb-4 scroll-mt-16">
        <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-parch">
          肉质
          <span class="text-[11px] font-normal text-parch-dim">
            {{ hitzonesByPart.length }} 行
          </span>
        </h3>
        <Mh3gHitzoneTable :hitzones="hitzonesByPart" />
      </section>

      <!-- 部位硬直 -->
      <section v-if="partRows.length" id="sec-durability" class="mb-4 scroll-mt-16">
        <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-parch">
          部位硬直
          <span class="text-[11px] font-normal text-parch-dim">{{ partRows.length }}</span>
        </h3>
        <div class="overflow-x-auto rounded-lg border border-ink-line">
          <table class="w-full border-collapse text-[11px] tabular-nums">
            <thead>
              <tr class="bg-ink-soft">
                <th class="px-2 py-1.5 text-left font-medium text-parch-dim">部位</th>
                <th class="px-2 py-1.5 text-right font-medium text-parch-dim">硬直值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in partRows" :key="i" class="border-t border-ink-line/60">
                <td class="px-2 py-1.5 text-parch">{{ p.part }}</td>
                <td class="px-2 py-1.5 text-right tabular-nums text-parch">{{ p.hp ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 状态抗性 -->
      <section v-if="monster.statusResist?.length" id="sec-status" class="mb-4 scroll-mt-16">
        <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-parch">
          状态抗性
          <span class="text-[11px] font-normal text-parch-dim">
            {{ monster.statusResist.length }}
          </span>
        </h3>
        <div class="overflow-x-auto rounded-lg border border-ink-line">
          <table class="w-full border-collapse text-[11px] tabular-nums">
            <thead>
              <tr class="bg-ink-soft">
                <th class="px-2 py-1.5 text-left font-medium text-parch-dim">异常</th>
                <th class="px-2 py-1.5 text-left font-medium text-parch-dim">积累</th>
                <th class="px-2 py-1.5 text-left font-medium text-parch-dim">衰减</th>
                <th class="px-2 py-1.5 text-right font-medium text-parch-dim">伤害</th>
                <th class="px-2 py-1.5 text-right font-medium text-parch-dim">持续</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(s, i) in monster.statusResist"
                :key="i"
                class="border-t border-ink-line/60"
              >
                <td class="px-2 py-1.5 text-parch">{{ s.type }}</td>
                <td class="px-2 py-1.5 text-parch-dim">{{ s.buildUp || '—' }}</td>
                <td class="px-2 py-1.5 text-parch-dim">{{ s.decay || '—' }}</td>
                <td class="px-2 py-1.5 text-right text-parch-dim">{{ s.damage || '—' }}</td>
                <td class="px-2 py-1.5 text-right text-parch-dim">{{ s.duration || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 陷阱 / 道具效果 -->
      <section v-if="monster.itemEffect?.length" id="sec-trap" class="mb-4 scroll-mt-16">
        <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-parch">
          陷阱效果
          <span class="text-[11px] font-normal text-parch-dim">{{ monster.itemEffect.length }}</span>
        </h3>
        <div class="space-y-1.5">
          <div
            v-for="(t, i) in monster.itemEffect"
            :key="i"
            class="rounded-lg border border-ink-line bg-ink-card px-3 py-2"
          >
            <div class="flex items-center gap-2">
              <span class="text-[12px] font-medium text-parch">{{ t.item }}</span>
              <span
                class="rounded px-1.5 py-0.5 text-[10px] font-medium"
                :class="
                  t.effect === '○'
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : t.effect === '△'
                      ? 'bg-amber-500/15 text-amber-300'
                      : t.effect === '×'
                        ? 'bg-red-500/15 text-red-300'
                        : 'bg-ink-soft text-parch-dim'
                "
              >{{ t.effect }}</span>
            </div>
            <p v-if="t.note" class="mt-1 text-[11px] leading-relaxed text-parch-dim">
              {{ t.note }}
            </p>
          </div>
        </div>
      </section>

      <!-- 素材 -->
      <section v-if="monster.rewards?.length" id="sec-rewards" class="mb-4 scroll-mt-16">
        <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-parch">
          素材
          <span class="text-[11px] font-normal text-parch-dim">{{ monster.rewards.length }}</span>
        </h3>
        <Mh3gRewards :rewards="monster.rewards" :focus-item="focusItem" />
      </section>
    </template>
  </div>
</template>
