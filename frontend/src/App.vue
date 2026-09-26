<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io, type Socket } from 'socket.io-client'

import DeliveryHeader from './components/DeliveryHeader.vue'
import DeliveryMap from './components/DeliveryMap.vue'
import DeliveryInfo from './components/DeliveryInfo.vue'

import type { DeliveryLocation } from './types/delivery'

const socket = ref<Socket | null>(null)
const connected = ref(false)
const lastLocation = ref<DeliveryLocation | null>(null)

onMounted(() => {
  socket.value = io(
    'http://localhost:8765',
  )

  socket.value.on('connect', () => {
    connected.value = true
  })

  socket.value.on('disconnect', () => {
    connected.value = false
  })

  socket.value.on(
    'delivery-location',
    (event: DeliveryLocation) => {
      lastLocation.value = event
    },
  )
})

onUnmounted(() => {
  socket.value?.disconnect()
})
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-slate-50 text-slate-900"
  >
    <DeliveryHeader
      :connected="connected"
      :pedido-id="lastLocation?.pedidoId"
    />

    <main
      class="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8"
    >
      <div class="mb-6">
        <h2
          class="text-2xl font-bold tracking-tight text-slate-900"
        >
          Seguimiento del pedido
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Visualizá la ubicación del repartidor
          en tiempo real.
        </p>
      </div>

      <div
        class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <section>
          <DeliveryMap />
        </section>

        <DeliveryInfo
          :location="lastLocation"
        />
      </div>
    </main>

    <footer
      class="border-t border-slate-200 bg-white"
    >
      <div
        class="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8"
      >
        DeliveryTrack · Seguimiento en tiempo real
      </div>
    </footer>
  </div>
</template>