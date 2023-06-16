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
              @update:model-value="currentSlide"
            >
              <q-carousel-slide
                v-for="(item, index) in moviesStore.trendingResultsByPopularityDesc"
                :key="item.id"
                :name="index"
              >
                <Image :path="`${IMAGE_URL}${item.backdrop_path}`" />
              </q-carousel-slide>
            </q-carousel>
            <div v-if="currentSlide" class="trending-item-details">
              <div class="poster">
                <Image :path="`${IMAGE_URL}${currentSlide.poster_path}`" :ratio="2 / 3" :imgClass="'shadow-10'" />
              </div>
              <div class="details column justify-center">
                <h4 class="text-h4 q-mb-sm">{{ currentSlide.title }}</h4>
                <h5 class="text-subtitle2 text-weight-regular q-mb-sm">
                  User score:
                  <span class="text-subtitle1 text-weight-bold">{{ currentSlide.vote_average.toFixed(1) }}</span>
                  &nbsp;
                  <span class="text-subtitle1 text-weight-bold">({{ currentSlide.vote_count }})</span>
                </h5>
                <h5 class="text-body2">{{ currentSlide.overview }}</h5>
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
      grid-template-columns: 1fr 300px;
      gap: 16px;
    }
    &__main {
      width: 100%;
      .slider {
        height: max-content;
        max-width: 1000px;
        position: relative;
        .q-carousel {
          &__slide {
            padding: 0;
          }
        }
        .trending-item-details {
          display: block;
          padding: 16px 0;
          @media (min-width: $breakpoint-md-min) {
            background: rgb(29, 29, 29);
            background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 0) 100%);
            bottom: 0;
            display: grid;
            grid-template-columns: 150px auto;
            padding: 16px;
            position: absolute;
            width: 100%;
            z-index: 1;
            .body--light & {
              background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
            }
          }
          .details {
            padding: 0;
            @media (min-width: $breakpoint-md-min) {
              padding: 0 16px;
            }
          }
          .poster {
            display: none;
            max-width: 150px;
            @media (min-width: $breakpoint-md-min) {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
