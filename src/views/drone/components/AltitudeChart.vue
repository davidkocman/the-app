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

const sampled = computed(() => droneStore.getFrames.filter((_, i) => i % 10 === 0))

const series = computed(() => {
  if (!sampled.value.length) return null
  return [
    {
      name: 'Height',
      data: sampled.value.map((f) => ({ x: fmtTime(f.osd.flyTime), y: parseFloat(f.osd.height.toFixed(1)) }))
    }
  ]
})

const labelColor = computed(() => appStore.isDarkMode ? 'rgba(255,255,255,.85)' : '#213547')
const axisColor = computed(() => appStore.isDarkMode ? '#a8a8a8' : '#616161')

const options = computed<ApexOptions | null>(() => {
  if (!sampled.value.length) return null
  return {
    chart: {
      type: 'area',
      height: 280,
      id: 'altitude-chart',
      toolbar: { show: false },
      animations: { enabled: false }
    },
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 0 },
    fill: {
      type: 'gradient',
      colors: ['#1976d2'],
      gradient: { shadeIntensity: 0, opacityFrom: 0.4, opacityTo: 0.05, type: 'vertical' }
    },
    colors: ['#1976d2'],
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
      title: { text: 'm', style: { color: labelColor.value } },
      labels: { style: { fontSize: '11px', colors: labelColor.value } },
      axisBorder: { show: true, color: axisColor.value }
    },
    grid: {
      show: false,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } }
    },
    tooltip: {
      theme: appStore.isDarkMode ? 'dark' : 'light',
      custom: ({ series, seriesIndex, dataPointIndex }: { series: number[][], seriesIndex: number, dataPointIndex: number }) =>
        `<div class="q-pa-sm"><span class="text-caption">Height: <b>${series[seriesIndex][dataPointIndex]}</b> m</span></div>`
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
