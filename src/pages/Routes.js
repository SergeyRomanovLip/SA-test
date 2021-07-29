import { useContext, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { RoutesContext } from '../context/RoutesContext'
import { Auth } from './Auth'
import { Home } from './Home'
import { Test } from './Test'
import { TestResults } from './TestResults'
export const Routes = () => {
  const histories = useHistory()

  return (
    <RoutesContext.Provider value={{ histories }}>
      <Switch>
        <Route path='/home'>
          <Home />
        </Route>
        <Route path='/testready/:fio?&:position?&:department?/:course?'>
          <Test />
        </Route>
        <Route path='/results'>
          <TestResults />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/home' />
      </Switch>
    </RoutesContext.Provider>
  )
}
