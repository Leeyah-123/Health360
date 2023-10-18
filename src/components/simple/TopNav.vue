<script setup lang="ts">
defineProps<{
  isNavOpen: boolean,
  toggleNavOpen: () => void,
  isDark: boolean,
  toggleDark: () => void
}>()
</script>

<template>
  <div class="fixed flex justify-between z-30 inset-0 bottom-auto bg-light dark:bg-darkBlue p-5">
    <!-- Hamburger Icon -->
    <button aria-controls="primary-navigation" :aria-expanded="isNavOpen"
      class="lg:hidden h-10 w-10 p-2 rounded-md border border-dark dark:border-light transition-transform hover:scale-105 focus-visible:scale-105"
      @click="toggleNavOpen">
      <span class="sr-only">Menu</span>

      <!-- Menu Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-dark dark:fill-white">
        <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
      </svg>
    </button>

    <button :title="`Switch theme (currently on ${isDark ? 'dark' : 'light'} theme)`" @click="toggleDark()"
      class="h-10 w-10 p-2 rounded-md border border-dark dark:border-light ml-auto transition-transform hover:scale-105 focus-visible:scale-105">
      <!-- Sun Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-light" v-if="isDark" aria-hidden>
        <path
          d="M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13" />
      </svg>

      <!-- Moon Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" v-else aria-hidden>
        <path d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z" />
      </svg>
    </button>
  </div>
</template>