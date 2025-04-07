import React, { useEffect } from 'react';
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
  
  // 컴포넌트 처음 로드시 초기화
  useEffect(() => {
    // 네비게이터 중앙 정렬을 위한 아이템 수 추적
    const container = document.querySelector('.date-items-wrapper');
    if (container && container.children.length > 0) {
      const numItems = Math.min(container.children.length, 10); // 최대 10개까지만 고려
      const minTotalWidth = numItems * 140; // 항목 당 대략 너비
      container.style.minWidth = `${minTotalWidth}px`;
    }
  }, [data]);
  
  // 스크롤 이벤트 처리 추가
  useEffect(() => {
    const handleScroll = () => {
      // 데이터가 없으면 스타일 변경하지 않음
      if (!data || data.length === 0) return;
      
      // 데이트 셀렉터 컨테이너와 spec-log-container 참조
      const container = document.querySelector('.date-selector-container');
      const specLogContainer = document.querySelector('.spec-log-container');
      if (!container || !specLogContainer) return;
      
      // 현재 스크롤 위치
      const scrollPosition = window.scrollY;
      
      // 탭 위치 계산 - 네비게이터가 화면 상단에 찍힐 위치
      const graphSection = document.querySelector('.graph-section');
      const tabPoint = graphSection ? graphSection.offsetTop + graphSection.offsetHeight : 300;
      
      // 탭 포인트에 도달하면 고정 스타일 적용
      if (scrollPosition >= tabPoint) {
        container.classList.add('is-pinned');
        
        // spec-log-container 범위 계산
        const containerRect = specLogContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        container.style.width = `${containerWidth}px`;
        
        // 중앙 정렬을 위해 left 값 계산
        container.style.left = `${window.scrollX + containerRect.left}px`;
        container.style.right = 'auto'; // right 값 제거
      } else {
        container.classList.remove('is-pinned');
        container.style.width = '';
        container.style.left = '';
        container.style.right = '';
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // 초기 실행 한 번
    handleScroll();
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [data]);

  // 선택된 항목에 대한 역할 클래스 이름 가져오기 - 선택 순서를 기준으로 함
  const getItemRoleClass = (itemId) => {
    if (!selectedIds.includes(itemId)) return '';
    
    // 선택된 항목이 하나만 있는 경우
    if (selectedDates.length === 1) {
      return 'base-data';
    }
    
    // 두 개 이상 선택된 경우
    if (selectedDates.length >= 2) {
      // 고정된 항목 확인
      const fixedDate = selectedDates.find(date => date.fixed);
      const isFixed = fixedDate && fixedDate.id === itemId;
      
      if (isFixed) return 'fixed-data';
      
      // 첫 번째 선택된 항목은 기준 데이터
      if (selectedDates[0].id === itemId) {
        return 'base-data';
      }
      
      // 두 번째 선택된 항목은 비교 데이터
      if (selectedDates[1].id === itemId) {
        return 'compare-data';
      }
      
      return '';
    }
    
    return '';
  };

  return (
    <>
      <div className={`date-selector-container ${minimized ? 'minimized' : ''}`}>
        <div className="date-items-wrapper">
          {data.map((item) => {
            const roleClass = getItemRoleClass(item.id);
            return (
              <div
                key={item.id}
                className={`date-item ${selectedIds.includes(item.id) ? 'selected' : ''} ${selectedDates.find(date => date.id === item.id && date.fixed) ? 'fixed' : ''} ${roleClass}`}
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
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DateSelector;
