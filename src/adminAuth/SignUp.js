import { useEffect, useState } from 'react'
import { Button, Header, Modal, Form, Label, Message } from 'semantic-ui-react'
import { createUser } from '../backend/firebase'

export const SignUp = () => {
  const [open, setOpen] = useState(false)
  const [sgnUp, sgnUpState] = useState({ email: '', password: '', password2: '', company: '', key: '' })
  const [passwordState, setPasswordState] = useState(false)

  useEffect(() => {
    if (sgnUp.password === sgnUp.password2) {
      setPasswordState(true)
    } else {
      setPasswordState(false)
    }
  }, [sgnUp.password, sgnUp.password2])

  const changeHandler = (e) => {
    sgnUpState((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} trigger={<Button>Зарегистрироваться</Button>}>
      <Modal.Header>Регистрация</Modal.Header>
      <Modal.Content>
        <Header>Укажите ваши данные</Header>
        <Form className='form'>
          <Form.Field>
            <Label>Укажите ваш E-Mail</Label>
            <input type='email' name='email' value={sgnUp.email} onChange={changeHandler} placeholder='e-mail' />
          </Form.Field>
          <Form.Field>
            <Label>Укажите название компании</Label>
            <input name='company' value={sgnUp.company} onChange={changeHandler} placeholder='Название компании' />
          </Form.Field>
          <Form.Field>
            <Label>Укажите ключ компании</Label>
            <input name='key' value={sgnUp.key} onChange={changeHandler} placeholder='Ключ для компании' />
          </Form.Field>
          <Form.Field>
            <Label>Укажите пароль</Label>
            <input type='password' name='password' value={sgnUp.password} onChange={changeHandler} placeholder='пароль' />
          </Form.Field>
          <Form.Field>
            <Label>Укажите пароль еще раз</Label>
            <input type='password' name='password2' value={sgnUp.password2} onChange={changeHandler} placeholder='пароль еще раз' />
          </Form.Field>
        </Form>
        {passwordState ? null : <Message warning header='Обратите внимание' list={['Пароли должны совпадать']} />}
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Отменить
        </Button>
        <Button
          disabled={sgnUp.email && sgnUp.password && sgnUp.password2 && sgnUp.company && sgnUp.key && passwordState ? false : true}
          content='Зарегистрироваться'
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            createUser(sgnUp)
            setOpen(false)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
