import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Icon, Menu, Sticky, Divider, Button } from 'semantic-ui-react'
import { logOut } from '../backend/firebase'
import { AppContext } from '../context/AppContext'

export const Toolbar = () => {
  const { width } = useContext(AppContext)
  const hstr = useHistory()
  const [state, setState] = useState({ activeItem: hstr.location.pathname.split('/')[1] })
  const { authenticated } = useContext(AppContext)

  useEffect(() => {
    hstr.listen((e) => {
      setState({ activeItem: e.pathname.split('/')[1] })
    })
  }, [hstr])

  return (
    <>
      <Sticky className={'toolbar'}>
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
          {hstr.location.pathname === '/admin/print' ? (
            <Menu.Item>
              <Button
                position={'center'}
                color='purple'
                name='print'
                active={true}
                onClick={() => {
                  window.print()
                }}
              >
                <Icon name='print' />
                Отправить на печать
              </Button>
            </Menu.Item>
          ) : null}
          <Menu.Item position={'right'}>
            {width > 900 && (
              <>
                <Icon color={'teal'} name={'info circle'}></Icon>
                При возникновении проблем писать в WhatsApp &nbsp;<a href='tel:+7-962-351-80-86'>+7 (962) 351-80-86 </a>
              </>
            )}
          </Menu.Item>
        </Menu>
      </Sticky>
      {width < 901 && (
        <Menu style={{ position: 'fixed', bottom: 0, zIndex: 999 }}>
          <Menu.Item position={'center'}>
            <Icon color={'teal'} name={'info circle'}></Icon>
            При возникновении проблем писать в WhatsApp &nbsp;<a href='tel:+7-962-351-80-86'>+7 (962) 351-80-86 </a>
          </Menu.Item>
        </Menu>
      )}
    </>
  )
}
