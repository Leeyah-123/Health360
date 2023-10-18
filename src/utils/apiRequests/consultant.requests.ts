import { useApi } from '@/composables/useApi'
import type { Ref } from 'vue'
import { apiResponse } from '../apiResponse'

const consultantRequests = () => ({
  getAllConsultants: async (loading?: Ref<boolean>) => {
    try {
      const response = await useApi(loading).get('/consultant')
      return apiResponse({ success: true, message: 'Fetched.', data: response.data })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Request error.',
        error: err
      })
    }
  },
  getAConsultant: async (id: string, loading?: Ref<boolean>) => {
    try {
      const response = await useApi(loading).get(`/consultant/${id}`)
      return apiResponse({ success: true, message: 'Fetched.', data: response.data })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Request error.',
        error: err
      })
    }
  },
  addConsultant: async (id: string, loading?: Ref<boolean>) => {}
})

export default consultantRequests
