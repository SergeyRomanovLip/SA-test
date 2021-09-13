import { List, Accordion, Menu, Divider } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { generateId } from '../misc/generateId'
import { ComissionComponent } from './ComissionComponent'

export const ResultItemPrint = ({ forComission, res, i }) => {
  const [rightAnswers, setRightAnswers] = useState(0)
  const [commission, setComission] = useState([])
  useEffect(() => {
    let numberOfRightAnswers = 0
    res.answers.forEach((e) => {
      if (e.right === 'ok') {
        numberOfRightAnswers += 1
      }
    })
    setRightAnswers(numberOfRightAnswers)
  }, [])

  const comissionFinder = () => {
    if (forComission?.length > 0) {
      forComission.every((el) => {
        if (el.type == res.course) {
          let comis = [
            {
              m: el.memb1,
              mp: el.membpos1,
            },
            {
              m: el.memb2,
              mp: el.membpos2,
            },
            {
              m: el.memb3,
              mp: el.membpos3,
            },
            {
              m: el.memb4,
              mp: el.membpos4,
            },
            {
              m: el.memb5,
              mp: el.membpos5,
            },
          ]
          setComission(comis)
          return false
        } else {
          return true
        }
      })
    }
  }

  useEffect(comissionFinder, [forComission, res])

  return (
    <List className='applicant-break' key={i + 42} divided>
      <List.Content>
        <h1 style={{ textAlign: 'center', margin: 5 }}>Протокол проверки знаний {generateId()}</h1>
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
          <List>
            {commission.map((el) => {
              return el.m ? (
                <List.Item>
                  <List.Header>{el.m}</List.Header>
                  <List.Description>{el.mp}</List.Description>
                </List.Item>
              ) : null
            })}
          </List>
        </List.Header>
        <List.Header style={{ marginTop: 5, marginBottom: 5 }} as='p'>
          {new Date(res.dateId.split('_')[0] * 1).toLocaleTimeString()}
        </List.Header>
        <List.Description as='p'>{` Правильных ответов: ${rightAnswers} из ${res.answers.length}`}</List.Description>
        <List.Description as='p'>{``}</List.Description>
        <ComissionComponent data={res} />
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
