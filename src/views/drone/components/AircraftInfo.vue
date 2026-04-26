<script setup lang="ts">
import { computed } from 'vue'
import useDroneStore from '@/store/drone'

const droneStore = useDroneStore()
const recover = computed(() => {
  const keys: (keyof typeof droneStore.getFrames[0]['recover'])[] = [
    'aircraftName', 'aircraftSn', 'cameraSn', 'rcSn', 'batterySn', 'appVersion'
  ]
  return droneStore.getFrames.find((f) => keys.every((k) => !!f.recover?.[k]))?.recover ?? null
})
</script>

<template>
  <q-card v-if="recover" flat bordered class="recover-card rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-quadcopter" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Aircraft info</span>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4">
          <div class="field-label">Aircraft</div>
          <div class="field-value text-weight-medium">{{ recover.aircraftName }}</div>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="field-label">Aircraft S/N</div>
          <div class="field-value">{{ recover.aircraftSn }}</div>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="field-label">Camera S/N</div>
          <div class="field-value">{{ recover.cameraSn }}</div>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="field-label">RC S/N</div>
          <div class="field-value">{{ recover.rcSn }}</div>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="field-label">Battery S/N</div>
          <div class="field-value">{{ recover.batterySn }}</div>
        </div>

        <div v-if="recover.appPlatform" class="col-12 col-sm-6 col-md-4">
          <div class="field-label">App</div>
          <div class="field-value">{{ recover.appPlatform }} {{ recover.appVersion }}</div>
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
</style>
