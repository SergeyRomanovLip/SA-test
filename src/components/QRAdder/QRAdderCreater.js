import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Button, Divider, Dropdown, Form, Input, Label, List, Select } from 'semantic-ui-react'
import { getUserData, uploadNewDataModel } from '../../backend/firebase'
import { AppContext } from '../../context/AppContext'
import { generateId } from '../../misc/generateId'

export const QRAdderCreater = () => {
  const { authenticated } = useContext(AppContext)
  const para = useParams()
  const hstr = useHistory()
  const [state, setState] = useState({})
  const addElement = () => {
    let newId = generateId()
    setState((prev) => {
      return { ...prev, [newId]: { id: newId, nm: '', tp: '' } }
    })
  }
  const changeElement = (value, id, part) => {
    let changedElement = state[id]
    changedElement[part] = value
    setState((prev) => {
      return { ...prev, [id]: { ...changedElement } }
    })
  }

  const removeElement = (id) => {
    let newState = { ...state }
    delete newState[id]
    setState(newState)
  }

  const changeNameOfModel = (value) => {
    setState((prev) => {
      return { ...prev, mn: value }
    })
  }

  return (
    <List>
      <Input
        onChange={(e) => {
          changeNameOfModel(e.currentTarget.value)
        }}
        placeholder={'Введите название коллекции'}
      ></Input>
      {Object.keys(state).map((id, index) => {
        if (id !== 'mn') {
          return (
            <List.Item key={index * 25}>
              <Form.Group>
                <Label circular>{index + 1}</Label>
                <Input
                  onChange={(e) => {
                    changeElement(e.currentTarget.value, id, 'nm')
                  }}
                  value={state[id].nm}
                ></Input>
                <Dropdown
                  placeholder={state[id].tp}
                  selection
                  onChange={(e, data) => {
                    changeElement(data.value, id, 'tp')
                  }}
                  options={[
                    { key: 'text', text: 'Текстовый элемент', value: 'text' },
                    { key: 'date', text: 'Дата', value: 'date' },
                  ]}
                ></Dropdown>
                <Button
                  circular
                  icon='remove circle'
                  onClick={() => {
                    removeElement(id)
                  }}
                />
              </Form.Group>
            </List.Item>
          )
        }
      })}
      <Button onClick={addElement}>Добавить элемент</Button>
      {Object.keys(state).length > 1 && (
        <Button
          onClick={() => {
            let status = true
            Object.keys(state).forEach((e) => {
              if (state[e].nm === '') {
                status = false
              }
              if (state[e].tp === '') {
                status = false
              }
              console.log(status)
            })
            status
              ? getUserData(authenticated).then((res) => {
                  uploadNewDataModel(res.company, state, state.mn)
                })
              : alert('Заполни все поля которые насоздавал')
          }}
        >
          Загрузить модель данных?
        </Button>
      )}
    </List>
  )
}
