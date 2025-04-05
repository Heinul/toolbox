import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase 설정 (.env 파일에서 가져오거나 직접 입력)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDuZWAB0VgPxzOD-xF3274p-Esc_k0Ll5g",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "loaspeclog.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://loaspeclog-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "loaspeclog",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "loaspeclog.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "879682061996",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:879682061996:web:35918f36fa27137e7f4109",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-S9302CL4C5"
};

// Firebase 초기화
console.log('파이어베이스 초기화:', firebaseConfig.databaseURL);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
