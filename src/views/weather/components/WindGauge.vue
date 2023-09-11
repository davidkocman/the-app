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
  <div v-if="currentWeatherData" class="wind">
    <div class="title text-overline text-center">Wind</div>
    <div class="gauge">
      <div class="gauge__body">
        <div
          v-if="currentWeatherData.wind.speed"
          class="gauge__fill-a"
          :style="{
            transform: `rotate(${calculateValueFromPercentage(
              parseInt((currentWeatherData.wind.speed * 3.6).toFixed(0), 10),
              200
            )}deg)`
          }"
        ></div>
        <div
          v-if="currentWeatherData.wind.gust"
          class="gauge__fill-b"
          :style="{
            transform: `rotate(${calculateValueFromPercentage(
              parseInt((currentWeatherData.wind.gust * 3.6).toFixed(0), 10),
              200
            )}deg)`
          }"
        ></div>
        <div class="gauge__meter"></div>
        <div class="gauge__cover">
          <h6 v-if="currentWeatherData.wind.speed" class="text-overline">
            speed: {{ (currentWeatherData.wind.speed * 3.6).toFixed(0) }} km/h
          </h6>
          <h6 v-if="currentWeatherData.wind.gust" class="text-overline">
            gusts: {{ (currentWeatherData.wind.gust * 3.6).toFixed(0) }} km/h
          </h6>
        </div>
      </div>
      <div class="min-max">
        <span class="none q-pt-xs">0 km/h</span>
        <span class="full q-pt-xs">200 km/h</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wind {
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
    &__fill-a {
      position: absolute;
      top: 100%;
      left: 0;
      width: inherit;
      height: 100%;
      background: rgb(0, 201, 50);
      background: linear-gradient(180deg, rgba(0, 201, 50, 0.7) 0%, rgba(255, 255, 255, 0) 100%);
      transform-origin: center top;
      transition: transform 1.3s ease-out;
      z-index: 1;
    }
    &__fill-b {
      position: absolute;
      top: 100%;
      left: 0;
      width: inherit;
      height: 100%;
      background: rgb(136, 0, 255);
      background: linear-gradient(180deg, rgba(136, 0, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);
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
      z-index: 1;

      /* Text */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom: 25%;
      box-sizing: border-box;
      h6 {
        line-height: 20px;
      }
    }
  }
}
</style>
