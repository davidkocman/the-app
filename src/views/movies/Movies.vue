<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useMeta } from 'quasar'
import useMoviesStore from '@/store/movies'
import Search from '@/views/movies/components/Search.vue'
import HeroSection from '@/views/movies/components/HeroSection.vue'
import TrendingSection from '@/views/movies/components/TrendingSection.vue'
import Upcoming from '@/views/movies/components/Upcoming.vue'
import MovieDetailDialog from '@/views/movies/components/MovieDetailDialog.vue'

const pageTitle = ref('Movies | The App')
useMeta(() => ({
  title: pageTitle.value,
  meta: {
    description: { name: 'description', content: 'Movies' },
    keywords: { name: 'keywords', content: 'movies, motion pictures, series, tv, reviews, actors' },
    equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
  }
}))

const moviesStore = useMoviesStore()
const { searchFor } = storeToRefs(moviesStore)

onBeforeMount(async () => {
  if (!moviesStore.trending) await moviesStore.getTrending()
  if (!moviesStore.upcoming) moviesStore.getUpcoming()
})
</script>

<template>
  <q-page class="page-movies">
    <div class="page-header q-px-md q-pt-md q-pb-sm">
      <div class="row items-center no-wrap q-gutter-sm">
        <h1 class="text-h5 text-weight-bold q-my-none col-auto page-title flex items-center" style="gap: 10px"><q-icon name="movie" />Movies</h1>
        <div class="col search-bar">
          <div class="type-toggle">
            <button
              class="type-toggle__btn"
              :class="{ 'is-active': searchFor === 'movie' }"
              @click="searchFor = 'movie'"
            >
              Movie
            </button>
            <button class="type-toggle__btn" :class="{ 'is-active': searchFor === 'tv' }" @click="searchFor = 'tv'">
              TV
            </button>
          </div>
          <div class="search-bar__divider" />
          <div class="col min-w-0">
            <Search />
          </div>
        </div>
      </div>
    </div>

    <HeroSection />
    <TrendingSection />

    <section class="scroll-section q-px-md q-mt-xl q-mb-xl">
      <h2 class="section-label text-subtitle1 text-weight-bold q-mb-md">Coming Soon</h2>
      <Upcoming />
    </section>

    <MovieDetailDialog />

    <footer class="q-pa-sm text-center text-caption footer-credit">Data source: themoviedb.org</footer>
  </q-page>
</template>

<style lang="scss" scoped>
.page-movies {
  .page-title {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .footer-credit {
    color: var(--bg-muted);
    background-color: var(--bg-base);
    padding: 8px;
  }
}

.section-label {
  letter-spacing: 0.01em;
}

/* ── Unified search bar ───────────────────────────────── */
.search-bar {
  display: flex;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  min-width: 0;

  background: rgba(255, 255, 255, 0.07);
  .body--light & {
    background: rgba(0, 0, 0, 0.06);
  }

  &__divider {
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.15);
    flex-shrink: 0;
    .body--light & {
      background: rgba(0, 0, 0, 0.12);
    }
  }

  :deep(.q-field--standout .q-field__control) {
    background: transparent !important;
    box-shadow: none !important;
  }
}

/* ── Segmented type toggle ────────────────────────────── */
.type-toggle {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 8px;
  flex-shrink: 0;

  &__btn {
    border: none;
    background: transparent;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text-muted);
    transition:
      background 0.18s,
      color 0.18s;
    white-space: nowrap;
    line-height: 1;

    &.is-active {
      background: var(--q-primary);
      color: #fff;
    }

    &:not(.is-active):hover {
      background: rgba(255, 255, 255, 0.08);
      .body--light & {
        background: rgba(0, 0, 0, 0.06);
      }
    }
  }
}
</style>
