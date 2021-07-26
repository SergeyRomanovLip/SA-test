import _ from 'lodash'
import react, { useReducer, useCallback, useState, useRef, useEffect } from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'

const initialState = {
  loading: false,
  results: [],
  value: '',
}

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

function SearchName({ source, filler }) {
  const [state, dispatch] = useReducer(exampleReducer, initialState)
  const { loading, results, value } = state

  const timeoutRef = useRef()
  const handleSearchChange = useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }
      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      const isMatch = (result) => re.test(result.title)
      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(source, isMatch),
      })
    }, 300)
  }, [])
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])
  const resRender = ({ title, position, department, year }) => {
    return (
      <>
        <span>
          <b>{title}</b>
        </span>
        <br />
        <span>{position}</span>
        <br />
        <span>{department}</span>
      </>
    )
  }

  return (
    <Search
      fluid
      loading={loading}
      onResultSelect={(e, data) => {
        dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
        filler(data.result)
      }}
      onSearchChange={handleSearchChange}
      results={results}
      value={value}
      resultRenderer={resRender}
      placeholder={'Начните вводить свою фамилию'}
    />
  )
}

export default SearchName
