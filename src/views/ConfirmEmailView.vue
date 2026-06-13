<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { confirmEmail } from '@/services/authService'

const { t } = useI18n()
const route = useRoute()

const isLoading = ref(true)
const isSuccess = ref(false)

onMounted(async () => {
  const token = route.query.token?.toString()

  if (!token) {
    isLoading.value = false
    isSuccess.value = false
    return
  }

  try {
    await confirmEmail(token)
    isSuccess.value = true
  } catch (err) {
    console.error(err)
    isSuccess.value = false
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <template v-if="isLoading">
        <h1>{{ t('auth.confirmEmail.title') }}</h1>
        <p class="auth-message">
          {{ t('auth.confirmEmail.loading') }}
        </p>
      </template>

      <template v-else-if="isSuccess">
        <h1>{{ t('auth.confirmEmail.successTitle') }}</h1>
        <p class="auth-message">
          {{ t('auth.confirmEmail.successMessage') }}
        </p>

        <RouterLink :to="{ name: 'login' }" class="auth-button">
          {{ t('auth.confirmEmail.goToLogin') }}
        </RouterLink>
      </template>

      <template v-else>
        <h1>{{ t('auth.confirmEmail.errorTitle') }}</h1>
        <p class="auth-message error">
          {{ t('auth.confirmEmail.errorMessage') }}
        </p>

        <RouterLink :to="{ name: 'login' }" class="auth-button">
          {{ t('auth.confirmEmail.goToLogin') }}
        </RouterLink>
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
  text-align: center;
}

.auth-card h1 {
  margin-bottom: 1rem;
}

.auth-message {
  line-height: 1.5;
}

.auth-button {
  margin-top: 1.5rem;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  background: white;
  color: #06153a;
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
}

.error {
  color: #ff8a8a;
}
</style>