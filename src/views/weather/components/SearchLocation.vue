<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import useWeatherStore from '@/store/weather/'

import type { SearchResult } from '@/types/weather'

const weatherStore = useWeatherStore()

const model = ref<SearchResult | null>(null)
const options = computed(() => weatherStore.searchResults)

const filterFn = (inputValue: string, doneFn: any, abortFn: any): void => {
  if (inputValue.length < 1) {
    abortFn()
    return
  }
  setTimeout(() => {
    doneFn(() => {
      const needle = inputValue.toLowerCase()
      weatherStore.getLocation(needle)
    })
  }, 1000)
}

const keyUpEvent = (target: HTMLElement) => {
  target.blur()
}

watch(model, (value) => {
  if (value) {
    weatherStore.activeLocation = value.name
    weatherStore.activeRegion = value.state
    weatherStore.coordinates.lat = value.lat
    weatherStore.coordinates.lon = value.lon
    weatherStore.getWeatherData()
  }
})
</script>

<template>
  <div class="row q-mx-auto q-mb-lg q-px-md search-location">
    <div class="col">
      <q-select
        v-model="model"
        standout
        clearable
        hide-dropdown-icon
        input-debounce="300"
        label="Search"
        label-color="var(--text-base)"
        :options="options"
        :option-label="(item: SearchResult | null) => (item === null ? '' : `${item.name} - (${item.state})`)"
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
      </q-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-location {
  border-radius: 8px;
  max-width: 420px;
  color: var(--text-base);
}
</style>
