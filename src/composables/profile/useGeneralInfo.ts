import { onBeforeMount, ref, computed, watch } from 'vue'
import useUserStore from '@/store/user'
import useFileUpload from '@/composables/useFileUpload'
import useFileInput from '@/composables/useFileInput'

const AVATARS_PATH_MARKER = '/avatars/'

/** Extracts the in-bucket storage path (`${uid}/${file}`) from a public avatar URL. */
const storagePathFromUrl = (url: string): string | null => {
  const withoutQuery = url.split('?')[0]
  const idx = withoutQuery.indexOf(AVATARS_PATH_MARKER)
  return idx >= 0 ? decodeURIComponent(withoutQuery.slice(idx + AVATARS_PATH_MARKER.length)) : null
}

export default function useGeneralInfo() {
  const userStore = useUserStore()
  const nameModel = ref('')
  const { uploadFile, deleteFile, downloadUrl } = useFileUpload()
  const { file } = useFileInput()

  onBeforeMount(() => {
    userStore.userData !== null && userStore.userData.name
      ? (nameModel.value = userStore.userData.name)
      : (nameModel.value = 'Enter your name')
  })

  const saveName = (value: string) => {
    userStore.updateUserName(value)
  }

  watch(nameModel, (newValue) => {
    if (newValue === '') nameModel.value = 'Enter your name'
  })

  watch(file, (newValue) => {
    if (newValue) {
      updateAvatar(newValue)
    }
  })

  watch(downloadUrl, (newValue) => {
    if (newValue) userStore.updateUserAvatar(newValue)
  })

  const userAvatar = computed(() => {
    return userStore.userData?.photoUrl
  })

  const updateAvatar = async (value: File) => {
    const uid = userStore.userData?.uid
    if (!uid) return
    await uploadFile({
      path: `${uid}/${value.name}`,
      data: value
    })
  }

  const removeAvatar = async () => {
    if (userStore.userData?.photoUrl) {
      const path = storagePathFromUrl(userStore.userData.photoUrl)
      if (path) await deleteFile(path)
      userStore.updateUserAvatar('')
    }
  }

  return {
    nameModel,
    saveName,
    removeAvatar,
    userAvatar
  }
}
