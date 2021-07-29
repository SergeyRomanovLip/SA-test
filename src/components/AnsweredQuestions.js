import react, { useEffect, useState, useRef } from 'react'
import { List, Button, Header } from 'semantic-ui-react'
import { addBook, addTestResult } from '../backend/firebase'

export const AnsweredQuestions = ({ answers, questions, user, reloadHandler }) => {
  const [readyToSend, setReadyToSend] = useState(false)

  useEffect(() => {
    if (Object.keys(answers).length === questions.length) {
      setReadyToSend(true)
    } else {
      setReadyToSend(false)
    }
  }, [answers, questions])
  return (
    <>
      {readyToSend && (
        <>
          <Header as='h4'>Вы ответили на все вопросы</Header>
          <Button.Group>
            <Button
              positive
              onClick={() => {
                addTestResult(answers, user).then((res) => reloadHandler(res))
              }}
            >
              Отправить?
            </Button>
          </Button.Group>
          <div className='ui divider'></div>
        </>
      )}
      {Object.keys(answers).map((e, i) => {
        return (
          <List key={i + 42} divided>
            <List.Content>
              <List.Header as='a'>{answers[e].question}</List.Header>
              <List.Description as='p'>
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
