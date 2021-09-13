import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Button, Divider, List } from 'semantic-ui-react'
import { getDataModels, getUserData } from '../../backend/firebase'
import { AppContext } from '../../context/AppContext'
import { QRAdderCreater } from './QRAdderCreater'

export const QRAdder = () => {
  const { setLoading, authenticated } = useContext(AppContext)
  const para = useParams()
  const hstr = useHistory()
  const [models, setModels] = useState([])

  useEffect(() => {
    setLoading(true)
    getUserData(authenticated).then((auth) => {
      getDataModels(auth.company).then((res) => {
        if (res) {
          setModels(res)
          setLoading(false)
        } else {
          alert('что то пошло не так, обновите страницу (кнопка F5)')
          setLoading(false)
        }
      })
    })
  }, [authenticated])

  return (
    <>
      <List>
        {models &&
          models.length > 0 &&
          models.map((model, index) => {
            return (
              <List.Item
                key={index + 883}
                onClick={() => {
                  hstr.push(`/qr/add/create/${model.mn}`)
                }}
              >
                <List.Icon name='folder' />
                <List.Content>
                  <List.Header as='a'>{model.mn}</List.Header>
                </List.Content>
              </List.Item>
            )
          })}
      </List>
      {para.create === 'create' && <QRAdderCreater />}
      <Divider></Divider>
      <Button.Group>
        <Button
          onClick={() => {
            hstr.push('/qr/add/create')
          }}
        >
          Создать модель данных
        </Button>
        <Button.Or></Button.Or>
        <Button
          onClick={() => {
            hstr.goBack()
          }}
        >
          Вернуться
        </Button>
      </Button.Group>
    </>
  )
}
