<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'
import useDroneLogParser from '@/composables/drone/useDroneLogParser'
import useDroneStore from '@/store/drone'

const $q = useQuasar()
const { parseFiles } = useDroneLogParser()
const droneStore = useDroneStore()
const uploaderRef = ref()

const formatDate = (iso: string) => dayjs(iso).format('DD.MM.YYYY, H:m')

const confirmRemove = (id: string) => {
  $q.dialog({
    title: 'Remove log',
    message: 'Are you sure you want to remove this flight log?',
    persistent: true,
    ok: { label: 'OK', color: 'negative', flat: true },
    cancel: { label: 'Cancel', color: 'primary', flat: true }
  }).onOk(() => droneStore.removeRecord(id))
}

const onAdded = async (files: readonly File[]) => {
  await parseFiles(Array.from(files))
  uploaderRef.value?.reset()
}
</script>

<template>
  <q-uploader
    ref="uploaderRef"
    label="Select .txt log file"
    accept=".txt"
    :max-files="1"
    auto-upload
    @added="onAdded"
    style="width: 100%"
  >
    <template #list>
      <q-list separator>
        <q-item v-for="record in droneStore.getRecords" :key="record.id" dense class="q-px-none">
          <q-item-section>
            <q-item-label lines="1" class="text-weight-bold">{{ formatDate(record.parsedAt) }}</q-item-label>
            <q-item-label caption> {{ record.frameCount ?? record.frames.length }} frames </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="delete" color="negative" @click="confirmRemove(record.id)" />
          </q-item-section>
        </q-item>

        <q-item v-if="!droneStore.getRecords.length">
          <q-item-section class="text-grey text-caption text-center"> No logs uploaded yet </q-item-section>
        </q-item>
      </q-list>
    </template>
  </q-uploader>
</template>
