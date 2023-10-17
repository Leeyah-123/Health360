import { useApi } from '@/composables/useApi'
import type { AxiosResponse } from 'axios'
import type { Ref } from 'vue'
import { apiResponse } from '../apiResponse'
import type { Role } from '../types/misc'

const userRequests = () => ({
  getAllUsers: async (loading?: Ref<boolean>) => {
    try {
      const response = await useApi(loading).get('/user')
      return apiResponse({ success: true, message: 'Fetched.', data: response.data })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Request error.',
        error: err
      })
    }
  },
  getAUser: async (id: string, loading?: Ref<boolean>) => {
    try {
      const response = await useApi(loading).get(`/user/${id}`)
      return apiResponse({ success: true, message: 'Fetched.', data: response.data })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Request error.',
        error: err
      })
    }
  },
  updateUserRole: async (data: { id: Ref<string>; role: Role }, loading?: Ref<boolean>) => {
    try {
      const response: AxiosResponse<{ token: string }> = await useApi(loading).post(
        '/user/admin/update',
        data
      )

      return apiResponse({
        success: true,
        message: 'User role successfully updated',
        data: response.data
      })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'User Role Update error.',
        error: err
      })
    }
  }
})

export default userRequests
