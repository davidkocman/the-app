<script setup lang="ts">
import type { Seasons } from '@/types/movies'
import Image from '@/components/Image.vue'
import useMoviesStore from '@/store/movies'

const IMAGE_URL = import.meta.env.VITE_APP_TMDB_POSTER_URL

const movieStore = useMoviesStore()

defineProps({
  seasons: Array<Seasons>,
  id: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div v-if="seasons?.length" class="tv-show__seasons q-py-lg q-px-md q-mx-auto">
    <div v-for="season in seasons" :key="season.id" class="season q-pa-md shadow-8 rounded-borders">
      <Image
        v-if="season.poster_path"
        :imgClass="'season-poster shadow-box shadow-5 q-mb-sm rounded-borders'"
        :path="`${IMAGE_URL}${season.poster_path}`"
        :ratio="2 / 3"
      />
      <div class="season-info">
        <h3 class="text-subtitle1 text-weight-bolder">{{ season.name }}</h3>
        <h4 class="text-body2 text-weight-bold">{{ season.air_date }} | {{ season.episode_count }} Episodes</h4>
        <h4 class="text-body2">
          {{ season?.overview }}
        </h4>
        <div class="q-pa-md q-gutter-sm">
          <q-btn
            v-if="!season.episodes?.length"
            flat
            color="primary"
            label="Episodes"
            @click="movieStore.loadEpisodes(id, season.season_number)"
          />
          <template v-if="season.episodes">
            <ol>
              <li v-for="episode in season.episodes" :key="episode.id">
                {{ episode.name }} * {{ new Date(episode.air_date).toLocaleDateString('sk') }} *
                {{ episode.runtime }} min.
              </li>
            </ol>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tv-show {
  &__seasons {
    display: grid;
    gap: 16px;
    max-width: 1200px;
    width: 100%;
    .season {
      width: 100%;
      gap: 16px;
      display: grid;
      grid-template-columns: auto 1fr;
      .season-poster {
        width: 100px;
        max-height: 150px;
      }
      .season-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
}
</style>
