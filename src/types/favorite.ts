export interface Favorite {
  id: string
  mediaId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  createdAt: string
}

export interface FavoriteStatus {
  mediaId: number
  mediaType: 'movie' | 'tv'
  isFavorite: boolean
}

export interface AddFavoriteRequest {
  mediaId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
}