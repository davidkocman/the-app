<script setup lang="ts">
import { useMoviesStore } from '@/store/movies'
import { useAppStore } from '@/store/app'
import Image from '@/components/Image.vue'

const appStore = useAppStore()
const moviesStore = useMoviesStore()
</script>

<template>
  <div class="row">
    <div class="col">
      <template v-if="appStore.loading && moviesStore.movie !== null">
        <q-skeleton width="200px" type="text" />
        <q-skeleton type="text" />
        <q-skeleton width="100px" type="text" />
      </template>
      <template v-else>
        <h3 class="text-h6">{{ moviesStore.movie?.title }}</h3>
        <p class="text-body2">
          {{ moviesStore.movie?.overview }}
        </p>
      </template>
    </div>
    <div class="col">
      <template v-if="appStore.loading">
        <q-skeleton height="200px" square />
      </template>
      <template v-else>
        <Image v-if="moviesStore.movie?.backdrop_path" :path="moviesStore.movie?.backdrop_path" />
      </template>
    </div>
  </div>
</template>
