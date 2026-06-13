import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'
import type { ApiLocale } from '@/types/apiLocale'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function register(
  payload: RegisterRequest,
  locale: ApiLocale
): Promise<void> {
  const params = new URLSearchParams({
    language: locale.language,
  })

  const response = await fetch(`${API_BASE_URL}/api/auth/register?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to register')
  }
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to login')
  }

  return await response.json()
}

export async function confirmEmail(token: string): Promise<void> {
  const params = new URLSearchParams({ token })

  const response = await fetch(`${API_BASE_URL}/api/auth/confirm-email?${params}`)

  if (!response.ok) {
    throw new Error('Failed to confirm email')
  }
}