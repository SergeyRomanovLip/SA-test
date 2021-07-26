import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChooseCourse } from '../components/ChooseCourse'
import { TestAnswer } from '../components/TestAnswer'
import { V } from '../config'
import { RoutesContext } from '../context/RoutesContext'
import { getData } from '../misc/TT'
const Tabletop = require('tabletop')

export const Test = () => {
  const params = useParams()
  const { histories } = useContext(RoutesContext)
  const [testState, setTestState] = useState([])
  const [testTypes, setTestTypes] = useState([])

  useEffect(() => {
    getData(V.QUEST, setTestTypes, 'Data')
  }, [])

  useEffect(() => {
    if (params.course) {
      getData(V.QUEST, setTestState, 'Questions')
    }
  }, [params.course])

  if (!params.course) {
    return (
      <div style={{ padding: 10 + 'px' }}>
        <ChooseCourse histories={histories} user={params} testTypes={testTypes} />
      </div>
    )
  } else if (params.course && testState.length > 0) {
    return (
      <div style={{ padding: 25 + 'px' }}>
        <TestAnswer user={params} testState={testState} />
      </div>
    )
  } else {
    return null
  }
}
