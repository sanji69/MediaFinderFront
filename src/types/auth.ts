export interface UserProfile {
  id: string
  username: string
  email: string
  avatarPath: string | null
  isEmailConfirmed: boolean
}

export interface AuthResponse {
  token: string
  user: UserProfile
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}