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
      <div class="game-item__img__title absolute-bottom bg-opacity-50 text-white">
        <h2 class="text-overline text-uppercase">{{ item.name }}</h2>
      </div>
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
    &__title {
      padding: 0;
      padding: 8px 16px 6px;
      h2 {
        line-height: 1.4rem;
      }
    }
  }
}
</style>
