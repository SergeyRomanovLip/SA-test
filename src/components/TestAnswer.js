import { useEffect, useState, useRef } from 'react'
import { Container, Sticky, Ref, Card, Grid } from 'semantic-ui-react'
import { getRandom } from '../misc/getRandom'
import { AnsweredQuestions } from './AnsweredQuestions'
import { TestItem } from './TestItem'

export const TestAnswer = ({ user, testState, reloadHandler }) => {
  const contextRef = useRef()
  const [questionList, setQuestionList] = useState([])
  const [answers, setAnswers] = useState({})
  const answerHandler = (a, e, id) => {
    setAnswers((prev) => {
      let answer = { question: e.q, answers: e.answers, id }
      answer.answers.map((e) => {
        if (e.answer === a.answer) {
          return (e.choosen = true)
        } else {
          e.choosen = false
          return e
        }
      })
      return { ...prev, [id]: answer }
    })
  }

  const createQuestionlist = () => {
    let questions = getRandom(testState, 10)
    let questionList = []
    for (let item in questions) {
      let readyQuestion = { q: questions[item].question, answers: [] }
      testState.forEach((e) => {
        if (questions[item].question === e.question) {
          readyQuestion.answers.push({ answer: e.answer, right: e.rightAnswer })
        }
      })
      questionList.push(readyQuestion)
    }
    setQuestionList(questionList)
  }
  useEffect(() => {
    if (testState) {
      createQuestionlist()
    }
  }, [testState])

  useEffect(() => {}, [answers])

  return (
    <Container fluid className='container'>
      <Ref innerRef={contextRef}>
        <Grid columns={2} divided>
          <Grid.Column>
            <Sticky context={contextRef} offset={50}>
              <Card color={'blue'} fluid>
                <Card.Content>
                  <Card.Header as='h2'>Добро пожаловать {user && user.fio}!</Card.Header>
                  <Card.Description>Вам необходимо ответить на все вопросы</Card.Description>
                  <Card.Meta>Осталось вопросов {questionList.length && questionList.length - Object.keys(answers).length}</Card.Meta>
                </Card.Content>
              </Card>
            </Sticky>
            {questionList.map((e, i) => {
              return <TestItem key={i} e={e} i={i} answerHandler={answerHandler} answers={answers} />
            })}
          </Grid.Column>
          <Grid.Column>
            <Sticky context={contextRef}>
              <AnsweredQuestions answers={answers} questions={questionList} user={user} reloadHandler={reloadHandler} />
            </Sticky>
          </Grid.Column>
        </Grid>
      </Ref>
    </Container>
  )
}
