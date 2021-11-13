import React, { useContext, useState } from 'react'
import { Button, Header, Input, Form, Modal, List } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import { AuthCtx } from '../../context/AuthCtx'
import { useHttp } from '../../hooks/http.hook'

export const AddPotato = ({ active, deactivate }) => {
  const hstr = useHistory()
  const { token, userId } = useContext(AuthCtx)
  const { loading, request } = useHttp()
  const [addPotData, setAddPotData] = useState('')
  const addPotDataHandler = (e, type) => {
    setAddPotData((prev) => {
      return { ...prev, [type]: e }
    })
  }

  const [requestedData, setRequestedData] = useState()
  const dataRequest = async (what, options) => {
    const res = await request(
      `/api/data/${what}`,
      'POST',
      { userId },
      {
        Authorization: `Bearer ${token}`
      }
    )
    setRequestedData((prev) => {
      return { ...prev, [what]: res }
    })
    return res
  }
  const addNewPot = async () => {
    const res = request(
      `/api/data/addpot`,
      'POST',
      { ...addPotData },
      {
        Authorization: `Bearer ${token}`
      }
    ).then(() => {
      dataRequest('potatoes')
    })
  }
  return (
    <Modal
      closeIcon={'close'}
      size='tiny'
      closeOnDimmerClick={false}
      onClose={() => {
        hstr.goBack()
        deactivate(false)
      }}
      onOpen={() => {
        dataRequest('potatoes')
        deactivate(true)
      }}
      onMount={() => {
        dataRequest('potatoes')
      }}
      open={active}
    >
      <Modal.Header>Добавить новую номенклатуру</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              value={addPotData.title || ''}
              onChange={(e) => {
                addPotDataHandler(e.target.value, 'title')
              }}
              placeholder='Наименование номенклатуры'
            />
          </Form.Field>
        </Form>
        <Header>Существующая номенклатура</Header>
        <List>
          {requestedData?.potatoes?.map((e, i) => {
            return (
              <List.Item key={i + 'potatoes'}>
                <List.Icon name='point' />
                <List.Content>{e.title}</List.Content>
              </List.Item>
            )
          })}
        </List>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content='Подтвердить'
          disabled={addPotData !== '' ? false : true}
          loading={loading}
          labelPosition='right'
          icon='checkmark'
          onClick={() => addNewPot()}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
