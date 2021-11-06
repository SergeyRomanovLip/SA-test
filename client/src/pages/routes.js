import React, { useContext, useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Login } from './Login'
import { Register } from './Register'

export const Routes = () => {
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
