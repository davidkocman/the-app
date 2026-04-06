<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import useGamesStore from '@/store/games'
import GameItem from '@/views/games/components/GameItem.vue'

const router = useRouter()
const gamesStore = useGamesStore()
const { games } = storeToRefs(gamesStore)

const loading = ref(false)

const today = new Date()
today.setHours(0, 0, 0, 0)
const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

onMounted(async () => {
  loading.value = true
  await gamesStore.fetchUpcomingGames(currentYearMonth)
  loading.value = false
})

const closestGames = computed(() => {
  const futureGames = games.value.filter(
    (g) => g.background_image && new Date(g.released).getTime() >= today.getTime()
  )
  if (!futureGames.length) return []

  const closest = futureGames.reduce((a, b) =>
    new Date(a.released).getTime() < new Date(b.released).getTime() ? a : b
  )
  return futureGames
    .filter((g) => g.released === closest.released)
    .slice(0, 3)
})

const closestDate = computed(() => {
  if (!closestGames.value.length) return null
  return new Date(closestGames.value[0].released).toLocaleDateString('sk-SK')
})
</script>

<template>
  <q-card class="games-widget full-height">
    <q-card-section class="q-pb-xs">
      <div class="row items-center justify-between no-wrap">
        <div class="text-h6 text-weight-bold">Upcoming games</div>
        <q-btn
          flat
          dense
          round
          icon="open_in_new"
          color="primary"
          size="sm"
          @click="router.push('/games')"
        >
          <q-tooltip>View all games</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>

    <q-card-section v-if="loading" class="flex flex-center" style="min-height: 120px;">
      <q-spinner-dots color="primary" size="40px" />
    </q-card-section>

    <q-card-section v-else-if="!closestGames.length" class="text-center text-grey-6">
      <q-icon name="sports_esports" size="32px" class="q-mb-sm" />
      <div class="text-body2">No games data available.</div>
    </q-card-section>

    <template v-else>
      <q-card-section class="q-pt-none q-pb-xs">
        <div class="text-caption text-grey-6">
          Closest release: <span class="text-weight-medium">{{ closestDate }}</span>
        </div>
      </q-card-section>
      <div class="games-widget__row">
        <div
          v-for="game in closestGames"
          :key="game.slug"
          class="games-widget__item"
        >
          <GameItem :item="game" />
        </div>
      </div>
    </template>
  </q-card>
</template>

<style lang="scss" scoped>
.games-widget {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__row {
    display: flex;
    flex: 1;
    padding: 0 16px 16px;
  }

  &__item {
    flex: 1;
    min-height: 150px;

    :deep(.game-item),
    :deep(.game-item__img) {
      height: 100%;
    }
  }
}
</style>
