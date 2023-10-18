<script setup lang="ts">
import MetricCard from '@/components/simple/MetricCard.vue';
import { useConsultantsStore } from '@/stores/consultants.store';
import { useUsersStore } from '@/stores/users.store';
import consultantRequests from '@/utils/apiRequests/consultant.requests';
import userRequests from '@/utils/apiRequests/user.requests';
import { Loading, Notify } from 'notiflix';
import { computed, onMounted } from 'vue';

const usersStore = useUsersStore()
const users = computed(() => usersStore.users)
const setUsers = usersStore.setUsers

const consultantsStore = useConsultantsStore()
const consultants = computed(() => consultantsStore.consultants)
const setConsultants = consultantsStore.setConsultants

onMounted(async () => {
  if (!users.value) {
    Loading.hourglass('Fetching users')
    const response = await userRequests().getAllUsers()
    if (response.success) {
      setUsers(response.data)
    } else Notify.failure(response.message)
    Loading.remove()
  }

  if (!consultants.value) {
    Loading.hourglass('Fetching consultants')
    const response = await consultantRequests().getAllConsultants()
    if (response.success) {
      setConsultants(response.data)
    } else Notify.failure(response.message)
    Loading.remove()
  }
})
</script>

<template>
  <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
    <metric-card metric="Users" :value="users?.length.toString() || '0'">
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>account-multiple</title>
          <path
            d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" />
        </svg>
      </template>
    </metric-card>
    <metric-card metric="Consultants" :value="consultants?.length.toString() || '0'">
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>account-multiple</title>
          <path
            d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" />
        </svg>
      </template>
    </metric-card>
  </div>
</template>
