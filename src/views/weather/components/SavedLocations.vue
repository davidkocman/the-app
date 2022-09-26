<script setup lang="ts">
import { ref, watch } from 'vue'
import useSavedLocations from '@/composables/weather/useSavedLocations'
import useWeatherData from '@/composables/weather/useWeatherData'
import TSavedLocation from '@/types/weather/TSavedLocation'

type positionType = 'top' | 'right' | 'standard' | 'bottom' | 'left' | undefined
const emit = defineEmits(['weatherData', 'activeLocation', 'activeRegion', 'coordinates'])

const { hasSavedLocations, savedLocations, removeSavedLocation } = useSavedLocations()
const { getSavedLocationWeatherData, weatherData } = useWeatherData()

const dialog = ref<boolean>(false)
const position = ref<positionType>('top')

// A function that is called when the button is clicked. It sets the position of the dialog and sets
// the dialog to true.
const open = (pos: positionType) => {
  position.value = pos
  dialog.value = true
}
const updateRegion = (location: TSavedLocation): void => {
  emit('activeLocation', location.title)
  emit('activeRegion', location.region)
  emit('coordinates', [location.lat, location.lng])
  dialog.value = false
}

watch(weatherData, (value): void => {
  emit('weatherData', value)
})
</script>

<template>
  <q-btn v-if="hasSavedLocations" icon="star_rate" color="primary" size="16px" flat dense @click="open('right')">
    <q-tooltip>Saved locations</q-tooltip>
  </q-btn>
  <q-dialog v-model="dialog" :position="position">
    <q-card>
      <q-card-section
        v-for="(location, index) in savedLocations"
        :key="index"
        class="locations row items-center justify-between no-wrap"
      >
        <span class="text-subtitle2" @click=";[getSavedLocationWeatherData(location), updateRegion(location)]">{{
          location.title
        }}</span>
        <q-btn icon="close" color="negative" flat @click="removeSavedLocation(location.title)"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.locations {
  cursor: pointer;
  gap: 10px;
}
</style>
