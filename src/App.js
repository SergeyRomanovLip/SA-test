import { BrowserRouter as Router } from 'react-router-dom'
import { Routes } from './pages/Routes'
import { AppContext } from './context/AppContext'
import './css/App.css'
import { useReducer, useState } from 'react'
import { reducer } from './reducer/reducer'

export const App = () => {
  const [appState, appDispatch] = useReducer(reducer, {})
  const [testTable, setTestTable] = useState('')
  const [emplList, setEmplList] = useState('')

  return (
    <AppContext.Provider value={{ appState, appDispatch, emplList, setEmplList, testTable, setTestTable }}>
      <Router>
        <Routes />
      </Router>
    </AppContext.Provider>
  )
}
