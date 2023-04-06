import { Store } from 'pinia'

import type { UserData } from '@/types/user'

type State = {
  userData: UserData | null
  loadingUser: boolean
}

type Getters = any

type Actions = {
  registerUser: (email: string, password: string) => Promise<void>
  loginUser: (email: string, password: string) => Promise<void>
  logoutUser: () => Promise<void>
  currentUser: () => void
  updateUserName: (name: string) => Promise<void>
  updateUserAvatar: (path: string) => Promise<void>
}

type UserStore = Store<'user', State, Getters, Actions>

export { State, Getters, Actions, UserStore }
