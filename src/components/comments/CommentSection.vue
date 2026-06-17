<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import type { Comment } from '@/types/comment'
import {
  createComment,
  deleteComment,
  getComments,
  reportComment,
} from '@/services/commentService'
import CommentCard from '@/components/comments/CommentCard.vue'
import ReportCommentModal from '@/components/comments/ReportCommentModal.vue'

const props = defineProps<{
  mediaId: number
  mediaType: 'movie' | 'tv'
  mediaTitle: string
  mediaPosterPath?: string | null
}>()

const { t } = useI18n()
const authStore = useAuthStore()

const comments = ref<Comment[]>([])
const newComment = ref('')
const loading = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)

const selectedReportComment = ref<Comment | null>(null)

onMounted(loadComments)

async function loadComments() {
  try {
    loading.value = true
    error.value = null

    comments.value = await getComments(props.mediaType, props.mediaId, authStore.token)
  } catch (err) {
    console.error(err)
    error.value = t('comments.loadError')
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  const content = newComment.value.trim()

  if (!authStore.token) return

  if (content.length < 2) {
    error.value = t('comments.commentTooShort')
    return
  }

  try {
    submitting.value = true
    error.value = null

    const createdComment = await createComment(
      {
        mediaId: props.mediaId,
        mediaType: props.mediaType,
        mediaTitle: props.mediaTitle,
        mediaPosterPath: props.mediaPosterPath,
        content,
      },
      authStore.token
    )

    comments.value.unshift(createdComment)
    newComment.value = ''
  } catch (err) {
    console.error(err)
    error.value = t('comments.createError')
  } finally {
    submitting.value = false
  }
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

function openReportModal(comment: Comment) {
  selectedReportComment.value = comment
}

function closeReportModal() {
  selectedReportComment.value = null
}

async function submitReport(reason: string) {
  if (!authStore.token || !selectedReportComment.value) return

  try {
    await reportComment(
      selectedReportComment.value.id,
      { reason },
      authStore.token
    )

    comments.value = comments.value.map(comment =>
      comment.id === selectedReportComment.value?.id
        ? { ...comment, hasCurrentUserReported: true }
        : comment
    )
    
  } catch (err) {
    console.error(err)

    error.value =
        err instanceof Error
        ? err.message
        : t('comments.alreadyReported')
  } finally {
    selectedReportComment.value = null
  }
}
</script>

<template>
    <section class="comments-section">
        <h2>{{ t('comments.title') }}</h2>

        <div v-if="authStore.isAuthenticated" class="comment-form">
            <textarea
                v-model="newComment"
                :placeholder="t('comments.placeholder')"
                maxlength="2000"
            />
            <div class="comment-form-footer">
                <span>{{ newComment.length }}/2000</span>

                <button
                type="button"
                :disabled="submitting"
                @click="submitComment"
                >
                {{ submitting ? t('comments.sending') : t('comments.send') }}
                </button>
            </div>
        </div>

        <p v-else class="login-message">
        {{ t('comments.loginToComment') }}
        </p>

        <p v-if="error" class="error">
        {{ error }}
        </p>

        <p v-if="loading" class="empty-message">
        {{ t('comments.loading') }}
        </p>

        <div v-else-if="comments.length" class="comments-list">
            <CommentCard
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @delete="openDeleteModal"
                @report="openReportModal"
            />
        </div>

        <p v-else class="empty-message">
        {{ t('comments.empty') }}
        </p>

        <ReportCommentModal
        v-if="selectedReportComment"
        :comment="selectedReportComment"
        @close="closeReportModal"
        @submit="submitReport"
        />
    </section>
    <div v-if="selectedDeleteCommentId" class="modal-overlay" >
        <div class="modal">
            <h2>{{ t('comments.deleteTitle') }}</h2>

            <p>{{ t('comments.deleteConfirmation') }}</p>

            <div class="modal-actions">
                <button
                    type="button"
                    class="cancel-button"
                    @click="closeDeleteModal"
                >
                    {{ t('common.cancel') }}
                </button>

                <button
                    type="button"
                    class="delete-button"
                    @click="confirmDeleteComment"
                >
                    {{ t('comments.delete') }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.comments-section {
  margin-top: 2rem;
  padding: 1.5rem;

  border: 1px solid #1a3f85;
  border-radius: 1.25rem;

  background: #06153a;
  color: white;
}

.comments-section h2 {
  margin: 0 0 1rem;
}

.comment-form {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.comment-form textarea {
  width: 100%;
  min-height: 120px;

  padding: 1rem;

  border: 1px solid #1a3f85;
  border-radius: 1rem;

  background: #0a1b44;
  color: white;

  resize: vertical;
}

.comment-form textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.comment-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  color: #94a3b8;
  font-size: 0.9rem;
}

.comment-form-footer button {
  padding: 0.75rem 1rem;

  border: none;
  border-radius: 999px;

  background: white;
  color: #06153a;

  font-weight: 800;
  cursor: pointer;
}

.comment-form-footer button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-message,
.empty-message {
  color: #94a3b8;
}

.error {
  color: #fca5a5;
}

.comments-list {
  display: grid;
  gap: 1rem;
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