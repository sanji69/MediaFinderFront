<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const { t, locale } = useI18n()
const router = useRouter()
const isLanguageMenuOpen = ref(false)

const authStore = useAuthStore()
const isUserMenuOpen = ref(false)

const userInitials = computed(() => {
  return authStore.user?.username.slice(0, 2).toUpperCase() ?? '?'
})
const searchText = ref('')
let searchTimeout: number | undefined

type LangCode = 'fr' | 'en'
type Language = { code: LangCode; flag: string }

const languages: Language[] = [
  { code: 'fr', flag: 'fr' },
  { code: 'en', flag: 'us' },
]

const currentLanguage = computed<Language>(() => {
  return languages.find((lang) => lang.code === locale.value)!
})

function changeLanguage(languageCode: LangCode) {
  locale.value = languageCode
  isLanguageMenuOpen.value = false
}

watch(searchText, (value) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  const query = value.trim()

  if (query.length < 2) {
    return
  }

  searchTimeout = window.setTimeout(() => {
    router.push({
      name: 'search-results',
      query: {
        type: 'multi',
        query,
        label: query,
      },
    })
  }, 300)
})

function logout() {
  authStore.logout()

  isUserMenuOpen.value = false

  router.push({
    name: 'login',
  })
}

function resolveAvatarUrl(path: string | null) {
  if (!path) return undefined

  if (path.startsWith('http')) return path

  return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${path}`
}

</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="site-name"> MediaFinder </RouterLink>
    <div class="search-wrapper">
      <input type="text" v-model="searchText" :placeholder="t('header.searchPlaceholder')" class="search-input" />
    </div>
    <div class="header-actions">
      <RouterLink
        v-if="!authStore.isAuthenticated"
        :to="{ name: 'login' }"
        class="login-button"
      >
        {{ t('header.login') }}
      </RouterLink>

      <div v-else class="user-menu-wrapper">
        <button
          class="user-avatar-button"
          type="button"
          @click="isUserMenuOpen = !isUserMenuOpen"
        >
          <img
            v-if="authStore.user?.avatarPath"
            :src="resolveAvatarUrl(authStore.user.avatarPath)"
            :alt="authStore.user.username"
          />
          <span v-else>{{ userInitials }}</span>
        </button>

        <div v-if="isUserMenuOpen" class="user-menu">
          <RouterLink :to="{ name: 'profile' }" class="user-menu-item">
            {{ t('header.profile') }}
          </RouterLink>

          <RouterLink :to="{ name: 'favorites' }" class="user-menu-item">
            {{ t('header.favorites') }}
          </RouterLink>
          <RouterLink
            v-if="authStore.user?.role === 2 || authStore.user?.role === 3"
            :to="{ name: 'admin' }"
            class="user-menu-link"
          >
           {{ t('admin.nav') }}
          </RouterLink>
          <button
            class="user-menu-item"
            @click="logout"
          >
            {{ t('header.logout') }}
          </button>
        </div>
      </div>

      <div class="language-selector">
        <button
          class="language-button"
          type="button"
          @click="isLanguageMenuOpen = !isLanguageMenuOpen"
        >
          <span :class="`fi fi-${currentLanguage.flag}`"></span>
        </button>

        <div v-if="isLanguageMenuOpen" class="language-menu">
          <button
            v-for="language in languages"
            :key="language.code"
            type="button"
            class="language-option"
            @click="changeLanguage(language.code)"
          >
            <span :class="`fi fi-${language.flag}`"></span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: 72px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #111;
  border-bottom: 1px solid #2a2a2a;
}

.site-name {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.search-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 520px;
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  border: 1px solid #333;
  background: #1c1c1c;
  color: #fff;
}

.search-input::placeholder {
  color: #777;
}

.login-button {
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  border: none;
  background: #ffffff;
  color: #111;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
}

.login-button:hover {
  transform: scale(1.03);
}

.language-selector {
  position: relative;
}

.language-menu {
  position: absolute;
  top: 56px;
  right: 0;
  z-index: 100;

  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  padding: 0.35rem;
  border-radius: 12px;
  background: #1f2937;
  border: 1px solid #334155;
}

.language-button {
  width: 48px;
  height: 48px;

  padding: 0;
  overflow: hidden;

  border: none;
  border-radius: 50%;

  cursor: pointer;
}

.language-button .fi {
  display: block;

  width: 100%;
  height: 100%;

  background-size: cover;
  background-position: center;

  border-radius: 50%;
}

.language-option {
  width: 48px;
  height: 48px;

  padding: 0;
  overflow: hidden;

  border: none;
  border-radius: 50%;

  background: transparent;
  cursor: pointer;
}

.language-option .fi {
  display: block;

  width: 100%;
  height: 100%;

  background-size: cover;
  background-position: center;

  border-radius: 50%;
}

.language-option:hover {
  transform: scale(1.05);
}

.language-button .fi,
.language-option .fi {
  display: block;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

.header-actions {
  width: 220px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.site-name {
  width: 220px;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;

  height: 72px;
  padding: 0 2rem;

  display: flex;
  align-items: center;
  gap: 2rem;

  background: #111;
  border-bottom: 1px solid #2a2a2a;
}

.user-menu-wrapper {
  position: relative;
}

.user-avatar-button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: #132a57;
  color: white;
  font-weight: 800;
  cursor: pointer;
  overflow: hidden;
}

.user-avatar-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-menu {
  position: absolute;
  top: 56px;
  right: 0;
  z-index: 100;
  min-width: 150px;
  padding: 0.4rem;
  border-radius: 12px;
  background: #1f2937;
  border: 1px solid #334155;
}

.user-menu-item {
  width: 100%;
  display: block;
  padding: 0.65rem 0.8rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: white;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.user-menu-item:hover:not(:disabled) {
  background: #334155;
}

.user-menu-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.user-menu-link {
  display: block;
  padding: 0.5rem 0.75rem;

  color: white;
  text-decoration: none;

  border-radius: 0.5rem;
}

.user-menu-link:hover {
  background: #132a57;
}
</style>

<!-- removed duplicate script block -->
