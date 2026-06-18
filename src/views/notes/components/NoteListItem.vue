<script setup lang="ts">
import { PropType } from 'vue'
import useNotesStore from '@/store/notes'
import toMarkDown from '@/utils/toMarkdown'
import { noteColorValue } from '@/utils/noteColors'
import EditNote from './EditNote.vue'

import type { SavedNote } from '@/types/notes'

defineProps({
  note: {
    required: true,
    type: Object as PropType<SavedNote>
  }
})

const notesStore = useNotesStore()
</script>

<template>
  <q-expansion-item
    data-cy="note-item"
    :style="noteColorValue(note.color) ? { borderLeft: `4px solid ${noteColorValue(note.color)}` } : undefined"
  >
    <template #header>
      <q-item-section avatar style="min-width: auto" class="q-pr-sm">
        <span
          class="note-dot"
          :class="{ 'note-dot--empty': !noteColorValue(note.color) }"
          :style="noteColorValue(note.color) ? { backgroundColor: noteColorValue(note.color) } : undefined"
        />
      </q-item-section>
      <q-item-section class="text-weight-medium">{{ note.name }}</q-item-section>
      <q-item-section side>
        <q-btn
          round
          flat
          dense
          size="sm"
          icon="push_pin"
          :color="note.pinned ? 'primary' : 'grey-5'"
          :class="{ 'pin-btn--idle': !note.pinned }"
          :aria-label="note.pinned ? 'Unpin note' : 'Pin note'"
          :data-cy="`note-pin-${note.id}`"
          @click.stop="notesStore.togglePin(note.id, !note.pinned)"
        >
          <q-tooltip>{{ note.pinned ? 'Unpin' : 'Pin to top' }}</q-tooltip>
        </q-btn>
      </q-item-section>
    </template>
    <q-card flat>
      <q-card-section class="q-px-lg">
        <EditNote :note="note" />
        <div v-html="toMarkDown(note.content)"></div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
.note-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &--empty {
    border: 1.5px solid rgba(127, 127, 127, 0.4);
  }
}

.pin-btn--idle {
  opacity: 0.35;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
}
</style>
