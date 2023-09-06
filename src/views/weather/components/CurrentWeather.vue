<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getWeatherIconUrl } from '@/utils/openWeatherRequestUrl'

// utils
import { timeFromUnix, sunProgress, calculateValueFromPercentage } from '@/utils/helpers'

// Store
import useWeatherStore from '@/store/weather/'

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
        <div class="sunrise-sunset">
          <div class="title text-overline text-center">Sunrise & sunset</div>
          <div class="sun-position">
            <div class="gauge-a"></div>
            <div class="gauge-b">
              <span class="sunrise q-pt-xs">
                {{ timeFromUnix(currentWeatherData.sys.sunrise, currentWeatherData.timezone) }}
              </span>
              <span class="sunset q-pt-xs">
                {{ timeFromUnix(currentWeatherData.sys.sunset, currentWeatherData.timezone) }}
              </span>
            </div>
            <div
              v-if="
                sunProgress(currentWeatherData.sys.sunrise, currentWeatherData.sys.sunset, currentWeatherData.timezone)
              "
              class="gauge-c"
              :style="{
                transform: `rotate(${calculateValueFromPercentage(
                  sunProgress(
                    currentWeatherData.sys.sunrise,
                    currentWeatherData.sys.sunset,
                    currentWeatherData.timezone
                  ) || 0,
                  180
                )}deg)`
              }"
            >
              <div class="sun"></div>
            </div>
            <div v-else class="moon">
              <q-icon name="nights_stay" size="6em"></q-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="col"></div>
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
  .sunrise-sunset {
    min-height: 210px;
    position: relative;
    overflow: hidden;
    .sun-position {
      width: 240px;
      height: 120px;
      left: 50%;
      transform: translateX(-50%);
      position: absolute;
      bottom: 20px;
      text-align: center;
      .gauge-a {
        z-index: 1;
        position: relative;
        overflow: hidden;
        width: 240px;
        height: 120px;
        top: 0%;
        border-radius: 120px 120px 0px 0px;
        border-bottom: 1px dashed var(--text-base);
      }
      .gauge-b {
        width: 100%;
        height: 30px;
        position: absolute;
        bottom: -30px;
        background-color: var(--bg-base);
        z-index: 4;
        .sunrise,
        .sunset {
          position: absolute;
          &::before {
            content: '';
            width: 16px;
            top: -2px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            height: 3px;
            background-color: white;
            display: block;
          }
        }
        .sunrise {
          left: 0;
          transform: translateX(-50%);
        }
        .sunset {
          right: 0;
          transform: translateX(50%);
        }
      }
      .gauge-c {
        width: 240px;
        height: 120px;
        border-color: #f9ff60;
        border-top: transparent;
        border-width: 1px;
        border-style: dashed;
        border-radius: 0px 0px 200px 200px;
        transform-origin: center top;
        transition: all 1.3s ease-in-out;
        .sun {
          border-radius: 50%;
          bottom: 106px;
          left: -10px;
          width: 20px;
          position: absolute;
          height: 20px;
          background-color: orange;
          box-shadow: 0 0 35px 5px yellow, 0 0 25px 10px yellow inset;
        }
      }
      .moon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
