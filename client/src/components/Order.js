import React, { useContext, useEffect, useState } from 'react'
import { Button, Divider, Form, Input, Item, Label, Loader, Modal, Segment, Header } from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
import { ConfirmCtx } from '../context/ConfirmCtx'
import { useHttp } from '../hooks/http.hook'
import { MessageCtx } from '../context/MessageCtx'

// Сделать табличный вид
// Сделать выбор строки и кнопку

export const Order = ({ e, updateOrders }) => {
  const { token, userId, userType } = useContext(AuthCtx)
  const { loading, error, request } = useHttp()
  const { confirmHandler } = useContext(ConfirmCtx)
  const [orderState, setOrderState] = useState({ text: <Loader inline />, color: 'teal' })
  const orderStateHandler = () => {
    let state = {}

    if (e.state === 'canceled') {
      state = { text: 'Отменена', color: 'grey' }
    } else if (e.state === 'created') {
      state = { text: 'Создана', color: 'teal' }
    } else if (e.state === 'car_defined') {
      state = { text: 'Назначен автомобиль', color: 'yellow' }
    } else if (e.state === 'loaded') {
      state = { text: 'Машина загружена', color: 'purple' }
    } else if (e.state === 'finished') {
      state = { text: `Завершена ${new Date(e.finishDate).toLocaleDateString()}`, color: 'orange' }
    }
    setOrderState(state)
  }

  const [openAddCar, setOpenAddCar] = useState(false)
  const [addCarData, setAddCarData] = useState({})
  const addCarDataHandler = (e, type) => {
    setAddCarData((prev) => {
      return { ...prev, [type]: e }
    })
  }

  const addNewCar = async () => {
    const res = await request(
      `/api/data/addcartoorder`,
      'POST',
      { _id: e._id, car: addCarData.number },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    updateOrders()
  }

  const orderLoaded = async () => {
    const res = await request(
      `/api/data/orderloaded`,
      'POST',
      { _id: e._id },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    updateOrders()
  }

  useEffect(() => {
    orderStateHandler(e)
  }, [e])

  const orderFinish = () => {
    return async () => {
      const res = request(
        `/api/data/orderfinish`,
        'POST',
        { _id: e._id },
        {
          Authorization: `Bearer ${token}`,
        }
      )
      updateOrders()
    }
  }

  const orderCancel = () => {
    return async () => {
      const res = request(
        `/api/data/cancelorder`,
        'POST',
        { _id: e._id },
        {
          Authorization: `Bearer ${token}`,
        }
      )
      updateOrders()
    }
  }

  if (!e) {
    return null
  }
  return (
    // <Item key={e._id} >
    <>
      <Segment.Group horizontal>
        <Segment
          style={{
            backgroundColor: e.state === 'canceled' ? 'rgba(200,200,200)' : 'rgba(245,245,245)',
            paddingTop: 5 + 'px',
            paddingBottom: 5 + 'px',
          }}
        >
          <Label as='a' color={orderState.color} ribbon>
            Заявка от {new Date(e.creationDate).toLocaleDateString()}
          </Label>
          <Label as='a' color={orderState.color} ribbon>
            {orderState.text}
          </Label>

          <Form>
            <Form.Group widths='3'>
              <Form.Field>
                <Input labelPosition='left' value={new Date(e.deliverDate).toLocaleDateString()}>
                  <Label>Дата доставки</Label>
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field>
                <Input fluid labelPosition='left' value={e.potatoes?.title}>
                  <Label>Сорт</Label>
                  <input></input>
                </Input>
              </Form.Field>
              {e.state === 'loaded' && (
                <Form.Field>
                  <Input
                    labelPosition='left'
                    value={
                      new Date(e.loadedDate).toLocaleDateString() + ', ' + new Date(e.loadedDate).toLocaleTimeString()
                    }
                  >
                    <Label>Дата загрузки </Label>
                    <input></input>
                  </Input>
                </Form.Field>
              )}
            </Form.Group>

            <Form.Group widths='3'>
              <Form.Field>
                <Input labelPosition='left' value={e.farm?.company}>
                  <Label>Контрагент</Label>
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field>
                <Input labelPosition='left' value={e.farm?.fname}>
                  <Label>Фермер</Label>
                  <input></input>
                </Input>
              </Form.Field>

              {e?.car && (
                <Form.Field>
                  <Input fluid labelPosition='left' value={e?.car}>
                    <Label>Автомобиль</Label>
                    <input></input>
                  </Input>
                </Form.Field>
              )}
            </Form.Group>
          </Form>
          {userType === 'logisticks' && (
            <>
              {e.state === 'created' && (
                <Button
                  onClick={() => {
                    setOpenAddCar(true)
                  }}
                  color='teal'
                >
                  {'Назначить автомобиль'}
                </Button>
              )}
              {e.state === 'created' && (
                <Button
                  onClick={() => {
                    confirmHandler(orderCancel)
                  }}
                  color='google plus'
                >
                  Отменить заявку
                </Button>
              )}
              {e.state === 'loaded' && (
                <Button
                  onClick={() => {
                    confirmHandler(orderFinish)
                  }}
                  color='purple'
                >
                  Машина пришла, закрыть заявку
                </Button>
              )}
              {/* </Button.Group> */}
            </>
          )}
          {userType === 'farm' && e.state === 'car_defined' && (
            <Button.Group>
              <Button
                onClick={() => {
                  confirmHandler(orderLoaded)
                }}
                color='yellow'
              >
                Отменить что машина загружена
              </Button>
            </Button.Group>
          )}
        </Segment>
      </Segment.Group>
      <Modal
        size='tiny'
        closeOnDimmerClick={false}
        onClose={() => {
          setOpenAddCar(false)
        }}
        onOpen={() => {
          setOpenAddCar(true)
        }}
        open={openAddCar}
      >
        <Modal.Header>Добавить к заказу автомобиль</Modal.Header>
        <Modal.Content>
          <Form>
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
            content='Отменить'
            color='red'
            onClick={() => {
              setOpenAddCar(false)
            }}
            labelPosition='right'
            icon='close'
          ></Button>
          <Button
            content='Подтвердить'
            loading={loading}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              addNewCar()
              setOpenAddCar(false)
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    </>
    // </Item>
  )
}
