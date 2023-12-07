<script setup lang="ts">
import { storeToRefs } from 'pinia'

// Store
import useWeatherStore from '@/store/weather/'

const weatherStore = useWeatherStore()
const { currentWeatherData } = storeToRefs(weatherStore)
</script>

<template>
  <q-card v-if="currentWeatherData" class="card q-mx-auto rounded-borders">
    <q-card-section>
      <h6 class="text-subtitle1 text-primary text-weight-bolder">Feels like</h6>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <h3 class="text-h3 text-weight-bold flex items-end">
        <q-icon name="sym_s_thermometer" color="primary" />{{ currentWeatherData.main.feels_like.toFixed(0)
        }}<span class="text-h6 text-weight-regular">°C</span>
      </h3>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.card {
  max-width: 320px;
}
</style>
