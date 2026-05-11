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

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const sampled = computed(() => droneStore.getFrames.filter((f, i) => i % 10 === 0 && f.home.isHomeRecord))

const series = computed(() => {
  if (!sampled.value.length) return null
  return [
    {
      name: 'Distance to Home',
      data: sampled.value.map((f) => ({
        x: fmtTime(f.osd.flyTime),
        y: parseFloat(haversine(f.osd.latitude, f.osd.longitude, f.home.latitude, f.home.longitude).toFixed(1))
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
      type: 'area',
      height: 280,
      id: 'distance-chart',
      toolbar: { show: false },
      animations: { enabled: false },
      redrawOnWindowResize: false
    },
    colors: ['#9c27b0'],
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 0 },
    fill: {
      type: 'gradient',
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
      custom: ({
        series,
        seriesIndex,
        dataPointIndex
      }: {
        series: number[][]
        seriesIndex: number
        dataPointIndex: number
      }) =>
        `<div class="q-pa-sm"><span class="text-caption">Distance to Home: <b>${series[seriesIndex][dataPointIndex]}</b> m</span></div>`
    }
  }
})
</script>

<template>
  <q-card v-if="options" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-home-map-marker" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Distance from Home</span>
    </q-card-section>
    <q-separator />
    <VueApexCharts :series="series" :options="options" height="280" />
  </q-card>
</template>
