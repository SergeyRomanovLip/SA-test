import { Card, Container, Header, Button, List, Divider, Input, Radio } from 'semantic-ui-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import QrReader from 'react-qr-reader'
import { getQrData, getUserData } from '../backend/firebase'
import { AppContext } from '../context/AppContext'
import { useHistory, useParams } from 'react-router'
import { QRAdder } from '../components/QRAdder/QRAdder'
import { QRUploader } from '../components/QRAdder/QRUploader'

const QRReaderApp = () => {
  const { authenticated } = useContext(AppContext)
  const [state, setState] = useState({ delay: 50, result: false })
  const [checking, setChecking] = useState(false)
  const [legacyModeStat, setLegacyMode] = useState(false)

  const hstr = useHistory()
  const ref = useRef()
  const handleScan = (data) => {
    if (data !== null && !checking) {
      setChecking(true)
      getUserData(authenticated).then((res) => {
        getQrData(res.company, data).then((res) => {
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
      let sortArray = []
      Object.keys(obj).forEach((el) => {
        if (!el.mn) {
          sortArray.push({ key: el, index: obj[el].index })
        }
      })
      sortArray.sort((a, b) => {
        if (a.index > b.index) {
          return 1
        }
        if (a.index < b.index) {
          return -1
        }
        return 0
      })
      let dom = sortArray.map((el, ind) => {
        if (obj[el.key].tp === 'text') {
          return (
            <List.Item key={ind + 96}>
              <Input value={obj[el.key].value} label={obj[el.key].nm} />
            </List.Item>
          )
        } else if (obj[el.key].tp === 'date') {
          return (
            <List.Item key={ind + 96}>
              <Input value={obj[el.key].value} type={'date'} label={obj[el.key].nm} />
            </List.Item>
          )
        } else if (obj[el.key].tp === 'bool') {
          return (
            <List.Item key={ind + 96}>
              <Radio checked={obj[el.key].value} toggle label={obj[el.key].nm} />
            </List.Item>
          )
        }
      })

      return dom
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
            {!para.add && !para.model && <QRReaderApp />}
            {para.add && !para.model && <QRAdder />}
            {para.add && para.model && <QRUploader />}
          </Card.Content>
        </Card>
      </Container>
    </div>
  )
}
