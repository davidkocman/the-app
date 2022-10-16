<script setup lang="ts">
import { useAppStore } from '@/store/app'
const appStore = useAppStore()
</script>

<template>
  <q-drawer
    v-model="appStore.drawer"
    show-if-above
    :mini="!appStore.drawer || appStore.miniState"
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
    <div class="absolute desktop-only" style="top: 20px; right: -12px">
      <q-btn
        dense
        round
        unelevated
        color="primary"
        size="sm"
        @click="appStore.miniState = !appStore.miniState"
      >
        <q-icon :name="(appStore.miniState) ? 'chevron_right' : 'chevron_left'" />
      </q-btn>
    </div>
  </q-drawer>
</template>

<!-- <style lang="scss" scoped>
</style> -->
