<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMeta } from 'quasar'

// Composables
import useSavedLocations from '@/composables/weather/useSavedLocations'
import useWeatherStore from '@/store/weather'

// Components
import SearchLocation from '@/views/weather/components/SearchLocation.vue'
import SavedLocations from '@/views/weather/components/SavedLocations.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import TemperatureChart from './components/charts/TemperatureChart.vue'
import WindChart from './components/charts/WindChart.vue'
import Clouds from './components/charts/Clouds.vue'
import Rain from './components/charts/Rain.vue'

const pageTitle = ref('Weather | The App')

useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Weather' },
      keywords: { name: 'keywords', content: 'weather, forecast, slovakia weather, charts' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})

const { hasSavedLocations, resolveSavedLocations } = useSavedLocations()
const weatherStore = useWeatherStore()
const { currentWeatherData } = storeToRefs(weatherStore)

resolveSavedLocations()
</script>

<template>
  <q-page class="page-weather q-py-md q-px-lg">
    <div class="row q-col-gutter-md q-mb-md items-center">
      <div class="col-12 col-md-6">
        <h1 class="text-h4 q-my-none">Weather</h1>
      </div>
      <div class="col-12 col-md-6 row justify-end items-center q-gutter-sm">
        <SavedLocations v-if="hasSavedLocations" />
        <SearchLocation />
      </div>
    </div>

    <CurrentWeather class="q-mb-lg" />

    <div v-if="currentWeatherData" class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card class="q-pa-sm">
          <TemperatureChart />
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card class="q-pa-sm">
          <Rain />
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card class="q-pa-sm">
          <WindChart />
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card class="q-pa-sm">
          <Clouds />
        </q-card>
      </div>
    </div>
  </q-page>
</template>


