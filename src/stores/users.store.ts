import type { UserInterface } from '@/interfaces'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  // users data
  const users = ref<UserInterface[]>()

  // is users data loading ?
  const loading = ref(true)

  // Set users
  function setUsers(newUsers: UserInterface[]) {
    users.value = newUsers
  }

  // fetching users ?
  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  return { users, loading, setUsers, setLoading }
})
