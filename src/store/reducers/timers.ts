import { Timer } from '../../models/timer.model'
import {
  ActionWithTimer,
  ADD_TIMER,
  COMPLETE_TIMER,
  REMOVE_TIMER,
  SET_TIMERS,
  START_TIMER,
  UPDATE_TIMER
} from '../actions/timers'

export type TimersState = Timer[]

export const initialState: TimersState = []

export default function (state: Timer[] = initialState, action: ActionWithTimer): Timer[] {
  switch (action.type) {
    case SET_TIMERS:
      return action.timers!.slice()

    case ADD_TIMER:
      return [
        ...state,
        action.timer!,
      ]

    case START_TIMER:
    case COMPLETE_TIMER:
    case UPDATE_TIMER: {
      const INDEX = state.findIndex(existingTimer => (existingTimer.id === action.timer!.id))
      return state.slice().splice(INDEX, 1, action.timer!)
    }

    case REMOVE_TIMER:
      return state.filter(existingTimer => (existingTimer.id === action.timer!.id))

    default:
      return state
  }
}
