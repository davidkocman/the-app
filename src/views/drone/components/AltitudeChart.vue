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
    {
      name: 'Height',
      type: 'area',
      data: sampled.value.map((f, i) => ({ x: times[i], y: parseFloat(f.osd.height.toFixed(1)) }))
    },
    {
      name: 'VPS Height',
      type: 'line',
      data: sampled.value.map((f, i) => ({ x: times[i], y: parseFloat(f.osd.vpsHeight.toFixed(1)) }))
    },
    {
      name: 'H Speed',
      type: 'line',
      data: sampled.value.map((f, i) => ({
        x: times[i],
        y: parseFloat(Math.sqrt(f.osd.xSpeed ** 2 + f.osd.ySpeed ** 2).toFixed(2))
      }))
    }
  ]
})

const labelColor = computed(() => (appStore.isDarkMode ? 'rgba(255,255,255,.85)' : '#213547'))
const axisColor = computed(() => (appStore.isDarkMode ? '#a8a8a8' : '#616161'))

const options = computed<ApexOptions | null>(() => {
  if (!sampled.value.length) return null
  return {
    chart: {
      type: 'line',
      height: 280,
      id: 'height-speed-chart',
      toolbar: { show: false },
      animations: { enabled: false },
      redrawOnWindowResize: false
    },
    colors: ['#1976d2', '#00bcd4', '#e67e22'],
    stroke: { curve: 'smooth', width: [2, 2, 2] },
    markers: { size: 0 },
    fill: {
      type: ['gradient', 'solid', 'solid'],
      gradient: { shadeIntensity: 0, opacityFrom: 0.35, opacityTo: 0.03, type: 'vertical' }
    },
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
    yaxis: [
      {
        seriesName: 'Height',
        title: { text: 'Height (m)', style: { color: labelColor.value } },
        labels: { style: { fontSize: '11px', colors: labelColor.value } },
        axisBorder: { show: true, color: axisColor.value }
      },
      {
        seriesName: 'Height',
        show: false
      },
      {
        opposite: true,
        seriesName: 'H Speed',
        title: { text: 'm/s', style: { color: labelColor.value } },
        labels: { style: { fontSize: '11px', colors: labelColor.value } },
        axisBorder: { show: true, color: axisColor.value }
      }
    ],
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
      custom: ({ series, dataPointIndex }: { series: number[][]; dataPointIndex: number }) => {
        const h = series[0][dataPointIndex]
        const vps = series[1][dataPointIndex]
        const spd = series[2][dataPointIndex]
        return `<div class="q-pa-sm">
          <div class="text-caption">Height: <b>${h}</b> m</div>
          <div class="text-caption">VPS Height: <b>${vps}</b> m</div>
          <div class="text-caption">H Speed: <b>${spd}</b> m/s (${msToKmh(spd)} km/h)</div>
        </div>`
      }
    }
  }
})
</script>

<template>
  <q-card v-if="options" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-altimeter" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Altitude</span>
    </q-card-section>
    <q-separator />
    <VueApexCharts :series="series" :options="options" height="280" />
  </q-card>
</template>

<style scoped>
:deep(.apexcharts-legend-group) {
  flex-direction: row !important;
}
</style>
