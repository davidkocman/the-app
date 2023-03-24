import { defineStore } from 'pinia'
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
import { useNotesStore } from './notes'
import useAppStore from './app/useAppStore'
import router from '@/router'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { UserData } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null as UserData | null,
    loadingUser: false
  }),
  actions: {
    /**
     * It creates a new user with the given email and password, and if successful, it sets the userData
     * property to the user's email and uid, and redirects to the home page
     * @param {string} email - string, password: string
     * @param {string} password - string
     */
    async registerUser(email: string, password: string) {
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
    async loginUser(email: string, password: string) {
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
    /**
     * It returns a promise that resolves to the current user, or null if there is no current user
     * @returns A promise that resolves to the current user.
     */
    currentUser() {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
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
        unsubscribe()
      })
    },
    async updateUserName(name: string) {
      const appStore = useAppStore()
      appStore.loading = true
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { displayName: name })
          this.userData.name = name
        } catch (e) {
          appStore.reportError({ message: getErrorMessage(e) })
        } finally {
          appStore.loading = false
        }
      }
    },
    async updateUserAvatar(path: string) {
      const appStore = useAppStore()
      appStore.loading = true
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { photoURL: path })
          this.userData.photoUrl = path
        } catch (e) {
          appStore.reportError({ message: getErrorMessage(e) })
        } finally {
          appStore.loading = false
        }
      }
    }
  }
})
