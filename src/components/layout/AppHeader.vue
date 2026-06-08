<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const isLanguageMenuOpen = ref(false)

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
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="site-name"> MediaFinder </RouterLink>
    <div class="search-wrapper">
      <input type="text" :placeholder="t('header.searchPlaceholder')" class="search-input" />
    </div>
    <div class="header-actions">
      <button class="login-button" disabled>{{ t('header.login') }}</button>

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
  cursor: not-allowed;
  opacity: 0.7;
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

</style>

<!-- removed duplicate script block -->
