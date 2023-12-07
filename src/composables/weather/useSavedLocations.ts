import { ref, reactive, toRefs, onBeforeMount } from 'vue'
import { SavedLocation } from '@/types/weather'

/* Defining the shape of the object State. */
interface State {
  hasSavedLocations: boolean
  savedLocations: SavedLocation[]
}

/* Creating a reactive object that is of type State. */
const state = reactive<State>({
  hasSavedLocations: false,
  savedLocations: []
})

/**
 * It saves the location to localStorage and updates the state
 * @returns An object with the saveLocation function and the state object.
 */
export default function useSavedLocations() {
  const resolveSavedLocations = () => {
    onBeforeMount(() => {
      if (localStorage.getItem('the_app-weather-locations')) {
        const storageValue = JSON.parse(localStorage.getItem('the_app-weather-locations') || '')
        if (storageValue.length > 0) {
          state.savedLocations = storageValue
          state.hasSavedLocations = true
        }
      }
    })
  }

  /**
   * It saves the location to localStorage if it's not already saved, and if it is, it moves it to the
   * top of the list
   * @param {string[]} coordinates - string[] - The coordinates of the location that is being saved.
   * @param {string} activeLocation - string - The name of the location that is currently active.
   * @param {string} activeRegion - string - The region that the user is currently viewing.
   * @returns void.
   */
  function saveLocation(coordinates: number[], activeLocation: string, activeRegion: string): void {
    const newLocation = ref<SavedLocation>({
      lat: coordinates[0],
      lon: coordinates[1],
      name: activeLocation,
      region: activeRegion
    })
    let storageValue = []

    if (localStorage.getItem('the_app-weather-locations')) {
      /* Parsing the string that is stored in localStorage to an array of objects. */
      storageValue = JSON.parse(localStorage.getItem('the_app-weather-locations') as string)

      /* Checking if the location is already saved. */
      if (storageValue.some((e: SavedLocation) => e.name === newLocation.value.name)) {
        return
      }

      /* Checking if the storageValue array has more than 2 items. If it does, it removes the last item
      and adds the newLocation to the beginning of the array. */
      if (storageValue.length > 2) {
        storageValue.pop()
        storageValue.unshift(newLocation.value)
        localStorage.setItem('the_app-weather-locations', JSON.stringify(storageValue))
        state.savedLocations = storageValue
        return
      }

      /* Adding the newLocation to the beginning of the array and then saving it to localStorage. */
      storageValue.unshift(newLocation.value)
      localStorage.setItem('the_app-weather-locations', JSON.stringify(storageValue))
      state.savedLocations = storageValue
      return
    }

    /* Adding the newLocation to the storageValue array and then saving it to localStorage. */
    storageValue.push(newLocation.value)
    localStorage.setItem('the_app-weather-locations', JSON.stringify(storageValue))
    state.savedLocations = storageValue
    state.hasSavedLocations = true
  }

  /**
   * It removes a location from the saved locations array and updates the localStorage
   * @param {string} title - string - The title of the location you want to remove.
   * @returns the newFavourites array.
   */
  const removeSavedLocation = (title: string) => {
    let storageValue = JSON.parse(localStorage.getItem('the_app-weather-locations') as string)
    const newFavourites = storageValue.filter((location: SavedLocation) => {
      return location.name !== title
    })
    storageValue = newFavourites
    if (storageValue.length === 0) {
      state.hasSavedLocations = false
      localStorage.removeItem('the_app-weather-locations')
      state.savedLocations = storageValue
      return
    }
    localStorage.setItem('the_app-weather-locations', JSON.stringify(storageValue))
    state.savedLocations = storageValue
  }

  return {
    ...toRefs(state),
    resolveSavedLocations,
    saveLocation,
    removeSavedLocation
  }
}
