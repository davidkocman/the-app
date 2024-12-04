<script setup lang="ts">
import useUserStore from '@/store/user'
import useAppStore from '@/store/app'
import useGeneralInfo from '@/composables/profile/useGeneralInfo'
import FileInput from '@/components/FileInput.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const { nameModel, saveName, removeAvatar, userAvatar } = useGeneralInfo()
</script>

<template>
  <q-card class="user-card q-pa-sx">
    <q-card-section>
      <div class="wrapper">
        <div class="left">
          <q-avatar size="100px" class="avatar">
            <template v-if="userAvatar">
              <q-img :src="userAvatar" class="avatar__pic" width="100%" height="100%" />
            </template>
            <template v-else>
              <q-img src="@/assets/default-profile.svg" width="100%" height="100%" class="avatar__placeholder" />
            </template>
            <q-btn
              v-if="userAvatar"
              flat
              dense
              :ripple="false"
              icon="delete"
              unelevated
              class="avatar__remove absolute"
              @click="removeAvatar"
            ></q-btn>
            <FileInput v-else />
          </q-avatar>
        </div>
        <div class="right">
          <h2 class="text-h6 q-my-xs" data-cy="nameEdit">
            {{ nameModel }}
            <q-popup-edit v-model="nameModel" auto-save v-slot="scope" :disable="appStore.loading" @save="saveName">
              <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" data-cy="nameInput" />
            </q-popup-edit>
          </h2>
          <h3 class="text-body2">Email: {{ userStore.userData?.email }}</h3>
          <h3 class="text-body2">Verified: {{ userStore.userData?.emailVerified ? 'yes' : 'no' }}</h3>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.user-card {
  .wrapper {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;
    .left {
      .avatar {
        position: relative;
        overflow: hidden;
        &:hover {
          .file-input,
          .avatar__remove {
            display: flex;
          }
        }
        .file-input,
        &__remove {
          cursor: pointer;
          bottom: 0;
          left: 50%;
          height: 30px;
          transform: translateX(-50%);
          display: none;
          width: 100%;
        }
        .file-input {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.3);
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
