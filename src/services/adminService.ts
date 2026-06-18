import type {
  AdminCommentReport,
  AdminUser,
  UpdateUserRoleRequest,
} from '@/types/admin'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getAdminReports(token: string): Promise<AdminCommentReport[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('admin.reportsLoadError')
  }

  return await response.json()
}

export async function acceptReport(
  reportId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/reports/${reportId}/accept`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('admin.acceptReportError')
  }
}

export async function rejectReport(
  reportId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/reports/${reportId}/reject`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('admin.rejectReportError')
  }
}

export async function getAdminUsers(token: string): Promise<AdminUser[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('admin.usersLoadError')
  }

  return await response.json()
}

export async function banUser(
  userId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/ban`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('admin.banUserError')
  }
}

export async function unbanUser(
  userId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/unban`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('admin.unbanUserError')
  }
}

export async function resetUserWarnings(
  userId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/reset-warnings`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('admin.resetWarningsError')
  }
}

export async function updateUserRole(
  userId: string,
  payload: UpdateUserRoleRequest,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('admin.updateRoleError')
  }
}