import {
  ActionWithUser,
  RESET_USER,
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN,
  SET_USER,
  START_LOADING,
  STOP_LOADING
} from '../actions/session'
import { User } from '../../typings/User'

export interface SessionState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
}

const initialState: SessionState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
}

export default function(state: SessionState = initialState, action: ActionWithUser): SessionState {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user!,
      }
    case RESET_USER:
      return initialState
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken || null
      }
    case SET_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: action.refreshToken || null
      }
    case START_LOADING:
      return {
        ...state,
        loading: true,
      }
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}