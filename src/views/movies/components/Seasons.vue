<script setup lang="ts">
import { Seasons } from '@/types/movies'
import Image from '@/components/Image.vue'

defineProps({
  seasons: Array<Seasons>
})
</script>

<template>
  <div v-if="seasons?.length" class="tv-show__seasons q-py-lg q-px-md q-mx-auto">
    <div v-for="season in seasons" :key="season.id" class="season q-pa-md shadow-8 rounded-borders">
      <Image
        v-if="season.poster_path"
        :imgClass="'season-poster shadow-box shadow-5 q-mb-sm rounded-borders'"
        :path="season.poster_path"
        :ratio="2 / 3"
      />
      <div class="season-info">
        <h3 class="text-subtitle1 text-weight-bolder">{{ season.name }}</h3>
        <h4 class="text-body2 text-weight-bold">{{ season.air_date }} | {{ season.episode_count }} Episodes</h4>
        <h4 class="text-body2">
          {{ season?.overview }}
        </h4>
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
