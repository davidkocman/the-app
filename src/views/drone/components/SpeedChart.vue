<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import useDroneStore from '@/store/drone'
import useAppStore from '@/store/app'
import { msToKmh } from '@/utils/helpers'

const droneStore = useDroneStore()
const appStore = useAppStore()

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

const sampled = computed(() => droneStore.getFrames.filter((_, i) => i % 10 === 0))

const series = computed(() => {
  if (!sampled.value.length) return null
  const times = sampled.value.map((f) => fmtTime(f.osd.flyTime))
  return [
    { name: 'X speed', data: sampled.value.map((f, i) => ({ x: times[i], y: parseFloat(f.osd.xSpeed.toFixed(2)) })) },
    { name: 'Y speed', data: sampled.value.map((f, i) => ({ x: times[i], y: parseFloat(f.osd.ySpeed.toFixed(2)) })) },
    { name: 'Z speed', data: sampled.value.map((f, i) => ({ x: times[i], y: parseFloat(f.osd.zSpeed.toFixed(2)) })) }
  ]
})

const labelColor = computed(() => appStore.isDarkMode ? 'rgba(255,255,255,.85)' : '#213547')
const axisColor = computed(() => appStore.isDarkMode ? '#a8a8a8' : '#616161')

const options = computed<ApexOptions | null>(() => {
  if (!sampled.value.length) return null
  return {
    chart: {
      type: 'line',
      height: 280,
      id: 'speed-chart',
      toolbar: { show: false },
      animations: { enabled: false }
    },
    colors: ['#27ae60', '#e67e22', '#e74c3c'],
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 0 },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'category',
      tickAmount: 10,
      labels: {
        rotate: 0,
        style: { fontSize: '11px', colors: labelColor.value }
      },
      axisBorder: { show: true, color: axisColor.value },
      axisTicks: { show: true, color: axisColor.value }
    },
    yaxis: {
      title: { text: 'm/s', style: { color: labelColor.value } },
      labels: { style: { fontSize: '11px', colors: labelColor.value } },
      axisBorder: { show: true, color: axisColor.value }
    },
    grid: {
      show: false,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } }
    },
    legend: {
      labels: { colors: labelColor.value }
    },
    tooltip: {
      theme: appStore.isDarkMode ? 'dark' : 'light',
      custom: ({ series, dataPointIndex }: { series: number[][], dataPointIndex: number }) => {
        const x = series[0][dataPointIndex], y = series[1][dataPointIndex], z = series[2][dataPointIndex]
        return `<div class="q-pa-sm">
          <div class="text-caption">X: <b>${x}</b> m/s (${msToKmh(x)} km/h)</div>
          <div class="text-caption">Y: <b>${y}</b> m/s (${msToKmh(y)} km/h)</div>
          <div class="text-caption">Z: <b>${z}</b> m/s (${msToKmh(z)} km/h)</div>
        </div>`
      }
    }
  }
})
</script>

<template>
  <q-card v-if="options" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-speedometer" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Speed</span>
    </q-card-section>
    <q-separator />
    <VueApexCharts :series="series" :options="options" height="280" />
  </q-card>
</template>
