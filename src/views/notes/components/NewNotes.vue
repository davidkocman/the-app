<script setup lang="ts">
import { ref } from 'vue'
import { QEditorProps } from 'quasar'
import { useNotesStore } from '@/store/notes'

const dialog = ref(true)
interface IDefinitions {
  [key: string]: QEditorProps['definitions']
}

const notesStore = useNotesStore()
const notesContent = ref('')
const saveNotes = (): void => {
  notesStore.saveNote(notesContent.value)
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
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-body-1">Notes</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col q-pa-sm">
              <q-editor
                v-model="notesContent"
                :definitions="{
                  save: {
                    tip: 'Save notes',
                    icon: 'save',
                    label: 'Save',
                    handler: saveNotes
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
            </div>
            <div class="col q-pa-sm">
              <div class="text-body-1" v-html="notesContent"></div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
