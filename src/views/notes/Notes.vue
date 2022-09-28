<script setup lang="ts">
import NewNotes from './components/NewNotes.vue'
</script>

<template>
  <q-page class="page-notes q-pa-md">
    <div class="row justify-between items-center">
      <h1 class="text-h6">Notes</h1>
      <NewNotes />
    </div>
    <div class="row">
      <div class="col"></div>
      <div class="col"></div>
    </div>
  </q-page>
</template>
