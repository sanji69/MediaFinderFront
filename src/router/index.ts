import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/movies/:id',
      name: 'movie-detail',
      component: () => import('../views/MovieDetailView.vue'),
    },
    {
      path: '/series/:id',
      name: 'series-detail',
      component: () => import('../views/SeriesDetailView.vue'),
    },
    {
      path: '/search',
      name: 'search-results',
      component: () => import('@/views/SearchResultsView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/confirm-email',
      name: 'confirm-email',
      component: () => import('@/views/ConfirmEmailView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
    },
    {
      path: '/profile/comments',
      name: 'my-comments',
      component: () => import('@/views/MyCommentsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: {
        requiresAuth: true,
        requiresAdminPanel: true,
      },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPasswordView.vue'),
    }
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdminPanel) {
    const role = authStore.user?.role

    if (role !== 2 && role !== 3) {
      return { name: 'Home' }
    }
  }
})

export default router
