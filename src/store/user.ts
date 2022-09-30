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
import { useAppStore } from './app'
import getErrorMessage from '@/utils/handleCatchErrors'
import router from '@/router'
import IUserData from '@/types/IUserData'

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null as IUserData | null,
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
      this.loadingUser = true
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(auth.currentUser as User)
        this.userData = {
          email: user.email,
          uid: user.uid,
          name: user.displayName
        } as IUserData
        router.push('/')
      } catch (e) {
        const appStore = useAppStore()
        appStore.reportError({ message: getErrorMessage(e) })
        this.userData = null
      } finally {
        this.loadingUser = false
      }
    },
    async loginUser(email: string, password: string) {
      this.loadingUser = true
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        this.userData = {
          email: user.email,
          uid: user.uid
        } as IUserData
        router.push('/')
      } catch (error) {
        const appStore = useAppStore()
        appStore.reportError({ message: getErrorMessage(error) })
      } finally {
        this.loadingUser = false
      }
    },
    async logoutUser() {
      try {
        await signOut(auth)
        this.userData = null
        router.push('/login')
      } catch (error) {
        const appStore = useAppStore()
        appStore.reportError({ message: getErrorMessage(error) })
      }
    },
    currentUser() {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            if (user) {
              this.userData = {
                email: user.email,
                uid: user.uid,
                name: user.displayName
              } as IUserData
            }
            resolve(user)
          },
          (error) => {
            const appStore = useAppStore()
            appStore.reportError({ message: getErrorMessage(error) })
            reject(error)
          }
        )
        unsubscribe()
      })
    },
    async updateUserProfile(name: string) {
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { displayName: name })
        } catch (error) {
          const appStore = useAppStore()
          appStore.reportError({ message: getErrorMessage(error) })
        }
      }
    }
  }
})
