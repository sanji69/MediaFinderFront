import type { UserProfile } from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function uploadProfileAvatar(
  file: File,
  token: string
): Promise<UserProfile> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/profile/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload profile avatar')
  }

  return await response.json()
}