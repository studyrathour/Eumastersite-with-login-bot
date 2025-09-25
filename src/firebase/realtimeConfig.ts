import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const realtimeFirebaseConfig = {
  apiKey: "AIzaSyB1HaDqkILJvreVeFljcn4mypaJfdHuxMY",
  authDomain: "nexttoppers-ab24d.firebaseapp.com",
  projectId: "nexttoppers-ab24d",
  storageBucket: "nexttoppers-ab24d.firebasestorage.app",
  messagingSenderId: "846870084201",
  appId: "1:846870084201:web:39f99c5c462a06004540f8",
  measurementId: "G-KFRTCREFZ6",
  databaseURL: "https://trm-x-masters-default-rtdb.firebaseio.com/"
};

const realtimeApp = initializeApp(realtimeFirebaseConfig, 'realtime');
export const realtimeDb = getDatabase(realtimeApp);
export const realtimeAuth = getAuth(realtimeApp);