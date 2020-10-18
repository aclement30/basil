import { Tag } from '../typings/Tag'
import { apiFetch } from '../utils/apiFetch'
import i18n from '../i18n'
import store from '../store'
import { setTags } from '../store/actions/tags'

const PATH = '/tags'

export const TagService = {
  query: async function (): Promise<Tag[]> {
    const language = i18n.language

    const tags: Tag[] = await apiFetch(PATH, { params: { lang: language } })

    store.dispatch(setTags(tags))

    return tags
  },
}
