// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW85LuCWSDm0wxAcZYguzrdnuHnylZ5Xg",
  authDomain: "rivercleaning-4ec8c.firebaseapp.com",
  projectId: "rivercleaning-4ec8c",
  storageBucket: "rivercleaning-4ec8c.appspot.com",
  messagingSenderId: "824087075243",
  appId: "1:824087075243:web:9509456fb5b8d81c5adaee",
  measurementId: "G-M66FS230G5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth=getAuth(app)
const storage=getStorage(app)
export {app, analytics, db,auth,storage}