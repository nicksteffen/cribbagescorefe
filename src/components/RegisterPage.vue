<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 rounded-lg pa-6">
          <v-card-title class="text-h4 text-center mb-6 font-weight-bold text-primary">
            Register for Cribbage Tracker
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
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
                class="mb-4"
                required
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :rules="[rules.passwordMatch]"
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

              <v-alert
                v-if="successMessage"
                type="success"
                class="mb-4 rounded-lg"
                closable
                @click:close="successMessage = ''"
              >
                {{ successMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="success"
                size="large"
                block
                :loading="isLoading"
                :disabled="isLoading"
                class="rounded-lg"
              >
                Register
                <v-icon end icon="mdi-account-plus"></v-icon>
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center mt-4">
            <v-btn text color="secondary" @click="goToLogin">
              Already have an account? Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../utils/axios'

const router = useRouter();
// const instance = getCurrentInstance();
// const axios = instance?.appContext.config.globalProperties.$axios;

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const rules = {
  passwordMatch: (value: string) => value === password.value || 'Passwords do not match.',
};

const handleRegister = async () => {
  errorMessage.value = ''; // Clear previous errors
  successMessage.value = ''; // Clear previous success messages
  isLoading.value = true;

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    isLoading.value = false;
    return;
  }

  // Basic client-side validation
  if (!username.value || !password.value) {
    errorMessage.value = 'Username and password are required.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await axios.post('/api/register', {
      username: username.value,
      password: password.value,
      // email: 'optional_email@example.com' // Include if your User model has an email field
    });

    successMessage.value = response.data.msg || 'Registration successful! You can now log in.';
    username.value = ''; // Clear form
    password.value = '';
    confirmPassword.value = '';

    // Optionally redirect to login page after a short delay
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error: any) {
    errorMessage.value = error.response?.data?.msg || 'An unexpected error occurred during registration.';
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.v-container {
  background-color: #e0e0e0; /* Light grey background for the page */
}

.v-card-title {
  font-family: 'Roboto', sans-serif;
  color: #1976D2;
}

.v-btn {
  letter-spacing: 0.05em;
}
</style>
