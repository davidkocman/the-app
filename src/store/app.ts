import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: true,
    miniState: true,
    loading: false,
    errorMessage: ''
  }),
  getters: {
    isDarkMode(): boolean {
      const $q = useQuasar()
      return $q.dark.isActive
    }
  },
  actions: {
    reportError({ message }: { message: string }) {
      this.errorMessage = message
      console.log('Reported error: ', message)
    }
  }
})
