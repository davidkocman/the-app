<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMeta } from 'quasar'
import useDroneStore from '@/store/drone'
import DroneFileUpload from './components/DroneFileUpload.vue'

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
onMounted(() => droneStore.fetchFlightLogs())
</script>

<template>
  <q-page class="page-drone q-py-md q-px-lg">
    <div class="row q-mb-lg items-center">
      <h1 class="text-h4 q-my-none">Flight log</h1>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <DroneFileUpload />
      </div>

      <div class="col-12 col-md"></div>
    </div>
  </q-page>
</template>
