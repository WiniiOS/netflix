import * as firebase from 'firebase'

const initFirebase = () =>{
  const firebaseConfig = {
    apiKey: "AIzaSyAWIa4A1W117gs72F4o6ZhX3zKEuBCfFqA",
    authDomain: "codeflix-1c39e.firebaseapp.com",
    databaseURL: "https://codeflix-1c39e.firebaseio.com",
    projectId: "codeflix-1c39e",
    storageBucket: "codeflix-1c39e.appspot.com",
    messagingSenderId: "679398730023",
    appId: "1:679398730023:web:f3618a2b782ad7eb636102"
  }

  firebase.initializeApp(firebaseConfig)

}

export {initFirebase}