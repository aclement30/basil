import store from '../store'
import { getCurrentUser } from '../store/selectors/session'

export function isAuthenticated(): boolean {
  return !!getCurrentUser(store.getState())
}