import React, { useContext, useEffect, useState } from 'react'
import { Divider, Dropdown, Icon, Image, Loader, Menu, MenuItem, Sticky } from 'semantic-ui-react'
import { ToolbarCtx } from './../context/ToolbarCtx'
import { useAuth } from './../hooks/auth.hook'
import { useHistory } from 'react-router'
import { AuthCtx } from '../context/AuthCtx'
import { useDimensions } from '../hooks/screen.hook'

export const Toolbar = (props) => {
  const { userData, userType } = useContext(AuthCtx)
  const [activeItem, setActiveItem] = useState('Orders')
  const hstr = useHistory()
  const handleItemClick = (e, { name }) => setActiveItem(name)
  const { logout } = useAuth()
  const { windWidth } = useDimensions()

  return (
    <ToolbarCtx.Provider value={activeItem}>
      <Menu style={{ width: 100 + 'vw' }} fluid color='orange'>
        <Menu.Item>
          <img style={{ width: 150 + 'px' }} src='/logo.png' />
        </Menu.Item>
        {windWidth > 810 && (
          <Menu.Item name='Orders' active={activeItem === 'Orders'} onClick={handleItemClick}>
            Активные заявки
          </Menu.Item>
        )}
        <Dropdown item icon={windWidth < 810 && 'settings'} text={windWidth > 810 ? 'Настройки' : ''}>
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
        <Menu.Item position='right'>
          <div style={{ width: windWidth > 810 ? 250 + 'px' : 40 + 'px' }}>
            <Image
              floated='right'
              size='mini'
              style={{ margin: 0 + 'px', padding: 0 + 'px' }}
              src={userData?.avt || '/avatarph.png'}
            />
            {windWidth > 810 && (
              <p>
                {userData?.fname || <Loader active inline />}
                <br />
                {userType && <b>{userType === 'logisticks' ? 'Терминал логистики' : 'Терминал фермера'}</b>}
              </p>
            )}
          </div>
        </Menu.Item>
        <Menu.Item name='Exit' active={activeItem === 'Exit'} onClick={logout}>
          <Icon name='sign-out' />
          {windWidth > 810 && 'Выйти'}
        </Menu.Item>
      </Menu>
      {props.children}
    </ToolbarCtx.Provider>
  )
}
