<script setup lang="ts">
import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import useMoviesStore from '@/store/movies'
import Image from '@/components/Image.vue'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL
const HERO_INTERVAL = 8000

const moviesStore = useMoviesStore()
const heroIndex = ref(0)
const heroProgress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const heroItems = computed(() => moviesStore.trendingResultsByPopularityDesc?.slice(0, 8) ?? null)
const heroItem = computed(() => heroItems.value?.[heroIndex.value] ?? null)

const heroDragStartX = ref(0)
const heroDragging = ref(false)

function onHeroDragStart(e: MouseEvent) {
  heroDragging.value = true
  heroDragStartX.value = e.pageX
}

function onHeroDragEnd(e: MouseEvent) {
  if (!heroDragging.value) return
  heroDragging.value = false
  const delta = e.pageX - heroDragStartX.value
  if (Math.abs(delta) < 50) return
  const count = heroItems.value?.length ?? 1
  if (delta < 0) {
    goToHero((heroIndex.value + 1) % count)
  } else {
    goToHero((heroIndex.value - 1 + count) % count)
  }
}

function onHeroTouchStart(e: TouchEvent) {
  heroDragStartX.value = e.touches[0].pageX
}

function onHeroTouchEnd(e: TouchEvent) {
  const delta = e.changedTouches[0].pageX - heroDragStartX.value
  if (Math.abs(delta) < 50) return
  const count = heroItems.value?.length ?? 1
  if (delta < 0) {
    goToHero((heroIndex.value + 1) % count)
  } else {
    goToHero((heroIndex.value - 1 + count) % count)
  }
}

function goToHero(i: number) {
  heroIndex.value = i
  heroProgress.value = 0
  stopTimer()
  startTimer()
}

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

onBeforeMount(startTimer)
onBeforeUnmount(stopTimer)
</script>

<template>
  <section class="hero">
    <template v-if="heroItems?.length">
      <div
        class="hero__container"
        :class="{ 'is-dragging': heroDragging }"
        @mousedown="onHeroDragStart"
        @mouseup="onHeroDragEnd"
        @mouseleave="heroDragging = false"
        @touchstart.passive="onHeroTouchStart"
        @touchend.passive="onHeroTouchEnd"
      >
        <Transition name="hero-fade">
          <div
            :key="heroIndex"
            class="hero__slide"
            :style="`background-image: url(${IMAGE_URL}${heroItem?.backdrop_path})`"
          >
            <div class="hero__overlay" />
            <div class="hero__content q-px-md q-pb-lg">
              <div class="row items-end q-gutter-md">
                <div class="hero__poster gt-sm">
                  <Image
                    v-if="heroItem?.poster_path"
                    :path="`${IMAGE_URL}${heroItem.poster_path}`"
                    :ratio="2 / 3"
                    imgClass="hero__poster-img rounded-borders"
                  />
                </div>
                <div class="hero__info col">
                  <div class="row items-center q-gutter-xs q-mb-xs">
                    <q-icon name="star" color="amber-6" size="14px" />
                    <span class="text-body2 text-white">{{ heroItem?.vote_average.toFixed(1) }}</span>
                    <span class="text-caption hero__vote-count">({{ heroItem?.vote_count }})</span>
                  </div>
                  <h2 class="hero__title q-mb-xs">{{ heroItem?.title }}</h2>
                  <p class="hero__overview gt-xs q-mb-md">{{ heroItem?.overview }}</p>
                  <q-btn
                    v-if="heroItem"
                    color="primary"
                    label="View Details"
                    icon-right="arrow_forward"
                    rounded
                    unelevated
                    no-caps
                    @click="moviesStore.getMovieData(heroItem.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </Transition>
        <div class="hero__progress">
          <div class="hero__progress-fill" :style="`width: ${heroProgress}%`" />
        </div>
        <div class="hero__dots">
          <button
            v-for="(_, i) in heroItems.length"
            :key="i"
            class="hero__dot"
            :class="{ 'is-active': i === heroIndex }"
            :aria-label="`Slide ${i + 1}`"
            @click="goToHero(i)"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="hero__skeleton">
        <q-skeleton height="100%" width="100%" square />
      </div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  &__container {
    height: 320px;
    position: relative;
    overflow: hidden;
    cursor: grab;
    user-select: none;

    &.is-dragging {
      cursor: grabbing;
    }

    @media (min-width: $breakpoint-sm-min) {
      height: 420px;
    }
    @media (min-width: $breakpoint-md-min) {
      height: 520px;
    }
  }

  &__skeleton {
    height: 320px;
    @media (min-width: $breakpoint-sm-min) {
      height: 420px;
    }
    @media (min-width: $breakpoint-md-min) {
      height: 520px;
    }
  }

  &__slide {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center 20%;
    display: flex;
    align-items: flex-end;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.45) 55%, transparent 100%);
    .body--light & {
      background: linear-gradient(to top, rgba(242, 242, 242, 0.97) 0%, rgba(242, 242, 242, 0.5) 55%, transparent 100%);
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 960px;
  }

  &__poster {
    flex-shrink: 0;
    &-img {
      width: 110px;
    }
  }

  &__title {
    font-size: clamp(18px, 3.5vw, 36px);
    font-weight: 700;
    line-height: 1.2;
    color: white;
    .body--light & {
      color: var(--text-base);
    }
  }

  &__overview {
    color: rgba(255, 255, 255, 0.8);
    max-width: 560px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    .body--light & {
      color: var(--text-muted);
    }
  }

  &__vote-count {
    color: rgba(255, 255, 255, 0.55);
    .body--light & {
      color: var(--text-muted);
    }
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

  &__dots {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    gap: 6px;
    z-index: 5;
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    padding: 0;
    background: rgba(255, 255, 255, 0.3);
    transition:
      background 0.2s,
      transform 0.2s;

    &.is-active {
      background: white;
      transform: scale(1.4);
    }
  }
}

.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.7s ease;
}
.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}
</style>
