import { defineStore } from 'pinia';
import axios from '@/utils/axios'; // Your configured axios instance
import router from '@/router'; // Import your router instance

interface AuthState {
  accessToken: string | null;
  user: { id: number; username: string } | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: localStorage.getItem('access_token'), // Load token from localStorage on init
    user: null, // User details (optional, but good to have)
    isAuthenticated: !!localStorage.getItem('access_token'), // Initial check
  }),
  getters: {
    // Simple getter to check if authenticated
    isLoggedIn: (state) => state.isAuthenticated,
    // Getter to get the access token
    getAccessToken: (state) => state.accessToken,
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await axios.post('/api/login', { username, password });
        const { access_token } = response.data;

        this.accessToken = access_token;
        this.isAuthenticated = true;
        localStorage.setItem('access_token', access_token); // Store token

        // Optionally fetch user details here if needed
        // const userResponse = await axios.get('/api/me'); // Example endpoint
        // this.user = userResponse.data;

        return true; // Login successful
      } catch (error) {
        console.error('Login failed:', error);
        this.logout(); // Ensure state is clean on failed login
        throw error; // Re-throw to allow component to handle error message
      }
    },
    logout() {
      this.accessToken = null;
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem('access_token'); // Clear token
      router.push('/login'); // Redirect to login page
    },
    // Action to check authentication status (e.g., on app load or refresh)
    // This could involve a backend call to validate the token
    async checkAuthStatus() {
      if (this.accessToken) {
        // Optionally, make a backend call to validate the token
        // For example: await axios.get('/api/protected-route');
        // If the call succeeds, the token is valid. If it fails (401), the interceptor will handle it.
        this.isAuthenticated = true; // Assume valid if token exists, let interceptor handle invalid
      } else {
        this.isAuthenticated = false;
      }
    }
  },
});