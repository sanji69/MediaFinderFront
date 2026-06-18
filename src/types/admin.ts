export type UserRole = 1 | 2 | 3
export type AccountStatus = 1 | 2 | 3
export type ReportStatus = 1 | 2 | 3

export interface AdminUser {
  id: string
  username: string
  email: string
  avatarPath?: string | null
  role: UserRole
  accountStatus: AccountStatus
  warningCount: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  bannedAt?: string | null
}

export interface AdminCommentReport {
  id: string

  commentId: string
  commentContent: string
  commentAuthorUsername: string
  commentAuthorUserId: string
  commentAuthorRole: UserRole
  commentAuthorWarningCount: number

  reporterUserId: string
  reporterUsername: string

  reason: string
  status: ReportStatus

  mediaId: number
  mediaType: 'movie' | 'tv'
  mediaTitle: string

  createdAt: string
  reviewedAt?: string | null
  reviewedByUserId?: string | null
}

export interface UpdateUserRoleRequest {
  role: UserRole
}