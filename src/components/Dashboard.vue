<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="9" lg="8">
        <v-card class="elevation-12 rounded-lg pa-6 dashboard-card">
          <v-card-title class="text-h4 text-center mb-6 font-weight-bold text-primary">
            {{ dashboardData.username ? `${dashboardData.username}'s Cribbage Dashboard` : 'Loading Dashboard...' }}
          </v-card-title>

          <v-card-text>
            <v-row class="mb-6">
              <v-col cols="12" md="4">
                <v-card class="pa-4 text-center rounded-lg elevation-2">
                  <v-icon size="48" color="info">mdi-trophy</v-icon>
                  <div class="text-h5 font-weight-bold mt-2 text-info">{{ dashboardData.total_wins }}</div>
                  <div class="text-subtitle-1 text-grey-darken-1">Total Wins</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="pa-4 text-center rounded-lg elevation-2">
                  <v-icon size="48" color="error">mdi-close-circle</v-icon>
                  <div class="text-h5 font-weight-bold mt-2 text-error">{{ dashboardData.total_losses }}</div>
                  <div class="text-subtitle-1 text-grey-darken-1">Total Losses</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="pa-4 text-center rounded-lg elevation-2">
                  <v-icon size="48" color="success">mdi-fire</v-icon>
                  <div class="text-h5 font-weight-bold mt-2 text-success">{{ dashboardData.consecutive_wins }}</div>
                  <div class="text-subtitle-1 text-grey-darken-1">Consecutive Wins</div>
                </v-card>
              </v-col>
            </v-row>

            <h3 class="text-h5 text-secondary mb-4 mt-8">Recent Games</h3>
            <v-data-table
              :headers="headers"
              :items="dashboardData.recent_games"
              :loading="isLoading"
              class="elevation-1 rounded-lg"
              no-data-text="No recent games found."
              :items-per-page="5"
              v-if="!isLoading || dashboardData.recent_games.length > 0"
            >
              <template v-slot:item.opponent="{ item }">
                {{ item.opponent_username }}
              </template>
              <template v-slot:item.result="{ item }">
                <v-chip
                  :color="getGameResultColor(item)"
                  label
                  size="small"
                  class="font-weight-bold"
                >
                  {{ getGameResult(item) }}
                </v-chip>
              </template>
              <template v-slot:item.scores="{ item }">
                {{ item.user_score }} - {{ item.opponent_score }}
              </template>
              <template v-slot:item.skunk="{ item }">
                <v-icon v-if="item.is_double_skunk" color="error" title="Double Skunk">mdi-skull</v-icon>
                <v-icon v-else-if="item.is_skunk" color="warning" title="Skunk">mdi-emoticon-devil</v-icon>
                <span v-else>-</span>
              </template>
              <template v-slot:item.date="{ item }">
                {{ formatDate(item.game_date) }}
              </template>
            </v-data-table>
            <div v-else-if="!isLoading && dashboardData.recent_games.length === 0" class="text-center py-4 text-subtitle-1 text-grey-darken-1">
              No recent games found.
            </div>


            <v-alert
              v-if="errorMessage"
              type="error"
              class="mt-6 rounded-lg"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import type { Ref } from 'vue';
// Explicitly import VDataTable, even if globally registered, for debugging
import { VDataTable } from 'vuetify/components';

const instance = getCurrentInstance();
const axios = instance?.appContext.config.globalProperties.$axios;

interface Game {
  id: number;
  user_id: number;
  user_username: string;
  user_score: number;
  opponent_user_id: number | null;
  opponent_username: string;
  opponent_score: number;
  is_skunk: boolean;
  is_double_skunk: boolean;
  game_date: string; // ISO string
  notes: string | null;
  viewer_won: boolean; // Added this to match backend to_dict output
}

interface DashboardData {
  username: string | null;
  total_games: number;
  total_wins: number;
  total_losses: number;
  consecutive_wins: number;
  recent_games: Game[];
}

const dashboardData: Ref<DashboardData> = ref({
  username: null,
  total_games: 0,
  total_wins: 0,
  total_losses: 0,
  consecutive_wins: 0,
  recent_games: [],
});

const isLoading = ref(true);
const errorMessage = ref('');

// Headers for the VDataTable
const headers = [
  { title: 'Opponent', key: 'opponent', sortable: false },
  { title: 'Result', key: 'result', sortable: false },
  { title: 'Scores', key: 'scores', sortable: false },
  { title: 'Skunk', key: 'skunk', sortable: false },
  { title: 'Date', key: 'date', sortable: false },
];

// Helper to determine game result for display
const getGameResult = (game: Game): string => {
  if (game.viewer_won) {
    return 'Win';
  } else if (game.user_score === 121 || game.opponent_score === 121) {
    return 'Loss';
  }
  return 'N/A'; // Should not happen for completed games
};

const getGameResultColor = (game: Game): string => {
  if (game.viewer_won) {
    return 'success';
  } else if (game.user_score === 121 || game.opponent_score === 121) {
    return 'error';
  }
  return 'grey';
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  if (!axios) {
    console.error('Axios is not available.');
    errorMessage.value = 'Error: API client not configured.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.get('/api/dashboard-stats');
    console.log("Fetched dashboard data:", response.data); // Log the response data
    dashboardData.value = response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    errorMessage.value = error.response?.data?.error || 'Failed to load dashboard data. Please ensure you are logged in.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.v-container {
  background-color: #e0e0e0; /* Light grey background from login/register pages */
}

.dashboard-card {
  /* Inherits elevation-12 and rounded-lg from Vuetify classes */
}

.v-card-title {
  font-family: 'Roboto', sans-serif;
  color: #1976D2; /* Primary blue from Material Design */
}

.text-h5 {
  font-family: 'Roboto', sans-serif;
  color: #4a5a7b; /* Secondary color from previous styling */
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
}

/* Custom styling for info cards */
.v-card.elevation-2 {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.v-card.elevation-2:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15) !important;
}

/* Style for the data table */
.v-data-table {
  background-color: #ffffff;
}

/* Ensure text colors are consistent with Vuetify theme */
.text-primary { color: var(--v-theme-primary); }
.text-secondary { color: var(--v-theme-secondary); }
.text-info { color: var(--v-theme-info); }
.text-error { color: var(--v-theme-error); }
.text-success { color: var(--v-theme-success); }
.text-grey-darken-1 { color: rgba(0, 0, 0, 0.6); } /* Vuetify's default grey-darken-1 */

</style>

