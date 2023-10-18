<script setup lang="ts">
import CustomModal from '@/components/simple/CustomModal.vue';
import CustomTable from '@/components/simple/CustomTable.vue';
import type { ConsultantInterface } from '@/interfaces';
import consultantRequests from '@/utils/apiRequests/consultant.requests';
import { Loading, Notify } from 'notiflix';
import { onMounted, ref, type Ref } from 'vue';

const consultants: Ref<ConsultantInterface[]> = ref([])
const activeConsultant: Ref<ConsultantInterface | null> = ref(null)

const headings: Ref<string[]> = ref([]);
const data: Ref<string[][]> = ref([]);

const isEditConsultantModalOpen: Ref<boolean> = ref(false)
const toggleEditConsultantModal = () => {
  if (isEditConsultantModalOpen.value) activeConsultant.value = null
  isEditConsultantModalOpen.value = !isEditConsultantModalOpen.value
}

const isAddConsultantModalOpen: Ref<boolean> = ref(false);
const toggleAddConsultantModal = () => isAddConsultantModalOpen.value = !isAddConsultantModalOpen.value

const populateConsultantsTable = () => {
  headings.value = Object.keys(consultants.value[0]).filter((value) => value !== 'user')

  const values = Object.values(consultants.value)
  values.forEach((row: any) => {
    delete row.user
    data.value.push(Object.values(row))
  })
}

const openEditConsultantModal = (index: number) => {
  activeConsultant.value = (consultants.value)[index]
  isEditConsultantModalOpen.value = true
}

onMounted(async () => {
  Loading.hourglass();

  const response = await consultantRequests().getAllConsultants();
  Loading.remove();

  if (!response.success) return Notify.failure(response.message);

  if (response.data.length > 0) {
    consultants.value = response.data as ConsultantInterface[]
    populateConsultantsTable()
  }
})
</script>

<template>
  <h2 class="text-lg font-medium mb-5">Consultants</h2>

  <!-- Add Consultant Modal -->
  <div class="w-[80vw] flex justify-end mb-3">
    <custom-modal title="Add Consultant" :is-modal-open="isAddConsultantModalOpen"
      :toggle-modal="toggleAddConsultantModal" type="button" class="text-sm">
      <template #button>Add Consultant</template>
      <template #body>
        <div class="p-6 space-y-6">
          Modal Body
        </div>
      </template>
      <template #footer>
        <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button data-modal-hide="defaultModal" type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I
            accept</button>
          <button data-modal-hide="defaultModal" type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
        </div>
      </template>
    </custom-modal>
  </div>

  <!-- Consultant data table -->
  <div class="sm:overflow-scroll w-[80vw]">
    <custom-table :headings="headings" :data="data"
      :actions="[{ name: 'Update Consultant', func: openEditConsultantModal }]" />
  </div>

  <!-- Edit Consultant Modal -->
  <custom-modal title="Edit Consultant" :is-modal-open="isEditConsultantModalOpen"
    :toggle-modal="toggleEditConsultantModal" type="button" class="hidden">
    <template #button>Edit Consultant</template>
    <template #body>
      <div class="p-6 space-y-6">
        User ID: {{ activeConsultant?.user_id }}
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

