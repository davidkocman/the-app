<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import { useMeta } from 'quasar'

const userStore = useUserStore()
const appStore = useAppStore()
const nameModel = ref('')
const pageTitle = ref(`Profile: ${userStore.userData?.name} | The App`)

onBeforeMount(() => {
  userStore.userData !== null && userStore.userData.name
    ? (nameModel.value = userStore.userData.name)
    : (nameModel.value = 'Enter your name')
})

const saveName = (value: string) => {
  userStore.updateUserName(value)
}

watch(nameModel, (newValue) => {
  if (newValue === '') nameModel.value = 'Enter your name'
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
  <q-page class="page-profile q-px-lg q-py-md">
    <div class="row justify-between items-center q-mb-sm">
      <h1 class="text-h6">Profile</h1>
    </div>
    <div class="row">
      <div class="col">
        <q-card class="user-card">
          <q-card-section class="q-pt-sm">
            <h2 class="text-h6 q-my-xs">
              {{ nameModel }}
              <q-popup-edit v-model="nameModel" auto-save v-slot="scope" :disable="appStore.loading" @save="saveName">
                <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
              </q-popup-edit>
            </h2>
            <h3 class="text-body2">Email: {{ userStore.userData?.email }}</h3>
            <h3 class="text-body2">Verified: {{ userStore.userData?.emailVerified }}</h3>
          </q-card-section>
        </q-card>
      </div>
      <div class="col"></div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.profile {
  .row {
    gap: 8px;
  }
}
</style>
