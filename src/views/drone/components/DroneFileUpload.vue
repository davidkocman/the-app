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

const formatFileName = (fileName: string) => {
  const match = fileName.match(/(\d{4}-\d{2}-\d{2})_\[(\d{2})-(\d{2})-(\d{2})\]/)
  if (!match) return fileName
  const [, date, hh, mm] = match
  return dayjs(`${date} ${hh}:${mm}`).format('D.M.YYYY, H:mm')
}

const confirmRemove = (id: string, parsedAt: string) => {
  $q.dialog({
    title: 'Remove log',
    message: `Are you sure you want to remove the ${formatDate(parsedAt)} flight log?`,
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
    :max-files="6"
    multiple
    auto-upload
    @added="onAdded"
    style="width: 100%"
  >
    <template #list>
      <q-list separator>
        <q-item v-for="record in droneStore.getRecords" :key="record.id" class="q-px-none">
          <q-item-section>
            <q-item-label lines="1" class="text-weight-bold">{{ formatFileName(record.fileName) }}</q-item-label>
            <q-item-label caption class="">{{ record.frameCount }} frames</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row no-wrap">
              <q-btn
                flat
                round
                dense
                :icon="droneStore.activeRecordId === record.id ? 'mdi-eye-check-outline' : 'mdi-eye-outline'"
                color="primary"
                title="Load frames"
                @click="droneStore.activeRecordId !== record.id && droneStore.loadFrames(record)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                title="Remove log"
                @click="confirmRemove(record.id, record.parsedAt)"
              />
            </div>
          </q-item-section>
        </q-item>

        <q-item v-if="!droneStore.getRecords.length">
          <q-item-section class="text-grey text-caption text-center"> No logs uploaded yet </q-item-section>
        </q-item>
      </q-list>
    </template>
  </q-uploader>
</template>
