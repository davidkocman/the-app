<script setup lang="ts">
import Header from '@/components/header/Header.vue'
import Drawer from '@/components/drawer/Drawer.vue'
</script>

<template>
  <q-layout>
    <Header />
    <Drawer />
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>
