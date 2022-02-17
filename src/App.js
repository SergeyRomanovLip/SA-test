import { BrowserRouter as Router } from 'react-router-dom'
import { Routes } from './pages/Routes'
import { AppContext } from './context/AppContext'
import { useEffect, useReducer, useRef, useState } from 'react'
import { reducer } from './reducer/reducer'
import firebase from 'firebase'
import { Toolbar } from './components/Toolbar'
import { Dimmer, Loader, Modal, Button } from 'semantic-ui-react'

export const App = () => {
  const [alert, setAlert] = useState('')
  const [open, setOpen] = useState(false)
  window.alert = (text) => {
    setAlert(text)
  }

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
      <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={alert !== ''}>
        <Modal.Header>Сообщение</Modal.Header>
        <Modal.Content>
          <Modal.Description>{alert}</Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content='OK'
            labelPosition='right'
            icon='checkmark'
            positive
            onClick={() => {
              setOpen(false)
              setAlert('')
            }}
          ></Button>
        </Modal.Actions>
      </Modal>
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
