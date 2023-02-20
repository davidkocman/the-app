<script setup lang="ts">
withDefaults(
  defineProps<{
    path?: string
    height?: string
    imgClass?: string
    ratio?: number
  }>(),
  {
    path: '',
    height: 'auto',
    imgClass: '',
    ratio: 16 / 9
  }
)
const imageUrl = import.meta.env.VITE_APP_TMDB_POSTER_URL
</script>

<template>
  <div class="image-wrapper" :class="imgClass">
    <q-img loading="lazy" :src="imageUrl + path" fit="cover" position="50% 50%" :height="height" :ratio="ratio" />
  </div>
</template>

<style lang="scss" scoped>
.image-wrapper {
  overflow: hidden;
}
</style>
