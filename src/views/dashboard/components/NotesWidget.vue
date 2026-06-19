<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import useNotesStore from '@/store/notes'
import { noteColorValue } from '@/utils/noteColors'
import toMarkDown from '@/utils/toMarkdown'

import type { SavedNote } from '@/types/notes'

const router = useRouter()
const notesStore = useNotesStore()

const loading = ref(false)
const openedNote = ref<SavedNote | null>(null)
const dialog = ref(false)

onMounted(async () => {
  // getNotes() no-ops if the store is already populated (e.g. user came from Notes).
  if (!notesStore.savedNotes.length) {
    loading.value = true
    await notesStore.getNotes()
    loading.value = false
  }
})

const pinnedNotes = computed(() => notesStore.savedNotes.filter((note) => note.pinned))

const openNote = (note: SavedNote) => {
  openedNote.value = note
  dialog.value = true
}
</script>

<template>
  <q-card flat class="notes-widget column">
    <!-- Header -->
    <div class="widget-header flex items-start justify-between no-wrap q-px-md q-pt-md q-pb-sm">
      <div>
        <div class="text-body1 text-weight-bold flex items-center" style="gap: 6px">
          <q-icon name="push_pin" size="18px" />
          Pinned notes
        </div>
        <div class="text-caption" style="opacity: 0.75">
          {{ pinnedNotes.length }} {{ pinnedNotes.length === 1 ? 'note' : 'notes' }}
        </div>
      </div>
      <q-btn
        flat
        dense
        round
        icon="open_in_new"
        size="sm"
        class="nav-btn q-ml-xs"
        style="flex-shrink: 0"
        @click="router.push('/notes')"
      >
        <q-tooltip>View all notes</q-tooltip>
      </q-btn>
    </div>

    <!-- List -->
    <q-scroll-area v-if="!loading && pinnedNotes.length" class="col">
      <q-list separator>
        <q-item
          v-for="note in pinnedNotes"
          :key="note.id"
          clickable
          v-ripple
          :data-cy="`dashboard-pinned-${note.id}`"
          :style="noteColorValue(note.color) ? { borderLeft: `3px solid ${noteColorValue(note.color)}` } : undefined"
          @click="openNote(note)"
        >
          <q-item-section avatar style="min-width: auto" class="q-pr-sm">
            <span
              class="note-dot"
              :class="{ 'note-dot--empty': !noteColorValue(note.color) }"
              :style="noteColorValue(note.color) ? { backgroundColor: noteColorValue(note.color) } : undefined"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium ellipsis">{{ note.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" size="18px" style="opacity: 0.5" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <!-- Loading -->
    <div v-else-if="loading" class="col flex flex-center">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Empty -->
    <div v-else class="col flex flex-center column text-center q-pa-md">
      <q-icon name="push_pin" size="32px" class="q-mb-sm" style="opacity: 0.4" />
      <div class="text-body2" style="opacity: 0.6">No pinned notes yet.</div>
      <q-btn flat no-caps color="primary" label="Go to Notes" class="q-mt-sm" @click="router.push('/notes')" />
    </div>

    <!-- Read-only note view, opened in place from the dashboard -->
    <q-dialog v-model="dialog" data-cy="dashboard-note-dialog">
      <q-card v-if="openedNote" class="note-dialog column">
        <q-card-section
          class="row items-center no-wrap q-py-sm"
          :style="
            noteColorValue(openedNote.color) ? { borderLeft: `4px solid ${noteColorValue(openedNote.color)}` } : undefined
          "
        >
          <span
            class="note-dot q-mr-sm"
            :class="{ 'note-dot--empty': !noteColorValue(openedNote.color) }"
            :style="noteColorValue(openedNote.color) ? { backgroundColor: noteColorValue(openedNote.color) } : undefined"
          />
          <div class="text-h6 ellipsis col">{{ openedNote.name }}</div>
          <q-btn flat dense round icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-separator />

        <q-card-section class="col scroll">
          <div class="markdown-body" v-html="toMarkDown(openedNote.content)"></div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat no-caps icon="open_in_new" label="Open in Notes" color="primary" @click="router.push('/notes')" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<style lang="scss" scoped>
.notes-widget {
  height: 320px;
  position: relative;

  .widget-header {
    flex-shrink: 0;
  }

  .nav-btn {
    opacity: 0.7;
  }
}

.note-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;

  &--empty {
    border: 1.5px solid rgba(127, 127, 127, 0.4);
  }
}

.note-dialog {
  display: flex;
  flex-direction: column;
  // Quasar's `column` helper also sets flex-wrap: wrap; with a capped height that
  // makes the tall note content wrap into a second column on mobile. Force a single column.
  flex-wrap: nowrap;
  width: 600px;
  max-width: 90vw;
  max-height: 85vh;

  // Long URLs / code blocks in the note must not push the layout sideways on mobile.
  :deep(.markdown-body) {
    overflow-wrap: anywhere;

    pre {
      overflow-x: auto;
    }
  }
}
</style>
