<script setup lang="ts">
import { computed, onBeforeMount, ComputedRef } from 'vue'
import { useNotesStore } from '@/store/notes'
import toMarkDown from '@/utils/toMarkdown'
import NewNote from './components/NewNote.vue'
import EditNote from './components/EditNote.vue'
import INoteResponse from '@/types/notes/INoteResponse'

const notesStore = useNotesStore()
onBeforeMount(() => {
  notesStore.getNotes()
})

const savedNotes: ComputedRef<INoteResponse[] | []> = computed(() => {
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
        <q-expansion-item
          v-for="(note, index) in savedNotes"
          :key="index"
          
          class="col col-12"
          :label="note.name"
        >
          <q-card>
            <q-card-section class="q-px-lg">
              <EditNote :note="note" />
              <div v-html="toMarkDown(note.content)"></div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </template>
    </div>
  </q-page>
</template>
