<script setup lang="ts">
import { useMoviesStore } from '@/store/movies'
import { storeToRefs } from 'pinia'
import Image from '@/components/Image.vue'

const moviesStore = useMoviesStore()
const { movie } = storeToRefs(moviesStore)
</script>

<template>
  <div class="movie row">
    <div class="col">
      <template v-if="movie !== null">
        <div class="movie__image relative">
          <Image v-if="movie.backdrop_path" :path="movie.backdrop_path" :height="'600px'" />
          <div class="movie__heading absolute q-pa-md">
            <h3 class="movie__title text-h4 text-weight-medium">
              {{ movie.original_title }}
            </h3>
            <p v-if="movie.tagline" class="text-caption q-mb-xs">{{ movie.tagline }}</p>
            <div class="movie__genre">
              <q-chip
                v-for="genre in movie.genres"
                :key="genre.id"
                square
                color="secondary"
                text-color="white"
                class="q-ml-none"
              >
                {{ genre.name }}
              </q-chip>
            </div>
            <p class="text-body1 text-weight-regular q-mb-none">
              {{ movie.overview }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.movie {
  &__image {
    overflow: hidden;
    position: relative;
    &::after {
      background: rgb(0, 0, 0);
      background: linear-gradient(0deg, rgba(36, 36, 36, 0.9) 0%, rgba(36, 36, 36, 0.4) 20%, rgba(0, 0, 0, 0) 60%);
      bottom: 0;
      content: '';
      display: block;
      height: 100%;
      position: absolute;
      width: 100%;
      .body--light & {
        background: rgb(0, 0, 0);
        background: linear-gradient(
          0deg,
          rgba(243, 243, 243, 0.9) 0%,
          rgba(243, 243, 243, 0.4) 20%,
          rgba(0, 0, 0, 0) 60%
        );
      }
    }
  }
  &__heading {
    z-index: 1;
    bottom: 0;
    width: 100%;
    p {
      max-width: 75%;
    }
  }
  &__title {
    text-shadow: 0px 0px 5px var(--bg-base);
  }
}
</style>
