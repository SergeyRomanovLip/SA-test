import React, { useEffect } from 'react'
import { MessageC } from './components/Message'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { AuthCtx } from './context/AuthCtx'
import { useRoutes } from './hooks/routes.hook'
import { Toolbar } from './components/Toolbar'
import { Confirmation } from './components/Confirmation'
import { Preloader } from './components/Preloader'
import { Container } from 'semantic-ui-react'

export const App = () => {
  const { token, login, logout, userId, userType, userData } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  return (
    <AuthCtx.Provider value={{ token, login, logout, userId, isAuthenticated, userType, userData }}>
      <Router>
        <Toolbar>
          <Confirmation>
            <Preloader />
            <MessageC>{routes}</MessageC>
          </Confirmation>
        </Toolbar>
      </Router>
    </AuthCtx.Provider>
  )
}
