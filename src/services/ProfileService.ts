import { apiFetch } from '../utils/apiFetch'
import { UserProfile } from '../typings/User'

const PATH = '/profile'

export const ProfileService = {
  get: async function (userId: string): Promise<UserProfile> {
    const path = `${PATH}/${userId}`

    const userProfile: UserProfile = await apiFetch(path)

    return userProfile
  },
}