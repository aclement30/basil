import { Action } from 'redux'

import { Timer } from '../../models/timer.model'

export interface ActionWithTimer extends Action {
  timers?: Timer[]
  timer?: Timer
}

export const SET_TIMERS = 'SET_TIMERS';
export const ADD_TIMER = 'ADD_TIMER';
export const START_TIMER = 'START_TIMER';
export const UPDATE_TIMER = 'UPDATE_TIMER';
export const COMPLETE_TIMER = 'COMPLETE_TIMER';
export const REMOVE_TIMER = 'REMOVE_TIMER';

export const setTimers = (timers: Timer[]): ActionWithTimer => ({
  type: SET_TIMERS,
  timers
})

export const addTimer = (timer: Timer): ActionWithTimer => ({
  type: ADD_TIMER,
  timer
})

export const startTimer = (timer: Timer): ActionWithTimer => ({
  type: START_TIMER,
  timer
})

export const updateTimer = (timer: Timer): ActionWithTimer => ({
  type: UPDATE_TIMER,
  timer
})

export const completeTimer = (timer: Timer): ActionWithTimer => ({
  type: COMPLETE_TIMER,
  timer
})

export const removeTimer = (timer: Timer): ActionWithTimer => ({
  type: REMOVE_TIMER,
  timer
})
