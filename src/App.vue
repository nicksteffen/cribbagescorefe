<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
// import Message from './components/Message.vue';

      





</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Cribbage Tracker</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/login">Login</v-btn>
      <v-btn text to="/dashboard">Dashboard</v-btn>
      <v-btn text to="/score-reference">Score Reference</v-btn>
      <v-btn text to="/log-cribbage">Log Score</v-btn>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
/* No specific styles needed for the new Vuetify layout in App.vue */
/* Component-specific styles should be in their respective files */
</style>
