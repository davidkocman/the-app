<script setup lang="ts">
import { ref, computed, PropType, toRefs } from 'vue'
import useNotesStore from '@/store/notes'
import useAppStore from '@/store/app'
import toMarkDown from '@/utils/toMarkdown'

import type { SavedNote, Note } from '@/types/notes'

const props = defineProps({
  note: {
    required: true,
    type: Object as PropType<SavedNote>
  }
})

const { note } = toRefs(props)

const notesStore = useNotesStore()
const appStore = useAppStore()

const dialog = ref(false)
const removePrompt = ref(false)
const id = ref(note.value.id)
const name = ref(note.value.name)
const content = ref(note.value.content)

const save = async () => {
  if (name.value !== '' && content.value !== '') {
    const note: Note = {
      name: name.value,
      content: content.value
    }
    await notesStore.editNote(id.value, note)
    dialog.value = false
  }
}

const removeNote = async () => {
  await notesStore.removeNote(id.value)
  removePrompt.value = false
}

const noteContent = computed(() => {
  return toMarkDown(content.value)
})

const hasNameAndContent = computed(() => {
  return name.value !== '' && content.value !== '' ? true : false
})
</script>

<template>
  <div class="edit-note absolute">
    <q-btn
      color="negative"
      icon="delete"
      size="16px"
      class="q-pa-none q-mr-sm"
      flat
      dense
      @click="removePrompt = true"
      data-cy="note-remove-button"
    >
      <q-tooltip>Remove note</q-tooltip>
    </q-btn>
    <q-btn
      color="primary"
      icon="edit"
      size="16px"
      class="q-pa-none"
      flat
      dense
      @click="dialog = true"
      data-cy="note-edit-button"
    >
      <q-tooltip>Edit note</q-tooltip>
    </q-btn>

    <q-dialog
      v-model="dialog"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      data-cy="note-edit-dialog"
    >
      <q-card class="bg-dark-page">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="row justify-between items-center">
            <h6 class="text-h6">Editing note</h6>
            <q-btn
              color="primary"
              icon="save"
              size="16px"
              class="q-pa-none"
              flat
              dense
              :disable="!hasNameAndContent || appStore.loading"
              @click="save"
              data-cy="note-edit-save-button"
            >
              <q-tooltip>Save note</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col-12 col-md-6 editor">
              <q-input dense v-model="name" label="Note name" type="text" data-cy="note-edit-title" />
              <q-input
                type="textarea"
                dense
                v-model="content"
                :input-style="{ minHeight: '750px' }"
                placeholder="Note content"
                data-cy="note-edit-body"
              />
            </div>
            <div class="col-12 col-md-6 preview">
              <div class="text-body-1" v-html="noteContent"></div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="removePrompt" data-cy="remove-note-prompt">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Remove note {{ name }}?</div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="negative" icon="delete" flat v-close-popup @click="removeNote" data-cy="remove-note" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped>
.edit-note {
  top: 16px;
  right: 16px;
}
.editor {
  margin-bottom: 16px;
  @media (min-width: $breakpoint-sm-max) {
    margin-bottom: 0;
  }
}
.preview {
  padding-left: 16px;
  @media (min-width: $breakpoint-sm-max) {
    padding-left: 24px;
  }
}
</style>
