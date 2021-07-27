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
export const addBook = (event) => {
  db.collection('cities')
    .doc('LA')
    .set({
      name: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    })
    .then(() => {
      console.log('Document successfully written!')
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
    })
}
