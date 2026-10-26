<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  monsters: { type: Array, required: true },
})

const router = useRouter()

const visible = computed(() => props.monsters.filter((m) => m))

function go(m) {
  router.push(`/wilds/monsters/${m.slug}`)
}
</script>

<template>
  <section v-if="visible.length" class="mb-4">
    <h3 class="mb-2 flex items-center gap-2 px-0.5 text-sm font-semibold text-parch">
      同系怪物
      <span class="text-[11px] font-normal text-parch-dim">{{ visible.length }}</span>
    </h3>

    <div class="-mx-3 overflow-x-auto px-3 no-scrollbar">
      <div class="flex gap-2.5">
        <button
          v-for="m in visible"
          :key="m.slug"
          type="button"
          class="flex w-[76px] shrink-0 flex-col items-center gap-1.5 rounded-xl border border-ink-line bg-ink-card p-1.5 active:border-gold/50"
          @click="go(m)"
        >
          <div class="size-14 overflow-hidden rounded-lg bg-black">
            <img
              :src="m.icon"
              :alt="m.name"
              loading="lazy"
              class="icon-blend size-full object-cover"
              @error="(e) => (e.target.style.visibility = 'hidden')"
            />
          </div>
          <span class="w-full truncate text-center text-[11px] leading-tight text-parch-dim">
            {{ m.name }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
