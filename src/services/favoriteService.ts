import type { AddFavoriteRequest, Favorite, FavoriteStatus } from '@/types/favorite'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getFavorites(token: string): Promise<Favorite[]> {
  const response = await fetch(`${API_BASE_URL}/api/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch favorites')
  }

  return await response.json()
}

export async function getFavoriteStatus(
  mediaType: 'movie' | 'tv',
  mediaId: number,
  token: string
): Promise<FavoriteStatus> {
  const response = await fetch(`${API_BASE_URL}/api/favorites/status/${mediaType}/${mediaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch favorite status')
  }

  return await response.json()
}

export async function addFavorite(
  payload: AddFavoriteRequest,
  token: string
): Promise<FavoriteStatus> {
  const response = await fetch(`${API_BASE_URL}/api/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to add favorite')
  }

  return await response.json()
}

export async function removeFavorite(
  mediaType: 'movie' | 'tv',
  mediaId: number,
  token: string
): Promise<FavoriteStatus> {
  const response = await fetch(`${API_BASE_URL}/api/favorites/${mediaType}/${mediaId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to remove favorite')
  }

  return await response.json()
}