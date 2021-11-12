import React, { useContext, useEffect, useState } from 'react'
import { Button, Header, Input, Form, Modal, Dropdown, List, Label, Item, Segment } from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
import { useHttp } from './../hooks/http.hook'
import { MessageCtx } from './../context/MessageCtx'
import { useHistory } from 'react-router'
import { Order } from './OrderOLD'

export const OrderViewport = ({ windWidth, orders, openCreateOrderModal, setopenCreateOrderModal }) => {
  const hstr = useHistory()
  const { token, userId, userType } = useContext(AuthCtx)
  const { messageHandler } = useContext(MessageCtx)
  const { loading, error, request } = useHttp()
  const fs = {
    loadedDate: 200 + 'px',
    car: 150 + 'px',
    company: 250 + 'px',
    quantity: 120 + 'px',
    title: 250 + 'px',
    deliverDate: 200 + 'px',
    orderState: 150 + 'px',
  }
  const [requestedData, setRequestedData] = useState()
  const dataRequest = async (what, options) => {
    const res = await request(
      `/api/data/${what}`,
      'POST',
      { userId },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    setRequestedData((prev) => {
      return { ...prev, [what]: res }
    })
    return res
  }

  const [addOrderData, setAddOrderData] = useState({})
  const addOrderDataHandler = (e, type) => {
    setAddOrderData((prev) => {
      return { ...prev, [type]: e }
    })
  }

  const addNewOrder = () => {
    request(
      `/api/data/addorder`,
      'POST',
      { ...addOrderData, uid: userId },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  }
  const [openAddPot, setOpenAddPot] = useState(false)
  const [addPotData, setAddPotData] = useState({})
  const addPotDataHandler = (e, type) => {
    setAddPotData((prev) => {
      return { ...prev, [type]: e }
    })
  }

  const addNewPot = async () => {
    const res = request(
      `/api/data/addpot`,
      'POST',
      { ...addPotData },
      {
        Authorization: `Bearer ${token}`,
      }
    ).then(() => {
      dataRequest('potatoes')
    })
  }

  useEffect(() => {
    dataRequest('potatoes')
    hstr.listen((location) => {
      switch (location.pathname) {
        case '/home/addPotato':
          setOpenAddPot(true)
      }
    })
  }, [])

  const [sorting, setSorting] = useState([])
  const handleSorting = () => {}

  return (
    <>
      {userType === 'logisticks' ? (
        <Modal
          size='tiny'
          closeOnDimmerClick={false}
          onClose={() => setopenCreateOrderModal(false)}
          onMount={() => {
            dataRequest('farmers')
            dataRequest('potatoes')
          }}
          open={openCreateOrderModal}
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
                              <b>{e.company}</b>
                            </p>
                            <p>
                              {e.fname}, {e.position}
                            </p>
                          </>
                        ),
                        value: e._id,
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
                        value: e._id,
                      }
                    }) || [{ key: '1', text: '...', value: '' }]
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>дата доставки</label>
                <Input
                  value={addOrderData.date || ''}
                  onChange={(e) => {
                    addOrderDataHandler(e.target.value, 'date')
                  }}
                  placeholder='дата доставки'
                  type='datetime-local'
                />
              </Form.Field>
              {/* <Form.Field>
                <label>Количество</label>
                <Input
                  value={addOrderData.quantity || ''}
                  onChange={(e) => {
                    addOrderDataHandler(e.target.value, 'quantity')
                  }}
                  placeholder='Количество'
                  type='number'
                />
              </Form.Field> */}
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content='Закрыть'
              onClick={() => {
                setopenCreateOrderModal(false)
              }}
              labelPosition='right'
              icon='close'
            ></Button>
            <Button
              content='Подтвердить'
              color='teal'
              loading={loading}
              labelPosition='right'
              icon='checkmark'
              onClick={() => addNewOrder()}
            />
          </Modal.Actions>
        </Modal>
      ) : null}

      <Modal
        size='tiny'
        closeOnDimmerClick={false}
        onClose={() => {
          hstr.goBack()
          setOpenAddPot(false)
        }}
        onOpen={() => {
          dataRequest('potatoes')
          setOpenAddPot(true)
        }}
        open={openAddPot}
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
            content='Отменить'
            color='red'
            onClick={() => {
              hstr.goBack()
              setOpenAddPot(false)
            }}
            labelPosition='right'
            icon='close'
          ></Button>
          <Button
            content='Подтвердить'
            loading={loading}
            labelPosition='right'
            icon='checkmark'
            onClick={() => addNewPot()}
            positive
          />
        </Modal.Actions>
      </Modal>
      <Segment.Group horizontal className={'headers'}>
        <Segment
          style={{
            backgroundColor: 'rgba(245,245,245)',
            paddingTop: 5 + 'px',
            paddingBottom: 5 + 'px',
            paddingLeft: 20 + 'px',
          }}
        >
          {windWidth > 767 && (
            <Form>
              <Form.Group widths='7' className='headers'>
                <Form.Field style={{ width: fs.orderState }}>
                  <Label>Статус</Label>
                </Form.Field>
                <Form.Field style={{ width: fs.loadedDate }}>
                  <Label>Дата загрузки </Label>
                </Form.Field>
                <Form.Field style={{ width: fs.title }}>
                  <Label>Сорт</Label>
                </Form.Field>
                {/* <Form.Field style={{ width: fs.quantity }}>
                  <Label>Количество</Label>
                </Form.Field> */}
                <Form.Field style={{ width: fs.company }}>
                  <Label>Контрагент</Label>
                </Form.Field>
                <Form.Field style={{ width: fs.car }}>
                  <Label>Автомобиль</Label>
                </Form.Field>
                <Form.Field style={{ width: fs.deliverDate }}>
                  <Label>Дата доставки</Label>
                </Form.Field>
                <Form.Field style={{ width: fs.deliverDate }}>
                  <Label>Дата разгрузки</Label>
                </Form.Field>
              </Form.Group>
            </Form>
          )}
        </Segment>
      </Segment.Group>
      <Segment className={'main'} style={{ overflowY: 'scroll', maxHeight: 80 + 'vh', width: 100 + '%' }}>
        <Item.Group>
          {orders
            ?.sort((a, b) => {
              //by delivery date
              return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
            })
            .map((e, i) => {
              return <Order key={e._id} fs={fs} e={e} windWidth={windWidth} />
            })}
        </Item.Group>
      </Segment>
    </>
  )
}
