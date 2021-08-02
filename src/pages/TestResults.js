import { useEffect, useState } from 'react'
import { getAllTestResults } from '../backend/firebase'
import { Input, Form, Button, Container, Dropdown, Sticky } from 'semantic-ui-react'
import { ResultItem } from '../components/ResultItem'
import { generateId } from '../misc/generateId'
import { Link } from 'react-router-dom'

export const TestResults = () => {
  const [testResults, setTestResults] = useState([])
  const [filterDate, setFilterDate] = useState({ start: '', end: '' })
  const [resultsForShowing, setResultsForShowing] = useState([])
  const [courses, setCourses] = useState([])
  const [choosenCourse, setChoosenCourse] = useState('')

  const filterDateHandler = (event) => {
    setFilterDate((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      }
    })
  }
  useEffect(() => {
    if (filterDate.start > filterDate.end) {
      setFilterDate((prev) => {
        return {
          ...prev,
          end: filterDate.start,
        }
      })
    }
  }, [filterDate])

  useEffect(() => {
    let filteredArray = testResults.map((e) => e)
    if (filterDate.start != '' && filterDate.end != '') {
      filteredArray = filteredArray.filter((res) => {
        const startDate = res.dateId.split('_')[0] * 1 > new Date(filterDate.start).getTime()
        const endDate = res.dateId.split('_')[0] * 1 < new Date(filterDate.end).getTime() + 24 * 60 * 60 * 1000
        console.log(startDate && endDate)
        return startDate && endDate
      })
    }
    if (choosenCourse) {
      filteredArray = filteredArray.filter((element) => {
        return element.course === choosenCourse
      })
    }
    console.log(filteredArray)
    setResultsForShowing(filteredArray)
  }, [choosenCourse, filterDate])

  useEffect(() => {
    getAllTestResults().then((res) => {
      setTestResults(res)
      setResultsForShowing(res)
      let courses = []
      res.forEach((el) => {
        courses.push({ key: el.course, text: el.course, value: el.course, image: null })
      })
      let uniqCourses = new Set()
      let filteredArr = courses.filter((obj) => {
        const isPresentInSet = uniqCourses.has(obj.key)
        uniqCourses.add(obj.key)
        return !isPresentInSet
      })
      setCourses(filteredArr)
    })
  }, [])

  return (
    <Container className='container'>
      <Sticky offset={50}>
        <Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <Input
                onChange={filterDateHandler}
                type='date'
                label='Дата начала'
                name='start'
                value={filterDate.start}
              />
            </Form.Field>
            <Form.Field>
              <Input
                onChange={filterDateHandler}
                type='date'
                label='Дата окончания'
                name='end'
                value={filterDate.end}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field>
              <Dropdown
                placeholder='Выберите курс'
                onChange={(e, data) => {
                  setChoosenCourse(data.value)
                }}
                fluid
                selection
                options={courses}
              />
            </Form.Field>

            <Form.Field>
              <Button
                onClick={() => {
                  setFilterDate({ start: '', end: '' })
                  setChoosenCourse('')
                }}
              >
                Очистить фильтр
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </Sticky>
      {resultsForShowing ? (
        resultsForShowing.map((res, i) => {
          return <ResultItem key={i + generateId()} res={res} i={i} />
        })
      ) : (
        <div>Пока нет результатов:</div>
      )}
    </Container>
  )
}
