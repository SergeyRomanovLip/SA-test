import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Form, Loader } from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
import { useHttp } from './../hooks/http.hook'
import { OrderViewport } from '../components/OrderViewport'
import { Filter } from '../components/Filter'
import { uniqVal } from './../utils/uniqVal'
import { useDimensions } from '../hooks/screen.hook'
import { MessageCtx } from '../context/MessageCtx'
import { useHistory } from 'react-router'

export const Home = () => {
  const hstr = useHistory()
  const storageName = 'lwmMernFltr'
  const { userId, token, userType, userData } = useContext(AuthCtx)
  const { messageHandler } = useContext(MessageCtx)
  const { loading, request } = useHttp()
  const { windWidth } = useDimensions()
  const [openCreateOrderModal, setopenCreateOrderModal] = useState(false)
  const [filters, setFilters] = useState({})
  const [rstFilters, setRstFilters] = useState({})
  const latestFilters = useRef(filters)
  const latestRstFilters = useRef(rstFilters)
  const setFiltersRef = (data) => {
    latestFilters.current = data
    setFilters(data)
  }
  const setRstFiltersRef = (data) => {
    latestRstFilters.current = data
    setRstFilters(data)
  }

  const init = async () => {
    console.log('initialization...')
    const LSFltrs = JSON.parse(localStorage.getItem(storageName))
    const farm = await dataRequest('farmers').then((res) => res.map((farmer) => farmer._id))
    const state = ['created', 'car_defined', 'loaded']
    const RstFltrs = {
      farm,
      state
    }
    const initFilters = {
      state: LSFltrs?.state ? LSFltrs.state : RstFltrs.state,
      farm: LSFltrs?.farm ? LSFltrs.farm : RstFltrs.farm
    }
    setRstFiltersRef(RstFltrs)
    setFiltersRef(initFilters)
    dataRequest('orders', initFilters)
    console.log('initialization finished')
  }

  const resetFltrs = (type) => {
    setFiltersRef((prev) => {
      localStorage.setItem(storageName, JSON.stringify({ ...prev, [type]: rstFilters[type] }))
      dataRequest('orders', { ...prev, [type]: rstFilters[type] })
      return { ...prev, [type]: rstFilters[type] }
    })
  }
  const filtersHandler = (e, type, opt) => {
    let fltr = filters
    if (!opt && type && e) {
      fltr[type] = [e]
    } else if (opt) {
      if (filters.state?.includes(e)) {
        fltr[type] = fltr[type].filter((el) => {
          return el !== e
        })
      } else {
        fltr[type] = [...fltr[type], e]
      }
    }
    setFiltersRef(fltr)
    localStorage.setItem(storageName, JSON.stringify(fltr))
    dataRequest('orders', fltr)
  }
  const [requestedData, setRequestedData] = useState()
  const dataRequest = async (what, optionsPrev) => {
    let options = typeof optionsPrev === 'function' ? optionsPrev() : optionsPrev
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

  const getErrorFromSse = (e) => {
    messageHandler('Соединение прервано, нажмите F5', 'error')
    console.log('Подключение потеряно')
  }
  const getRealtimeData = async ({ data }) => {
    const resp = JSON.parse(data)
    if (resp.state === 'connect') {
      await init()
    }
    if (resp.message) {
      messageHandler(resp.message, 'success')
    }
    if (resp.update) {
      await dataRequest('orders', latestFilters.current || latestRstFilters.current)
    }
  }

  useEffect(() => {
    if (userId && token && userType && userData) {
      const localhost = true
      const sse = new EventSource(
        `http://localhost:5000/sseupdate?uid=${userId}&fname=${userData?.fname}&company=${userData?.company}&position=${userData?.position}&type=${userType}`,
        {}
      )
      sse.addEventListener('message', getRealtimeData)
      sse.addEventListener('error', getErrorFromSse)
      return () => {
        sse.removeEventListener('message', getRealtimeData)
        sse.removeEventListener('error', getErrorFromSse)
      }
    }
  }, [userId, token, userType, userData])

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
                  hstr.push('/home/addOrder')
                }}
              >
                Добавить новую заявку
              </Button>
            ) : null}
          </Form.Field>
          <Form.Field width='five'>
            {userType === 'logisticks' && (
              <Filter
                array={requestedData?.farmers?.map((e) => {
                  return { key: e._id, text: e.company, value: e._id }
                })}
                field={'farm'}
                setterForValue={filtersHandler}
                reset={resetFltrs}
                placeholder={'фермер'}
                filterValue={filters}
              />
            )}
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
              reset={resetFltrs}
              setterForValue={filtersHandler}
              placeholder={'статус'}
              filterValue={filters}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              checked={filters.state?.includes('finished') ? true : false}
              onChange={(e, data) => {
                filtersHandler('finished', 'state', { opt: data.checked })
              }}
              label='Показывать завершенные'
              toggle
            ></Checkbox>
          </Form.Field>
          <Form.Field>
            <Checkbox
              checked={filters.state?.includes('canceled') ? true : false}
              onChange={(e, data) => {
                filtersHandler('canceled', 'state', { opt: data.checked })
              }}
              label='Показывать отмененные'
              toggle
            ></Checkbox>
          </Form.Field>
        </Form.Group>
      </Form>
      <Loader active={loading}>Получение данных</Loader>
      <OrderViewport
        windWidth={windWidth}
        orders={requestedData?.orders || []}
        openCreateOrderModal={openCreateOrderModal}
        setopenCreateOrderModal={setopenCreateOrderModal}
      />
    </>
  )
}
