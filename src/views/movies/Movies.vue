<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useMoviesStore from '@/store/movies'
import SearchResult from '@/views/movies/components/SearchResult.vue'
import Search from '@/views/movies/components/Search.vue'

const moviesStore = useMoviesStore()
const { searchFor, searchResult } = storeToRefs(moviesStore)
</script>

<template>
  <q-page class="page-movies q-pa-md">
    <div class="row justify-between items-center q-mb-sm">
      <h6 class="text-h6">Motion pictures</h6>
      <q-btn color="primary" icon="search" round size="sm">
        <q-menu class="q-px-sm">
          <div class="q-py-md q-gutter-sm">
            <div class="q-gutter-sm">
              <q-radio dense v-model="searchFor" val="movie" label="Movie" />
              <q-radio dense v-model="searchFor" val="tv" label="TV Show" />
            </div>
          </div>
          <Search />
        </q-menu>
      </q-btn>
    </div>
    <SearchResult v-if="searchResult" />
    <footer class="absolute-bottom q-pa-sm text-center text-caption" style="color: var(--bg-muted)">
      Data source: themoviedb
    </footer>
  </q-page>
</template>

<style lang="scss" scoped>
.movie-tab,
.tv-show-tab {
  background-color: var(--bg-base);
}
</style>
