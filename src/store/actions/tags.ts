import { Action } from 'redux'

import { Tag } from '../../typings/Tag'

export interface ActionWithTag extends Action {
  tags?: Tag[]
  tag?: Tag | null
}

export const SET_TAGS = 'SET_TAGS'
export const SET_CURRENT_TAG = 'SET_CURRENT_TAG'
export const RESET_CURRENT_TAG = 'RESET_CURRENT_TAG'

export const setTags = (tags: Tag[]): ActionWithTag => ({
  type: SET_TAGS,
  tags
})

export const setCurrentTag = (tag: Tag | null): ActionWithTag => ({
  type: SET_CURRENT_TAG,
  tag
})

export const resetCurrentTag = (): ActionWithTag => ({
  type: RESET_CURRENT_TAG,
})