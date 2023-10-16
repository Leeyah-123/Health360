import { useUserStore } from '@/stores/user.store'
import { type RouteLocationNormalized } from 'vue-router'

export function redirectIfLoggedIn(route: RouteLocationNormalized) {
  const userStore = useUserStore()

  if (userStore.isLoggedIn && route.path === '/auth/login') {
    return true
  }

  return false
}

export function isUserLoggedIn() {
  const userStore = useUserStore()

  return userStore.isLoggedIn
}

export default {
  install() {}
}
