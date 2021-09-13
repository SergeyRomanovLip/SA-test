import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import { getData, getUserData } from '../backend/firebase'
import { AppContext } from './../context/AppContext'
import { ResultItemPrint } from './ResultItemPrint'

export const ResultItemForPrinting = () => {
  const { resultsForPrinting, authenticated } = useContext(AppContext)
  const [existingQuestionsFromDatabase, setExistingQuestionsFromDatabase] = useState([])
  const [comission, setComission] = useState([])
  useEffect(() => {
    getUserData(authenticated).then((userData) => {
      getData('testQuestions', userData.company).then((res) => {
        setExistingQuestionsFromDatabase(res)
      })
    })
  }, [authenticated])

  const para = useParams()
  return para.print === 'print' ? (
    <div id='section-to-print' className='printPage'>
      {resultsForPrinting.map((element, i) => {
        return <ResultItemPrint res={element} forComission={existingQuestionsFromDatabase} i={i} key={i + 95} />
      })}
    </div>
  ) : null
}
