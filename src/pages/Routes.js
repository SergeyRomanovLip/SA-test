import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import { RoutesContext } from '../context/RoutesContext'
import { Auth } from './Auth'
import { Home } from './Home'
import { Test } from './Test'
import { TestResults } from './TestResults'
import { Admin } from './Admin'
export const Routes = () => {
  const histories = useHistory()

  return (
    <RoutesContext.Provider value={{ histories }}>
      <Switch>
        <Route path='/home'>
          <Home />
        </Route>
        <Route path='/testready/:company?&:fio?&:position?&:department?/:course?'>
          <Test />
        </Route>
        <Route path='/admin'>
          <Admin />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    </RoutesContext.Provider>
  )
}
