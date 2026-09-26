<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io, type Socket } from 'socket.io-client'
import type { DeliveryLocation } from './types/delivery'

const socket = ref<Socket | null>(null)

const connected = ref(false)

const lastLocation = ref<DeliveryLocation | null>(null)

onMounted(() => {
  socket.value = io('http://localhost:8765')

  socket.value.on('connect', () => {
    connected.value = true
    console.log('WebSocket conectado')
  })

  socket.value.on('disconnect', () => {
    connected.value = false
    console.log('WebSocket desconectado')
  })

  socket.value.on(
    'delivery-location',
    (event: DeliveryLocation) => {
      console.log('Ubicación recibida:', event)

      lastLocation.value = event
    },
  )
})

onUnmounted(() => {
  socket.value?.disconnect()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">

    <div class="mx-auto max-w-4xl">

      <h1 class="mb-6 text-3xl font-bold">
        Seguimiento de reparto
      </h1>

      <div
        class="mb-6 rounded-lg bg-white p-4 shadow"
      >
        <div class="flex items-center gap-3">

          <div
            class="h-3 w-3 rounded-full"
            :class="
              connected
                ? 'bg-green-500'
                : 'bg-red-500'
            "
          ></div>

          <span>
            {{
              connected
                ? 'Conectado'
                : 'Desconectado'
            }}
          </span>

        </div>
      </div>

      <div
        v-if="lastLocation"
        class="rounded-lg bg-white p-6 shadow"
      >

        <h2 class="mb-4 text-xl font-semibold">
          Ubicación actual
        </h2>

        <div class="grid gap-4 md:grid-cols-2">

          <div>
            <p class="text-sm text-gray-500">
              Repartidor
            </p>

            <p class="font-medium">
              {{ lastLocation.repartidorId }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">
              Pedido
            </p>

            <p class="font-medium">
              {{ lastLocation.pedidoId }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">
              Latitud
            </p>

            <p class="font-medium">
              {{ lastLocation.latitud }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">
              Longitud
            </p>

            <p class="font-medium">
              {{ lastLocation.longitud }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">
              Velocidad
            </p>

            <p class="font-medium">
              {{ lastLocation.velocidad }} km/h
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">
              Estado
            </p>

            <p class="font-medium">
              {{ lastLocation.estado }}
            </p>
          </div>

        </div>

      </div>

      <div
        v-else
        class="rounded-lg bg-white p-6 text-gray-500 shadow"
      >
        Esperando ubicación del repartidor...
      </div>

    </div>

  </div>
</template>