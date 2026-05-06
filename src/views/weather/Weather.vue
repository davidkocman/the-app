<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMeta } from 'quasar'

import useSavedLocations from '@/composables/weather/useSavedLocations'
import useWeatherStore from '@/store/weather'

import SearchLocation from '@/views/weather/components/SearchLocation.vue'
import SavedLocations from '@/views/weather/components/SavedLocations.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import TemperatureChart from './components/charts/TemperatureChart.vue'
import WindChart from './components/charts/WindChart.vue'
import Clouds from './components/charts/Clouds.vue'
import Rain from './components/charts/Rain.vue'

const pageTitle = ref('Weather | The App')

useMeta(() => ({
  title: pageTitle.value,
  meta: {
    description: { name: 'description', content: 'Weather' },
    keywords: { name: 'keywords', content: 'weather, forecast, slovakia weather, charts' },
    equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
  }
}))

const { hasSavedLocations, savedLocations, resolveSavedLocations } = useSavedLocations()
const weatherStore = useWeatherStore()
const { currentWeatherData } = storeToRefs(weatherStore)

resolveSavedLocations()

onMounted(() => {
  if (savedLocations.value.length > 0) {
    const first = savedLocations.value[0]
    weatherStore.activeLocation = first.name
    weatherStore.activeRegion = first.region
    weatherStore.coordinates.lat = first.lat
    weatherStore.coordinates.lon = first.lon
    weatherStore.getWeatherData()
  }
})
</script>

<template>
  <q-page class="page-weather q-py-md q-px-lg">
    <div class="row q-mb-lg items-center justify-between">
      <h1 class="text-h4 q-my-none flex items-center" style="gap: 10px"><q-icon name="thermostat" />Weather</h1>
      <div class="flex justify-end items-center">
        <SavedLocations v-if="hasSavedLocations" />
        <SearchLocation />
      </div>
    </div>

    <CurrentWeather class="q-mb-lg" />

    <div v-if="currentWeatherData" class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <q-card flat class="q-pa-sm">
          <TemperatureChart />
        </q-card>
      </div>
      <div class="col-12 col-sm-6">
        <q-card flat class="q-pa-sm">
          <Rain />
        </q-card>
      </div>
      <div class="col-12 col-sm-6">
        <q-card flat class="q-pa-sm">
          <WindChart />
        </q-card>
      </div>
      <div class="col-12 col-sm-6">
        <q-card flat class="q-pa-sm">
          <Clouds />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.page-weather {
  padding-left: 6px;
  padding-right: 6px;

  @media (min-width: 768px) {
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
