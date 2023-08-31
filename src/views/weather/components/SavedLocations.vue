<script setup lang="ts">
import { ref } from 'vue'
import { SavedLocation } from '@/types/weather'
import { storeToRefs } from 'pinia'
import useWeatherStore from '@/store/weather'
import useSavedLocations from '@/composables/weather/useSavedLocations'

type positionType = 'top' | 'right' | 'standard' | 'bottom' | 'left' | undefined

const weatherStore = useWeatherStore()
const { activeLocation, activeRegion, coordinates } = storeToRefs(weatherStore)
const { hasSavedLocations, savedLocations, removeSavedLocation } = useSavedLocations()

const dialog = ref<boolean>(false)
const position = ref<positionType>('top')

// A function that is called when the button is clicked. It sets the position of the dialog and sets
// the dialog to true.
const open = (pos: positionType) => {
  position.value = pos
  dialog.value = true
}
// A function that is called when a saved location is clicked. It sets the active location, active
// region, and coordinates to the location that was clicked. It then closes the dialog.
const updateRegion = (location: SavedLocation): void => {
  activeLocation.value = location.name
  activeRegion.value = location.region
  coordinates.value = { lat: location.lat, lon: location.lon }
  dialog.value = false
}
</script>

<template>
  <q-btn v-if="hasSavedLocations" icon="star_rate" color="primary" size="md" flat dense @click="open('right')">
    <q-tooltip>Saved locations</q-tooltip>
  </q-btn>
  <q-dialog v-model="dialog" :position="position">
    <q-card>
      <q-card-section
        v-for="(location, index) in savedLocations"
        :key="index"
        class="locations row items-center justify-between no-wrap"
      >
        <span class="text-subtitle2" @click=";[weatherStore.getWeatherData(), updateRegion(location)]">{{
          location.name
        }}</span>
        <q-btn icon="close" color="negative" flat @click="removeSavedLocation(location.name)"></q-btn>
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
