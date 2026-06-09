<script setup lang="ts">defineProps<{
  id: number
  name: string
  role: string
}>()
</script>

<template>
  <RouterLink
    :to="{
      name: 'search-results',
      query: {
        type: 'person',
        personId: id,
        role,
        label: name
      }
    }"
    class="person-link"
  >
    {{ name }}
  </RouterLink>
</template>

<style scoped>
.person-link {
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

.person-link:hover {
  background: #2563eb;
  color: white;

  transform: translateY(-2px);
}
</style>