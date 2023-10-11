// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCtv23UOgARdXbQnCPLMsbdJOeI723AUc",
  authDomain: "email-marketing-auth.firebaseapp.com",
  projectId: "email-marketing-auth",
  storageBucket: "email-marketing-auth.appspot.com",
  messagingSenderId: "1065000962511",
  appId: "1:1065000962511:web:98c1336fb1df3e52896aba",
  measurementId: "G-09FWN0C5TT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;