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
import SavedLocations from '@/views/weather/components/SavedLocations.vue'
// Charts
import TodayTemperatureChart from '@/views/weather/components/charts/today/TodayTemperatureChart.vue'
import TodayPrecipitationChart from '@/views/weather/components/charts/today/TodayPrecipitationChart.vue'
import TodayWindSpeedChart from '@/views/weather/components/charts/today/TodayWindSpeedChart.vue'
import TodayCloudAreaFractionChart from '@/views/weather/components/charts/today/TodayCloudAreaFractionChart.vue'
import TodayHumidityChart from '@/views/weather/components/charts/today/TodayHumidityChart.vue'
import TodayAirPressureChart from '@/views/weather/components/charts/today/TodayAirPressureChart.vue'
import TemperatureChart from '@/views/weather/components/charts/next7days/TemperatureChart.vue'
import PrecipitationChart from '@/views/weather/components/charts/next7days/PrecipitationChart.vue'
import WindSpeedChart from '@/views/weather/components/charts/next7days/WindSpeedChart.vue'
import CloudAreaFractionChart from '@/views/weather/components/charts/next7days/CloudAreaFractionChart.vue'
import HumidityChart from '@/views/weather/components/charts/next7days/HumidityChart.vue'
import AirPressureChart from '@/views/weather/components/charts/next7days/AirPressureChart.vue'

const weatherStore = useWeatherStore()
const activeRegion = ref(weatherStore.activeRegion)
const pageTitle = ref('Weather | The App')
const theme = ref('')
const tab = ref('today')

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
  <q-page class="page-weather q-pa-md">
    <div class="row justify-between items-center">
      <h1 class="text-h6">Weather</h1>
      <SavedLocations v-if="hasSavedLocations" />
    </div>
    <Search />
    <template v-if="weatherStore.weatherData && weatherStore.timeSeries && weatherStore.todaySeries">
      <Now :units="weatherStore.weatherData.properties.meta.units" />
      <q-tabs v-model="tab" align="justify" class="weather-tabs q-mb-lg q-mx-auto text-bold" :breakpoint="0">
        <q-tab name="today" :ripple="false">Today</q-tab>
        <q-tab name="next7days" :ripple="false">Next 7 days</q-tab>
      </q-tabs>
      <template v-if="tab === 'today'">
        <div class="row justify-center q-mb-lg">
          <TodayTemperatureChart />
          <TodayPrecipitationChart />
        </div>
        <div class="row justify-center q-mb-lg">
          <TodayWindSpeedChart />
          <TodayCloudAreaFractionChart />
        </div>
        <div class="row justify-center q-mb-lg">
          <TodayHumidityChart />
          <TodayAirPressureChart />
        </div>
      </template>
      <template v-else>
        <div class="row justify-center q-mb-lg">
          <TemperatureChart />
          <PrecipitationChart />
        </div>
        <div class="row justify-center q-mb-lg">
          <WindSpeedChart />
          <CloudAreaFractionChart />
        </div>
        <div class="row justify-center q-mb-lg">
          <HumidityChart />
          <AirPressureChart />
        </div>
      </template>
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
  .weather-tabs {
    max-width: 375px;
    color: $primary;
  }
}
</style>
