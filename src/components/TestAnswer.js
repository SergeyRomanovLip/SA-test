import { useEffect, useState, useRef } from 'react'
import { Container, Sticky, Ref, Card, Grid, Rail, List } from 'semantic-ui-react'
import { getRandom } from '../misc/getRandom'
import { AnsweredQuestions } from './AnsweredQuestions'
import { TestItem } from './TestItem'

export const TestAnswer = ({ user, testState, reloadHandler }) => {
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

  return (
    <Container fluid className='container'>
      <Grid columns={2} divided>
        <Grid.Column style={{ overflow: 'auto', maxHeight: 90 + 'vh' }}>
          <Sticky offset={50}>
            <Card color={'teal'} fluid>
              <Card.Content>
                <Card.Header as='h2'>Добро пожаловать {user && user.fio}!</Card.Header>
                <Card.Description>Вам необходимо ответить на все вопросы</Card.Description>
                <Card.Meta>
                  Осталось вопросов {questionList.length && questionList.length - Object.keys(answers).length}
                </Card.Meta>
              </Card.Content>
            </Card>
          </Sticky>
          <List>
            {questionList.map((e, i) => {
              return <TestItem key={i} e={e} i={i} answerHandler={answerHandler} answers={answers} />
            })}
          </List>
        </Grid.Column>
        <Grid.Column style={{ overflow: 'auto', maxHeight: 90 + 'vh' }}>
          <AnsweredQuestions answers={answers} questions={questionList} user={user} reloadHandler={reloadHandler} />
        </Grid.Column>
      </Grid>
    </Container>
  )
}
