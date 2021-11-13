import React, { useContext, useEffect, useState } from 'react'
import { Form, Label, Item, Segment } from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
import { useHistory } from 'react-router'
import { Order } from './OrderOLD'
import { Register } from './modals/Register'
import { AddOrder } from './modals/AddOrder'
import { AddPotato } from './modals/AddPotato'

export const OrderViewport = ({ windWidth, orders }) => {
  const hstr = useHistory()
  const { userType } = useContext(AuthCtx)
  const [openAddPot, setOpenAddPot] = useState(false)
  const [openAddOrder, setOpenAddOrder] = useState(false)
  const [openAddUser, setOpenAddUser] = useState(false)
  const fs = {
    loadedDate: 200 + 'px',
    car: 150 + 'px',
    company: 330 + 'px',
    quantity: 120 + 'px',
    title: 250 + 'px',
    deliverDate: 200 + 'px',
    orderState: 150 + 'px',
    creator: 200 + 'px'
  }

  useEffect(() => {
    hstr.listen((location) => {
      switch (location.pathname) {
        case '/home/addPotato':
          setOpenAddPot(true)
          break
        case '/home/addUser':
          setOpenAddUser(true)
          break
        case '/home/addOrder':
          setOpenAddOrder(true)
          break
      }
    })
  }, [])

  return (
    <>
      {userType === 'logisticks' ? <AddOrder active={openAddOrder} deactivate={setOpenAddOrder} /> : null}
      <Register active={openAddUser} deactivate={setOpenAddUser} />
      <AddPotato active={openAddPot} deactivate={setOpenAddPot} />
      <Segment.Group horizontal className={'headers'}>
        <Segment
          style={{
            backgroundColor: 'rgba(245,245,245)',
            paddingTop: 5 + 'px',
            paddingBottom: 5 + 'px',
            paddingLeft: 20 + 'px'
          }}
        >
          {windWidth > 767 && (
            <Form>
              <Form.Group widths='7' className='headers'>
                <Form.Field style={{ width: fs.orderState }}>
                  <Label>Статус</Label>
                </Form.Field>
                <Form.Field style={{ width: fs.creator }}>
                  <Label> Заявитель </Label>
                </Form.Field>
                <Form.Field style={{ width: fs.loadedDate }}>
                  <Label>Дата загрузки </Label>
                </Form.Field>
                <Form.Field style={{ width: fs.title }}>
                  <Label>Сорт</Label>
                </Form.Field>
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
