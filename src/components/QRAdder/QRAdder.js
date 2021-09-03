import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Button, Divider, List } from 'semantic-ui-react'
import { QRAdderCreater } from './QRAdderCreater'

export const QRAdder = () => {
  const para = useParams()
  const hstr = useHistory()
  console.log(para)
  return (
    <>
      <List>
        <List.Item>
          <List.Icon name='folder' />
          <List.Content>
            <List.Header>site</List.Header>
            <List.Description>Your site's theme</List.Description>
          </List.Content>
        </List.Item>
        <List.Item>Что за лист</List.Item>
      </List>
      {para.create === 'create' && <QRAdderCreater />}
      <Divider></Divider>
      <Button.Group>
        <Button
          onClick={() => {
            hstr.push('/qr/add/create')
          }}
        >
          Создать модель данных
        </Button>
        <Button.Or></Button.Or>
        <Button
          onClick={() => {
            hstr.goBack()
          }}
        >
          Вернуться
        </Button>
      </Button.Group>
    </>
  )
}
