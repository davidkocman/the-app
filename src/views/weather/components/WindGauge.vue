<script setup lang="ts">
import { storeToRefs } from 'pinia'

// Store
import useWeatherStore from '@/store/weather/'

const weatherStore = useWeatherStore()
const { currentWeatherData } = storeToRefs(weatherStore)
</script>

<template>
  <div v-if="currentWeatherData" class="wind">
    <div class="title text-overline text-center text-weight-bolder text-primary">Wind</div>
    <div class="wrapper">
      <div class="wind__direction q-mt-md q-mx-auto row flex-center">
        <div class="data text-center">
          <h5 v-if="currentWeatherData.wind.speed" class="text-h4 text-weight-medium">
            {{ (currentWeatherData.wind.speed * 3.6).toFixed(0) }}
            <span class="text-caption text-weight-light">km/h</span>
          </h5>
          <h6 v-if="currentWeatherData.wind.gust" class="text-h6">
            <span class="text-caption">gust:</span> {{ (currentWeatherData.wind.gust * 3.6).toFixed(0) }}
            <span class="text-caption text-weight-light">km/h</span>
          </h6>
        </div>
        <div class="needle-holder" :style="{ transform: `rotate(${360 - currentWeatherData.wind.deg}deg)` }">
          <div class="arrow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wind {
  min-height: 210px;
  &__direction {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 2px solid var(--wind-direction);
    position: relative;
    &::after {
      content: 'N';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .needle-holder {
      position: absolute;
      width: 100%;
      height: 0;
      transition: all 1.3s ease-in-out;
      .arrow {
        position: absolute;
        left: -14px;
        width: 10px;
        height: 10px;
        display: block;
        border-top: 2px solid var(--wind-direction-needle);
        border-right: 2px solid var(--wind-direction-needle);
        transform: rotate(45deg);
        &::after {
          content: '';
          position: absolute;
          display: block;
          right: -3px;
          top: 3px;
          width: 14px;
          height: 2px;
          background-color: var(--wind-direction-needle);
          transform: rotate(135deg);
        }
      }
    }
  }
}
</style>
