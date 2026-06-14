<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { uploadProfileAvatar } from '@/services/profileService'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const initials = computed(() => {
  const username = authStore.user?.username ?? ''
  return username.slice(0, 2).toUpperCase()
})

const fileInput = ref<HTMLInputElement | null>(null)
const avatarError = ref<string | null>(null)

function logout() {
  authStore.logout()
  router.push({ name: 'login' })
}

function openAvatarPicker() {
  fileInput.value?.click()
}

async function onAvatarSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  const maxSize = 5 * 1024 * 1024

  if (!file || !authStore.token) return

  if (file.size > maxSize) {
    avatarError.value = t('profile.avatarTooLarge')
    return
  }

  try {
    avatarError.value = null

    const updatedUser = await uploadProfileAvatar(
      file,
      authStore.token
    )

    authStore.updateUser(updatedUser)
  } catch (err) {
    console.error(err)
    avatarError.value = t('profile.avatarUploadError')
  } finally {
    input.value = ''
  }
}

function resolveAvatarUrl(path: string | null) {
  if (!path) return undefined

  if (path.startsWith('http')) return path

  return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${path}`
}
</script>

<template>
  <main class="profile-page">
    <section v-if="authStore.user" class="profile-card">
      <button class="avatar avatar-button" type="button" @click="openAvatarPicker">
        <img
          v-if="authStore.user.avatarPath"
          :src="resolveAvatarUrl(authStore.user.avatarPath)"
          :alt="authStore.user.username"
        />
        <span v-else>{{ initials }}</span>

      <div class="avatar-overlay">
        📷
      </div>
    </button>

      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="hidden-file-input"
        @change="onAvatarSelected"
      />

      <p v-if="avatarError" class="error">
        {{ avatarError }}
      </p>

      <h1>{{ t('profile.title') }}</h1>

      <div class="profile-info">
        <p>
          <strong>{{ t('profile.username') }} :</strong>
          {{ authStore.user.username }}
        </p>

        <p>
          <strong>{{ t('profile.email') }} :</strong>
          {{ authStore.user.email }}
        </p>
      </div><div class="profile-actions">
        <RouterLink :to="{ name: 'favorites' }" class="profile-action-card">
          ⭐ {{ t('profile.favorites') }}
        </RouterLink>

        <button class="profile-action-card disabled" disabled>
          💬 {{ t('profile.comments') }}
        </button>

        <button class="profile-action-card logout" type="button" @click="logout">
          {{ t('profile.logout') }}
        </button>
      </div>
    </section>

    <section v-else class="profile-card">
      <h1>{{ t('profile.notConnected') }}</h1>

      <RouterLink :to="{ name: 'login' }" class="profile-link">
        {{ t('profile.goToLogin') }}
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  min-height: calc(100vh - 72px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.profile-card {
  width: 100%;
  max-width: 520px;
  padding: 2rem;
  border-radius: 1.25rem;
  background: #0a1b44;
  text-align: center;
}

.avatar-button {
  border: none;
  cursor: pointer;
  color: white;
}

.avatar-button:hover {
  outline: 2px solid #8ab4ff;
}

.hidden-file-input {
  display: none;
}

.profile-info {
  margin-top: 1.5rem;
  text-align: left;
  display: grid;
  gap: 0.75rem;
}

.logout-button,
.profile-link {
  margin-top: 1.5rem;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  background: white;
  color: #06153a;
  border: none;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
}

.avatar {
  position: relative;

  width: 140px;
  height: 140px;

  margin: 0 auto 1rem;

  border-radius: 50%;

  overflow: hidden;

  border: 3px solid #1a3f85;

  background: linear-gradient(
    135deg,
    #132a57,
    #1d4ed8
  );

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 3rem;
  font-weight: 800;

  transition: all 0.2s ease;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar:hover {
  border-color: #60a5fa;

  box-shadow:
    0 0 0 4px rgba(96, 165, 250, 0.2);
}

.avatar-overlay {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.55);

  opacity: 0;

  font-size: 2rem;

  transition: opacity 0.2s ease;
}

.avatar:hover .avatar-overlay {
  opacity: 1;
}

.profile-action-card {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1rem;

  border-radius: 1rem;

  background: #132a57;
  color: white;

  text-decoration: none;
  font-weight: 600;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.profile-action-card:hover {
  background: #1e40af;
  transform: translateY(-2px);
}

.profile-actions {
  margin-top: 2rem;
  display: grid;
  gap: 0.75rem;
}

.profile-action-card {
  width: 100%;
  padding: 1rem;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  border: 1px solid #1a3f85;
  border-radius: 1rem;

  background: #132a57;
  color: white;

  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
}

.profile-action-card:hover:not(:disabled) {
  background: #1e3a8a;
  border-color: #3b82f6;
}

.profile-action-card:disabled,
.profile-action-card.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.profile-action-card.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>