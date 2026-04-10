<script setup lang="ts">
import { ref } from 'vue'
import { useMeta } from 'quasar'
import useDroneStore from '@/store/drone'
import useDroneLogParser from '@/composables/drone/useDroneLogParser'

const pageTitle = ref('Drone flight data | The App')

useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Drone flight data' },
      keywords: { name: 'keywords', content: 'drone, dji, flight, data' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})

const droneStore = useDroneStore()
const { parseFiles } = useDroneLogParser()

const files = ref<File[] | null>(null)

const handleParse = async () => {
  if (!files.value?.length) return
  await parseFiles(files.value)
  files.value = null
}
</script>

<template>
  <q-page class="page-drone q-py-md q-px-lg">
    <div class="row q-mb-lg items-center justify-between">
      <h1 class="text-h4 q-my-none">Flight log</h1>
    </div>

    <div class="row q-mb-md items-center">
      <q-file
        v-model="files"
        multiple
        accept=".txt"
        label="Select .txt log files"
        outlined
        style="min-width: 320px"
      >
        <template #prepend>
          <q-icon name="mdi-quadcopter" />
        </template>
      </q-file>
      <q-btn
        class="q-ml-sm"
        color="primary"
        label="Parse"
        :disable="!files?.length"
        @click="handleParse"
      />
    </div>

    <q-list bordered separator v-if="droneStore.getRecords.length">
      <q-expansion-item
        v-for="record in droneStore.getRecords"
        :key="record.id"
        :label="record.fileName"
        :caption="`${record.frames.length} frames · ${record.parsedAt}`"
        expand-separator
      >
        <q-card>
          <q-card-section>
            <pre class="text-caption">{{ JSON.stringify(record.frames[0], null, 2) }}</pre>
          </q-card-section>
          <q-card-actions>
            <q-btn
              flat
              color="negative"
              icon="delete"
              label="Remove"
              @click="droneStore.removeRecord(record.id)"
            />
          </q-card-actions>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div v-else class="text-grey text-center q-mt-xl">
      No flight records yet. Upload .txt log files to get started.
    </div>
  </q-page>
</template>
