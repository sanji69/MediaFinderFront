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
    const error = await response.json().catch(() => null)

    if (error?.code === 'EMAIL_ALREADY_EXISTS') {
      throw new Error('auth.register.emailAlreadyExists')
    }

    if (error?.code === 'USERNAME_ALREADY_EXISTS') {
      throw new Error('auth.register.usernameAlreadyExists')
    }

    throw new Error('auth.register.error')
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
    const error = await response.json().catch(() => null)

    if (error?.code === 'ACCOUNT_BANNED') {
      throw new Error('auth.login.accountBanned')
    }

    if (error?.code === 'ACCOUNT_DELETED') {
      throw new Error('auth.login.accountDeleted')
    }

    if (error?.code === 'EMAIL_NOT_CONFIRMED') {
      throw new Error('auth.login.emailNotConfirmed')
    }

    throw new Error('auth.login.invalidCredentials')
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

export async function deleteCurrentUser(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => null)

    if (error?.code === 'INVALID_CONFIRMATION_TOKEN') {
      throw new Error('auth.confirmEmail.invalidToken')
    }

    if (error?.code === 'CONFIRMATION_TOKEN_EXPIRED') {
      throw new Error('auth.confirmEmail.expiredToken')
    }

    throw new Error('auth.confirmEmail.error')
  }
}

export async function forgotPassword(
  email: string,
  locale: ApiLocale
): Promise<void> {
  const params = new URLSearchParams({
    language: locale.language,
  })

  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    throw new Error('auth.forgotPassword.error')
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      newPassword,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)

    if (error?.code === 'INVALID_RESET_TOKEN') {
      throw new Error('auth.resetPassword.invalidToken')
    }

    if (error?.code === 'RESET_TOKEN_EXPIRED') {
      throw new Error('auth.resetPassword.expiredToken')
    }

    throw new Error('auth.resetPassword.error')
  }
}

