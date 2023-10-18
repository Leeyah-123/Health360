<script setup lang="ts">
import CustomModal from '@/components/simple/CustomModal.vue';
import CustomTable from '@/components/simple/CustomTable.vue';
import type { UserInterface } from '@/interfaces';
import userRequests from '@/utils/apiRequests/user.requests';
import { Loading, Notify } from 'notiflix';
import { onMounted, ref, type Ref } from 'vue';

const users: Ref<UserInterface[]> = ref([])
const activeUser: Ref<UserInterface | null> = ref(null)

const isEditUserModalOpen: Ref<boolean> = ref(false)
const toggleEditUserModal = () => {
  if (isEditUserModalOpen.value) activeUser.value = null
  isEditUserModalOpen.value = !isEditUserModalOpen.value
}

const headings: Ref<string[]> = ref([]);
const data: Ref<string[][]> = ref([]);

const populateUsersTable = () => {
  headings.value = Object.keys((users.value)[0])

  const values = Object.values(users.value)
  values.forEach((row) => data.value.push(Object.values(row)))
}

const openEditUserModal = (index: number) => {
  activeUser.value = (users.value)[index]
  isEditUserModalOpen.value = true
}

onMounted(async () => {
  Loading.hourglass();

  const response = await userRequests().getAllUsers();
  Loading.remove();

  if (!response.success) return Notify.failure(response.message);

  if (response.data.length > 0) {
    users.value = response.data as UserInterface[]
    populateUsersTable()
  }
})
</script>

<template>
  <h2 class="text-lg font-medium mb-5">Users</h2>

  <!-- User data table -->
  <div class="overflow-scroll w-[80vw]">
    <custom-table :headings="headings" :data="data" :actions="[{ name: 'Edit User Role', func: openEditUserModal }]" />
  </div>

  <!-- Edit User Modal -->
  <custom-modal title="Edit User" :is-modal-open="isEditUserModalOpen" :toggle-modal="toggleEditUserModal" type="button"
    class="hidden">
    <template #button>Edit User</template>
    <template #body>
      <div class="p-6 space-y-6">
        User ID: {{ activeUser?.id }}
      </div>
    </template>
    <template #footer>
      <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
        <button data-modal-hide="defaultModal" type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
        <button data-modal-hide="defaultModal" type="button"
          class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
      </div>
    </template>
  </custom-modal>
</template>

