<script setup lang="ts">
import CustomTable from '@/components/simple/CustomTable.vue';
import type { UserInterface } from '@/interfaces';
import userRequests from '@/utils/apiRequests/user.requests';
import { Loading, Notify } from 'notiflix';
import { onMounted, ref, type Ref } from 'vue';

const headings: Ref<string[]> = ref([]);
const data: Ref<string[][]> = ref([]);

const populateUsersTable = (users: UserInterface[]) => {
  headings.value = Object.keys(users[0])

  const values = Object.values(users)
  values.forEach((row) => data.value.push(Object.values(row)))
}

const EditUserRole = () => {
  console.log("Editing")
}

onMounted(async () => {
  Loading.hourglass();

  const response = await userRequests().getAllUsers();
  Loading.remove();

  if (!response.success) return Notify.failure(response.message);

  if (response.data.length > 0) {
    let users: UserInterface[] = []
    users = response.data as UserInterface[]

    populateUsersTable(users)
  }
})
</script>

<template>
  <h2 class="text-lg font-medium mb-5">All Users</h2>

  <div class="overflow-scroll w-[80vw]">
    <custom-table :headings="headings" :data="data" :actions="[{ name: 'Edit User Role', func: EditUserRole }]" />
  </div>
</template>

