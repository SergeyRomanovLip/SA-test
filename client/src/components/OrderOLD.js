import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Input, Label, Loader, Modal, Segment, Icon } from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
import { ConfirmCtx } from '../context/ConfirmCtx'
import { useHttp } from '../hooks/http.hook'

export const Order = ({ e, updateOrders, windWidth, fs }) => {
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

  const [orderButtons, setOrderButtons] = useState([])
  const orderButtonsHandler = () => {
    const buttonsArray = []
    if (userType === 'logisticks') {
      if (e.state === 'created') {
        buttonsArray.push(
          <Button
            key={123}
            loading={loading}
            size={'tiny'}
            onClick={() => {
              setOpenAddCar(true)
            }}
            color='teal'
          >
            {'Назначить автомобиль'}
          </Button>
        )
        buttonsArray.push(
          <Button
            key={124}
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
        if (e.state === 'loaded') {
          buttonsArray.push(
            <Button
              key={125}
              loading={loading}
              size={'tiny'}
              onClick={(e) => {
                confirmHandler(orderFinish)
              }}
              color='purple'
            >
              Машина пришла, закрыть заявку
            </Button>
          )
        }
      }
     else if (userType === 'farm' && e.state === 'car_defined') {
      buttonsArray.push(
        <Button
          key={126}
          loading={loading}
          onClick={() => {
            confirmHandler(orderLoaded)
          }}
          color='yellow'
        >
          Отметить что машина загружена
        </Button>
      )
    }
    setOrderButtons(buttonsArray)
  }

  useEffect(() => {
    orderStateHandler(e)
    orderButtonsHandler()
  }, [e])

  if (!e) {
    return null
  }
  return (
    <>
      <Segment.Group horizontal>
        <Segment
          style={{
            backgroundColor: e.state === 'canceled' ? 'rgba(200,200,200)' : 'rgba(245,245,245)',
            paddingTop: 0 + 'px',
            paddingBottom: 0 + 'px',
          }}
        >
          <Form>
            <Form.Group className='order' widths='7'>
              <Form.Field style={{ width: fs.orderState }}>
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
                  {orderButtons && orderButtons.length !== 0 && (
                    <Icon name={choosen ? 'minus circle' : 'plus circle'} style={{ marginLeft: -21 + 'px' }} />
                  )}
                  № {e.number} от {new Date(e.creationDate).toLocaleDateString()} <br /> {orderState.text}
                </Label>
              </Form.Field>
              <Form.Field style={{ width: fs.deliverDate }}>
                <Input labelPosition='left' value={new Date(e.deliverDate).toLocaleDateString()}>
                  {windWidth < 768 && <Label>Дата доставки</Label>}
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field style={{ width: fs.title }}>
                <Input fluid labelPosition='left' value={e.potatoes?.title}>
                  {windWidth < 768 && <Label>Сорт</Label>}
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field style={{ width: fs.quantity }}>
                <Input labelPosition='left' value={e?.quantity}>
                  {windWidth < 768 && <Label>Количество</Label>}
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field style={{ width: fs.company }}>
                <Input labelPosition='left' value={e.farm?.company}>
                  {windWidth < 768 && <Label>Контрагент</Label>}
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field style={{ width: fs.car }}>
                <Input fluid labelPosition='left' value={e?.car ? e.car : '- - -'}>
                  {windWidth < 768 && <Label>Автомобиль</Label>}
                  <input></input>
                </Input>
              </Form.Field>

              <Form.Field style={{ width: fs.loadedDate }}>
                <Input
                  labelPosition='left'
                  value={
                    e.loadedDate
                      ? new Date(e.loadedDate).toLocaleDateString() + ', ' + new Date(e.loadedDate).toLocaleTimeString()
                      : '- - -'
                  }
                >
                  {windWidth < 768 && <Label>Дата загрузки </Label>}
                  <input></input>
                </Input>
              </Form.Field>
            </Form.Group>
            <div className={choosen ? 'btnGrpAnim on' : 'btnGrpAnim off'}>
              {orderButtons && orderButtons.length > 0 ? orderButtons : null}
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
  )
}
