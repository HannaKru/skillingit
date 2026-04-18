// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB6rZzXaiB4Y2rG5YcT8bogsxAXoOcOSDk",
    authDomain: "skillingit-e2396.firebaseapp.com",
    projectId: "skillingit-e2396",
    storageBucket: "skillingit-e2396.firebasestorage.app",
    messagingSenderId: "1021636723396",
    appId: "1:1021636723396:web:e4a78fd6587c35db913f91",
    measurementId: "G-67E92P4HVM"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const getAnalyticsSafety = async() =>{
    if (typeof window === "undefined") return null;
    const {getAnalytics, isSupported} = await import("firebase/analytics");
    const supported = await isSupported();
    if (supported){
        return getAnalytics(app);
    }
    return null;
}
