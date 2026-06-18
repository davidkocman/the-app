<script setup lang="ts">
import { ref } from 'vue'
import { useMeta } from 'quasar'

import WeatherWidget from './components/WeatherWidget.vue'
import GamesWidget from './components/GamesWidget.vue'
import MoviesWidget from './components/MoviesWidget.vue'
import NotesWidget from './components/NotesWidget.vue'
import GameDetail from '@/views/games/components/GameDetail.vue'
import MovieDetailDialog from '@/views/movies/components/MovieDetailDialog.vue'

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
  <q-page class="page-dashboard q-py-md q-px-lg">
    <div class="row justify-between items-center q-mb-lg">
      <h1 class="text-h4 q-my-none flex items-center" style="gap: 10px"><q-icon name="dashboard" />Dashboard</h1>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <WeatherWidget />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <GamesWidget />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <MoviesWidget />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <NotesWidget />
      </div>
    </div>

    <GameDetail />
    <MovieDetailDialog />
  </q-page>
</template>

<style lang="scss" scoped>
.page-dashboard {
  padding-left: 6px;
  padding-right: 6px;

  @media (min-width: 768px) {
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
