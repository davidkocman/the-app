<script setup lang="ts">
import type { Reviews } from '@/types/movies'
import type { PropType } from 'vue'

defineProps({
  reviews: {
    type: Object as PropType<Reviews>,
    required: true
  }
})

const resolveAvatarPath = (path: string) => {
  return path.includes('https') ? path.substring(1) : `${import.meta.env.VITE_APP_TMDB_POSTER_URL}${path}`
}
</script>

<template>
  <div v-if="reviews?.results?.length" class="tv-show__reviews q-py-lg q-px-md q-mx-auto">
    <q-card v-for="review in reviews.results" :key="review.id" class="review q-mb-md" bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img v-if="review.author_details.avatar_path" :src="resolveAvatarPath(review.author_details.avatar_path)" />
            <img v-else src="@/assets/default-profile.svg" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="row items-center">
            <h3 class="text-subtitle2">
              <a :href="review.url" target="_blank">{{ review.author_details.username }}</a>
            </h3>
            <q-chip square dense color="secondary" text-color="white">
              {{ review.author_details.rating }}
            </q-chip>
          </q-item-label>
          <q-item-label caption> on {{ new Date(review.created_at).toLocaleDateString('sk') }} </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section>
        <q-card-section> {{ review.content }} </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.tv-show {
  &__reviews {
    max-width: 1200px;
    .review {
      background-color: transparent;
    }
  }
}
</style>
