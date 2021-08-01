import { BrowserRouter as Router } from 'react-router-dom'
import { Routes } from './pages/Routes'
import { AppContext } from './context/AppContext'
import './css/App.css'
import { useEffect, useReducer, useRef, useState } from 'react'
import { reducer } from './reducer/reducer'
import firebase from 'firebase'
import { Toolbar } from './components/Toolbar'

export const App = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setAuthenticated(user)
    } else {
      setAuthenticated(false)
    }
  })
  const [appState, appDispatch] = useReducer(reducer, {})
  const [testTable, setTestTable] = useState('')
  const [emplList, setEmplList] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <AppContext.Provider value={{ appState, appDispatch, emplList, setEmplList, testTable, setTestTable, authenticated }}>
      <Router>
        <Toolbar />
        <Routes />
      </Router>
    </AppContext.Provider>
  )
}
