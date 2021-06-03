import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAZObsFK9QYx1-KfgrcLynrHxUVPGrIAyo",
    authDomain: "instagram-clone-e1330.firebaseapp.com",
    projectId: "instagram-clone-e1330",
    storageBucket: "instagram-clone-e1330.appspot.com",
    messagingSenderId: "755451484321",
    appId: "1:755451484321:web:3bcd6dfeec118abd1538e0",
    measurementId: "G-9L7M6BM8GV"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)  
export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
