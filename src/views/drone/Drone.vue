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
import FlightEvents from './components/FlightEvents.vue'
import OrientationChart from './components/OrientationChart.vue'
import SignalChart from './components/SignalChart.vue'
import GpsChart from './components/GpsChart.vue'
import GimbalChart from './components/GimbalChart.vue'
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
      <h1 class="text-h4 q-my-none">Flight log</h1>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <DroneFileUpload />
      </div>

      <div class="col-12 col-md-9">
        <div class="row q-col-gutter-md">
          <!-- Static info -->
          <div class="col-12 col-sm-6">
            <AircraftInfo />
          </div>
          <div class="col-12 col-sm-6">
            <FlightSummary />
          </div>

          <!-- Altitude -->
          <div class="col-12">
            <AltitudeChart />
          </div>

          <!-- Speed + Battery -->
          <div class="col-12 col-md-6">
            <SpeedChart />
          </div>
          <div class="col-12 col-md-6">
            <BatteryChart />
          </div>

          <!-- Orientation + Signal -->
          <div class="col-12 col-md-6">
            <OrientationChart />
          </div>
          <div class="col-12 col-md-6">
            <SignalChart />
          </div>

          <!-- GPS + Gimbal -->
          <div class="col-12 col-md-6">
            <GpsChart />
          </div>
          <div class="col-12 col-md-6">
            <GimbalChart />
          </div>

          <!-- Battery cells + Camera events -->
          <div class="col-12 col-md-6">
            <BatteryCells />
          </div>
          <div class="col-12 col-md-6">
            <FlightEvents />
          </div>

          <!-- Flight events timeline -->
          <div class="col-12">
            <CameraEvents />
          </div>

          <!-- Flight path -->
          <div class="col-12">
            <FlightMap />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
