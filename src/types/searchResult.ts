export interface SearchResult {
  id: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
}