import { useContext, useEffect, useState } from 'react'
import { Button, Form, Container, Header, Dimmer, Loader, Label } from 'semantic-ui-react'
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
    department: ''
  })
  const [emplList, setEmplList] = useState([])
  const [companyList, setCompanyList] = useState([])

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
      department: data.department
    })
  }

  return (
    <div className='narrowContainer'>
      <Container fluid className='container'>
        <Header as='h2'>Добро пожаловать в тестирование!</Header>
        <Form className='form'>
          <Form.Field>
            <Label>Выберите вашу компанию</Label>
            {emplList && emplList.length !== 0 ? (
              <SearchName source={emplList} filler={filler} />
            ) : (
              <Dimmer active inverted>
                <Loader inverted />
              </Dimmer>
            )}
          </Form.Field>
          <Form.Field>
            <Label>Ваc зовут</Label>
            {emplList && emplList.length !== 0 ? (
              <SearchName source={emplList} filler={filler} />
            ) : (
              <Dimmer active inverted>
                <Loader inverted />
              </Dimmer>
            )}
          </Form.Field>
          <div className='ui divider'></div>
          <Form.Field>
            <Label>Ваша должность</Label>
            <input name='position' value={formState.position} onChange={changeHandler} placeholder='Ваша должность' />
          </Form.Field>
          <Form.Field>
            <Label>Ваша отдел</Label>
            <input name='department' value={formState.department} onChange={changeHandler} placeholder='Ваш отдел' />
          </Form.Field>
          <Button
            disabled={formState.department && formState.fio && formState.position ? false : true}
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
