<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMeta } from 'quasar'
// Composables
import useSavedLocations from '@/composables/weather/useSavedLocations'
// Store
import { useWeatherStore } from '@/store/weather'
// Components
import Search from '@/views/weather/components/Search.vue'
import Now from '@/views/weather/components/Now.vue'
// Charts
import TemperatureChart from '@/views/weather/components/charts/TemperatureChart.vue'
import PrecipitationChart from '@/views/weather/components/charts/PrecipitationChart.vue'
import CloudAreaFractionChart from '@/views/weather/components/charts/CloudAreaFractionChart.vue'
import WindSpeedChart from '@/views/weather/components/charts/WindSpeedChart.vue'
import HumidityChart from '@/views/weather/components/charts/HumidityChart.vue'
import AirPresureChart from '@/views/weather/components/charts/AirPresureChart.vue'
import SavedLocations from '@/views/weather/components/SavedLocations.vue'

const weatherStore = useWeatherStore()
const activeRegion = ref(weatherStore.activeRegion)
const pageTitle = ref('Weather | The App')
const theme = ref('')

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

const { hasSavedLocations, checkForSavedLocations } = useSavedLocations()

checkForSavedLocations()

// Watching the `activeRegion` ref and when it changes it sets the `theme` ref to a value based on the
// `activeRegion` value.
watch(activeRegion, (value: string) => {
  switch (value) {
    case 'Bratislavský':
      theme.value = 'bratislavsky'
      break
    case 'Trnavský':
      theme.value = 'trnavsky'
      break
    case 'Trenčiansky':
      theme.value = 'trenciansky'
      break
    case 'Nitriansky':
      theme.value = 'nitriansky'
      break
    case 'Žilinský':
      theme.value = 'zilinsky'
      break
    case 'Banskobystrický':
      theme.value = 'banskobystricky'
      break
    case 'Prešovský':
      theme.value = 'presovsky'
      break
    case 'Košický':
      theme.value = 'kosicky'
      break
    default:
      theme.value = ''
  }
})
</script>

<template>
  <q-page class="page-weather q-px-lg q-py-md">
    <div class="row justify-between items-center">
      <h1 class="text-h6">Weather</h1>
      <SavedLocations v-if="hasSavedLocations" />
    </div>
    <Search />
    <template v-if="weatherStore.weatherData && weatherStore.timeSeries">
      <Now :units="weatherStore.weatherData.properties.meta.units" />
      <div class="row justify-center q-mb-lg">
        <TemperatureChart />
        <PrecipitationChart />
      </div>
      <div class="row justify-center q-mb-lg">
        <CloudAreaFractionChart />
        <WindSpeedChart />
      </div>
      <div class="row justify-center q-mb-lg">
        <HumidityChart />
        <AirPresureChart />
      </div>
    </template>
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
