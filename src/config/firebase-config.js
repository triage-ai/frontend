// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, SAMLAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyB-gtPnTeGTG2zA5pf7CNV_Dg0roJYWrjg',
	authDomain: 'ticketcraft-17774.firebaseapp.com',
	projectId: 'ticketcraft-17774',
	storageBucket: 'ticketcraft-17774.appspot.com',
	messagingSenderId: '919937253966',
	appId: '1:919937253966:web:85e3982b20905f2891f91f',
	measurementId: 'G-BNLQ2BEKW9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const samlProvider = new SAMLAuthProvider('saml.microsoft-saml-entra');
export const firestore = getFirestore(app);
