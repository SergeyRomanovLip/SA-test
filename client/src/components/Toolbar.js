import React, { useContext, useEffect, useState } from 'react'
import { Dropdown, Icon, Image, Loader, Menu, MenuItem, Sticky } from 'semantic-ui-react'
import { ToolbarCtx } from './../context/ToolbarCtx'
import { useAuth } from './../hooks/auth.hook'
import { useHistory } from 'react-router'
import { AuthCtx } from '../context/AuthCtx'

export const Toolbar = (props) => {
  const { userData, userType } = useContext(AuthCtx)
  const [activeItem, setActiveItem] = useState('Orders')
  const hstr = useHistory()
  const handleItemClick = (e, { name }) => setActiveItem(name)
  const { logout } = useAuth()

  const [windowDemensions, setWindowDimensions] = useState({ width: 1000 })
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height
    }
  }
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ToolbarCtx.Provider value={activeItem}>
      <Menu style={{ width: 100 + 'vw' }} fluid color='orange'>
        <Menu.Item>
          <img style={{ width: 150 + 'px' }} src='/logo.png' />
        </Menu.Item>
        {windowDemensions.width > 810 ? (
          <Menu.Item name='Orders' active={activeItem === 'Orders'} onClick={handleItemClick}>
            Активные заявки
          </Menu.Item>
        ) : null}
        <Dropdown item icon={windowDemensions.width < 810 && 'settings'} text={windowDemensions.width > 810 && 'Настройки'}>
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
          {windowDemensions.width > 810 && 'Выйти'}
        </Menu.Item>

        <Menu.Item>
          <div style={{ width: windowDemensions.width > 810 ? 200 + 'px' : 40 + 'px' }}>
            <Image floated='right' size='mini' src={userData?.avt || '/avatarph.png'} />
            {windowDemensions.width > 810 && (
              <p>
                {userData?.fname || <Loader active inline />}
                <br />
                {userType && <b>{userType === 'logisticks' ? 'Терминал логистики' : 'Терминал фермера'}</b>}
              </p>
            )}
          </div>
        </Menu.Item>
      </Menu>
      {props.children}
    </ToolbarCtx.Provider>
  )
}
