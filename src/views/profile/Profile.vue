<script setup lang="ts">
import { useUserStore } from "@/store/user"

const userStore = useUserStore()
</script>

<template>
  <q-page class="profile q-pa-md">
    <div class="row">
      <div class="col">
        <q-card class="my-card">
          <q-card-section>
            <h2 class="text-h6 q-my-xs">{{ userStore.userData?.name }}</h2>
            <span class="text-caption">{{ userStore.userData?.email }}</span>
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
