import { useContext, useEffect, useState } from 'react'
import { Button, Form, Container, Header, Dimmer, Loader } from 'semantic-ui-react'
import SearchName from '../components/SearchName'
import { V } from '../config'
import { RoutesContext } from '../context/RoutesContext'
import { getData } from '../misc/TT'

//Добавить в firebase таблицу: компания -название, урлы - для доступа к вопросам и списку сотрудников, коды - для проверки принадлежности
export const Auth = () => {
  const { histories } = useContext(RoutesContext)
  const [formState, setFormState] = useState({
    fio: '',
    position: '',
    department: '',
  })
  const [emplList, setEmplList] = useState([])

  useEffect(() => {
    getData(V.EMPL, setEmplList, 'empl')
  }, [])

  const changeHandler = (e) => {
    setFormState((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  const filler = (data) => {
    setFormState({
      fio: data.title,
      position: data.position,
      department: data.department,
    })
  }

  return (
    <div className='narrowContainer'>
      <Container fluid className='container'>
        <Header as='h2'>Добро пожаловать в тестирование!</Header>
        <Form className='form'>
          {emplList && emplList.length !== 0 ? (
            <SearchName source={emplList} filler={filler} />
          ) : (
            <Dimmer active inverted>
              <Loader inverted />
            </Dimmer>
          )}
          <div className='ui divider'></div>
          <Form.Field>
            <input name='position' value={formState.position} onChange={changeHandler} placeholder='Ваша должность' />
          </Form.Field>
          <Form.Field>
            <input name='position' value={formState.department} onChange={changeHandler} placeholder='Ваш отдел' />
          </Form.Field>
          <Button
            color='blue'
            type='submit'
            onClick={() => {
              histories.push(`/testready/${formState.fio}&${formState.position}&${formState.department}/`)
            }}
          >
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  )
}
