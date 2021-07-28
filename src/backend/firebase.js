import firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyAjgQ7hZHzAe6d6wddkGhd8n3hEAMTMO0s',
  authDomain: 'sa-test-30d4b.firebaseapp.com',
  projectId: 'sa-test-30d4b',
  storageBucket: 'sa-test-30d4b.appspot.com',
  messagingSenderId: '155029522773',
  appId: '1:155029522773:web:f87ee3cd2450243b7907dc',
  measurementId: 'G-HJFX1VE7G8',
}

firebase.initializeApp(config)
const db = firebase.firestore()

export const addTestResult = (results, user) => {
  const answersArray = []
  for (let answ in results) {
    let question = results[answ].question
    let rightAnswer = results[answ].answers.filter((e) => {
      return e.choosen
    })
    rightAnswer = rightAnswer[0]
    answersArray.push({ question, ...rightAnswer })
  }
  let date = Date.now().toString()
  db.collection('testResults')
    .doc(date)
    .set({
      course: user.course,
      fio: user.fio,
      department: user.department,
      position: user.position,
      answers: answersArray,
    })
    .then(() => {
      console.log('Document successfully written!')
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
    })
}
