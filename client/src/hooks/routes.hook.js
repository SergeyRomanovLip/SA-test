import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { Home } from '../pages/Home'
import { Login } from './../pages/Login'

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path='/home/:params?' exact>
          <Home />
        </Route>
        <Redirect to='/home' />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route path='/auth/login'>
        <Login />
      </Route>
      <Redirect to={'/auth/login'} />
    </Switch>
  )
}
