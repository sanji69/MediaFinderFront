<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTrendingMovies, type TrendingMovie } from '../services/movieService'

const movies = ref<TrendingMovie[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    isLoading.value = true
    movies.value = await getTrendingMovies('fr-FR')
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load trending movies.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main>
    <h1>Media Finder</h1>
    <h2>Trending Movies</h2>

    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>

    <div v-else class="movies-grid">
      <article v-for="movie in movies" :key="movie.id" class="movie-card">
        <img
          v-if="movie.posterPath"
          :src="`https://image.tmdb.org/t/p/w500${movie.posterPath}`"
          :alt="movie.title"
        />

        <h3>{{ movie.title }}</h3>
        <p>{{ movie.releaseDate }}</p>
        <p>{{ movie.voteAverage.toFixed(1) }}</p>
      </article>
    </div>
  </main>
</template>

<style scoped>
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.movie-card img {
  width: 100%;
  border-radius: 8px;
}

.movie-card h3 {
  font-size: 1.1rem;
}
</style>
