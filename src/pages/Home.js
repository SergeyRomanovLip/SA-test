import react from 'react'
import { Link } from 'react-router-dom'
import { Card, Grid, Container, Header } from 'semantic-ui-react'

export const Home = () => {
  return (
    <div className='narrowContainer'>
      <Container fluid className='container'>
        <Header as='h2'>Добро пожаловать в систему обучения Smart-Audit</Header>
        <Card fluid>
          <Card.Content>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                  <Card.Header>Ознакомиться с системой</Card.Header>
                </Grid.Column>
                <Grid.Column>
                  <Link to='/auth'>Войти в систему для сдачи теста</Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </Container>
    </div>
  )
}
