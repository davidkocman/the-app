<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
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

const searchQuery = ref('')

const filteredNotes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return notesStore.savedNotes
  return notesStore.savedNotes.filter(
    (note) => note.name.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)
  )
})
</script>

<template>
  <q-page class="page-notes q-py-md q-px-lg">
    <div class="row justify-between items-center q-mb-md">
      <h1 class="text-h4 q-my-none flex items-center" style="gap: 10px"><q-icon name="notes" />Notes</h1>
      <NewNote />
    </div>
    <div class="row q-mb-lg">
      <q-input
        v-model="searchQuery"
        placeholder="Search notes..."
        dense
        clearable
        class="col col-12 col-md-4"
        data-cy="notes-search"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="row">
      <template v-if="notesStore.savedNotes.length">
        <q-list bordered separator class="col col-12">
          <q-expansion-item
            v-for="(note, index) in filteredNotes"
            :key="index"
            :label="note.name"
            header-class="text-weight-medium"
            data-cy="note-item"
          >
            <q-card flat>
              <q-card-section class="q-px-lg">
                <EditNote :note="note" />
                <div v-html="toMarkDown(note.content)"></div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
        <p v-if="filteredNotes.length === 0" class="text-grey q-mt-md">No notes found for "{{ searchQuery }}".</p>
      </template>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.page-notes {
  padding-left: 6px;
  padding-right: 6px;

  @media (min-width: 768px) {
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
