<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getMovieById, type MovieDetail } from '../services/movieService'
import PersonLink from '../components/people/PersonLink.vue'
import CastCard from '../components/people/CastCard.vue'
import WatchProviderCard from '../components/media/WatchProviderCard.vue'
import PhysicalOffersSection from '@/components/offers/PhysicalOffersSection.vue'
import InteractiveStarRating from '@/components/ratings/InteractiveStarRating.vue'
import { getRatingSummary, upsertRating } from '@/services/ratingService'
import type { RatingSummary } from '@/types/rating'
import { useAuthStore } from '@/stores/authStore'
import { addFavorite, getFavoriteStatus, removeFavorite } from '@/services/favoriteService'
import type { FavoriteStatus } from '@/types/favorite'

const route = useRoute()
const { t, locale } = useI18n()

const movie = ref<MovieDetail | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const apiLocale = computed(() => {
  if (locale.value === 'en') {
    return {
      language: 'en-US',
      countryCode: 'US',
    }
  }

  return {
    language: 'fr-FR',
    countryCode: 'FR',
  }
})

async function loadMovie() {
  try {
    isLoading.value = true
    error.value = null

    const id = Number(route.params.id)
    movie.value = await getMovieById(id, apiLocale.value)
    await loadRating(movie.value.id)
    await loadFavoriteStatus(movie.value.id)
  } catch (err) {
    console.error(err)
    error.value = t('movie.loadError')
  } finally {
    isLoading.value = false
  }
}

const posterUrl = computed(() =>
  movie.value?.posterPath ? `https://image.tmdb.org/t/p/w500${movie.value.posterPath}` : null,
)

const releaseYear = computed(() =>
  movie.value?.releaseDate ? movie.value.releaseDate.split('-')[0] : t('common.unknown'),
)

const ratingOnFive = computed(() => {
  if (!movie.value) return 0
  return Math.floor((movie.value.voteAverage / 2) * 10) / 10
})

onMounted(loadMovie)

watch(locale, loadMovie)

const authStore = useAuthStore()

const ratingSummary = ref<RatingSummary | null>(null)
const ratingError = ref<string | null>(null)

async function loadRating(movieId: number) {
  try {
    ratingError.value = null

    ratingSummary.value = await getRatingSummary(
      'movie',
      movieId,
      authStore.isAuthenticated ? authStore.token : null
    )
  } catch (err) {
    console.error(err)
    ratingError.value = t('movie.ratingError')
  }
}

async function rateMovie(score: number) {
  if (!movie.value || !authStore.token) return

  try {
    ratingSummary.value = await upsertRating(
      {
        mediaId: movie.value.id,
        mediaType: 'movie',
        score,
      },
      authStore.token
    )
  } catch (err) {
    console.error(err)
    ratingError.value = t('movie.ratingError')
  }
}

const favoriteStatus = ref<FavoriteStatus | null>(null)
const favoriteMessage = ref<string | null>(null)

async function loadFavoriteStatus(movieId: number) {
  if (!authStore.token) return

  favoriteStatus.value = await getFavoriteStatus(
    'movie',
    movieId,
    authStore.token
  )
}

async function toggleFavorite() {
  if (!movie.value || !authStore.token) return

  if (favoriteStatus.value?.isFavorite) {
    favoriteStatus.value = await removeFavorite(
      'movie',
      movie.value.id,
      authStore.token
    )

    favoriteMessage.value = t('favorites.removed')
  } else {
    favoriteStatus.value = await addFavorite(
      {
        mediaId: movie.value.id,
        mediaType: 'movie',
        title: movie.value.title,
        posterPath: movie.value.posterPath,
      },
      authStore.token
    )

    favoriteMessage.value = t('favorites.added')
  }

  setTimeout(() => {
    favoriteMessage.value = null
  }, 3000)
}

</script>

<template>
  <main class="movie-detail-page">
    <p v-if="isLoading">{{ t('common.loading') }}</p>
    <p v-else-if="error">{{ error }}</p>

    <section v-else-if="movie" class="movie-detail">
      <div class="title-row">
        <h1 class="movie-title">{{ movie.title }}</h1>

        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="favorite-button"
          @click="toggleFavorite"
        >
          {{ favoriteStatus?.isFavorite ? '★' : '☆' }}
        </button>
      </div>

      <p v-if="favoriteMessage" class="favorite-toast">
        {{ favoriteMessage }}
      </p>

      <div class="movie-layout">
        <div class="poster-column">
          <div class="poster-wrapper">
            <img v-if="posterUrl" :src="posterUrl" :alt="movie.title" class="poster" />
          </div>
          <div class="community-rating">
            <h2>{{ t('movie.communityRating') }}</h2>

            <p v-if="ratingError" class="error">
              {{ ratingError }}
            </p>

            <template v-else-if="ratingSummary">
              <InteractiveStarRating
                :model-value="ratingSummary.averageScore"
                readonly
              />

              <p class="rating-meta">
                {{ ratingSummary.averageScore.toFixed(1) }}/5
                ·
                {{ t('movie.votes', ratingSummary.voteCount) }}
              </p>

              <InteractiveStarRating
                v-if="authStore.isAuthenticated"
                :model-value="ratingSummary.currentUserScore"
                @rate="rateMovie"
              />

              <p v-else class="rating-login">
                {{ t('movie.loginToRate') }}
              </p>
            </template>
          </div>
        </div>

        <div class="content-column">

          <p class="meta">
            {{ releaseYear }} • {{ movie.runtime }} min • {{ ratingOnFive }} / 5
          </p>

          <div class="genres">
          <RouterLink
            v-for="genre in movie.genres"
            :key="genre.id"
            :to="{
              name: 'search-results',
              query: {
                type: 'genre',
                genreId: genre.id,
                sourceMediaType: 'movie',
                label: genre.name
              }
            }"
            class="genre"
          >
            {{ genre.name }}
          </RouterLink>
          </div>

          <div v-if="movie.directors.length" class="info-block">
            <h2>{{ t('movie.directedBy') }}</h2>

            <div class="people-links">
              <PersonLink
                v-for="director in movie.directors"
                :key="director.id"
                :id="director.id"
                :name="director.name"
                role="director"
              />
            </div>
          </div>

          <div v-if="movie.watchProviders.length" class="info-block">
            <h2>{{ t('movie.availableOn') }}</h2>

            <div class="providers-grid">
              <WatchProviderCard
                v-for="provider in movie.watchProviders"
                :key="`${provider.type}-${provider.id}`"
                :id="provider.id"
                :name="provider.name"
                :logo-path="provider.logoPath"
                :type="provider.type"
              />
            </div>
          </div>

          <PhysicalOffersSection
            v-if="movie"
            :title="movie.title"
            media-type="movie"
            :locale="apiLocale"
          />

          <div class="info-block">
            <h2>{{ t('movie.overview') }}</h2>
            <p class="overview">{{ movie.overview }}</p>
          </div>
        </div>

        <aside class="cast-column">
          <div v-if="movie.cast.length" class="info-block">
            <h2>{{ t('movie.mainCast') }}</h2>

            <div class="cast-row">
              <CastCard
                v-for="actor in movie.cast"
                :key="actor.id"
                :id="actor.id"
                :name="actor.name"
                :character="actor.character"
                :profile-path="actor.profilePath"
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  </main>
</template>

<style scoped>

@media (max-width: 1200px) {
  .movie-layout {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .cast-column {
    grid-column: 1 / -1;
  }

  .cast-row {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}

@media (max-width: 768px) {
  .movie-layout {
    grid-template-columns: 1fr;
  }

  .movie-title {
    font-size: 2rem;
  }

  .poster-wrapper {
    width: 100%;
    max-width: 240px;
    margin: 0 auto;
  }
}

.movie-detail {
  max-width: 1500px;
  margin: 0 auto;
}

.movie-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 420px;
  gap: 2.5rem;
  align-items: start;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.25rem 0;
}

.genre {
  display: inline-flex;
  align-items: center;

  padding: 0.45rem 0.9rem;
  border-radius: 9999px;

  background: #1f2937;
  color: #bfdbfe;

  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.genre:hover {
  background: #2563eb;
  color: #ffffff;
  transform: translateY(-2px);
}

.poster-wrapper {
  width: 260px;
  aspect-ratio: 2 / 3;
  border-radius: 16px;
  overflow: hidden;
  background: #1f2937;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.content-column {
  min-width: 0;
}

.cast-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.community-rating {
  margin-top: 1.25rem;
  padding: 1rem;
  border-radius: 1rem;
  background: #132a57;
  text-align: center;
}

.community-rating h2 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.rating-meta,
.rating-login {
  margin-top: 0.5rem;
  color: #d6e3ff;
  font-size: 0.9rem;
}

.title-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.movie-title {
  margin: 0;
  text-align: center;
  font-size: 3rem;
}

.favorite-button {
  padding: 0;
  border: none;
  background: transparent;

  color: #facc15;
  font-size: 2rem;
  line-height: 1;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.favorite-button:hover {
  color: #fde047;
  transform: scale(1.1);
}

.favorite-toast {
  position: fixed;
  top: 90px;
  right: 2rem;
  z-index: 2000;

  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: #132a57;
  color: white;
  border: 1px solid #3b82f6;
}

</style>
