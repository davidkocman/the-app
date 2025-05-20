<script setup lang="ts">
import { ref } from 'vue'
import { useMeta } from 'quasar'

// components
import UpcomingGames from './components/UpcomingGames.vue'
import GameDetail from './components/GameDetail.vue'

const pageTitle = ref('Upcoming games | The App')

useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Invoices' },
      keywords: { name: 'keywords', content: 'invoices, invoice, download, companies' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})
</script>

<template>
  <q-page class="page-games q-pa-md">
    <div class="row justify-between items-center q-mb-sm">
      <h1 class="text-h6">Games</h1>
    </div>
    <div class="row">
      <div class="col">
        <UpcomingGames />
      </div>
    </div>
    <GameDetail />
  </q-page>
</template>
