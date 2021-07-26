import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChooseCourse } from '../components/ChooseCourse'
import { TestAnswer } from '../components/TestAnswer'
import { V } from '../config'
import { RoutesContext } from '../context/RoutesContext'
import { getData } from '../misc/TT'
import { Dimmer, Loader } from 'semantic-ui-react'

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
    return testTypes.length !== 0 ? (
      <div style={{ padding: 25 + 'px' }}>
        <ChooseCourse histories={histories} user={params} testTypes={testTypes} />
      </div>
    ) : (
      <Dimmer active inverted>
        <Loader inverted />
      </Dimmer>
    )
  } else if (params.course && testState.length > 0) {
    return (
      <div style={{ padding: 25 + 'px' }}>
        <TestAnswer user={params} testState={testState} />
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
