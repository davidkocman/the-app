<script setup lang="ts">
import { ref } from 'vue'
import { useMeta } from 'quasar'

const pageTitle = ref('News | The App')
useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'News' },
      keywords: { name: 'keywords', content: 'news' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})
</script>

<template>
  <q-page class="page-news q-py-md q-px-lg">
    <div class="row justify-between items-center">
      <h1 class="text-h6">News</h1>
    </div>
  </q-page>
</template>
