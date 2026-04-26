<script setup lang="ts">
import { computed } from 'vue'
import useDroneStore from '@/store/drone'
import { msToKmh } from '@/utils/helpers'

const droneStore = useDroneStore()

const summary = computed(() => {
  const frames = droneStore.getFrames
  if (!frames.length) return null
  const last = frames[frames.length - 1].osd
  const first = frames[0].osd
  const flyTime = last.flyTime
  const m = Math.floor(flyTime / 60)
  const s = Math.floor(flyTime % 60)
  const droneType = typeof first.droneType === 'string' ? first.droneType : '—'
  return {
    flyTime: `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    maxHeight: last.heightMax.toFixed(1),
    maxHSpeed: Math.max(last.xSpeedMax, last.ySpeedMax).toFixed(1),
    maxHSpeedKmh: msToKmh(Math.max(last.xSpeedMax, last.ySpeedMax)),
    maxVSpeed: last.zSpeedMax.toFixed(1),
    maxVSpeedKmh: msToKmh(last.zSpeedMax),
    droneType
  }
})
</script>

<template>
  <q-card v-if="summary" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-airplane-takeoff" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Flight summary</span>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-md">
      <div class="row q-col-gutter-md">
        <div class="col-6 col-sm-4">
          <div class="field-label">Fly time</div>
          <div class="field-value text-weight-medium">{{ summary.flyTime }}</div>
        </div>

        <div class="col-6 col-sm-4">
          <div class="field-label">Max height</div>
          <div class="field-value">{{ summary.maxHeight }} <span class="unit">m</span></div>
        </div>

        <div class="col-6 col-sm-4">
          <div class="field-label">Max H speed</div>
          <div class="field-value">{{ summary.maxHSpeed }} <span class="unit">m/s</span> <span class="unit">({{ summary.maxHSpeedKmh }} km/h)</span></div>
        </div>

        <div class="col-6 col-sm-4">
          <div class="field-label">Max V speed</div>
          <div class="field-value">{{ summary.maxVSpeed }} <span class="unit">m/s</span> <span class="unit">({{ summary.maxVSpeedKmh }} km/h)</span></div>
        </div>

        <div class="col-6 col-sm-4">
          <div class="field-label">Drone type</div>
          <div class="field-value">{{ summary.droneType }}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.field-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.5;
  margin-bottom: 2px;
}

.field-value {
  font-size: 13px;
  font-family: monospace;
}

.unit {
  font-size: 11px;
  opacity: 0.6;
}
</style>
