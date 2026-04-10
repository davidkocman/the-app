<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Screenshot } from '@/types/games'

const props = withDefaults(
  defineProps<{
    screenshots: Screenshot[]
    animated?: boolean
    arrows?: boolean
    swipeable?: boolean
    navigation?: boolean
    infinite?: boolean
    autoplay?: number | boolean
  }>(),
  {
    screenshots: () => [],
    animated: true,
    arrows: true,
    swipeable: true,
    navigation: false,
    infinite: true,
    autoplay: true
  }
)

const slide = ref(props.screenshots[0]?.id ?? 0)

const hasMultipleScreenshots = computed(() => (props.screenshots.length > 1 ? true : false))
</script>

<template>
  <div v-if="screenshots.length" class="screenshots">
    <q-carousel
      v-model="slide"
      :animated
      :arrows="hasMultipleScreenshots ? arrows : false"
      :swipeable
      :navigation
      :infinite
      :autoplay
      height="auto"
      class="screenshots__carousel"
    >
      <q-carousel-slide v-for="shot in screenshots" :key="shot.id" :name="shot.id" class="q-pa-none">
        <q-img :src="shot.image" :ratio="16 / 9">
          <template #loading>
            <q-spinner-dots color="primary" />
          </template>
        </q-img>
      </q-carousel-slide>
    </q-carousel>

    <div v-if="hasMultipleScreenshots" class="screenshots__thumbs q-mt-sm">
      <q-img
        v-for="shot in screenshots"
        :key="shot.id"
        :src="shot.image"
        :ratio="16 / 9"
        class="screenshots__thumb"
        :class="{ 'screenshots__thumb--active': slide === shot.id }"
        @click="slide = shot.id"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.screenshots {
  &__carousel {
    border-radius: 8px;
    overflow: hidden;

    :deep(.q-carousel__slide) {
      padding: 0;
    }
  }

  &__thumbs {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__thumb {
    width: 100px;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
    outline: 2px solid transparent;

    &:hover,
    &--active {
      opacity: 1;
      outline-color: $primary;
    }
  }
}
</style>
