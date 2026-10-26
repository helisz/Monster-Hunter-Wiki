<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Settings, ArrowUp } from '@lucide/vue'
import { useSettings, WEAPON_TYPES } from './composables/useSettings'
import AppToast from './components/AppToast.vue'

const route = useRoute()
const router = useRouter()
const { settings, setWeaponType } = useSettings()

const showConfig = ref(false)

const pageTitle = computed(() => route.meta?.title || '')
const canGoBack = computed(() => route.name && route.name !== 'games')
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')

/** 应用内可回退判定：history.state.back 必须是本站路径 */
function hasInAppBack() {
  const back = window.history.state?.back
  if (typeof back !== 'string') return false
  // 站外（含空白页 / 其他站点）一律不算
  if (!back.startsWith(BASE_PATH || '/')) return false
  return true
}

/** 无站内历史时的兜底目标：按路由层级上退一级 */
function fallbackTarget() {
  const name = route.name
  if (name === 'monster-detail') return '/wilds/monsters'
  if (name === 'monsters') return '/wilds'
  if (name === 'hub') return '/'
  return '/'
}

function goBack() {
  if (hasInAppBack()) router.back()
  else router.push(fallbackTarget())
}

// 回到顶部按钮：滚动超过 300px 才显示
const showBackToTop = ref(false)
const onScroll = () => {
  showBackToTop.value = window.scrollY > 300
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('mhw:open-config', openConfigDrawer)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mhw:open-config', openConfigDrawer)
})

function openConfigDrawer() {
  showConfig.value = true
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function chooseWeapon(key) {
  setWeaponType(settings.weaponType === key ? null : key)
}

const weaponIcon = (hit) => `${import.meta.env.BASE_URL}ui-icons/${hit}.png`
const BASE = import.meta.env.BASE_URL
</script>

<template>
  <div class="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col">
    <!-- 顶部栏 -->
    <header
      class="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-ink-line bg-ink/95 px-3 backdrop-blur"
    >
      <button
        v-if="canGoBack"
        type="button"
        class="flex size-11 shrink-0 items-center justify-center rounded-lg text-parch-dim active:bg-ink-card"
        aria-label="返回"
        @click="goBack"
      >
        <ChevronLeft :size="22" />
      </button>
      <div v-else class="flex size-11 shrink-0 items-center justify-center">
        <img
          :src="`${BASE}favicon-128.png`"
          alt="怪物猎人 Wiki"
          class="size-8 rounded-md object-contain"
        />
      </div>

      <h1 class="min-w-0 flex-1 truncate text-[17px] font-semibold tracking-wide text-parch">
        {{ pageTitle }}
      </h1>

      <!-- 详情页显示配置齿轮 -->
      <button
        v-if="route.name === 'monster-detail'"
        type="button"
        class="-mr-1 flex size-10 shrink-0 items-center justify-center rounded-lg text-gold active:bg-ink-card"
        aria-label="打开配置"
        @click="showConfig = true"
      >
        <Settings :size="20" />
      </button>
    </header>

    <main class="flex-1 pb-24">
      <router-view />
    </main>

    <!-- 右下角：回到顶部 -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 translate-y-2 scale-90"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0 translate-y-2 scale-90"
    >
      <button
        v-if="showBackToTop"
        type="button"
        class="fixed bottom-5 right-4 z-40 flex size-11 items-center justify-center rounded-full border border-gold/60 bg-ink-card/95 text-gold shadow-lg shadow-black/60 backdrop-blur active:scale-95"
        aria-label="回到顶部"
        @click="backToTop"
      >
        <ArrowUp :size="19" />
      </button>
    </Transition>

    <!-- 配置抽屉 -->
    <Transition name="fade">
      <div
        v-if="showConfig"
        class="fixed inset-0 z-50 flex items-end bg-black/70"
        @click.self="showConfig = false"
      >
        <div
          class="w-full rounded-t-2xl border-t border-ink-line bg-ink-soft px-4 pb-8 pt-3"
          style="max-height: 80dvh"
        >
          <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-ink-line" />
          <h2 class="mb-1 text-lg font-semibold text-parch">配置</h2>
          <p class="mb-5 text-xs text-parch-dim">选择你使用的武器类型，怪物详情会给出对应出战建议</p>

          <div class="mb-2 text-xs font-medium tracking-wider text-parch-dim">武器类型</div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="w in WEAPON_TYPES"
              :key="w.key"
              type="button"
              class="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border transition-colors"
              :class="
                settings.weaponType === w.key
                  ? 'border-gold bg-gold/15 text-gold'
                  : 'border-ink-line bg-ink-card text-parch-dim'
              "
              @click="chooseWeapon(w.key)"
            >
              <img :src="weaponIcon(w.hit)" alt="" class="size-6 opacity-90" />
              <span class="text-sm font-medium">{{ w.label }}</span>
            </button>
          </div>

          <p class="mt-4 text-[11px] leading-relaxed text-parch-dim/80">
            再次点击同一武器类型可取消选择。未选择时，详情页不显示出战建议。
          </p>

          <button
            type="button"
            class="mt-6 h-11 w-full rounded-xl border border-ink-line bg-ink-card text-sm font-medium text-parch"
            @click="showConfig = false"
          >
            完成
          </button>
        </div>
      </div>
    </Transition>
    <AppToast />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
