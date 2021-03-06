import { List, Accordion, Menu } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { generateId } from '../misc/generateId'

export const ResultItem = ({ res, i }) => {
  const [rightAnswers, setRightAnswers] = useState(0)
  const [accordionIndex, setAccordionIndex] = useState({ activeIndex: 1 })
  const accordionHandleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = accordionIndex
    const newIndex = activeIndex === index ? -1 : index
    setAccordionIndex({ activeIndex: newIndex })
  }
  useEffect(() => {
    let numberOfRightAnswers = 0
    res.answers.forEach((e) => {
      if (e.right === 'ok') {
        numberOfRightAnswers += 1
      }
    })
    setRightAnswers(numberOfRightAnswers)
  }, [])
  return (
    <List key={i + 42} divided>
      <List.Content>
        <List.Header as='h4'>{`${res.fio}, ${new Date(res.dateId.split('_')[0] * 1).toLocaleDateString()}, ${new Date(
          res.dateId.split('_')[0] * 1
        ).toLocaleTimeString()}`}</List.Header>
        <List.Description as='p'>{`Название курса: ${res.course}. Правильных ответов: ${rightAnswers} из ${res.answers.length}`}</List.Description>
        <List.Description as='p'>{``}</List.Description>
        <Accordion as={Menu} vertical fluid>
          <Menu.Item>
            <Accordion.Title
              active={accordionIndex.activeIndex === 0}
              content='Посмотреть ответы'
              index={0}
              onClick={accordionHandleClick}
            />
            <Accordion.Content
              active={accordionIndex.activeIndex === 0}
              content={
                <List divided relaxed>
                  {res.answers.map((e, i) => {
                    return (
                      <List.Item key={i + 15 + generateId()}>
                        <List.Icon
                          size='large'
                          verticalAlign='middle'
                          color={e.right === 'ok' ? 'green' : 'red'}
                          name={e.right === 'ok' ? 'check circle outline' : 'dont'}
                        />
                        <List.Content>
                          <List.Header>{e.question}</List.Header>
                          <List.Description>{e.answer}</List.Description>
                        </List.Content>
                      </List.Item>
                    )
                  })}
                </List>
              }
            />
          </Menu.Item>
        </Accordion>
      </List.Content>
      <div className='ui divider'></div>
    </List>
  )
}
