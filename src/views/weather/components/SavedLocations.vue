<script setup lang="ts">
import { SavedLocation } from '@/types/weather'
import { storeToRefs } from 'pinia'
import useWeatherStore from '@/store/weather'
import useSavedLocations from '@/composables/weather/useSavedLocations'

const weatherStore = useWeatherStore()
const { activeLocation, activeRegion, coordinates } = storeToRefs(weatherStore)
const { savedLocations, removeSavedLocation } = useSavedLocations()

const selectLocation = (location: SavedLocation): void => {
  activeLocation.value = location.name
  activeRegion.value = location.region
  coordinates.value = { lat: location.lat, lon: location.lon }
  weatherStore.getWeatherData()
}
</script>

<template>
  <q-btn-dropdown flat icon="location_on" color="primary" size="md">
    <q-tooltip>Saved locations</q-tooltip>
    <q-list style="min-width: 200px">
      <q-item
        v-for="(location, index) in savedLocations"
        :key="index"
        clickable
        v-close-popup
        @click="selectLocation(location)"
      >
        <q-item-section>
          <q-item-label>{{ location.name }}</q-item-label>
          <q-item-label caption>{{ location.region }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="close" color="negative" flat dense size="sm" @click.stop="removeSavedLocation(location.name)" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
