import useUserStore from '@/store/user'
import useAppStore from '@/store/app'
import { createRouter, createWebHistory, RouterOptions, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import Default from '@/layouts/Default.vue'

const requireAuth = (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore()
  const appStore = useAppStore()
  appStore.loading = true
  const user = userStore.currentUser()
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
