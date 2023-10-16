<script setup lang="ts">
import { ref } from 'vue';

import CustomButton from '@/components/simple/CustomButton.vue';
import authRequests from '@/utils/apiRequests/auth.requests';

const otp = ref('')
const otpRequested = ref(false);
const phoneNumber = ref('')

const loading = ref(false)

const authenticate = async () => {
  if (phoneNumber.value) {
    const response = await authRequests().requestOtp(phoneNumber)
    if (response.success) otpRequested.value = true

    console.log(response)
  }
}
</script>

<template>
  <div class="min-h-screen grid place-items-center justify-center">
    <div>
      <h1 class="text-3xl text-center font-black mb-5">Log in to Health360</h1>

      <form class="grid gap-3" @submit.prevent="authenticate">
        <input type="tel" minlength="10" maxlength="11"
          class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
          :disabled="otpRequested" v-model="phoneNumber" placeholder="Phone Number" aria-label="Phone Number" required />

        <input type="text" pattern="\d*"
          class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
          v-model="otp" placeholder="Enter OTP" aria-label="Enter OTP" :maxlength="6" :required="otpRequested"
          v-if="otpRequested" />

        <CustomButton :loading="loading" type="submit" class="mt-2">Submit</CustomButton>
      </form>
    </div>
  </div>
</template>
