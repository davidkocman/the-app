import { ref, reactive, toRefs, onBeforeMount } from 'vue'
import TSavedLocation from '@/types/weather/TSavedLocation'

/* Defining the shape of the object State. */
interface State {
  hasSavedLocations: boolean
  savedLocations: TSavedLocation[]
}

/* Creating a reactive object that is of type State. */
const state = reactive<State>({
  hasSavedLocations: false,
  savedLocations: [],
})

/**
 * It saves the location to localStorage and updates the state
 * @returns An object with the saveLocation function and the state object.
 */
export default function useSavedLocations() {
  const checkForSavedLocations = () => {
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

  function saveLocation(coordinates: string[], activeLocation: string, activeRegion: string): void {
    const newLocation = ref<TSavedLocation>({
      lat: coordinates[0],
      lng: coordinates[1],
      title: activeLocation,
      region: activeRegion,
    })
    let storageValue = []

    if (localStorage.getItem('the_app-weather-locations')) {
      /* Parsing the string that is stored in localStorage to an array of objects. */
      storageValue = JSON.parse(localStorage.getItem('the_app-weather-locations') as string)

      /* Checking if the location is already saved. */
      if (storageValue.some((e: TSavedLocation) => e.title === newLocation.value.title)) {
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

  const removeSavedLocation = (title: string) => {
    let storageValue = JSON.parse(localStorage.getItem('the_app-weather-locations') as string)
    const newFavourites = storageValue.filter((location: TSavedLocation) => {
      return location.title !== title
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
    checkForSavedLocations,
    saveLocation,
    removeSavedLocation,
    /* A function that is provided by Vue. It is used to convert a reactive object into a plain object
    with reactive properties. */
    ...toRefs(state),
  }
}
