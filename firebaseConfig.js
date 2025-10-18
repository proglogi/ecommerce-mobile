//firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
 
const firebaseConfig = {
  apiKey: "AIzaSyCK06k5F4X-CKC7_6m-D8hHLIU8OktlUdY",
  authDomain: "mobile-app-bbec1.firebaseapp.com",
  databaseURL: "https://mobile-app-bbec1-default-rtdb.firebaseio.com",
  projectId: "mobile-app-bbec1",
  storageBucket: "mobile-app-bbec1.firebasestorage.app",
  messagingSenderId: "714401940011",
  appId: "1:714401940011:web:347eb522fb308dc6b3206e"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};