import { List, Accordion, Menu, Divider } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { generateId } from '../misc/generateId'

export const ResultItemPrint = ({ res, i }) => {
  const [rightAnswers, setRightAnswers] = useState(0)
  useEffect(() => {
    let numberOfRightAnswers = 0
    res.answers.forEach((e) => {
      if (e.right === 'ok') {
        numberOfRightAnswers += 1
      }
    })
    setRightAnswers(numberOfRightAnswers)
  }, [])
  return (
    <List className='applicant-break' key={i + 42} divided>
      <List.Content>
        <h1 style={{ textAlign: 'center', margin: 5 }}>Протокол проверки знаний</h1>
        <h2 style={{ textAlign: 'center', margin: 5 }}>по направлению "{res.course}"</h2>
        <List.Header style={{ marginTop: 30, marginBottom: 5 }} as='h4'>
          ФИО: <p></p>
        </List.Header>
        <List.Header style={{ marginTop: 5, marginBottom: 5 }} as='p'>
          {res.fio}
        </List.Header>
        <List.Header style={{ marginTop: 5, marginBottom: 5 }} as='h4'>
          Дата проверки:
        </List.Header>
        <List.Header style={{ marginTop: 5, marginBottom: 5 }} as='p'>
          {new Date(res.dateId.split('_')[0] * 1).toLocaleDateString()}
        </List.Header>
        <List.Header style={{ marginTop: 5, marginBottom: 5 }} as='h4'>
          Время проверки:
        </List.Header>
        <List.Header style={{ marginTop: 5, marginBottom: 5 }} as='p'>
          {new Date(res.dateId.split('_')[0] * 1).toLocaleTimeString()}
        </List.Header>
        <List.Description as='p'>{` Правильных ответов: ${rightAnswers} из ${res.answers.length}`}</List.Description>
        <List.Description as='p'>{``}</List.Description>
        <Divider></Divider>
        <List.Header style={{ marginTop: 5, marginBottom: 5 }} as='h2'>
          Результаты проверки знаний
        </List.Header>
        <List divided relaxed>
          {res.answers.map((e, i) => {
            return (
              <List.Item key={i + 15 + generateId()}>
                <List.Icon
                  size='large'
                  verticalAlign='middle'
                  color={e.right === 'ok' ? 'green' : 'red'}
                  name={e.right === 'ok' ? 'check circle outline' : 'dont'}
                />
                <List.Content>
                  <List.Header>{e.question}</List.Header>
                  <List.Description>{e.answer}</List.Description>
                </List.Content>
              </List.Item>
            )
          })}
        </List>
        <Divider></Divider>

        <p className='signPlaceMark' style={{ marginBottom: 0 }}>
          С результатами ознакомлен(а), {res.fio} <span className='signPlace'>___________________________</span>
        </p>
      </List.Content>
    </List>
  )
}
