<script setup lang="ts">
import useUserStore from '@/store/user'
import useAppStore from '@/store/app'
import { reactive } from 'vue'
import getErrorMessage from '@/utils/handleCatchErrors'

const userStore = useUserStore()
const appStore = useAppStore()
const userData = reactive({
  email: '',
  pass: ''
})

const handleSubmit = async () => {
  if (userData.email === '' || userData.pass.length === 0 || userData.pass.length < 6) {
    alert('error in registration data')
  }
  try {
    await userStore.registerUser(userData.email, userData.pass)
    alert('Verify your email address please')
  } catch (error) {
    appStore.reportError({ message: getErrorMessage(error) })
  }
}
</script>

<template>
  <q-page>
    <q-input outlined v-model="userData.email" type="email" label="email" />
    <q-input outlined v-model="userData.pass" type="password" label="Password" />
    <q-btn @click="handleSubmit">Register</q-btn>
  </q-page>
</template>
