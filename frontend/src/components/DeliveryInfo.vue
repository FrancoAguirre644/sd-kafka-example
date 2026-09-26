<script setup lang="ts">
import type { DeliveryLocation } from '../types/delivery'

defineProps<{
  location: DeliveryLocation | null
}>()
</script>

<template>
  <aside class="space-y-4">

    <!-- Pedido -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >

      <div class="mb-5 flex items-start justify-between">

        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Pedido
          </p>

          <h2
            class="mt-1 text-2xl font-bold text-slate-900"
          >
            #{{ location?.pedidoId ?? '----' }}
          </h2>
        </div>

        <span
          v-if="location"
          class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
        >
          En reparto
        </span>

      </div>

      <div class="flex items-center gap-3 border-t border-slate-100 pt-4">

        <div
          class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl"
        >
          👤
        </div>

        <div>
          <p class="text-xs text-slate-400">
            Repartidor
          </p>

          <p class="font-semibold text-slate-800">
            {{
              location
                ? `Repartidor ${location.repartidorId}`
                : 'Esperando...'
            }}
          </p>
        </div>

      </div>

    </div>

    <!-- Velocidad -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >

      <p
        class="text-xs font-semibold uppercase tracking-wider text-slate-400"
      >
        Velocidad actual
      </p>

      <div class="mt-2 flex items-end gap-2">

        <span
          class="text-3xl font-bold text-slate-900"
        >
          {{ location?.velocidad ?? '--' }}
        </span>

        <span class="mb-1 text-sm text-slate-500">
          km/h
        </span>

      </div>

    </div>

    <!-- Ubicación -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >

      <p
        class="text-xs font-semibold uppercase tracking-wider text-slate-400"
      >
        Ubicación actual
      </p>

      <div class="mt-4 space-y-3">

        <div class="flex justify-between">

          <span class="text-sm text-slate-500">
            Latitud
          </span>

          <span class="font-mono text-sm font-medium text-slate-800">
            {{ location?.latitud ?? '--' }}
          </span>

        </div>

        <div class="flex justify-between">

          <span class="text-sm text-slate-500">
            Longitud
          </span>

          <span class="font-mono text-sm font-medium text-slate-800">
            {{ location?.longitud ?? '--' }}
          </span>

        </div>

      </div>

    </div>

    <!-- Estado -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >

      <div class="flex items-center gap-3">

        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50"
        >
          <span class="text-emerald-600">
            ✓
          </span>
        </div>

        <div>

          <p class="text-xs text-slate-400">
            Estado
          </p>

          <p class="font-semibold text-slate-800">
            {{ location?.estado ?? 'Esperando ubicación' }}
          </p>

        </div>

      </div>

    </div>

  </aside>
</template>