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
  const times = sampled.value.map((f) => fmtTime(f.osd.flyTime))
  return [
    {
      name: 'Charge (%)',
      type: 'area',
      data: sampled.value.map((f, i) => ({ x: times[i], y: f.battery.chargeLevel }))
    },
    {
      name: 'Temperature',
      type: 'line',
      data: sampled.value.map((f, i) => ({ x: times[i], y: parseFloat(f.battery.temperature.toFixed(1)) }))
    },
    {
      name: 'Voltage',
      type: 'line',
      data: sampled.value.map((f, i) => ({ x: times[i], y: parseFloat(f.battery.voltage.toFixed(2)) }))
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
      id: 'battery-detail-chart',
      toolbar: { show: false },
      animations: { enabled: false },
      redrawOnWindowResize: false
    },
    colors: ['#27ae60', '#e74c3c', '#f39c12'],
    stroke: { curve: 'smooth', width: [2, 2, 2] },
    markers: { size: 0 },
    dataLabels: { enabled: false },
    fill: {
      type: ['gradient', 'solid', 'solid'],
      gradient: { shadeIntensity: 0, opacityFrom: 0.3, opacityTo: 0.02, type: 'vertical' }
    },
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
        seriesName: 'Charge',
        min: 0,
        max: 100,
        title: { text: '%', style: { color: labelColor.value } },
        labels: { style: { fontSize: '11px', colors: labelColor.value } },
        axisBorder: { show: true, color: axisColor.value }
      },
      {
        opposite: true,
        seriesName: 'Temperature',
        title: { text: '°C', style: { color: labelColor.value } },
        labels: { style: { fontSize: '11px', colors: labelColor.value } },
        axisBorder: { show: true, color: axisColor.value }
      },
      {
        opposite: true,
        seriesName: 'Voltage',
        show: false
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
        const charge = series[0][dataPointIndex]
        const temp = series[1][dataPointIndex]
        const voltage = series[2][dataPointIndex]
        return `<div class="q-pa-sm">
          <div class="text-caption">Charge: <b>${charge}</b> %</div>
          <div class="text-caption">Temperature: <b>${temp}</b> °C</div>
          <div class="text-caption">Voltage: <b>${voltage}</b> V</div>
        </div>`
      }
    }
  }
})
</script>

<template>
  <q-card v-if="options" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-battery-charging-outline" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Battery</span>
    </q-card-section>
    <q-separator />
    <VueApexCharts :series="series" :options="options" height="280" />
  </q-card>
</template>
