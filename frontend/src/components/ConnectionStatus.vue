<script setup lang="ts">
defineProps<{
  connected: boolean
}>()
</script>

<template>
  <div
    class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium"
    :class="
      connected
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-red-200 bg-red-50 text-red-700'
    "
  >
    <span class="relative flex h-2.5 w-2.5">
      <span
        v-if="connected"
        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
      ></span>

      <span
        class="relative inline-flex h-2.5 w-2.5 rounded-full"
        :class="
          connected
            ? 'bg-emerald-500'
            : 'bg-red-500'
        "
      ></span>
    </span>

    {{ connected ? 'Conectado' : 'Desconectado' }}
  </div>
</template>