import { useUserStore } from './store/user'
import { createRouter, createWebHistory, RouterOptions, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import Default from '@/layouts/Default.vue'

const requireAuth = async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore()
  userStore.loading = true
  const user = await userStore.currentUser()
  if (!user) {
    next('/login')
    return
  }
  next()
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
      }
    ]
  },
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "User" */'@/layouts/User.vue'),
    beforeEnter: requireAuth,
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard/Dashboard.vue'),
      },
      {
        path: '/news',
        component: () => import(/* webpackChunkName: "News" */'@/views/news/News.vue')
      },
      {
        path: '/weather',
        component: () => import(/* webpackChunkName: "Weather" */'@/views/weather/Weather.vue')
      },
      {
        path: '/profile',
        component: () => import(/* webpackChunkName: "Profile" */'@/views/profile/Profile.vue')
      },
    ]
  },
]

const history = createWebHistory()

const router = createRouter({
  routes,
  history,
} as RouterOptions)

export default router
