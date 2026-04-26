<script setup lang="ts">
import { computed } from 'vue'
import useDroneStore from '@/store/drone'

const droneStore = useDroneStore()

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

const events = computed(() => {
  const frames = droneStore.getFrames
  if (!frames.length) return []

  const result: { time: string; msg: string; type: 'tip' | 'warn' }[] = []
  let lastTip = ''
  let lastWarn = ''

  for (const frame of frames) {
    const tip = frame.app.tip?.trim()
    const warn = frame.app.warn?.trim()

    if (tip && tip !== lastTip) {
      result.push({ time: fmtTime(frame.osd.flyTime), msg: tip, type: 'tip' })
      lastTip = tip
    }
    if (warn && warn !== lastWarn) {
      result.push({ time: fmtTime(frame.osd.flyTime), msg: warn, type: 'warn' })
      lastWarn = warn
    }
  }

  return result
})
</script>

<template>
  <q-card v-if="events.length" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-timeline-text-outline" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Flight events</span>
      <q-badge class="q-ml-sm" color="primary" outline :label="events.length" />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-sm events-scroll">
      <q-timeline color="primary" layout="dense">
        <q-timeline-entry
          v-for="(event, i) in events"
          :key="i"
          :subtitle="event.time"
          :color="event.type === 'warn' ? 'warning' : 'primary'"
          :icon="event.type === 'warn' ? 'warning' : 'info'"
        >
          <span :class="event.type === 'warn' ? 'text-warning' : ''">{{ event.msg }}</span>
        </q-timeline-entry>
      </q-timeline>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.events-scroll {
  max-height: 320px;
  overflow-y: auto;
}
</style>
