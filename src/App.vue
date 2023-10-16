<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavbarComponent from './components/layout/NavbarComponent.vue';

</script>

<template>
  <header>
    <navbar-component />
  </header>

  <main class="mt-24 ml-10 lg:ml-24">
    <RouterView />
  </main>
</template>
