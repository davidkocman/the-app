import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { Quasar, Loading, Notify, Dialog, QuasarPluginOptions, QSpinner } from 'quasar'
import App from './App.vue'
import useUserStore from '@/store/user'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'

// Import Quasar css
import 'quasar/src/css/index.sass'


const myApp = createApp(App)

myApp.use(createPinia())
myApp.use(router)
const quasarOptions: QuasarPluginOptions = {
  plugins: {
    Loading,
    Notify,
    Dialog
  },
  config: {
    loading: {
      spinner: QSpinner
    }
  }
}

myApp.use(Quasar, quasarOptions)

// Keep the user store in sync with the Supabase auth session.
useUserStore().subscribeAuth()

myApp.mount('#app')
