import { ref, computed } from 'vue'
import {
  type FirebaseStorage,
  type TaskState,
  getDownloadURL,
  ref as firebaseStorageRef,
  uploadBytesResumable,
  getStorage,
  deleteObject
} from 'firebase/storage'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

export default function useFileUpload() {
  const appStore = useAppStore()
  const downloadUrl = ref('')
  const hasFailed = ref(false)
  const state = ref<TaskState>()
  const progress = ref(0)

  const progressInPercentage = computed(() => {
    return `${progress.value}`
  })

  const uploadFile = ({
    storage,
    path,
    data
  }: {
    storage: FirebaseStorage
    path: string
    data: Blob | Uint8Array | ArrayBuffer
  }) => {
    // reset every time we upload
    hasFailed.value = false
    progress.value = 0

    const storageRef = firebaseStorageRef(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, data)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        progress.value = calculatePercentage(snapshot.bytesTransferred, snapshot.totalBytes)
        state.value = snapshot.state
      },
      () => {
        hasFailed.value = true
      },
      async () => {
        // upload has completed successfully -> update state & generate download link.
        state.value = 'success'
        downloadUrl.value = await getDownloadURL(uploadTask.snapshot.ref)
      }
    )
    return uploadTask
  }

  const deleteFile = async (filePath: string) => {
    const storage = getStorage()
    const fileRef = firebaseStorageRef(storage, filePath)
    appStore.loading = true
    try {
      await deleteObject(fileRef)
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }

  const calculatePercentage = (numerator: number, denominator: number): number => {
    if (denominator === 0) {
      return 0
    }
    return Math.round((numerator / denominator) * 100)
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
