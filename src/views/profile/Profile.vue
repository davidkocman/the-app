<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useMeta } from 'quasar'
import GeneralInfo from '@/views/profile/components/GeneralInfo.vue'

const userStore = useUserStore()
const pageTitle = ref(`Profile: ${userStore.userData?.name} | The App`)

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
  <q-page class="page-profile q-px-lg q-py-md">
    <div class="row justify-between items-center q-mb-sm">
      <h1 class="text-h6">Profile</h1>
    </div>
    <div class="row">
      <div class="col">
        <GeneralInfo />
      </div>
      <div class="col"></div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.page-profile {
  .row {
    gap: 8px;
  }
}
</style>
