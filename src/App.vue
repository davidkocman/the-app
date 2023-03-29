<script setup lang="ts">
import { ref, watch, computed, onBeforeMount } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import useAppStore from '@/store/app'
import spinner from './utils/spinner'

const $q = useQuasar()
const appStore = useAppStore()
const pageTitle = ref('Welcome | The App')
const isLoading = computed(() => {
  return appStore.loading
})

onBeforeMount(() => {
  if (localStorage.getItem('the_app-mode') && localStorage.getItem('the_app-mode') === 'dark') $q.dark.set(true)
})

watch(isLoading, (value) => {
  spinner(false)
  if (value) spinner(true)
})

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
</script>

<template>
  <router-view />
</template>

<style lang="scss">
@import '@/assets/scss/app.scss';

body {
  &.body {
    &--light {
      background-color: var(--bg-base) !important;
      color: var(--text-base) !important;
    }
    &--dark {
      background-color: var(--bg-base) !important;
      color: var(--text-base) !important;
    }
  }
}
</style>
