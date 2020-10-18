import { Action } from 'redux'

import { User } from '../../typings/User'

export const SET_USER = 'SET_USER'
export const RESET_USER = 'RESET_USER'
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN'
export const START_LOADING = 'START_LOADING'
export const STOP_LOADING = 'STOP_LOADING'

export interface ActionWithUser extends Action {
  user?: User
  accessToken?: string
  refreshToken?: string
}

export const setUser = (user: User): ActionWithUser => ({
  type: SET_USER,
  user
})

export const resetUser = (): ActionWithUser => ({
  type: RESET_USER,
})

export const setAccessToken = (accessToken: string): ActionWithUser => ({
  type: SET_ACCESS_TOKEN,
  accessToken,
})

export const setRefreshToken = (refreshToken: string): ActionWithUser => ({
  type: SET_REFRESH_TOKEN,
  refreshToken,
})

export const startLoadingUser = (): ActionWithUser => ({
  type: START_LOADING,
})

export const stopLoadingUser = (): ActionWithUser => ({
  type: STOP_LOADING,
})