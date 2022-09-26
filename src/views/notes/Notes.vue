<script setup lang="ts">
import { QEditorProps } from 'quasar'
import { useNotesStore } from '@/store/notes'
import { ref } from 'vue'

interface IDefinitions {
  [key: string]: QEditorProps['definitions']
}

const notesStore = useNotesStore()
const editor = ref('')
const saveNotes = (): void => {
  notesStore.saveNote(editor.value)
}
</script>

<template>
  <q-page class="page-notes q-pa-md">
    <div class="row justify-between items-center">
      <h1 class="text-h6">Notes</h1>
    </div>
    <q-editor
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Save notes',
          icon: 'save',
          label: 'Save',
          handler: saveNotes()
        },
        upload: {
          tip: 'Upload to cloud',
          icon: 'cloud_upload',
          label: 'Upload',
          handler: saveNotes
        }
      } as IDefinitions"
      :toolbar="[
        ['bold', 'italic', 'underline', 'strike', 'undo', 'redo'],
        ['save', 'upload']
      ]"
    />
  </q-page>
</template>
