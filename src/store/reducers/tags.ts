import { ActionWithTag, RESET_CURRENT_TAG, SET_CURRENT_TAG, SET_TAGS } from '../actions/tags'
import { Tag } from '../../typings/Tag'
import { sortByText } from '../../utils/sortByTitle'

export interface TagsState {
  list: Tag[]
  current: Tag | null
}

export const initialState: TagsState = {
  list: [],
  current: null,
}

export default function(state: TagsState = initialState, action: ActionWithTag): TagsState {
  switch (action.type) {
    case SET_TAGS:
      return {
        ...state,
        list: action.tags!.slice().sort(sortByText('name')),
      };

    case SET_CURRENT_TAG: {
      return {
        ...state,
        current: action.tag!,
      };
    }

    case RESET_CURRENT_TAG:
      return {
        ...state,
        current: null,
      };

    default:
      return state;
  }
}
