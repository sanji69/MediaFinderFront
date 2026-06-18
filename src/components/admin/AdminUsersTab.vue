<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import type { AdminUser, UserRole } from '@/types/admin'
import {
  banUser,
  getAdminUsers,
  resetUserWarnings,
  unbanUser,
  updateUserRole,
} from '@/services/adminService'

const props = defineProps<{
  isAdmin: boolean
  isModerator: boolean
}>()

const { t } = useI18n()
const authStore = useAuthStore()

const users = ref<AdminUser[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(loadUsers)

async function loadUsers() {
  if (!authStore.token) return

  try {
    loading.value = true
    error.value = null

    users.value = ( await getAdminUsers(authStore.token))
        .filter(user =>
            user.accountStatus !== 2 && // supprimé
            user.id !== authStore.user?.id // moi-même
        )
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('admin.usersLoadError')
  } finally {
    loading.value = false
  }
}

function roleLabel(role: UserRole) {
  if (role === 3) return t('admin.roles.admin')
  if (role === 2) return t('admin.roles.moderator')
  return t('admin.roles.user')
}

function statusLabel(status: number) {
  if (status === 3) return t('admin.status.banned')
  if (status === 2) return t('admin.status.deleted')
  return t('admin.status.active')
}

function warningClass(user: AdminUser) {
  if (user.warningCount >= 3) return 'danger-warning'
  if (user.warningCount > 0) return 'soft-warning'
  return ''
}

async function handleBan(user: AdminUser) {
  if (!authStore.token) return

  try {
    await banUser(user.id, authStore.token)

    user.accountStatus = 3
    user.bannedAt = new Date().toISOString()
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('admin.banUserError')
  }
}

async function handleUnban(user: AdminUser) {
  if (!authStore.token) return

  try {
    await unbanUser(user.id, authStore.token)

    user.accountStatus = 1
    user.warningCount = 0
    user.bannedAt = null
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('admin.unbanUserError')
  }
}

async function handleResetWarnings(user: AdminUser) {
  if (!authStore.token) return

  try {
    await resetUserWarnings(user.id, authStore.token)
    user.warningCount = 0
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('admin.resetWarningsError')
  }
}

async function handleRoleChange(user: AdminUser, event: Event) {
  if (!authStore.token || !props.isAdmin) return

  const target = event.target as HTMLSelectElement
  const newRole = Number(target.value) as UserRole

  try {
    await updateUserRole(user.id, { role: newRole }, authStore.token)
    user.role = newRole
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('admin.updateRoleError')
  }
}
</script>

<template>
  <section class="admin-tab">
    <h2>{{ t('admin.users.title') }}</h2>

    <p v-if="loading" class="state-message">
      {{ t('common.loading') }}
    </p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <p v-else-if="!users.length" class="state-message">
      {{ t('admin.users.empty') }}
    </p>

    <div v-else class="users-table">
      <div class="users-table-header">
        <span>{{ t('admin.users.username') }}</span>
        <span>{{ t('admin.users.email') }}</span>
        <span>{{ t('admin.users.role') }}</span>
        <span>{{ t('admin.warnings') }}</span>
        <span>{{ t('admin.users.actions') }}</span>
      </div>

      <div
        v-for="user in users"
        :key="user.id"
        class="users-table-row"
        :class="warningClass(user)"
      >
        <span>{{ user.username }}</span>

        <span>{{ user.email }}</span>

        <span class="role-cell">
          <select
            v-if="props.isAdmin"
            :value="user.role"
            class="role-select"
            @change="handleRoleChange(user, $event)"
          >
            <option :value="1">
              {{ t('admin.roles.user') }}
            </option>

            <option :value="2">
              {{ t('admin.roles.moderator') }}
            </option>

            <option :value="3">
              {{ t('admin.roles.admin') }}
            </option>
          </select>

          <template v-else>
            {{ roleLabel(user.role) }}
          </template>
        </span>

        <span class="warning-count">
          {{ user.warningCount }}
        </span>

        <span class="actions-cell">
          <button
            v-if="user.accountStatus !== 3"
            type="button"
            class="danger-button"
            @click="handleBan(user)"
          >
            {{ t('admin.users.ban') }}
          </button>

          <button
            v-else
            type="button"
            class="safe-button"
            @click="handleUnban(user)"
          >
            {{ t('admin.users.unban') }}
          </button>

          <button
            v-if="user.warningCount > 0"
            type="button"
            class="secondary-button"
            @click="handleResetWarnings(user)"
          >
            {{ t('admin.users.resetWarnings') }}
          </button>
        </span>
      </div>
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

.users-table {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
}

.users-table-header,
.users-table-row {
  display: grid;
  grid-template-columns:
    minmax(130px, 1.1fr)
    minmax(230px, 1.7fr)
    minmax(160px, 1fr)
    minmax(90px, 0.5fr)
    minmax(160px, 1fr);
  gap: 0.75rem;
  align-items: center;

  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
}

.users-table-header span {
  white-space: nowrap;
}

.warning-count {
  font-weight: 800;
  text-align: left;
}

.users-table-header {
  background: #132a57;
  color: #bfdbfe;
  font-weight: 800;
}

.users-table-row {
  background: #0a1b44;
  border: 1px solid #1a3f85;
}

.users-table-row.soft-warning {
  border-color: #facc15;
}

.users-table-row.danger-warning {
  border-color: #dc2626;
}

.users-table-header span,
.users-table-row span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.role-cell,
.actions-cell {
  display: flex;
  align-items: center;
}

.role-select {
  width: 150px;
  padding: 0.5rem 0.75rem;

  border: 1px solid #3b82f6;
  border-radius: 0.75rem;

  background: #132a57;
  color: white;

  font-weight: 700;
}

.warning-count {
  font-weight: 800;
  text-align: center;
}

.actions-cell {
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
}

.danger-button,
.safe-button,
.secondary-button {
  width: 100%;
  padding: 0.5rem 0.75rem;

  border-radius: 0.75rem;
  border: none;

  color: white;
  font-weight: 700;
  cursor: pointer;
}

.danger-button {
  background: #991b1b;
}

.danger-button:hover {
  background: #dc2626;
}

.safe-button {
  background: #166534;
}

.safe-button:hover {
  background: #15803d;
}

.secondary-button {
  border: 1px solid #3b82f6;
  background: transparent;
}

.secondary-button:hover {
  background: #1e3a8a;
}

.state-message {
  margin-top: 1rem;
  color: #94a3b8;
}

.error {
  margin-top: 1rem;
  color: #fca5a5;
}

@media (max-width: 900px) {
  .users-table-header {
    display: none;
  }

  .users-table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .users-table-row span {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .role-select {
    max-width: none;
  }

  .warning-count {
    text-align: left;
  }
}
</style>