// npm i firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:  "AIzaSyCznwtpddbtAGscPkmUPY-Xd-JsvcJc3EE",
  authDomain:  "buyforce-10ea5.firebaseapp.com",
  projectId:  "buyforce-10ea5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
