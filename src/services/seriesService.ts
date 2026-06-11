import type { ApiLocale } from '../types/apiLocale'

export type TrendingSeries = {
  id: number
  name: string
  originalName: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  firstAirDate: string | null
  voteAverage: number
  popularity: number
}

export type SeriesDetail = {
  id: number
  name: string
  originalName: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  firstAirDate: string | null
  voteAverage: number
  numberOfSeasons: number
  numberOfEpisodes: number
  genres: Genre[]
  creators: Person[]
  cast: CastMember[]
  watchProviders: WatchProvider[]
}

export type Genre = {
  id: number
  name: string
}

export type Person = {
  id: number
  name: string
}

export type CastMember = {
  id: number
  name: string
  character: string
  profilePath: string | null
}

export type WatchProvider = {
  id: number
  name: string
  logoPath: string | null
  type: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getTrendingSeries(locale: ApiLocale): Promise<TrendingSeries[]> {
  const params = new URLSearchParams({
    language: locale.language,
    countryCode: locale.countryCode,
  })
  const response = await fetch(`${API_BASE_URL}/api/Series/trending?${params}`)

  if (!response.ok) {
    throw new Error('Failed to fetch trending series')
  }

  return await response.json()
}

export async function getSeriesById(id: number, locale: ApiLocale): Promise<SeriesDetail> {
  const params = new URLSearchParams({
    language: locale.language,
    countryCode: locale.countryCode,
  })
  const response = await fetch(`${API_BASE_URL}/api/Series/${id}?${params}`)

  if (!response.ok) {
    throw new Error('Failed to fetch series detail')
  }

  return await response.json()
}
