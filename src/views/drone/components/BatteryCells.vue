<script setup lang="ts">
import { computed } from 'vue'
import useDroneStore from '@/store/drone'

const droneStore = useDroneStore()

const CELL_MIN = 3.0
const CELL_MAX = 4.2

const data = computed(() => {
  const frame = droneStore.getFrames
    .slice()
    .reverse()
    .find((f) => f.battery.cellVoltages?.length)
  if (!frame) return null

  const { cellVoltages, cellVoltageDeviation, temperature } = frame.battery
  const cells = cellVoltages.map((v, i) => ({
    index: i + 1,
    voltage: v,
    pct: Math.min(100, Math.max(0, ((v - CELL_MIN) / (CELL_MAX - CELL_MIN)) * 100))
  }))

  const maxV = Math.max(...cellVoltages)
  const minV = Math.min(...cellVoltages)
  const deviation = (maxV - minV).toFixed(3)

  return { cells, deviation, temperature: temperature.toFixed(1), cellVoltageDeviation }
})

const cellColor = (pct: number) => {
  if (pct > 50) return 'positive'
  if (pct > 20) return 'warning'
  return 'negative'
}
</script>

<template>
  <q-card v-if="data" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-battery-check" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Battery cells</span>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-md">
      <div class="row q-col-gutter-sm q-mb-md">
        <div v-for="cell in data.cells" :key="cell.index" class="col-6 col-sm-3">
          <div class="cell-label">Cell {{ cell.index }}</div>
          <q-linear-progress
            :value="cell.pct / 100"
            :color="cellColor(cell.pct)"
            rounded
            size="8px"
            class="q-mb-xs"
          />
          <div class="cell-voltage">{{ cell.voltage.toFixed(3) }} V</div>
        </div>
      </div>

      <q-separator class="q-mb-md" />

      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="field-label">Voltage deviation</div>
          <div class="field-value">{{ data.deviation }} V</div>
        </div>
        <div class="col-6">
          <div class="field-label">Temperature</div>
          <div class="field-value">{{ data.temperature }} °C</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.cell-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.5;
  margin-bottom: 4px;
}

.cell-voltage {
  font-size: 12px;
  font-family: monospace;
  opacity: 0.8;
}

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
