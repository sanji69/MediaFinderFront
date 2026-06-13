<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

async function submitLogin() {
  try {
    isLoading.value = true
    error.value = null

    await authStore.login({
      email: email.value,
      password: password.value,
    })

    router.push({ name: 'profile' })
  } catch (err) {
    console.error(err)
    error.value = 'Email ou mot de passe incorrect.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Connexion</h1>

      <form @submit.prevent="submitLogin" class="auth-form">
        <label>
          {{ t('auth.login.email') }}
          <input v-model="email" type="email" required />
        </label>

        <label>
          {{ t('auth.login.password') }}
          <input v-model="password" type="password" required />
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="isLoading">        
          {{
            isLoading
              ? t('auth.login.loading')
              : t('auth.login.submit')
          }}
        </button>
      </form>

      <p class="auth-link">
        {{ t('auth.login.noAccount') }}
        <RouterLink :to="{ name: 'register' }">
          {{ t('auth.login.createAccount') }}
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

.auth-link {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-link a {
  color: #8ab4ff;
  font-weight: 600;
}
</style>