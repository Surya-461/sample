import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBcGTDKmvdHoj5Zrh5uF5Iej15WZBUC0f0",
    authDomain: "finance-pro-auth.firebaseapp.com",
    projectId: "finance-pro-auth",
    storageBucket: "finance-pro-auth.firebasestorage.app",
    messagingSenderId: "486695492018",
    appId: "1:486695492018:web:61c559b441054adb0a6cab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);