<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

// store
import useGamesStore from '@/store/games'

const gamesStore = useGamesStore()
const { gameDetail, getGameDetail } = storeToRefs(gamesStore)

const dialog = computed(() => {
  return getGameDetail.value
})
</script>

<template>
  <q-dialog
    :model-value="dialog ? true : false"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    data-cy="game-detail-dialog"
  >
    <q-card flat class="game-detail">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup @click="gameDetail = null">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="game-detail-heading">
        <div class="text-h2">{{ getGameDetail?.name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none game-detail-description">
        {{ getGameDetail?.description_raw }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
