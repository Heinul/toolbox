/**
 * 로그 유틸리티 함수 모음
 * 로컬 환경에서만 로그를 출력하기 위한 래퍼 함수들
 */

// 호스트명 기반으로 로컬 환경인지 확인
const isLocalEnvironment = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname.startsWith('192.168.') || 
           hostname.includes('.local');
  }
  return false;
};

// 로컬 환경에서만 로그를 출력하는 래퍼 함수들
const logger = {
  log: (...args) => {
    if (isLocalEnvironment()) {
      console.log(...args);
    }
  },
  
  warn: (...args) => {
    if (isLocalEnvironment()) {
      console.warn(...args);
    }
  },
  
  error: (...args) => {
    if (isLocalEnvironment()) {
      console.error(...args);
    }
  },
  
  info: (...args) => {
    if (isLocalEnvironment()) {
      console.info(...args);
    }
  },
  
  debug: (...args) => {
    if (isLocalEnvironment()) {
      console.debug(...args);
    }
  }
};

export default logger;
