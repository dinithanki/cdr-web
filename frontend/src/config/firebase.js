import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGyk4RYBpsZzXNviS6Ckdth2Y0xHzUqvI",
  authDomain: "ecommerce-app-55463.firebaseapp.com",
  projectId: "ecommerce-app-55463",
  storageBucket: "ecommerce-app-55463.firebasestorage.app",
  messagingSenderId: "1034361278532",
  appId: "1:1034361278532:web:5cdabe5a9d2f7ec792ec11",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
