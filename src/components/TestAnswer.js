import { useEffect, useState, useContext } from 'react'
import { Container, Sticky, Card, Grid, List, Button } from 'semantic-ui-react'
import { getRandom } from '../misc/getRandom'
import { AnsweredQuestions } from './AnsweredQuestions'
import { TestItem } from './TestItem'
import { AppContext } from './../context/AppContext'
import { addTestResult } from '../backend/firebase'

export const TestAnswer = ({ user, testState, reloadHandler }) => {
  const { width, setLoading } = useContext(AppContext)
  const [questionList, setQuestionList] = useState([])
  const [answers, setAnswers] = useState({})
  const [readyToSend, setReadyToSend] = useState(false)

  useEffect(() => {
    if (Object.keys(answers).length === questionList.length) {
      setReadyToSend(true)
    } else {
      setReadyToSend(false)
    }
  }, [answers, questionList])

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
      <Grid columns={width > 900 ? 2 : 1} divided>
        <Grid.Column style={{ overflow: 'auto', maxHeight: 90 + 'vh' }}>
          <Sticky offset={50}>
            <Card color={'teal'} fluid>
              <Card.Content>
                <Card.Header as='h2'>Добро пожаловать {user && user.fio}!</Card.Header>
                <Card.Description>Вам необходимо ответить на все вопросы</Card.Description>
                <Card.Meta>Осталось вопросов {questionList.length && questionList.length - Object.keys(answers).length}</Card.Meta>
                {readyToSend && width < 901 ? (
                  <Button
                    color={'teal'}
                    onClick={() => {
                      setLoading(true)
                      addTestResult(answers, user)
                        .then((res) => reloadHandler(res))
                        .finally(() => {
                          setLoading(false)
                        })
                    }}
                  >
                    Отправить?
                  </Button>
                ) : null}
              </Card.Content>
            </Card>
          </Sticky>
          <List>
            {questionList.map((e, i) => {
              return <TestItem key={i} e={e} i={i} answerHandler={answerHandler} answers={answers} />
            })}
          </List>
        </Grid.Column>
        {width > 900 ? (
          <Grid.Column style={{ overflow: 'auto', maxHeight: 90 + 'vh' }}>
            <AnsweredQuestions answers={answers} questions={questionList} user={user} reloadHandler={reloadHandler} readyToSend={readyToSend} />
          </Grid.Column>
        ) : null}
      </Grid>
    </Container>
  )
}
