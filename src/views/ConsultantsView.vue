<script setup lang="ts">
import { Confirm, Loading, Notify } from 'notiflix';
import { computed, onMounted, ref, type Ref } from 'vue';

import CustomButton from '@/components/simple/CustomButton.vue';
import CustomModal from '@/components/simple/CustomModal.vue';
import CustomTable from '@/components/simple/CustomTable.vue';

import type { ConsultantInterface } from '@/interfaces';
import { useConsultantsStore } from '@/stores/consultants.store';
import consultantRequests from '@/utils/apiRequests/consultant.requests';

// Consultants store
const consultantsStore = useConsultantsStore();
const consultants = computed(() => consultantsStore.consultants);
const setConsultants = (newConsultants: ConsultantInterface[]) => {
  populateConsultantsTable(newConsultants)
  consultantsStore.setConsultants(newConsultants)
}

const activeConsultant: Ref<ConsultantInterface | null> = ref(null)

// Add Consultant Controls
const addUserIdRef = ref('')
const addBioRef = ref('')
const addServicesRef = ref('')
const addSpecializationsRef = ref('')

const isAddConsultantModalOpen: Ref<boolean> = ref(false);
const toggleAddConsultantModal = () => isAddConsultantModalOpen.value = !isAddConsultantModalOpen.value
const addConsultantLoading: Ref<boolean> = ref(false)
const addConsultant = async () => {
  if (!consultants.value) return

  if (!addUserIdRef.value || !addBioRef.value || !addServicesRef.value || !addSpecializationsRef.value) return Notify.failure("Please enter all fields")

  const services = addServicesRef.value.split(",").map((service) => service.trim())
  const specializations = addSpecializationsRef.value.split(",").map((specialization) => specialization.trim())

  const response = await consultantRequests().addConsultant({ user_id: addUserIdRef.value, bio: addBioRef.value, services, specializations }, addConsultantLoading)
  if (!response.success) return Notify.failure(response.message)

  const newConsultants = [...consultants.value, response.data]
  setConsultants(newConsultants)

  addUserIdRef.value = ""
  addBioRef.value = ""
  addServicesRef.value = ""
  addSpecializationsRef.value = ""

  toggleAddConsultantModal()
  Notify.success(response.message)
}

// Edit Consultant Controls
const editBioRef = ref('')
const editServicesRef = ref('')
const editSpecializationsRef = ref('')

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
  editSpecializationsRef.value = activeConsultant.value?.specializations?.join(", ")
  isEditConsultantModalOpen.value = true
}
const editConsultant = async () => {
  if (!consultants.value || !activeConsultant.value) return

  if (!editBioRef.value || !editServicesRef.value || !editSpecializationsRef.value) return Notify.failure("Please enter all fields")

  const bio = editBioRef.value
  const services = editServicesRef.value.split(",").map((service) => service.trim())
  const specializations = editSpecializationsRef.value.split(",").map((specialization) => specialization.trim())


  const response = await consultantRequests().updateConsultant({ id: activeConsultant.value.id, bio, services, specializations }, editConsultantLoading)
  if (!response.success) return Notify.failure(response.message)

  const index = consultants.value?.findIndex((consultant) => consultant.id === response.data.id)
  consultants.value[index] = response.data
  toggleEditConsultantModal()

  editBioRef.value = ""
  editServicesRef.value = ""
  editSpecializationsRef.value = ""

  Notify.success(response.message)
}

// Delete Consultant Controls
const deleteConsultant = (index: number) => {
  if (!consultants.value) return

  const activeConsultant = consultants.value[index]
  Confirm.show('Delete Consultant', 'Are you sure you want to delete this consultant?', 'Yes', 'Cancel', async () => {
    Loading.dots('Deleting Consultant...')
    const response = await consultantRequests().deleteConsultant(activeConsultant.id)
    Loading.remove()

    if (response.success) {
      const newConsultants = (consultants.value)?.filter((consultant) => consultant.id !== activeConsultant.id) as ConsultantInterface[]
      setConsultants(newConsultants)
      Notify.success('Consultant deleted successfully');
      return
    }

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
          <input
            class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
            v-model="addUserIdRef" type="text" placeholder="Enter User ID" aria-label="User ID" />
          <input
            class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
            v-model="addBioRef" type="text" placeholder="Enter Bio" aria-label="Bio" />
          <input
            class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
            v-model="addServicesRef" type="text" placeholder="Enter Services" aria-label="Services" />
          <input
            class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
            v-model="addSpecializationsRef" type="text" placeholder="Enter Specializations"
            aria-label="Specializations" />

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
          v-model="editSpecializationsRef" type="text" placeholder="Enter New Specializations"
          aria-label="Specializations" />

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

