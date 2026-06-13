import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as loginApi } from '@/services/authService'
import type { LoginRequest, UserProfile } from '@/types/auth'

const TOKEN_STORAGE_KEY = 'mediafinder_token'
const USER_STORAGE_KEY = 'mediafinder_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))

  const storedUser = localStorage.getItem(USER_STORAGE_KEY)

  const user = ref<UserProfile | null>(
    storedUser ? JSON.parse(storedUser) : null
  )

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(payload: LoginRequest) {
    const response = await loginApi(payload)

    token.value = response.token
    user.value = response.user

    localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user))
  }

  function logout() {
    token.value = null
    user.value = null

    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  function updateUser(updatedUser: UserProfile) {
    user.value = updatedUser
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }
})