import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * ISO 형식의 날짜 문자열을 읽기 쉬운 형식으로 변환하는 함수
 * @param {string} dateString - ISO 형식의 날짜 문자열
 * @param {string} formatStr - 출력할 날짜 형식
 * @returns {string} - 형식화된 날짜 문자열
 */
export const formatDate = (dateString, formatStr = 'yyyy-MM-dd HH:mm') => {
  if (!dateString) return '';
  try {
    // ISO 문자열을 Date 객체로 파싱
    const date = parseISO(dateString);
    // 지정된 형식으로 변환
    return format(date, formatStr, { locale: ko });
  } catch (error) {
    console.error('날짜 형식 변환 오류:', error);
    return dateString;
  }
};

/**
 * Date 객체를 간략한 형식으로 변환하는 함수
 * @param {Date} date - 날짜 객체
 * @returns {string} - 형식화된 날짜 문자열
 */
export const formatShortDate = (date) => {
  if (!date) return '';
  try {
    return format(date, 'MM.dd HH:mm', { locale: ko });
  } catch (error) {
    console.error('날짜 형식 변환 오류:', error);
    return '';
  }
};

/**
 * 두 날짜 사이의 차이를 계산하는 함수
 * @param {Date} date1 - 첫 번째 날짜
 * @param {Date} date2 - 두 번째 날짜
 * @returns {string} - 사람이 읽기 쉬운 형식의 시간 차이
 */
export const getDateDiff = (date1, date2) => {
  if (!date1 || !date2) return '';
  
  const diffMs = Math.abs(date1 - date2);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays}일 ${diffHours}시간`;
  } else {
    return `${diffHours}시간`;
  }
};
