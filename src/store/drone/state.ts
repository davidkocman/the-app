import type { State } from './types'

export default function (): State {
  return {
    records: [],
    frames: [],
    activeRecordId: null
  }
}
