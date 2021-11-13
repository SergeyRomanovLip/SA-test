import React, { useContext, useEffect, useState } from 'react'
import { Input, Button, Form, Modal, Header } from 'semantic-ui-react'
import { MessageCtx } from '../context/MessageCtx'
import { useHistory } from 'react-router'
import { useHttp } from './../hooks/http.hook'
import { AuthCtx } from '../context/AuthCtx'

export const Login = () => {
  const { loading, error, request } = useHttp()
  const { login } = useContext(AuthCtx)
  const [open, setOpen] = useState(true)
  const [data, setData] = useState({})
  const { messageHandler } = useContext(MessageCtx)
  const hst = useHistory()

  function onChangeHandler(e, type) {
    console.log(data)
    setData((prev) => {
      return { ...prev, [type]: e }
    })
  }

  async function submitForm() {
    try {
      const res = await request('/api/auth/login', 'POST', data)

      if (res && res.token) {
        login(res.token, res.userId, res.expire, res.type, res.fname, res.position, res.company)
      }
      setData({})
    } catch (e) {
      messageHandler(error || e, 'error')
    }
  }

  return (
    <>
      <Modal size='tiny' closeOnDimmerClick={false} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
        <Modal.Header>Добро пожаловать!</Modal.Header>

        <Modal.Content>
          <Header>Авторизуйтесь</Header>
          <Form>
            <Form.Field>
              <Input
                value={data.email || ''}
                onChange={(e) => {
                  onChangeHandler(e.target.value.toLowerCase(), 'email')
                }}
                placeholder='логин'
                type='email'
              />
            </Form.Field>
            <Form.Field>
              <Input
                value={data.password || ''}
                onChange={(e) => {
                  onChangeHandler(e.target.value, 'password')
                }}
                placeholder='пароль'
                type='password'
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {/* <Button
            content='У меня еще нет учетной записи'
            color='blue'
            onClick={() => {
              hst.push('/auth/reg/')
            }}
          ></Button> */}
          <Button content='Авторизоваться!' loading={loading} labelPosition='right' icon='checkmark' onClick={() => submitForm()} positive />
        </Modal.Actions>
      </Modal>
    </>
  )
}
