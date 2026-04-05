<script setup lang="ts">
import { ref } from 'vue'
import { useMeta } from 'quasar'

import WeatherWidget from './components/WeatherWidget.vue'
import GamesWidget from './components/GamesWidget.vue'
import GameDetail from '@/views/games/components/GameDetail.vue'

const pageTitle = ref('Dashboard | The App')
useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Dashboard' },
      keywords: { name: 'keywords', content: 'dashboard' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})
</script>

<template>
  <q-page class="page-dashboard q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h1 class="text-h6">Dashboard</h1>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <WeatherWidget />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <GamesWidget />
      </div>
    </div>

    <GameDetail />
  </q-page>
</template>
