import { createSelector } from 'reselect'

import { SessionState } from '../reducers/session'
import { AppState } from '../index'
import { User } from '../../typings/User'

export const getSessionState = (state: AppState): SessionState => (state.session)
export const getCurrentUser = createSelector(getSessionState, (state: SessionState): User | null => (state.user))
export const getAccessToken = createSelector(getSessionState, (state: SessionState): string | null => (state.accessToken))
export const getRefreshToken = createSelector(getSessionState, (state: SessionState): string | null => (state.refreshToken))
