import React, { useContext, useEffect, useState } from 'react'
import { Button, Input, Form, Modal, Dropdown } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import { AuthCtx } from '../../context/AuthCtx'
import { useHttp } from '../../hooks/http.hook'
import { conslog } from '../../utils/helpers'
import { verifyFields } from './../../utils/helpers'

export const AddOrder = ({ active, deactivate }) => {
  const hstr = useHistory()
  const { token, userId } = useContext(AuthCtx)
  const { loading, request } = useHttp()

  const [addOrderData, setAddOrderData] = useState({ type: '', potatoe: '', date: '' })
  const addOrderDataHandler = (e, type) => {
    setAddOrderData((prev) => {
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

  const addNewOrder = () => {
    request(
      `/api/data/addorder`,
      'POST',
      { ...addOrderData, uid: userId },
      {
        Authorization: `Bearer ${token}`
      }
    )
  }

  return (
    <Modal
      size='tiny'
      closeOnDimmerClick={false}
      closeIcon={'close'}
      onClose={() => {
        deactivate(false)
        hstr.goBack()
      }}
      onMount={() => {
        dataRequest('farmers')
        dataRequest('potatoes')
      }}
      onOpen={() => deactivate(true)}
      open={active}
    >
      <Modal.Header>Создание заявки</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>фермер</label>
            <Dropdown
              placeholder='фермер'
              fluid
              selection
              value={addOrderData.type || ''}
              onChange={(e, val) => {
                addOrderDataHandler(val.value, 'type')
              }}
              options={
                requestedData?.farmers?.map((e) => {
                  return {
                    key: e._id,
                    text: (
                      <>
                        <p>
                          <b>{e.company} | </b>
                          {e.fname}, {e.position}
                        </p>
                      </>
                    ),
                    value: e._id
                  }
                }) || [{ key: '1', text: '...', value: '' }]
              }
            />
          </Form.Field>
          <Form.Field>
            <label>номенклатура</label>
            <Dropdown
              placeholder='номенклатура'
              fluid
              selection
              value={addOrderData?.potatoe || ''}
              onChange={(e, val) => {
                addOrderDataHandler(val.value, 'potatoe')
              }}
              options={
                requestedData?.potatoes?.map((e) => {
                  return {
                    key: e._id,
                    text: e.title,
                    value: e._id
                  }
                }) || [{ key: '1', text: '...', value: '' }]
              }
            />
          </Form.Field>
          <Form.Field>
            <label>дата доставки</label>
            <Input
              value={addOrderData.date || new Date().toISOString().substr(0, 10) + 'T13:00'}
              onChange={(e) => {
                addOrderDataHandler(e.target.value, 'date')
                console.log()
                console.log(e.target.value)
              }}
              placeholder='дата доставки'
              type='datetime-local'
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content='Подтвердить'
          color='teal'
          loading={loading}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            if (verifyFields(addOrderData)) {
              addNewOrder()
            } else {
              alert('Заполните все поля!')
            }
          }}
        />
      </Modal.Actions>
    </Modal>
  )
}
