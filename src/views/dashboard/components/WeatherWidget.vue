<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import useWeatherStore from '@/store/weather'
import useSavedLocations from '@/composables/weather/useSavedLocations'
import { getWeatherIconUrl } from '@/utils/openWeatherRequestUrl'

const router = useRouter()
const weatherStore = useWeatherStore()
const { activeLocation, currentWeatherData } = storeToRefs(weatherStore)
const { savedLocations, resolveSavedLocations } = useSavedLocations()

const loading = ref(false)

resolveSavedLocations()

onMounted(async () => {
  if (savedLocations.value.length > 0) {
    const first = savedLocations.value[0]
    weatherStore.activeLocation = first.name
    weatherStore.activeRegion = first.region
    weatherStore.coordinates.lat = first.lat
    weatherStore.coordinates.lon = first.lon
    loading.value = true
    await weatherStore.getCurrentWeatherData()
    loading.value = false
  }
})
</script>

<template>
  <q-card class="weather-widget full-height">
    <q-card-section v-if="!savedLocations.length && !loading" class="text-center text-grey-6">
      <q-icon name="location_off" size="32px" class="q-mb-sm" />
      <div class="text-body2">No saved locations.</div>
      <div class="text-caption">Save a location on the Weather page to see it here.</div>
    </q-card-section>

    <q-card-section v-else-if="loading" class="flex flex-center" style="min-height: 120px;">
      <q-spinner-dots color="primary" size="40px" />
    </q-card-section>

    <template v-else-if="currentWeatherData">
      <q-card-section class="q-pb-xs">
        <div class="row items-center justify-between no-wrap">
          <div class="text-h6 text-weight-bold ellipsis">{{ activeLocation }}</div>
          <q-btn
            flat
            dense
            round
            icon="open_in_new"
            color="primary"
            size="sm"
            @click="router.push('/weather')"
          >
            <q-tooltip>View full forecast</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-xs weather-widget__content">
        <div class="row items-center no-wrap">
          <q-img
            :src="getWeatherIconUrl(currentWeatherData.weather[0].icon)"
            width="120px"
            height="120px"
            spinner-color="primary"
            fit="none"
          />
          <div class="q-ml-sm">
            <div class="text-subtitle2 text-grey-6 text-capitalize">
              {{ currentWeatherData.weather[0].description }}
            </div>
            <div class="weather-widget__temp text-weight-bold">
              {{ parseFloat(currentWeatherData.main.temp.toFixed(0)) }}
              <span class="weather-widget__unit text-weight-bold">°C</span>
            </div>
            <div class="row q-gutter-x-sm text-subtitle2">
              <span>
                <q-icon color="orange-7" name="north" size="16px" />
                {{ parseFloat(currentWeatherData.main.temp_max.toFixed(0)) }}°
              </span>
              <span>
                <q-icon color="blue-7" name="south" size="16px" />
                {{ parseFloat(currentWeatherData.main.temp_min.toFixed(0)) }}°
              </span>
            </div>
          </div>
        </div>
      </q-card-section>
    </template>
  </q-card>
</template>

<style lang="scss" scoped>
.weather-widget {
  min-width: 180px;
  display: flex;
  flex-direction: column;

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__temp {
    font-size: 4rem;
    line-height: 1;
  }

  &__unit {
    font-size: 1.75rem;
  }
}
</style>
