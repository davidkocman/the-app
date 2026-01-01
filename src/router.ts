import useUserStore from '@/store/user'
import useAppStore from '@/store/app'
import { createRouter, createWebHistory, RouterOptions, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import Default from '@/layouts/Default.vue'

/**
 * Navigation guard to ensure that a user is authenticated before accessing a route.
 *
 * This function checks if the current user is authenticated by invoking the `currentUser` method
 * from the `userStore`. If the user is authenticated, the navigation proceeds to the requested route.
 * Otherwise, the user is redirected to the login page (`/login`).
 *
 * Additionally, it sets the `loading` state in the `appStore` to `true` while the authentication
 * check is in progress and resets it to `false` after the check is complete.
 *
 * @param _to - The target route being navigated to.
 * @param _from - The current route being navigated away from.
 * @param next - A function to resolve the navigation. Call `next()` to proceed, or pass a route
 *               path (e.g., `/login`) to redirect.
 */
const requireAuth = async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore()
  const appStore = useAppStore()
  appStore.loading = true
  await userStore.currentUser()
  const user = userStore.getUser
  if (user) {
    next()
  } else {
    next('/login')
  }
  appStore.loading = false
}

const routes = [
  {
    path: '/default',
    component: Default,
    children: [
      {
        path: '/register',
        component: () => import('@/views/Register.vue')
      },
      {
        path: '/login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: '/:pathMatch(.*)',
        component: () => import(/* webpackChunkName: Error */ '@/views/error/404.vue')
      }
    ]
  },
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "User" */ '@/layouts/User.vue'),
    beforeEnter: requireAuth,
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard/Dashboard.vue')
      },
      {
        path: '/news',
        component: () => import(/* webpackChunkName: "News" */ '@/views/news/News.vue')
      },
      {
        path: '/movies',
        component: () => import(/* webpackChunkName: "Movies" */ '@/views/movies/Movies.vue')
      },
      {
        path: '/games',
        component: () => import(/* webpackChunkName: "Games" */ '@/views/games/Games.vue')
      },
      {
        path: '/notes',
        component: () => import(/* webpackChunkName: "Notes" */ '@/views/notes/Notes.vue')
      },
      {
        path: '/weather',
        component: () => import(/* webpackChunkName: "Weather" */ '@/views/weather/Weather.vue')
      },
      {
        path: '/invoices',
        component: () => import(/* webpackChunkName: "Invoices" */ '@/views/invoices/Invoices.vue')
      },
      {
        path: '/profile',
        component: () => import(/* webpackChunkName: "Profile" */ '@/views/profile/Profile.vue')
      },
      {
        path: '/:pathMatch(.*)',
        component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard/Dashboard.vue')
      }
    ]
  }
]

const history = createWebHistory()

const router = createRouter({
  routes,
  history
} as RouterOptions)

export default router
