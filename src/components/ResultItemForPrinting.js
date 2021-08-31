import React, { useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import { AppContext } from './../context/AppContext'
import { ResultItemPrint } from './ResultItemPrint'

export const ResultItemForPrinting = () => {
  const { resultsForPrinting } = useContext(AppContext)
  const para = useParams()
  return para.print === 'print' ? (
    <div id='section-to-print' className='printPage'>
      {resultsForPrinting.map((element, i) => {
        return <ResultItemPrint res={element} i={i} key={i + 95} />
      })}
    </div>
  ) : null
}
