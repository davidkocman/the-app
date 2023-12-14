<script setup lang="ts">
import { ref } from 'vue'
import { useMeta } from 'quasar'

// Composables
import useSavedLocations from '@/composables/weather/useSavedLocations'

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

resolveSavedLocations()
</script>

<template>
  <q-page class="page-weather q-py-md q-px-lg">
    <div class="row q-mb-md justify-between items-center">
      <h1 class="text-h6">Weather</h1>
      <SavedLocations v-if="hasSavedLocations" />
    </div>
    <SearchLocation />
    <CurrentWeather />
    <div class="row q-my-lg">
      <div class="col">
        <TemperatureChart />
        <Rain />
        <WindChart />
        <Clouds />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.page-weather {
  .fav-loc {
    position: fixed;
    right: 10px;
    top: 70px;
  }
}
</style>
