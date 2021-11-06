import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { Home } from '../pages/Home'
import { Register } from './../pages/Register'
import { Login } from './../pages/Login'

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path='/home' exact>
          <Home />
        </Route>
        <Route path='/home/addPotato' exact>
          <Home flags={'addPotato'} />
        </Route>
        <Redirect to='/home' />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route path='/auth/reg'>
        <Register />
      </Route>
      <Route path='/auth/login'>
        <Login />
      </Route>
      <Redirect to={'/auth/login'} />
    </Switch>
  )
}
