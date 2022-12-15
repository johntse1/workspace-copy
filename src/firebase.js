import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAu_9pTn_SJnWqn1n247EBzCW29Dhsau4w",
  authDomain: "chattest-b3b43.firebaseapp.com",
  projectId: "chattest-b3b43",
  storageBucket: "chattest-b3b43.appspot.com",
  messagingSenderId: "875035258166",
  appId: "1:875035258166:web:306dd7de111a2387c31797"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
