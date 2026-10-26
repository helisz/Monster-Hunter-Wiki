<script setup>
import { useToast } from '../composables/useToast'

const { message, visible } = useToast()
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0 translate-y-3"
    leave-active-class="transition duration-150"
    leave-to-class="opacity-0 translate-y-3"
  >
    <div
      v-if="visible"
      class="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6"
      role="status"
      aria-live="polite"
    >
      <div
        class="rounded-full border border-gold/40 bg-ink-card/95 px-4 py-2 text-xs font-medium text-parch shadow-lg shadow-black/70 backdrop-blur"
      >
        {{ message }}
      </div>
    </div>
  </Transition>
</template>
