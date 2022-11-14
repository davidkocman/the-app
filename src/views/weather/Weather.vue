<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMeta } from 'quasar'
import { WeatherData, TimeSeries } from '@/types/weather'
import useGetTimeSeries from '@/composables/weather/useGetTimeSeries'
import useSavedLocations from '@/composables/weather/useSavedLocations'
import Search from '@/views/weather/components/Search.vue'
import Now from '@/views/weather/components/Now.vue'
import TemperatureChart from '@/views/weather/components/charts/TemperatureChart.vue'
import PrecipitationChart from '@/views/weather/components/charts/PrecipitationChart.vue'
import CloudAreaFractionChart from '@/views/weather/components/charts/CloudAreaFractionChart.vue'
import WindSpeedChart from '@/views/weather/components/charts/WindSpeedChart.vue'
import HumidityChart from '@/views/weather/components/charts/HumidityChart.vue'
import AirPresureChart from '@/views/weather/components/charts/AirPresureChart.vue'
import SavedLocations from '@/views/weather/components/SavedLocations.vue'

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

const weatherData = ref<WeatherData | null>(null)
const activeLocation = ref<string>('')
const activeRegion = ref<string>('')
const coordinates = ref<string[]>([])
const theme = ref<string>('')
const timeseries = ref<TimeSeries[]>([])

const { hasSavedLocations, checkForSavedLocations } = useSavedLocations()

checkForSavedLocations()

// A function that is called when the `weatherData` is emitted from the `Search` component. It sets the
// `weatherData` and `timeseries` refs.
function onWeatherData(data: WeatherData) {
  weatherData.value = data
  const { series } = useGetTimeSeries(data)
  timeseries.value = series.value
}
// A function that is called when the `activeLocation` is emitted from the `Search` component. It sets
// the `activeLocation` ref.
function onActiveLocation(val: string) {
  activeLocation.value = val
}
// A function that is called when the `activeRegion` is emitted from the `Search` component. It sets
// the `activeRegion` ref.
function onActiveRegion(val: string) {
  activeRegion.value = val
}
// A function that is called when the `coordinates` is emitted from the `Search` component. It sets the
// `coordinates` ref.
function onCoordinates(val: string[]) {
  coordinates.value = val
}

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
      <SavedLocations
        v-if="hasSavedLocations"
        @weatherData="onWeatherData"
        @activeLocation="onActiveLocation"
        @activeRegion="onActiveRegion"
      />
    </div>
    <Search
      @weatherData="onWeatherData"
      @activeLocation="onActiveLocation"
      @activeRegion="onActiveRegion"
      @coordinates="onCoordinates"
    />
    <template v-if="weatherData">
      <Now
        :timeSeries="weatherData.properties.timeseries"
        :activeLocation="activeLocation"
        :activeRegion="activeRegion"
        :units="weatherData.properties.meta.units"
        :coordinates="coordinates"
      />
      <div class="row justify-center q-mb-lg">
        <TemperatureChart :timeseries="timeseries" />
        <PrecipitationChart :timeseries="timeseries" />
      </div>
      <div class="row justify-center q-mb-lg">
        <CloudAreaFractionChart :timeseries="timeseries" />
        <WindSpeedChart :timeseries="timeseries" />
      </div>
      <div class="row justify-center q-mb-lg">
        <HumidityChart :timeseries="timeseries" />
        <AirPresureChart :timeseries="timeseries" />
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
