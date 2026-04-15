import { supabase } from '@/supabaseConfig'
import { auth } from '@/firebaseConfig'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, DroneStore, FlightLogRow } from './types'

const BUCKET = 'flight-logs'

export const actions: PiniaActionAdaptor<Actions, DroneStore> = {
  addRecord(record) {
    this.records.push(record)
  },
  async removeRecord(id) {
    const appStore = useAppStore()
    const record = this.records.find((r) => r.id === id)
    try {
      if (record?.storagePath) {
        await supabase.storage.from(BUCKET).remove([record.storagePath])
      }
      await supabase.from('flight_logs').delete().eq('id', id)
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    }
    this.records = this.records.filter((r) => r.id !== id)
  },
  async clearFlightLogs() {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const { data } = await supabase
      .from('flight_logs')
      .select('storage_path')
      .eq('user_id', uid)

    if (data?.length) {
      const paths = data.map((r: { storage_path: string }) => r.storage_path)
      await supabase.storage.from(BUCKET).remove(paths)
    }

    await supabase.from('flight_logs').delete().eq('user_id', uid)
    this.records = []
  },
  async saveFlightLog(record) {
    const appStore = useAppStore()
    const uid = auth.currentUser?.uid
    if (!uid) return

    appStore.loading = true
    try {
      const json = JSON.stringify(record.frames)
      const blob = new Blob([json], { type: 'application/json' })
      const safeId = record.id.replace(/[^a-zA-Z0-9._-]/g, '_')
      const storagePath = `${uid}/${safeId}.json`

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, blob, { contentType: 'application/json', upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
      const framesUrl = urlData.publicUrl

      const { data: insertData, error: dbError } = await supabase
        .from('flight_logs')
        .insert({
          user_id: uid,
          file_name: record.fileName,
          frame_count: record.frames.length,
          parsed_at: record.parsedAt,
          frames_url: framesUrl,
          storage_path: storagePath
        })
        .select('id')
        .single()

      if (dbError) throw dbError

      this.records = this.records.map((r) =>
        r.id === record.id ? { ...r, id: insertData.id, framesUrl, storagePath } : r
      )
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async fetchFlightLogs() {
    const appStore = useAppStore()
    const uid = auth.currentUser?.uid
    if (!uid) return

    appStore.loading = true
    try {
      const { data, error } = await supabase
        .from('flight_logs')
        .select('id, file_name, frame_count, parsed_at, frames_url, storage_path')
        .eq('user_id', uid)
        .order('parsed_at', { ascending: false })

      if (error) throw error

      this.records = (data as unknown as FlightLogRow[]).map((d) => ({
        id: d.id,
        fileName: d.file_name,
        frames: [],
        parsedAt: d.parsed_at,
        framesUrl: d.frames_url,
        frameCount: d.frame_count,
        storagePath: d.storage_path
      }))
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }
}
