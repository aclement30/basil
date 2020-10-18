import { AppState } from '../index'
import { Tag } from '../../typings/Tag'

export const getTags = (state: AppState): Tag[] => (state.tags.list)
export const getCurrentTag = (state: AppState): Tag | null => (state.tags.current)