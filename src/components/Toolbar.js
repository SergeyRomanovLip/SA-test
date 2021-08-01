import React, { Component, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Icon, Menu, Sticky } from 'semantic-ui-react'
import { logOut } from '../backend/firebase'

export const Toolbar = () => {
  const [state, setState] = useState({ activeItem: '' })
  const hstr = useHistory()

  return (
    <Sticky>
      <Menu>
        <Menu.Item name='logout' active={state.activeItem === 'logout'} onClick={logOut}>
          <Icon name='log out' />
          Выйти
        </Menu.Item>
        <Menu.Item
          name='home'
          active={state.activeItem === 'home'}
          onClick={() => {
            hstr.push('/home')
          }}
        >
          <Icon name='home' />
          На главную
        </Menu.Item>

        <Menu.Item
          name='reviews'
          active={state.activeItem === 'reviews'}
          onClick={() => {
            hstr.push('/auth')
          }}
        >
          Тесты
        </Menu.Item>

        <Menu.Item
          name='upcomingEvents'
          active={state.activeItem === 'upcomingEvents'}
          onClick={() => {
            hstr.push('/admin')
          }}
        >
          Панель администратора
        </Menu.Item>
      </Menu>
    </Sticky>
  )
}
