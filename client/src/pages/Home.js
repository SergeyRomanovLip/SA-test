import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Checkbox, Divider, Form, Grid, GridColumn, GridRow, Image, Label, Loader, Segment } from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
import { useHttp } from './../hooks/http.hook'

import { OrderViewport } from '../components/OrderViewport'
import { Filter } from '../components/Filter'
import { uniqVal } from './../utils/uniqVal'

export const Home = (flags) => {
  const [windowDemensions, setWindowDimensions] = useState({ width: 1000 })
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height
    }
  }
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { userId, token, userType, userData } = useContext(AuthCtx)
  const { loading, request } = useHttp()

  const [openCreateOrderModal, setopenCreateOrderModal] = useState(false)

  const [filters, setFilters] = useState({ state: ['created', 'car_defined', 'loaded'] })

  const filtersHandler = (e, type) => {
    if (type === 'state' && e === null) {
      setFilters((prev) => {
        return { ...prev, [type]: ['created', 'car_defined', 'loaded'] }
      })
    } else if (type === 'state' && e !== null) {
      setFilters((prev) => {
        return { ...prev, [type]: [e] }
      })
    } else {
      setFilters((prev) => {
        return { ...prev, [type]: e }
      })
    }
  }

  const radioFilterHandler = (e, type) => {
    if (!e) {
      setFilters((prev) => {
        let newArray = prev.state.filter((e) => e !== type)
        return { ...prev, state: newArray }
      })
    } else {
      setFilters((prev) => {
        return { ...prev, state: [...prev.state, type] }
      })
    }
  }

  const [requestedData, setRequestedData] = useState()
  const dataRequest = async (what) => {
    console.log('Обновление началось')
    const res = await request(
      `/api/data/${what}`,
      'POST',
      { userId },
      {
        Authorization: `Bearer ${token}`
      }
    )
    setRequestedData((prev) => {
      return { ...prev, [what]: res }
    })
    console.log('Обновлено')
    return res
  }

  useEffect(() => {
    dataRequest('orders')
  }, [])

  return (
    // <Container>
    <>
      <Form style={{ maxWidth: 800 + 'px' }}>
        <Form.Group widths='5'>
          <Form.Field>
            {userType === 'logisticks' ? (
              <Button
                className='addOrder'
                color='orange'
                onClick={() => {
                  setopenCreateOrderModal((prev) => {
                    return prev ? false : true
                  })
                }}
              >
                Добавить новую заявку
              </Button>
            ) : null}
          </Form.Field>
          <Form.Field>
            <Filter
              requestFoo={() => {
                return dataRequest('farmers')
              }}
              field={'company'}
              setterForValue={filtersHandler}
              placeholder={'фермер'}
            />
          </Form.Field>
          <Form.Field>
            <Filter
              array={requestedData?.orders
                ?.map((e) => {
                  return e.state
                })
                .filter(uniqVal)
                .map((e) => {
                  let newe = { key: null, text: null, value: null }
                  if (e === 'canceled') {
                    newe = { key: 'canceled', text: 'Отменена', value: 'canceled' }
                  } else if (e === 'created') {
                    newe = { key: 'created', text: 'Создана', value: 'created' }
                  } else if (e === 'car_defined') {
                    newe = { key: 'car_defined', text: 'Назначен автомобиль', value: 'car_defined' }
                  } else if (e === 'loaded') {
                    newe = { key: 'loaded', text: 'Машина загружена', value: 'loaded' }
                  } else if (e === 'finished') {
                    newe = { key: 'finished', text: 'Завершена', value: 'finished' }
                  }
                  return newe
                })}
              field={'state'}
              setterForValue={filtersHandler}
              placeholder={'статус'}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              onChange={(e, data) => {
                radioFilterHandler(data.checked, 'finished')
              }}
              label='Показывать завершенные'
              toggle
            ></Checkbox>
          </Form.Field>
          <Form.Field>
            <Checkbox
              onChange={(e, data) => {
                radioFilterHandler(data.checked, 'canceled')
              }}
              label='Показывать отклоненные'
              toggle
            ></Checkbox>
          </Form.Field>
        </Form.Group>
      </Form>

      <Loader inverted active={loading} />
      <OrderViewport
        windowDemensions={windowDemensions}
        filters={filters}
        orders={requestedData?.orders}
        update={() => {
          dataRequest('orders')
        }}
        openCreateOrderModal={openCreateOrderModal}
        setopenCreateOrderModal={setopenCreateOrderModal}
      />
    </>
  )
}
