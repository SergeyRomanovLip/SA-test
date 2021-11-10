import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Label } from 'semantic-ui-react'

export const Filter = ({ reset, setterForValue, field, array, placeholder, filterValue }) => {
  const [dropDownValue, setDropDownValue] = useState(null)
  const addDropDownDataHandler = (e) => {
    setterForValue(e, field)
  }

  useEffect(() => {
    if (filterValue[field]?.length === 1) {
      setDropDownValue(filterValue[field][0])
    } else {
      setDropDownValue(null)
    }
  }, [array])

  return (
    <div style={{ width: 250 + 'px', display: 'flex', flexDirection: 'row' }}>
      <Dropdown
        style={{ backgroundColor: dropDownValue ? 'rgb(230,230,230)' : null }}
        placeholder={dropDownValue ? dropDownValue : placeholder}
        selection
        fluid
        value={dropDownValue}
        onChange={(e, val) => {
          addDropDownDataHandler(val.value)
        }}
        options={array}
      ></Dropdown>
      <Button
        onClick={() => {
          reset(field)
        }}
        size='tiny'
        icon='remove'
      />
    </div>
  )
}
