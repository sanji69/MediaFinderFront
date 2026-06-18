<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import AdminReportsTab from '@/components/admin/AdminReportsTab.vue'
import AdminUsersTab from '@/components/admin/AdminUsersTab.vue'

type AdminTab = 'reports' | 'users'

const { t } = useI18n()
const authStore = useAuthStore()

const activeTab = ref<AdminTab>('reports')

const isAdmin = computed(() => authStore.user?.role === 3)
const isModerator = computed(() => authStore.user?.role === 2)

const canAccessAdmin = computed(() => isAdmin.value || isModerator.value)
</script>

<template>
  <main class="admin-page">
    <section v-if="canAccessAdmin" class="admin-card">
      <div class="admin-header">
        <div>
          <h1>{{ t('admin.title') }}</h1>
          <p>{{ t('admin.subtitle') }}</p>
        </div>

        <span class="role-badge">
          {{ isAdmin ? t('admin.roles.admin') : t('admin.roles.moderator') }}
        </span>
      </div>

      <div class="admin-tabs">
        <button
          type="button"
          :class="{ active: activeTab === 'reports' }"
          @click="activeTab = 'reports'"
        >
          🚩 {{ t('admin.tabs.reports') }}
        </button>

        <button
          type="button"
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          👥 {{ t('admin.tabs.users') }}
        </button>
      </div>

      <AdminReportsTab v-if="activeTab === 'reports'" />

      <AdminUsersTab
        v-else
        :is-admin="isAdmin"
        :is-moderator="isModerator"
      />
    </section>

    <section v-else class="admin-card">
      <h1>{{ t('admin.forbiddenTitle') }}</h1>
      <p>{{ t('admin.forbiddenMessage') }}</p>
    </section>
  </main>
</template>

<style scoped>
.admin-page {
  min-height: calc(100vh - 72px);
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.admin-card {
  width: 100%;
  max-width: 1100px;
  padding: 2rem;
  border-radius: 1.25rem;
  background: #0a1b44;
  color: white;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.admin-header h1 {
  margin: 0;
}

.admin-header p {
  margin: 0.5rem 0 0;
  color: #94a3b8;
}

.role-badge {
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: #132a57;
  border: 1px solid #3b82f6;
  font-weight: 700;
}

.admin-tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.admin-tabs button {
  padding: 0.8rem 1rem;
  border-radius: 999px;
  border: 1px solid #1a3f85;
  background: #132a57;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.admin-tabs button.active,
.admin-tabs button:hover {
  background: #1e40af;
  border-color: #3b82f6;
}
</style>