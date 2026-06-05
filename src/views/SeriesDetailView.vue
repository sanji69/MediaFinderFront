<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getSeriesById, type SerieDetail } from '../services/seriesService'

const route = useRoute()

const series = ref<SerieDetail | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const posterUrl = computed(() =>
  series.value?.posterPath ? `https://image.tmdb.org/t/p/w500${series.value.posterPath}` : null,
)

const firstAirYear = computed(() =>
  series.value?.firstAirDate ? series.value.firstAirDate.split('-')[0] : 'Unknown',
)

const ratingOnFive = computed(() => {
  if (!series.value) return 0
  return Math.floor((series.value.voteAverage / 2) * 10) / 10
})

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    series.value = await getSeriesById(id, 'fr-FR')
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load series details.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="series-detail-page">
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>

    <section v-else class="series-detail">
      <div class="poster-wrapper">
        <img v-if="posterUrl" :src="posterUrl" :alt="series?.name" class="poster" />
      </div>

      <div class="series-content">
        <h1>{{ series?.name }}</h1>

        <p class="meta">
          {{ firstAirYear }} • {{ series?.numberOfSeasons }} seasons •
          {{ series?.numberOfEpisodes }} episodes • {{ ratingOnFive }} / 5
        </p>

        <div class="genres">
          <span v-for="genre in series?.genres" :key="genre" class="genre">
            {{ genre }}
          </span>
        </div>

        <h2>Overview</h2>
        <p class="overview">{{ series?.overview }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.series-detail-page {
  min-height: 80vh;
  padding: 3rem 2rem;
  background: #111827;
  color: #f5f5f5;
}

.series-detail {
  gap: 3rem;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  align-items: start;
}

.poster-wrapper {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 16px;
  overflow: hidden;
  background: #1f2937;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.series-content h1 {
  margin: 0;
  font-size: 3rem;
}

.meta {
  margin: 1rem 0;
  color: #cbd5e1;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.genre {
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  background: #1f2937;
  font-size: 0.9rem;
}

.series-content h2 {
  margin-top: 2rem;
}

.overview {
  line-height: 1.7;
  color: #d1d5db;
  max-width: 760px;
}

@media (max-width: 768px) {
  .series-detail {
    grid-template-columns: 1fr;
  }

  .poster-wrapper {
    max-width: 260px;
  }

  .series-content h1 {
    font-size: 2rem;
  }
}
</style>
