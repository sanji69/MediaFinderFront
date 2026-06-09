<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchMulti, searchByGenre, searchByPerson } from '../services/searchService'
import type { SearchResult } from '../types/searchResult'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const apiLocale = computed(() => ({
  language: locale.value,
  countryCode: locale.value.startsWith('fr') ? 'FR' : 'US',
}))

const results = ref<SearchResult[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const posterBaseUrl = 'https://image.tmdb.org/t/p/w342'

const pageTitle = computed(() => {
  const label = route.query.label?.toString()

  if (label) {
    return t('search.resultsFor', { name: label })
  }

  return t('search.title')
})

async function loadResults() {
  isLoading.value = true
  error.value = null

  try {
    const type = route.query.type?.toString()

    if (type === 'multi') {
    const query = route.query.query?.toString() ?? ''

    results.value = await searchMulti(
        query,
        apiLocale.value
    )

    return
    }

    if (type === 'person') {
        const personId = Number(route.query.personId)
        const role = route.query.role?.toString() ?? 'actor'

        results.value = await searchByPerson(personId, role, apiLocale.value)
        return
    }

    if (type === 'genre') {
        const genreId = Number(route.query.genreId)
        const sourceMediaType = route.query.sourceMediaType?.toString() ?? 'movie'

        results.value = await searchByGenre(genreId, sourceMediaType, apiLocale.value)
        return
    }

        results.value = []
    } catch (e) {
        console.error(e)
        error.value = t('search.loadError')
    } finally {
        isLoading.value = false
    }
}

function goToDetail(item: SearchResult) {
    if (item.mediaType === 'movie') {
        router.push(`/movies/${item.id}`)
        return
    }

  router.push(`/series/${item.id}`)
}

onMounted(loadResults)

watch(
  () => route.fullPath,
  () => loadResults()
)
</script>

<template>
  <main class="search-results-page">
    <h1>{{ pageTitle }}</h1>

    <p v-if="isLoading">
      {{ t('search.loading') }}
    </p>

    <p v-else-if="error" class="error">
      {{ t('search.loadError') }}
    </p>

    <p v-else-if="results.length === 0">
      {{ t('search.noResults') }}
    </p>

    <section v-else class="results-grid">
      <article
        v-for="item in results"
        :key="`${item.mediaType}-${item.id}`"
        class="result-card"
        @click="goToDetail(item)"
      >
        <img
          v-if="item.posterPath"
          :src="`${posterBaseUrl}${item.posterPath}`"
          :alt="item.title"
        />

        <div v-else class="poster-placeholder">
          {{ t('search.noPoster') }}
        </div>

        <h2>{{ item.title }}</h2>
      </article>
    </section>
  </main>
</template>

<style scoped>
.search-results-page {
  padding: 2rem;
}

.search-results-page h1 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.5rem;
}

.result-card {
  cursor: pointer;
  text-align: center;
  transition: transform 0.15s ease;
}

.result-card:hover {
  transform: scale(1.04);
}

.result-card img,
.poster-placeholder {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 0.75rem;
  object-fit: cover;
  background: #222;
}

.poster-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 0.9rem;
}

.result-card h2 {
  margin-top: 0.6rem;
  font-size: 0.95rem;
}

.error {
  color: #ff6b6b;
  text-align: center;
}
</style>