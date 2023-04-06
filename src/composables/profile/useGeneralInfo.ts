import { onBeforeMount, ref, computed, watch } from 'vue'
import { storage } from '@/firebaseConfig'
import useUserStore from '@/store/user'
import useFileUpload from '@/composables/useFileUpload'
import useFileInput from '@/composables/useFileInput'

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
    await uploadFile({
      storage,
      path: value.name,
      data: value as Blob
    })
  }

  const removeAvatar = async () => {
    if (userStore.userData?.photoUrl) {
      deleteFile(userStore.userData?.photoUrl)
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
