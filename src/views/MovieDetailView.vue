<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getMovieById, type MovieDetail } from '../services/movieService'

const route = useRoute()

const movie = ref<MovieDetail | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const posterUrl = computed(() =>
  movie.value?.posterPath ? `https://image.tmdb.org/t/p/w500${movie.value.posterPath}` : null,
)

const releaseYear = computed(() =>
  movie.value?.releaseDate ? movie.value.releaseDate.split('-')[0] : 'Unknown',
)

const ratingOnFive = computed(() => {
  if (!movie.value) return 0
  return Math.floor((movie.value.voteAverage / 2) * 10) / 10
})

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    movie.value = await getMovieById(id, 'fr-FR')
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load movie details.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="movie-detail-page">
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>
    <section v-else class="movie-detail">
      <div class="poster-wrapper">
        <img v-if="posterUrl" :src="posterUrl" :alt="movie?.title" class="poster" />
      </div>

      <div class="movie-content">
        <h1>{{ movie?.title }}</h1>

        <p class="meta">{{ releaseYear }} • {{ movie?.runtime }} min • {{ ratingOnFive }} / 5</p>

        <div class="genres">
          <span v-for="genre in movie?.genres" :key="genre" class="genre">
            {{ genre }}
          </span>
        </div>

        <h2>Overview</h2>
        <p class="overview">{{ movie?.overview }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.movie-detail-page {
  min-height: 80vh;
  padding: 3rem 2rem;
  background: #111827;
  color: #f5f5f5;
}

.movie-detail {
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

.movie-content h1 {
  margin: 0;
  font-size: 3rem;
}

.meta {
  margin: 0;
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

movie-content h2 {
  margin: 2rem;
}

.overview {
  line-height: 1.7;
  color: #d1d5db;
  max-width: 760px;
}

@media (max-width: 768px) {
  .movie-detail {
    grid-template-columns: 1fr;
  }

  .poster-wrapper {
    max-width: 260px;
  }

  .movie-content h1 {
    font-size: 2rem;
  }
}
</style>
