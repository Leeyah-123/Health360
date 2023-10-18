import type { ConsultantInterface } from '@/interfaces'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultantsStore = defineStore('consultants', () => {
  // users data
  const consultants = ref<ConsultantInterface[]>()

  // is users data loading ?
  const loading = ref(true)

  // Set consultants
  function setConsultants(newUsers: ConsultantInterface[]) {
    consultants.value = newUsers
  }

  // fetching consultants?
  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  return { consultants, loading, setConsultants, setLoading }
})
