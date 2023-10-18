<script setup lang="ts">
defineProps<{
  type?: 'button' | 'reset' | 'submit'
  class?: string
  loading?: boolean
  handleClick?: () => void
}>()
</script>

<template>
  <button :type="type || 'button'" @click="handleClick"
    class="text-white bg-blue-700 disabled:opacity-50 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    :class="$props.class" :disabled="loading">
    <slot v-if="!loading"></slot>

    <span class="sr-only" v-if="loading">Loading</span>
    <svg v-if="loading" class="animate-spin h-5 w-5 my-1 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
      </path>
    </svg>
  </button>
</template>
