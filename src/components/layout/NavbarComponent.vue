<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { ref } from 'vue';
import SideNav from '../simple/SideNav.vue';
import TopNav from '../simple/TopNav.vue';

const isNavOpen = ref(false);
const toggleNavOpen = () => isNavOpen.value = !isNavOpen.value


const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <nav>
    <!-- Top Nav -->
    <top-nav :is-nav-open="isNavOpen" :is-dark="isDark" :toggle-dark="toggleDark" :toggle-nav-open="toggleNavOpen" />

    <!-- Side Nav -->
    <side-nav :is-nav-open="isNavOpen" :toggle-nav-open="toggleNavOpen" />

  </nav>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>