<script setup lang="ts">
import { useMoviesStore } from '@/store/movies'
import Movie from '@/views/movies/components/Movie.vue'
import TvShow from '@/views/movies/components/TvShow.vue'
import Search from '@/views/movies/components/Search.vue'

const moviesStore = useMoviesStore()
</script>

<template>
  <q-page class="page-movies q-px-lg q-py-md">
    <div class="row justify-between items-center q-mb-sm">
      <h6 class="text-h6">Movies</h6>
    </div>
    <Search />
    <Movie v-if="moviesStore.movie" />
    <TvShow v-if="moviesStore.tvShow" />
  </q-page>
</template>
