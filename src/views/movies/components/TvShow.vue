<script setup lang="ts">
import { computed } from 'vue'
import { useMoviesStore } from '@/store/movies'
import { storeToRefs } from 'pinia'
import Image from '@/components/Image.vue'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const moviesStore = useMoviesStore()
const { tvShow } = storeToRefs(moviesStore)

const userRating = computed(() => (tvShow.value ? Math.floor((tvShow.value.vote_average / 10) * 100) : undefined))
</script>

<template>
  <div class="tv-show row">
    <div class="col">
      <template v-if="tvShow !== null">
        <div class="tv-show__wrapper" :style="`background-image: url(${IMAGE_URL + tvShow.backdrop_path})`">
          <div class="tv-show__overlay">
            <div class="row">
              <div class="tv-show__poster col-12 col-md-4 q-pa-lg">
                <Image
                  v-if="tvShow.poster_path"
                  :path="tvShow.poster_path"
                  :imgClass="'poster-image shadow-box shadow-5'"
                />
              </div>
              <div class="tv-show__heading col-12 col-md-8 q-pa-lg">
                <h3 class="tv-show__title text-h4 text-weight-medium">
                  {{ tvShow.original_name }}
                  <span class="text-weight-regular text-grey-2"
                    >({{ new Date(tvShow.first_air_date).getFullYear() }})</span
                  >
                </h3>
                <p v-if="tvShow.tagline" class="text-caption text-italic q-mb-xs">{{ tvShow.tagline }}</p>
                <div class="tv-show__genre q-mb-md">
                  <q-chip
                    v-for="genre in tvShow.genres"
                    :key="genre.id"
                    square
                    color="secondary"
                    text-color="white"
                    class="q-ml-none"
                  >
                    {{ genre.name }}
                  </q-chip>
                </div>
                <p class="text-body1 text-weight-regular q-mb-md">
                  {{ tvShow.overview }}
                </p>
                <div class="tv-show__rating">
                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="userRating"
                    size="50px"
                    :thickness="0.22"
                    color="primary"
                    track-color="grey-3"
                  >
                    {{ userRating }}%
                  </q-circular-progress>
                </div>
              </div>
            </div>
            <div class="tv-show__casts q-py-lg">
              <div class="wrapper flex justify-center text-center">
                <div v-for="cast in tvShow.credits.cast.slice(0, 6)" :key="cast.id" class="cast">
                  <Image
                    v-if="cast.profile_path"
                    :imgClass="'cast-image shadow-box shadow-5 q-mb-sm rounded-borders'"
                    :path="cast.profile_path"
                  />
                  <h3 class="text-subtitle2">{{ cast.name }}</h3>
                  <h4 class="text-body2">({{ cast.character }})</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tv-show {
  &__wrapper {
    overflow: hidden;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
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
    position: inherit;
    z-index: 1;
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
    justify-content: center;
    .poster-image {
      max-width: 300px;
      border-radius: 12px;
    }
  }
  &__casts {
    .wrapper {
      gap: 16px;
      .cast {
        width: 140px;
      }
      .cast-image {
        max-width: 100%;
        height: auto;
      }
    }
  }
}
</style>
