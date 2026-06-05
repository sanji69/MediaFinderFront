<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  posterPath: string | null
  releaseDate: string | null
  voteAverage: number
  detailUrl: string
}>()

const posterUrl = computed(() => {
  if (!props.posterPath) {
    return null
  }

  return `https://image.tmdb.org/t/p/w500${props.posterPath}`
})

const formattedDate = computed(() => {
  if (!props.releaseDate) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(props.releaseDate))
})

const ratingOnFive = computed(() => {
  return Math.floor((props.voteAverage / 2) * 10) / 10
})

const ratingPercent = computed(() => {
  return `${(ratingOnFive.value / 5) * 100}%`
})
</script>

<template>
  <RouterLink :to="detailUrl" class="media-card-link">
    <article class="media-card">
      <div class="poster-wrapper">
        <img v-if="posterUrl" :src="posterUrl" :alt="title" class="poster" />

        <div v-else class="poster-placeholder">No image</div>
      </div>

      <div class="media-info">
        <h3>{{ title }}</h3>

        <p class="release-date">
          {{ formattedDate }}
        </p>

        <div class="rating" :aria-label="`Rating ${ratingOnFive} out of 5`">
          <div class="stars">
            <div class="stars-empty">★★★★★</div>
            <div class="stars-filled" :style="{ width: ratingPercent }">★★★★★</div>
          </div>
          <span class="rating-value">{{ ratingOnFive }}/5</span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>

<style scoped>
.media-card {
  width: 180px;
  flex: 0 0 180px;
  text-align: center;
  transition: transform 0.2s ease;
}

.media-card:hover {
  transform: scale(1.05);
}

.poster-wrapper {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 12px;
  overflow: hidden;
  background: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.poster-placeholder {
  color: #aaa;
  font-size: 0.9rem;
}

.media-info {
  margin-top: 0.75rem;
}

.media-info h3 {
  font-size: 1rem;
  line-height: 1.25;
  margin: 0;
  min-height: 2.5rem;
}

.release-date {
  font-size: 0.85rem;
  color: #aaa;
  margin: 0.35rem 0;
}

.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
}

.stars {
  position: relative;
  display: inline-block;
  font-size: 1rem;
  line-height: 1;
  letter-spacing: 1px;
}

.stars-empty {
  color: #555;
}

.stars-filled {
  color: #f4c542;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
}

.rating-value {
  color: #ddd;
  font-size: 0.8rem;
}

.media-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
