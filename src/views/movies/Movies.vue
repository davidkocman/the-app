<script setup lang="ts">
import Movie from '@/views/movies/components/Movie.vue'
import Search from '@/views/movies/components/Search.vue'
</script>

<template>
  <q-page class="page-movies q-px-lg q-py-md">
    <div class="row justify-between items-center q-mb-sm">
      <h6 class="text-h6">Movies</h6>
    </div>
    <Search />
    <Movie />
  </q-page>
</template>
