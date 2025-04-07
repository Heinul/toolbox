import React from 'react';
import { format } from 'date-fns';

/**
 * 날짜 범위 필터 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.dateRange - 날짜 범위 객체 {startDate, endDate}
 * @param {Function} props.onStartDateChange - 시작 날짜 변경 핸들러
 * @param {Function} props.onEndDateChange - 종료 날짜 변경 핸들러
 * @param {Function} props.onReset - 필터 초기화 핸들러
 * @param {number} props.totalCount - 전체 데이터 개수
 * @param {number} props.filteredCount - 필터링된 데이터 개수
 * @returns {JSX.Element} - 날짜 범위 필터 컴포넌트
 */
const DateRangeFilter = ({ 
  dateRange, 
  onStartDateChange, 
  onEndDateChange, 
  onReset,
  totalCount,
  filteredCount
}) => {
  // 날짜 입력 필드의 value 값으로 사용할 문자열 생성
  const startDateStr = dateRange.startDate 
    ? format(dateRange.startDate, 'yyyy-MM-dd') 
    : '';
    
  const endDateStr = dateRange.endDate 
    ? format(dateRange.endDate, 'yyyy-MM-dd') 
    : '';

  // 필터가 적용되었는지 여부
  const isFilterActive = dateRange.startDate || dateRange.endDate;
  
  // 필터 결과 메시지 생성
  const getFilterMessage = () => {
    if (!isFilterActive) return null;
    
    // 데이터가 필터링되었는지 확인
    if (filteredCount === totalCount) {
      return <span className="filter-message">모든 데이터가 표시되고 있습니다.</span>;
    }
    
    return (
      <span className="filter-message">
        전체 {totalCount}개 중 {filteredCount}개의 데이터가 표시되고 있습니다.
      </span>
    );
  };

  return (
    <div className="date-range-filter">
      <div className="filter-header">
        <h4>날짜 범위 필터</h4>
        {isFilterActive && (
          <button 
            className="reset-button" 
            onClick={onReset}
          >
            초기화
          </button>
        )}
      </div>
      
      <div className="filter-inputs">
        <div className="date-input-group">
          <label htmlFor="start-date">시작 날짜:</label>
          <input
            id="start-date"
            type="date"
            value={startDateStr}
            onChange={onStartDateChange}
          />
        </div>
        
        <span className="date-separator">~</span>
        
        <div className="date-input-group">
          <label htmlFor="end-date">종료 날짜:</label>
          <input
            id="end-date"
            type="date"
            value={endDateStr}
            onChange={onEndDateChange}
          />
        </div>
      </div>
      
      {getFilterMessage()}
    </div>
  );
};

export default DateRangeFilter;
