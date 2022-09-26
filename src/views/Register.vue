<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { reactive } from 'vue'

const userStore = useUserStore()
const userData = reactive({
  email: '',
  pass: ''
})
</script>

<template>
  <q-page>
    <q-input outlined v-model="userData.email" type="email" label="email" />
    <q-input outlined v-model="userData.pass" type="password" label="Password" />
    <q-btn @click="userStore.registerUser(userData.email, userData.pass)">Register</q-btn>
  </q-page>
</template>
