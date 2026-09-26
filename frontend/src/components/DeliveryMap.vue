<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { io, type Socket } from 'socket.io-client'

import type { DeliveryLocation } from '../types/delivery'

const mapContainer = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let marker: L.Marker | null = null
let socket: Socket | null = null

const connected = ref(false)

const lastLocation = ref<DeliveryLocation | null>(null)

onMounted(() => {
  if (!mapContainer.value) {
    return
  }

  map = L.map(mapContainer.value).setView(
    [-34.6037, -58.3816],
    15,
  )

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        '&copy; OpenStreetMap contributors',
    },
  ).addTo(map)

  socket = io('http://localhost:8765')

  socket.on('connect', () => {
    connected.value = true
  })

  socket.on('disconnect', () => {
    connected.value = false
  })

  socket.on(
    'delivery-location',
    (event: DeliveryLocation) => {
      updateMarker(event)
    },
  )
})

function updateMarker(
  location: DeliveryLocation,
): void {
  lastLocation.value = location

  const position: L.LatLngExpression = [
    location.latitud,
    location.longitud,
  ]

  if (!map) {
    return
  }

  if (!marker) {
    marker = L.marker(position).addTo(map)

    marker.bindPopup(
      `
        <strong>Repartidor ${location.repartidorId}</strong>
        <br>
        Pedido: ${location.pedidoId}
        <br>
        Estado: ${location.estado}
        <br>
        Velocidad: ${location.velocidad} km/h
      `,
    )
  } else {
    marker.setLatLng(position)

    marker.setPopupContent(
      `
        <strong>Repartidor ${location.repartidorId}</strong>
        <br>
        Pedido: ${location.pedidoId}
        <br>
        Estado: ${location.estado}
        <br>
        Velocidad: ${location.velocidad} km/h
      `,
    )
  }

  map.setView(position)
}

onUnmounted(() => {
  socket?.disconnect()

  if (map) {
    map.remove()
  }
})
</script>

<template>
  <div class="overflow-hidden rounded-lg shadow">
    <div
      ref="mapContainer"
      class="h-[500px] w-full"
    ></div>
  </div>
</template>