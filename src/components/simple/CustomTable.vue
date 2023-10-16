<script setup lang="ts">
defineProps<{
  headings: string[],
  data: (any)[][],
}>()
</script>

<template>
  <table class="shadow-lg bg-white border-collapse w-full">
    <tr>
      <th class="border text-left px-8 py-4 bg-darkBlue dark:bg-slate-700 text-light" v-for="heading in headings"
        :key="heading">{{ heading
        }}</th>
    </tr>

    <tr class="hover:bg-gray-50 focus:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:bg-gray-700"
      tabindex="0" v-for="row, i in data" :key="i">
      <td class="border px-8 py-4" v-for="item, j in row" :key="i + j">{{ item }}</td>
    </tr>
  </table>
</template>