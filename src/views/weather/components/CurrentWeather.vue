<script setup lang="ts">
import { storeToRefs } from 'pinia'

// utils
import { getWeatherIconUrl } from '@/utils/openWeatherRequestUrl'

// Store
import useWeatherStore from '@/store/weather/'

// Components
import SunriseSunsetGauge from './SunriseSunsetGauge.vue'
import HumidityGauge from './HumidityGauge.vue'

const weatherStore = useWeatherStore()
const { activeLocation, currentWeatherData } = storeToRefs(weatherStore)
</script>

<template>
  <div v-if="currentWeatherData" class="current-weather">
    <div class="row q-mb-md">
      <div class="col">
        <div class="location text-center">
          <h4 class="text-h4">
            {{ activeLocation }}
          </h4>
        </div>
      </div>
    </div>
    <div class="row q-mb-lg">
      <div class="col">
        <div class="top-wrapper q-mx-auto">
          <div class="weather-condition flex justify-center q-mx-auto">
            <div class="condition">
              <q-img
                :src="getWeatherIconUrl(currentWeatherData.weather[0].icon)"
                spinner-color="primary"
                fit="none"
                width="100px"
                height="100px"
                class="flex item-center"
                img-class="condition-icon"
              />
              <h5 class="condition-description text-overline absolute">
                {{ currentWeatherData.weather[0].description }}
              </h5>
            </div>
            <h2 class="temp text-h1 text-weight-bold">
              {{ parseFloat(currentWeatherData.main.temp.toFixed(0)) }}
              <span class="celsius-unit text-h4 text-weight-bold">°C</span>
              <div class="min-max-temp absolute text-center">
                <h3 class="text-subtitle2">
                  <q-icon color="orange-7" name="north" title="High"></q-icon>
                  {{ parseFloat(currentWeatherData.main.temp_max.toFixed(0)) }}°
                </h3>
                <h3 class="text-subtitle2">
                  <q-icon color="blue-7" name="south" title="Low"></q-icon>
                  {{ parseFloat(currentWeatherData.main.temp_min.toFixed(0)) }}°
                </h3>
              </div>
            </h2>
          </div>
          <ul class="aditional-data">
            <li>
              <h6 class="text-overline">
                feels like
                <span class="text-subtitle1 text-primary"
                  >{{ parseFloat(currentWeatherData.main.feels_like.toFixed(0)) }}°</span
                >
              </h6>
            </li>
            <li>
              <h6 class="text-overline">
                humidity
                <span class="text-subtitle1 text-primary">{{ currentWeatherData.main.humidity }}%</span>
              </h6>
            </li>
            <li>
              <h6 class="text-overline">
                pressure
                <span class="text-subtitle1 text-primary">{{ currentWeatherData.main.pressure }} hPa</span>
              </h6>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <SunriseSunsetGauge />
      </div>
      <div class="col">
        <HumidityGauge />
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<style lang="scss">
.current-weather {
  .region {
    color: var(--text-muted);
  }
  .top-wrapper {
    max-width: 460px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 40px;
    .weather-condition {
      .condition {
        position: relative;
        .condition-icon {
          height: auto;
          max-width: 100%;
          width: auto;
        }
        .condition-description {
          white-space: nowrap;
          bottom: -14px;
          left: 50%;
          transform: translateX(-50%);
        }
      }

      .temp {
        position: relative;
        .celsius-unit {
          position: absolute;
          top: 5px;
          right: -40px;
        }
        .min-max-temp {
          bottom: 10px;
          right: -44px;
          h3 {
            line-height: 22px;
          }
        }
      }
    }
    .aditional-data {
      list-style: none;
      h6 {
        color: var(--text-muted);
      }
    }
  }
}
</style>
