import { Notify } from 'quasar'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, AppStore } from './types'

export const actions: PiniaActionAdaptor<Actions, AppStore> = {
  reportError({ message }) {
    this.errorMessage = message
    Notify.create({
      message,
      type: 'negative',
      icon: 'error',
      position: 'top'
    })
    console.log('Reported error: ', message)
  }
}
