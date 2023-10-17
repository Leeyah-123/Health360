import DashboardLayout from '@/components/layout/dashboard/dashboard.layout.vue'
import { isUserLoggedIn } from '@/plugins/auth.plugin'
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import userRequests from '@/utils/apiRequests/user.requests'

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
          props: () => {},
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
      beforeEnter: () => {
        // reject the navigation if user is not logged in
        if (isUserLoggedIn()) return { path: '/dashboard' }
        else return true
      },
      children: [
        { path: 'login', name: 'login', component: () => import('../views/LoginView.vue') }
      ]
    }
  ]
})

export default router
