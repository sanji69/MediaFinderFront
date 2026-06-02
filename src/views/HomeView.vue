<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MediaCard from '../components/media/MediaCard.vue'
import { getTrendingMovies, type TrendingMovie } from '../services/movieService'

const movies = ref<TrendingMovie[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const movieRowRef = ref<HTMLElement | null>(null)

let scrollInterval: number | null = null

function startScroll(direction: 'left' | 'right') {
    stopScroll()

    scrollInterval = window.setInterval(() => {
      movieRowRef.value?.scrollBy({
        left: direction === 'right' ? 12 : -12,
        behavior: 'smooth',
      })
    }, 16)
  }

function stopScroll() {
  if (scrollInterval !== null) {
    clearInterval(scrollInterval)
    scrollInterval = null
  }
}

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
    <section class="media-section">
      <h2>Trending Movies</h2>

      <p v-if="isLoading">Loading...</p>
      <p v-else-if="error">{{ error }}</p>

      <div v-else class="carousel-wrapper">
        <button class="carousel-arrow carousel-arrow-left"
          @mouseenter="startScroll('left')"
          @mouseleave="stopScroll"
          aria-label="Scroll left">
         ‹
        </button>
        <div class="media-row" ref="movieRowRef">
        <MediaCard
          v-for="movie in movies"
          :key="movie.id"
          :title="movie.title"
          :poster_path="movie.posterPath"
          :release_date="movie.releaseDate || ''"
          :vote_average="movie.voteAverage"
        />
      </div>
        <button class="carousel-arrow carousel-arrow-right"
          @mouseenter="startScroll('right')"
          @mouseleave="stopScroll"
          aria-label="Scroll right">
         ›
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.carousel-wrapper {
  position: relative;
}

.media-row {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding: 1rem 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.media-row::-webkit-scrollbar {
  display: none;
}

.carousel-arrow {
  position: absolute;
  top: 42%;
  z-index: 10;
  width: 44px;
  height: 80px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: 3rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.carousel-wrapper:hover .carousel-arrow {
  opacity: 1;
}

.carousel-arrow:hover {
  background: rgba(0, 0, 0, 0.9);
}

.carousel-arrow-left {
  left: 0;
}

.carousel-arrow-right {
  right: 0;
}
</style>
