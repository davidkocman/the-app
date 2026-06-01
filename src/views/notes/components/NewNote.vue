<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import useNotesStore from '@/store/notes'
import useAppStore from '@/store/app'
import toMarkDown from '@/utils/toMarkdown'

import type { Note } from '@/types/notes/index'

const notesStore = useNotesStore()
const appStore = useAppStore()
const dialog = ref(false)
const name = ref('')
const content = ref('')

const save = async () => {
  if (name.value !== '' && content.value !== '') {
    const newNote: Note = {
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

const isDirty = computed(() => {
  return name.value !== '' || content.value !== ''
})

const resetNote = () => {
  content.value = ''
  name.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    dialog.value = false
    resetNote()
  }
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault()
    save()
  }
}

watch(dialog, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <q-btn
      color="primary"
      icon="add"
      size="16px"
      class="q-pa-none"
      flat
      dense
      @click="dialog = true"
      data-cy="new-note-add-button"
    >
      <q-tooltip>New</q-tooltip>
    </q-btn>

    <q-dialog
      v-model="dialog"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      data-cy="new-note-dialog"
    >
      <q-card flat class="bg-dark-page">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup @click="resetNote">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="row justify-between items-center">
            <h6 class="text-h6">New note</h6>
            <div class="flex items-center" style="gap: 12px">
              <transition name="fade">
                <span v-if="isDirty" class="text-caption text-warning flex items-center" style="gap: 4px">
                  <q-icon name="circle" size="8px" />
                  Unsaved changes
                </span>
              </transition>
              <q-btn
                color="primary"
                icon="save"
                size="16px"
                class="q-pa-none"
                flat
                dense
                :disable="!hasValues || appStore.loading"
                @click="save"
                data-cy="new-note-save-button"
              >
                <q-tooltip>Save note (Ctrl+S)</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col q-pr-sm q-pb-sm">
              <q-input dense v-model="name" label="Note name" type="text" data-cy="new-note-title" />
              <q-input
                type="textarea"
                dense
                v-model="content"
                :input-style="{ minHeight: '600px' }"
                placeholder="Note content"
                data-cy="new-note-body"
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
