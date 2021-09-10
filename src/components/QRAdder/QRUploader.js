import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Button, Divider, Input, Label, List, Radio } from 'semantic-ui-react'
import { getDataModels, getModelDescription, getUserData, uploadNewDataFromQr } from '../../backend/firebase'
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
  const [readyToUpload, setReadyToUpload] = useState(false)
  const [modelName, setModelName] = useState('')

  const handler = (newCode) => {
    setCode(newCode)
  }

  const changeElement = (value, id, obj) => {
    setNemModelState((prev) => {
      return { ...prev, [id]: { value, ...obj } }
    })
  }

  useEffect(() => {
    if (code?.length > 0 && Object.keys(newModelState).length === model.length - 1) {
      let testArray = []
      Object.keys(newModelState).forEach((el) => {
        if (newModelState[el].value === '') {
          testArray.push('empty')
        }
      })
      testArray.includes('empty') ? setReadyToUpload(false) : setReadyToUpload(true)
    }
  }, [newModelState, code])

  useEffect(() => {
    if (para.model && authenticated) {
      setLoading(true)
      getUserData(authenticated).then((auth) => {
        getModelDescription(auth.company, para.model).then((res) => {
          if (res) {
            let modelArray = []
            setModelName(res?.mn)
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
      <List>
        <List.Item>
          <Label color={code ? 'teal' : 'red'}>{code ? code : 'Отсканируйте код'} </Label>
        </List.Item>
        {model &&
          model.map((el, ind) => {
            if (!el.mn) {
              if (el.tp === 'text') {
                return (
                  <List.Item key={ind + 96}>
                    <Input
                      onChange={(e) => {
                        changeElement(e.target.value, el.nm, el)
                      }}
                      value={newModelState[el.nm]?.value !== undefined ? newModelState[el.nm]?.value : ''}
                      label={el.nm}
                    />
                  </List.Item>
                )
              } else if (el.tp === 'date') {
                return (
                  <List.Item key={ind + 96}>
                    <Input
                      value={newModelState[el.nm]?.value !== undefined ? newModelState[el.nm]?.value : ''}
                      onChange={(e) => {
                        changeElement(e.target.value, el.nm, el)
                      }}
                      type={'date'}
                      label={el.nm}
                    />
                  </List.Item>
                )
              } else if (el.tp === 'bool') {
                !newModelState[el.nm] && changeElement(false, el.nm, el)
                return (
                  <List.Item key={ind + 96}>
                    <Radio
                      checked={newModelState[el.nm]?.value}
                      onChange={(e, data) => {
                        changeElement(data.checked, el.nm, el)
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
          disabled={readyToUpload ? false : true}
          onClick={() => {
            getUserData(authenticated).then((data) => {
              uploadNewDataFromQr(data.company, newModelState, code, modelName)
            })
          }}
        >
          Загрузить новые данные
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
// uploadNewDataFromQr
