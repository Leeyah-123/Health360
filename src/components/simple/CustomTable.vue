<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  headings: string[],
  data: (any)[][],
  actions: { name: string, func: () => void }[]
}>()

const dropDownOpen = ref(false);
const toggleDropDown = () => dropDownOpen.value = !dropDownOpen.value
</script>

<template>
  <p v-if="data.length === 0" class="text-xl font-bold">No record found</p>

  <table v-else class="shadow-lg bg-white border-collapse">
    <tr>
      <th class="border text-left px-8 py-4 bg-darkBlue dark:bg-slate-700 text-light" v-for="heading in headings"
        :key="heading">{{ heading }}</th>
      <th v-if="actions.length > 0" class="border text-left px-8 py-4 bg-darkBlue dark:bg-slate-700 text-light">Actions
      </th>
    </tr>


    <tr class="hover:bg-gray-50 focus:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:bg-gray-700"
      tabindex="0" v-for="row, i in data" :key="i">
      <td class="border px-8 py-4" v-for="item, j in row" :key="i + j">{{ item ? item : 'nil' }}</td>
      <td class="border px-8 py-4 ml-5 relative" v-if="actions.length > 0">
        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" @click="toggleDropDown"
          class="w-fit h-fit cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="dark:fill-white h-6 w-6">
            <title>View Actions</title>
            <path
              d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
          </svg>
        </button>

        <div id="dropdown"
          class="z-10 -left-1/2 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          :class="dropDownOpen ? 'block' : 'hidden'">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li v-for="action in actions" :key="action.name">
              <button @click="action.func"
                class="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{{
                  action.name
                }}</button>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  </table>
</template>