<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="7">
        <v-card class="elevation-12 rounded-lg pa-6 cribbage-scores-card">
          <v-card-title class="text-h4 text-center mb-6 font-weight-bold text-primary">
            Cribbage Scoring Values
          </v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-6 text-center">This component lists common ways to score points in the game of Cribbage.</p>

            <h3 class="text-h5 text-secondary mb-4 mt-6">Combinations</h3>
            <v-list density="compact" class="transparent-list">
              <v-list-item
                v-for="combo in combinations"
                :key="combo.name"
                class="mb-2 rounded-lg elevation-1 score-list-item"
              >
                <div class="d-flex flex-wrap align-center justify-space-between py-2">
                  <div class="score-item-name text-body-1 font-weight-medium text-grey-darken-3">
                    <strong>{{ combo.name }}:</strong>
                  </div>
                  <div class="score-item-value text-h6 font-weight-bold text-error">
                    {{ combo.points }} points
                  </div>
                  <div v-if="combo.description" class="score-item-description text-body-2 text-grey-darken-1 flex-grow-1 ml-4">
                    - {{ combo.description }}
                  </div>
                </div>
              </v-list-item>
            </v-list>

            <h3 class="text-h5 text-secondary mb-4 mt-8">Specific Card Values</h3>
            <v-list density="compact" class="transparent-list">
              <v-list-item
                v-for="card in specificCards"
                :key="card.name"
                class="mb-2 rounded-lg elevation-1 score-list-item"
              >
                <div class="d-flex flex-wrap align-center justify-space-between py-2">
                  <div class="score-item-name text-body-1 font-weight-medium text-grey-darken-3">
                    <strong>{{ card.name }}:</strong>
                  </div>
                  <div class="score-item-value text-h6 font-weight-bold text-error">
                    {{ card.points }} points
                  </div>
                  <div v-if="card.description" class="score-item-description text-body-2 text-grey-darken-1 flex-grow-1 ml-4">
                    - {{ card.description }}
                  </div>
                </div>
              </v-list-item>
            </v-list>

            <h3 class="text-h5 text-secondary mb-4 mt-8">Pegging (The Play)</h3>
            <v-list density="compact" class="transparent-list">
              <v-list-item
                v-for="peg in peggingScores"
                :key="peg.name"
                class="mb-2 rounded-lg elevation-1 score-list-item"
              >
                <div class="d-flex flex-wrap align-center justify-space-between py-2">
                  <div class="score-item-name text-body-1 font-weight-medium text-grey-darken-3">
                    <strong>{{ peg.name }}:</strong>
                  </div>
                  <div class="score-item-value text-h6 font-weight-bold text-error">
                    {{ peg.points }} points
                  </div>
                  <div v-if="peg.description" class="score-item-description text-body-2 text-grey-darken-1 flex-grow-1 ml-4">
                    - {{ peg.description }}
                  </div>
                </div>
              </v-list-item>
            </v-list>

            <h3 class="text-h5 text-secondary mb-4 mt-8">Other Scores</h3>
            <v-list density="compact" class="transparent-list">
              <v-list-item
                v-for="other in otherScores"
                :key="other.name"
                class="mb-2 rounded-lg elevation-1 score-list-item"
              >
                <div class="d-flex flex-wrap align-center justify-space-between py-2">
                  <div class="score-item-name text-body-1 font-weight-medium text-grey-darken-3">
                    <strong>{{ other.name }}:</strong>
                  </div>
                  <div class="score-item-value text-h6 font-weight-bold text-error">
                    {{ other.points }} points
                  </div>
                  <div v-if="other.description" class="score-item-description text-body-2 text-grey-darken-1 flex-grow-1 ml-4">
                    - {{ other.description }}
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const combinations = [
  { name: 'Fifteen (e.g., 8+7, 10+5, A+K+4)', points: 2, description: 'Any combination of cards that sum to 15' },
  { name: 'Pair', points: 2, description: 'Two cards of the same rank (e.g., two Queens)' },
  { name: 'Pair Royal (Three of a Kind)', points: 6, description: 'Three cards of the same rank (e.g., three Kings)' },
  { name: 'Double Pair Royal (Four of a Kind)', points: 12, description: 'Four cards of the same rank (e.g., four Aces)' },
  { name: 'Run of 3', points: 3, description: 'Three consecutive cards (e.g., 2, 3, 4)' },
  { name: 'Run of 4', points: 4, description: 'Four consecutive cards (e.g., 7, 8, 9, 10)' },
  { name: 'Run of 5', points: 5, description: 'Five consecutive cards (e.g., A, 2, 3, 4, 5)' },
  { name: 'Double Run (Run of 3 with a Pair)', points: 8, description: 'e.g., 2, 2, 3, 4 - one pair plus two runs of 3' },
  { name: 'Triple Run (Run of 3 with Three of a Kind)', points: 15, description: 'e.g., 2, 2, 2, 3, 4 - three of a kind plus three runs of 3' },
  { name: 'Quadruple Run (Run of 4 with a Pair)', points: 16, description: 'e.g., 2, 3, 3, 4, 5 - one pair plus two runs of 4' },
];

const specificCards = [
  { name: 'Flush (4 cards in hand)', points: 4, description: 'All four cards in your hand are the same suit' },
  { name: 'Flush (5 cards in hand & cut)', points: 5, description: 'All four cards in your hand PLUS the cut card are the same suit' },
  { name: 'His Nobs', points: 1, description: 'Holding a Jack in your hand that is the same suit as the cut card' },
];

const peggingScores = [
  { name: 'Last Card (Go)', points: 1, description: 'Playing the last card in a sequence (total <= 31)' },
  { name: 'Fifteen (in play)', points: 2, description: 'Playing a card that makes the total exactly 15' },
  { name: 'Thirty-One (in play)', points: 2, description: 'Playing a card that makes the total exactly 31' },
  { name: 'Pair (in play)', points: 2, description: 'Playing a card that matches the rank of the previous card' },
  { name: 'Run (in play)', points: 3, description: 'Playing cards that form a sequence of 3 or more' },
];

const otherScores = [
  { name: 'Muggins', points: 'Varies', description: 'Player failed to count all their points and opponent counts them instead.' },
  { name: 'Game', points: 'Last point to 121', description: 'The player who reaches 121 points first wins the game.'}
];
</script>

<style scoped>
/* Base container and card styling to match other Vuetify pages */
.v-container {
  background-color: #e0e0e0; /* Light grey background from login/register pages */
}

.cribbage-scores-card {
  /* Inherits elevation-12 and rounded-lg from Vuetify classes */
  /* padding is already pa-6 */
}

.v-card-title {
  font-family: 'Roboto', sans-serif; /* Vuetify's default font */
  color: #1976D2; /* Primary blue from Material Design */
}

/* Custom styles for the score lists within the card */
.text-h5 {
  font-family: 'Roboto', sans-serif;
  color: #4a5a7b; /* Secondary color from previous styling */
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
}

.transparent-list {
  background-color: transparent !important; /* Ensure list background doesn't interfere */
}

.score-list-item {
  background-color: #ffffff; /* Pure white for list items */
  /* Inherits rounded-lg and elevation-1 from Vuetify classes */
  transition: box-shadow 0.2s ease-in-out;
}

.score-list-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important; /* Override default hover shadow if needed */
}

.score-item-name {
  min-width: 180px; /* Ensure it doesn't collapse too much */
  /* text-body-1 and font-weight-medium are Vuetify classes */
}

.score-item-name strong {
  color: #0056b3; /* Darker blue for the emphasized name (can be adjusted to Vuetify palette) */
  font-weight: 600; /* Make the name itself bold */
}

.score-item-value {
  /* text-h6 and font-weight-bold are Vuetify classes */
  color: #d9534f; /* A distinct, easily readable color like a deep red */
  margin-right: 15px;
  min-width: 100px; /* Ensure the score value has enough space */
  text-align: right;
}

.score-item-description {
  /* text-body-2 and text-grey-darken-1 are Vuetify classes */
  line-height: 1.4;
  /* flex-grow-1 and ml-4 are Vuetify flex/spacing classes */
}

/* Adjustments for smaller screens (using Vuetify's d-flex and flex-wrap handles most of this) */
@media (max-width: 600px) {
  .score-list-item .d-flex {
    flex-direction: column;
    align-items: flex-start;
  }
  .score-item-name,
  .score-item-value,
  .score-item-description {
    min-width: unset;
    width: 100%;
    text-align: left;
    margin-right: 0;
    padding-left: 0;
  }
  .score-item-value {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}

</style>
