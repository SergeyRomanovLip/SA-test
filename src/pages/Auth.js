import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Form, Container, Header, Dimmer, Loader, Label } from 'semantic-ui-react'
import { getData } from '../backend/firebase'
import SearchName from '../components/SearchName'
import { RoutesContext } from '../context/RoutesContext'

//Добавить в firebase таблицу: компания -название, урлы - для доступа к вопросам и списку сотрудников, коды - для проверки принадлежности
export const Auth = () => {
  const { histories } = useContext(RoutesContext)
  const [formState, setFormState] = useState({
    fio: '',
    position: '',
    department: '',
    key: '',
  })
  const [empKey, setEmpKey] = useState()
  const [company, setCompany] = useState()
  const [emplList, setEmplList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getData('testEmployees', formState.company, setEmplList)
    console.log('data is gotten')
  }, [company])

  const companyChangeHandler = async (tryCompany) => {
    setLoading(true)
    let res = await getData('testEmployees', tryCompany)
    if (res) {
      setCompany(tryCompany)
      setEmplList(res)
    } else {
      alert('Такой компании нет в списке, попробуйте еще раз')
      setFormState({
        fio: '',
        position: '',
        department: '',
        company: '',
      })
    }
    setLoading(false)
  }
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
    console.log(data.key)
    setEmpKey(data.key)
  }

  return (
    <div className='narrowContainer'>
      <Container fluid className='container'>
        <Header as='h2'>Добро пожаловать в тестирование!</Header>
        <Form className='form'>
          {loading && (
            <Dimmer active inverted>
              <Loader inverted />
            </Dimmer>
          )}
          {company ? (
            <>
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
                <input
                  readOnly
                  name='position'
                  style={{ background: '#EAEAEA' }}
                  value={formState.position}
                  onChange={changeHandler}
                  placeholder='Ваша должность'
                />
              </Form.Field>
              <Form.Field>
                <Label>Ваша отдел</Label>
                <input
                  readOnly
                  style={{ background: '#EAEAEA' }}
                  name='department'
                  value={formState.department}
                  onChange={changeHandler}
                  placeholder='Ваш отдел'
                />
              </Form.Field>
              {formState.department && formState.fio && formState.position ? (
                <Form.Field>
                  <Label>Укажите ваш код</Label>
                  <input name='key' value={formState.key} onChange={changeHandler} placeholder='Ваш код' />
                </Form.Field>
              ) : null}
              <Button
                disabled={
                  formState.department && formState.fio && formState.position && formState.key * 1 === empKey * 1
                    ? false
                    : true
                }
                color='blue'
                type='submit'
                onClick={() => {
                  histories.push(
                    `/testready/${company}&${formState.fio}&${formState.position}&${formState.department}/`
                  )
                }}
              >
                Submit
              </Button>
            </>
          ) : (
            <>
              <Form.Field>
                <Label>Укажите название вашей компании</Label>
                <input name='company' value={formState.company} onChange={changeHandler} placeholder='Ваша компания' />
              </Form.Field>

              <Button
                color='blue'
                type='submit'
                onClick={() => {
                  companyChangeHandler(formState.company)
                }}
              >
                Подтвердить
              </Button>
            </>
          )}
        </Form>
      </Container>
    </div>
  )
}
