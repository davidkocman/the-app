<script setup lang="ts">
import { useAppStore } from '@/store/app'
const appStore = useAppStore()
</script>

<template>
  <q-drawer
    v-model="appStore.drawer"
    show-if-above
    :mini="appStore.miniState"
    @mouseover="appStore.miniState = false"
    @mouseout="appStore.miniState = true"
    mini-to-overlay
    :width="200"
    :breakpoint="500"
    bordered
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section> Dashboard </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/news">
          <q-item-section avatar>
            <q-icon name="newspaper" />
          </q-item-section>

          <q-item-section> News </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/notes">
          <q-item-section avatar>
            <q-icon name="notes" />
          </q-item-section>

          <q-item-section> Notes </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/weather">
          <q-item-section avatar>
            <q-icon name="thermostat" />
          </q-item-section>

          <q-item-section> Weather </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple to="/profile">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section> Profile </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<!-- <style lang="scss" scoped>
</style> -->
