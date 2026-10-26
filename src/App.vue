<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Settings } from '@lucide/vue'
import { useSettings, WEAPON_TYPES } from './composables/useSettings'

const route = useRoute()
const router = useRouter()
const { settings, setWeaponType } = useSettings()

const showConfig = ref(false)

const pageTitle = computed(() => route.meta?.title || '')
const canGoBack = computed(() => route.name && route.name !== 'games')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
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

      <!-- 当前武器类型指示 -->
      <div
        v-if="settings.weaponType"
        class="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-1"
      >
        <img
          :src="weaponIcon(WEAPON_TYPES.find((w) => w.key === settings.weaponType)?.hit)"
          alt=""
          class="size-4 opacity-90"
        />
        <span class="text-xs font-medium text-gold">
          {{ WEAPON_TYPES.find((w) => w.key === settings.weaponType)?.label }}
        </span>
      </div>
    </header>

    <main class="flex-1 pb-24">
      <router-view />
    </main>

    <!-- 右下角配置按钮 -->
    <button
      type="button"
      class="fixed bottom-5 right-4 z-40 flex size-14 items-center justify-center rounded-full border border-gold/40 bg-ink-card text-gold shadow-lg shadow-black/60 active:scale-95 transition-transform"
      aria-label="配置"
      @click="showConfig = true"
    >
      <Settings :size="22" />
    </button>

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
          <p class="mb-5 text-xs text-parch-dim">选择你使用的武器类型，怪物详情会给出对应打击建议</p>

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
            再次点击同一武器类型可取消选择。未选择时，详情页不显示打击建议。
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
