<script setup lang="ts">
defineProps<{
  id: number
  name: string
  character: string
  profilePath: string | null
}>()
</script>

<template>
  <RouterLink :to="`/search?personId=${id}`" class="cast-card">
    <div class="cast-photo">
      <img
        v-if="profilePath"
        :src="`https://image.tmdb.org/t/p/w185${profilePath}`"
        :alt="name"
      />

      <div v-else class="cast-placeholder">?</div>
    </div>

    <h3>{{ name }}</h3>
    <p>{{ character }}</p>
  </RouterLink>
</template>

<style scoped>

.cast-card {
  width: 100%;
  max-width: 100px;
  justify-self: center;
}

.cast-card:hover {
  transform: translateY(-4px);
}

.cast-photo {
  width: 100%;
  aspect-ratio: 2 / 3;
}

.cast-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cast-placeholder {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2rem;
  color: #64748b;
}

.cast-card h3 {
  margin: 0.5rem 0 0.25rem;
  font-size: 0.9rem;
}

.cast-card p {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

</style>