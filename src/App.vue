<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeMount } from 'vue'
import { useQuasar, useMeta } from 'quasar'
const $q = useQuasar()

onBeforeMount(() => {
  if (localStorage.getItem('the_app-mode') && localStorage.getItem('the_app-mode') === 'dark') {
    $q.dark.set(true)
  }
})

const pageTitle = ref('Welcome | The App')
useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Notes' },
      keywords: { name: 'keywords', content: 'notes, note, markdown, .md' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
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
