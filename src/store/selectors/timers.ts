import { AppState } from '../index'
import { Timer } from '../../models/timer.model'

export const getTimers = (state: AppState): Timer[] => (state.timers)
