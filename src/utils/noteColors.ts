// Shared palette for note color labels. The stable `key` is what gets stored in
// the DB (notes.color); `value` is the hex used for swatches/indicators.

export type NoteColor = {
  key: string
  label: string
  value: string
}

export const NOTE_COLORS: NoteColor[] = [
  { key: 'red', label: 'Red', value: '#e53935' },
  { key: 'orange', label: 'Orange', value: '#fb8c00' },
  { key: 'amber', label: 'Amber', value: '#fdd835' },
  { key: 'green', label: 'Green', value: '#43a047' },
  { key: 'teal', label: 'Teal', value: '#00897b' },
  { key: 'blue', label: 'Blue', value: '#1e88e5' },
  { key: 'purple', label: 'Purple', value: '#8e24aa' },
  { key: 'grey', label: 'Grey', value: '#757575' }
]

/** Resolves a stored color key to its hex value (undefined for none/unknown). */
export const noteColorValue = (key?: string | null): string | undefined =>
  NOTE_COLORS.find((c) => c.key === key)?.value
