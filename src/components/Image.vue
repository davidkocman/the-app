<script setup lang="ts">
withDefaults(
  defineProps<{
    path?: string
  }>(),
  {
    path: ''
  }
)
const imageUrl = import.meta.env.VITE_APP_TMDB_POSTER_URL
</script>

<template>
  <q-img loading="lazy" :src="imageUrl + path" />
</template>
