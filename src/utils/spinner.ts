import { useAppStore } from '@/store/app'
import { Loading, QSpinnerPuff as spinner } from 'quasar'

export default (visible: boolean) => {
  const appStore = useAppStore()
  appStore.loading = visible

  if (appStore.loading === true) {
    Loading.show({
      spinner: spinner,
      spinnerSize: 60
    })
    return
  }
  Loading.hide()
}
