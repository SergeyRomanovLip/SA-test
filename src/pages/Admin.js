import { useContext } from 'react'
import { AppContext } from './../context/AppContext'
import { SignIn } from './../adminAuth/SignIn'
import { SignUp } from './../adminAuth/SignUp'
import { Container, Card, Grid } from 'semantic-ui-react'
import { TestResults } from './TestResults'

export const Admin = () => {
  const { authenticated } = useContext(AppContext)
  if (authenticated) {
    return (
      <Grid columns={2} divided>
        <Grid.Column>
          <TestResults />
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid>
    )
  } else {
    return (
      <Container>
        <Card.Group>
          <Card fluid>
            <SignUp />
          </Card>
          <Card fluid>
            <SignIn />
          </Card>
        </Card.Group>
      </Container>
    )
  }
}
