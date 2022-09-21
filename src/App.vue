<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()

onBeforeMount(() => {
  if (localStorage.getItem('the_app-mode') && localStorage.getItem('the_app-mode') === 'dark') {
    $q.dark.set(true)
  }
})

</script>

<template>
  <router-view />
</template>

<style lang="scss">
@import '@/assets/scss/app.scss';

body {
  color: var(--text-base) !important;
}
</style>
