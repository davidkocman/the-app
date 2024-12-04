declare global {
  // eslint-disable-next-line no-var
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined
}

import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from '@firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'v3-firebase.firebaseapp.com',
  projectId: 'v3-firebase',
  storageBucket: 'v3-firebase.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
if (location.hostname === 'localhost') {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_CYPRESS_DEBUG_TOKEN
}
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_APP_RECAPTCHA_SITEKEY)
})

const db = getFirestore()
const auth = getAuth()

const storage = getStorage(app, import.meta.env.VITE_FIREBASE_BUCKET_URL)

export { db, auth, storage, appCheck }
