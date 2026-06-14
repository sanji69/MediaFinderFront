export interface RatingSummary {
  mediaId: number
  mediaType: 'movie' | 'tv'
  averageScore: number
  voteCount: number
  currentUserScore: number | null
}

export interface UpsertRatingRequest {
  mediaId: number
  mediaType: 'movie' | 'tv'
  score: number
}