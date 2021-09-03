import { Card, Container, Header, Button, List, Divider } from 'semantic-ui-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import QrReader from 'react-qr-reader'
import { getQrData, getUserData } from '../backend/firebase'
import { AppContext } from '../context/AppContext'
import { useHistory, useParams } from 'react-router'
import { QRAdder } from '../components/QRAdder/QRAdder'

const QRReaderApp = () => {
  const { authenticated } = useContext(AppContext)
  const [state, setState] = useState({ delay: 1000, result: false })
  const [checking, setChecking] = useState(false)
  const [legacyModeStat, setLegacyMode] = useState(false)

  const hstr = useHistory()
  const ref = useRef()
  const handleScan = (data) => {
    if (data !== null && !checking) {
      setChecking(true)
      getUserData(authenticated).then((res) => {
        getQrData(res.company, data).then((res) => {
          console.log(res)
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
      return Object.keys(obj).map((el, i) => {
        return (
          <List.Item key={i}>
            {el}: {obj[el]}
          </List.Item>
        )
      })
    }
  }
  useEffect(() => {
    if (legacyModeStat) {
      ref.current.openImageDialog()
    }
  }, [legacyModeStat])

  const handleError = (err) => {
    console.error(err)
  }

  return (
    <Card.Content>
      {!state.result ? (
        <QrReader
          facingMode={'environment'}
          ref={ref}
          delay={250}
          style={{ width: 250 + 'px' }}
          onError={handleError}
          onScan={handleScan}
          legacyMode={legacyModeStat}
        />
      ) : null}
      <Divider></Divider>
      {state.result && <List>{state.result}</List>}
      <Button.Group>
        {state.result && (
          <Button
            onClick={() => {
              setState({ delay: 1000, result: false })
              setLegacyMode(false)
            }}
          >
            Сбросить
          </Button>
        )}
        {!state.result && legacyModeStat && (
          <Button
            onClick={() => {
              setState({ delay: 1000, result: false })
              setLegacyMode(false)
            }}
          >
            Сбросить
          </Button>
        )}
        {!legacyModeStat && (
          <Button
            onClick={() => {
              setLegacyMode((prev) => {
                return prev ? false : true
              })
            }}
          >
            Загрузить фото
          </Button>
        )}
        <Button.Or />
        <Button
          onClick={() => {
            hstr.push('/qr/add')
          }}
        >
          Добавить в базу код
        </Button>
      </Button.Group>
    </Card.Content>
  )
}

export const QRCodeReader = () => {
  const para = useParams()
  return (
    <div className='narrowContainer'>
      <Container fluid className='container'>
        <Card fluid>
          <Card.Content>
            <Header as='h2'>Доброе пожаловать в QRCodeReader</Header>
            <Divider></Divider>
            {para.add ? <QRAdder /> : <QRReaderApp />}
          </Card.Content>
        </Card>
      </Container>
    </div>
  )
}
