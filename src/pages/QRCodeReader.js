import { Card, Container, Header, Button, List, Divider } from 'semantic-ui-react'

import React, { useContext, useEffect, useState } from 'react'
import QrReader from 'react-qr-scanner'
import { getQrData, getUserData } from '../backend/firebase'
import { AppContext } from '../context/AppContext'

const QRReaderApp = () => {
  const { authenticated } = useContext(AppContext)
  const [state, setState] = useState({ delay: 1000, result: false })
  const [checking, setChecking] = useState(false)
  const handleScan = (data) => {
    if (data !== null && !checking) {
      setChecking(true)
      getUserData(authenticated).then((res) => {
        getQrData(res.company, data.text).then((res) => {
          if (res) {
            const domTree = dataParser(res)
            setState({
              result: domTree,
            })
            setChecking(false)
          } else {
            alert('Совпадений в базе не найдено')
            setChecking(false)
          }
        })
      })
    }
  }
  const dataParser = (obj) => {
    if (typeof obj === 'object') {
      console.log(obj)
      return Object.keys(obj).map((el, i) => {
        return (
          <List.Item key={i}>
            {el}: {obj[el]}
          </List.Item>
        )
      })
    }
  }
  const handleError = (err) => {
    console.error(err)
  }

  const previewStyle = {
    height: 240,
    width: 320,
  }

  return (
    <Card.Content>
      {!state.result ? <QrReader delay='750' style={previewStyle} onError={handleError} onScan={handleScan} /> : null}
      {state.result && <List>{state.result}</List>}
      {state.result && (
        <Button
          onClick={() => {
            setState({ delay: 1000, result: false })
          }}
        >
          Сбросить
        </Button>
      )}
    </Card.Content>
  )
}

export const QRCodeReader = () => {
  return (
    <div className='narrowContainer'>
      <Container fluid className='container'>
        <Card fluid>
          <Card.Content>
            <Header as='h2'>Доброе пожаловать в QRCodeReader</Header>
            <Divider></Divider>
            <List>
              <QRReaderApp />
            </List>
          </Card.Content>
        </Card>
      </Container>
    </div>
  )
}
