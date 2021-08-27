import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChooseCourse } from '../components/ChooseCourse'
import { TestAnswer } from '../components/TestAnswer'
import { RoutesContext } from '../context/RoutesContext'
import { Dimmer, Loader } from 'semantic-ui-react'
import { getData, getTestResult } from '../backend/firebase'

export const Test = () => {
  const params = useParams()
  const { histories } = useContext(RoutesContext)
  const [testState, setTestState] = useState([])
  const [loading, setLoading] = useState(false)
  const [readyTests, setReadyTests] = useState([])
  const [testTypes, setTestTypes] = useState([])
  const reloadHandler = (data) => {
    getTestResult(data).then(histories.push(`/testready/${params.company}&${params.fio}&${params.position}&${params.department}/`))
  }

  const getDataHandler = async () => {
    setLoading(true)
    const res = await getData('testQuestions', params.company)
    if (res) {
      setTestState(res)
      let courses = []
      res.forEach((el) => {
        if (!courses.includes(`${el.type}_${el.description}`)) {
          courses.push(`${el.type}_${el.description}`)
        }
      })
      setTestTypes(courses)
    } else {
      alert('Что то пошло не так')
    }
    setLoading(false)
  }
  const setReadyQuestionsHandler = () => {
    if (params.course && testState) {
      const readyQ = testState.filter((el) => {
        return el.type === params.course
      })
      setReadyTests(readyQ)
    }
  }

  useEffect(getDataHandler, [])
  useEffect(setReadyQuestionsHandler, [params.course])

  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader inverted />
      </Dimmer>
    )
  }
  if (!params.course) {
    return testTypes.length !== 0 ? (
      <div style={{ padding: 25 + 'px' }}>
        <ChooseCourse histories={histories} user={params} testTypes={testTypes} />
      </div>
    ) : (
      <Dimmer active inverted>
        <Loader inverted />
      </Dimmer>
    )
  } else if (params.course && readyTests.length > 0) {
    return (
      <div style={{ padding: 25 + 'px' }}>
        <TestAnswer user={params} testState={readyTests} reloadHandler={reloadHandler} />
      </div>
    )
  } else {
    return (
      <Dimmer active inverted>
        <Loader inverted />
      </Dimmer>
    )
  }
}
