<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import useNotesStore from '@/store/notes'
import { noteColorValue } from '@/utils/noteColors'

const router = useRouter()
const notesStore = useNotesStore()

const loading = ref(false)

onMounted(async () => {
  // getNotes() no-ops if the store is already populated (e.g. user came from Notes).
  if (!notesStore.savedNotes.length) {
    loading.value = true
    await notesStore.getNotes()
    loading.value = false
  }
})

const pinnedNotes = computed(() => notesStore.savedNotes.filter((note) => note.pinned))

// One-line plain-text preview (markdown left as-is, just flattened/truncated).
const preview = (content: string) => {
  const text = content.replace(/\s+/g, ' ').trim()
  return text.length > 70 ? `${text.slice(0, 70)}…` : text
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
          @click="router.push('/notes')"
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
            <q-item-label v-if="preview(note.content)" caption lines="1">{{ preview(note.content) }}</q-item-label>
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

  &--empty {
    border: 1.5px solid rgba(127, 127, 127, 0.4);
  }
}
</style>
