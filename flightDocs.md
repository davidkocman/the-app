# DJI Flight Log — Frame Properties

Each item in `record.frames` is a `Frame` object with the following top-level sections:

---

## `custom` — FrameCustom

General metadata for the frame.

| Property | Type | Description |
|----------|------|-------------|
| `dateTime` | `string` | Date and time when the frame was recorded |

---

## `osd` — FrameOSD

Primary flight data (On-Screen Display). Core telemetry for position, speed, orientation and flight state.

### Position & Altitude

| Property | Type | Unit | Description |
|----------|------|------|-------------|
| `latitude` | `number` | degrees | Aircraft latitude |
| `longitude` | `number` | degrees | Aircraft longitude |
| `height` | `number` | m | Height above ground level |
| `heightMax` | `number` | m | Maximum height reached so far |
| `vpsHeight` | `number` | m | Visual Positioning System height (from downward cameras) |
| `altitude` | `number` | m | Altitude above sea level |

### Speed

| Property | Type | Unit | Description |
|----------|------|------|-------------|
| `xSpeed` | `number` | m/s | Speed along X-axis (North/South) |
| `xSpeedMax` | `number` | m/s | Maximum X-axis speed reached |
| `ySpeed` | `number` | m/s | Speed along Y-axis (East/West) |
| `ySpeedMax` | `number` | m/s | Maximum Y-axis speed reached |
| `zSpeed` | `number` | m/s | Vertical speed |
| `zSpeedMax` | `number` | m/s | Maximum vertical speed reached |

### Orientation

| Property | Type | Unit | Description |
|----------|------|------|-------------|
| `pitch` | `number` | degrees | Pitch angle (nose up/down) |
| `roll` | `number` | degrees | Roll angle (left/right tilt) |
| `yaw` | `number` | degrees | Yaw angle (heading) |

### Flight State

| Property | Type | Description |
|----------|------|-------------|
| `flyTime` | `number` | Flight time in seconds |
| `flycState` | `FlightMode \| undefined` | Current flight mode (e.g. `"GPSAtti"`, `"AutoLanding"`, `"GoHome"`) |
| `flycCommand` | `AppCommand \| undefined` | Current app command (e.g. `"GoHome"`, `"AutoLanding"`) |
| `flightAction` | `FlightAction \| undefined` | Automated action in progress (e.g. `"WarningPowerGoHome"`, `"SmartPowerLanding"`) |
| `isOnGround` | `boolean` | Whether the aircraft is on the ground |
| `isMotorOn` | `boolean` | Whether the motors are running |
| `isMotorBlocked` | `boolean` | Whether the motors are blocked |
| `motorStartFailedCause` | `MotorStartFailedCause \| undefined` | Reason for motor start failure if applicable |
| `goHomeStatus` | `GoHomeStatus \| undefined` | Current return-to-home state (e.g. `"Ascending"`, `"Cruise"`) |

### GPS

| Property | Type | Description |
|----------|------|-------------|
| `isGpdUsed` | `boolean` | Whether GPS is being used for positioning |
| `nonGpsCause` | `NonGPSCause \| undefined` | Reason GPS is not used (e.g. `"GpsNumNonEnough"`, `"GpsHdopLarge"`) |
| `gpsNum` | `number` | Number of GPS satellites detected |
| `gpsLevel` | `number` | GPS signal quality level |

### Sensors & Warnings

| Property | Type | Description |
|----------|------|-------------|
| `isImuPreheated` | `boolean` | Whether IMU has reached operating temperature |
| `imuInitFailReason` | `ImuInitFailReason \| undefined` | Reason for IMU init failure if applicable |
| `isAcceletorOverRange` | `boolean` | Whether accelerometer is over its measurement range |
| `isBarometerDeadInAir` | `boolean` | Whether barometer has failed in flight |
| `isCompassError` | `boolean` | Whether a compass error is detected |
| `isVibrating` | `boolean` | Whether excessive vibrations are detected |
| `isVisionUsed` | `boolean` | Whether visual positioning is active |
| `isSwaveWork` | `boolean` | Whether obstacle avoidance sensors are active |
| `waveError` | `boolean` | Whether there is an obstacle avoidance sensor error |
| `voltageWarning` | `number` | Battery voltage warning level |

### Limits & Safety

| Property | Type | Description |
|----------|------|-------------|
| `isOutOfLimit` | `boolean` | Whether the aircraft is outside its flight limit zone |
| `isNotEnoughForce` | `boolean` | Whether there is insufficient thrust (e.g. low battery, high altitude) |
| `isPropellerCatapult` | `boolean` | Whether propeller catapult protection is active |
| `isGoHomeHeightModified` | `boolean` | Whether the return-to-home altitude has been modified |
| `canIocWork` | `boolean` | Whether Intelligent Orientation Control can be used |
| `droneType` | `DroneType \| undefined` | Type/model of the drone (e.g. `"MavicPro"`, `"Mini4Pro"`) |
| `batteryType` | `BatteryType \| undefined` | Battery type (`"Smart"` or `"NonSmart"`) |

---

## `gimbal` — FrameGimbal

Camera gimbal state.

| Property | Type | Unit | Description |
|----------|------|------|-------------|
| `mode` | `GimbalMode \| undefined` | — | Gimbal mode: `"Free"`, `"FPV"`, or `"YawFollow"` |
| `pitch` | `number` | degrees | Gimbal pitch angle (camera tilt up/down) |
| `roll` | `number` | degrees | Gimbal roll angle |
| `yaw` | `number` | degrees | Gimbal yaw angle |
| `isPitchAtLimit` | `boolean` | — | Whether pitch has reached its mechanical limit |
| `isRollAtLimit` | `boolean` | — | Whether roll has reached its mechanical limit |
| `isYawAtLimit` | `boolean` | — | Whether yaw has reached its mechanical limit |
| `isStuck` | `boolean` | — | Whether the gimbal is stuck/jammed |

---

## `camera` — FrameCamera

Camera status.

| Property | Type | Description |
|----------|------|-------------|
| `isPhoto` | `boolean` | Whether the camera is in photo capture mode |
| `isVideo` | `boolean` | Whether the camera is in video recording mode |
| `sdCardIsInserted` | `boolean` | Whether an SD card is inserted |
| `sdCardState` | `SDCardState \| undefined` | SD card state (e.g. `"Normal"`, `"Full"`, `"NoCard"`, `"Unformatted"`) |

---

## `rc` — FrameRC

Remote controller stick positions and signal.

| Property | Type | Description |
|----------|------|-------------|
| `aileron` | `number` | Right stick horizontal position (left/right movement) |
| `elevator` | `number` | Right stick vertical position (forward/backward movement) |
| `throttle` | `number` | Left stick vertical position (altitude control) |
| `rudder` | `number` | Left stick horizontal position (yaw / rotation) |
| `downlinkSignal` | `number \| undefined` | Downlink signal strength (aircraft → controller) |
| `uplinkSignal` | `number \| undefined` | Uplink signal strength (controller → aircraft) |

---

## `battery` — FrameBattery

Battery telemetry.

| Property | Type | Unit | Description |
|----------|------|------|-------------|
| `chargeLevel` | `number` | % | Remaining battery charge percentage |
| `voltage` | `number` | V | Total battery voltage |
| `current` | `number` | A | Current draw |
| `currentCapacity` | `number` | mAh | Current remaining capacity |
| `fullCapacity` | `number` | mAh | Full charge capacity |
| `cellNum` | `number` | — | Number of battery cells |
| `isCellVoltageEstimated` | `boolean` | — | Whether individual cell voltages are estimated from total |
| `cellVoltages` | `number[]` | V | Voltage of each individual cell |
| `cellVoltageDeviation` | `number` | V | Current deviation between cell voltages |
| `maxCellVoltageDeviation` | `number` | V | Maximum recorded deviation between cell voltages |
| `temperature` | `number` | °C | Battery temperature |
| `minTemperature` | `number` | °C | Minimum recorded battery temperature |
| `maxTemperature` | `number` | °C | Maximum recorded battery temperature |

---

## `home` — FrameHome

Home point and return-to-home settings.

| Property | Type | Unit | Description |
|----------|------|------|-------------|
| `latitude` | `number` | degrees | Home point latitude |
| `longitude` | `number` | degrees | Home point longitude |
| `altitude` | `number` | m | Home point altitude |
| `heightLimit` | `number` | m | Maximum allowed flight height |
| `maxAllowedHeight` | `number` | m | Absolute maximum allowed height |
| `goHomeHeight` | `number` | m | Return-to-home ascent altitude |
| `isHomeRecord` | `boolean` | — | Whether the home point has been set/recorded |
| `goHomeMode` | `GoHomeMode \| undefined` | — | RTH mode: `"Normal"` or `"FixedHeight"` |
| `isDynamicHomePointEnabled` | `boolean` | — | Whether the home point updates dynamically (e.g. follow-me) |
| `isNearDistanceLimit` | `boolean` | — | Whether the aircraft is near its maximum distance limit |
| `isNearHeightLimit` | `boolean` | — | Whether the aircraft is near its maximum height limit |
| `isCompassCalibrating` | `boolean` | — | Whether compass calibration is in progress |
| `compassCalibrationState` | `CompassCalibrationState \| undefined` | — | Compass calibration state (`"NotCalibrating"`, `"Horizontal"`, `"Vertical"`, `"Successful"`, `"Failed"`) |
| `isMultipleModeEnabled` | `boolean` | — | Whether multiple flight modes are enabled |
| `isBeginnerMode` | `boolean` | — | Whether beginner/novice mode is active |
| `isIocEnabled` | `boolean` | — | Whether Intelligent Orientation Control is enabled |
| `iocMode` | `IOCMode \| undefined` | — | IOC mode: `"CourseLock"`, `"HomeLock"`, or `"HotspotSurround"` |
| `iocCourseLockAngle` | `number \| undefined` | degrees | IOC course lock heading angle |
| `currentFlightRecordIndex` | `number` | — | Index of this flight record on the aircraft |

---

## `recover` — FrameRecover

Aircraft and app identification at recovery/session level.

| Property | Type | Description |
|----------|------|-------------|
| `aircraftName` | `string` | Name of the aircraft |
| `aircraftSn` | `string` | Serial number of the aircraft |
| `cameraSn` | `string` | Serial number of the camera |
| `rcSn` | `string` | Serial number of the remote controller |
| `batterySn` | `string` | Serial number of the battery |
| `appPlatform` | `Platform \| undefined` | App platform used (`"IOS"`, `"Android"`, `"DJIFly"`, etc.) |
| `appVersion` | `string` | Version of the DJI app |

---

## `app` — FrameApp

In-app messages from the DJI app during the flight.

| Property | Type | Description |
|----------|------|-------------|
| `tip` | `string` | Informational tip message shown in the app |
| `warn` | `string` | Warning message shown in the app |

---

## Enum Reference

| Enum | Values |
|------|--------|
| `FlightMode` | `"Manual"`, `"Atti"`, `"GPSAtti"`, `"GPSSport"`, `"AutoLanding"`, `"GoHome"`, `"Cinematic"`, `"Tripod"`, `"FPV"`, `"GPSWaypoint"`, `"Hover"`, ... |
| `FlightAction` | `"None"`, `"WarningPowerGoHome"`, `"SmartPowerLanding"`, `"RCOnekeyGoHome"`, `"AppAutoTakeoff"`, `"AppAutoLanding"`, `"LowVoltageLanding"`, ... |
| `GoHomeStatus` | `"Standby"`, `"Preascending"`, `"Align"`, `"Ascending"`, `"Cruise"`, `"Braking"`, `"Bypassing"` |
| `DroneType` | `"MavicPro"`, `"Phantom4Pro"`, `"Mini4Pro"`, `"Avata2"`, `"Matrice350RTK"`, `"Spark"`, `"Inspire2"`, ... |
| `GimbalMode` | `"Free"`, `"FPV"`, `"YawFollow"` |
| `SDCardState` | `"Normal"`, `"NoCard"`, `"InvalidCard"`, `"Full"`, `"Unformatted"`, `"Formatting"`, `"Busy"`, `"LowSpeed"`, ... |
| `Platform` | `"IOS"`, `"Android"`, `"DJIFly"`, `"Windows"`, `"Mac"`, `"Linux"` |
| `NonGPSCause` | `"Already"`, `"Forbid"`, `"GpsNumNonEnough"`, `"GpsHdopLarge"`, `"SpeedErrorLarge"`, `"CompassErrorLarge"`, ... |
| `BatteryType` | `"Smart"`, `"NonSmart"` |
| `GoHomeMode` | `"Normal"`, `"FixedHeight"` |
| `IOCMode` | `"CourseLock"`, `"HomeLock"`, `"HotspotSurround"` |
| `CompassCalibrationState` | `"NotCalibrating"`, `"Horizontal"`, `"Vertical"`, `"Successful"`, `"Failed"` |
