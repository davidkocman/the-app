<script setup lang="ts">
import { storeToRefs } from 'pinia'

// utils
import { calculateValueFromPercentage } from '@/utils/helpers'

// Store
import useWeatherStore from '@/store/weather/'

const weatherStore = useWeatherStore()
const { currentWeatherData } = storeToRefs(weatherStore)
</script>

<template>
  <div v-if="currentWeatherData" class="humidity">
    <div class="title text-overline text-center text-weight-bolder text-primary">Humidity</div>
    <div class="gauge">
      <div class="gauge__body">
        <div
          class="gauge__fill"
          :style="{ transform: `rotate(${calculateValueFromPercentage(currentWeatherData.main.humidity, 180)}deg)` }"
        ></div>
        <div class="gauge__meter"></div>
        <div class="gauge__cover">
          <h3 class="text-h3">{{ currentWeatherData.main.humidity }}%</h3>
        </div>
      </div>
      <div class="min-max">
        <span class="none q-pt-xs">0%</span>
        <span class="full q-pt-xs">100%</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.humidity {
  min-height: 210px;
  position: relative;
  .gauge {
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    bottom: 20px;
    width: 100%;
    max-width: 240px;
    .min-max {
      position: absolute;
      width: 100%;
      bottom: 0;
      .none,
      .full {
        position: absolute;
      }
      .none {
        left: 18px;
        transform: translateX(-50%);
      }
      .full {
        right: 12px;
        transform: translateX(50%);
      }
    }
    &__body {
      width: 100%;
      height: 0;
      padding-bottom: 50%;
      background: var(--bg-base);
      position: relative;
      border-top-left-radius: 100% 200%;
      border-top-right-radius: 100% 200%;
      overflow: hidden;
      border-bottom: 1px solid var(--text-base);
    }
    &__fill {
      position: absolute;
      top: 100%;
      left: 0;
      width: inherit;
      height: 100%;
      background: rgb(0, 114, 187);
      background: linear-gradient(90deg, rgba(0, 114, 187, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
      transform-origin: center top;
      transition: transform 1.3s ease-out;
    }
    &__meter {
      width: 88%;
      height: 175%;
      border-radius: 50%;
      position: absolute;
      top: 12%;
      left: 50%;
      transform: translateX(-50%);
      border: 1px dashed var(--text-base);
    }
    &__cover {
      width: 75%;
      height: 150%;
      background: var(--bg-base);
      border-radius: 50%;
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translateX(-50%);
      color: rgb(0, 114, 187);

      /* Text */
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 25%;
      box-sizing: border-box;
    }
  }
}
</style>
