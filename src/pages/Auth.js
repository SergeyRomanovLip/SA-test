import { useContext, useEffect, useState } from 'react'
import { Button, Form, Container, Header, Dimmer, Loader, Label, Input, Popup } from 'semantic-ui-react'
import { getData } from '../backend/firebase'
import SearchName from '../components/SearchName'
import { RoutesContext } from '../context/RoutesContext'

export const Auth = () => {
  const { histories } = useContext(RoutesContext)
  const [formState, setFormState] = useState({
    fio: '',
    position: '',
    department: '',
    password: '',
    company: '',
  })
  const [empPassword, setEmpPassword] = useState()
  const [company, setCompany] = useState()
  const [emplList, setEmplList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (company && formState.company) {
      getData('testEmployees', formState.company, setEmplList)
    }
  }, [company])

  const companyChangeHandler = async (tryCompany) => {
    setLoading(true)
    let res = await getData('testEmployees', tryCompany.toUpperCase())
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
        password: '',
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
    setEmpPassword(data.password)
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
                <Label>Вас зовут</Label>
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
                  <input
                    name='password'
                    value={formState.password}
                    onChange={changeHandler}
                    placeholder='Ваш код (3 последние цифры паспорта)'
                  />
                </Form.Field>
              ) : null}
              <Button
                disabled={
                  formState.department &&
                  formState.fio &&
                  formState.position &&
                  formState.password * 1 === empPassword * 1
                    ? false
                    : true
                }
                color='blue'
                type='submit'
                onClick={() => {
                  histories.push(
                    `/testready/${company.toUpperCase()}&${formState.fio}&${formState.position}&${
                      formState.department
                    }/`
                  )
                }}
              >
                Подтвердить
              </Button>
            </>
          ) : (
            <>
              <Form.Field>
                <Label>Трехзначный код вашей компании</Label>
                <Input name='company' value={formState.company} onChange={changeHandler} placeholder='Например KMS' />
              </Form.Field>
              <Button
                color='teal'
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
