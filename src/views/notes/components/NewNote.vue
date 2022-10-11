<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotesStore } from '@/store/notes'
import { useAppStore } from '@/store/app'
import toMarkDown from '@/utils/toMarkdown'
import INote from '@/types/notes/INote'

const notesStore = useNotesStore()
const appStore = useAppStore()
const dialog = ref(false)
const name = ref('')
const content = ref('')

const save = async () => {
  if (name.value !== '' && content.value !== '') {
    const newNote: INote = {
      name: name.value,
      content: content.value
    }
    await notesStore.saveNewNote(newNote)
    dialog.value = false
  }
}

const noteContent = computed(() => {
  return toMarkDown(content.value)
})

const hasValues = computed(() => {
  return name.value !== '' && content.value !== '' ? true : false
})

const resetNote = () => {
  content.value = ''
  name.value = ''
}
</script>

<template>
  <div>
    <q-btn color="primary" icon="add" size="16px" class="q-pa-none" flat dense @click="dialog = true">
      <q-tooltip>New</q-tooltip>
    </q-btn>

    <q-dialog v-model="dialog" persistent maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-dark-page">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup @click="resetNote">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="row justify-between items-center">
            <h6 class="text-h6">New note</h6>
            <q-btn
              color="primary"
              icon="save"
              size="16px"
              class="q-pa-none"
              flat
              dense
              :disable="!hasValues || appStore.loading"
              @click="save"
            >
              <q-tooltip>Save note</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col q-pr-sm q-pb-sm">
              <q-input dense v-model="name" label="Note name" type="text" />
              <q-input
                type="textarea"
                dense
                v-model="content"
                :input-style="{ minHeight: '600px' }"
                placeholder="Note content"
              />
            </div>
            <div class="col q-pa-sm">
              <div class="text-body-1" v-html="noteContent"></div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
