import { Store } from 'pinia'

type FlightRecord = {
  id: string
  fileName: string
  frames: any[]
  frameCount?: number
  parsedAt: string
  framesUrl?: string
  storagePath?: string
}

type SavedFlightRecord = {
  id: string
  user: string
  fileName: string
  frameCount: number
  parsedAt: string
  framesUrl: string
}

type FlightLogRow = {
  id: string
  file_name: string
  frame_count: number
  parsed_at: string
  frames_url: string
  storage_path: string
}

type State = {
  records: FlightRecord[]
}

type Getters = {
  getRecords: FlightRecord[]
}

type Actions = {
  addRecord: (record: FlightRecord) => void
  removeRecord: (id: string) => Promise<void>
  clearFlightLogs: () => Promise<void>
  saveFlightLog: (record: FlightRecord) => Promise<void>
  fetchFlightLogs: () => Promise<void>
}

type DroneStore = Store<'drone', State, Getters, Actions>

export type { FlightRecord, SavedFlightRecord, FlightLogRow, State, Getters, Actions, DroneStore }
