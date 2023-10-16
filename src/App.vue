<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavbarComponent from './components/layout/NavbarComponent.vue';

</script>

<template>
  <header>
    <navbar-component />
  </header>

  <main class="mt-24 mx-10 lg:mx-56">
    <RouterView />
  </main>
</template>
