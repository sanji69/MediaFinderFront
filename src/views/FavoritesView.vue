<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { getFavorites } from '@/services/favoriteService'
import type { Favorite } from '@/types/favorite'

const { t } = useI18n()
const authStore = useAuthStore()

const favorites = ref<Favorite[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

function posterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w342${path}` : undefined
}

function detailRoute(favorite: Favorite) {
  return favorite.mediaType === 'movie'
    ? { name: 'movie-detail', params: { id: favorite.mediaId } }
    : { name: 'series-detail', params: { id: favorite.mediaId } }
}

onMounted(async () => {
  if (!authStore.token) {
    isLoading.value = false
    return
  }

  try {
    favorites.value = await getFavorites(authStore.token)
  } catch (err) {
    console.error(err)
    error.value = t('favorites.loadError')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="favorites-page">
    <h1>{{ t('favorites.title') }}</h1>

    <p v-if="isLoading">{{ t('favorites.loading') }}</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <p v-else-if="favorites.length === 0">{{ t('favorites.empty') }}</p>

    <div v-else class="favorites-grid">
      <RouterLink
        v-for="favorite in favorites"
        :key="favorite.id"
        :to="detailRoute(favorite)"
        class="favorite-card"
      >
        <div class="poster-wrapper">
          <img
            v-if="posterUrl(favorite.posterPath)"
            :src="posterUrl(favorite.posterPath)"
            :alt="favorite.title"
          />
          <div v-else class="poster-placeholder">
            {{ favorite.title }}
          </div>
        </div>

        <h2>{{ favorite.title }}</h2>
        <span class="media-type">
          {{ favorite.mediaType === 'movie' ? 'Movie' : 'TV' }}
        </span>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.favorites-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.favorites-page h1 {
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}

.favorite-card {
  padding: 1rem;
  border-radius: 1rem;
  background: #0a1b44;
  color: white;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-4px);
  background: #132a57;
}

.poster-wrapper {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #132a57;
}

.poster-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  color: #d6e3ff;
}

.favorite-card h2 {
  margin: 0.75rem 0 0.35rem;
  font-size: 1rem;
}

.media-type {
  color: #8ab4ff;
  font-size: 0.85rem;
}

.error {
  color: #ff8a8a;
}
</style>