// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth,GoogleAuthProvider} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyB16OD_0zuShErTnDR0k4TB8LoKqpomaVA",
  authDomain: "mernstack-insta.firebaseapp.com",
  projectId: "mernstack-insta",
  storageBucket: "mernstack-insta.appspot.com",
  messagingSenderId: "366757274621",
  appId: "1:366757274621:web:049491c6f83046b5166f94",
  measurementId: "G-JEKCTM39L0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider()

export {provider,auth};