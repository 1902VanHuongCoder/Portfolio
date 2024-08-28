import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
/* 
// firebaseConfig.js
import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
x

export { storage };
 */
// const firebaseConfig = {
//   apiKey: "AIzaSyBLsg28gwNMxsucy-3R9E52Tr4x0zRdI2M",
//   authDomain: "portfolio-a3a22.firebaseapp.com",
//   projectId: "portfolio-a3a22",
//   storageBucket: "portfolio-a3a22.appspot.com",
//   messagingSenderId: "602678158333",
//   appId: "1:602678158333:web:070b20ccc611add18f6f94",
//   measurementId: "G-YXFSCL2JLY",
// };

const firebaseConfig = { 
  apiKey : import.meta.env.VITE_apiKey, 
  authDomain : import.meta.env.VITE_authDomain, 
  projectId : import.meta.env.VITE_projectId, 
  storageBucket : import.meta.env.VITE_storageBucket, 
  messagingSenderId : import.meta.env.VITE_messagingSenderId, 
  appId : import.meta.env.VITE_appId,
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);