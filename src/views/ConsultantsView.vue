<script setup lang="ts">
import { Confirm, Loading, Notify } from 'notiflix';
import { computed, onMounted, ref, type Ref } from 'vue';

import CustomButton from '@/components/simple/CustomButton.vue';
import CustomModal from '@/components/simple/CustomModal.vue';
import CustomTable from '@/components/simple/CustomTable.vue';

import type { ConsultantInterface } from '@/interfaces';
import { useConsultantsStore } from '@/stores/consultants.store';
import { useUsersStore } from '@/stores/users.store';
import consultantRequests from '@/utils/apiRequests/consultant.requests';
import userRequests from '@/utils/apiRequests/user.requests';

// Consultants store
const consultantsStore = useConsultantsStore();
const consultants = computed(() => consultantsStore.consultants);
const setConsultants = (newConsultants: ConsultantInterface[]) => {
  populateConsultantsTable(newConsultants)
  consultantsStore.setConsultants(newConsultants)
}
const categories = ref<string[]>()

// Users store
const usersStore = useUsersStore();
const users = computed(() => usersStore.users)
const setUsers = usersStore.setUsers
const fetchUsers = async () => {
  const response = await userRequests().getAllUsers()
  if (!response.success) return Notify.failure(response.message)
  setUsers(response.data)
}

const activeConsultant = ref<ConsultantInterface | null>(null)

/// Add Consultant Controls

// Input Refs
const addUserIdRef = ref(users.value?.[0].id || '')
const addBioRef = ref('')
const addServicesRef = ref('')
const addSpecializationsRef = ref<string[]>([])

// Add Consultant Modal Controls
const isAddConsultantModalOpen = ref<boolean>(false);

const toggleAddConsultantModal = async () => {
  // Fetch users, if necessary
  if (!isAddConsultantModalOpen.value && !users.value) {
    Loading.hourglass('Fetching users')
    fetchUsers()
    Loading.remove()
  }

  isAddConsultantModalOpen.value = !isAddConsultantModalOpen.value
}

const addConsultantLoading = ref<boolean>(false)

// Function to add a new consultant
const addConsultant = async () => {
  // Validations
  if (!consultants.value) return
  if (!addUserIdRef.value || !addBioRef.value || !addServicesRef.value || !addSpecializationsRef.value) return Notify.failure("Please enter all fields")

  const specializations = addSpecializationsRef.value

  // split services into an array
  const services = addServicesRef.value.split(",").map((service) => service.trim())

  // send add consultant request
  const response = await consultantRequests().addConsultant({ user_id: addUserIdRef.value, bio: addBioRef.value, services, specializations }, addConsultantLoading)
  if (!response.success) return Notify.failure(response.message)

  // update consultants
  const newConsultants = [...consultants.value, response.data]
  setConsultants(newConsultants)

  // reset form
  resetAddConsultantForm()

  // close modal
  toggleAddConsultantModal()

  // display toast notification
  Notify.success(response.message)
}

const resetAddConsultantForm = () => {
  addUserIdRef.value = ""
  addBioRef.value = ""
  addServicesRef.value = ""
  addSpecializationsRef.value = []
}

/// Edit Consultant Controls
// Input refs
const editBioRef = ref('')
const editServicesRef = ref('')
const editSpecializationsRef = ref<string[]>([])

// Edit Consultant modal controls
const isEditConsultantModalOpen: Ref<boolean> = ref(false)
const toggleEditConsultantModal = () => {
  if (isEditConsultantModalOpen.value) activeConsultant.value = null
  isEditConsultantModalOpen.value = !isEditConsultantModalOpen.value
}
const editConsultantLoading: Ref<boolean> = ref(false)
const openEditConsultantModal = (index: number) => {
  if (!consultants.value) return

  activeConsultant.value = (consultants.value)[index]
  editBioRef.value = activeConsultant.value?.bio
  editServicesRef.value = activeConsultant.value?.services?.join(", ")
  editSpecializationsRef.value = activeConsultant.value?.specializations
  isEditConsultantModalOpen.value = true
}

// Function to update a consultant's details
const editConsultant = async () => {
  // Validations
  if (!consultants.value || !activeConsultant.value) return
  if (!editBioRef.value || !editServicesRef.value || !editSpecializationsRef.value) return Notify.failure("Please enter all fields")

  const bio = editBioRef.value
  const specializations = editSpecializationsRef.value
  // Split services into an array
  const services = editServicesRef.value.split(",").map((service) => service.trim())

  // Send update consultant request
  const response = await consultantRequests().updateConsultant({ id: activeConsultant.value.id, bio, services, specializations }, editConsultantLoading)
  if (!response.success) return Notify.failure(response.message)

  // Update consultants in store
  const index = consultants.value?.findIndex((consultant) => consultant.id === response.data.id)
  consultants.value[index] = response.data

  // reset form
  resetEditConsultantForm()

  // Close Modal
  toggleEditConsultantModal()

  // Display toast notification
  Notify.success(response.message)
}

const resetEditConsultantForm = () => {
  editBioRef.value = ""
  editServicesRef.value = ""
  editSpecializationsRef.value = []
}

// Delete Consultant Controls
const deleteConsultant = (index: number) => {
  if (!consultants.value) return

  const activeConsultant = consultants.value[index]

  // Display a confirmation dialog
  Confirm.show('Delete Consultant', 'Are you sure you want to delete this consultant?', 'Yes', 'Cancel', async () => {
    Loading.dots('Deleting Consultant...')
    const response = await consultantRequests().deleteConsultant(activeConsultant.id)
    Loading.remove()

    if (response.success) {
      // Update consultants in store
      const newConsultants = (consultants.value)?.filter((consultant) => consultant.id !== activeConsultant.id) as ConsultantInterface[]
      setConsultants(newConsultants)
      // Display toast notification
      Notify.success('Consultant deleted successfully');
      return
    }

    // Display error notification, if any
    Notify.failure(response.message)
  })
}

// Consultant Table Controls
const headings: Ref<string[]> = ref([]);
const data: Ref<ConsultantInterface[]> = ref([]);
const populateConsultantsTable = (consultants: ConsultantInterface[] | undefined) => {
  if (!consultants) return

  headings.value = Object.keys(consultants[0]).filter((value) => value !== 'user')

  consultants.map((consultant) => delete consultant.user)
  data.value = consultants
}

onMounted(async () => {
  if (!categories.value) {
    const response = await consultantRequests().getConsultantCategories()
    if (!response.success) Notify.failure(response.message)
    else categories.value = response.data
  }

  // Fetch consultants and populate consultants table
  if (!consultants.value) {
    Loading.hourglass();
    const response = await consultantRequests().getAllConsultants();
    Loading.remove();

    if (!response.success) return Notify.failure(response.message);

    if (response.data.length > 0) {
      setConsultants(response.data)
    }
    return
  }

  populateConsultantsTable(consultants.value)
})
</script>

<template>
  <h2 class="text-lg font-medium mb-5">Consultants</h2>

  <!-- Add Consultant Modal -->
  <div class="w-[80vw] flex justify-end mb-3">
    <custom-modal title="Add Consultant" :is-modal-open="isAddConsultantModalOpen" :loading="addConsultantLoading"
      :toggle-modal="toggleAddConsultantModal" type="button">
      <template #button>Add Consultant</template>
      <template #body>
        <form class="flex flex-col p-6 space-y-6" @submit.prevent="addConsultant">
          <select
            class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
            v-model="addUserIdRef" placeholder="Enter User ID" aria-label="User ID">
            <option v-if="users?.length === 0" class="dark:bg-dark dark:text-light" value="">No User</option>
            <option class="dark:bg-dark dark:text-light" v-for="user in users" :key="user.id" :value="user.id">
              {{ user.full_name || user.id }}
            </option>
          </select>
          <input
            class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
            v-model="addBioRef" type="text" placeholder="Enter Bio" aria-label="Bio" />
          <input
            class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
            v-model="addServicesRef" type="text" placeholder="Enter Services" aria-label="Services" />
          <input
            class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
            :value="addSpecializationsRef" type="text" placeholder="Selected Specializations" aria-label="Specializations"
            readonly />

          <select
            class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
            v-model="addSpecializationsRef" aria-label="User ID" multiple>
            <option v-if="users?.length === 0" class="opacity-50" value="">No Specializations</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <input type="submit" hidden />
        </form>
      </template>
      <template #footer>
        <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <custom-button data-modal-hide="defaultModal" type="button" :handle-click="addConsultant"
            :loading="addConsultantLoading" class="text-sm">Save</custom-button>
          <button data-modal-hide="defaultModal" type="button" @click="toggleAddConsultantModal"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
        </div>
      </template>
    </custom-modal>
  </div>

  <!-- Consultant data table -->
  <div class="sm:overflow-scroll w-[80vw]">
    <custom-table :headings="headings" :data="data"
      :actions="[{ name: 'Update Consultant', func: openEditConsultantModal }, { name: 'Delete Consultant', func: deleteConsultant }]" />
  </div>

  <!-- Edit Consultant Modal -->
  <custom-modal title="Edit Consultant" :is-modal-open="isEditConsultantModalOpen" :loading="editConsultantLoading"
    :toggle-modal="toggleEditConsultantModal" type="button" button-class="hidden">
    <template #button>Edit Consultant</template>
    <template #body>
      <form class="flex flex-col p-6 space-y-6" @submit.prevent="editConsultant">
        <input
          class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
          v-model="editBioRef" type="text" placeholder="Enter New Bio" aria-label="Bio" />
        <input
          class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
          v-model="editServicesRef" type="text" placeholder="Enter New Services" aria-label="Services" />
        <input
          class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
          :value="editSpecializationsRef" type="text" placeholder="Selected Specializations" aria-label="Specializations"
          readonly />
        <select
          class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
          v-model="editSpecializationsRef" multiple>
          <option v-if="users?.length === 0" class="opacity-50" value="">No Specializations</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <input type="submit" hidden />
      </form>
    </template>
    <template #footer>
      <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
        <custom-button data-modal-hide="defaultModal" type="button" :handle-click="editConsultant"
          :loading="editConsultantLoading" class="text-sm">Save</custom-button>
        <button data-modal-hide="defaultModal" type="button" @click="toggleEditConsultantModal"
          class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
      </div>
    </template>
  </custom-modal>
</template>

