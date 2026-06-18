<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useMeta } from 'quasar'
import useNotesStore from '@/store/notes'
import { NOTE_COLORS } from '@/utils/noteColors'
import NewNote from './components/NewNote.vue'
import NoteListItem from './components/NoteListItem.vue'

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
const selectedColor = ref<string | null>(null)

// Only offer color filters that are actually in use.
const usedColors = computed(() => {
  const inUse = new Set(notesStore.savedNotes.map((note) => note.color).filter(Boolean))
  return NOTE_COLORS.filter((c) => inUse.has(c.key))
})

const toggleColorFilter = (key: string) => {
  selectedColor.value = selectedColor.value === key ? null : key
}

const filteredNotes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return notesStore.savedNotes.filter((note) => {
    const matchesQuery = !q || note.name.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)
    const matchesColor = !selectedColor.value || note.color === selectedColor.value
    return matchesQuery && matchesColor
  })
})

// Split into separate groups so each renders in its own list.
const pinnedNotes = computed(() => filteredNotes.value.filter((note) => note.pinned))
const unpinnedNotes = computed(() => filteredNotes.value.filter((note) => !note.pinned))
</script>

<template>
  <q-page class="page-notes q-py-md q-px-lg">
    <div class="row justify-between items-center q-mb-md">
      <h1 class="text-h4 q-my-none flex items-center" style="gap: 10px"><q-icon name="notes" />Notes</h1>
      <NewNote />
    </div>
    <div class="row items-center q-col-gutter-md q-mb-lg">
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
      <div v-if="usedColors.length" class="col col-12 col-md-auto flex items-center q-gutter-x-sm">
        <button
          type="button"
          class="filter-chip text-caption"
          :class="{ 'filter-chip--active': selectedColor === null }"
          data-cy="notes-filter-all"
          @click="selectedColor = null"
        >
          All
        </button>
        <button
          v-for="c in usedColors"
          :key="c.key"
          type="button"
          class="filter-swatch"
          :class="{ 'filter-swatch--active': selectedColor === c.key }"
          :style="{ backgroundColor: c.value }"
          :title="c.label"
          :data-cy="`notes-filter-${c.key}`"
          @click="toggleColorFilter(c.key)"
        />
      </div>
    </div>
    <div class="row">
      <template v-if="notesStore.savedNotes.length">
        <div class="col col-12">
          <template v-if="pinnedNotes.length">
            <div class="section-label text-caption text-grey-5 flex items-center q-mb-sm" style="gap: 6px">
              <q-icon name="push_pin" size="14px" />
              Pinned
            </div>
            <q-list bordered separator class="q-mb-lg">
              <NoteListItem v-for="note in pinnedNotes" :key="note.id" :note="note" />
            </q-list>
          </template>

          <template v-if="unpinnedNotes.length">
            <div
              v-if="pinnedNotes.length"
              class="section-label text-caption text-grey-5 flex items-center q-mb-sm"
              style="gap: 6px"
            >
              <q-icon name="notes" size="14px" />
              Other
            </div>
            <q-list bordered separator>
              <NoteListItem v-for="note in unpinnedNotes" :key="note.id" :note="note" />
            </q-list>
          </template>
        </div>
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

.section-label {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}

.filter-chip {
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid rgba(127, 127, 127, 0.4);
  background: transparent;
  cursor: pointer;
  line-height: 1.4;

  &--active {
    border-color: var(--q-primary);
    color: var(--q-primary);
    font-weight: 600;
  }
}

.filter-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  transition: transform 0.12s ease;

  &:hover {
    transform: scale(1.12);
  }

  &--active {
    box-shadow: 0 0 0 2px var(--q-primary);
  }
}
</style>
