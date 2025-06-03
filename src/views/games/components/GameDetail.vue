<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

// store
import useGamesStore from '@/store/games'

// utils
import { platformData } from '@/utils/resolvePlatform'

const gamesStore = useGamesStore()
const { gameDetail, getGameDetail } = storeToRefs(gamesStore)

const description = computed(() =>
  getGameDetail.value?.description_raw
    ? getGameDetail.value?.description_raw
    : getGameDetail.value?.description.replace(/<\/?p>|<br\s*\/?>/gi, '')
)

const dialog = computed(() => {
  return getGameDetail.value
})
</script>

<template>
  <q-dialog
    :model-value="dialog ? true : false"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    data-cy="game-detail-dialog"
  >
    <q-card flat class="game-detail">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup @click="gameDetail = null">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-img :src="getGameDetail?.background_image" class="page-art" />
      <q-card-section class="card-content q-pa-none">
        <div class="row game-data">
          <div class="col">
            <div class="game-data__head">
              <div class="game-data__meta flex q-mb-md">
                <div class="date text-weight-bold">
                  {{ getGameDetail?.released ? new Date(getGameDetail?.released).toLocaleDateString('sk-SK') : 'TBA' }}
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
                    ></q-icon>
                  </div>
                </div>
              </div>
              <h2 class="text-h2 text-weight-bold">{{ getGameDetail?.name }}</h2>
            </div>
            <!-- <h6>
              {{ description }}
            </h6> -->
          </div>
          <div class="col"></div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.game-detail {
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
        bottom: 0px;
        background: #000000;
        background: linear-gradient(0deg, $dark 0%, $dark 15%, rgba(255, 255, 255, 0) 100%);
      }
    }
  }
  .game-data {
    max-width: 900px;
    margin: 200px auto 0;
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
  }
}
</style>
