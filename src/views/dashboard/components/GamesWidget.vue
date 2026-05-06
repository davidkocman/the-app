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
  const futureGames = games.value.filter((g) => g.background_image && new Date(g.released).getTime() >= today.getTime())
  if (!futureGames.length) return []

  const closest = futureGames.reduce((a, b) =>
    new Date(a.released).getTime() < new Date(b.released).getTime() ? a : b
  )
  return futureGames.filter((g) => g.released === closest.released).slice(0, 3)
})

const closestDate = computed(() => {
  if (!closestGames.value.length) return null
  return new Date(closestGames.value[0].released).toLocaleDateString('sk-SK')
})
</script>

<template>
  <q-card flat class="games-widget overflow-hidden">
    <!-- Games row — full coverage -->
    <div v-if="!loading && closestGames.length" class="games-widget__row">
      <div v-for="game in closestGames" :key="game.slug" class="games-widget__item">
        <GameItem :item="game" />
      </div>
    </div>

    <!-- Header overlay -->
    <div class="widget-header flex items-start justify-between no-wrap q-px-md q-pt-md q-pb-sm">
      <div>
        <div class="text-body1 text-weight-bold">Upcoming games</div>
        <div class="text-caption" style="opacity: 0.75">
          Closest release:
          <span v-if="closestDate" class="text-weight-medium">{{ closestDate }}</span>
          <span v-else>—</span>
        </div>
      </div>
      <q-btn flat dense round icon="open_in_new" size="sm" class="nav-btn q-ml-xs" style="flex-shrink: 0" @click="router.push('/games')">
        <q-tooltip>View all games</q-tooltip>
      </q-btn>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="absolute-full flex flex-center">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Empty -->
    <div v-else-if="!closestGames.length" class="absolute-full flex flex-center column text-center q-pa-md">
      <q-icon name="sports_esports" size="32px" class="q-mb-sm" style="opacity: 0.4" />
      <div class="text-body2" style="opacity: 0.6">No games data available.</div>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.games-widget {
  height: 320px;
  position: relative;

  .widget-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, transparent 100%);
    color: #fff;

    .nav-btn {
      opacity: 0.7;
      color: rgba(255, 255, 255, 0.85);
    }
  }

  &__row {
    position: absolute;
    inset: 0;
    display: flex;
    gap: 0;
  }

  &__item {
    flex: 1;

    :deep(.game-item),
    :deep(.game-item__img) {
      height: 100%;
    }

    :deep(.game-item__img__title) {
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(18, 18, 18, 1) 100%);
    }
  }
}
</style>
