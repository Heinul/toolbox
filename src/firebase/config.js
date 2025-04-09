import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics, logEvent } from 'firebase/analytics';
import logger from '../utils/logUtils';

// Firebase 설정 - 프로덕션용 설정은 환경변수로 관리
// 개발 및 테스트 환경에서만 기본값 사용
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화
logger.log('파이어베이스 초기화:', firebaseConfig.databaseURL);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


let analytics = null;
try {

  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    logger.log('Firebase Analytics 초기화 완료');
  }
} catch (error) {
  logger.error('Firebase Analytics 초기화 오류:', error);
}


export const logPageView = (pageName) => {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
};


export const logUserAction = (actionName, actionParams = {}) => {
  if (analytics) {
    logEvent(analytics, actionName, actionParams);
  }
};

export { database, analytics };
