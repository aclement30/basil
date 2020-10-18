import { apiFetch } from '../utils/apiFetch'
import {
  resetUser,
  setAccessToken,
  setRefreshToken,
  setUser,
  startLoadingUser,
  stopLoadingUser
} from '../store/actions/session'
import store from '../store'
import { User } from '../typings/User'

export const GoogleAuthService = {

  authenticateUser: async function (idToken: string): Promise<boolean> {
    try {
      const { accessToken, refreshToken } = await GoogleAuthService.requestAccessToken(idToken)

      store.dispatch(setAccessToken(accessToken))
      store.dispatch(setRefreshToken(refreshToken))

      await GoogleAuthService.fetchUser()

      return true
    } catch (error) {
      GoogleAuthService.clearLocalUser()
      throw new Error(`Authentication error: ${error.message}`)
    }
  },

  requestAccessToken: function (idToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    return apiFetch('/access_token', {
      method: 'POST',
      body: { provider: 'google', idToken }
    })
  },

  refreshAccessToken: async function (token: string): Promise<boolean> {
    try {
      const { accessToken, refreshToken } = await apiFetch('/refresh_token', {
        method: 'POST',
        body: { provider: 'google', refreshToken: token }
      })

      store.dispatch(setAccessToken(accessToken))
      store.dispatch(setRefreshToken(refreshToken))

      await GoogleAuthService.fetchUser()

      return true
    } catch (error) {
      GoogleAuthService.clearLocalUser()
      throw new Error(`Token refresh error: ${error.message}`)
    }
  },

  fetchUser: async function (): Promise<User> {
    store.dispatch(startLoadingUser())
    const user: User = await apiFetch('/user')

    store.dispatch(setUser(user))
    store.dispatch(stopLoadingUser())

    return user
  },

  logoutUser: function () {
    GoogleAuthService.clearLocalUser()
  },

  clearLocalUser: function (): void {
    store.dispatch(resetUser())
  },
}
