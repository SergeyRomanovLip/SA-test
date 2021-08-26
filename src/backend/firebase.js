import firebase from 'firebase'
import { generateId } from '../misc/generateId'

const config = {
  apiKey: 'AIzaSyAjgQ7hZHzAe6d6wddkGhd8n3hEAMTMO0s',
  authDomain: 'sa-test-30d4b.firebaseapp.com',
  projectId: 'sa-test-30d4b',
  storageBucket: 'sa-test-30d4b.appspot.com',
  messagingSenderId: '155029522773',
  appId: '1:155029522773:web:f87ee3cd2450243b7907dc',
  measurementId: 'G-HJFX1VE7G8'
}
firebase.initializeApp(config)

const db = firebase.firestore()
export const createUser = async (usrData) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(usrData.email, usrData.password)
    .then((userCredential) => {
      db.collection('users')
        .doc(usrData.email)
        .set({ ...usrData })
        .then(() => {
          console.log('Document successfully written!')
        })
        .catch((error) => {
          console.error('Error writing document: ', error)
        })
      var user = userCredential.user
    })
    .catch((error) => {
      var errorCode = error.code
      var errorMessage = error.message
    })
}
export const logOut = async () => {
  firebase.auth().signOut()
}
export const logIn = async (usrData, setLoading) => {
  setLoading(true)
  firebase
    .auth()
    .signInWithEmailAndPassword(usrData.email, usrData.password)
    .then((userCredential) => {
      var user = userCredential.user
    })
    .catch((error) => {
      var errorCode = error.code
      var errorMessage = error.message
    })
    .finally(() => {
      setLoading(false)
    })
}
export const addTestResult = async (results, user) => {
  const answersArray = []
  for (let answ in results) {
    let question = results[answ].question
    let rightAnswer = results[answ].answers.filter((e) => {
      return e.choosen
    })
    rightAnswer = rightAnswer[0]
    answersArray.push({ question, ...rightAnswer })
  }
  let dateId = `${Date.now().toString()}${generateId()}`
  const res = await db
    .collection('testResults')
    .doc(dateId)
    .set({
      dateId,
      course: user.course,
      fio: user.fio,
      department: user.department,
      position: user.position,
      answers: answersArray
    })
    .then(() => {
      console.log('Document successfully written!')
      return dateId
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
      return error
    })
  return res
}
export const getTestResult = async (dataId) => {
  const collection = db.collection('testResults').doc(dataId)
  try {
    const testRes = await collection.get()
    if (testRes.exists) {
      alert('Спасибо! Тест загружен в систему')
    } else {
      alert('Произошла ошибка, пожалуйста попробуйте еще раз')
    }
  } catch (e) {
    alert(e)
  }
}
export const getAllTestResults = async () => {
  const collection = await db.collection('testResults').get()
  try {
    const testRes = collection.docs.map((res) => res.data())
    if (testRes && testRes.length > 0) {
      return testRes
    } else {
      alert('Произошла ошибка, пожалуйста попробуйте еще раз')
    }
  } catch (e) {
    alert(e)
  }
}
export const uploadNewQuestions = async (user, newQuestions, loadHandl) => {
  try {
    loadHandl(true)
    const collection = await db.collection('users').get()
    let uData = {}
    collection.docs.forEach((el) => {
      if (el.data().email === user.email) {
        uData = el.data()
      }
    })
    await db
      .collection('testQuestions')
      .doc(`${uData.company}`)
      .set({
        data: newQuestions
      })
      .then(() => {
        console.log('Document successfully written!')
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
        return error
      })
    loadHandl(false)
  } catch (e) {
    loadHandl(false)
    alert(e)
  }
}
export const uploadNewEmployees = async (user, newEmployees, loadHandl) => {
  try {
    loadHandl(true)
    const collection = await db.collection('users').get()
    let uData = {}
    collection.docs.forEach((el) => {
      if (el.data().email === user.email) {
        uData = el.data()
      }
    })
    await db
      .collection('testEmployees')
      .doc(`${uData.company}`)
      .set({ data: newEmployees })
      .then(() => {
        console.log('Document successfully written!')
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
        return error
      })
    loadHandl(false)
  } catch (e) {
    loadHandl(false)
    alert(e)
  }
}
export const getData = async (type, company) => {
  try {
    const docRef = db.collection(type).doc(company)
    const res = await docRef.get()
    if (res.exists) {
      return res.data().data
    } else {
      return false
    }
  } catch (e) {
    alert(e)
  }
}
