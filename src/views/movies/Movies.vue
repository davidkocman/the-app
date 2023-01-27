<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoviesStore } from '@/store/movies'

import Movie from '@/views/movies/components/Movie.vue'

const moviesStore = useMoviesStore()
const { selectedMovie, searchResults } = storeToRefs(moviesStore)

const results = computed(() => {
  return searchResults.value?.results
})

watch(selectedMovie, (value) => {
  if (value) moviesStore.getMovieData(value.id)
})

const filterFn = (inputValue: string, doneFn: any, abortFn: any) => {
  if (inputValue.length < 1) {
    abortFn()
    return
  }
  setTimeout(() => {
    doneFn(() => {
      moviesStore.searchMovie(inputValue.toLowerCase())
    })
  }, 500)
}

const keyUpEvent = (target: HTMLElement) => {
  target.blur()
}
</script>

<template>
  <q-page class="page-movies q-px-lg q-py-md">
    <div class="row justify-between items-center q-mb-sm">
      <h6 class="text-h6">Movies</h6>
    </div>
    <q-select
      v-model="moviesStore.selectedMovie"
      standout
      clearable
      hide-dropdown-icon
      input-debounce="300"
      label="Search"
      label-color="var(--text-base)"
      :options="results"
      option-value="value"
      option-label="original_title"
      transition-show="fade"
      transition-hide="fade"
      use-input
      @filter="filterFn"
      @keyup.enter="keyUpEvent($event.target as HTMLElement)"
      class="q-mb-md"
    >
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey">No results</q-item-section>
        </q-item>
      </template>
      <template v-slot:prepend>
        <q-icon color="green-7" name="search"></q-icon>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            {{ scope.opt.title }}
          </q-item-section>
          <q-item-section>
            <q-item-label caption>
              {{ new Date(scope.opt.release_date).getFullYear() }} - {{ scope.opt.popularity }}</q-item-label
            >
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <Movie />
  </q-page>
</template>
