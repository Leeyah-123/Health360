<script setup lang="ts">

defineProps<{
  headings: string[],
  data: (any)[][],
  actions: { name: string, func: () => void }[]
}>()
</script>

<template>
  <p v-if="data.length === 0" class="text-xl font-bold">No record found</p>

  <div class="flex items-center ml-4 sm:ml-0 w-full" v-else>
    <table class="text-sm border-separate border-spacing-y-2 w-full">
      <thead class="hidden sm:contents">
        <tr class="tr-class">
          <th class="th-class" v-for="heading in headings" :key="heading">{{ heading }}</th>
          <th v-if="actions.length > 0" class="th-class">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        <tr class="tr-class" tabindex="0" v-for="row, i in data" :key="i">
          <td class="td-class" v-for="item, j in row" :key="i + j">
            <span
              class="font-bold text-xs text-gray-700 uppercase sm:hidden absolute top-0 inset-x-0 p-1 bg-gray-300 pl-2">
              {{ headings[j] }}
            </span>

            {{ Array.isArray(item) ? item.join(', ') : item ? item : 'nil' }}
          </td>
          <td class="td-class relative" v-if="actions.length > 0">
            <button
              class="action-btn float-right rounded-md bg-green-600/50 px-6 py-3 text-xs font-semibold uppercase text-green-900 antialiased">Actions</button>

            <div id="dropdown"
              class="hidden hover:block z-10 top-0 left-1/2 lg:top-auto lg:-left-1/2 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
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
      </tbody>
    </table>
  </div>
</template>