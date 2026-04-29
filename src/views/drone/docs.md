# Drone — dokumentácia komponentov

> Súbor: `src/views/drone/docs.md`
> Komponenty: `src/views/drone/components/`

Všetky komponenty čítajú dáta z `useDroneStore`. Komponenty zobrazujúce telemetriu sú podmienené tým, že `droneStore.getFrames.length > 0` — zostanú skryté kým používateľ nenačíta frames kliknutím na ikonu oka v `DroneFileUpload`.

---

## Drone.vue

Hlavná stránka sekcie. Riadi rozloženie, meta tagy a inicializáciu dát.

**Súbor:** `src/views/drone/Drone.vue`

**Inicializácia:** `onMounted` → `droneStore.fetchFlightLogs()` — načíta zoznam logov aktuálneho používateľa zo Supabase.

**Meta:** `useMeta` — dynamický title `Drone flight data | The App`.

**Podmienené zobrazenie:** Ak `droneStore.activeRecordId` je `null`, pravá časť stránky zobrazí správu _"Select flight record"_. Po výbere záznamu sa obsah nahradí dátovými komponentmi.

**Rozloženie (`q-page`):**

```
row
├── col-12 col-md-2        DroneFileUpload
└── col-12 col-md-10
    ├── col-12 col-sm-6    AircraftInfo
    ├── col-12 col-sm-6    FlightSummary
    ├── col-12 col-md-6    [q-card] Telemetry data
    │   ├── SpeedChart
    │   ├── AltitudeChart
    │   ├── BatteryChart
    │   ├── BatteryDetailChart
    │   ├── DistanceChart
    │   ├── GpsChart
    │   ├── SignalChart
    │   ├── OrientationChart
    │   ├── BatteryCells
    │   ├── FlightEvents
    │   └── CameraEvents
    └── col-12 col-md-6    [q-card] Flight path
        └── FlightMap
```

---

## DroneFileUpload

Správa nahratých flight logov.

- Nahrávanie `.txt` súborov (DJI log formát), parsovanie cez `useDroneLogParser` a ukladanie do Supabase
- Zoznam nahratých záznamov s počtom frames a časom
- **Eye ikona** — načíta frames daného logu do `store.frames` a nastaví `store.activeRecordId`; ak sú frames už načítané, ikona sa zmení na `mdi-eye-check-outline` a akcia sa nevykoná
- **Delete ikona** — potvrdzovacie dialógové okno, po potvrdení odstráni záznam zo Supabase aj zo store

---

## AircraftInfo

Statická karta so základnými identifikačnými údajmi lietadla.

| Pole | Zdroj | Popis |
|------|-------|-------|
| Aircraft | `frame.recover.aircraftName` | Názov modelu |
| Aircraft S/N | `frame.recover.aircraftSn` | Sériové číslo lietadla |
| Camera S/N | `frame.recover.cameraSn` | Sériové číslo kamery |
| RC S/N | `frame.recover.rcSn` | Sériové číslo diaľkového ovládača |
| Battery S/N | `frame.recover.batterySn` | Sériové číslo batérie |
| App | `frame.recover.appPlatform` + `appVersion` | Platforma a verzia DJI aplikácie |

> Dáta sa berú z **prvého framu, ktorý má všetky polia vyplnené** — `recover` objekt nemusí byť kompletný v prvom frame logu.

---

## FlightSummary

Statická karta so súhrnnými hodnotami celého letu.

| Pole | Zdroj | Jednotka | Popis |
|------|-------|----------|-------|
| Fly time | `lastFrame.osd.flyTime` | `Xm Ys` | Celkový čas letu |
| Max height | `lastFrame.osd.heightMax` | m | Maximálna výška nad zemou dosiahnutá počas letu |
| Max flight speed | `max(xSpeedMax, ySpeedMax)` | m/s + km/h | Maximálna horizontálna rýchlosť |
| Max V speed | `lastFrame.osd.zSpeedMax` | m/s + km/h | Maximálna vertikálna rýchlosť |
| Drone type | `firstFrame.osd.droneType` | — | Model dronu |

> `*Max` hodnoty sú kumulatívne maximá ukladané priamo firmvérom do každého framu — posledný frame teda obsahuje celkové maximum za celý let.

---

## AltitudeChart

ApexCharts **area** graf výšky lietadla v čase.

| Os | Zdroj | Popis |
|----|-------|-------|
| X | `osd.flyTime` (mm:ss) | Čas od štartu letu |
| Y | `osd.height` (m) | Výška nad zemou (AGL) |

> Vzorkovanie: každý 10. frame. `osd.height` je výška nad zemou z barometra/VPS, nie nadmorská výška (`osd.altitude`).

---

## SpeedChart

ApexCharts **line** graf s tromi sériami rýchlosti v čase.

| Séria | Zdroj | Farba | Popis |
|-------|-------|-------|-------|
| X speed | `osd.xSpeed` | zelená | Rýchlosť v smere sever–juh (m/s) |
| Y speed | `osd.ySpeed` | oranžová | Rýchlosť v smere východ–západ (m/s) |
| Z speed | `osd.zSpeed` | červená | Vertikálna rýchlosť (m/s) |

> Vzorkovanie: každý 10. frame.

---

## BatteryChart

ApexCharts **mixed** graf (area + line) s dvojitou Y-osou.

| Séria | Zdroj | Typ | Os | Farba |
|-------|-------|-----|----|-------|
| Charge | `battery.chargeLevel` (%) | area | ľavá (0–100 %) | zelená |
| Voltage | `battery.voltage` (V) | line | pravá (V) | oranžová |

> Vzorkovanie: každý 10. frame.

---

## BatteryDetailChart

ApexCharts **mixed** graf (area + line) s trojitou Y-osou — podrobný pohľad na stav batérie.

| Séria | Zdroj | Typ | Os | Farba |
|-------|-------|-----|----|-------|
| Charge | `battery.chargeLevel` (%) | area | ľavá (0–100 %) | zelená |
| Temperature | `battery.temperature` (°C) | line | pravá (°C) | červená |
| Voltage | `battery.voltage` (V) | line | pravá (skrytá os) | oranžová |

> Vzorkovanie: každý 10. frame. Os napätia je skrytá (`show: false`) — hodnota je viditeľná iba v tooltipe.

---

## DistanceChart

ApexCharts **area** graf horizontálnej vzdialenosti dronu od home pointu v čase.

| Os | Zdroj | Popis |
|----|-------|-------|
| X | `osd.flyTime` (mm:ss) | Čas od štartu letu |
| Y | Haversine(`osd.lat/lon`, `home.lat/lon`) (m) | Priama horizontálna vzdialenosť od home pointu |

> Vzorkovanie: každý 10. frame. Filtruje framy kde `home.isHomeRecord === false` — vylúči úvodné framy pred zaznamenaním home pointu (defaultná poloha `0,0` by inak generovala hodnoty v miliónoch metrov).

---

## GpsChart

ApexCharts **stepline** graf počtu uzamknutých satelitov v čase.

| Os | Zdroj | Popis |
|----|-------|-------|
| X | `osd.flyTime` (mm:ss) | Čas od štartu letu |
| Y | `osd.gpsNum` | Počet satelitov |

> Vzorkovanie: každý 10. frame. Typ `stepline` presne reprezentuje diskrétne (celočíselné) skoky v počte satelitov bez falošnej interpolácie.

---

## SignalChart

ApexCharts **line** graf sily RC signálu v čase.

| Séria | Zdroj | Farba | Popis |
|-------|-------|-------|-------|
| Downlink | `rc.downlinkSignal` (%) | modrá | Signál lietadlo → ovládač (telemetria, video) |
| Uplink | `rc.uplinkSignal` (%) | oranžová | Signál ovládač → lietadlo (príkazy) |

> Obe hodnoty sú **optional** — komponent sa zobrazí len ak ich log obsahuje. Vzorkovanie: každý 10. frame.

---

## OrientationChart

ApexCharts **line** graf postoja (attitude) lietadla v čase.

| Séria | Zdroj | Farba | Popis |
|-------|-------|-------|-------|
| Pitch | `osd.pitch` (°) | modrá | Náklon dopredu/dozadu |
| Roll | `osd.roll` (°) | červená | Náklon do strán |
| Yaw | `osd.yaw` (°) | fialová | Smer otočenia (heading) |

> Vzorkovanie: každý 10. frame. Prudké výkyvy indikujú manévre alebo turbulencie.

---

## BatteryCells

Statická karta zobrazujúca stav jednotlivých článkov batérie z **posledného framu s platnými dátami**.

- **q-linear-progress** pre každý článok — hodnota normalizovaná na rozsah 3.0 V (0 %) – 4.2 V (100 %)
- Farba: zelená > 50 %, oranžová 20–50 %, červená < 20 %
- **Voltage deviation** — aktuálny rozdiel max–min napätia článkov (ideálne < 0.05 V)
- **Temperature** — teplota batérie v °C

---

## FlightEvents

Scrollovateľný **q-timeline** zoznam udalostí zachytených DJI aplikáciou počas letu.

- Zdroj: `frame.app.tip` (informačné hlásenia) a `frame.app.warn` (varovania)
- Zaznamenáva sa vždy **prvý frame kde sa správa zmenila** (deduplicita po sebe idúcich rovnakých správ)
- Varovaniam (warn) sa priradí ikona `warning` a oranžová farba
- Typické udalosti: zmeny letového režimu, low battery, aktivácia RTH, GPS stav

> Komponent sa zobrazí len ak existuje aspoň jedna udalosť.

---

## CameraEvents

Zoznam udalostí kamery — kedy bola spravená fotografia alebo spustené/zastavené video.

| Stĺpec | Popis |
|--------|-------|
| Typ | `photo` / `video start` / `video stop` |
| Súradnice | `osd.latitude`, `osd.longitude` v čase udalosti |
| Čas | `osd.flyTime` (mm:ss) od štartu letu |

- Detekcia na základe **zmeny stavu** `camera.isPhoto` a `camera.isVideo` medzi framami
- Komponent sa zobrazí len ak log obsahuje aspoň jednu kameru udalosť

---

## FlightMap

SVG vizualizácia trasy letu bez externých knižníc.

- **Trasa** — polyline z `osd.latitude` + `osd.longitude`, vzorkovaný každý 5. frame
- **Start** — zelený bod (prvá platná GPS pozícia)
- **End** — červený bod (posledná platná GPS pozícia)
- **Home** — oranžový bod z `frame.home.latitude/longitude` (ak je nastavený)
- Súradnice s hodnotou `0` sú filtrované (GPS ešte nezachytilo signál)
- Projekcia je lineárna (nie Mercator) — vhodná pre krátke lety; pre dlhé trasy môže dôjsť k miernemu skresleniu
