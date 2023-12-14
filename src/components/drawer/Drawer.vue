<script setup lang="ts">
import useAppStore from '@/store/app'
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
        <q-item clickable v-ripple to="/" data-cy="toDashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section> Dashboard </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/news" data-cy="toNews">
          <q-item-section avatar>
            <q-icon name="newspaper" />
          </q-item-section>

          <q-item-section> News </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/movies" data-cy="toMovies">
          <q-item-section avatar>
            <q-icon name="movie" />
          </q-item-section>

          <q-item-section> Movies </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/notes" data-cy="toNotes">
          <q-item-section avatar>
            <q-icon name="notes" />
          </q-item-section>

          <q-item-section> Notes </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/invoices" data-cy="toInvoices">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>

          <q-item-section> Invoices </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/weather" data-cy="toWeather">
          <q-item-section avatar>
            <q-icon name="thermostat" />
          </q-item-section>

          <q-item-section> Weather </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple to="/profile" data-cy="toProfile">
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
        data-cy="drawerMiniStateToggle"
      >
        <q-icon :name="appStore.miniState ? 'chevron_right' : 'chevron_left'" />
      </q-btn>
    </div>
  </q-drawer>
</template>

<!-- <style lang="scss" scoped>
</style> -->
