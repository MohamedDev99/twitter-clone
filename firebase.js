import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDuERGvBxx2BEbzBLyIFsEsrPTeGfH9DzI",
    authDomain: "twitter-clone-mohamed.firebaseapp.com",
    projectId: "twitter-clone-mohamed",
    storageBucket: "twitter-clone-mohamed.appspot.com",
    messagingSenderId: "963824746703",
    appId: "1:963824746703:web:a3d295ae909839f6b5f7ba",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
