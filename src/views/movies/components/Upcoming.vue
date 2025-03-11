<script setup lang="ts">
import useMoviesStore from '@/store/movies'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const moviesStore = useMoviesStore()
</script>

<template>
  <div class="upcoming-heading q-mb-sm">
    <h2 class="text-h6">Upcoming</h2>
  </div>
  <template v-if="!moviesStore.upcomingResultsWithPoster">
    <div class="skeleton-items">
      <div v-for="(_n, index) of 6" :key="index" class="upcoming-skeleton q-mb-sm">
        <q-skeleton height="240px" width="100%" square />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="upcoming-items">
      <div
        v-for="(item, index) in moviesStore.upcomingResultsWithPoster.slice(0, 6)"
        :key="index"
        class="upcoming-item shadow-6 q-pa-md"
        :style="`background-image: url(${IMAGE_URL}${item.backdrop_path})`"
        @click.prevent="moviesStore.getMovieData(item.id)"
      >
        <div class="upcoming-item__info q-pa-md">
          <h3 class="text-subtitle2 q-mb-xs">
            {{ item.title }} <span class="text-caption">({{ item.popularity.toFixed(1) }})</span>
          </h3>
          <h5 class="text-caption">{{ new Date(item.release_date).toLocaleDateString('sk') }}</h5>
        </div>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.upcoming-skeleton,
.upcoming-item {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  cursor: pointer;
  height: 240px;
  position: relative;
  overflow: hidden;
  &__info {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    bottom: 0;
    left: 0;
    width: 100%;
    .body--light & {
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
}
.skeleton-items,
.upcoming-items {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  @media (min-width: $breakpoint-sm-min) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
