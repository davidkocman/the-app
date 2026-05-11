<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useMoviesStore from '@/store/movies'
import SearchResult from './SearchResult.vue'

const moviesStore = useMoviesStore()
const { searchResult } = storeToRefs(moviesStore)

const open = computed({
  get: () => !!searchResult.value,
  set: (val) => { if (!val) searchResult.value = null }
})
</script>

<template>
  <q-dialog v-model="open" position="right" full-height class="result-dialog">
    <div class="result-panel">
      <SearchResult v-if="searchResult" />
    </div>
  </q-dialog>
</template>

<style lang="scss">
.result-dialog .q-dialog__inner {
  padding: 0;
}
</style>

<style lang="scss" scoped>
.result-panel {
  width: 780px;
  max-width: 100vw;
  height: 100%;
  overflow-y: auto;
  background: var(--bg-base);
}
</style>
