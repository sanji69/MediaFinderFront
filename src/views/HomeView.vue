<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MediaCard from '../components/media/MediaCard.vue'
import { getTrendingMovies, type TrendingMovie } from '../services/movieService'
import { getTrendingSeries, type TrendingSeries } from '../services/seriesService'

const movies = ref<TrendingMovie[]>([])
const series = ref<TrendingSeries[]>([])
const isSeriesLoading = ref(true)
const movieIsLoading = ref(true)
const movieError = ref<string | null>(null)
const movieRowRef = ref<HTMLElement | null>(null)
const seriesError = ref<string | null>(null)
const seriesRowRef = ref<HTMLElement | null>(null)

let scrollInterval: number | null = null

function startScroll(element: HTMLElement | null, direction: 'left' | 'right') {
  stopScroll()

  scrollInterval = window.setInterval(() => {
    element?.scrollBy({
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
    movieIsLoading.value = true
    movies.value = await getTrendingMovies('fr-FR')
  } catch (err) {
    console.error(err)
    movieError.value = 'Failed to load trending movies.'
  } finally {
    movieIsLoading.value = false
  }
  try {
    isSeriesLoading.value = true
    series.value = await getTrendingSeries('fr-FR')
  } catch (err) {
    console.error(err)
    seriesError.value = 'Failed to load trending series.'
  } finally {
    isSeriesLoading.value = false
  }
})
</script>

<template>
  <main>
    <section class="media-section">
      <h2>Trending Movies</h2>

      <p v-if="movieIsLoading">Loading...</p>
      <p v-else-if="movieError">{{ movieError }}</p>

      <div v-else class="carousel-wrapper">
        <button
          class="carousel-arrow carousel-arrow-left"
          @mouseenter="startScroll(movieRowRef, 'left')"
          @mouseleave="stopScroll"
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div class="media-row" ref="movieRowRef">
          <MediaCard
            v-for="movie in movies"
            :key="movie.id"
            :title="movie.title"
            :posterPath="movie.posterPath"
            :releaseDate="movie.releaseDate || ''"
            :voteAverage="movie.voteAverage"
            :detailUrl="`/movies/${movie.id}`"
          />
        </div>
        <button
          class="carousel-arrow carousel-arrow-right"
          @mouseenter="startScroll(movieRowRef, 'right')"
          @mouseleave="stopScroll"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
    <section class="media-section">
      <h2>Trending Series</h2>

      <p v-if="isSeriesLoading">Loading...</p>
      <p v-else-if="seriesError">{{ seriesError }}</p>

      <div v-else class="carousel-wrapper">
        <button
          class="carousel-arrow carousel-arrow-left"
          @mouseenter="startScroll(seriesRowRef, 'left')"
          @mouseleave="stopScroll"
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div class="media-row" ref="seriesRowRef">
          <MediaCard
            v-for="serie in series"
            :key="serie.id"
            :title="serie.name"
            :posterPath="serie.posterPath"
            :releaseDate="serie.firstAirDate || ''"
            :voteAverage="serie.voteAverage"
            :detailUrl="`/series/${serie.id}`"
          />
        </div>
        <button
          class="carousel-arrow carousel-arrow-right"
          @mouseenter="startScroll(seriesRowRef, 'right')"
          @mouseleave="stopScroll"
          aria-label="Scroll right"
        >
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
  transition:
    opacity 0.2s ease,
    background 0.2s ease;
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

.media-section h2 {
  margin-bottom: 0 0 1rem;
  padding-left: 0.75rem;

  font-size: 1.8rem;
  font-weight: 700;

  color: #ffffff;

  border-left: 4px solid #3b82f6;
}
</style>
