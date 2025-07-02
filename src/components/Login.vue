<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 rounded-lg pa-6">
          <v-card-title class="text-h4 text-center mb-6 font-weight-bold text-primary">
            Login to Cribbage Tracker
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="Username"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                class="mb-4"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                class="mb-6"
                required
              ></v-text-field>

              <v-alert
                v-if="errorMessage"
                type="error"
                class="mb-4 rounded-lg"
                closable
                @click:close="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isLoading"
                :disabled="isLoading"
                class="rounded-lg"
              >
                Login
                <v-icon end icon="mdi-login"></v-icon>
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center mt-4">
            <v-btn text color="secondary" @click="goToRegister">
              Don't have an account? Register
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    await authStore.login(username.value, password.value);
    const redirectPath = route.query.redirect?.toString() || '/log-cribbage';
    router.push(redirectPath);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.msg || 'An unexpected error occurred during login.';
  } finally {
    isLoading.value = false;
  }
};

// --- NEW METHOD ---
const goToRegister = () => {
  router.push('/register');
};
// --- END NEW METHOD ---
</script>

<style scoped>
.v-container {
  background-color: #e0e0e0;
}

.v-card-title {
  font-family: 'Roboto', sans-serif;
  color: #1976D2;
}

.v-btn {
  letter-spacing: 0.05em;
}
</style>
