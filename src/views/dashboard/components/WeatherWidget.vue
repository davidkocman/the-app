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
  <q-card flat class="weather-widget overflow-hidden">
    <div class="widget-bg flex column">
      <!-- Empty state -->
      <div v-if="!savedLocations.length && !loading" class="flex flex-center column flex-1 q-pa-lg text-center">
        <q-icon name="location_off" size="2rem" class="q-mb-sm" style="opacity: 0.5" />
        <div class="text-body2" style="opacity: 0.7">No saved locations.</div>
        <div class="text-caption" style="opacity: 0.5">Save a location on the Weather page.</div>
      </div>

      <!-- Loading state -->
      <div v-else-if="loading" class="flex flex-center flex-1">
        <q-spinner-dots color="white" size="36px" />
      </div>

      <!-- Weather data -->
      <template v-else-if="currentWeatherData">
        <!-- Header: location -->
        <div class="widget-header flex items-center justify-between no-wrap q-px-md q-pt-md q-pb-sm">
          <div class="flex items-center no-wrap" style="min-width: 0">
            <q-icon name="location_on" size="1rem" class="q-mr-xs location-pin" />
            <span class="text-body1 text-weight-medium location-name">{{ activeLocation }}</span>
          </div>
          <q-btn
            flat
            dense
            round
            icon="open_in_new"
            size="sm"
            class="nav-btn q-ml-xs"
            style="flex-shrink: 0"
            @click="router.push('/weather')"
          >
            <q-tooltip>View full forecast</q-tooltip>
          </q-btn>
        </div>

        <!-- Main: temperature + condition -->
        <div class="widget-main flex items-center justify-center flex-1 q-px-md q-py-sm">
          <!-- Temperature -->
          <div class="temp-col flex items-start">
            <span class="big-temp">{{ parseFloat(currentWeatherData.main.temp.toFixed(0)) }}</span>
            <div class="flex column q-ml-xs q-pt-xs">
              <span class="celsius-unit">°C</span>
              <div class="hi-lo q-mt-xs">
                <div class="text-caption hi-val">
                  <q-icon name="north" size="12px" />
                  {{ parseFloat(currentWeatherData.main.temp_max.toFixed(0)) }}°
                </div>
                <div class="text-caption lo-val">
                  <q-icon name="south" size="12px" />
                  {{ parseFloat(currentWeatherData.main.temp_min.toFixed(0)) }}°
                </div>
              </div>
            </div>
          </div>

          <!-- Condition -->
          <div class="condition-col flex column items-center justify-center flex-1">
            <q-img :src="getWeatherIconUrl(currentWeatherData.weather[0].icon)" fit="contain" class="condition-icon" />
            <span class="condition-label text-center q-mt-xs">
              {{ currentWeatherData.weather[0].description }}
            </span>
          </div>
        </div>

        <!-- Footer: stats strip -->
        <div class="widget-stats row no-wrap q-px-md q-pb-md q-pt-sm">
          <div class="stat-item col flex column items-center">
            <div class="stat-label">Feels like</div>
            <div class="stat-value">
              <q-icon name="sym_s_thermometer" size="0.9rem" />
              {{ currentWeatherData.main.feels_like.toFixed(0) }}<span class="stat-unit">°C</span>
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item col flex column items-center">
            <div class="stat-label">Pressure</div>
            <div class="stat-value">
              <q-icon name="sym_s_speed" size="0.9rem" />
              {{ currentWeatherData.main.pressure }}<span class="stat-unit"> hPa</span>
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item col flex column items-center">
            <div class="stat-label">Visibility</div>
            <div class="stat-value">
              <q-icon name="visibility" size="0.9rem" />
              {{ currentWeatherData.visibility / 1000 }}<span class="stat-unit"> km</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.weather-widget {
  min-width: 180px;
  height: 320px;

  .widget-bg {
    background: linear-gradient(135deg, #1a3348 0%, #2c5364 45%, #1e6fa0 100%);
    color: rgba(255, 255, 255, 0.92);
    height: 100%;
  }

  .widget-header {
    .location-pin {
      opacity: 0.7;
      flex-shrink: 0;
    }
    .location-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.9;
    }
    .nav-btn {
      opacity: 0.7;
      color: rgba(255, 255, 255, 0.85);
    }
  }

  .widget-main {
    gap: 0.5rem;

    .temp-col {
      flex-shrink: 0;

      .big-temp {
        font-size: clamp(4.5rem, 10vw, 6rem);
        font-weight: 800;
        line-height: 1;
        letter-spacing: -3px;
        color: rgba(255, 255, 255, 0.97);
      }

      .celsius-unit {
        font-size: 1.1rem;
        font-weight: 300;
        opacity: 0.85;
        line-height: 1;
      }

      .hi-lo {
        .hi-val {
          color: #ffab76;
        }
        .lo-val {
          color: #90caf9;
        }
      }
    }

    .condition-col {
      .condition-icon {
        opacity: 0.95;
        width: clamp(72px, 12vw, 100px);
        height: clamp(72px, 12vw, 100px);
      }

      .condition-label {
        font-size: clamp(1rem, 2.5vw, 1.2rem);
        font-weight: 600;
        text-transform: capitalize;
        opacity: 0.95;
        letter-spacing: 0.01em;
        line-height: 1.3;
      }
    }
  }

  .widget-stats {
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    gap: 0;

    .stat-divider {
      width: 1px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0.15rem 0;
      flex-shrink: 0;
    }

    .stat-item {
      .stat-label {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.65;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .stat-value {
        font-size: 1rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 1px;

        .stat-unit {
          font-size: 0.7rem;
          font-weight: 400;
          opacity: 0.85;
        }
      }
    }
  }
}
</style>
