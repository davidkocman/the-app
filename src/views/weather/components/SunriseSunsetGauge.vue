<script setup lang="ts">
import { storeToRefs } from 'pinia'

// utils
import { timeFromUnix, sunProgress, calculateValueFromPercentage } from '@/utils/helpers'

// Store
import useWeatherStore from '@/store/weather/'

const weatherStore = useWeatherStore()
const { currentWeatherData } = storeToRefs(weatherStore)
</script>

<template>
  <div v-if="currentWeatherData" class="sunrise-sunset">
    <div class="title text-overline text-center text-weight-bolder text-primary">Sunrise & sunset</div>
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
        v-if="sunProgress(currentWeatherData.sys.sunrise, currentWeatherData.sys.sunset, currentWeatherData.timezone)"
        class="gauge-c"
        :style="{
          transform: `rotate(${calculateValueFromPercentage(
            sunProgress(currentWeatherData.sys.sunrise, currentWeatherData.sys.sunset, currentWeatherData.timezone) ||
              0,
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
</template>

<style lang="scss" scoped>
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
          background-color: var(--text-base);
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
      border-color: var(--sun);
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
        background-color: var(--sun);
        box-shadow: 0 0 35px 5px var(--sun), 0 0 25px 10px var(--sun) inset;
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
</style>
