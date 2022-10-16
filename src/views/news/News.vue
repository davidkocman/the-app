<script setup lang="ts">
import { ref } from 'vue'
import { useMeta } from 'quasar'

const pageTitle = ref('News | The App')
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
  <q-page class="page-news q-px-lg q-py-md">
    <div class="row justify-between items-center">
      <h1 class="text-h6">News</h1>
    </div>
  </q-page>
</template>
