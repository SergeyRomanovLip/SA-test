import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Divider,
  Form,
  Input,
  Item,
  Label,
  Loader,
  Modal,
  Segment,
  Header,
  Visibility,
} from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
import { ConfirmCtx } from '../context/ConfirmCtx'
import { useHttp } from '../hooks/http.hook'

export const Order = ({ e, updateOrders, windWidth }) => {
  const [choosen, setChoosen] = useState(false)
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

  const addNewCar = () => {
    request(
      `/api/data/addcartoorder`,
      'POST',
      { _id: e._id, car: addCarData.number },
      {
        Authorization: `Bearer ${token}`,
      }
    ).then(() => {
      updateOrders()
    })
  }

  const orderLoaded = () => {
    return () => {
      request(
        `/api/data/orderloaded`,
        'POST',
        { _id: e._id },
        {
          Authorization: `Bearer ${token}`,
        }
      ).then(() => {
        updateOrders()
      })
    }
  }

  const orderFinish = () => {
    return () => {
      request(
        `/api/data/orderfinish`,
        'POST',
        { _id: e._id },
        {
          Authorization: `Bearer ${token}`,
        }
      ).then(() => {
        updateOrders()
      })
    }
  }

  const orderCancel = () => {
    return () => {
      request(
        `/api/data/cancelorder`,
        'POST',
        { _id: e._id },
        {
          Authorization: `Bearer ${token}`,
        }
      ).then(() => {
        updateOrders()
      })
    }
  }

  useEffect(() => {
    orderStateHandler(e)
  }, [e])

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
          <Form>
            <Form.Group widths='7'>
              <Form.Field>
                <Label
                  as='a'
                  color={orderState.color}
                  ribbon
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setChoosen((prev) => {
                      return prev ? false : true
                    })
                  }}
                >
                  № {e.number} от {new Date(e.creationDate).toLocaleDateString()} <br /> {orderState.text}
                </Label>
              </Form.Field>
              <Form.Field>
                {windWidth < 768 && <Label>Дата доставки</Label>}
                <Input labelPosition='left' value={new Date(e.deliverDate).toLocaleDateString()}>
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field>
                {windWidth < 768 && <Label>Сорт</Label>}
                <Input fluid labelPosition='left' value={e.potatoes?.title}>
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field>
                {windWidth < 768 && <Label>Количество</Label>}
                <Input labelPosition='left' value={e?.quantity}>
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field>
                {windWidth < 768 && <Label>Контрагент</Label>}
                <Input labelPosition='left' value={e.farm?.company}>
                  <input></input>
                </Input>
              </Form.Field>

              {e?.car && (
                <Form.Field>
                  {windWidth < 768 && <Label>Автомобиль</Label>}
                  <Input fluid labelPosition='left' value={e?.car}>
                    <input></input>
                  </Input>
                </Form.Field>
              )}
              {e.state === 'loaded' && (
                <Form.Field>
                  {windWidth < 768 && <Label>Дата загрузки </Label>}
                  <Input
                    labelPosition='left'
                    value={
                      new Date(e.loadedDate).toLocaleDateString() + ', ' + new Date(e.loadedDate).toLocaleTimeString()
                    }
                  >
                    <input></input>
                  </Input>
                </Form.Field>
              )}
            </Form.Group>
            <div style={{ display: choosen ? 'block' : 'none', margin: 5 + 'px' }}>
              {userType === 'logisticks' && (
                <>
                  {e.state === 'created' && (
                    <Button
                      loading={loading}
                      size={'tiny'}
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
                      loading={loading}
                      size={'tiny'}
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
                      loading={loading}
                      size={'tiny'}
                      onClick={(e) => {
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
                    loading={loading}
                    onClick={() => {
                      confirmHandler(orderLoaded)
                    }}
                    color='yellow'
                  >
                    Отметить что машина загружена
                  </Button>
                </Button.Group>
              )}
            </div>
          </Form>
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
