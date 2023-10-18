<script setup lang="ts">
import CustomTable from '@/components/simple/CustomTable.vue';
import type { ConsultantInterface } from '@/interfaces';
import consultantRequests from '@/utils/apiRequests/consultant.requests';
import { Loading, Notify } from 'notiflix';
import { onMounted, ref, type Ref } from 'vue';

const headings: Ref<string[]> = ref([]);
const data: Ref<string[][]> = ref([]);

const populateConsultantsTable = (users: ConsultantInterface[]) => {
  headings.value = Object.keys(users[0])

  const values = Object.values(users)
  values.forEach((row: any) => {
    row.user = row.user.full_name
    data.value.push(Object.values(row))
  })
}

const EditUserRole = () => {
  console.log("Editing")
}

onMounted(async () => {
  Loading.hourglass();

  const response = await consultantRequests().getAllConsultants();
  Loading.remove();

  if (!response.success) return Notify.failure(response.message);

  if (response.data.length > 0) {
    let users: ConsultantInterface[] = []
    users = response.data as ConsultantInterface[]

    populateConsultantsTable(users)
  }
})
</script>

<template>
  <h2 class="text-lg font-medium mb-5">Consultants</h2>

  <div class="sm:overflow-scroll w-[80vw]">
    <custom-table :headings="headings" :data="data" :actions="[{ name: 'Edit User Role', func: EditUserRole }]" />
  </div>
</template>

