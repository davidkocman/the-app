<script setup lang="ts">
import { computed } from 'vue'
import useDroneStore from '@/store/drone'

const droneStore = useDroneStore()

const W = 600
const H = 400
const PADDING = 40

const sampled = computed(() => droneStore.getFrames.filter((_, i) => i % 5 === 0))

const mapData = computed(() => {
  const frames = sampled.value
  if (!frames.length) return null

  const lats = frames.map((f) => f.osd.latitude).filter((v) => v !== 0)
  const lons = frames.map((f) => f.osd.longitude).filter((v) => v !== 0)
  if (!lats.length) return null

  const PAD = 0.00005
  const minLat = Math.min(...lats) - PAD
  const maxLat = Math.max(...lats) + PAD
  const minLon = Math.min(...lons) - PAD
  const maxLon = Math.max(...lons) + PAD

  const innerW = W - PADDING * 2
  const innerH = H - PADDING * 2

  const toX = (lon: number) => PADDING + ((lon - minLon) / (maxLon - minLon)) * innerW
  const toY = (lat: number) => PADDING + ((maxLat - lat) / (maxLat - minLat)) * innerH

  const points = frames
    .filter((f) => f.osd.latitude !== 0 && f.osd.longitude !== 0)
    .map((f) => ({ x: toX(f.osd.longitude), y: toY(f.osd.latitude) }))

  const polyline = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const allFrames = droneStore.getFrames
  const home = allFrames[0]?.home
  let homePoint = null
  if (home && home.latitude !== 0 && home.longitude !== 0) {
    homePoint = { x: toX(home.longitude), y: toY(home.latitude) }
  }

  return {
    polyline,
    start: points[0],
    end: points[points.length - 1],
    homePoint
  }
})
</script>

<template>
  <q-card v-if="mapData" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-map-marker-path" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Flight path</span>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-sm q-pb-sm">
      <svg :viewBox="`0 0 ${W} ${H}`" class="flight-map" preserveAspectRatio="xMidYMid meet">
        <polyline
          :points="mapData.polyline"
          fill="none"
          stroke="#1976d2"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        />

        <!-- Home point -->
        <g v-if="mapData.homePoint">
          <circle :cx="mapData.homePoint.x" :cy="mapData.homePoint.y" r="7" fill="#f39c12" opacity="0.9" />
          <text :x="mapData.homePoint.x" :y="mapData.homePoint.y - 11" text-anchor="middle" class="map-label">H</text>
        </g>

        <!-- Start -->
        <circle :cx="mapData.start.x" :cy="mapData.start.y" r="6" fill="#27ae60" />
        <text :x="mapData.start.x" :y="mapData.start.y - 10" text-anchor="middle" class="map-label">Start</text>

        <!-- End -->
        <circle :cx="mapData.end.x" :cy="mapData.end.y" r="6" fill="#e74c3c" />
        <text :x="mapData.end.x" :y="mapData.end.y - 10" text-anchor="middle" class="map-label">End</text>
      </svg>

      <div class="row q-gutter-md q-mt-xs justify-center">
        <div class="row items-center q-gutter-xs">
          <div class="legend-dot" style="background: #27ae60" />
          <span class="text-caption">Start</span>
        </div>
        <div class="row items-center q-gutter-xs">
          <div class="legend-dot" style="background: #e74c3c" />
          <span class="text-caption">End</span>
        </div>
        <div class="row items-center q-gutter-xs">
          <div class="legend-dot" style="background: #f39c12" />
          <span class="text-caption">Home</span>
        </div>
        <div class="row items-center q-gutter-xs">
          <div class="legend-dot" style="background: #1976d2" />
          <span class="text-caption">Path</span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.flight-map {
  width: 100%;
  height: auto;
  display: block;
}

.map-label {
  font-size: 11px;
  fill: currentColor;
  opacity: 0.7;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
