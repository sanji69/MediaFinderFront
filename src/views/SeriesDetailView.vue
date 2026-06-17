<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getSeriesById, type SeriesDetail } from '../services/seriesService'
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
import CommentSection from '@/components/comments/CommentSection.vue'

const route = useRoute()
const { t, locale } = useI18n()

const series = ref<SeriesDetail | null>(null)
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

async function loadSeries() {
  try {
    isLoading.value = true
    error.value = null
    
    const id = Number(route.params.id)
    series.value = await getSeriesById(id, apiLocale.value)
    await loadRating(series.value.id)
    await loadFavoriteStatus(series.value.id)
  } catch (err) {
    console.error(err)
    error.value = t('series.loadError')
  } finally {
    isLoading.value = false
  }
}

const posterUrl = computed(() =>
  series.value?.posterPath ? `https://image.tmdb.org/t/p/w500${series.value.posterPath}` : null,
)

const releaseYear = computed(() =>
  series.value?.firstAirDate ? series.value.firstAirDate.split('-')[0] : t('common.unknown'),
)

const ratingOnFive = computed(() => {
  if (!series.value) return 0
  return Math.floor((series.value.voteAverage / 2) * 10) / 10
})

onMounted(loadSeries)

watch(locale, loadSeries)

const authStore = useAuthStore()

const ratingSummary = ref<RatingSummary | null>(null)
const ratingError = ref<string | null>(null)

async function loadRating(seriesId: number) {
  try {
    ratingError.value = null

    ratingSummary.value = await getRatingSummary(
      'tv',
      seriesId,
      authStore.isAuthenticated ? authStore.token : null
    )
  } catch (err) {
    console.error(err)
    ratingError.value = t('series.ratingError')
  }
}

async function rateSeries(score: number) {
  if (!series.value || !authStore.token) return

  try {
    ratingSummary.value = await upsertRating(
      {
        mediaId: series.value.id,
        mediaType: 'tv',
        score,
      },
      authStore.token
    )
  } catch (err) {
    console.error(err)
    ratingError.value = t('series.ratingError')
  }
}

const favoriteStatus = ref<FavoriteStatus | null>(null)
const favoriteMessage = ref<string | null>(null)

async function loadFavoriteStatus(serieId: number) {
  if (!authStore.token) return

  favoriteStatus.value = await getFavoriteStatus(
    'tv',
    serieId,
    authStore.token
  )
}

async function toggleFavorite() {
  if (!series.value || !authStore.token) return

  if (favoriteStatus.value?.isFavorite) {
    favoriteStatus.value = await removeFavorite(
      'tv',
      series.value.id,
      authStore.token
    )

    favoriteMessage.value = t('favorites.removed')
  } else {
    favoriteStatus.value = await addFavorite(
      {
        mediaId: series.value.id,
        mediaType: 'tv',
        title: series.value.name,
        posterPath: series.value.posterPath,
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

    <section v-else-if="series" class="movie-detail">
      <div class="title-row">
        <h1 class="movie-title">{{ series.name }}</h1>

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
            <img v-if="posterUrl" :src="posterUrl" :alt="series.name" class="poster" />
          </div>
          <div class="community-rating">
            <h2>{{ t('series.communityRating') }}</h2>

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
                {{ t('series.votes', ratingSummary.voteCount) }}
              </p>

              <InteractiveStarRating
                v-if="authStore.isAuthenticated"
                :model-value="ratingSummary.currentUserScore"
                @rate="rateSeries"
              />

              <p v-else class="rating-login">
                {{ t('series.loginToRate') }}
              </p>
            </template>
          </div>
        </div>

        <div class="content-column">

          <p class="meta">
            {{ releaseYear }} • {{ series.numberOfSeasons }} {{ t('series.seasons') }} • {{ series.numberOfEpisodes }} {{ t('series.episodes') }} • {{ ratingOnFive }} / 5
          </p>

          <div class="genres">
          <RouterLink
            v-for="genre in series.genres"
            :key="genre.id"
            :to="{
              name: 'search-results',
              query: {
                type: 'genre',
                genreId: genre.id,
                sourceMediaType: 'tv',
                label: genre.name
              }
            }"
            class="genre"
          >
            {{ genre.name }}
          </RouterLink>
          </div>

          <div v-if="series.creators.length" class="info-block">
            <h2>{{ t('series.createdBy') }}</h2>

            <div class="people-links">
              <PersonLink
                v-for="creator in series.creators"
                :key="creator.id"
                :id="creator.id"
                :name="creator.name"
                role="director"
              />
            </div>
          </div>

          <div v-if="series.watchProviders.length" class="info-block">
            <h2>{{ t('series.availableOn') }}</h2>

            <div class="providers-grid">
              <WatchProviderCard
                v-for="provider in series.watchProviders"
                :key="`${provider.type}-${provider.id}`"
                :id="provider.id"
                :name="provider.name"
                :logo-path="provider.logoPath"
                :type="provider.type"
              />
            </div>
          </div>

          <PhysicalOffersSection
            v-if="series"
            :title="series.name"
            media-type="tv"
            :locale="apiLocale"
          />

          <div class="info-block">
            <h2>{{ t('series.overview') }}</h2>
            <p class="overview">{{ series.overview }}</p>
          </div>
        </div>

        <aside class="cast-column">
          <div v-if="series.cast.length" class="info-block">
            <h2>{{ t('series.mainCast') }}</h2>

            <div class="cast-row">
              <CastCard
                v-for="actor in series.cast"
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
      <CommentSection
        v-if="series"
        :media-id="series.id"
        media-type="tv"
        :media-title="series.name"
        :media-poster-path="series.posterPath"
      />
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

.error {
  color: #ff8a8a;
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
