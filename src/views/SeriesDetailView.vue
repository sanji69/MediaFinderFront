<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getSeriesById, type SeriesDetail } from '../services/seriesService'
import PersonLink from '../components/people/PersonLink.vue'
import CastCard from '../components/people/CastCard.vue'
import WatchProviderCard from '../components/media/WatchProviderCard.vue'
import PhysicalOffersSection from '@/components/offers/PhysicalOffersSection.vue'

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
</script>

<template>
  <main class="movie-detail-page">
    <p v-if="isLoading">{{ t('common.loading') }}</p>
    <p v-else-if="error">{{ error }}</p>

    <section v-else-if="series" class="movie-detail">
    <h1 class="movie-title">{{ series.name }}</h1>

      <div class="movie-layout">
        <div class="poster-column">
          <div class="poster-wrapper">
            <img v-if="posterUrl" :src="posterUrl" :alt="series.name" class="poster" />
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

.movie-title {
  margin: 0 0 2rem;
  text-align: center;
  font-size: 3rem;
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


</style>
