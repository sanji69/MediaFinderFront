<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Comment } from '@/types/comment'

defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  close: []
  submit: [reason: string]
}>()

const { t } = useI18n()

const reason = ref('')
const error = ref<string | null>(null)

function submitReport() {
  const trimmedReason = reason.value.trim()

  if (trimmedReason.length < 5) {
    error.value = t('comments.reportReasonTooShort')
    return
  }

  emit('submit', trimmedReason)
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>{{ t('comments.reportTitle') }}</h2>

      <p class="modal-description">
        {{ t('comments.reportDescription') }}
      </p>

      <textarea
        v-model="reason"
        class="report-textarea"
        :placeholder="t('comments.reportPlaceholder')"
      />

      <p v-if="error" class="error">
        {{ error }}
      </p>

      <div class="modal-actions">
        <button
          type="button"
          class="cancel-button"
          @click="emit('close')"
        >
          {{ t('common.cancel') }}
        </button>

        <button
          type="button"
          class="report-button"
          @click="submitReport"
        >
          {{ t('comments.report') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  max-width: 520px;

  padding: 2rem;

  border: 1px solid #1a3f85;
  border-radius: 1rem;

  background: #0a1b44;
  color: white;

  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.modal h2 {
  margin: 0 0 1rem;
}

.modal-description {
  color: #cbd5e1;
  line-height: 1.5;
}

.report-textarea {
  width: 100%;
  min-height: 120px;

  margin-top: 1rem;
  padding: 1rem;

  border: 1px solid #1a3f85;
  border-radius: 0.75rem;

  background: #06153a;
  color: white;

  resize: vertical;
}

.report-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.error {
  margin-top: 0.75rem;
  color: #fca5a5;
}

.modal-actions {
  margin-top: 1.5rem;

  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button,
.report-button {
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

.report-button {
  border: none;
  background: #991b1b;
  color: white;
}

.report-button:hover {
  background: #dc2626;
}
</style>