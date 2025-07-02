<template>
  <v-container class="cribbage-score-logger">
    <v-card class="pa-6 rounded-lg elevation-6">
      <v-card-title class="text-h4 text-center mb-6 font-weight-bold text-primary">
        Log New Cribbage Game
      </v-card-title>

      <v-form @submit.prevent="handleSubmit">
        <!-- Current User's Score -->
        <v-text-field
          v-model.number="gameData.user_score"
          label="Your Score (e.g., 121)"
          type="number"
          :rules="[rules.required, rules.scoreRange]"
          variant="outlined"
          class="mb-4"
          required
        ></v-text-field>

        <!-- Opponent Type Toggle -->
        <v-switch
          v-model="isGuestOpponent"
          color="secondary"
          label="Opponent is a Guest?"
          class="mb-4"
          hide-details
        ></v-switch>

        <!-- Conditional Opponent Input -->
        <v-slide-y-transition hide-on-leave>
          <div v-if="isGuestOpponent">
            <v-text-field
              v-model="gameData.guest_opponent_name"
              label="Guest Opponent Name"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
              required
            ></v-text-field>
          </div>
          <div v-else>
            <v-select
              v-model="selectedOpponentUser"
              :items="availableUsers"
              item-title="username"
              item-value="id"
              label="Select Registered Opponent"
              :rules="[rules.requiredSelect]"
              variant="outlined"
              class="mb-4"
              :loading="isLoadingUsers"
              :disabled="isLoadingUsers"
              no-data-text="No other users found."
              return-object
              clearable
            ></v-select>
          </div>
        </v-slide-y-transition>

        <!-- Opponent's Score -->
        <v-text-field
          v-model.number="gameData.opponent_score"
          label="Opponent's Score (e.g., 110)"
          type="number"
          :rules="[rules.required, rules.scoreRange]"
          variant="outlined"
          class="mb-4"
          required
        ></v-text-field>

        <!-- Skunk and Double Skunk Checkboxes -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6">
            <v-checkbox
              v-model="gameData.is_skunk"
              label="Was it a Skunk?"
              color="info"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="6">
            <v-checkbox
              v-model="gameData.is_double_skunk"
              label="Was it a Double Skunk?"
              color="error"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <!-- Notes Field -->
        <v-textarea
          v-model="gameData.notes"
          label="Notes (e.g., 'Close game!', 'Played with new deck')"
          variant="outlined"
          rows="3"
          class="mb-6"
        ></v-textarea>

        <!-- Submit Button -->
        <v-btn
          type="submit"
          color="success"
          size="large"
          block
          :loading="isSubmitting"
          :disabled="isSubmitting"
          class="rounded-lg"
        >
          Log Game
          <v-icon end icon="mdi-send"></v-icon>
        </v-btn>
      </v-form>

      <!-- Submission Feedback -->
      <v-alert
        v-if="message"
        :type="messageType"
        class="mt-6 rounded-lg"
        closable
        @click:close="message = ''"
      >
        {{ message }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, getCurrentInstance } from 'vue';
import type { Ref } from 'vue';
import axios from '../utils/axios'


// Access the globalProperties (like $axios) in script setup
// const instance = getCurrentInstance();
// const axios = instance?.appContext.config.globalProperties.$axios;

// Reactive state for the form data
interface GameData {
  // REMOVED: user_id is no longer part of the frontend payload
  user_score: number | null;
  opponent_score: number | null;
  opponent_user_id: number | null;
  guest_opponent_name: string | null;
  is_skunk: boolean;
  is_double_skunk: boolean;
  notes: string | null;
}

const gameData: Ref<GameData> = ref({
  // REMOVED: user_id is no longer set here
  user_score: null,
  opponent_score: null,
  opponent_user_id: null,
  guest_opponent_name: null,
  is_skunk: false,
  is_double_skunk: false,
  notes: null,
});

// Reactive state for UI elements
const isGuestOpponent = ref(true); // Default to guest opponent
const availableUsers: Ref<Array<{ id: number; username: string }>> = ref([]);
const selectedOpponentUser: Ref<{ id: number; username: string } | null> = ref(null);
const isLoadingUsers = ref(false);
const isSubmitting = ref(false);
const message = ref('');
const messageType: Ref<'success' | 'error' | 'info' | 'warning'> = ref('info');

// Validation rules for Vuetify text fields
const rules = {
  required: (value: any) => !!value || 'Required.',
  requiredSelect: (value: any) => !!value || 'Please select an opponent.',
  scoreRange: (value: number | null) => {
    if (value === null) return 'Score is required.';
    if (value >= 0 && value <= 121) return true;
    return 'Score must be between 0 and 121.';
  },
};

// Watcher to handle opponent type toggle
watch(isGuestOpponent, (newVal) => {
  if (newVal) {
    // Switched to Guest Opponent
    selectedOpponentUser.value = null; // Clear selected user
    gameData.value.opponent_user_id = null;
  } else {
    // Switched to Registered Opponent
    gameData.value.guest_opponent_name = null; // Clear guest name
    // Fetch users if not already loaded
    if (availableUsers.value.length === 0) {
      fetchUsers();
    }
  }
});

// Watcher for selected registered opponent
watch(selectedOpponentUser, (newVal) => {
  if (newVal) {
    gameData.value.opponent_user_id = newVal.id;
    // As per requirement: if not guest, use selected opponent username as guest_opponent_name placeholder
    gameData.value.guest_opponent_name = newVal.username;
  } else {
    gameData.value.opponent_user_id = null;
    gameData.value.guest_opponent_name = null;
  }
});

// Watcher for skunk/double skunk logic
watch(() => gameData.value.is_double_skunk, (newVal) => {
  if (newVal) {
    gameData.value.is_skunk = true; // Double skunk implies skunk
  }
});

// Fetch users from the backend
const fetchUsers = async () => {
  if (!axios) {
    console.error('Axios is not available.');
    message.value = 'Error: API client not configured.';
    messageType.value = 'error';
    return;
  }

  isLoadingUsers.value = true;
  message.value = ''; // Clear previous messages
  try {
    // This endpoint now returns users EXCLUDING the current authenticated user
    // It also returns a direct array of user objects, not nested under "users"
    const response = await axios.get('/api/users');
    availableUsers.value = response.data; // Assign directly
  } catch (error) {
    console.error('Error fetching users:', error);
    message.value = 'Failed to load users. Please ensure you are logged in.';
    messageType.value = 'error';
  } finally {
    isLoadingUsers.value = false;
  }
};

// Handle form submission
const handleSubmit = async () => {
  if (!axios) {
    console.error('Axios is not available.');
    message.value = 'Error: API client not configured.';
    messageType.value = 'error';
    return;
  }

  // Basic client-side validation before sending
  if (gameData.value.user_score === null || gameData.value.opponent_score === null) {
      message.value = 'Please enter scores for both players.';
      messageType.value = 'error';
      return;
  }
  if (!isGuestOpponent.value && selectedOpponentUser.value === null) {
      message.value = 'Please select a registered opponent or toggle to Guest Opponent.';
      messageType.value = 'error';
      return;
  }
  if (isGuestOpponent.value && !gameData.value.guest_opponent_name) {
      message.value = 'Please enter a name for the guest opponent.';
      messageType.value = 'error';
      return;
  }
  if (gameData.value.user_score < 0 || gameData.value.user_score > 121 ||
      gameData.value.opponent_score < 0 || gameData.value.opponent_score > 121) {
      message.value = 'Scores must be between 0 and 121.';
      messageType.value = 'error';
      return;
  }

  isSubmitting.value = true;
  message.value = ''; // Clear previous messages

  try {
    const payload = { ...gameData.value }; // Create a copy of gameData

    // Ensure correct data based on opponent type
    if (isGuestOpponent.value) {
      payload.opponent_user_id = null; // Clear registered user ID if guest
    } else {
      payload.guest_opponent_name = null; // Clear guest name if registered user
      payload.opponent_user_id = selectedOpponentUser.value?.id || null;
    }

    // user_id is NOT sent from frontend; backend will get it from JWT
    // delete payload.user_id; // No longer needed as user_id is not in gameData.value

    console.log("Submitting payload:", payload);

    const response = await axios.post('/api/score', payload);

    message.value = 'Game logged successfully!';
    messageType.value = 'success';
    console.log('Game logged:', response.data);

    // Optionally reset form after successful submission
    resetForm();

  } catch (error) {
    console.error('Error logging game:', error);
    // Handle specific error messages from backend if needed
    message.value = 'Failed to log game. Please ensure you are logged in and all fields are correct.';
    messageType.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};

// Function to reset the form
const resetForm = () => {
  gameData.value = {
    // REMOVED: user_id is no longer set here
    user_score: null,
    opponent_score: null,
    opponent_user_id: null,
    guest_opponent_name: null,
    is_skunk: false,
    is_double_skunk: false,
    notes: null,
  };
  isGuestOpponent.value = true; // Reset to default guest opponent
  selectedOpponentUser.value = null;
};

// On component mount, if not a guest opponent, fetch users
onMounted(() => {
  if (!isGuestOpponent.value) {
    fetchUsers();
  }
});
</script>

<style scoped>
.cribbage-score-logger {
  max-width: 600px;
  margin: 40px auto;
}

.v-card-title {
  font-family: 'Roboto', sans-serif; /* Vuetify's default font */
  color: #1976D2; /* Primary blue from Material Design */
}

/* Custom styles for better spacing/appearance */
.v-text-field,
.v-select,
.v-textarea,
.v-switch,
.v-checkbox {
  margin-bottom: 16px; /* Consistent spacing */
}

.v-btn {
  letter-spacing: 0.05em;
}
</style>
