<script setup lang="ts">
import { computed } from 'vue'
import useDroneStore from '@/store/drone'

const droneStore = useDroneStore()

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

const fmtCoord = (v: number) => v.toFixed(6)

const events = computed(() => {
  const frames = droneStore.getFrames
  if (!frames.length) return []

  const result: { time: string; type: 'photo' | 'video_start' | 'video_stop'; lat: string; lon: string }[] = []
  let prevPhoto = false
  let prevVideo = false

  for (const frame of frames) {
    const { isPhoto, isVideo } = frame.camera
    const { flyTime, latitude, longitude } = frame.osd

    if (isPhoto && !prevPhoto) {
      result.push({ time: fmtTime(flyTime), type: 'photo', lat: fmtCoord(latitude), lon: fmtCoord(longitude) })
    }
    if (isVideo && !prevVideo) {
      result.push({ time: fmtTime(flyTime), type: 'video_start', lat: fmtCoord(latitude), lon: fmtCoord(longitude) })
    }
    if (!isVideo && prevVideo) {
      result.push({ time: fmtTime(flyTime), type: 'video_stop', lat: fmtCoord(latitude), lon: fmtCoord(longitude) })
    }

    prevPhoto = isPhoto
    prevVideo = isVideo
  }

  return result
})

const eventIcon = (type: string) => {
  if (type === 'photo') return 'photo_camera'
  if (type === 'video_start') return 'videocam'
  return 'videocam_off'
}

const eventLabel = (type: string) => {
  if (type === 'photo') return 'Photo'
  if (type === 'video_start') return 'Video start'
  return 'Video stop'
}

const eventColor = (type: string) => {
  if (type === 'photo') return 'primary'
  if (type === 'video_start') return 'positive'
  return 'negative'
}
</script>

<template>
  <q-card v-if="events.length" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="photo_camera" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Camera events</span>
      <q-badge class="q-ml-sm" color="primary" outline :label="events.length" />
    </q-card-section>

    <q-separator />

    <q-list dense class="events-scroll">
      <q-item v-for="(event, i) in events" :key="i">
        <q-item-section avatar>
          <q-icon :name="eventIcon(event.type)" :color="eventColor(event.type)" size="20px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">{{ eventLabel(event.type) }}</q-item-label>
          <q-item-label caption class="font-mono">{{ event.lat }}, {{ event.lon }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ event.time }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<style lang="scss" scoped>
.events-scroll {
  max-height: 320px;
  overflow-y: auto;
}

.font-mono {
  font-family: monospace;
}
</style>
