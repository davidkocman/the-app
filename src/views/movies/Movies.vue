<script setup lang="ts">
import { useMoviesStore } from '@/store/movies'
import { storeToRefs } from 'pinia'
import Movie from '@/views/movies/components/Movie.vue'
import TvShow from '@/views/movies/components/TvShow.vue'
import Search from '@/views/movies/components/Search.vue'

const moviesStore = useMoviesStore()
const { movie, tvShow, searchFor } = storeToRefs(moviesStore)
</script>

<template>
  <q-page class="page-movies q-pa-md">
    <div class="row justify-between items-center q-mb-sm">
      <h6 class="text-h6">Motion pictures</h6>
    </div>
    <div style="max-width: 600px">
      <q-tabs
        v-model="searchFor"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="movie" label="Movie" />
        <q-tab name="tv" label="TV Show" />
      </q-tabs>
    </div>
    <q-separator />
    <Search />
    <q-tab-panels v-model="searchFor" animated transition-next="fade" transition-prev="fade">
      <q-tab-panel name="movie" class="q-pa-none">
        <Movie v-if="movie" />
      </q-tab-panel>
      <q-tab-panel name="tv" class="q-pa-none">
        <TvShow v-if="tvShow" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
