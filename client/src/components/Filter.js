import React, { useState } from 'react'
import { Button, Dropdown, Label } from 'semantic-ui-react'

export const Filter = ({ requestFoo, setterForValue, field, array, placeholder }) => {
  const [dropDownValue, setDropDownValue] = useState(null)
  const [dropDownData, setDropDownData] = useState([{ key: '1', text: '...', value: '' }])
  const addDropDownDataHandler = (e) => {
    setDropDownValue(e)
    setterForValue(e, field)
  }

  const dropDownDataHandler = async () => {
    if (requestFoo) {
      const res = await requestFoo()
      const filterArray = res.map((e) => {
        return { key: e._id, text: e[field], value: e._id }
      })
      setDropDownData(filterArray)
    } else {
      setDropDownData(array)
    }
  }

  return (
    <>
      <Dropdown
        placeholder={placeholder}
        selection
        value={dropDownValue || ''}
        onFocus={() => {
          dropDownDataHandler()
        }}
        onChange={(e, val) => {
          addDropDownDataHandler(val.value)
        }}
        options={dropDownData}
      ></Dropdown>
      <Button
        onClick={() => {
          setDropDownValue()
          setterForValue(null, field)
        }}
        size='tiny'
        icon='remove'
      />
    </>
  )
}
