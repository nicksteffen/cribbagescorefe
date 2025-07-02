import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ScoreReferenceView from '@/views/ScoreReferenceView.vue'
import LogScoreView from '@/views/LogScoreView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false } // No auth required for login
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false } // No auth required for login
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      component: LoginView,
      meta: { requiresAuth: false } // No auth required for login
    },
    {
      path: '/register', // <--- NEW ROUTE DEFINITION
      name: 'register',
      component: RegisterView, // <--- NEW COMPONENT
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true } // No auth required for login
      // route level code-splitting
    },
    {
      path: '/score-reference',
      name: 'score-reference',
      component: ScoreReferenceView,
      meta: { requiresAuth: false } // No auth required for login

    },
    {
      path: '/log-cribbage',
      name:'log-cribbage',
      component: LogScoreView,
      meta: { requiresAuth: true } // No auth required for login
    }
  ],
})

// Global Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Ensure auth state is checked on initial load/refresh
  if (!authStore.isAuthenticated && authStore.accessToken) {
    await authStore.checkAuthStatus(); // Try to validate token if present
  }

  // If the route requires authentication AND the user is not logged in
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Redirect to login page, preserving the original intended path as a query param
    next({ name: 'login', query: { redirect: to.fullPath } });
  // } else if (to.name === 'login' && authStore.isLoggedIn) {
    // If user is logged in and tries to go to login page, redirect to dashboard
    // next({ name: 'dashboard' });
  } else {
    // Continue to the route
    next();
  }
});

export default router;