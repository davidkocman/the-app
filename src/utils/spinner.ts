import useAppStore from '@/store/app'
import { Loading, QSpinnerPuff as spinner } from 'quasar'

export default (show: boolean) => {
  const appStore = useAppStore()
  appStore.loading = show

  if (show) {
    Loading.show({
      spinner,
      spinnerSize: 60
    })
    return
  }
  Loading.hide()
}
