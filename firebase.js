import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import Constants from "expo-constants"

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebaseApiKey,
  authDomain: "copd-database.firebaseapp.com",
  projectId: "copd-database",
  storageBucket: "copd-database.appspot.com",
  messagingSenderId: "77079651861",
  appId: "1:77079651861:web:942e414956436d7245101c",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)