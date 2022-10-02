<script setup lang="ts">
import { computed, onBeforeMount, ComputedRef } from 'vue'
import { useNotesStore } from '@/store/notes'
import NewNote from './components/NewNote.vue'
import INewNote from '@/types/INewNote'

const notesStore = useNotesStore()

onBeforeMount(() => {
  notesStore.getNotes()
})

const savedNotes: ComputedRef<INewNote[] | []> = computed(() => {
  return notesStore.notes
})
</script>

<template>
  <q-page class="page-notes q-pa-md">
    <div class="row justify-between items-center">
      <h1 class="text-h6">Notes</h1>
      <NewNote />
    </div>
    <div class="row">
      <template v-if="savedNotes.length !== 0">
        <div v-for="note in savedNotes" class="col">{{ note.name }}</div>
      </template>
    </div>
  </q-page>
</template>
