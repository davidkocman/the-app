import { DJILog } from 'dji-log-parser-js'
import useDroneStore from '@/store/drone'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

const DJI_KEYCHAINS_PROXY = import.meta.env.VITE_APP_DJI_KEYCHAINS_PROXY as string | undefined

export default function useDroneLogParser() {
  const droneStore = useDroneStore()
  const appStore = useAppStore()

  const parseFiles = async (files: File[]) => {
    appStore.loading = true
    try {
      for (const file of files) {
        const buffer = await file.arrayBuffer()
        const bytes = new Uint8Array(buffer)
        const parser = new DJILog(bytes)

        let keychains
        if (parser.version >= 13) {
          keychains = await parser.fetchKeychains('', DJI_KEYCHAINS_PROXY)
        }

        const frames = parser.frames(keychains)
        droneStore.addRecord({
          id: `${file.name}-${Date.now()}`,
          fileName: file.name,
          frames,
          parsedAt: new Date().toISOString()
        })
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }

  return { parseFiles }
}
