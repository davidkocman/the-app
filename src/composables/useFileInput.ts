import { ref } from 'vue'

const file = ref<File | null>()

export default function useFileInput() {
  const updateFile = ($event: Event) => {
    const target = $event.target as HTMLInputElement
    if (target && target.files) file.value = target.files[0]
  }

  return { file, updateFile }
}
