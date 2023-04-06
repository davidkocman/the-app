<script setup lang="ts">
import { reactive } from 'vue'
import useUserStore from '@/store/user'

const userStore = useUserStore()
const loginData = reactive({
  email: '',
  password: ''
})
</script>

<template>
  <q-page class="flex bg-image flex-center">
    <q-card v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }">
      <!-- <q-card-section>
        <q-avatar size="103px" class="absolute-center shadow-10">
          <img src="profile.svg">
        </q-avatar>
      </q-card-section> -->
      <q-card-section>
        <div class="text-center q-pt-lg">
          <div class="col text-h6 ellipsis">Log in</div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input square filled v-model="loginData.email" type="email" label="email" lazy-rules />
          <q-input
            square
            filled
            v-model="loginData.password"
            type="password"
            label="password"
            autocomplete
            lazy-rules
          />
          <div>
            <q-btn
              label="Login"
              @click="userStore.loginUser(loginData.email, loginData.password)"
              type="button"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="scss" scoped>
.bg-image {
  background: white;

  .body--dark & {
    background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
  }
}
</style>
