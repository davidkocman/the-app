<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import useDroneStore from '@/store/drone'
import useAppStore from '@/store/app'

const droneStore = useDroneStore()
const appStore = useAppStore()

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

const sampled = computed(() =>
  droneStore.getFrames
    .filter((_, i) => i % 10 === 0)
    .filter((f) => f.rc.downlinkSignal !== undefined || f.rc.uplinkSignal !== undefined)
)

const series = computed(() => {
  if (!sampled.value.length) return null
  const times = sampled.value.map((f) => fmtTime(f.osd.flyTime))
  return [
    { name: 'Downlink', data: sampled.value.map((f, i) => ({ x: times[i], y: f.rc.downlinkSignal ?? null })) },
    { name: 'Uplink',   data: sampled.value.map((f, i) => ({ x: times[i], y: f.rc.uplinkSignal ?? null })) }
  ]
})

const labelColor = computed(() => appStore.isDarkMode ? 'rgba(255,255,255,.85)' : '#213547')
const axisColor  = computed(() => appStore.isDarkMode ? '#a8a8a8' : '#616161')

const options = computed<ApexOptions | null>(() => {
  if (!sampled.value.length) return null
  return {
    chart: { type: 'line', height: 280, id: 'signal-chart', toolbar: { show: false }, animations: { enabled: false }, redrawOnWindowResize: false },
    colors: ['#3498db', '#e67e22'],
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 0 },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'category',
      tickAmount: 10,
      labels: { rotate: 0, style: { fontSize: '11px', colors: labelColor.value } },
      axisBorder: { show: true, color: axisColor.value },
      axisTicks: { show: true, color: axisColor.value }
    },
    yaxis: {
      min: 0,
      max: 100,
      title: { text: '%', style: { color: labelColor.value } },
      labels: { style: { fontSize: '11px', colors: labelColor.value } },
      axisBorder: { show: true, color: axisColor.value }
    },
    grid: { show: false, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
    legend: { labels: { colors: labelColor.value } },
    tooltip: {
      theme: appStore.isDarkMode ? 'dark' : 'light',
      custom: ({ series, dataPointIndex }: { series: number[][], dataPointIndex: number }) =>
        `<div class="q-pa-sm">
          <div class="text-caption">Downlink: <b>${series[0][dataPointIndex] ?? '—'} %</b></div>
          <div class="text-caption">Uplink: <b>${series[1][dataPointIndex] ?? '—'} %</b></div>
        </div>`
    }
  }
})
</script>

<template>
  <q-card v-if="options" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-signal" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">RC Signal</span>
    </q-card-section>
    <q-separator />
    <VueApexCharts :series="series" :options="options" height="280" />
  </q-card>
</template>
