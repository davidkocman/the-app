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
          <div class="movie__overlay absolute">
            <div class="movie__poster">
              <Image
                v-if="movie.poster_path"
                :path="movie.poster_path"
                :imgClass="'poster-image shadow-box shadow-5'"
              />
            </div>
            <div class="movie__heading q-pa-md">
              <h3 class="movie__title text-h4 text-weight-medium">
                {{ movie.original_title }}
              </h3>
              <p v-if="movie.tagline" class="text-caption text-italic q-mb-xs">{{ movie.tagline }}</p>
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
      background: linear-gradient(270deg, rgba(36, 36, 36, 1) 0%, rgba(36, 36, 36, 0.6) 80%, rgba(0, 0, 0, 0) 100%);
      bottom: 0;
      left: 0;
      content: '';
      display: block;
      height: 100%;
      position: absolute;
      width: 100%;
      .body--light & {
        background: rgb(0, 0, 0);
        background: linear-gradient(
          270deg,
          rgba(243, 243, 243, 1) 0%,
          rgba(243, 243, 243, 0.6) 80%,
          rgba(0, 0, 0, 0) 100%
        );
      }
    }
  }
  &__overlay {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 16px;
  }
  &__heading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      max-width: 75%;
    }
  }
  &__poster {
    display: flex;
    align-items: center;
    justify-content: center;
    .poster-image {
      max-width: 300px;
      border-radius: 12px;
    }
  }
}
</style>
