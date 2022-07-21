
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_APIKEY,
  authDomain: process.env.REACT_APP_API_AUTHDOMAIN,
  projectId: "sparta-magazine",
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;