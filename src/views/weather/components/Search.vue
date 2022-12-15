<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWeatherStore } from '@/store/weather'
import { Model } from '@/types/weather'
import cities from '@/assets/cities/sk.json'

const weatherStore = useWeatherStore()
const options = ref(cities)
const model = ref<Model>()

const filterFn = (inputValue: string, doneFn: any, abortFn: any): void => {
  if (inputValue.length < 1) {
    abortFn()
    return
  }
  setTimeout(() => {
    doneFn(() => {
      const needle = inputValue.toLowerCase()
      options.value = cities.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    })
  }, 300)
}

const keyUpEvent = (target: HTMLElement) => {
  target.blur()
}

watch(model, (value) => {
  if (value) {
    weatherStore.activeLocation = value.label
    weatherStore.activeRegion = value.admin_name
    weatherStore.coordinates = [value.lat, value.lng]
    weatherStore.getWeatherData(value.lat, value.lng)
  }
})
</script>

<template>
  <div class="relative-position q-mx-auto q-px-md search-location">
    <div>
      <q-select
        v-model="model"
        standout
        clearable
        hide-dropdown-icon
        input-debounce="300"
        label="Search"
        label-color="var(--text-base)"
        :options="options"
        option-value="value"
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
  top: 16px;
  max-width: 80%;
  color: var(--text-base);
}
</style>
