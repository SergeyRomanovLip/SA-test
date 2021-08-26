import { useEffect, useState } from 'react'
import { generateId } from '../misc/generateId'
import { Card, List } from 'semantic-ui-react'

export const TestItem = ({ e, i, answerHandler, answers }) => {
  const [id, setId] = useState()
  useEffect(() => {
    setId(generateId())
  }, [])

  return (
    <Card key={id} fluid={true} color='purple'>
      <Card.Content>
        <Card.Header>{`${i + 1}. ${e.q}`}</Card.Header>
        <List animated={true}>
          {e.answers.map((a, i) => {
            // console.log(answers[id] && answers[id].answers[i].answer)
            return (
              <List.Item
                style={{
                  cursor: 'pointer',
                  color:
                    answers[id] && answers[id].answers[i].answer === a.answer && answers[id].answers[i].choosen
                      ? 'black'
                      : 'gray',
                }}
                active={true}
                key={i}
                onClick={() => {
                  answerHandler(a, e, id)
                }}
              >
                <List.Icon
                  name={
                    answers[id] && answers[id].answers[i].answer === a.answer && answers[id].answers[i].choosen
                      ? 'circle'
                      : 'circle outline'
                  }
                />
                {a.answer}
              </List.Item>
            )
          })}
        </List>
      </Card.Content>
    </Card>
  )
}
