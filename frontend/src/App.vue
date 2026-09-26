<script setup lang="ts">
import DeliveryMap from './components/DeliveryMap.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">

    <div class="mx-auto max-w-6xl">

      <h1 class="mb-6 text-3xl font-bold">
        Seguimiento de reparto
      </h1>

      <div class="mb-6 rounded-lg bg-white p-6 shadow">

        <h2 class="mb-2 text-xl font-semibold">
          Ubicación del repartidor
        </h2>

        <p class="text-gray-600">
          Seguimiento en tiempo real
        </p>

      </div>

      <DeliveryMap />

    </div>

  </div>
</template>