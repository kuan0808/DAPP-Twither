import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9vdaVMDtC3IlhSb11vJmWbYf53PSfiOA",
  authDomain: "dapp-twither.firebaseapp.com",
  projectId: "dapp-twither",
  storageBucket: "dapp-twither.appspot.com",
  messagingSenderId: "628654592565",
  appId: "1:628654592565:web:3d776cb89546c8001f177c",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
