<script setup lang="ts">
defineProps<{
  id: number
  name: string
  logoPath: string | null
  type: string
}>()
</script>

<template>
  <div class="provider-card">
    <img
      v-if="logoPath"
      :src="`https://image.tmdb.org/t/p/w92${logoPath}`"
      :alt="name"
      class="provider-logo"
    />

    <div class="provider-info">
      <span class="provider-name">
        {{ name }}
      </span>

      <span class="provider-type">
        {{ type }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.provider-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  padding: 0.75rem;

  border-radius: 12px;

  background: #1f2937;
}

.provider-logo {
  width: 48px;
  height: 48px;

  border-radius: 12px;

  object-fit: cover;
}

.provider-info {
  display: flex;
  flex-direction: column;
}

.provider-name {
  font-weight: 600;
}

.provider-type {
  font-size: 0.8rem;
  color: #94a3b8;
}
</style>