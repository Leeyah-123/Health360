<script setup lang="ts">
import NavbarComponent from "@/components/layout/NavbarComponent.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <header>
    <navbar-component />
  </header>

  <main class="mt-24 mx-10 lg:mx-56">
    <RouterView />
  </main>
</template>
