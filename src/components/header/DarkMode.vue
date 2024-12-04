<script setup lang="ts">
import useAppStore from '@/store/app'

import { useQuasar } from 'quasar'

const $q = useQuasar()
const appStore = useAppStore()

const toggleDarkMode = () => {
  $q.dark.toggle()
  if ($q.dark && $q.dark.isActive) {
    localStorage.setItem('the_app-mode', 'dark')
    return
  }
  localStorage.setItem('the_app-mode', 'light')
}
</script>

<template>
  <q-btn v-if="appStore.isDarkMode" flat round dense icon="light_mode" @click="toggleDarkMode">
    <q-tooltip> Light mode </q-tooltip>
  </q-btn>
  <q-btn v-else flat round dense icon="dark_mode" @click="toggleDarkMode">
    <q-tooltip> Dark mode </q-tooltip>
  </q-btn>
</template>
