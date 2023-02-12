<script setup lang="ts">
withDefaults(
  defineProps<{
    path?: string
    height?: string
    imgClass?: string
  }>(),
  {
    path: '',
    height: 'auto',
    imgClass: ''
  }
)
const imageUrl = import.meta.env.VITE_APP_TMDB_POSTER_URL
</script>

<template>
  <q-img loading="lazy" :src="imageUrl + path" fit="cover" position="50% 50%" :height="height" :class="imgClass" />
</template>
