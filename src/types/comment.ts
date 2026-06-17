export interface Comment {
  id: string
  userId: string
  username: string
  userAvatarPath?: string | null
  mediaId: number
  mediaType: 'movie' | 'tv'
  mediaTitle: string
  mediaPosterPath?: string | null
  content: string
  status: number
  createdAt: string
  updatedAt: string
  hasCurrentUserReported: boolean
}

export interface CreateCommentRequest {
  mediaId: number
  mediaType: 'movie' | 'tv'
  mediaTitle: string
  mediaPosterPath?: string | null
  content: string
}

export interface CreateCommentReportRequest {
  reason: string
}