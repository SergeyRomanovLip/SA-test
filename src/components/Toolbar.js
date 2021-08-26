import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Icon, Menu, Sticky } from 'semantic-ui-react'
import { logOut } from '../backend/firebase'
import { AppContext } from '../context/AppContext'

export const Toolbar = () => {
  const hstr = useHistory()
  const [state, setState] = useState({ activeItem: hstr.location.pathname.split('/')[1] })
  const { authenticated } = useContext(AppContext)

  useEffect(() => {
    hstr.listen((e) => {
      setState({ activeItem: e.pathname.split('/')[1] })
    })
  }, [hstr])

  return (
    <Sticky>
      <Menu tabular color='teal' style={{ backgroundColor: 'white' }}>
        {authenticated && (
          <Menu.Item
            name='logout'
            active={state.activeItem === 'logout'}
            onClick={() => {
              logOut()
            }}
          >
            <Icon name='log out' />
            Выйти
          </Menu.Item>
        )}
        {/* <Menu.Item
          name='home'
          active={state.activeItem === 'home'}
          onClick={() => {
            setState({ activeItem: 'home' })
            hstr.push('/home')
          }}
        >
          <Icon name='home' />
          На главную
        </Menu.Item> */}

        <Menu.Item
          name='auth'
          active={state.activeItem === 'auth' || state.activeItem === 'testready'}
          onClick={() => {
            hstr.push('/auth')
          }}
        >
          <Icon name='clipboard list' />
          Тесты
        </Menu.Item>

        <Menu.Item
          name='admin'
          active={state.activeItem === 'admin'}
          onClick={() => {
            hstr.push('/admin')
          }}
        >
          <Icon name='adn' />
          Панель администратора
        </Menu.Item>
      </Menu>
    </Sticky>
  )
}
