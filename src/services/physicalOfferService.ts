import type { ApiLocale } from '../types/apiLocale'
import type { PhysicalOffer } from '@/types/physicalOffer'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getPhysicalOffers(
  title: string,
  mediaType: 'movie' | 'tv',
  locale: ApiLocale,
  seasonNumber?: number
): Promise<PhysicalOffer[]> {
  const params = new URLSearchParams({
    title,
    mediaType,
    language: locale.language,
    countryCode: locale.countryCode,
  })

  if (seasonNumber) {
    params.append('seasonNumber', seasonNumber.toString())
  }

  const response = await fetch(`${API_BASE_URL}/api/physical-offers?${params}`)

  if (!response.ok) {
    throw new Error('Failed to fetch physical offers')
  }

  return await response.json()
}