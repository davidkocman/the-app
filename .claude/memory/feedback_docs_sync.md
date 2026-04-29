---
name: Sync docs.md on drone component edits
description: Whenever a drone view component is modified, update the documentation in src/views/drone/docs.md
type: feedback
---

Pri každej úprave súboru v `src/views/drone/` (vrátane `Drone.vue`) alebo `src/views/drone/components/` je potrebné aktualizovať aj dokumentáciu v `src/views/drone/docs.md`.

**Why:** Používateľ chce udržiavať dokumentáciu synchronizovanú s kódom automaticky, bez toho aby musel zakaždým explicitne žiadať update.

**How to apply:** Po každom edite `Drone.vue` alebo akéhokoľvek `.vue` súboru v `src/views/drone/components/` skontrolovať, či sa zmenilo niečo čo je popísané v docs.md (rozloženie, dátové zdroje, podmienky zobrazenia, séria grafov, jednotky atď.) a príslušnú sekciu aktualizovať.

## Aktuálna dokumentácia komponentov

Súbor: `src/views/drone/docs.md`

### Prehľad komponentov

| Komponent | Typ | Dáta |
|-----------|-----|------|
| `DroneFileUpload.vue` | Upload + zoznam | store.records |
| `AircraftInfo.vue` | Statická karta | frame.recover.* |
| `FlightSummary.vue` | Statická karta | frame.osd.*Max, flyTime, droneType |
| `FlightMap.vue` | SVG mapa | osd.latitude/longitude, home.lat/lon |
| `AltitudeChart.vue` | Area chart | osd.height / osd.flyTime |
| `SpeedChart.vue` | Line chart (3 série) | osd.xSpeed, ySpeed, zSpeed |
| `BatteryChart.vue` | Mixed chart, dual Y | battery.chargeLevel, battery.voltage |
| `OrientationChart.vue` | Line chart (3 série) | osd.pitch, roll, yaw |
| `SignalChart.vue` | Line chart (2 série) | rc.downlinkSignal, uplinkSignal |
| `GpsChart.vue` | Mixed bar+line, dual Y | osd.gpsNum, osd.gpsLevel |
| `BatteryCells.vue` | Statická karta + progress | battery.cellVoltages, temperature |
| `GimbalChart.vue` | Line chart (2 série) | gimbal.pitch, gimbal.yaw |
| `FlightEvents.vue` | q-timeline | app.tip, app.warn |
| `CameraEvents.vue` | Zoznam udalostí | camera.isPhoto, camera.isVideo |
