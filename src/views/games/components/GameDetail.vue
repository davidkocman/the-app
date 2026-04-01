<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

// store
import useGamesStore from '@/store/games'
import useAppStore from '@/store/app'

// utils
import { platformData } from '@/utils/resolvePlatform'

// types
import { Language } from '@/types/games'
import type { Rating } from '@/types/games'

const gamesStore = useGamesStore()
const appStore = useAppStore()
const { gameDetail, getGameDetail, gameScreenshots, gameMovies, gameRedditPosts } = storeToRefs(gamesStore)
const { isDarkMode } = storeToRefs(appStore)

const dialog = computed(() => !!getGameDetail.value)

const description = computed(() =>
  getGameDetail.value?.description_raw
    ? getGameDetail.value.description_raw
    : (getGameDetail.value?.description.replace(/<\/?p>|<br\s*\/?>/gi, '\n\n') ?? '')
)

const ratingLabel = computed(() => {
  const map: Record<number, string> = { 1: 'Skip', 2: 'Meh', 3: 'Recommended', 4: 'Exceptional' }
  return map[getGameDetail.value?.rating_top ?? 0] ?? 'N/A'
})

const ratingColor = computed(() => ratingColorMap[ratingLabel.value.toLowerCase()] ?? 'var(--text-muted)')

const ratingColorMap: Record<string, string> = {
  skip: '#e74c3c',
  meh: '#e67e22',
  recommended: '#3498db',
  exceptional: '#27ae60'
}

const ratingsChartSeries = computed(() => ((getGameDetail.value?.ratings as Rating[]) ?? []).map((r) => r.count))

const ratingsChartOptions = computed(() => ({
  chart: { type: 'donut', background: 'transparent', toolbar: { show: false } },
  labels: ((getGameDetail.value?.ratings as Rating[]) ?? []).map((r) => r.title),
  colors: ((getGameDetail.value?.ratings as Rating[]) ?? []).map((r) => ratingColorMap[r.title] ?? '#aaa'),
  legend: {
    labels: { colors: isDarkMode.value ? 'rgba(255,255,255,.85)' : '#213547' }
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Ratings',
            color: isDarkMode.value ? 'rgba(255,255,255,.85)' : '#213547'
          }
        }
      }
    }
  },
  tooltip: {
    theme: isDarkMode.value ? 'dark' : 'light',
    y: {
      formatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
        const r = (getGameDetail.value?.ratings as Rating[])?.[seriesIndex]
        return `${val} votes (${r?.percent?.toFixed(1)}%)`
      }
    }
  },
  dataLabels: { enabled: false },
  theme: { mode: isDarkMode.value ? 'dark' : 'light' }
}))

const platformsWithRequirements = computed(() =>
  (getGameDetail.value?.platforms ?? []).filter((p) => p.requirements?.minimum || p.requirements?.recommended)
)

const selectedMovie = ref(0)
const redditExpanded = ref(false)

watch(dialog, (val) => {
  if (!val) {
    selectedMovie.value = 0
    redditExpanded.value = false
  }
})
</script>

<template>
  <q-dialog
    :model-value="dialog"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    data-cy="game-detail-dialog"
  >
    <q-card flat class="game-detail">
      <q-bar class="bar-sticky">
        <q-space />
        <q-btn v-close-popup dense flat icon="close" @click="gameDetail = null">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-img :src="getGameDetail?.background_image" class="page-art" />

      <q-card-section class="card-content q-pa-none">
        <div class="row game-data">
          <!-- LEFT COLUMN -->
          <div class="col-12 col-md-5 game-data__left">
            <div class="game-data__head">
              <div class="game-data__meta flex q-mb-md">
                <div class="date text-weight-bold">
                  {{ getGameDetail?.released ? new Date(getGameDetail.released).toLocaleDateString('sk-SK') : 'TBA' }}
                </div>
                <div class="platforms flex items-center">
                  <div
                    v-for="platformMeta in getGameDetail?.platforms"
                    :key="platformMeta.platform.id"
                    class="platform"
                  >
                    <q-icon
                      size="20px"
                      :name="platformData(platformMeta.platform.id)?.icon"
                      :title="platformData(platformMeta.platform.id)?.name"
                    />
                  </div>
                </div>
              </div>
              <h2 class="text-h2 text-weight-bold">{{ getGameDetail?.name }}</h2>
            </div>

            <!-- Rating -->
            <div class="game-data__rating q-mt-md flex items-center">
              <span class="rating-label" :style="{ color: ratingColor }">{{ ratingLabel }}</span>
              <span class="text-caption q-ml-sm" style="color: var(--text-muted)">
                {{ getGameDetail?.ratings_count?.toLocaleString() }} ratings
              </span>
            </div>

            <!-- Ratings donut chart -->
            <VueApexCharts
              v-if="ratingsChartSeries.length"
              type="donut"
              :series="ratingsChartSeries"
              :options="ratingsChartOptions"
              height="260"
            />

            <!-- Genres -->
            <div v-if="getGameDetail?.genres?.length" class="game-data__section q-mt-md">
              <div class="section-label text-caption q-mb-xs">Genres</div>
              <div class="flex" style="gap: 6px; flex-wrap: wrap">
                <q-chip v-for="g in getGameDetail.genres" :key="g.id" dense outline color="primary" text-color="white">
                  {{ g.name }}
                </q-chip>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="getGameDetail?.tags?.length" class="game-data__section q-mt-md">
              <div class="section-label text-caption q-mb-xs">Tags</div>
              <div class="flex" style="gap: 6px; flex-wrap: wrap">
                <q-badge
                  v-for="tag in getGameDetail.tags.filter((t) => t.language === Language.Eng)"
                  :key="tag.id"
                  outline
                  color="secondary"
                >
                  {{ tag.name }}
                </q-badge>
              </div>
            </div>

            <!-- Developer + Publisher -->
            <div v-if="getGameDetail?.developers?.length" class="row q-mt-md" style="gap: 0">
              <div class="game-data__section col-12 col-sm-6">
                <div class="section-label text-caption q-mb-xs">Developer</div>
                <div>{{ getGameDetail.developers.map((d) => d.name).join(', ') }}</div>
              </div>
              <div v-if="getGameDetail?.publishers?.length" class="game-data__section col-12 col-sm-6">
                <div class="section-label text-caption q-mb-xs">Publisher</div>
                <div>{{ getGameDetail.publishers.map((p) => p.name).join(', ') }}</div>
              </div>
            </div>

            <!-- About -->
            <section class="game-data__section q-mt-lg">
              <div class="section-label text-caption q-mb-xs">About</div>
              <p class="text-body2 description">{{ description }}</p>
            </section>

            <!-- Reddit Posts -->
            <section v-if="gameRedditPosts.length" class="game-data__section q-mt-lg">
              <div class="section-label text-caption q-mb-sm reddit-toggle" @click="redditExpanded = !redditExpanded">
                Reddit
                <q-icon :name="redditExpanded ? 'expand_less' : 'expand_more'" size="14px" />
              </div>
              <div v-if="redditExpanded" class="flex column" style="gap: 8px">
                <q-card v-for="post in gameRedditPosts" :key="post.id" flat bordered>
                  <q-card-section>
                    <a
                      :href="post.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-subtitle2 reddit-post-link"
                      >{{ post.name }}</a
                    >
                    <div class="text-caption" style="color: var(--text-muted)">{{ post.username }}</div>
                  </q-card-section>
                  <template v-if="post.text">
                    <q-separator inset />
                    <q-card-section>
                      <p class="text-body2 reddit-post-text">{{ post.text.replace(/<[^>]*>/g, '') }}</p>
                    </q-card-section>
                  </template>
                </q-card>
              </div>
            </section>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="col-12 col-md-7 game-data__right">
            <!-- Screenshots -->
            <section v-if="gameScreenshots.length" class="game-data__section q-mb-lg">
              <div class="screenshots-grid">
                <q-img
                  v-for="shot in gameScreenshots"
                  :key="shot.id"
                  :src="shot.image"
                  class="screenshot-thumb"
                  :ratio="16 / 9"
                >
                  <template #loading>
                    <q-spinner-dots color="primary" />
                  </template>
                </q-img>
              </div>
            </section>

            <!-- System Requirements -->
            <section v-if="platformsWithRequirements.length" class="game-data__section q-mb-lg">
              <div class="section-label text-caption q-mb-xs">System Requirements</div>
              <q-expansion-item
                v-for="pm in platformsWithRequirements"
                :key="pm.platform.id"
                :label="pm.platform.name"
                dense
                class="q-mb-xs req-expansion"
              >
                <div class="req-card q-pa-md">
                  <div v-if="pm.requirements.minimum" class="q-mb-sm">
                    <div class="text-caption section-label q-mb-xs">Minimum</div>
                    <p class="text-body2 req-text">{{ pm.requirements.minimum }}</p>
                  </div>
                  <div v-if="pm.requirements.recommended">
                    <div class="text-caption section-label q-mb-xs">Recommended</div>
                    <p class="text-body2 req-text">{{ pm.requirements.recommended }}</p>
                  </div>
                </div>
              </q-expansion-item>
            </section>

            <!-- Videos -->
            <section v-if="gameMovies.length" class="game-data__section q-mb-lg">
              <div class="section-label text-caption q-mb-xs">Videos</div>
              <div class="video-player q-mb-sm">
                <video
                  :key="gameMovies[selectedMovie].id"
                  :poster="gameMovies[selectedMovie].preview"
                  controls
                  class="full-width"
                >
                  <source :src="gameMovies[selectedMovie].data['480']" type="video/mp4" />
                </video>
              </div>
              <div v-if="gameMovies.length > 1" class="flex" style="gap: 8px; flex-wrap: wrap">
                <q-img
                  v-for="(movie, idx) in gameMovies"
                  :key="movie.id"
                  :src="movie.preview"
                  class="video-thumb"
                  :class="{ 'video-thumb--active': selectedMovie === idx }"
                  :ratio="16 / 9"
                  @click="selectedMovie = idx"
                />
              </div>
            </section>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.game-detail {
  overflow-y: auto;

  .bar-sticky {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg-base);
  }

  .q-img {
    &.page-art {
      position: absolute;
      height: auto;
      max-height: 700px;
      width: 100%;
      object-fit: cover;
      z-index: 0;
      opacity: 0.2;
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 200px;
        left: 0;
        bottom: 0;
        background: #000000;
        background: linear-gradient(0deg, $dark 0%, $dark 15%, rgba(255, 255, 255, 0) 100%);
      }
    }
  }

  .game-data {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 200px;
    padding-bottom: 48px;

    &__meta {
      gap: 8px;
      .date {
        padding: 2px 4px;
        border-radius: 4px;
        display: inline-block;
        background-color: var(--text-base);
        color: var(--bg-base);
      }
      .platforms {
        gap: 4px;
      }
    }

    &__head {
      h2 {
        overflow-wrap: break-word;
      }
    }

    &__left {
      padding: 0 16px 16px;
    }

    &__right {
      padding: 0 16px 16px;
    }

    &__section {
      .section-label {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-muted);
      }
    }
  }

  .rating-label {
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .reddit-toggle {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    user-select: none;
  }

  .reddit-post-link {
    color: $primary;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .reddit-post-text {
    white-space: pre-line;
    margin: 0;
  }

  .req-expansion {
    border: 1px solid var(--bg-muted);
    border-radius: 6px;
    overflow: hidden;
  }

  .req-card {
    background: var(--bg-muted);
    .req-text {
      white-space: pre-line;
    }
  }

  .screenshots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 8px;
  }

  .screenshot-thumb {
    border-radius: 6px;
    overflow: hidden;
  }

  .video-player video {
    border-radius: 8px;
    max-height: 360px;
    width: 100%;
    background: #000;
  }

  .video-thumb {
    width: 120px;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
    &:hover,
    &--active {
      opacity: 1;
      outline: 2px solid $primary;
    }
  }

  .suggestions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
  }

  .suggestion-card {
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.15s;
    &:hover {
      transform: scale(1.03);
    }
    &__info {
      background: rgba(0, 0, 0, 0.65);
      padding: 6px 8px;
    }
  }
}
</style>
