import type { ApiLocale } from './apiLocale'

export type TrendingMovie = {
  id: number
  title: string
  originalTitle: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string | null
  voteAverage: number
  popularity: number
}

export type MovieDetail = {
  id: number
  title: string
  originalTitle: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string | null
  voteAverage: number
  popularity: number
  runtime: number | null

  genres: Genre[]
  directors: Person[]
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

export async function getTrendingMovies(locale: ApiLocale): Promise<TrendingMovie[]> {
  const params = new URLSearchParams({
    language: locale.language,
    countryCode: locale.countryCode,
  })
  const response = await fetch(`${API_BASE_URL}/api/Movies/trending?${params}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies`)
  }

  return await response.json()
}

export async function getMovieById(id: number, locale: ApiLocale): Promise<MovieDetail> {
  const params = new URLSearchParams({
    language: locale.language,
    countryCode: locale.countryCode,
  })
  const response = await fetch(`${API_BASE_URL}/api/Movies/${id}?${params}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch movie detail for ID ${id}`)
  }

  return await response.json()
}
