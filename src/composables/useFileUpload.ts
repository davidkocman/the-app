import { ref, computed } from 'vue'
import { supabase } from '@/supabaseConfig'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

const BUCKET = 'avatars'

export default function useFileUpload() {
  const appStore = useAppStore()
  const downloadUrl = ref('')
  const hasFailed = ref(false)
  const state = ref<'idle' | 'running' | 'success' | 'error'>('idle')
  const progress = ref(0)

  const progressInPercentage = computed(() => {
    return `${progress.value}`
  })

  /**
   * Uploads a file to the Supabase `avatars` bucket and exposes its public URL
   * via `downloadUrl`. The Supabase JS client uploads in a single request, so
   * progress jumps 0 → 100 rather than streaming.
   *
   * @param path - Storage path inside the bucket, e.g. `${uid}/${file.name}`.
   * @param data - File/Blob to upload.
   */
  const uploadFile = async ({ path, data }: { path: string; data: Blob | File }) => {
    hasFailed.value = false
    progress.value = 0
    state.value = 'running'
    appStore.loading = true
    try {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, data, { upsert: true, contentType: (data as File).type || undefined })
      if (error) throw error

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
      // Cache-bust so an overwritten avatar (same path) refreshes in the UI.
      downloadUrl.value = `${urlData.publicUrl}?t=${Date.now()}`
      progress.value = 100
      state.value = 'success'
    } catch (e) {
      hasFailed.value = true
      state.value = 'error'
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }

  /**
   * Removes a file from the `avatars` bucket.
   *
   * @param path - Storage path inside the bucket (not the public URL).
   */
  const deleteFile = async (path: string) => {
    appStore.loading = true
    try {
      const { error } = await supabase.storage.from(BUCKET).remove([path])
      if (error) throw error
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }

  return {
    downloadUrl,
    hasFailed,
    state,
    progress,
    progressInPercentage,
    uploadFile,
    deleteFile
  }
}
