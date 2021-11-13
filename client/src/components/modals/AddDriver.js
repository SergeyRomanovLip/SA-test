import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Input, Modal, SearchResults } from 'semantic-ui-react'
import PhoneInput from 'react-phone-number-input'
import { AuthCtx } from '../../context/AuthCtx'
import { useHttp } from '../../hooks/http.hook'
import { DriverSearch } from '../DriverSearch'
import { conslog } from '../../utils/helpers'
import { verifyFields } from './../../utils/helpers'

export const AddDriver = ({ e, active, deactivate }) => {
  const { token } = useContext(AuthCtx)
  const { loading, request } = useHttp()
  const [addCarData, setAddCarData] = useState({ fio: '', phone: '', number: '' })
  const addCarDataHandler = (e, type) => {
    setAddCarData((prev) => {
      return { ...prev, [type]: e }
    })
  }

  const addNewCar = () => {
    request(
      `/api/data/addcartoorder`,
      'POST',
      { _id: e._id, car: addCarData },
      {
        Authorization: `Bearer ${token}`
      }
    )
  }

  return (
    <Modal
      closeIcon={'close'}
      size='tiny'
      closeOnDimmerClick={false}
      onClose={() => {
        deactivate(false)
      }}
      onOpen={() => {
        deactivate(true)
      }}
      open={active}
    >
      <Modal.Header>Добавить к заказу автомобиль</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <DriverSearch filler={addCarDataHandler} />
          </Form.Field>
          <Form.Field>
            <PhoneInput
              defaultCountry='RU'
              placeholder='номер телефона водителя'
              value={addCarData.phone || ''}
              onChange={(e) => {
                addCarDataHandler(e, 'phone')
              }}
            />
          </Form.Field>
          <Form.Field>
            <Input
              value={addCarData.number || ''}
              onChange={(e) => {
                addCarDataHandler(e.target.value.toUpperCase(), 'number')
              }}
              placeholder='номер автомобиля'
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content='Подтвердить'
          loading={loading}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            if (verifyFields(addCarData)) {
              addNewCar()
              deactivate(false)
            } else {
              alert('Заполните все поля!')
            }
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
