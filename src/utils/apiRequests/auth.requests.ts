import { useApi } from '@/composables/useApi'
import { useUserStore } from '@/stores/user.store'
import type { AxiosResponse } from 'axios'
import type { Ref } from 'vue'
import { apiResponse } from '../apiResponse'
import { COOKIE_TOKEN_KEY } from '../constants/auth.constants'

const authRequests = () => ({
  requestOtp: async (phoneNumber: Ref<string>, loading?: Ref<boolean>) => {
    try {
      const response = await useApi(loading).post('/auth/request-otp', {
        country: 'Nigeria',
        country_code: '+234',
        phone_number: phoneNumber.value
      })
      return apiResponse({ success: true, message: 'Fetched.', data: response.data })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Request error.',
        error: err
      })
    }
  },
  login: async (
    credentials: { otp: Ref<string>; phoneNumber: Ref<string> },
    loading?: Ref<boolean>
  ) => {
    try {
      // ? log user in and get token
      const response: AxiosResponse<{ token: string }> = await useApi(loading).post('/auth/login', {
        otp: credentials.otp.value,
        country: 'Nigeria',
        country_code: '+234',
        phone_number: credentials.phoneNumber.value
      })

      const userStore = useUserStore()
      userStore.setToken(response.data.token)

      return apiResponse({
        success: true,
        message: 'User successfully logged in.',
        data: {
          token: userStore.token.get(COOKIE_TOKEN_KEY)
        }
      })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'User Log in error.',
        error: err
      })
    }
  }
})

export default authRequests
