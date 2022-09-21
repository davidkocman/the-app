<script setup lang="ts">
import { watch } from 'vue'
import useWeatherData from '@/composables/weather/useWeatherData'

const emit = defineEmits(['weatherData', 'activeLocation', 'activeRegion', 'coordinates'])
const { options, model, filterFn, getWeatherData, weatherData } = useWeatherData()

watch(model, (value): void => {
  if (value) {
    emit('activeLocation', value.label)
    emit('activeRegion', value.admin_name)
    emit('coordinates', [value.lat, value.lng])
    getWeatherData(value)
  }
})
watch(weatherData, (value): void => {
  emit('weatherData', value)
})
</script>

<template>
  <div class="relative-position q-mx-auto q-px-md search-location">
    <div>
      <q-select v-model="model" standout clearable hide-dropdown-icon input-debounce="300" label="Search"
        label-color="var(--text-base)" :options="options" option-value="value" transition-show="fade"
        transition-hide="fade" use-input @filter="filterFn" @keyup.enter="($event.target as HTMLElement).blur()">
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
