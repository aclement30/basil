import { getAccessToken, getRefreshToken } from '../store/selectors/session'
import store from '../store'
import { GoogleAuthService } from '../services/GoogleAuthService'

let tokenRefreshPromise: Promise<any>

export async function apiFetch(path: string, options: any = {}) {
  if (options.body) {
    options.body = JSON.stringify(options.body)
  }

  const url = new URL(path, process.env.REACT_APP_API_ENDPOINT)

  if (options.params) {
    Object.keys(options.params).forEach(key => {
      url.searchParams.append(key, options.params[key])
    })
  }

  options.headers = {
    ...options.headers,
    'content-type': 'application/json',
  }

  const accessToken = getAccessToken(store.getState())
  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(url.toString(), options)

  if (response.status >= 300) {
    switch (response.status) {
      case 400: {
        const json = await response.json()
        throw new Error(json.error || response.statusText)
      }
      case 401: {
        const refreshToken = getRefreshToken(store.getState())

        if (!refreshToken) throw new Error(response.statusText)

        if (!tokenRefreshPromise) {
          tokenRefreshPromise = GoogleAuthService.refreshAccessToken(refreshToken)
        }

        return tokenRefreshPromise.then((refreshed: boolean) => {
          if (!refreshed) throw new Error(response.statusText)

          return apiFetch(path, options)
        })
      }
      default:
        throw new Error(response.statusText)
    }
  }

  if (response.status === 204) return

  return await response.json()
}