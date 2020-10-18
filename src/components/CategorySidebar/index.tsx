import React from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import './index.scss'

import { getCurrentTag, getTags } from '../../store/selectors/tags'
import { AppDispatch, AppState } from '../../store'
import { Tag } from '../../typings/Tag'
import { setCurrentTag } from '../../store/actions/tags'

const mapState = (state: AppState) => ({
  selectedTag: getCurrentTag(state),
  tags: getTags(state),
})

const mapDispatch = (dispatch: AppDispatch) => ({
  onSelectTag: (tag: Tag | null) => dispatch(setCurrentTag(tag))
})

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const CategorySidebar = React.memo<Props>(({ selectedTag, tags, onSelectTag }) => {
  const { t } = useTranslation()
  const { userId } = useParams<any>()

  return (
    <aside className="CategorySidebar">
      <ul className="menu">
        <li>
          <a onClick={() => onSelectTag(null)} className={!selectedTag ? 'active' : ''}>{t('home.allRecipes')}</a>
        </li>
        {tags.map(tag => (
          <li key={tag._id}>
            <Link to={userId ? ('/recipes/user/' + userId) : '/recipes'} onClick={() => onSelectTag(tag)} className={(!!selectedTag && selectedTag._id === tag._id) ? 'active' : ''}>{tag.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  )
})

export default connect(mapState, mapDispatch)(CategorySidebar)