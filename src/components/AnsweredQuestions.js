import { useEffect, useState } from 'react'
import { List, Button, Header, Sticky, Card } from 'semantic-ui-react'
import { addTestResult } from '../backend/firebase'

export const AnsweredQuestions = ({ answers, questions, user, reloadHandler, readyToSend }) => {
  return (
    <>
      {readyToSend && (
        <Sticky offset={50}>
          <Card>
            <Card.Content extra>
              <Card.Header as='h4'>Вы ответили на все вопросы</Card.Header>
              <Button
                color={'teal'}
                // positive
                onClick={() => {
                  addTestResult(answers, user).then((res) => reloadHandler(res))
                }}
              >
                Отправить?
              </Button>
            </Card.Content>
          </Card>
        </Sticky>
      )}
      {Object.keys(answers).map((e, i) => {
        return (
          <List key={i + 42} divided>
            <List.Content>
              <List.Header as={'a'} style={{ color: 'gray' }}>
                {answers[e].question}
              </List.Header>
              <List.Description>
                {answers[e].answers.map((a) => {
                  if (a.choosen) {
                    return a.answer
                  }
                })}
              </List.Description>
            </List.Content>
            <div className='ui divider'></div>
          </List>
        )
      })}
    </>
  )
}
