<script setup lang="ts">
import useMoviesStore from '@/store/movies'
import Image from '@/components/Image.vue'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const moviesStore = useMoviesStore()
</script>

<template>
  <div class="upcoming-heading q-mb-sm">
    <h2 class="text-h6">Upcoming</h2>
  </div>
  <template v-if="!moviesStore.upcomingResultsWithPoster">
    <div v-for="(n, index) of 6" :key="index" class="upcoming-skeleton q-mb-sm">
      <q-skeleton height="150px" width="100%" square />
      <div>
        <q-skeleton type="text" class="text-subtitle1" />
        <q-skeleton type="text" class="text-caption" />
        <q-skeleton type="text" class="text-caption" />
        <q-skeleton type="text" class="text-caption" />
      </div>
    </div>
  </template>
  <template v-else>
    <div v-for="(item, index) in moviesStore.upcomingResultsWithPoster" :key="index" class="upcoming-item q-mb-sm">
      <div class="upcoming-item__image">
        <Image :path="`${IMAGE_URL}${item.poster_path}`" :ratio="2 / 3" :imgClass="'shadow-10'" />
      </div>
      <div class="upcoming-item__info">
        <h3 class="text-subtitle2 q-mb-xs">
          {{ item.title }} <span class="text-caption">({{ item.popularity.toFixed(1) }})</span>
        </h3>
        <h4 class="overview text-body2 q-mb-xs">{{ item.overview }}</h4>
        <h5 class="text-caption">{{ new Date(item.release_date).toLocaleDateString('sk') }}</h5>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.upcoming-skeleton,
.upcoming-item {
  display: grid;
  grid-template-columns: 100px auto;
  gap: 16px;
  &__info {
    .overview {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>
