import { useContext, useEffect, useState } from 'react'
import { AppContext } from './../context/AppContext'
import { SignIn } from './../adminAuth/SignIn'
import { SignUp } from './../adminAuth/SignUp'
import { Container, Card, Grid, Form, Segment, Dimmer, Loader, Image } from 'semantic-ui-react'
import { TestResults } from './TestResults'
import { ExcelUploadQuest } from '../components/ExcelUploadQuest'
import { ExcelUploadEmployees } from '../components/ExcelUploadEmployees'
import { useParams } from 'react-router-dom'

export const Admin = () => {
  const [loading, setLoading] = useState(false)
  const loadingHandler = (state) => {
    setLoading(state)
  }
  const { authenticated } = useContext(AppContext)
  const [hidePage, setHidePage] = useState(false)
  const para = useParams()
  useEffect(() => {
    if (para.print === 'print') {
      setHidePage('none')
    } else {
      setHidePage('block')
    }
  }, [para])

  if (authenticated) {
    return (
      <Container style={{ marginTop: 20 + 'px', display: hidePage }}>
        <Grid columns={2} divided>
          <Grid.Column width={10}>
            <TestResults />
          </Grid.Column>
          <Grid.Column width={5}>
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
      </Container>
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
