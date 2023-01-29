<script setup lang="ts">
import { useMoviesStore } from '@/store/movies'
import Image from '@/components/Image.vue'

const moviesStore = useMoviesStore()
</script>

<template>
  <div class="movie row">
    <div class="col">
      <template v-if="moviesStore.movie !== null">
        <div class="movie__image relative">
          <Image v-if="moviesStore.movie?.backdrop_path" :path="moviesStore.movie?.backdrop_path" />
          <div class="movie__heading absolute q-pa-md">
            <h3 class="text-h4 text-weight-medium q-mb-md">{{ moviesStore.movie?.title }}</h3>
            <p class="text-body1 text-weight-regular q-mb-none">
              {{ moviesStore.movie?.overview }}
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
    height: 500px;
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
}
</style>
