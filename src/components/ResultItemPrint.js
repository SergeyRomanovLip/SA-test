import { List, Accordion, Menu, Divider, Grid } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { generateId } from '../misc/generateId'
import { ComissionComponent } from './ComissionComponent'
import QRCode from 'react-qr-code'

export const ResultItemPrint = ({ forComission, res, i }) => {
  console.log(res?.dateId?.substr(8, 5))
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
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={12}>
              <h2 style={{ textAlign: 'left', margin: 5 }}>Протокол проверки знаний № {res?.dateId?.substr(8, 5)}</h2>
              <h3 style={{ textAlign: 'left', margin: 5 }}>по направлению "{res.course}"</h3>
            </Grid.Column>
            <Grid.Column textAlign={'right'} width={4}>
              <QRCode size={96} value={res?.dateId} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Grid columns={2}>
          <Grid.Row className='narrowRow'>
            <Grid.Column width={7}>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <b>Данные проверяемого:</b>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <b>ФИО:</b>
                  </Grid.Column>
                  <Grid.Column>{res.fio}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <b>Дата проверки:</b>
                  </Grid.Column>
                  <Grid.Column>{new Date(res.dateId.split('_')[0] * 1).toLocaleDateString()}</Grid.Column>
                </Grid.Row>
                {/* <Grid.Row>
                  <Grid.Column>
                    <b>Время проверки:</b>
                  </Grid.Column>
                  <Grid.Column>{new Date(res.dateId.split('_')[0] * 1).toLocaleTimeString()}</Grid.Column>
                </Grid.Row> */}
              </Grid>
            </Grid.Column>
            <Grid.Column width={9}>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <b>Комиссия:</b>
                  </Grid.Column>
                </Grid.Row>
                {commission.map((el) => {
                  return el.m ? (
                    <Grid.Row>
                      <Grid.Column width={12}>
                        <List.Header>{el.m}</List.Header>
                        <List.Description>{el.mp}</List.Description>
                      </Grid.Column>
                      <Grid.Column width={4} textAlign={'center'}>
                        <small style={{ color: 'gray' }}>подпись</small>
                      </Grid.Column>
                    </Grid.Row>
                  ) : null
                })}
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <ComissionComponent data={res} />
        <Divider></Divider>
        <List.Description as='p'>{` Правильных ответов: ${rightAnswers} из ${res.answers.length}`}</List.Description>
        <List.Header style={{ marginTop: 5, marginBottom: 5 }} as='h3'>
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
