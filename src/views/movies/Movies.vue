<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMeta } from 'quasar'
import useMoviesStore from '@/store/movies'
import SearchResult from '@/views/movies/components/SearchResult.vue'
import BaseContent from '@/views/movies/components/BaseContent.vue'
import Search from '@/views/movies/components/Search.vue'

const pageTitle = ref('Movies | The App')
useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Movies' },
      keywords: { name: 'keywords', content: 'movies, motion pictures, series, tv, reviews, actors' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})

const moviesStore = useMoviesStore()
const { searchFor, searchResult } = storeToRefs(moviesStore)
</script>

<template>
  <q-page class="page-movies q-py-md q-px-lg">
    <div class="row justify-end items-center q-mb-sm">
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
    <BaseContent v-else />
    <footer class="absolute-bottom q-pa-sm text-center text-caption" style="color: var(--bg-muted)">
      Data source: themoviedb.org
    </footer>
  </q-page>
</template>

<style lang="scss" scoped>
.page-movies {
  footer {
    background-color: var(--bg-base);
  }
}
</style>
