import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { Quasar, Loading, Notify, QuasarPluginOptions, QSpinner } from 'quasar'
import App from './App.vue'

// Import icon libraries
import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const myApp = createApp(App)

myApp.use(createPinia())
myApp.use(router)
const quasarOptions: QuasarPluginOptions = {
  plugins: {
    Loading,
    Notify
  },
  config: {
    loading: {
      spinner: QSpinner
    }
  }
}

myApp.use(Quasar, quasarOptions)

myApp.mount('#app')
