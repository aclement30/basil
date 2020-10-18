import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { connect } from 'react-redux'

import { AppState } from '../store'
import { getCurrentUser } from '../store/selectors/session'

const mapState = (state: AppState) => ({
  user: getCurrentUser(state),
})

type Props = RouteProps & ReturnType<typeof mapState>

const PrivateRoute: React.FC<Props> = ({ children, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}

export default connect(mapState)(PrivateRoute)