import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: true,
    miniState: true,
  }),
  getters: {
    isDarkMode(): boolean {
      const $q = useQuasar()
      return $q.dark.isActive
    },
  },
})
