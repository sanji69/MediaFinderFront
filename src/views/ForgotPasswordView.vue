<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { forgotPassword } from '@/services/authService'

const { t, locale } = useI18n()

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

async function submitForgotPassword() {
  try {
    isLoading.value = true
    error.value = null
    success.value = false

    await forgotPassword(email.value, {
    language: locale.value,
    countryCode: locale.value.startsWith('fr') ? 'FR' : 'US',
    })

    success.value = true
    email.value = ''

    setTimeout(() => {
    router.push({ name: 'login' })
    }, 5000)
  } catch (err) {
    error.value =
      err instanceof Error
        ? t(err.message)
        : t('auth.forgotPassword.error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>{{ t('auth.forgotPassword.title') }}</h1>

      <p class="auth-description">
        {{ t('auth.forgotPassword.description') }}
      </p>

      <form class="auth-form" @submit.prevent="submitForgotPassword">
        <label>
          {{ t('auth.forgotPassword.email') }}
          <input v-model="email" type="email" required :disabled="success" />
        </label>

        <p v-if="success" class="success">
          {{ t('auth.forgotPassword.success') }}
        </p>

        <p v-if="success" class="redirect-message">
        {{ t('auth.forgotPassword.redirecting') }}
        </p>
        
        <p v-if="error" class="error">
          {{ error }}
        </p>

        <button type="submit" :disabled="isLoading || success">
          {{
            isLoading
              ? t('auth.forgotPassword.loading')
              : t('auth.forgotPassword.submit')
          }}
        </button>
      </form>

      <p class="auth-link">
        <RouterLink :to="{ name: 'login' }">
          {{ t('auth.forgotPassword.backToLogin') }}
        </RouterLink>
      </p>
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
  max-width: 420px;
  padding: 2rem;
  border-radius: 1.25rem;
  background: #0a1b44;
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.auth-description {
  color: #94a3b8;
  text-align: center;
  line-height: 1.5;
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

.auth-form button {
  margin-top: 0.5rem;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 999px;
  background: #ffffff;
  color: #06153a;
  font-weight: 700;
  cursor: pointer;
}

.auth-form button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.error {
  color: #ff8a8a;
  font-size: 0.9rem;
}

.success {
  color: #86efac;
  font-size: 0.9rem;
}

.auth-link {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-link a {
  color: #8ab4ff;
  font-weight: 600;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>