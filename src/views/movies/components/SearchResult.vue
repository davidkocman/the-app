<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useMoviesStore from '@/store/movies'
import Image from '@/components/Image.vue'
import Seasons from '@/views/movies/components/Seasons.vue'
import Reviews from '@/views/movies/components/Reviews.vue'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const moviesStore = useMoviesStore()
const { searchResult, searchResultType } = storeToRefs(moviesStore)

const tabs = ref<'seasons' | 'reviews'>('seasons')

const userRating = computed(() =>
  searchResult.value ? Math.floor((searchResult.value.vote_average / 10) * 100) : undefined
)
const director = computed(() =>
  searchResult.value?.credits.crew
    .filter((member) => member.known_for_department === 'Directing')
    .map((member) => member.name)
)
const sound = computed(() =>
  searchResult.value?.credits.crew
    .filter((member) => member.known_for_department === 'Sound')
    .map((member) => member.name)
)
const story = computed(() =>
  searchResult.value?.credits.crew
    .filter((member) => member.known_for_department === 'Writing')
    .map((member) => member.name)
)
const searchResultTitle = computed(() => {
  if (searchResult.value) {
    if (searchResultType.value === 'tv') return searchResult.value.original_name
    return searchResult.value.original_title
  }
  return null
})
</script>

<template>
  <div class="searchResult row q-mb-lg">
    <q-btn color="primary" label="Close" class="close-search-resault absolute" @click="searchResult = null" />
    <div class="col">
      <template v-if="searchResult !== null">
        <div class="searchResult__wrapper" :style="`background-image: url(${IMAGE_URL + searchResult.backdrop_path})`">
          <div class="searchResult__overlay q-mx-auto">
            <div class="row">
              <div class="searchResult__poster col-12 col-md-4 q-pa-lg">
                <Image
                  v-if="searchResult.poster_path"
                  :path="`${IMAGE_URL}${searchResult.poster_path}`"
                  :imgClass="'poster-image shadow-box shadow-6'"
                  :ratio="2 / 3"
                />
              </div>
              <div class="searchResult__heading col-12 col-md-8 q-pa-lg">
                <h3 class="searchResult__title text-h4 text-weight-medium q-mb-sm">
                  <template v-if="!!searchResult.homepage">
                    <a :href="searchResult.homepage" target="_blank" class="movie__homepage">
                      {{ searchResultTitle }}
                    </a>
                  </template>
                  <template v-else>
                    {{ searchResultTitle }}
                  </template>
                  <span class="year text-subtitle1 text-weight-regular">
                    <template v-if="searchResultType === 'tv'">
                      ({{ new Date(searchResult.first_air_date).getFullYear() }})
                    </template>
                    <template v-else> ({{ new Date(searchResult.release_date).getFullYear() }}) </template>
                  </span>
                  <template v-if="searchResult.networks?.length">
                    <q-chip
                      v-for="network in searchResult.networks"
                      :key="network.id"
                      color="primary"
                      text-color="white"
                      square
                      class="network"
                      >{{ network.name }}</q-chip
                    >
                  </template>
                </h3>
                <p v-if="searchResult.tagline" class="text-caption text-italic q-mb-xs">{{ searchResult.tagline }}</p>
                <div class="searchResult__genre q-mb-sm">
                  <q-chip
                    v-for="genre in searchResult.genres"
                    :key="genre.id"
                    square
                    color="secondary"
                    text-color="white"
                    class="q-ml-none"
                  >
                    {{ genre.name }}
                  </q-chip>
                </div>
                <div class="searchResult__rating row q-mb-sm">
                  <div class="col">
                    <h3 class="text-subtitle2 text-weight-regular">
                      User score: <span class="text-subtitle1 text-weight-bold">{{ userRating }}%</span>
                      <span class="text-subtitle1 text-weight-bold"> ({{ searchResult.vote_count }})</span>
                    </h3>
                  </div>
                </div>
                <p class="text-body1 text-italic text-weight-regular q-mb-md">
                  {{ searchResult.overview }}
                </p>
                <div class="searchResult__crew row">
                  <div v-if="searchResultType === 'movie' && director?.length" class="col director">
                    <span class="text-caption">Director</span>
                    <h3 class="text-subtitle2">{{ director[0] }}</h3>
                  </div>
                  <div v-if="story?.length" class="col story">
                    <span class="text-caption">Story</span>
                    <h3 class="text-subtitle2">{{ story[0] }}</h3>
                  </div>
                  <div v-if="searchResultType === 'movie' && sound?.length" class="col sound">
                    <span class="text-caption">Sound</span>
                    <h3 class="text-subtitle2">{{ sound[0] }}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="searchResult__casts q-py-lg">
              <div class="wrapper flex justify-center text-center">
                <div v-for="cast in searchResult.credits.cast.slice(0, 6)" :key="cast.id" class="cast">
                  <Image
                    v-if="cast.profile_path"
                    :imgClass="'cast-image shadow-box shadow-4 q-mb-sm rounded-borders'"
                    :path="`${IMAGE_URL}${cast.profile_path}`"
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
          v-model="tabs"
          dense
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          class="q-mt-md"
        >
          <q-tab v-if="searchResultType === 'tv' && searchResult.seasons?.length" name="seasons" label="Seasons" />
          <q-tab v-if="searchResult.reviews" name="reviews" label="Reviews" />
        </q-tabs>
        <q-separator />
        <q-tab-panels
          v-model="tabs"
          keep-alive
          animated
          transition-next="fade"
          transition-prev="fade"
          class="tv-show__tabs"
        >
          <q-tab-panel
            v-if="searchResultType === 'tv' && searchResult.seasons?.length"
            name="seasons"
            class="seasons-tab q-pa-none"
          >
            <Seasons :seasons="searchResult.seasons" :id="searchResult.id" />
          </q-tab-panel>
          <q-tab-panel v-if="searchResult.reviews" name="reviews" class="reviews-show-tab q-pa-none">
            <Reviews :reviews="searchResult.reviews" />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.searchResult {
  .close-search-resault {
    top: 64px;
    right: 32px;
    z-index: 2;
  }
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
  &__tabs {
    background-color: transparent;
  }
}
</style>
