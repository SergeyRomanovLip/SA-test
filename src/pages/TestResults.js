import { useContext, useEffect, useState } from 'react'
import { getAllTestResults } from '../backend/firebase'
import { Button, Container, Dropdown, Icon, Sticky, Menu, Input, Dimmer, Loader } from 'semantic-ui-react'
import { ResultItem } from '../components/ResultItem'
import { generateId } from '../misc/generateId'
import { AppContext } from '../context/AppContext'
import { useHistory } from 'react-router-dom'

export const TestResults = () => {
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [filterDate, setFilterDate] = useState({ start: '', end: '' })
  const [resultsForShowing, setResultsForShowing] = useState([])
  const [courses, setCourses] = useState([])
  const [choosenCourse, setChoosenCourse] = useState('')
  const { setResultsForPrinting } = useContext(AppContext)
  const hstr = useHistory()

  const downloadResults = () => {
    let data = []
    resultsForShowing.forEach((e) => {
      e.answers.forEach((answ) => {
        data.push([
          new Date(e.dateId.split('_')[0] * 1).toLocaleDateString(),
          e.fio,
          e.position,
          e.course,
          answ.question,
          answ.answer,
          answ.right,
        ])
      })
    })

    function download_csv(data) {
      var csv = 'Date;Name;Position;Course;Question;Answer;Right\n'
      data.forEach(function (row) {
        csv += row.join(';')
        csv += '\n'
      })
      var hiddenElement = document.createElement('a')
      hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csv)
      hiddenElement.target = '_blank'
      hiddenElement.download = 'people.csv'
      hiddenElement.click()
    }
    download_csv(data)
  }
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

    setResultsForShowing(filteredArray)
    setResultsForPrinting(filteredArray)
  }, [choosenCourse, filterDate])

  useEffect(() => {
    setLoading(true)
    getAllTestResults()
      .then((res) => {
        setTestResults(res)
        setResultsForShowing(res)
        setResultsForPrinting(res)
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
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <Container className='container' style={{ overflow: 'auto', maxHeight: 90 + 'vh', minHeight: 40 + 'vh' }}>
      <Sticky offset={50} style={{ paddingLeft: 7 + 'px' }}>
        <Menu secondary color='teal'>
          <Input
            name='start'
            style={{ width: 170 + 'px' }}
            onChange={filterDateHandler}
            type='date'
            value={filterDate.start}
          />
          <Input
            style={{ width: 170 + 'px' }}
            onChange={filterDateHandler}
            type='date'
            name='end'
            value={filterDate.end}
          />
          <Dropdown
            placeholder='Выберите курс'
            onChange={(e, data) => {
              setChoosenCourse(data.value)
            }}
            selection
            options={courses}
          />
        </Menu>
        <Menu text secondary color='teal'>
          <Button
            icon
            onClick={() => {
              setFilterDate({ start: '', end: '' })
              setChoosenCourse('')
            }}
          >
            <Icon name='remove' />
          </Button>
          <Button
            icon
            onClick={() => {
              downloadResults()
            }}
          >
            <Icon name='download' />
          </Button>
          <Button
            icon
            onClick={() => {
              hstr.push('/admin/print')
            }}
          >
            <Icon name='print' />
          </Button>
        </Menu>
      </Sticky>
      {resultsForShowing ? (
        loading ? (
          <Dimmer active inverted>
            <Loader />
          </Dimmer>
        ) : (
          resultsForShowing
            .sort((a, b) => {
              return b.dateId.split('_')[0] * 1 - a.dateId.split('_')[0] * 1
            })
            .map((res, i) => {
              return <ResultItem key={i + generateId()} res={res} i={i} />
            })
        )
      ) : (
        <div>Пока нет результатов:</div>
      )}
    </Container>
  )
}
