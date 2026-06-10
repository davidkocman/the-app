import { supabase } from '@/supabaseConfig'
import type { User } from '@supabase/supabase-js'
import useNotesStore from '@/store/notes'
import useAppStore from '@/store/app'
import useInvoicesStore from '@/store/invoices'

import router from '@/router'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, UserStore } from './types'
import type { UserData } from '@/types/user'

/**
 * Builds the store `UserData` shape from a Supabase auth user plus its
 * `profiles` row (name + avatar). The profile row is created automatically by
 * the `handle_new_user` trigger, so a missing row is treated as empty profile.
 */
const buildUserData = async (user: User): Promise<UserData> => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  return {
    email: user.email ?? '',
    uid: user.id,
    name: profile?.name ?? '',
    emailVerified: !!user.email_confirmed_at,
    photoUrl: profile?.avatar_url ?? undefined
  }
}

/**
 * A collection of actions for managing user authentication and profile updates in a Pinia store.
 *
 * @type {PiniaActionAdaptor<Actions, UserStore>}
 *
 * @property {Function} resetStores - Resets the state of the application, notes, and invoices stores to their initial values.
 * @property {Function} subscribeAuth - Registers a Supabase auth listener that keeps `userData` in sync with the session.
 * @property {Function} registerUser - Registers a new user with email and password; Supabase sends the verification email.
 * @property {Function} loginUser - Signs a user in with email and password and updates the store.
 * @property {Function} logoutUser - Signs out the current user, clears user data, and resets related stores.
 * @property {Function} currentUser - Resolves the current Supabase session and hydrates the store.
 * @property {Function} updateUserName - Updates the user's display name in the `profiles` table and local store.
 * @property {Function} updateUserAvatar - Updates the user's avatar URL in the `profiles` table and local store.
 */
export const actions: PiniaActionAdaptor<Actions, UserStore> = {
  /**
   * Resets the state of the application, notes, and invoices stores to their initial values.
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
   * Registers a Supabase auth state listener. Keeps `userData` synced on sign-in,
   * sign-out and token refresh. Supabase advises deferring any further Supabase
   * calls out of the callback (via setTimeout) to avoid client deadlocks.
   */
  subscribeAuth() {
    supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(async () => {
        const notesStore = useNotesStore()
        if (session?.user) {
          this.userData = await buildUserData(session.user)
        } else {
          this.userData = null
          notesStore.$reset()
        }
      }, 0)
    })
  },
  /**
   * Registers a new user using the provided email and password.
   *
   * Supabase sends the confirmation email automatically (Confirm email = ON).
   * With email confirmation enabled there is no session until the user confirms,
   * so we route to `/login`; if confirmation is disabled a session is returned
   * and we route to the dashboard.
   *
   * @param email - The email address of the user to register.
   * @param password - The password for the new user account.
   */
  async registerUser(email, password) {
    const appStore = useAppStore()
    appStore.loading = true
    this.loadingUser = true
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      if (data.session && data.user) {
        this.userData = await buildUserData(data.user)
        router.push('/')
      } else {
        router.push('/login')
      }
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
   * @param email - The email address of the user attempting to log in.
   * @param password - The password associated with the provided email address.
   */
  async loginUser(email, password) {
    const appStore = useAppStore()
    this.loadingUser = true
    appStore.loading = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data.user) {
        this.userData = await buildUserData(data.user)
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
   * Logs out the currently authenticated user, clears user data and resets stores.
   */
  async logoutUser() {
    const appStore = useAppStore()
    this.resetStores()
    appStore.loading = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
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
   * Resolves the current Supabase session and hydrates `userData`. Used by the
   * router's `requireAuth` guard, so it populates the store before resolving.
   *
   * @returns The authenticated user data, or `null` if there is no session.
   */
  async currentUser() {
    try {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (user) {
        this.userData = await buildUserData(user)
        return this.userData
      }
      this.userData = null
      useNotesStore().$reset()
      return null
    } catch (e) {
      const appStore = useAppStore()
      appStore.reportError({ message: getErrorMessage(e) })
      return null
    }
  },
  /**
   * Updates the current user's display name in the `profiles` table and local store.
   *
   * @param name - The new display name to set for the current user.
   */
  async updateUserName(name) {
    const appStore = useAppStore()
    const uid = this.userData?.uid
    if (!uid) return
    appStore.loading = true
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', uid)
      if (error) throw error
      if (this.userData) this.userData.name = name
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  /**
   * Updates the avatar of the currently authenticated user in the `profiles` table.
   *
   * @param path - The public URL of the new avatar image (empty string clears it).
   */
  async updateUserAvatar(path) {
    const appStore = useAppStore()
    const uid = this.userData?.uid
    if (!uid) return
    appStore.loading = true
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: path || null, updated_at: new Date().toISOString() })
        .eq('id', uid)
      if (error) throw error
      if (this.userData) this.userData.photoUrl = path
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }
}
