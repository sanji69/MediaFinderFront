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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getTrendingMovies(language = 'fr-FR'): Promise<TrendingMovie[]> {
  const response = await fetch(`${API_BASE_URL}/api/Movies/trending?language=${language}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies`)
  }

  return await response.json()
}
