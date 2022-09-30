<script setup lang="ts">
import { ref } from 'vue'
import { QEditorProps } from 'quasar'
import { useNotesStore } from '@/store/notes'

const notesStore = useNotesStore()
const dialog = ref(false)
const noteName = ref('')
const noteContent = ref('')

interface IDefinitions {
  [key: string]: QEditorProps['definitions']
}

const save = (): void => {
  if(noteName.value !== '' && noteContent.value !== '') notesStore.saveNewNote(noteContent.value)
}
</script>

<template>
  <div>
    <q-btn color="primary" icon="add" size="16px" class="q-pa-none" flat dense @click="dialog = true">
      <q-tooltip>Create new notes</q-tooltip>
    </q-btn>

    <q-dialog v-model="dialog" persistent maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-dark-page">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup @click="noteContent = '', noteName = ''">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-mb-sm">
          <div class="text-body-1">New note</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col">
              <q-input dense v-model="noteName" label="Note name" type="text" />
              <q-editor
                v-model="noteContent"
                class="q-mt-md"
                :definitions="{
                  save: {
                    tip: 'Save notes',
                    icon: 'save',
                    label: 'Save',
                    handler: save
                  },
                  upload: {
                    tip: 'Upload to cloud',
                    icon: 'cloud_upload',
                    label: 'Upload',
                    handler: save
                  }
                } as IDefinitions"
                :toolbar="[
                  ['bold', 'italic', 'underline', 'strike', 'undo', 'redo'],
                  ['save', 'upload']
                ]"
              />
            </div>
            <div class="col">
              <div class="text-body-1" v-html="noteContent"></div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
