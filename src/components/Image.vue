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
</script>

<template>
  <div class="image-wrapper" :class="imgClass">
    <q-img loading="lazy" :src="path" fit="cover" position="50% 50%" :height="height" :ratio="ratio" />
  </div>
</template>

<style lang="scss" scoped>
.image-wrapper {
  overflow: hidden;
}
</style>
