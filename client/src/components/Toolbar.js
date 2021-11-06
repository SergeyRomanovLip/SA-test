import React, { useState } from 'react'
import { Dropdown, Icon, Menu, Sticky } from 'semantic-ui-react'
import { ToolbarCtx } from './../context/ToolbarCtx'
import { useAuth } from './../hooks/auth.hook'
import { useHistory } from 'react-router'

export const Toolbar = (props) => {
  const [activeItem, setActiveItem] = useState('Orders')
  const hstr = useHistory()
  const handleItemClick = (e, { name }) => setActiveItem(name)
  const { logout } = useAuth()

  return (
    <ToolbarCtx.Provider value={activeItem}>
      <Menu color='orange'>
        <Menu.Item>
          <img style={{ width: 200 + 'px' }} src='/logo.png' />
        </Menu.Item>
        <Menu.Item name='Orders' active={activeItem === 'Orders'} onClick={handleItemClick}>
          Активные заявки
        </Menu.Item>
        <Dropdown item text='Настройки'>
          <Dropdown.Menu>
            <Dropdown.Item
              icon='edit'
              onClick={() => {
                hstr.push('/home/addPotato')
              }}
              text='Добавить номенклатуру'
            />
            <Dropdown.Item icon='globe' text='Choose Language' />
            <Dropdown.Item icon='settings' text='Account Settings' />
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item name='Exit' position='right' active={activeItem === 'Exit'} onClick={logout}>
          <Icon name='sign-out' />
          Выйти
        </Menu.Item>
      </Menu>
      {props.children}
    </ToolbarCtx.Provider>
  )
}
