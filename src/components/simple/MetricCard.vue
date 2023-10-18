<script setup lang="ts">
defineProps<{
  metric: string
  value: string
}>()
</script>

<template>
  <div
    class="flex justify-between bg-[linear-gradient(135deg,_#24303f_51%,_#aeb7c0_100%)] px-8 py-8 h-[150px] rounded-[20px] text-white">
    <div>
      <p className="text-xl md:text-lg lg:text-2xl mb-4">
        {{ metric }}
      </p>
      <p>{{ value }}</p>
    </div>
    <div className="bg-secondary flex justify-center items-center p-2 w-[50px] h-[50px] rounded-[15px]">
      <slot name="icon"></slot>
    </div>
  </div>
</template>