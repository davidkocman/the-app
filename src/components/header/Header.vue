<script setup lang="ts">
import useAppStore from '@/store/app'
import useUserStore from '@/store/user'
import DarkMode from '@/components/header/DarkMode.vue'

const appStore = useAppStore()
const userStore = useUserStore()
</script>

<template>
  <q-header>
    <q-toolbar>
      <q-btn flat round dense icon="menu" class="q-mr-sm" @click="appStore.drawer = !appStore.drawer"></q-btn>
      <!-- <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar> -->
      <q-toolbar-title>the App</q-toolbar-title>
      <DarkMode />
      <q-btn flat round dense icon="logout" @click="userStore.logoutUser">
        <q-tooltip> Logout </q-tooltip>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>
