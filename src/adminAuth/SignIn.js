import React, { useContext, useState } from 'react'
import { Button, Header, Modal, Form, Label, Message } from 'semantic-ui-react'
import { logIn } from './../backend/firebase'
import { AppContext } from './../context/AppContext'

export const SignIn = () => {
  const { setLoading } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const [sgnUp, sgnUpState] = useState({ email: '', password: '' })

  const changeHandler = (e) => {
    sgnUpState((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} trigger={<Button>Войти</Button>}>
      <Modal.Header>Войти в систему</Modal.Header>
      <Modal.Content>
        <Header>Укажите ваши данные</Header>
        <Form className='form'>
          <Form.Field>
            <Label>Укажите ваш E-Mail</Label>
            <input type='email' name='email' value={sgnUp.email} onChange={changeHandler} placeholder='e-mail' />
          </Form.Field>
          <Form.Field>
            <Label>Укажите пароль</Label>
            <input type='password' name='password' value={sgnUp.password} onChange={changeHandler} placeholder='пароль' />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Отменить
        </Button>
        <Button
          disabled={sgnUp.email && sgnUp.password ? false : true}
          content='Войти'
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            logIn(sgnUp, setLoading)
            setOpen(false)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
export default SignIn
