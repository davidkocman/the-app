<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import 'maplibre-gl/dist/maplibre-gl.css'
import * as maplibregl from 'maplibre-gl'
import useDroneStore from '@/store/drone'
import useAppStore from '@/store/app'

const droneStore = useDroneStore()
const appStore = useAppStore()
const mapContainer = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null
let markers: maplibregl.Marker[] = []

const mapStyle = computed(() =>
  appStore.isDarkMode
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://tiles.openfreemap.org/styles/liberty'
)

const sampled = computed(() => droneStore.getFrames.filter((_, i) => i % 5 === 0))

const mapData = computed(() => {
  const frames = sampled.value
  if (!frames.length) return null

  const validFrames = frames.filter((f) => f.osd.latitude !== 0 && f.osd.longitude !== 0)
  if (!validFrames.length) return null

  // GeoJSON / MapLibre uses [lon, lat] order
  const coordinates = validFrames.map((f): [number, number] => [f.osd.longitude, f.osd.latitude])

  const lons = coordinates.map(([lon]) => lon)
  const lats = coordinates.map(([, lat]) => lat)
  const bounds: maplibregl.LngLatBoundsLike = [
    [Math.min(...lons), Math.min(...lats)],
    [Math.max(...lons), Math.max(...lats)]
  ]

  const firstFrame = droneStore.getFrames[0]
  const home =
    firstFrame?.home && firstFrame.home.latitude !== 0 && firstFrame.home.longitude !== 0
      ? ([firstFrame.home.longitude, firstFrame.home.latitude] as [number, number])
      : null

  return {
    coordinates,
    start: coordinates[0],
    end: coordinates[coordinates.length - 1],
    home,
    bounds
  }
})

function makeMarkerEl(color: string, label: string): HTMLElement {
  const el = document.createElement('div')
  el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;cursor:default;`
  el.title = label
  return el
}

function clearMarkers() {
  markers.forEach((m) => m.remove())
  markers = []
}

function updateMap() {
  if (!map || !mapData.value) return
  const { coordinates, start, end, home, bounds } = mapData.value

  const geojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates }, properties: {} }]
  }

  const src = map.getSource('flight-path') as maplibregl.GeoJSONSource | undefined
  if (src) {
    src.setData(geojson)
  } else {
    map.addSource('flight-path', { type: 'geojson', data: geojson })
    map.addLayer({
      id: 'flight-path-line',
      type: 'line',
      source: 'flight-path',
      paint: { 'line-color': '#1976d2', 'line-width': 2, 'line-opacity': 0.9 }
    })
  }

  clearMarkers()
  markers.push(new maplibregl.Marker({ element: makeMarkerEl('#27ae60', 'Start') }).setLngLat(start).addTo(map))
  markers.push(new maplibregl.Marker({ element: makeMarkerEl('#e74c3c', 'End') }).setLngLat(end).addTo(map))
  if (home) {
    markers.push(new maplibregl.Marker({ element: makeMarkerEl('#f39c12', 'Home') }).setLngLat(home).addTo(map))
  }

  map.fitBounds(bounds, { padding: 60, maxZoom: 17 })
}

onMounted(() => {
  if (!mapContainer.value) return

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: mapStyle.value,
    zoom: 13
  })

  map.on('load', () => {
    if (mapData.value) updateMap()
  })
})

onUnmounted(() => {
  clearMarkers()
  map?.remove()
  map = null
})

watch(mapData, () => {
  if (map?.loaded()) updateMap()
})

watch(() => appStore.isDarkMode, () => {
  if (!map) return
  map.setStyle(mapStyle.value)
  map.once('style.load', () => {
    if (mapData.value) updateMap()
  })
})
</script>

<template>
  <q-card v-if="mapData" flat bordered class="rounded-borders">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="mdi-map-marker-path" color="primary" size="22px" class="q-mr-sm" />
      <span class="text-subtitle1 text-primary text-weight-bold">Flight path</span>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <div ref="mapContainer" class="flight-map-container" />

      <div class="row q-gutter-md q-pa-sm justify-center">
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
.flight-map-container {
  height: 500px;
  width: 100%;
  position: relative;
  z-index: 0;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
