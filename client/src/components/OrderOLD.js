import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Input, Label, Loader, Segment, Icon, Popup } from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
import { ConfirmCtx } from '../context/ConfirmCtx'
import { useHttp } from '../hooks/http.hook'
import { AddDriver } from './modals/AddDriver'
import { useHistory } from 'react-router'

export const Order = ({ e, windWidth, fs }) => {
  const hstr = useHistory()
  const [choosen, setChoosen] = useState(false)
  const { token, userType } = useContext(AuthCtx)
  const { loading, request } = useHttp()
  const { confirmHandler } = useContext(ConfirmCtx)
  const [orderState, setOrderState] = useState({ text: <Loader inline />, color: 'teal' })
  const [openAddCar, setOpenAddCar] = useState(false)
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

  const orderLoaded = () => {
    return () => {
      request(
        `/api/data/orderloaded`,
        'POST',
        { _id: e._id },
        {
          Authorization: `Bearer ${token}`
        }
      )
    }
  }

  const orderFinish = () => {
    return () => {
      request(
        `/api/data/orderfinish`,
        'POST',
        { _id: e._id },
        {
          Authorization: `Bearer ${token}`
        }
      )
    }
  }

  const orderCancel = () => {
    return () => {
      request(
        `/api/data/cancelorder`,
        'POST',
        { _id: e._id },
        {
          Authorization: `Bearer ${token}`
        }
      )
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
            Назначить автомобиль
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
        )
      }
      if (e.state === 'car_defined') {
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
          </Button>,
          <Button
            key={1155}
            loading={loading}
            size={'tiny'}
            onClick={(e) => {
              confirmHandler(orderFinish)
            }}
            color='grey'
          >
            Закрыть заявку
          </Button>
        )
      }
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
    } else if (userType === 'farm' && e.state === 'car_defined') {
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
      <AddDriver active={openAddCar} deactivate={setOpenAddCar} e={e} />
      <Segment.Group horizontal>
        <Segment
          style={{
            backgroundColor: e.state === 'canceled' ? 'rgba(200,200,200)' : 'rgba(245,245,245)',
            paddingTop: 0 + 'px',
            paddingBottom: 0 + 'px'
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
              <Form.Field style={{ width: fs.creator }}>
                <Input labelPosition='left' value={e?.uid?.fname}>
                  {windWidth < 768 && <Label>Заявитель </Label>}
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field style={{ width: fs.loadedDate }}>
                <Input
                  labelPosition='left'
                  value={e.loadedDate ? new Date(e.loadedDate)?.toLocaleDateString() + ', ' + new Date(e.loadedDate)?.toLocaleTimeString() : '- - -'}
                >
                  {windWidth < 768 && <Label>Дата загрузки </Label>}
                  <input></input>
                </Input>
              </Form.Field>

              <Form.Field style={{ width: fs.title }}>
                <Input fluid labelPosition='left' value={e.potatoes?.title}>
                  {windWidth < 768 && <Label>Сорт</Label>}
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
                {e?.car ? (
                  <Popup
                    flowing
                    hoverable
                    content={
                      <div>
                        <span>{e.driver?.fio}</span>
                        <br />
                        <a href={`tel:${e.driver?.phone}`}>{e.driver?.phone}</a>
                      </div>
                    }
                    trigger={
                      <Input fluid labelPosition='left' value={e?.car ? e.car : '- - -'}>
                        {windWidth < 768 && <Label>Автомобиль</Label>}
                        <input></input>
                      </Input>
                    }
                  />
                ) : (
                  <Input fluid labelPosition='left' value={'- - -'}>
                    {windWidth < 768 && <Label>Автомобиль</Label>}
                    <input></input>
                  </Input>
                )}
              </Form.Field>
              <Form.Field style={{ width: fs.deliverDate }}>
                <Input
                  labelPosition='left'
                  value={new Date(e.deliverDate)?.toLocaleDateString() + ', ' + new Date(e.deliverDate)?.toLocaleTimeString()}
                >
                  {windWidth < 768 && <Label>Дата доставки</Label>}
                  <input></input>
                </Input>
              </Form.Field>
              <Form.Field style={{ width: fs.loadedDate }}>
                <Input
                  labelPosition='left'
                  value={e.finishDate ? new Date(e.finishDate)?.toLocaleDateString() + ', ' + new Date(e.finishDate)?.toLocaleTimeString() : '- - -'}
                >
                  {windWidth < 768 && <Label>Дата загрузки </Label>}
                  <input></input>
                </Input>
              </Form.Field>
            </Form.Group>
            <div className={choosen ? 'btnGrpAnim on' : 'btnGrpAnim off'}>{orderButtons && orderButtons.length > 0 ? orderButtons : null}</div>
          </Form>
        </Segment>
      </Segment.Group>
    </>
  )
}
