import React, { useContext, useEffect, useState } from 'react'
import { Input, Button, Form, Modal, Header, Dropdown } from 'semantic-ui-react'
import { NewUser } from '../classes/User'
import { MessageCtx } from '../context/MessageCtx'
import { reqRegister } from '../backend/requests'
import { useHistory } from 'react-router'
import { useHttp } from '../hooks/http.hook'

export const Register = () => {
  const { loading, error, request } = useHttp()
  const [open, setOpen] = useState(true)
  const [data, setData] = useState({})
  const { messageHandler } = useContext(MessageCtx)
  const hst = useHistory()

  function onChangeHandler(e, type) {
    setData((prev) => {
      return { ...prev, [type]: e }
    })
  }

  async function submitForm() {
    try {
      const validatedData = new NewUser({ ...data })
      const res = await request('/api/auth/register', 'POST', validatedData)
      messageHandler(res.message, 'success')
      setData({})
    } catch (e) {
      messageHandler(error || e, 'error')
    }
  }

  return (
    <>
      <Modal size='small' closeOnDimmerClick={false} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
        <Modal.Header>Добро пожаловать!</Modal.Header>

        <Modal.Content>
          <Header>Для регистрации заполните поля ниже</Header>
          <Form>
            <Form.Field>
              <Input
                value={data.email || ''}
                onChange={(e) => {
                  onChangeHandler(e.target.value, 'email')
                }}
                placeholder='email'
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
            <Form.Field>
              <Input
                value={data.fname || ''}
                onChange={(e) => {
                  onChangeHandler(e.target.value, 'fname')
                }}
                placeholder='ФИО'
              />
            </Form.Field>
            <Form.Field>
              <Input
                value={data.position || ''}
                onChange={(e) => {
                  onChangeHandler(e.target.value, 'position')
                }}
                placeholder='должность'
              />
            </Form.Field>
            <Form.Field>
              <Dropdown
                placeholder='департамент'
                fluid
                selection
                value={data.type || ''}
                onChange={(e, val) => {
                  onChangeHandler(val.value, 'type')
                }}
                options={[
                  { key: 'logisticks', text: 'Депатрамент логистики', value: 'logisticks' },
                  { key: 'farm', text: 'Фермер', value: 'farm' }
                ]}
              />
            </Form.Field>
            {data && data.type === 'farm' && (
              <Form.Field>
                <Input
                  value={data.company || ''}
                  onChange={(e) => {
                    onChangeHandler(e.target.value, 'company')
                  }}
                  placeholder='ваша компания'
                />
              </Form.Field>
            )}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content='У меня уже есть учетная запись'
            color='blue'
            onClick={() => {
              hst.push('/auth/login/')
            }}
          ></Button>
          <Button content='Зарегистрироваться!' loading={loading} labelPosition='right' icon='checkmark' onClick={() => submitForm()} positive />
        </Modal.Actions>
      </Modal>
    </>
  )
}
