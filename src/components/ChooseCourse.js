import react from 'react'
import { Container, Header, Card } from 'semantic-ui-react'
export const ChooseCourse = ({ histories, user, testTypes }) => {
  return (
    <div className='narrowContainer'>
      <Container fluid className='container'>
        <Header as='h2'>Добро пожаловать {user && user.fio}!</Header>
        <Header as='h3'>Пожалуйста, выберите тест</Header>
        {testTypes &&
          testTypes.map((e, i) => {
            return (
              <Card
                fluid
                onClick={() => {
                  histories.push(`${e.courseName}`)
                }}
                key={i}
              >
                <Card.Content>
                  <Card.Header>{e.courseName}</Card.Header>
                  <Card.Meta>
                    <span className='date'>{e.courseDescription}</span>
                  </Card.Meta>
                </Card.Content>
              </Card>
            )
          })}
      </Container>
    </div>
  )
}
