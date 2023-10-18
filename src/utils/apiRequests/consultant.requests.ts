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
  getConsultantCategories: async (loading?: Ref<boolean>) => {
    try {
      const response = await useApi(loading).get('/consultant/categories')
      return apiResponse({ success: true, message: 'Fetched.', data: response.data })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Request error.',
        error: err
      })
    }
  },
  addConsultant: async (
    data: { user_id: string; bio: string; services: string[]; specializations: string[] },
    loading?: Ref<boolean>
  ) => {
    try {
      const response = await useApi(loading).post(`/consultant`, data)
      return apiResponse({
        success: true,
        message: 'Consultant added successfully',
        data: response.data
      })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Request error.',
        error: err
      })
    }
  },
  updateConsultant: async (
    data: { id: string; bio: string; services: string[]; specializations: string[] },
    loading?: Ref<boolean>
  ) => {
    try {
      const response = await useApi(loading).patch(`/consultant`, data)
      return apiResponse({
        success: true,
        message: 'Consultant updated successfully',
        data: response.data
      })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Request error.',
        error: err
      })
    }
  },
  deleteConsultant: async (id: string, loading?: Ref<boolean>) => {
    try {
      const response = await useApi(loading).delete(`/consultant/${id}`)
      return apiResponse({
        success: true,
        message: 'Consultant deleted successfully',
        data: response.data
      })
    } catch (err: any) {
      return apiResponse({
        success: false,
        message: err?.response?.data?.message || err?.message || 'Request error.',
        error: err
      })
    }
  }
})

export default consultantRequests
