<script setup lang="ts">
import ConnectionStatus from './ConnectionStatus.vue'

defineProps<{
  connected: boolean
  pedidoId?: number
}>()
</script>

<template>
  <header
    class="border-b border-slate-200 bg-white"
  >
    <div
      class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
    >

      <div class="flex items-center gap-3">

        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xl text-white shadow-sm"
        >
          🚚
        </div>

        <div>
          <h1
            class="text-lg font-bold tracking-tight text-slate-900"
          >
            DeliveryTrack
          </h1>

          <p class="text-xs text-slate-500">
            Seguimiento en tiempo real
          </p>
        </div>

      </div>

      <div class="flex items-center gap-3">

        <div
          v-if="pedidoId"
          class="hidden rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:block"
        >
          Pedido
          <span class="font-semibold text-slate-900">
            #{{ pedidoId }}
          </span>
        </div>

        <ConnectionStatus
          :connected="connected"
        />

      </div>

    </div>
  </header>
</template>