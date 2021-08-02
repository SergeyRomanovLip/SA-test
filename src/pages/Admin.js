import { useContext, useState } from 'react'
import { AppContext } from './../context/AppContext'
import { SignIn } from './../adminAuth/SignIn'
import { SignUp } from './../adminAuth/SignUp'
import { Container, Card, Grid, Form, Segment, Dimmer, Loader, Image } from 'semantic-ui-react'
import { TestResults } from './TestResults'
import { ExcelUpload, ExcelUploadQuest } from '../components/ExcelUploadQuest'
import { ExcelUploadEmployees } from '../components/ExcelUploadEmployees'

export const Admin = () => {
  const [loading, setLoading] = useState(false)
  const loadingHandler = (state) => {
    setLoading(state)
  }
  const { authenticated } = useContext(AppContext)
  if (authenticated) {
    return (
      <Grid columns={2} divided>
        <Grid.Column>
          <TestResults />
        </Grid.Column>
        <Grid.Column>
          <Form>
            {loading ? (
              <Segment>
                <Dimmer active>
                  <Loader indeterminate>Preparing Files</Loader>
                </Dimmer>
                <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
              </Segment>
            ) : (
              <ExcelUploadQuest loadingHandler={loadingHandler} />
            )}
            {loading ? (
              <Segment>
                <Dimmer active>
                  <Loader indeterminate>Preparing Files</Loader>
                </Dimmer>
                <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
              </Segment>
            ) : (
              <ExcelUploadEmployees loadingHandler={loadingHandler} />
            )}
          </Form>
        </Grid.Column>
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
