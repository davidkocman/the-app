<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useMoviesStore from '@/store/movies'
import Image from '@/components/Image.vue'
import Reviews from '@/views/movies/components/Reviews.vue'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const moviesStore = useMoviesStore()
const { movie } = storeToRefs(moviesStore)

const movieTabs = ref('reviews')

const userRating = computed(() => (movie.value ? Math.floor((movie.value.vote_average / 10) * 100) : undefined))
const director = computed(() =>
  movie.value?.credits.crew.filter((member) => member.known_for_department === 'Directing').map((member) => member.name)
)
const story = computed(() =>
  movie.value?.credits.crew.filter((member) => member.known_for_department === 'Writing').map((member) => member.name)
)
const sound = computed(() =>
  movie.value?.credits.crew.filter((member) => member.known_for_department === 'Sound').map((member) => member.name)
)
</script>

<template>
  <div class="movie">
    <template v-if="movie !== null">
      <div class="movie__wrapper" :style="`background-image: url(${IMAGE_URL + movie.backdrop_path})`">
        <div class="movie__overlay q-mx-auto">
          <div class="row">
            <div class="movie__poster col-12 col-md-4 q-pa-lg">
              <Image
                v-if="movie.poster_path"
                :path="movie.poster_path"
                :imgClass="'poster-image shadow-box shadow-6'"
                :ratio="2 / 3"
              />
            </div>
            <div class="movie__heading col-12 col-md-8 q-pa-lg">
              <h3 class="movie__title text-h4 text-weight-medium q-mb-sm">
                <template v-if="movie.homepage">
                  <a :href="movie.homepage" target="_blank" class="movie__homepage">
                    {{ movie.original_title }}
                  </a>
                </template>
                <template v-else>
                  {{ movie.original_title }}
                </template>
                <span class="year text-subtitle1 text-weight-regular">
                  ({{ new Date(movie.release_date).getFullYear() }})</span
                >
              </h3>
              <p v-if="movie.tagline" class="text-caption text-italic q-mb-sm">{{ movie.tagline }}</p>
              <div class="movie__genre q-mb-sm">
                <q-chip
                  v-for="genre in movie.genres"
                  :key="genre.id"
                  square
                  color="primary"
                  text-color="white"
                  class="q-ml-none"
                >
                  {{ genre.name }}
                </q-chip>
              </div>
              <div class="row movie__rating q-mb-sm">
                <div class="col">
                  <h3 class="text-subtitle2 text-weight-regular">
                    User score: <span class="text-subtitle1 text-weight-bold">{{ userRating }}%</span>
                    <span class="text-subtitle1 text-weight-bold"> ({{ movie.vote_count }})</span>
                  </h3>
                </div>
              </div>
              <p class="text-body1 text-italic text-weight-regular q-mb-md">
                {{ movie.overview }}
              </p>
              <div class="movie__crew row">
                <div v-if="director?.length" class="col director">
                  <span class="text-caption">Director</span>
                  <h3 class="text-subtitle2">{{ director[0] }}</h3>
                </div>
                <div v-if="story?.length" class="col story">
                  <span class="text-caption">Story</span>
                  <h3 class="text-subtitle2">{{ story[0] }}</h3>
                </div>
                <div v-if="sound?.length" class="col sound">
                  <span class="text-caption">Sound</span>
                  <h3 class="text-subtitle2">{{ sound[0] }}</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="movie__casts q-py-lg">
            <div class="wrapper flex justify-center text-center">
              <div v-for="cast in movie.credits.cast.slice(0, 6)" :key="cast.id" class="cast">
                <Image
                  v-if="cast.profile_path"
                  :imgClass="'cast-image shadow-box shadow-4 q-mb-sm rounded-borders'"
                  :path="cast.profile_path"
                  :ratio="2 / 3"
                />
                <h3 class="text-subtitle2">{{ cast.name }}</h3>
                <h4 class="text-body2">({{ cast.character }})</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-tabs
        v-model="movieTabs"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        class="q-mt-md"
      >
        <q-tab v-if="movie.reviews?.results.length" name="reviews" label="Reviews" />
      </q-tabs>
      <q-separator />
      <q-tab-panels
        v-model="movieTabs"
        keep-alive
        animated
        transition-next="fade"
        transition-prev="fade"
        class="movie__tabs"
      >
        <q-tab-panel name="reviews" class="reviews-show-tab q-pa-none">
          <Reviews :reviews="movie.reviews" />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.movie {
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
    max-width: 1200px;
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
  &__title {
    .year {
      color: var(--text-muted);
    }
  }
  &__poster {
    display: flex;
    justify-content: center;
    .poster-image {
      width: 300px;
      border-radius: 12px;
    }
  }
  &__rating {
    span {
      color: var(--text-base);
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
  &__crew {
    span {
      color: var(--text-base);
    }
  }
}
</style>
