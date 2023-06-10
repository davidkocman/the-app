<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import useMoviesStore from '@/store/movies'
import Image from '@/components/Image.vue'

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
  <div class="baseContent q-mb-lg">
    <section class="section__top row">
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
              <div class="absolute-bottom custom-caption">
                <h6 class="text-h6">{{ item.title }}</h6>
                <!-- <h6 class="text-subtitle1">{{ item.vote_average }}</h6> -->
              </div>
            </q-carousel-slide>
          </q-carousel>
          <section class="trendingItemDetails q-pa-md">
            <div v-if="currentSlide" class="poster">
              <Image :path="`${IMAGE_URL}${currentSlide.poster_path}`" :ratio="2 / 3" :imgClass="'shadow-10'" />
            </div>
            <div class="details"></div>
          </section>
        </template>
        <template v-else>
          <q-skeleton type="QSlider" height="450px" />
        </template>
      </div>
      <div></div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.baseContent {
  .section {
    &__top {
      display: grid;
      grid-template-columns: 1fr auto;
      .slider {
        max-width: 1000px;
        position: relative;
        .q-carousel {
          &__slide {
            padding: 0;
          }
        }
        .trendingItemDetails {
          display: grid;
          grid-template-columns: 1fr auto;
          position: absolute;
          z-index: 1;
          width: 100%;
          bottom: 0;
          .poster {
            max-width: 150px;
          }
        }
      }
    }
  }
  .custom-caption {
    text-align: center;
    padding: 12px;
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
</style>
