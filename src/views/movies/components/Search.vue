<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useMoviesStore from '@/store/movies'

const moviesStore = useMoviesStore()
const { selected, searchResults, searchFor } = storeToRefs(moviesStore)

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
  searchResults.value = null
  if (inputValue.length < 3) {
    abortFn()
    return
  }
  doneFn(() => {
    moviesStore.search(inputValue.toLowerCase())
  })
}
</script>

<template>
  <div class="search q-my-sm">
    <q-select
      v-model="selected"
      standout
      clearable
      hide-dropdown-icon
      input-debounce="1000"
      label-color="var(--text-base)"
      option-value="value"
      transition-show="fade"
      transition-hide="fade"
      use-input
      :label="searchFor === 'movie' ? 'Search movie' : 'Search TV show'"
      :options="results"
      :option-label="selected?.title ? 'title' : 'name'"
      @filter="filterFn"
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
              {{ new Date(searchFor === 'movie' ? scope.opt.release_date : scope.opt.first_air_date).getFullYear() }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
