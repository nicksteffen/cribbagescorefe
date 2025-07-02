import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from './utils/axios.ts'

import App from './App.vue'
import router from './router'

// --- START VUETIFY IMPORTS & CONFIGURATION ---
import 'vuetify/styles' // 1. Import Vuetify's core styles
import { createVuetify } from 'vuetify' // 2. Import the createVuetify function
import * as components from 'vuetify/components' // 3. Import all Vuetify components
import * as directives from 'vuetify/directives' // 4. Import all Vuetify directives
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
  components, // Register all imported components
  directives, // Register all imported directives
  icons: {
    defaultSet: 'mdi', // Set MDI as the default icon font
  },
  // You can add more Vuetify configurations here, e.g., themes:
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
      dark: {
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

// Make Axios globally available via `this.$axios` in your components
app.config.globalProperties.$axios = axios;

app.mount('#app')
