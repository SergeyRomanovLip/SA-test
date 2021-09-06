import { Card, Container, Header, Button, List, Divider } from 'semantic-ui-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import QrReader from 'react-qr-reader'
import { useHistory, useParams } from 'react-router'

export const QRReaderAppAdder = ({ handler }) => {
  const [newQrCode, setNewQrCode] = useState({ delay: 100, result: false })
  const [checking, setChecking] = useState(false)
  const [legacyModeStat, setLegacyMode] = useState(false)

  const hstr = useHistory()
  const ref = useRef()
  const handleScan = (data) => {
    if (data !== null && !checking) {
      setNewQrCode((prev) => {
        return { ...prev, result: data }
      })
    }
  }
  useEffect(() => {
    if (legacyModeStat) {
      ref.current.openImageDialog()
    }
  }, [legacyModeStat])

  useEffect(() => {
    if (newQrCode.result) {
      handler(newQrCode.result)
    }
  }, [newQrCode])
  const handleError = (err) => {
    alert(err)
  }

  return (
    <Card.Content>
      {!newQrCode.result ? (
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
      <List></List>
      <Button.Group>
        {newQrCode.result && (
          <Button
            onClick={() => {
              setNewQrCode({ delay: 1000, result: false })
              setLegacyMode(false)
            }}
          >
            Сбросить
          </Button>
        )}
        {!newQrCode.result && legacyModeStat && (
          <Button
            onClick={() => {
              setNewQrCode({ delay: 1000, result: false })
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
      </Button.Group>
    </Card.Content>
  )
}
