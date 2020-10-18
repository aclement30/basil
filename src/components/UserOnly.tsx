import React from 'react'
import { connect } from 'react-redux'

import { AppState } from '../store'
import { getCurrentUser } from '../store/selectors/session'

const mapState = (state: AppState) => ({
  user: getCurrentUser(state),
})

interface Props extends ReturnType<typeof mapState> {
  children: React.ReactElement
}

const UserOnly: React.FC<Props> = ({ children, user }): React.ReactElement | null => {
  if (!user) return null

  return children
}

export default connect(mapState)(UserOnly)