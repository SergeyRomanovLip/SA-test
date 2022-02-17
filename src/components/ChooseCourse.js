import { Container, Header, Card } from 'semantic-ui-react'
export const ChooseCourse = ({ histories, user, testTypes }) => {
  let arrayFilteredByDepartment = testTypes.filter((el) =>
    el.replace(/\s/g, '').includes(user.department.replace(/\s/g, ''))
  )
  if (arrayFilteredByDepartment.length === 0) {
    arrayFilteredByDepartment = testTypes
  }

  return (
    <div className='narrowContainer'>
      <Container fluid className='container'>
        <Header as='h2'>Добро пожаловать {user && user.fio}!</Header>
        <p>Должность: {user.position}</p>
        <p>Департамент: {user.department}</p>
        <Header as='h3'>Пожалуйста, выберите тест</Header>
        {testTypes &&
          arrayFilteredByDepartment.map((e, i) => {
            return (
              <Card
                fluid
                onClick={() => {
                  histories.push(e.split('_')[0])
                }}
                key={i}
              >
                <Card.Content>
                  <Card.Header>{e.split('_')[0]}</Card.Header>
                  <Card.Meta>
                    <span className='date'>{e.split('_')[1]}</span>
                  </Card.Meta>
                </Card.Content>
              </Card>
            )
          })}
      </Container>
    </div>
  )
}
