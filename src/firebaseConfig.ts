import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'v3-firebase.firebaseapp.com',
  projectId: 'v3-firebase',
  storageBucket: 'v3-firebase.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

export { db, auth }
