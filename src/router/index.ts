import DashboardLayout from '@/components/layout/dashboard/dashboard.layout.vue'
import { isUserLoggedIn, userIsAdmin } from '@/plugins/auth.plugin'
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      beforeEnter: () => {
        // reject the navigation if user is logged in
        if (!isUserLoggedIn()) return { path: '/auth/login' }
        else if (!userIsAdmin()) return { path: '/401' }
        else return true
      },
      children: [
        { path: '/', redirect: '/dashboard' },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'users',
          name: 'users',
          props: () => {},
          component: () => import('../views/UsersView.vue')
        },
        {
          path: 'consultants',
          name: 'consultants',
          component: () => import('../views/ConsultantsView.vue')
        }
      ]
    },
    {
      path: '/auth',
      name: 'authentication',
      beforeEnter: () => {
        // reject the navigation if user is not logged in
        if (isUserLoggedIn()) return { path: '/dashboard' }
        else return true
      },
      children: [
        { path: 'login', name: 'login', component: () => import('../views/LoginView.vue') }
      ]
    },
    {
      path: '/401',
      name: 'Unauthorized',
      component: () => import('../views/UnauthorizedView.vue')
    }
  ]
})

export default router
