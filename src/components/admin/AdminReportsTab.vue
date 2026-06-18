<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import type { AdminCommentReport } from '@/types/admin'
import {
  acceptReport,
  getAdminReports,
  rejectReport,
} from '@/services/adminService'

const { t } = useI18n()
const authStore = useAuthStore()

const reports = ref<AdminCommentReport[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(loadReports)

async function loadReports() {
  if (!authStore.token) return

  try {
    loading.value = true
    error.value = null

    reports.value = await getAdminReports(authStore.token)
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('admin.reportsLoadError')
  } finally {
    loading.value = false
  }
}

async function handleAccept(reportId: string) {
  if (!authStore.token) return

  try {
    await acceptReport(reportId, authStore.token)
    reports.value = reports.value.filter(report => report.id !== reportId)
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('admin.acceptReportError')
  }
}

async function handleReject(reportId: string) {
  if (!authStore.token) return

  try {
    await rejectReport(reportId, authStore.token)
    reports.value = reports.value.filter(report => report.id !== reportId)
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('admin.rejectReportError')
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function getMediaLabel(report: AdminCommentReport) {
  return report.mediaType === 'movie'
    ? t('common.movie')
    : t('common.series')
}
</script>

<template>
  <section class="admin-tab">
    <div class="tab-header">
      <div>
        <h2>{{ t('admin.reports.title') }}</h2>
        <p>{{ t('admin.reports.subtitle') }}</p>
      </div>

      <span class="count-badge">
        {{ reports.length }}
      </span>
    </div>

    <p v-if="loading" class="state-message">
      {{ t('common.loading') }}
    </p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <p v-else-if="!reports.length" class="state-message">
      {{ t('admin.reports.empty') }}
    </p>

    <div v-else class="reports-list">
      <article
        v-for="report in reports"
        :key="report.id"
        class="report-card"
      >
        <div class="report-main">
          <div class="report-meta">
            <span class="media-type">
              {{ getMediaLabel(report) }}
            </span>

            <span>{{ report.mediaTitle }}</span>

            <span>{{ formatDate(report.createdAt) }}</span>
          </div>

          <div class="report-block">
            <h3>{{ t('admin.reports.comment') }}</h3>
            <p>{{ report.commentContent }}</p>
          </div>

          <div class="report-block">
            <h3>{{ t('admin.reports.reason') }}</h3>
            <p>{{ report.reason }}</p>
          </div>

          <div class="report-users">
            <div>
              <span>{{ t('admin.reports.author') }}</span>
              <strong>{{ report.commentAuthorUsername }}</strong>
              <small>
                {{ t('admin.warnings') }} : {{ report.commentAuthorWarningCount }}
              </small>
            </div>

            <div>
              <span>{{ t('admin.reports.reportedBy') }}</span>
              <strong>{{ report.reporterUsername }}</strong>
            </div>
          </div>
        </div>

        <div class="report-actions">
          <button
            type="button"
            class="reject-button"
            @click="handleReject(report.id)"
          >
            {{ t('admin.reports.reject') }}
          </button>

          <button
            type="button"
            class="accept-button"
            @click="handleAccept(report.id)"
          >
            {{ t('admin.reports.accept') }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.admin-tab {
  padding: 1rem;
  border: 1px solid #1a3f85;
  border-radius: 1rem;
  background: #06153a;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tab-header h2 {
  margin: 0;
}

.tab-header p {
  margin: 0.4rem 0 0;
  color: #94a3b8;
}

.count-badge {
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.6rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background: #132a57;
  border: 1px solid #3b82f6;

  font-weight: 800;
}

.reports-list {
  display: grid;
  gap: 1rem;
}

.report-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;

  padding: 1rem;

  border: 1px solid #1a3f85;
  border-radius: 1rem;

  background: #0a1b44;
}

.report-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  margin-bottom: 1rem;

  color: #94a3b8;
  font-size: 0.85rem;
}

.media-type {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: #132a57;
  color: #bfdbfe;
  font-weight: 700;
}

.report-block {
  margin-top: 0.75rem;
}

.report-block h3 {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
  color: #bfdbfe;
}

.report-block p {
  margin: 0;
  color: #e5e7eb;
  line-height: 1.5;
}

.report-users {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  margin-top: 1rem;
}

.report-users div {
  padding: 0.75rem;

  border-radius: 0.75rem;
  background: #132a57;

  display: grid;
  gap: 0.25rem;
}

.report-users span,
.report-users small {
  color: #94a3b8;
}

.report-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reject-button,
.accept-button {
  padding: 0.75rem 1rem;

  border-radius: 0.75rem;

  font-weight: 800;
  cursor: pointer;
}

.reject-button {
  border: 1px solid #3b82f6;
  background: transparent;
  color: white;
}

.accept-button {
  border: none;
  background: #991b1b;
  color: white;
}

.accept-button:hover {
  background: #dc2626;
}

.reject-button:hover {
  background: #1e3a8a;
}

.state-message {
  color: #94a3b8;
}

.error {
  color: #fca5a5;
}

@media (max-width: 760px) {
  .report-card {
    grid-template-columns: 1fr;
  }

  .report-actions {
    flex-direction: row;
  }
}
</style>