import React from 'react';
import { formatDate } from '../../utils/dateUtils';

/**
 * 날짜 선택 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.data - 날짜 데이터 배열
 * @param {Function} props.onSelectDate - 날짜 선택 이벤트 핸들러
 * @param {Array} props.selectedDates - 선택된 날짜 배열
 * @param {boolean} props.minimized - 컴포넌트의 최소화 상태
 * @returns {JSX.Element} - 날짜 선택 컴포넌트
 */
const DateSelector = ({ data, onSelectDate, onFixDate, selectedDates = [], minimized = false }) => {
  // 선택된 날짜의 ID 배열 생성
  const selectedIds = selectedDates.map(date => date.id);

  // 날짜 항목 클릭 이벤트 핸들러
  const handleDateClick = (id) => {
    onSelectDate(id);
  };
  
  // 더블 클릭으로 고정
  const handleDoubleClick = (id) => {
    if (onFixDate) onFixDate(id);
  };

  return (
    <div className={`date-selector-container ${minimized ? 'minimized' : ''}`}>
      <div className="date-items-wrapper">
        {data.map((item) => (
          <div
            key={item.id}
            className={`date-item ${selectedIds.includes(item.id) ? 'selected' : ''} ${selectedDates.find(date => date.id === item.id && date.fixed) ? 'fixed' : ''}`}
            onClick={() => handleDateClick(item.id)}
            onDoubleClick={() => handleDoubleClick(item.id)}
          >
            <div className="date-content">
              <span className="date-time">
                {formatDate(item.date.toISOString(), minimized ? 'MM/dd' : 'yyyy-MM-dd HH:mm')}
              </span>
              {!minimized && (
                <span className="date-score">
                  점수: {item.score.toFixed(2)}
                  {item.scoreChange !== 0 && (
                    <span className={`score-change ${item.scoreChange > 0 ? 'positive' : 'negative'}`}>
                      ({item.scoreChange > 0 ? '+' : ''}{item.scoreChange.toFixed(2)})
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;
