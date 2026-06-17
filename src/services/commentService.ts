import type {
  Comment,
  CreateCommentRequest,
  CreateCommentReportRequest,
} from '@/types/comment'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getComments(
  mediaType: 'movie' | 'tv',
  mediaId: number,
  token?: string | null
): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/api/comments/${mediaType}/${mediaId}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  })

  if (!response.ok) {
    throw new Error('Failed to fetch comments')
  }

  return await response.json()
}

export async function getMyComments(token: string): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/api/comments/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch my comments')
  }

  return await response.json()
}

export async function createComment(
  payload: CreateCommentRequest,
  token: string
): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to create comment')
  }

  return await response.json()
}

export async function deleteComment(
  commentId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete comment')
  }
}

export async function reportComment(
  commentId: string,
  payload: CreateCommentReportRequest,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

    if (!response.ok) {
        const error = await response.json().catch(() => null)

        if (error?.code === 'COMMENT_ALREADY_REPORTED') {
            throw new Error('comments.alreadyReported')
        }

        throw new Error('comments.reportError')
    }
}