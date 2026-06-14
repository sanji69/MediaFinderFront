import type { RatingSummary, UpsertRatingRequest } from '@/types/rating'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getRatingSummary(
  mediaType: 'movie' | 'tv',
  mediaId: number,
  token?: string | null
): Promise<RatingSummary> {
  const headers: HeadersInit = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/ratings/${mediaType}/${mediaId}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch rating summary')
  }

  return await response.json()
}

export async function upsertRating(
  payload: UpsertRatingRequest,
  token: string
): Promise<RatingSummary> {
  const response = await fetch(`${API_BASE_URL}/api/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to save rating')
  }

  return await response.json()
}