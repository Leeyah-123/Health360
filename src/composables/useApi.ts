import { useUserStore } from '@/stores/user.store'
import { COOKIE_TOKEN_KEY } from '@/utils/constants/auth.constants'
import axios, { type AxiosInstance, type AxiosRequestHeaders } from 'axios'
import type { Ref } from 'vue'

export const useApi = (isLoading?: Ref<boolean>) => {
  // Here we set the base URL for all requests made to the api
  const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
  })

  // We set an interceptor for each request to
  // include Bearer token to the request if user is logged in
  api.interceptors.request.use((config) => {
    const userSession = useUserStore()
    // set loading to true on request if isLoading is not null
    if (isLoading) isLoading.value = true

    // if user is logged in, append authorization header to the headers object
    if (userSession.isLoggedIn) {
      config.headers = {
        Authorization: `Bearer ${userSession.token.get(COOKIE_TOKEN_KEY)}`
      } as AxiosRequestHeaders
    }

    return config
  })

  // This runs before any response is returned
  api.interceptors.response.use(
    (response) => {
      // set loading to false if isLoading is not null
      if (isLoading) isLoading.value = false

      return response
    },
    (error) => {
      // set loading to false if isLoading is not null
      if (isLoading) isLoading.value = false

      // throw error
      return Promise.reject(error)
    }
  )

  return api
}
