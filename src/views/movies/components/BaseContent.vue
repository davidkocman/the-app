<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import useMoviesStore from '@/store/movies'
import Image from '@/components/Image.vue'
import Upcoming from './Upcoming.vue'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const moviesStore = useMoviesStore()
const slide = ref(1)

const currentSlide = computed(() => {
  return moviesStore.trendingResultsByPopularityDesc ? moviesStore.trendingResultsByPopularityDesc[slide.value] : null
})

onBeforeMount(async () => {
  if (moviesStore.trending) return
  moviesStore.getTrending()
  moviesStore.getUpcoming()
})
</script>

<template>
  <div class="base-content q-mb-lg">
    <div class="section__wrapper">
      <section class="section__main">
        <h2 class="text-h6 q-mb-sm">Trending</h2>
        <div class="slider">
          <template v-if="moviesStore.trendingResultsByPopularityDesc?.length">
            <q-carousel
              animated
              v-model="slide"
              :autoplay="10000"
              transition-duration="1000"
              infinite
              arrows
              height="auto"
              class="shadow-10"
            >
              <q-carousel-slide
                v-for="(item, index) in moviesStore.trendingResultsByPopularityDesc"
                :key="item.id"
                :name="index"
                @click="moviesStore.getMovieData(item.id)"
              >
                <Image :path="`${IMAGE_URL}${item.backdrop_path}`" />
              </q-carousel-slide>
            </q-carousel>
            <div v-if="currentSlide" class="trending-item-details">
              <div class="poster">
                <Image :path="`${IMAGE_URL}${currentSlide.poster_path}`" :ratio="2 / 3" :imgClass="'shadow-10'" />
              </div>
              <div class="details column justify-center">
                <h4 class="title text-h4 q-mb-sm">{{ currentSlide.title }}</h4>
                <h5 class="user-score text-subtitle2 text-weight-regular q-mb-sm">
                  User score:
                  <span class="text-subtitle1 text-weight-bold">{{ currentSlide.vote_average.toFixed(1) }}</span>
                  &nbsp;
                  <span class="text-subtitle1 text-weight-bold">({{ currentSlide.vote_count }})</span>
                </h5>
                <h5 class="text-body2 overview">{{ currentSlide.overview }}</h5>
              </div>
            </div>
          </template>
          <template v-else>
            <q-skeleton type="QSlider" height="450px" />
          </template>
        </div>
      </section>
      <section class="section__aside">
        <Upcoming />
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-content {
  .section {
    &__wrapper {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      @media (min-width: $breakpoint-md-min) {
        grid-template-columns: 1fr 1fr;
      }
    }
    &__main {
      width: 100%;
      .slider {
        height: max-content;
        max-width: 1000px;
        position: relative;
        .q-carousel {
          &__slide {
            cursor: pointer;
            padding: 0;
          }
        }
        .trending-item-details {
          background: rgb(29, 29, 29);
          background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 0) 100%);
          backdrop-filter: blur(2px);
          bottom: 0;
          display: grid;
          grid-template-columns: auto;
          padding: 16px;
          position: absolute;
          width: 100%;
          z-index: 1;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          pointer-events: none;
          @media (min-width: $breakpoint-lg-min) {
            grid-template-columns: 120px auto;
          }
          .body--light & {
            background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
          }
          .details {
            padding: 0;
            @media (min-width: $breakpoint-lg-min) {
              padding: 0 16px;
            }
            .title {
              font-size: 16px;
              line-height: 24px;
              @media (min-width: $breakpoint-md-min) {
                font-size: 24px;
                line-height: 32px;
              }
              @media (min-width: $breakpoint-lg-min) {
                font-size: 34px;
                line-height: 48px;
              }
            }
            .user-score {
              display: none;
              @media (min-width: $breakpoint-sm-min) {
                display: block;
              }
            }
            .overview {
              display: none;
              @media (min-width: $breakpoint-lg-min) {
                display: block;
              }
            }
          }
          .poster {
            display: none;
            max-width: 120px;
            @media (min-width: $breakpoint-lg-min) {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
