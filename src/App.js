import { BrowserRouter as Router } from 'react-router-dom'
import { Routes } from './pages/Routes'
import { AppContext } from './context/AppContext'
import { useEffect, useReducer, useRef, useState } from 'react'
import { reducer } from './reducer/reducer'
import firebase from 'firebase'
import { Toolbar } from './components/Toolbar'
import { Dimmer, Loader } from 'semantic-ui-react'

export const App = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [appState, appDispatch] = useReducer(reducer, {})
  const [testTable, setTestTable] = useState('')
  const [emplList, setEmplList] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultsForPrinting, setResultsForPrinting] = useState([])
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setAuthenticated(user)
    } else {
      setAuthenticated(false)
    }
  })

  const resizeHandler = () => {
    setWidth(window.innerWidth)
  }

  const loadingPromiseHandler = async (promis) => {
    setLoading(true)
    const result = await promis()
    setLoading(false)
  }

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
  }, [window.innerWidth])

  return (
    <AppContext.Provider
      value={{
        appState,
        appDispatch,
        emplList,
        setEmplList,
        testTable,
        setTestTable,
        authenticated,
        width,
        setLoading,
        resultsForPrinting,
        setResultsForPrinting,
        loadingPromiseHandler,
      }}
    >
      <Router>
        {loading ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : null}
        <Toolbar />
        <Routes />
      </Router>
    </AppContext.Provider>
  )
}
