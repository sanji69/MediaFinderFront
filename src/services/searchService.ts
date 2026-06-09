import type { SearchResult } from '@/types/searchResult'
import type { ApiLocale } from './apiLocale'

const API_BASE_URL = 'http://localhost:5174/api'

export async function searchMulti(
  query: string,
  locale: ApiLocale
): Promise<SearchResult[]> {
  const params = new URLSearchParams({
    query,
    language: locale.language,
  })

  const response = await fetch(
    `${API_BASE_URL}/search/multi?${params}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch search results')
  }

  return await response.json()
}

export async function searchByPerson(
  personId: number,
  role: string,
  locale: ApiLocale
): Promise<SearchResult[]> {
  const response = await fetch(
    `${API_BASE_URL}/search/person/${personId}?role=${role}&language=${locale.language}&countryCode=${locale.countryCode}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch person search results')
  }

  return await response.json()
}

export async function searchByGenre(
  genreId: number,
  sourceMediaType: string,
  locale: ApiLocale
): Promise<SearchResult[]> {

  const params = new URLSearchParams({
    sourceMediaType,
    language: locale.language,
  })

  const response = await fetch(
    `${API_BASE_URL}/search/genre/${genreId}?${params}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch genre search results')
  }

  return await response.json()
}