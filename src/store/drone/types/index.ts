import { Store } from 'pinia'

type FlightRecord = {
  id: string
  fileName: string
  frames: any[]
  parsedAt: string
}

type State = {
  records: FlightRecord[]
}

type Getters = {
  getRecords: FlightRecord[]
}

type Actions = {
  addRecord: (record: FlightRecord) => void
  removeRecord: (id: string) => void
}

type DroneStore = Store<'drone', State, Getters, Actions>

export type { FlightRecord, State, Getters, Actions, DroneStore }
