<script setup lang="ts">
import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import useMoviesStore from '@/store/movies'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL
const HERO_INTERVAL = 8000

const router = useRouter()
const moviesStore = useMoviesStore()

const heroIndex = ref(0)
const heroProgress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const heroItems = computed(() => moviesStore.trendingResultsByPopularityDesc?.slice(0, 8) ?? null)
const heroItem = computed(() => heroItems.value?.[heroIndex.value] ?? null)

function startTimer() {
  timer = setInterval(() => {
    heroProgress.value += 1
    if (heroProgress.value >= 100) {
      heroProgress.value = 0
      heroIndex.value = (heroIndex.value + 1) % (heroItems.value?.length ?? 1)
    }
  }, HERO_INTERVAL / 100)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function onMouseEnter() { stopTimer() }
function onMouseLeave() { startTimer() }

onBeforeMount(async () => {
  if (!moviesStore.trending) await moviesStore.getTrending()
  startTimer()
})

onBeforeUnmount(stopTimer)
</script>

<template>
  <q-card flat class="movies-widget overflow-hidden" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <!-- Background image -->
    <Transition name="widget-fade">
      <div
        v-if="heroItem"
        :key="heroIndex"
        class="movies-widget__bg"
        :style="`background-image: url(${IMAGE_URL}${heroItem.backdrop_path})`"
      />
    </Transition>

    <!-- Gradient overlays -->
    <div class="movies-widget__overlay-top" />
    <div class="movies-widget__overlay-bottom" />

    <!-- Header -->
    <div class="widget-header flex items-start justify-between no-wrap q-px-md q-pt-md q-pb-sm">
      <div>
        <div class="text-body1 text-weight-bold">Trending Movies</div>
        <div class="text-caption" style="opacity: 0.75">This week's top picks</div>
      </div>
      <q-btn
        flat
        dense
        round
        icon="open_in_new"
        size="sm"
        class="nav-btn q-ml-xs"
        style="flex-shrink: 0"
        @click="router.push('/movies')"
      >
        <q-tooltip>View all movies</q-tooltip>
      </q-btn>
    </div>

    <!-- Movie info -->
    <div class="movies-widget__info q-px-md q-pb-md">
      <template v-if="heroItem">
        <div class="row items-center q-gutter-xs q-mb-xs">
          <q-icon name="star" color="amber-6" size="12px" />
          <span class="text-caption text-white">{{ heroItem.vote_average.toFixed(1) }}</span>
          <span class="text-caption" style="color: rgba(255, 255, 255, 0.5)">({{ heroItem.vote_count }})</span>
        </div>
        <div class="movies-widget__title ellipsis">{{ heroItem.title }}</div>
        <q-btn
          color="primary"
          label="View Details"
          icon-right="arrow_forward"
          rounded
          unelevated
          no-caps
          size="sm"
          class="q-mt-sm"
          @click="moviesStore.getMovieData(heroItem.id)"
        />
      </template>
      <template v-else>
        <q-skeleton type="text" width="60%" dark class="q-mb-xs" />
        <q-skeleton type="text" width="40%" dark />
      </template>
    </div>

    <!-- Progress bar -->
    <div class="movies-widget__progress">
      <div class="movies-widget__progress-fill" :style="`width: ${heroProgress}%`" />
    </div>

    <!-- Loading spinner -->
    <div v-if="!heroItems" class="absolute-full flex flex-center">
      <q-spinner-dots color="white" size="36px" />
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.movies-widget {
  height: 320px;
  position: relative;
  background: #0d1b2a;

  &__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center 20%;
  }

  &__overlay-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, transparent 100%);
    z-index: 1;
  }

  &__overlay-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 55%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, transparent 100%);
    z-index: 1;
  }

  .widget-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    color: #fff;

    .nav-btn {
      opacity: 0.7;
      color: rgba(255, 255, 255, 0.85);
    }
  }

  &__info {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    z-index: 2;
    color: #fff;
  }

  &__title {
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.25;
    color: #fff;
  }

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.12);
    z-index: 5;

    &-fill {
      height: 100%;
      background: var(--q-primary);
      transition: width 0.08s linear;
    }
  }
}

.widget-fade-enter-active,
.widget-fade-leave-active {
  transition: opacity 0.7s ease;
}
.widget-fade-enter-from,
.widget-fade-leave-to {
  opacity: 0;
}
</style>
