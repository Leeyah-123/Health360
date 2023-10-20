<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps<{
  title: string
  buttonClass?: string
  isModalOpen: boolean
  toggleModal: () => void
  loading?: boolean
}>()

watch(() => props.isModalOpen, (newValue) => {
  if (newValue === true) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = "revert"
  }
})
</script>

<template>
  <div>
    <!-- Modal toggle -->
    <button @click="toggleModal" aria-controls="defaultModal" data-modal-target="defaultModal"
      data-modal-toggle="defaultModal"
      class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      :class="$props.buttonClass" type="button">
      <slot name="button"></slot>
    </button>

    <div id="defaultModal" role="dialog" :aria-hidden="!isModalOpen"
      class="fixed top-0 left-0 right-0 z-30 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      :class="isModalOpen ? 'block' : 'hidden'">
      <div class="relative w-full max-w-2xl max-h-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <!-- Modal content -->
        <div class="relative bg-light rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>

            <!-- Close Modal Button -->
            <button type="button" @click="toggleModal" :disabled="loading"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="defaultModal">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <slot name="body"></slot>
          <!-- Modal footer -->
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>