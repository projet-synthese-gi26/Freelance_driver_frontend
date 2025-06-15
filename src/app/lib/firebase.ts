
import { initializeApp } from "firebase/app";
import {
    getAuth,
    getIdToken,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { FIREBASE_CONFIG } from "./constant";
import Cookies from 'js-cookie';



// const firebaseConfig = {
//     apiKey: "AIzaSyCn0PH34kAtv0pOdrtDRNzt1VZ6A_w1BQs",
//     authDomain: "yowyob-letsgo.firebaseapp.com",
//     projectId: "yowyob-letsgo",
//     storageBucket: "yowyob-letsgo.appspot.com",
//     messagingSenderId: "897477021790",
//     appId: "1:897477021790:web:8305b73eb2dee9b8abe4cf"
// };

const firebaseConfig = FIREBASE_CONFIG;


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const setAuthCookie = async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await getIdToken(user);
      // Stockez le token dans un cookie httpOnly
      Cookies.set('authToken', token, { 
        expires: 7, // expire après 7 jours
        //secure: true, // utilise HTTPS seulement
        sameSite: 'strict' // protection CSRF
      });
      Cookies.set('email', user.email || '', { 
        expires: 7, // expire après 7 jours
        //secure: true, // utilise HTTPS seulement
        sameSite: 'strict' // protection CSRF
      });
      Cookies.set('phone', user.phoneNumber || '', { 
        expires: 7, // expire après 7 jours
        //secure: true, // utilise HTTPS seulement
        sameSite: 'strict' // protection CSRF
      });
    }
  };

export default app;