<script setup lang="ts">
import { ref } from 'vue'
import useDroneLogParser from '@/composables/drone/useDroneLogParser'

const { parseFiles } = useDroneLogParser()

const files = ref<File[] | null>(null)

const handleParse = async () => {
  if (!files.value?.length) return
  await parseFiles(files.value)
  files.value = null
}
</script>

<template>
  <div class="row q-mb-md items-center">
    <q-file v-model="files" multiple accept=".txt" label="Select .txt log files" outlined style="min-width: 320px">
    </q-file>
    <q-btn class="q-ml-sm" color="primary" label="Parse" :disable="!files?.length" @click="handleParse" />
  </div>
</template>
