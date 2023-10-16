import DashboardLayout from '@/components/layout/dashboard/dashboard.layout.vue'
import { isUserLoggedIn, redirectIfLoggedIn } from '@/plugins/auth.plugin'
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      beforeEnter: () => {
        // reject the navigation if user is not logged in
        if (!isUserLoggedIn()) return { path: '/auth/login' }
        else return true
      },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('../views/UsersView.vue')
        },
        {
          path: '/consultants',
          name: 'consultants',
          component: () => import('../views/ConsultantsView.vue')
        }
      ]
    },
    {
      path: '/auth',
      name: 'authentication',
      children: [
        { path: 'login', name: 'login', component: () => import('../views/LoginView.vue') }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (redirectIfLoggedIn(to)) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
