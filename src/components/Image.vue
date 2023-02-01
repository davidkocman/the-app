<script setup lang="ts">
withDefaults(
  defineProps<{
    path?: string
    height?: string
  }>(),
  {
    path: '',
    height: 'auto'
  }
)
const imageUrl = import.meta.env.VITE_APP_TMDB_POSTER_URL
</script>

<template>
  <q-img loading="lazy" :src="imageUrl + path" position="50% 0" fit="cover" :height="height" />
</template>
