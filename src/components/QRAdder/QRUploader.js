import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Button, Divider, Input, List, Radio } from 'semantic-ui-react'
import { getDataModels, getModelDescription, getUserData } from '../../backend/firebase'
import { AppContext } from '../../context/AppContext'
import { QRAdderCreater } from './QRAdderCreater'
import { QRReaderAppAdder } from './QRReaderAppAdder'

export const QRUploader = () => {
  const { setLoading, authenticated } = useContext(AppContext)
  const para = useParams()
  const hstr = useHistory()
  const [model, setModel] = useState([])
  const [code, setCode] = useState()
  const [newModelState, setNemModelState] = useState({})

  const handler = (newCode) => {
    setCode(newCode)
  }

  useEffect(() => {
    console.log(newModelState)
  }, [newModelState])

  const changeElement = (value, id) => {
    setNemModelState((prev) => {
      return { ...prev, [id]: value }
    })
  }

  useEffect(() => {
    if (para.model && authenticated) {
      setLoading(true)
      getUserData(authenticated).then((auth) => {
        getModelDescription(auth.company, para.model).then((res) => {
          if (res) {
            let modelArray = []
            Object.keys(res).forEach((el) => {
              if (!res[el].mn) {
                modelArray.push(res[el])
              }
            })
            modelArray.sort((a, b) => {
              if (a.index > b.index) {
                return 1
              }
              if (a.index < b.index) {
                return -1
              }
              return 0
            })
            console.log(modelArray)
            setModel(modelArray)
            setLoading(false)
          } else {
            alert('что то пошло не так, обновите страницу (кнопка F5)')
            setLoading(false)
          }
        })
      })
    }
  }, [authenticated])

  return (
    <>
      <QRReaderAppAdder handler={handler} />
      <Divider></Divider>
      <p>{code}</p>
      <List>
        {model &&
          model.map((el, ind) => {
            if (!el.mn) {
              if (el.tp === 'text') {
                return (
                  <List.Item key={ind + 96}>
                    <Input
                      onChange={(e) => {
                        changeElement(e.target.value, el.nm)
                      }}
                      value={newModelState[el.nm]}
                      label={el.nm}
                    />
                  </List.Item>
                )
              } else if (el.tp === 'date') {
                return (
                  <List.Item key={ind + 96}>
                    <Input
                      onChange={(e) => {
                        changeElement(e.target.value, el.nm)
                      }}
                      type={'date'}
                      label={el.nm}
                    />
                  </List.Item>
                )
              } else if (el.tp === 'bool') {
                return (
                  <List.Item key={ind + 96}>
                    <Radio
                      onChange={(e, data) => {
                        changeElement(data.checked, el.nm)
                      }}
                      toggle
                      label={el.nm}
                    />
                  </List.Item>
                )
              }
            }
          })}
      </List>
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
