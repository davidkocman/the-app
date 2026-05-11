<script setup lang="ts">
import { ref } from 'vue'
import useMoviesStore from '@/store/movies'
import Image from '@/components/Image.vue'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const moviesStore = useMoviesStore()

const trendingRowRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragScrollLeft = ref(0)
const hasDragged = ref(false)

function onDragStart(e: MouseEvent) {
  if (!trendingRowRef.value) return
  isDragging.value = true
  hasDragged.value = false
  dragStartX.value = e.pageX - trendingRowRef.value.offsetLeft
  dragScrollLeft.value = trendingRowRef.value.scrollLeft
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value || !trendingRowRef.value) return
  e.preventDefault()
  const x = e.pageX - trendingRowRef.value.offsetLeft
  const walk = x - dragStartX.value
  if (Math.abs(walk) > 5) hasDragged.value = true
  trendingRowRef.value.scrollLeft = dragScrollLeft.value - walk
}

function onDragEnd() {
  isDragging.value = false
}

function onTrendingCardClick(id: number) {
  if (hasDragged.value) return
  moviesStore.getMovieData(id)
}
</script>

<template>
  <section class="scroll-section q-px-md q-mt-xl">
    <h2 class="section-label text-subtitle1 text-weight-bold q-mb-md">Trending This Week</h2>
    <div
      ref="trendingRowRef"
      class="scroll-row"
      :class="{ 'is-dragging': isDragging }"
      @mousedown="onDragStart"
      @mousemove="onDragMove"
      @mouseup="onDragEnd"
      @mouseleave="onDragEnd"
    >
      <template v-if="moviesStore.trendingResultsByPopularityDesc?.length">
        <div
          v-for="item in moviesStore.trendingResultsByPopularityDesc"
          :key="item.id"
          class="scroll-card"
          @click="onTrendingCardClick(item.id)"
        >
          <div class="scroll-card__img-wrap">
            <Image :path="`${IMAGE_URL}${item.poster_path}`" :ratio="2 / 3" imgClass="scroll-card__img" />
            <div class="scroll-card__hover">
              <q-icon name="visibility" size="38px" color="white" />
            </div>
          </div>
          <div class="scroll-card__meta q-mt-xs">
            <div class="text-caption text-weight-medium ellipsis">{{ item.title }}</div>
            <div class="row items-center q-gutter-xs">
              <q-icon name="star" size="10px" color="amber-6" />
              <span class="text-caption">{{ item.vote_average.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="n in 10" :key="n" class="scroll-card">
          <q-skeleton :ratio="2 / 3" class="rounded-borders" />
          <q-skeleton type="text" class="q-mt-xs" width="80%" />
        </div>
      </template>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-label {
  letter-spacing: 0.01em;
}

.scroll-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
  cursor: grab;
  user-select: none;

  &.is-dragging { cursor: grabbing; }

  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }
}

.scroll-card {
  flex-shrink: 0;
  width: 120px;
  cursor: pointer;
  scroll-snap-align: start;

  @media (min-width: $breakpoint-sm-min) { width: 140px; }
  @media (min-width: $breakpoint-md-min) { width: 155px; }

  &__img-wrap {
    position: relative;
    border-radius: 8px;
    overflow: hidden;

    &:hover .scroll-card__hover { opacity: 1; }
  }

  &__hover {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.18s;
    border-radius: 8px;
  }

  &__meta {
    padding: 0 2px;
  }
}
</style>
