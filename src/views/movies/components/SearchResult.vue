<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useMoviesStore from '@/store/movies'
import Image from '@/components/Image.vue'
import Seasons from '@/views/movies/components/Seasons.vue'
import Reviews from '@/views/movies/components/Reviews.vue'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const moviesStore = useMoviesStore()
const { searchResult, searchResultType } = storeToRefs(moviesStore)

const castScrollRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragScrollLeft = ref(0)
const hasDragged = ref(false)

function onDragStart(e: MouseEvent) {
  if (!castScrollRef.value) return
  isDragging.value = true
  hasDragged.value = false
  dragStartX.value = e.pageX - castScrollRef.value.offsetLeft
  dragScrollLeft.value = castScrollRef.value.scrollLeft
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value || !castScrollRef.value) return
  e.preventDefault()
  const x = e.pageX - castScrollRef.value.offsetLeft
  const walk = x - dragStartX.value
  if (Math.abs(walk) > 5) hasDragged.value = true
  castScrollRef.value.scrollLeft = dragScrollLeft.value - walk
}

function onDragEnd() {
  isDragging.value = false
}

const tabs = ref<'seasons' | 'reviews'>('seasons')

const userRating = computed(() =>
  searchResult.value ? Math.floor((searchResult.value.vote_average / 10) * 100) : undefined
)

const ratingColor = computed(() => {
  if (!userRating.value) return 'grey-5'
  if (userRating.value >= 70) return 'green-5'
  if (userRating.value >= 50) return 'amber-5'
  return 'red-5'
})

const director = computed(() =>
  searchResult.value?.credits.crew
    .filter((m) => m.known_for_department === 'Directing')
    .map((m) => m.name)
)
const sound = computed(() =>
  searchResult.value?.credits.crew
    .filter((m) => m.known_for_department === 'Sound')
    .map((m) => m.name)
)
const story = computed(() =>
  searchResult.value?.credits.crew
    .filter((m) => m.known_for_department === 'Writing')
    .map((m) => m.name)
)
const searchResultTitle = computed(() => {
  if (searchResult.value) {
    if (searchResultType.value === 'tv') return searchResult.value.original_name
    return searchResult.value.original_title
  }
  return null
})
</script>

<template>
  <div v-if="searchResult !== null" class="search-result">
    <!-- Sticky close bar -->
    <div class="close-bar">
      <q-btn flat round dense icon="close" aria-label="Close" @click="searchResult = null" />
    </div>

    <!-- Backdrop with overlay -->
    <div
      class="backdrop"
      :style="`background-image: url(${IMAGE_URL + searchResult.backdrop_path})`"
    >
      <div class="backdrop__overlay" />
      <div class="backdrop__content q-px-lg q-pb-lg">
        <div class="row items-end q-gutter-md">
          <!-- Poster -->
          <div class="poster-wrap gt-xs">
            <Image
              v-if="searchResult.poster_path"
              :path="`${IMAGE_URL}${searchResult.poster_path}`"
              imgClass="poster-img rounded-borders shadow-10"
              :ratio="2 / 3"
            />
          </div>

          <!-- Heading info -->
          <div class="heading col">
            <!-- Networks -->
            <div v-if="searchResult.networks?.length" class="q-mb-xs">
              <q-chip
                v-for="network in searchResult.networks"
                :key="network.id"
                color="primary"
                text-color="white"
                square
                dense
              >{{ network.name }}</q-chip>
            </div>

            <h3 class="result-title q-mb-xs">
              <a
                v-if="searchResult.homepage"
                :href="searchResult.homepage"
                target="_blank"
                class="result-title__link"
              >{{ searchResultTitle }}</a>
              <template v-else>{{ searchResultTitle }}</template>
              <span class="result-title__year">
                <template v-if="searchResultType === 'tv'">
                  ({{ new Date(searchResult.first_air_date).getFullYear() }})
                </template>
                <template v-else>
                  ({{ new Date(searchResult.release_date).getFullYear() }})
                </template>
              </span>
            </h3>

            <p v-if="searchResult.tagline" class="text-caption text-italic q-mb-sm tagline">
              {{ searchResult.tagline }}
            </p>

            <!-- Genres -->
            <div class="q-mb-sm">
              <q-chip
                v-for="genre in searchResult.genres"
                :key="genre.id"
                square
                dense
                color="secondary"
                text-color="white"
                class="q-ml-none"
              >{{ genre.name }}</q-chip>
            </div>

            <!-- Rating -->
            <div class="row items-center q-gutter-sm q-mb-sm">
              <q-circular-progress
                show-value
                font-size="11px"
                :value="userRating ?? 0"
                size="56px"
                :thickness="0.2"
                :color="ratingColor"
                track-color="grey-8"
                class="rating-circle text-white"
              >
                <span class="text-weight-bold">{{ userRating }}%</span>
              </q-circular-progress>
              <span class="text-caption rating-votes">{{ searchResult.vote_count }} votes</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overview -->
    <div class="q-px-lg q-py-md">
      <p class="text-body2 overview">{{ searchResult.overview }}</p>
    </div>

    <!-- Crew -->
    <div class="crew-row q-px-lg q-pb-md row q-gutter-md">
      <div v-if="searchResultType === 'movie' && director?.length" class="crew-item">
        <div class="text-caption crew-label">Director</div>
        <div class="text-subtitle2">{{ director[0] }}</div>
      </div>
      <div v-if="story?.length" class="crew-item">
        <div class="text-caption crew-label">Story</div>
        <div class="text-subtitle2">{{ story[0] }}</div>
      </div>
      <div v-if="searchResultType === 'movie' && sound?.length" class="crew-item">
        <div class="text-caption crew-label">Sound</div>
        <div class="text-subtitle2">{{ sound[0] }}</div>
      </div>
    </div>

    <q-separator />

    <!-- Cast horizontal scroll -->
    <div class="cast-section q-px-lg q-py-md">
      <div class="text-subtitle2 text-weight-bold q-mb-sm">Cast</div>
      <div
        ref="castScrollRef"
        class="cast-scroll"
        :class="{ 'is-dragging': isDragging }"
        @mousedown="onDragStart"
        @mousemove="onDragMove"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd"
      >
        <div
          v-for="cast in searchResult.credits.cast.slice(0, 10)"
          :key="cast.id"
          class="cast-card"
        >
          <Image
            v-if="cast.profile_path"
            :path="`${IMAGE_URL}${cast.profile_path}`"
            :ratio="2 / 3"
            imgClass="cast-photo rounded-borders"
          />
          <div v-else class="cast-photo-placeholder rounded-borders">
            <q-icon name="person" size="32px" color="grey-5" />
          </div>
          <div class="text-caption text-weight-medium ellipsis q-mt-xs">{{ cast.name }}</div>
          <div class="text-caption ellipsis cast-character">{{ cast.character }}</div>
        </div>
      </div>
    </div>

    <q-separator />

    <!-- Tabs -->
    <q-tabs
      v-model="tabs"
      dense
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
      class="q-mt-xs"
    >
      <q-tab v-if="searchResultType === 'tv' && searchResult.seasons?.length" name="seasons" label="Seasons" />
      <q-tab v-if="searchResult.reviews" name="reviews" label="Reviews" />
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-model="tabs"
      keep-alive
      animated
      transition-next="fade"
      transition-prev="fade"
      class="tab-panels"
    >
      <q-tab-panel
        v-if="searchResultType === 'tv' && searchResult.seasons?.length"
        name="seasons"
        class="q-pa-none"
      >
        <Seasons :seasons="searchResult.seasons" :id="searchResult.id" />
      </q-tab-panel>
      <q-tab-panel v-if="searchResult.reviews" name="reviews" class="q-pa-none">
        <Reviews :reviews="searchResult.reviews" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style lang="scss" scoped>
.search-result {
  min-height: 100%;
}

/* ── Close bar ─────────────────────────────────────────── */
.close-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-base);
  display: flex;
  justify-content: flex-end;
  padding: 6px 10px;
}

/* ── Backdrop ──────────────────────────────────────────── */
.backdrop {
  position: relative;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(270deg, rgba(30, 30, 30, 1) 0%, rgba(30, 30, 30, 0.6) 70%, transparent 100%);

    .body--light & {
      background: linear-gradient(270deg, rgba(243, 243, 243, 1) 0%, rgba(243, 243, 243, 0.6) 70%, transparent 100%);
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    padding-top: 80px;
  }
}

/* ── Poster ────────────────────────────────────────────── */
.poster-wrap {
  flex-shrink: 0;

  .poster-img {
    width: 160px;
  }
}

/* ── Heading ───────────────────────────────────────────── */
.heading {
  min-width: 0;
}

.result-title {
  font-size: clamp(18px, 3vw, 28px);
  font-weight: 600;
  line-height: 1.3;

  &__link {
    color: inherit;
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }

  &__year {
    font-size: 0.65em;
    font-weight: 400;
    color: var(--text-muted);
    margin-left: 6px;
  }
}

.tagline {
  color: var(--text-muted);
}

/* ── Rating ────────────────────────────────────────────── */
.rating-circle {
  flex-shrink: 0;
}

.rating-votes {
  color: var(--text-muted);
}

/* ── Overview ──────────────────────────────────────────── */
.overview {
  max-width: 680px;
  line-height: 1.6;
}

/* ── Crew ──────────────────────────────────────────────── */
.crew-label {
  color: var(--text-muted);
  margin-bottom: 2px;
}

/* ── Cast ──────────────────────────────────────────────── */
.cast-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(128, 128, 128, 0.2) transparent;
  cursor: grab;
  user-select: none;

  &.is-dragging { cursor: grabbing; }

  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.2);
    border-radius: 2px;
  }
}

.cast-card {
  flex-shrink: 0;
  width: 88px;
  text-align: center;

  .cast-photo {
    width: 100%;
    border-radius: 6px;
  }

  .cast-photo-placeholder {
    width: 100%;
    aspect-ratio: 2 / 3;
    background: var(--bg-muted);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cast-character {
    color: var(--text-muted);
  }
}

/* ── Tabs ──────────────────────────────────────────────── */
.tab-panels {
  background-color: transparent;
}
</style>
