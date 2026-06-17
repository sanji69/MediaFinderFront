<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import type { Comment } from '@/types/comment'

const props = defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  delete: [commentId: string]
  report: [comment: Comment]
}>()

const authStore = useAuthStore()

const isOwner = computed(() =>
  authStore.user?.id === props.comment.userId
)

const canReport = computed(() =>
  !!authStore.user &&
  !isOwner.value &&
  !props.comment.hasCurrentUserReported
)

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function resolveAvatarUrl(path?: string | null) {
  if (!path) return undefined

  if (path.startsWith('http')) return path

  return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${path}`
}
</script>

<template>
  <article class="comment-card">
    <div class="comment-header">
      <div class="comment-user">
        <div class="comment-avatar">
          <img
            v-if="comment.userAvatarPath"
            :src="resolveAvatarUrl(comment.userAvatarPath)"
            :alt="comment.username"
          />

          <span v-else>
            {{ comment.username.slice(0, 2).toUpperCase() }}
          </span>
        </div>

        <div>
          <strong>{{ comment.username }}</strong>
          <p>{{ formatDate(comment.createdAt) }}</p>
        </div>
      </div>

      <div class="comment-actions">
        <button
          v-if="isOwner"
          type="button"
          class="comment-action danger"
          @click="emit('delete', comment.id)"
        >
          Supprimer
        </button>

        <button
          v-if="canReport"
          type="button"
          class="comment-action"
          @click="emit('report', comment)"
        >
          Signaler
        </button>
      </div>
    </div>

    <p class="comment-content">
      {{ comment.content }}
    </p>
  </article>
</template>

<style scoped>
.comment-card {
  padding: 1rem;
  border: 1px solid #1a3f85;
  border-radius: 1rem;
  background: #0a1b44;
  color: white;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.comment-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #132a57;
  border: 1px solid #1a3f85;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  font-weight: 800;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-user p {
  margin: 0.2rem 0 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.comment-actions {
  display: flex;
  gap: 0.5rem;
}

.comment-action {
  height: fit-content;
  padding: 0.45rem 0.75rem;

  border: 1px solid #1a3f85;
  border-radius: 999px;

  background: #132a57;
  color: white;

  cursor: pointer;
}

.comment-action:hover {
  background: #1e3a8a;
}

.comment-action.danger {
  border-color: #991b1b;
  background: #7f1d1d;
}

.comment-action.danger:hover {
  background: #991b1b;
}

.comment-content {
  margin: 1rem 0 0;
  color: #e5e7eb;
  line-height: 1.6;
}
</style>