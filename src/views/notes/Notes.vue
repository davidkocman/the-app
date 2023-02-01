<script setup lang="ts">
import { ref, computed, onBeforeMount, ComputedRef } from 'vue'
import { useNotesStore } from '@/store/notes'
import { useMeta } from 'quasar'
import toMarkDown from '@/utils/toMarkdown'
import NewNote from './components/NewNote.vue'
import EditNote from './components/EditNote.vue'
import { NoteResponse } from '@/types/notes/index'

const pageTitle = ref('Notes | The App')
useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Notes' },
      keywords: { name: 'keywords', content: 'notes, note, markdown, .md' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})

const notesStore = useNotesStore()
onBeforeMount(() => {
  notesStore.getNotes()
})

const savedNotes: ComputedRef<NoteResponse[] | []> = computed(() => {
  return notesStore.notes
})
</script>

<template>
  <q-page class="page-notes q-pa-md">
    <div class="row justify-between items-center q-mb-sm">
      <h6 class="text-h6">Notes</h6>
      <NewNote />
    </div>
    <div class="row">
      <template v-if="savedNotes.length !== 0">
        <q-list bordered separator class="col col-12">
          <q-expansion-item
            v-for="(note, index) in savedNotes"
            :key="index"
            :label="note.name"
            header-class="text-weight-medium"
          >
            <q-card>
              <q-card-section class="q-px-lg">
                <EditNote :note="note" />
                <div v-html="toMarkDown(note.content)"></div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </template>
    </div>
  </q-page>
</template>
