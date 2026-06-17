<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { getMyComments, deleteComment } from '@/services/commentService'
import type { Comment } from '@/types/comment'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const comments = ref<Comment[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(loadComments)

async function loadComments() {
  if (!authStore.token) {
    router.push({ name: 'login' })
    return
  }

  try {
    loading.value = true
    error.value = null

    comments.value = await getMyComments(authStore.token)
  } catch (err) {
    console.error(err)
    error.value = t('comments.myCommentsLoadError')
  } finally {
    loading.value = false
  }
}

function getMediaRoute(comment: Comment) {
  return comment.mediaType === 'movie'
    ? { name: 'movie-detail', params: { id: comment.mediaId } }
    : { name: 'series-detail', params: { id: comment.mediaId } }
}

function resolvePosterUrl(path?: string | null) {
  if (!path) return null

  if (path.startsWith('http')) return path

  return `https://image.tmdb.org/t/p/w185${path}`
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

const selectedDeleteCommentId = ref<string | null>(null)

function openDeleteModal(commentId: string) {
  selectedDeleteCommentId.value = commentId
}

function closeDeleteModal() {
  selectedDeleteCommentId.value = null
}

async function confirmDeleteComment() {
  if (!authStore.token || !selectedDeleteCommentId.value) return

  const commentId = selectedDeleteCommentId.value

  try {
    await deleteComment(commentId, authStore.token)

    comments.value = comments.value.filter(comment => comment.id !== commentId)

    selectedDeleteCommentId.value = null
  } catch (err) {
    console.error(err)
    error.value = t('comments.deleteError')
  }
}

</script>

<template>
  <main class="my-comments-page">
    <section class="my-comments-card">
      <h1>{{ t('comments.myCommentsTitle') }}</h1>

      <p v-if="loading" class="state-message">
        {{ t('comments.loading') }}
      </p>

      <p v-else-if="error" class="error">
        {{ error }}
      </p>

      <p v-else-if="!comments.length" class="state-message">
        {{ t('comments.myCommentsEmpty') }}
      </p>

      <div v-else class="comments-list">
        <article
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
        >
          <div class="comment-info">
            <div class="comment-meta">
              <span class="media-type">
                {{ comment.mediaType === 'movie' ? t('common.movie') : t('common.series') }}
              </span>

              <span class="comment-date">
                {{ formatDate(comment.createdAt) }}
              </span>
            </div>

            <RouterLink
              :to="getMediaRoute(comment)"
              class="media-title-link"
            >
              <h2>{{ comment.mediaTitle }}</h2>
            </RouterLink>

            <p class="comment-content">
              {{ comment.content }}
            </p>
            
            <button
              type="button"
              class="delete-comment-button"
              @click="openDeleteModal(comment.id)"
            >
              🗑️ {{ t('comments.delete') }}
            </button>
          </div>

          <div class="poster-wrapper">
            <img
              v-if="resolvePosterUrl(comment.mediaPosterPath)"
              :src="resolvePosterUrl(comment.mediaPosterPath)!"
              :alt="comment.mediaTitle"
            />

            <div v-else class="poster-placeholder">
              🎬
            </div>
          </div>          
        </article>
      </div>
    </section>
  </main>
  <div v-if="selectedDeleteCommentId" class="modal-overlay">
    <div class="modal">
      <h2>{{ t('comments.deleteTitle') }}</h2>

      <p>{{ t('comments.deleteConfirmation') }}</p>

      <div class="modal-actions">
        <button type="button" class="cancel-button" @click="closeDeleteModal">
          {{ t('common.cancel') }}
        </button>

        <button type="button" class="delete-button" @click="confirmDeleteComment">
          {{ t('comments.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-comments-page {
  min-height: calc(100vh - 72px);
  padding: 2rem;

  display: flex;
  justify-content: center;
}

.my-comments-card {
  width: 100%;
  max-width: 900px;

  padding: 2rem;

  border-radius: 1.25rem;

  background: #0a1b44;
  color: white;
}

.my-comments-card h1 {
  margin: 0 0 1.5rem;
  text-align: center;
}

.comments-list {
  display: grid;
  gap: 1rem;
}

.comment-item {
  display: grid;
  grid-template-columns: 1fr 90px;
  gap: 1rem;
  align-items: center;

  padding: 1rem;

  border: 1px solid #1a3f85;
  border-radius: 1rem;

  background: #132a57;
  color: white;

  text-decoration: none;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.comment-item:hover {
  background: #1e3a8a;
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.comment-info {
  min-width: 0;
}

.comment-meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;

  margin-bottom: 0.5rem;

  color: #94a3b8;
  font-size: 0.85rem;
}

.media-type {
  padding: 0.2rem 0.5rem;

  border-radius: 999px;

  background: #06153a;
  color: #bfdbfe;

  font-weight: 700;
}

.comment-item h2 {
  margin: 0 0 0.5rem;

  font-size: 1.1rem;
}

.comment-content {
  margin: 0;

  color: #dbeafe;
  line-height: 1.5;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

.poster-wrapper {
  width: 90px;
  height: 135px;

  border-radius: 0.75rem;
  overflow: hidden;

  background: #06153a;
  border: 1px solid #1a3f85;
}

.poster-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-placeholder {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2rem;
}

.state-message {
  text-align: center;
  color: #94a3b8;
}

.error {
  text-align: center;
  color: #fca5a5;
}

@media (max-width: 640px) {
  .my-comments-page {
    padding: 1rem;
  }

  .my-comments-card {
    padding: 1.25rem;
  }

  .comment-item {
    grid-template-columns: 1fr;
  }

  .poster-wrapper {
    justify-self: center;
  }
}

.delete-comment-button {
  margin-top: 1rem;
  width: fit-content;

  padding: 0.5rem 0.75rem;

  border: 1px solid #991b1b;
  border-radius: 999px;

  background: #7f1d1d;
  color: white;

  font-weight: 700;
  cursor: pointer;
}

.delete-comment-button:hover {
  background: #991b1b;
}

.media-title-link {
  color: white;
  text-decoration: none;
}

.media-title-link:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
}

.modal {
  width: 100%;
  max-width: 500px;
  padding: 2rem;

  border: 1px solid #1a3f85;
  border-radius: 1rem;

  background: #0a1b44;
  color: white;

  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button,
.delete-button {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.cancel-button {
  border: 1px solid #3b82f6;
  background: transparent;
  color: white;
}

.delete-button {
  border: none;
  background: #991b1b;
  color: white;
}

.delete-button:hover {
  background: #dc2626;
}
</style>