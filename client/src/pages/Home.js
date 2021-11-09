import React, { useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Form, Loader } from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
import { useHttp } from './../hooks/http.hook'

import { OrderViewport } from '../components/OrderViewport'
import { Filter } from '../components/Filter'
import { uniqVal } from './../utils/uniqVal'
import { useDimensions } from '../hooks/screen.hook'
import { MessageCtx } from '../context/MessageCtx'

export const Home = () => {
  const storageName = 'lwmMernFltr'
  const { userId, token, userType, userData } = useContext(AuthCtx)
  const { messageHandler } = useContext(MessageCtx)
  const { loading, request } = useHttp()
  const { windWidth } = useDimensions()
  const [openCreateOrderModal, setopenCreateOrderModal] = useState(false)

  const [filters, setFilters] = useState({
    state: JSON.parse(localStorage.getItem(storageName))?.state || ['created', 'car_defined', 'loaded'],
    company: JSON.parse(localStorage.getItem(storageName))?.company || []
  })
  const filtersHandler = (e, type) => {
    if (type === 'state' && e === null) {
      setFilters((prev) => {
        return { ...prev, [type]: ['created', 'car_defined', 'loaded'] }
      })
    } else if (type === 'state' && e !== null) {
      setFilters((prev) => {
        return { ...prev, [type]: [e] }
      })
    } else if (type === 'company' && e === null) {
      setFilters((prev) => {
        return { ...prev, [type]: requestedData?.farmers.map((e) => e._id) }
      })
    } else if (type === 'company' && e !== null) {
      setFilters((prev) => {
        return { ...prev, [type]: [e] }
      })
    }
  }
  useEffect(() => {
    dataRequest('farmers').then((res) => {
      if (filters?.company?.length < 1) {
        setFilters((prev) => {
          return { ...prev, company: res.map((e) => e._id) }
        })
      }
    })
  }, [])
  useEffect(() => {
    if (filters.state && filters.company) {
      dataRequest('orders', filters)
      localStorage.setItem(storageName, JSON.stringify(filters))
    }
  }, [filters])

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
  const dataRequest = async (what, options) => {
    const res = await request(
      `/api/data/${what}`,
      'POST',
      { userId, options },
      {
        Authorization: `Bearer ${token}`
      }
    )
    setRequestedData((prev) => {
      return { ...prev, [what]: res }
    })
    return res
  }

  const getRealtimeData = ({ data }) => {
    const resp = JSON.parse(data)
    if (resp.message) {
      messageHandler(resp.message, 'success')
    }
    if (resp.update) {
      dataRequest(resp.update, filters)
    }
  }
  const getErrorFromSse = (e) => {
    messageHandler('Соединение прервано, нажмите F5', 'error')
    console.log('Подключение потеряно')
  }

  useEffect(() => {
    if (userId) {
      const sse = new EventSource(
        `http://localhost:5000/sseupdate?uid=${userId}&fname=${userData?.fname}&company=${userData?.company}&position=${userData?.position}`,
        {}
      )
      sse.addEventListener('message', getRealtimeData)
      sse.addEventListener('error', getErrorFromSse)
      return () => {
        sse.removeEventListener('message', getRealtimeData)
        sse.removeEventListener('error', getErrorFromSse)
      }
    }
  }, [userId])

  return (
    <>
      <Form style={{ maxWidth: 100 + 'vw' }}>
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
          <Form.Field width='five'>
            <Filter
              array={requestedData?.farmers?.map((e) => {
                return { key: e._id, text: e.company, value: e._id }
              })}
              field={'company'}
              setterForValue={filtersHandler}
              placeholder={'фермер'}
              filterValue={filters}
            />
          </Form.Field>
          <Form.Field width='five'>
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
              filterValue={filters}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              checked={filters.state?.includes('finished') ? true : false}
              onChange={(e, data) => {
                radioFilterHandler(data.checked, 'finished')
              }}
              label='Показывать завершенные'
              toggle
            ></Checkbox>
          </Form.Field>
          <Form.Field>
            <Checkbox
              checked={filters.state?.includes('canceled') ? true : false}
              onChange={(e, data) => {
                radioFilterHandler(data.checked, 'canceled')
              }}
              label='Показывать отклоненные'
              toggle
            ></Checkbox>
          </Form.Field>
        </Form.Group>
      </Form>

      <Loader active={loading} />
      <OrderViewport
        windWidth={windWidth}
        orders={requestedData?.orders}
        update={() => {
          dataRequest('orders', filters)
        }}
        openCreateOrderModal={openCreateOrderModal}
        setopenCreateOrderModal={setopenCreateOrderModal}
      />
    </>
  )
}
