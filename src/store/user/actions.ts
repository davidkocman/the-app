import { auth } from '@/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth'
import useNotesStore from '@/store/notes'
import useAppStore from '@/store/app'
import router from '@/router'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, UserStore } from './types'
import type { UserData } from '@/types/user'

export const actions: PiniaActionAdaptor<Actions, UserStore> = {
  async registerUser(email, password) {
    const appStore = useAppStore()
    appStore.loading = true
    this.loadingUser = true
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(auth.currentUser as User)
      this.userData = {
        email: user.email,
        uid: user.uid,
        name: user.displayName,
        emailVerified: user.emailVerified,
        photoUrl: user.photoURL
      } as UserData
      router.push('/')
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
      this.userData = null
    } finally {
      appStore.loading = false
      this.loadingUser = false
    }
  },
  async loginUser(email, password) {
    const appStore = useAppStore()
    this.loadingUser = true
    appStore.loading = true
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      this.userData = {
        email: user.email,
        uid: user.uid,
        name: user.displayName,
        emailVerified: user.emailVerified,
        photoUrl: user.photoURL
      } as UserData
      router.push('/')
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
      this.loadingUser = false
    }
  },
  async logoutUser() {
    const appStore = useAppStore()
    const notesStore = useNotesStore()
    appStore.loading = true
    try {
      await signOut(auth)
      this.userData = null
      router.push('/login')
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      this.userData = null
      notesStore.$reset()
      appStore.loading = false
    }
  },
  currentUser() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(
        auth,
        (user) => {
          const notesStore = useNotesStore()
          if (user) {
            this.userData = {
              email: user.email,
              uid: user.uid,
              name: user.displayName,
              emailVerified: user.emailVerified,
              photoUrl: user.photoURL
            } as UserData
          } else {
            this.userData = null
            notesStore.$reset()
          }
          resolve(user)
        },
        (e) => {
          const appStore = useAppStore()
          appStore.reportError({ message: getErrorMessage(e) })
          reject(e)
        }
      )
    })
  },
  async updateUserName(name) {
    const appStore = useAppStore()
    appStore.loading = true
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: name })
        if (this.userData) this.userData.name = name
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        appStore.loading = false
      }
    }
  },
  async updateUserAvatar(path) {
    const appStore = useAppStore()
    appStore.loading = true
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: path })
        if (this.userData) this.userData.photoUrl = path
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        appStore.loading = false
      }
    }
  }
}
