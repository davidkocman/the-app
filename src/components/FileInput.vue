<script setup lang="ts">
import useFileInput from '@/composables/useFileInput'
const { updateFile } = useFileInput()
</script>
<template>
  <label class="file-input">
    <q-icon size="20px" name="photo_camera" color="white" />
    <input type="file" @change="updateFile($event)" />
  </label>
</template>

<style scoped lang="scss">
input {
  display: none;
}
</style>
