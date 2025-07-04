<template>
  <v-container fluid class="home-page fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-card class="elevation-12 rounded-lg pa-6 home-card">
          <v-card-title class="text-h3 text-center mb-4 font-weight-bold text-primary">
            <v-icon size="56" class="mr-4">mdi-cards-playing-outline</v-icon>
            Cribbage Score Tracker
          </v-card-title>
          <v-card-subtitle class="text-h6 text-center text-secondary mb-6">
            Track your games, analyze your stats, and master Cribbage!
          </v-card-subtitle>

          <v-card-text>
            <p class="text-body-1 mb-6 text-grey-darken-2">
              Whether you're a seasoned player or just starting out, our app helps you keep a detailed record of your Cribbage matches.
              Log scores, track wins and losses, understand your streaks, and quickly reference all scoring combinations.
            </p>

            <v-row justify="center" class="my-8">
              <v-col cols="12" sm="6" md="4" class="text-center">
                <v-icon size="64" color="info">mdi-chart-line</v-icon>
                <div class="text-h6 font-weight-bold mt-2">Track Stats</div>
                <div class="text-body-2 text-grey-darken-1">Monitor your wins, losses, and consecutive game streaks.</div>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="text-center">
                <v-icon size="64" color="success">mdi-pencil-box-multiple-outline</v-icon>
                <div class="text-h6 font-weight-bold mt-2">Log Games Easily</div>
                <div class="text-body-2 text-grey-darken-1">Quickly record scores against registered users or guests.</div>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="text-center">
                <v-icon size="64" color="warning">mdi-book-open-variant</v-icon>
                <div class="text-h6 font-weight-bold mt-2">Scoring Reference</div>
                <div class="text-body-2 text-grey-darken-1">Never miss a point with our comprehensive scoring guide.</div>
              </v-col>
            </v-row>

            <v-divider class="my-8"></v-divider>

            <div v-if="authStore.isLoggedIn" class="d-flex flex-column flex-sm-row justify-center align-center">
              <v-btn
                color="success"
                size="large"
                class="mr-sm-4 mb-4 mb-sm-0 rounded-lg"
                @click="goToLogCribbage"
              >
                <v-icon start>mdi-plus-circle</v-icon>
                Log New Game
              </v-btn>
              <v-btn
                color="primary"
                size="large"
                variant="outlined"
                class="rounded-lg"
                @click="goToDashboard"
              >
                <v-icon start>mdi-view-dashboard</v-icon>
                Go to Dashboard
              </v-btn>
            </div>
            <div v-else class="d-flex flex-column flex-sm-row justify-center align-center">
              <v-btn
                color="primary"
                size="large"
                class="mr-sm-4 mb-4 mb-sm-0 rounded-lg"
                @click="goToLogin"
              >
                <v-icon start>mdi-login</v-icon>
                Login
              </v-btn>
              <v-btn
                color="secondary"
                size="large"
                variant="outlined"
                class="rounded-lg"
                @click="goToRegister"
              >
                <v-icon start>mdi-account-plus</v-icon>
                Register
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import your auth store

const router = useRouter();
const authStore = useAuthStore();

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};

const goToDashboard = () => {
  router.push('/dashboard');
};

const goToLogCribbage = () => {
  router.push('/log-cribbage');
};
</script>

<style scoped>
.home-page {
  background-color: #e0e0e0; /* Consistent light grey background */
  min-height: 100vh; /* Ensure it takes full viewport height */
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-card {
  max-width: 900px; /* Limit card width for better readability */
  margin: auto; /* Center the card */
  padding: 30px; /* More padding */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important; /* Stronger shadow */
}

.v-card-title {
  font-family: 'Roboto', sans-serif;
  color: #1976D2; /* Primary blue */
  font-size: 3em !important; /* Larger title */
}

.v-card-subtitle {
  font-family: 'Roboto', sans-serif;
  color: #424242; /* Secondary dark grey */
}

.text-body-1 {
  line-height: 1.6;
}

.v-divider {
  border-color: rgba(0, 0, 0, 0.12) !important; /* Light divider */
}

/* Ensure consistent button styling */
.v-btn {
  letter-spacing: 0.05em;
  font-weight: 500;
  text-transform: uppercase;
}

/* Responsive adjustments for buttons */
@media (max-width: 600px) {
  .v-btn {
    width: 100%; /* Full width buttons on small screens */
  }
}
</style>
