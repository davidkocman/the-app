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
      <h1 class="text-h4 q-my-none">Flight log</h1>
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
            <AircraftInfo />   <!-- drone model, serial number, firmware -->
          </div>
          <div class="col-12 col-sm-6">
            <FlightSummary />  <!-- fly time, max height, max speeds, drone type -->
          </div>

          <!-- Telemetry charts + flight map -->
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <h2 class="text-h6 q-my-none">Telemetry data</h2>
              </q-card-section>
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <SpeedChart />        <!-- X / Y / Z axis speed (m/s) over time -->
                  </div>
                  <div class="col-12">
                    <AltitudeChart />     <!-- height above ground (m) over time -->
                  </div>
                  <div class="col-12">
                    <BatteryChart />      <!-- charge level (%) and voltage (V) over time -->
                  </div>
                  <div class="col-12">
                    <BatteryDetailChart /> <!-- charge (%), temperature (°C) and voltage (V) over time -->
                  </div>
                  <div class="col-12">
                    <DistanceChart />     <!-- horizontal distance from home point (m) over time -->
                  </div>
                  <div class="col-12">
                    <GpsChart />          <!-- number of locked satellites over time -->
                  </div>
                  <div class="col-12">
                    <SignalChart />        <!-- RC uplink and downlink signal strength (%) over time -->
                  </div>
                  <div class="col-12">
                    <OrientationChart />  <!-- pitch, roll and yaw angles (°) over time -->
                  </div>
                  <div class="col-12">
                    <BatteryCells />      <!-- per-cell voltage snapshot -->
                  </div>
                  <div class="col-12">
                    <div class="row q-col-gutter-md">
                      <div class="col">
                        <FlightEvents />  <!-- flight mode changes and system events timeline -->
                      </div>
                      <div class="col">
                        <CameraEvents />  <!-- photo / video recording events timeline -->
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <FlightMap />  <!-- GPS flight path rendered on an interactive map -->
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
