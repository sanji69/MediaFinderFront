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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getTrendingSeries(language = 'fr-FR'): Promise<TrendingSeries[]> {
  const response = await fetch(`${API_BASE_URL}/api/Series/trending?language=${language}`)

  if (!response.ok) {
    throw new Error('Failed to fetch trending series')
  }

  return await response.json()
}
