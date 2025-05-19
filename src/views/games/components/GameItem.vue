<script setup lang="ts">
import type { UpcomingGamesItem } from '@/types/games'

// store
import useGamesStore from '@/store/games'

defineProps<{
  item: UpcomingGamesItem
}>()

const gamesStore = useGamesStore()
</script>

<template>
  <q-card :key="item.slug" class="game-item" @click="gamesStore.showGameDetail(item.id)">
    <q-img :src="item.background_image ? item.background_image : 'something'" :alt="item.slug" class="game-item__img">
      <q-card-section class="absolute-bottom bg-opacity-50 text-white">
        <h2 class="text-overline text-uppercase game-item__title">{{ item.name }}</h2>
      </q-card-section>
      <!-- <q-card-actions>
        <q-btn flat label="Details" @click="$router.push({ name: 'game-details', params: { slug: item.slug } })" />
      </q-card-actions> -->
    </q-img>
  </q-card>
</template>

<style lang="scss" scoped>
.game-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  &__img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  &__title {
    line-height: 1rem;
  }
}
</style>