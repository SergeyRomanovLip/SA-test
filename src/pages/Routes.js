import { Switch, Route, Redirect, useHistory, useParams } from 'react-router-dom'
import { RoutesContext } from '../context/RoutesContext'
import { Auth } from './Auth'
import { Home } from './Home'
import { Test } from './Test'
import { Admin } from './Admin'
import { ResultItemForPrinting } from '../components/ResultItemForPrinting'
import { AppContext } from './../context/AppContext'
import { useContext } from 'react'

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
        <Route path='/admin/:print?'>
          <Admin />
          <ResultItemForPrinting />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    </RoutesContext.Provider>
  )
}
