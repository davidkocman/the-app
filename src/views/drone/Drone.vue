<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMeta } from 'quasar'
import useDroneStore from '@/store/drone'
import DroneFileUpload from './components/DroneFileUpload.vue'
import AircraftInfo from './components/AircraftInfo.vue'
import FlightSummary from './components/FlightSummary.vue'
import FlightMap from './components/FlightMap.vue'
import AltitudeChart from './components/AltitudeChart.vue'
import SpeedChart from './components/SpeedChart.vue'
import BatteryChart from './components/BatteryChart.vue'
import DistanceChart from './components/DistanceChart.vue'
import FlightEvents from './components/FlightEvents.vue'
import OrientationChart from './components/OrientationChart.vue'
import SignalChart from './components/SignalChart.vue'
import GpsChart from './components/GpsChart.vue'
import BatteryCells from './components/BatteryCells.vue'
import CameraEvents from './components/CameraEvents.vue'

const pageTitle = ref('Drone flight data | The App')

useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Drone flight data' },
      keywords: { name: 'keywords', content: 'drone, dji, flight, data' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})

const droneStore = useDroneStore()
onMounted(() => droneStore.fetchFlightLogs())
</script>

<template>
  <q-page class="page-drone q-py-md q-px-lg">
    <div class="row q-mb-lg items-center">
      <h1 class="text-h4 q-my-none flex items-center" style="gap: 10px"><q-icon name="mdi-quadcopter" />Flight log</h1>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-2">
        <DroneFileUpload />
      </div>

      <div class="col-12 col-md-10">
        <div v-if="!droneStore.activeRecordId" class="row items-center justify-center" style="min-height: 300px">
          <div class="text-h6 text-grey-5">Select flight record</div>
        </div>

        <div v-else class="row q-col-gutter-md">
          <!-- Aircraft info + flight summary -->
          <div class="col-12 col-sm-6">
            <AircraftInfo />
          </div>
          <div class="col-12 col-sm-6">
            <FlightSummary />
          </div>

          <!-- Flight map — full width -->
          <div class="col-12">
            <FlightMap />
          </div>

          <!-- Telemetry charts — 2-column grid -->
          <div class="col-12 col-md-6">
            <SpeedChart />
          </div>
          <div class="col-12 col-md-6">
            <AltitudeChart />
          </div>
          <div class="col-12 col-md-6">
            <BatteryChart />
          </div>
          <div class="col-12 col-md-6">
            <DistanceChart />
          </div>
          <div class="col-12 col-md-6">
            <OrientationChart />
          </div>
          <div class="col-12 col-md-6">
            <GpsChart />
          </div>
          <div class="col-12 col-md-6">
            <SignalChart />
          </div>

          <!-- Compact cards — 3 columns -->
          <div class="col-12 col-md-4">
            <BatteryCells />
          </div>
          <div class="col-12 col-md-4">
            <FlightEvents />
          </div>
          <div class="col-12 col-md-4">
            <CameraEvents />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.page-drone {
  padding-left: 6px;
  padding-right: 6px;

  @media (min-width: 768px) {
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
