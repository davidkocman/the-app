<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useMeta } from 'quasar'
import useNotesStore from '@/store/notes'
import toMarkDown from '@/utils/toMarkdown'
import NewNote from './components/NewNote.vue'
import EditNote from './components/EditNote.vue'

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
</script>

<template>
  <q-page class="page-notes q-py-md q-px-lg">
    <div class="row justify-between items-center q-mb-sm">
      <h6 class="text-h6">Notes</h6>
      <NewNote />
    </div>
    <div class="row">
      <template v-if="notesStore.savedNotes.length">
        <q-list bordered separator class="col col-12">
          <q-expansion-item
            v-for="(note, index) in notesStore.savedNotes"
            :key="index"
            :label="note.name"
            header-class="text-weight-medium"
            data-cy="note-item"
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
