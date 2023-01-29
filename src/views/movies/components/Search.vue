<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoviesStore } from '@/store/movies'

const moviesStore = useMoviesStore()
const { selectedMovie, searchResults } = storeToRefs(moviesStore)

const searchTimeout = ref()
const results = computed(() => {
  return searchResults.value?.results
})

watch(selectedMovie, (value) => {
  if (value) moviesStore.getMovieData(value.id)
})

const filterFn = (inputValue: string, doneFn: any, abortFn: any) => {
  clearTimeout(searchTimeout.value)
  searchResults.value = null
  if (inputValue.length < 3) {
    abortFn()
    return
  }
  searchTimeout.value = setTimeout(() => {
    doneFn(() => {
      moviesStore.searchMovie(inputValue.toLowerCase())
    })
  }, 1000)
}

const keyUpEvent = (target: HTMLElement) => {
  target.blur()
}
</script>

<template>
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
</template>
