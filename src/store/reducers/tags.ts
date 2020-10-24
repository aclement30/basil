import { ActionWithTag, RESET_CURRENT_TAG, SET_CURRENT_TAG, SET_TAGS } from '../actions/tags'
import { Tag } from '../../typings/Tag'
import { sortByText } from '../../utils/sortByTitle'
import i18n from '../../i18n'

export interface TagsState {
  list: Tag[]
  current: Tag | null
}

export const initialState: TagsState = {
  list: [],
  current: null,
}

export default function(state: TagsState = initialState, action: ActionWithTag): TagsState {
  const language = i18n.language

  switch (action.type) {
    case SET_TAGS:
      return {
        ...state,
        list: action.tags!
          .map(tag => ({
            ...tag, name: tag[`name_${language}`],
          }))
          .sort(sortByText('name')),
      }

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
