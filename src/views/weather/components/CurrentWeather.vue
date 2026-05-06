<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { getWeatherIconUrl } from '@/utils/openWeatherRequestUrl'
import useWeatherStore from '@/store/weather/'
import useSavedLocations from '@/composables/weather/useSavedLocations'

import SunriseSunsetGauge from './SunriseSunsetGauge.vue'
import HumidityGauge from './HumidityGauge.vue'
import WindGauge from './WindGauge.vue'

const weatherStore = useWeatherStore()
const { activeLocation, activeRegion, coordinates, currentWeatherData } = storeToRefs(weatherStore)
const { savedLocations, saveLocation } = useSavedLocations()

const isAlreadySaved = computed(() => savedLocations.value.some((l) => l.name === activeLocation.value))
</script>

<template>
  <div v-if="currentWeatherData" class="current-weather">
    <!-- Hero card -->
    <q-card flat class="hero-card q-mb-md overflow-hidden">
      <div class="hero-bg">
        <q-btn
          v-if="!isAlreadySaved"
          icon="bookmark_add"
          flat
          dense
          round
          size="sm"
          class="save-btn absolute"
          style="top: 12px; right: 12px; z-index: 1"
          @click="saveLocation([coordinates.lat as number, coordinates.lon as number], activeLocation, activeRegion)"
        >
          <q-tooltip>Save location</q-tooltip>
        </q-btn>
        <div class="row hero-inner">
          <!-- Left: temperature + location -->
          <div class="col-12 col-sm-7 hero-left">
            <div class="flex items-start location-row q-mb-md">
              <div class="flex column">
                <span class="text-h6 text-weight-medium location-name">{{ activeLocation }}</span>
                <span v-if="activeRegion" class="text-body2 region-label gt-xs">{{ activeRegion }}</span>
              </div>
            </div>

            <div class="hero-left-body">
              <!-- Temp column -->
              <div class="temp-col">
                <div class="flex items-start">
                  <span class="big-temp">{{ parseFloat(currentWeatherData.main.temp.toFixed(0)) }}</span>
                  <div class="flex column q-ml-sm q-pt-xs">
                    <span class="celsius-unit">°C</span>
                    <div class="hi-lo q-mt-xs">
                      <div class="text-body2 hi-val">
                        <q-icon name="north" size="xs" />
                        {{ parseFloat(currentWeatherData.main.temp_max.toFixed(0)) }}°
                      </div>
                      <div class="text-body2 lo-val">
                        <q-icon name="south" size="xs" />
                        {{ parseFloat(currentWeatherData.main.temp_min.toFixed(0)) }}°
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Condition column -->
              <div class="condition-col flex column items-center justify-center condition-row">
                <q-img
                  :src="getWeatherIconUrl(currentWeatherData.weather[0].icon)"
                  fit="contain"
                  class="condition-icon"
                />
                <span class="condition-label q-mt-xs text-center">
                  {{ currentWeatherData.weather[0].description }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: quick stats -->
          <div class="col-12 col-sm-5 hero-right">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-label">Feels like</div>
                <div class="stat-value">
                  <q-icon name="sym_s_thermometer" class="stat-icon" />
                  {{ currentWeatherData.main.feels_like.toFixed(0) }}<span class="stat-unit">°C</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Pressure</div>
                <div class="stat-value">
                  <q-icon name="sym_s_speed" class="stat-icon" />
                  {{ currentWeatherData.main.pressure }}<span class="stat-unit"> hPa</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Visibility</div>
                <div class="stat-value">
                  <q-icon name="visibility" class="stat-icon" />
                  {{ currentWeatherData.visibility / 1000 }}<span class="stat-unit"> km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Gauges row -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat class="gauge-card q-pa-md">
          <SunriseSunsetGauge />
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat class="gauge-card q-pa-md">
          <HumidityGauge />
        </q-card>
      </div>
      <div class="col-12 col-sm-12 col-md-4">
        <q-card flat class="gauge-card q-pa-md">
          <WindGauge />
        </q-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.current-weather {
  .hero-card {
    .hero-bg {
      background: linear-gradient(135deg, #1a3348 0%, #2c5364 45%, #1e6fa0 100%);
      color: rgba(255, 255, 255, 0.92);
    }

    .hero-inner {
      padding: 1.25rem;
      align-items: center;

      @media (min-width: 600px) {
        padding: 2rem 2.5rem;
      }
    }

    .hero-left {
      .location-pin {
        opacity: 0.7;
      }
      .region-label {
        opacity: 0.6;
      }
      .save-btn {
        opacity: 0.7;
        color: rgba(255, 255, 255, 0.85);
      }

      .location-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 55vw;

        @media (min-width: 600px) {
          max-width: none;
        }
      }

      .big-temp {
        font-size: clamp(4.5rem, 18vw, 7.5rem);
        font-weight: 800;
        line-height: 1;
        letter-spacing: -3px;
        color: rgba(255, 255, 255, 0.97);

        @media (min-width: 600px) {
          font-size: clamp(5rem, 9vw, 7.5rem);
        }
      }

      .celsius-unit {
        font-size: clamp(1.4rem, 4vw, 2rem);
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

      .hero-left-body {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1.5rem;

        .temp-col {
          flex-shrink: 0;
        }

        .condition-col {
          flex: 1;
        }
      }

      .condition-row {
        .condition-icon {
          opacity: 0.95;
          width: clamp(90px, 18vw, 140px);
          height: clamp(90px, 18vw, 140px);

          @media (min-width: 600px) {
            width: clamp(100px, 12vw, 140px);
            height: clamp(100px, 12vw, 140px);
          }
        }
        .condition-label {
          font-size: clamp(1rem, 3.5vw, 1.35rem);
          font-weight: 500;
          text-transform: capitalize;
          opacity: 0.9;
          letter-spacing: 0.01em;
        }
      }
    }

    .hero-right {
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.15);

      @media (min-width: 600px) {
        margin-top: 0;
        padding-top: 0;
        padding-left: 2.5rem;
        border-top: none;
        border-left: 1px solid rgba(255, 255, 255, 0.15);
      }

      .stats-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        @media (min-width: 600px) {
          flex-direction: column;
          gap: 1.5rem;
        }
      }

      .stat-item {
        .stat-label {
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.55;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .stat-icon {
          font-size: 1rem;
          margin-right: 2px;

          @media (min-width: 600px) {
            font-size: 1.3rem;
          }
        }

        .stat-value {
          font-size: 1.15rem;
          font-weight: 700;
          display: flex;
          align-items: center;

          @media (min-width: 600px) {
            font-size: 1.75rem;
          }

          .stat-unit {
            font-size: 0.75rem;
            font-weight: 300;
            margin-left: 1px;
            opacity: 0.75;

            @media (min-width: 600px) {
              font-size: 0.95rem;
            }
          }
        }
      }
    }
  }

  .gauge-card {
    height: 100%;
  }
}
</style>
