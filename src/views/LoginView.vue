<script setup lang="ts">
import { ref } from 'vue';

import CustomButton from '@/components/simple/CustomButton.vue';
import authRequests from '@/utils/apiRequests/auth.requests';
import { Notify } from 'notiflix';
import { useRouter } from 'vue-router';

const router = useRouter()

const otp = ref('')
const otpRequested = ref(false);
const phoneNumber = ref('')

const loading = ref(false)

const authenticate = async () => {
  if (otpRequested.value) {
    const response = await authRequests().login({ otp, phoneNumber }, loading)
    if (response.success) {
      Notify.success("Login successful")
      router.push("/dashboard")
    } else Notify.failure(response.message)
  } else {
    const response = await authRequests().requestOtp(phoneNumber, loading)
    if (response.success) {
      Notify.success(response.data.message)
      otpRequested.value = true
    } else Notify.failure(response.message)
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
          :disabled="otpRequested" v-model="phoneNumber" placeholder="e.g. 9058490987" aria-label="Phone Number"
          required />

        <input type="text" pattern="\d*"
          class="px-2 py-3 w-full rounded-md outline outline-1 outline-slate-400 hover:outline-slate-600 focus-visible:outline-[3px] dark:hover:outline-slate-100 transition-shadow duration-700 bg-transparent"
          v-model="otp" placeholder="Enter OTP" aria-label="Enter OTP" :minlength="4" :maxlength="4"
          :required="otpRequested" v-if="otpRequested" />

        <CustomButton :loading="loading" type="submit" class="mt-2">Submit</CustomButton>
      </form>
    </div>
  </div>
</template>
