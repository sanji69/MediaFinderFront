<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { register } from '@/services/authService'

const { t, locale } = useI18n()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const isCreated = ref(false)

const apiLocale = computed(() => ({
  language: locale.value === 'fr' ? 'fr-FR' : 'en-US',
  countryCode: locale.value === 'fr' ? 'FR' : 'US',
}))

async function submitRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = t('auth.register.passwordMismatch')
    return
  }

  try {
    isLoading.value = true
    error.value = null

    await register(
      {
        username: username.value,
        email: email.value,
        password: password.value,
      },
      apiLocale.value
    )

    isCreated.value = true
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('auth.register.error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <template v-if="isCreated">
        <h1>{{ t('auth.register.successTitle') }}</h1>

        <p class="success-message">
          {{ t('auth.register.successMessage') }}
        </p>

        <RouterLink :to="{ name: 'login' }" class="auth-button">
          {{ t('auth.register.goToLogin') }}
        </RouterLink>
      </template>

      <template v-else>
        <h1>{{ t('auth.register.title') }}</h1>

        <form @submit.prevent="submitRegister" class="auth-form">
          <label>
            {{ t('auth.register.username') }}
            <input v-model="username" type="text" required />
          </label>

          <label>
            {{ t('auth.register.email') }}
            <input v-model="email" type="email" required />
          </label>

          <label>
            {{ t('auth.register.password') }}
            <input v-model="password" type="password" required />
          </label>

          <label>
            {{ t('auth.register.confirmPassword') }}
            <input v-model="confirmPassword" type="password" required />
          </label>

          <p v-if="error" class="error">{{ error }}</p>

          <button type="submit" :disabled="isLoading">
            {{ isLoading ? t('auth.register.loading') : t('auth.register.submit') }}
          </button>
        </form>

        <p class="auth-link">
          {{ t('auth.register.alreadyAccount') }}
          <RouterLink :to="{ name: 'login' }">
            {{ t('auth.register.login') }}
          </RouterLink>
        </p>
      </template>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 72px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.auth-card {
  width: 100%;
  max-width: 460px;
  padding: 2rem;
  border-radius: 1.25rem;
  background: #0a1b44;
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.auth-form input {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #1a3f85;
  background: #06153a;
  color: white;
}

.auth-form button,
.auth-button {
  margin-top: 0.5rem;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 999px;
  background: white;
  color: #06153a;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  display: block;
}

.auth-form button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.error {
  color: #ff8a8a;
  font-size: 0.9rem;
}

.success-message {
  text-align: center;
  line-height: 1.5;
}

.auth-link {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-link a {
  color: #8ab4ff;
  font-weight: 600;
}
</style>