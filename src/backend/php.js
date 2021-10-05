import { isString } from 'lodash'
import { Form } from 'semantic-ui-react'

const _fetch = async (type, payload, bodyp) => {
  const url = 'https://tests.kms-app.ru/be/'
  try {
    const formData = new FormData()
    Object.keys(payload).map((opt) => {
      formData.append([opt], payload[opt])
    })

    const res = await fetch(url, {
      method: type,
      body: formData,
      mode: 'cors',
    })
    const json = await res.json()
    return json
  } catch (e) {
    return e
  }
}

export const uploadNewQuestionsPHP = async (user, newQuestions, loadHandl) => {
  const json = await _fetch('POST', { type: 'UPLOAD_NEW_QUESTIONS', questions: JSON.stringify(newQuestions) })
  //     await db
  //       .collection('testQuestions')
  //       .doc(`${uData.company}`)
  //       .set({
  //         data: newQuestions
  //       })
  //       .then(() => {
  //         console.log('Document successfully written!')
  //       })
  //       .catch((error) => {
  //         console.error('Error writing document: ', error)
  //         return error
  //       })
  //     loadHandl(false)
  //   } catch (e) {
  //     loadHandl(false)
  //     alert(e)
  //   }
}

export const generateDBPHP = async () => {
  const json = await _fetch('POST', { type: 'CHECK_AND_CREATE_DB' })
  const data = await JSON.parse(json)
  return data
}
