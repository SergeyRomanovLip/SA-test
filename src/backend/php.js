import { isString } from 'lodash'
import { Form } from 'semantic-ui-react'

const _fetch = async (type, payload) => {
  const url = 'https://tests.kms-app.ru/be/'
  try {
    const formData = new FormData()
    Object.keys(payload).map((opt) => {
      formData.append([opt], payload[opt])
    })

    const res = await fetch(url, {
      method: type,
      body: formData,
      mode: 'cors'
    })
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}

export const uploadNewQuestionsPHP = async (user, newQuestions, loadHandl) => {
  //   try {
  //     loadHandl(true)
  //     const collection = await db.collection('users').get()
  //     let uData = {}
  //     collection.docs.forEach((el) => {
  //       if (el.data().email === user.email) {
  //         uData = el.data()
  //       }
  //     })
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
  const res = await _fetch('POST', { type: 'CHECK_AND_CREATE_DB' })
  console.log(res)
}
