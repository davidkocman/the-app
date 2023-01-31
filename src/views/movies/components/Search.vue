<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoviesStore } from '@/store/movies'

const moviesStore = useMoviesStore()
const { selected, searchResults, searchFor } = storeToRefs(moviesStore)

const searchTimeout = ref()
const results = computed(() => {
  return searchResults.value?.results
})

watch(selected, (value) => {
  if (value) {
    if (searchFor.value === 'movie') moviesStore.getMovieData(value.id)
    if (searchFor.value === 'tv') moviesStore.getTvShowData(value.id)
  }
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
      moviesStore.search(inputValue.toLowerCase())
    })
  }, 1000)
}

const keyUpEvent = (target: HTMLElement) => {
  target.blur()
}
</script>

<template>
  <div class="search">
    <q-select
      v-model="selected"
      standout
      clearable
      hide-dropdown-icon
      input-debounce="300"
      label="Search"
      label-color="var(--text-base)"
      :options="results"
      option-value="value"
      :option-label="selected?.title ? 'title' : 'name'"
      transition-show="fade"
      transition-hide="fade"
      use-input
      @filter="filterFn"
      @keyup.enter="keyUpEvent($event.target as HTMLElement)"
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
            {{ searchFor === 'movie' ? scope.opt.title : scope.opt.name }}
          </q-item-section>
          <q-item-section>
            <q-item-label caption>
              {{ new Date(searchFor === 'movie' ? scope.opt.release_date : scope.opt.first_air_date).getFullYear() }} -
              {{ scope.opt.popularity }}</q-item-label
            >
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <div class="row">
      <div class="col-1">
        <q-radio v-model="searchFor" val="movie" label="Movies" />
      </div>
      <div class="col-1">
        <q-radio v-model="searchFor" val="tv" label="TV Shows" />
      </div>
    </div>
  </div>
</template>
