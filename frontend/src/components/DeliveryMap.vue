<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io, type Socket } from 'socket.io-client'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import type { DeliveryLocation } from '../types/delivery'

const mapContainer = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let marker: L.Marker | null = null
let socket: Socket | null = null

const initialPosition: L.LatLngExpression = [
  -34.6037,
  -58.3816,
]

const deliveryIcon = L.divIcon({
  className: 'delivery-marker',
  html: `
    <div class="delivery-marker-wrapper">
      <div class="delivery-marker-pulse"></div>

      <div class="delivery-marker-icon">
        <span>🚚</span>
      </div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
})

onMounted(() => {
  if (!mapContainer.value) {
    return
  }

  map = L.map(mapContainer.value).setView(
    initialPosition,
    16,
  )

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        '&copy; OpenStreetMap contributors',
    },
  ).addTo(map)

  socket = io('http://localhost:8765')

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
  if (!map) {
    return
  }

  const newPosition = L.latLng(
    location.latitud,
    location.longitud,
  )

  if (!marker) {
    marker = L.marker(
      newPosition,
      {
        icon: deliveryIcon,
      },
    ).addTo(map)

    marker.bindPopup(
      createPopupContent(location),
      {
        className: 'delivery-popup-container',
        maxWidth: 280,
        minWidth: 250,
        closeButton: true,
        autoPan: true,
      },
    )

    map.setView(newPosition)

    return
  }

  /*
   * Actualización instantánea.
   *
   * El marcador pasa directamente
   * de una posición a la siguiente
   * sin animación de desplazamiento.
   */
  marker.setLatLng(newPosition)

  marker.setPopupContent(
    createPopupContent(location),
  )
}

function createPopupContent(
  location: DeliveryLocation,
): string {
  return `
    <div class="delivery-popup">

      <div class="delivery-popup-header">

        <div class="delivery-popup-icon">
          🚚
        </div>

        <div class="delivery-popup-title">
          <div class="delivery-popup-label">
            REPARTIDOR
          </div>

          <div class="delivery-popup-name">
            Repartidor ${location.repartidorId}
          </div>
        </div>

        <div class="delivery-popup-status">
          <span class="delivery-popup-status-dot"></span>
          En reparto
        </div>

      </div>

      <div class="delivery-popup-divider"></div>

      <div class="delivery-popup-order">

        <div>
          <div class="delivery-popup-label">
            PEDIDO
          </div>

          <div class="delivery-popup-order-number">
            #${location.pedidoId}
          </div>
        </div>

        <div class="delivery-popup-speed">
          <div class="delivery-popup-label">
            VELOCIDAD
          </div>

          <div class="delivery-popup-speed-value">
            ${location.velocidad}
            <span>km/h</span>
          </div>
        </div>

      </div>

      <div class="delivery-popup-location">

        <div class="delivery-popup-location-icon">
          <span>⌖</span>
        </div>

        <div>
          <div class="delivery-popup-label">
            UBICACIÓN ACTUAL
          </div>

          <div class="delivery-popup-coordinates">
            ${location.latitud.toFixed(5)},
            ${location.longitud.toFixed(5)}
          </div>
        </div>

      </div>

      <div class="delivery-popup-footer">
        <span class="delivery-popup-live-dot"></span>
        Ubicación actualizada en tiempo real
      </div>

    </div>
  `
}

onUnmounted(() => {
  socket?.disconnect()

  map?.remove()
})
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
  >
    <div
      ref="mapContainer"
      class="h-[560px] w-full"
    ></div>
  </div>
</template>

<style>
.delivery-marker {
  background: transparent;
  border: none;
}

.delivery-marker-wrapper {
  position: relative;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.delivery-marker-pulse {
  position: absolute;

  width: 42px;
  height: 42px;

  border-radius: 9999px;

  background: rgba(15, 23, 42, 0.15);

  animation: delivery-pulse 2s infinite;
}

.delivery-marker-icon {
  position: relative;
  z-index: 2;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9999px;

  background: white;

  border: 3px solid #0f172a;

  font-size: 20px;

  box-shadow:
    0 4px 12px rgba(15, 23, 42, 0.25);
}

@keyframes delivery-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }

  70% {
    transform: scale(1.35);
    opacity: 0;
  }

  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

/* =========================
   POPUP
========================= */

.delivery-popup-container
  .leaflet-popup-content-wrapper {
  padding: 0;

  border-radius: 16px;

  overflow: hidden;

  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.18);
}

.delivery-popup-container
  .leaflet-popup-content {
  margin: 0;

  width: auto !important;
}

.delivery-popup-container
  .leaflet-popup-tip {
  box-shadow: none;
}

.delivery-popup-container
  .leaflet-popup-close-button {
  z-index: 10;

  top: 10px !important;
  right: 10px !important;

  width: 28px !important;
  height: 28px !important;

  display: flex !important;
  align-items: center;
  justify-content: center;

  border-radius: 9999px;

  background: rgba(255, 255, 255, 0.9);

  color: #64748b !important;

  font-size: 18px !important;
  font-weight: 400;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.delivery-popup-container
  .leaflet-popup-close-button:hover {
  background: #f1f5f9;

  color: #0f172a !important;
}

.delivery-popup {
  width: 260px;

  background: white;

  color: #0f172a;

  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.delivery-popup-header {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 16px 16px 14px;
}

.delivery-popup-icon {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #f1f5f9;

  font-size: 20px;
}

.delivery-popup-title {
  min-width: 0;

  flex: 1;
}

.delivery-popup-label {
  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.08em;

  color: #94a3b8;
}

.delivery-popup-name {
  margin-top: 2px;

  font-size: 14px;
  font-weight: 700;

  color: #0f172a;
}

.delivery-popup-status {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  padding: 5px 8px;

  border-radius: 9999px;

  background: #ecfdf5;

  color: #047857;

  font-size: 9px;
  font-weight: 700;

  white-space: nowrap;
}

.delivery-popup-status-dot {
  width: 6px;
  height: 6px;

  border-radius: 9999px;

  background: #10b981;
}

.delivery-popup-divider {
  height: 1px;

  background: #f1f5f9;
}

.delivery-popup-order {
  display: flex;

  align-items: center;
  justify-content: space-between;

  padding: 14px 16px;
}

.delivery-popup-order-number {
  margin-top: 3px;

  font-size: 17px;
  font-weight: 700;

  color: #0f172a;
}

.delivery-popup-speed {
  text-align: right;
}

.delivery-popup-speed-value {
  margin-top: 3px;

  font-size: 17px;
  font-weight: 700;

  color: #0f172a;
}

.delivery-popup-speed-value span {
  font-size: 10px;
  font-weight: 500;

  color: #64748b;
}

.delivery-popup-location {
  display: flex;
  align-items: center;

  gap: 10px;

  margin: 0 12px;

  padding: 11px;

  border-radius: 10px;

  background: #f8fafc;
}

.delivery-popup-location-icon {
  width: 30px;
  height: 30px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: white;

  color: #475569;

  font-size: 17px;
}

.delivery-popup-coordinates {
  margin-top: 3px;

  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;

  font-size: 10px;

  color: #475569;
}

.delivery-popup-footer {
  display: flex;
  align-items: center;

  gap: 6px;

  padding: 12px 16px 14px;

  font-size: 9px;

  color: #94a3b8;
}

.delivery-popup-live-dot {
  width: 6px;
  height: 6px;

  border-radius: 9999px;

  background: #10b981;

  box-shadow:
    0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>