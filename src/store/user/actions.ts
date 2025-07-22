import { auth } from '@/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
  User
} from 'firebase/auth'
import useNotesStore from '@/store/notes'
import useAppStore from '@/store/app'
import useInvoicesStore from '@/store/invoices'

import router from '@/router'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, UserStore } from './types'
import type { UserData } from '@/types/user'

/**
 * A collection of actions for managing user authentication and profile updates in a Pinia store.
 *
 * @type {PiniaActionAdaptor<Actions, UserStore>}
 *
 * @property {Function} resetStores - Resets the state of the application, notes, and invoices stores to their initial values.
 * @property {Function} registerUser - Registers a new user with email and password, sends email verification, and updates the store.
 * @property {Function} loginUser - Logs in a user with email and password, updates the store, and handles session persistence.
 * @property {Function} logoutUser - Logs out the current user, clears user data, and resets related stores.
 * @property {Function} currentUser - Monitors authentication state changes and updates the store with the current user data.
 * @property {Function} updateUserName - Updates the display name of the current user in the authentication profile and local store.
 * @property {Function} updateUserAvatar - Updates the avatar of the current user in the authentication profile and local store.
 */
export const actions: PiniaActionAdaptor<Actions, UserStore> = {
  /**
   * Resets the state of the application, notes, and invoices stores to their initial values.
   *
   * This method retrieves instances of the app, notes, and invoices stores,
   * and calls their `$reset()` methods to clear any existing state.
   *
   * Useful for scenarios such as user logout or application reinitialization.
   */
  resetStores() {
    const appStore = useAppStore()
    const notesStore = useNotesStore()
    const invoicesStore = useInvoicesStore()
    appStore.$reset()
    notesStore.$reset()
    invoicesStore.$reset()
  },
  /**
   * Registers a new user using the provided email and password.
   *
   * This method creates a new user account with Firebase Authentication, sends an email
   * verification to the newly created user, and updates the user data in the store.
   * If the registration is successful, the user is redirected to the home page.
   * In case of an error, it reports the error and resets the user data.
   *
   * @param email - The email address of the user to register.
   * @param password - The password for the new user account.
   *
   * @throws Will report an error if the registration or email verification fails.
   */
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
  /**
   * Logs in a user using the provided email and password credentials.
   *
   * This method sets the authentication persistence to session-based, attempts to sign in
   * the user with the given credentials, and updates the user data upon successful login.
   * It also handles loading states and error reporting during the process.
   *
   * @param email - The email address of the user attempting to log in.
   * @param password - The password associated with the provided email address.
   *
   * @throws Will report an error if the login attempt fails.
   */
  async loginUser(email, password) {
    const appStore = useAppStore()
    this.loadingUser = true
    appStore.loading = true
    try {
      // Set persistence to session
      // This means the user will be logged out when the browser is closed
      // If you want to keep the user logged in, use localStorage instead
      // await setPersistence(auth, localStorage)
      // This is the default behavior, so you can remove this line if you want
      await setPersistence(auth, browserSessionPersistence)
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      if (user.email) {
        this.userData = {
          email: user.email,
          uid: user.uid,
          name: user.displayName,
          emailVerified: user.emailVerified,
          photoUrl: user.photoURL
        } as UserData
        router.push('/')
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
      this.loadingUser = false
    }
  },
  /**
   * Logs out the currently authenticated user.
   *
   * This method performs the following actions:
   * - Sets the application store's loading state to `true`.
   * - Attempts to sign out the user using the authentication service.
   * - Clears the user data and navigates to the login page upon successful logout.
   * - Handles any errors that occur during the logout process by reporting them to the application store.
   * - Resets the notes store and clears the loading state in the application store in the `finally` block.
   *
   * @async
   * @throws Will report an error to the application store if the logout process fails.
   */
  async logoutUser() {
    const appStore = useAppStore()
    this.resetStores()
    appStore.loading = true
    try {
      await signOut(auth)
      this.userData = null
      router.push('/login')
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      this.userData = null
      appStore.loading = false
    }
  },
  /**
   * Monitors the authentication state of the user and updates the user data accordingly.
   *
   * @returns {Promise<firebase.User | null>} A promise that resolves with the authenticated user object if the user is signed in,
   * or `null` if the user is signed out. The promise rejects if an error occurs during the authentication state change process.
   *
   * @remarks
   * - If a user is authenticated, their data (email, UID, name, email verification status, and photo URL) is stored in `this.userData`.
   * - If no user is authenticated, `this.userData` is set to `null` and the notes store is reset.
   * - In case of an error, the error is reported to the application store.
   */
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
  /**
   * Updates the current user's display name in the authentication profile and the local user data store.
   *
   * This function sets the application store's loading state to `true` while the update is in progress.
   * If the user is authenticated, it attempts to update the display name using the `updateProfile` method.
   * On success, it updates the local `userData` object with the new name. If an error occurs during the
   * update, it reports the error using the application store's `reportError` method. The loading state
   * is reset to `false` after the operation completes, regardless of success or failure.
   *
   * @param name - The new display name to set for the current user.
   * @throws Will report an error to the application store if the update fails.
   */
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
  /**
   * Updates the avatar of the currently authenticated user.
   *
   * @param path - The URL or path to the new avatar image.
   *
   * @remarks
   * This method updates the `photoURL` property of the authenticated user's profile
   * using Firebase's `updateProfile` function. It also updates the local `userData.photoUrl`
   * property if it exists. During the operation, the `loading` state of the application store
   * is set to `true` and reset to `false` once the operation completes.
   *
   * @throws Will report an error to the application store if the update fails.
   */
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
