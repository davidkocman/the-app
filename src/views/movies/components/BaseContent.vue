<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import useMoviesStore from '@/store/movies'
import Image from '@/components/Image.vue'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const moviesStore = useMoviesStore()
const slide = ref(1)

onBeforeMount(async () => {
  if (moviesStore.nowPlaying) return
  moviesStore.getNowPlaying()
  moviesStore.getUpcoming()
})
</script>

<template>
  <div class="baseContent q-mb-lg">
    <section class="section__top row">
      <div class="slider">
        <template v-if="moviesStore.nowPlayingResultsByPopularityDesc?.length">
          <q-carousel animated v-model="slide" :autoplay="10000" transition-duration="4000" infinite height="auto">
            <q-carousel-slide
              v-for="(item, index) in moviesStore.nowPlayingResultsByPopularityDesc"
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
        .q-carousel {
          &__slide {
            padding: 0;
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
