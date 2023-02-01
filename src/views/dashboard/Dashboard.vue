<script setup lang="ts">
import { ref } from 'vue'
import { useMeta } from 'quasar'

const pageTitle = ref('Dashboard | The App')
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
  <q-page class="page-dashboard q-pa-md">
    <div class="row justify-between items-center">
      <h1 class="text-h6">Dashboard</h1>
    </div>
  </q-page>
</template>
