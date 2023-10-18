<script setup lang="ts">
import CustomButton from '@/components/simple/CustomButton.vue';
import CustomModal from '@/components/simple/CustomModal.vue';
import CustomTable from '@/components/simple/CustomTable.vue';
import type { UserInterface } from '@/interfaces';
import { useUsersStore } from '@/stores/users.store';
import userRequests from '@/utils/apiRequests/user.requests';
import type { Role } from '@/utils/types/misc';
import { Loading, Notify } from 'notiflix';
import { onMounted, ref, type Ref } from 'vue';

// Users Store
const usersStore = useUsersStore();
const users = usersStore.users;
const setUsers = usersStore.setUsers;

const activeUser: Ref<UserInterface | null> = ref(null)

// Edit User Role Controls
const loading: Ref<boolean> = ref(false)
const userRole: Ref<Role> = ref(activeUser.value?.role || 'user')
const changeUserRole = async () => {
  if (!users || !activeUser.value) return;
  if (activeUser.value.role === userRole.value) return isEditUserModalOpen.value = false

  loading.value = true
  const response = await userRequests().updateUserRole({ id: activeUser.value.id, role: userRole.value })
  loading.value = false

  if (response.success) {
    const index = users.findIndex((user) => user.id === response.data.id);
    users[index] = response.data;
    toggleEditUserModal()
    return Notify.success("User role updated successfully")
  }

  Notify.failure(response.message)
}

// Modal Controls
const isEditUserModalOpen: Ref<boolean> = ref(false)
const openEditUserModal = (index: number) => {
  if (!users) return
  activeUser.value = users[index]
  isEditUserModalOpen.value = true
}
const toggleEditUserModal = () => {
  if (isEditUserModalOpen.value) activeUser.value = null
  isEditUserModalOpen.value = !isEditUserModalOpen.value
}

// Users Table Controls
const headings: Ref<string[]> = ref([]);
const data: Ref<UserInterface[]> = ref([]);
const populateUsersTable = () => {
  if (!users) return;

  headings.value = Object.keys(users[0])
  data.value = users
}

onMounted(async () => {
  if (!users) {
    Loading.hourglass();

    const response = await userRequests().getAllUsers();
    Loading.remove();

    if (!response.success) return Notify.failure(response.message);

    if (response.data.length > 0) {
      setUsers(response.data)
    }
  }

  populateUsersTable()
})
</script>

<template>
  <h2 class="text-lg font-medium mb-5">Users</h2>

  <!-- User data table -->
  <div class="overflow-scroll w-[80vw]">
    <custom-table :headings="headings" :data="data" :actions="[{ name: 'Edit User Role', func: openEditUserModal }]" />
  </div>

  <!-- Edit User Modal -->
  <custom-modal title="Edit User Role" :is-modal-open="isEditUserModalOpen" :toggle-modal="toggleEditUserModal"
    :loading="loading" type="button" class="hidden">
    <template #button>Edit User Role</template>
    <template #body>
      <form class="p-6 space-y-6" @submit.prevent="changeUserRole">
        <select v-model="userRole"
          class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent">
          <option value="user" class="dark:bg-dark dark:text-light">User</option>
          <option value="admin" class="dark:bg-dark dark:text-light">Admin</option>
        </select>
      </form>
    </template>
    <template #footer>
      <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
        <custom-button type="button" :handle-click="changeUserRole" :loading="loading"
          class="text-sm">Save</custom-button>
        <button type="button" @click="toggleEditUserModal"
          class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
      </div>
    </template>
  </custom-modal>
</template>

