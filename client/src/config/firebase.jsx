// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDurcX5OrbPFeUDV8e6rPy0uWYA0vUtRkg",
  authDomain: "mruri-b9d9c.firebaseapp.com",
  projectId: "mruri-b9d9c",
  storageBucket: "mruri-b9d9c.appspot.com",
  messagingSenderId: "231757936350",
  appId: "1:231757936350:web:5d870862b2d4892565b44f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };
