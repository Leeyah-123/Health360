<script setup lang="ts">
defineProps<{
  isNavOpen: boolean,
  toggleNavOpen: () => void,
}>()
</script>

<template>
  <ul
    class="z-30 -translate-x-[100%] transition-transform bg-darkBlue text-light p-5 fixed inset-0 right-auto lg:translate-x-0"
    :class="isNavOpen && 'translate-x-0'" id="primary-navigation">
    <div class="flex p-2 mb-2 place-items-center">
      <h1 class="text-2xl text-primary mr-3">Health360</h1>

      <button aria-controls="primary-navigation" class="lg:hidden h-8 w-8 place-content-center" @click="toggleNavOpen">
        <span class="sr-only">Close Menu</span>

        <!-- Close Menu Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-light">
          <title>Close Menu</title>
          <path
            d="M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z" />
        </svg>
      </button>
    </div>

    <h2 class="uppercase text-secondary p-2 mb-2 mt-4">Menu</h2>

    <div class="flex flex-col h-full gap-2" :aria-hidden="!isNavOpen">
      <li class="w-full p-2">
        <RouterLink to="/dashboard" aria-label="Home" @click="toggleNavOpen" class="flex gap-2 place-items-center "
          active-class="active">
          <img src="../../assets/icons/view-dashboard.svg" alt="" class="h-7 w-7" />
          Dashboard
        </RouterLink>
      </li>
      <li class="w-full p-2 active:bg-slate-600">
        <RouterLink to="/users" aria-label="Users" @click="toggleNavOpen" class="flex gap-2 place-items-center"
          active-class="active">
          <img src="../../assets/icons/users.svg" alt="" class="h-7 w-7" />
          Users
        </RouterLink>
      </li>
      <li class="w-full p-2">
        <RouterLink to="/consultants" aria-label="Consultants" @click="toggleNavOpen"
          class="flex gap-2 place-items-center" active-class="active">
          <img src="../../assets/icons/consultant.svg" alt="" class="h-7 w-7" />
          Consultants
        </RouterLink>
      </li>
    </div>
  </ul>
</template>