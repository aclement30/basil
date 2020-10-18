export interface UserProfile {
  id: string
  name: string
}

export interface User extends UserProfile {
  id: string
  name: string
  email: string
  accessToken: string
  refreshToken: string
}
