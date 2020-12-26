import { History } from 'history'

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

class GoogleAuthServiceKlass {

  _history: History<any> | null = null

  init(history: History<any>) {
    if (this._history) throw new Error('GoogleAuthService history is already defined!')

    this._history = history
  }

  async authenticateUser(idToken: string): Promise<boolean> {
    try {
      const { accessToken, refreshToken } = await this.requestAccessToken(idToken)

      store.dispatch(setAccessToken(accessToken))
      store.dispatch(setRefreshToken(refreshToken))

      await this.fetchUser()

      return true
    } catch (error) {
      this.clearLocalUser()
      throw new Error(`Authentication error: ${error.message}`)
    }
  }

  requestAccessToken(idToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    return apiFetch('/access_token', {
      method: 'POST',
      body: { provider: 'google', idToken }
    })
  }

  async refreshAccessToken(token: string): Promise<boolean> {
    try {
      const { accessToken, refreshToken } = await apiFetch('/refresh_token', {
        method: 'POST',
        body: { provider: 'google', refreshToken: token }
      })

      store.dispatch(setAccessToken(accessToken))
      store.dispatch(setRefreshToken(refreshToken))

      await this.fetchUser()

      return true
    } catch (error) {
      this.clearLocalUser()
      throw new Error(`Token refresh error: ${error.message}`)
    }
  }

  async fetchUser(): Promise<User> {
    store.dispatch(startLoadingUser())
    const user: User = await apiFetch('/user')

    store.dispatch(setUser(user))
    store.dispatch(stopLoadingUser())

    return user
  }

  logoutUser() {
    this.clearLocalUser()

    this._history!.push('/login')
  }

  clearLocalUser(): void {
    store.dispatch(resetUser())
  }
}

const instance = new GoogleAuthServiceKlass()

export const GoogleAuthService = instance