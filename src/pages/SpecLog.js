import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logger from '../utils/logUtils';

// 컴포넌트 임포트
import ScoreGraph from '../components/SpecLog/ScoreGraph';
import DateSelector from '../components/SpecLog/DateSelector';
import DataDetail from '../components/SpecLog/DataDetail';
import OptionsNavigator from '../components/SpecLog/OptionsNavigator';

// 유틸리티 함수 임포트
import { searchCharacterData, calculateScoreChanges } from '../utils/firebaseUtils';
import { loadOptions, saveOptions, DEFAULT_OPTIONS } from '../utils/optionsUtils';

// 스타일 임포트
import '../styles/SpecLog.css';

const SpecLog = () => {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [characterData, setCharacterData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [minimized, setMinimized] = useState(false);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  
  // Ref 생성
  const containerRef = useRef(null);

  // 옵션 로드
  useEffect(() => {
    const savedOptions = loadOptions();
    setOptions(savedOptions);
  }, []);

  // 옵션 변경 핸들러
  const handleOptionChange = (category, option, value) => {
    const updatedOptions = {
      ...options,
      [category]: {
        ...options[category],
        [option]: value
      }
    };
    setOptions(updatedOptions);
    saveOptions(updatedOptions);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // 검색어가 변경되면 새로운 검색으로 간주
    if (hasSearched) {
      setHasSearched(false);
    }
  };

  // 검색 실행 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError(null);
    // 검색 시도 표시
    setHasSearched(true);
    
    try {
      // Firebase에서 캐릭터 데이터 검색
      const data = await searchCharacterData(searchTerm);
      setCharacterData(data);
      
      // 데이터 가공
      const processed = calculateScoreChanges(data);
      setProcessedData(processed);
      
      // 선택 데이터 초기화 - 가장 최근 데이터 자동 선택
      if (processed.length > 0) {
        // 마지막 데이터가 가장 최신
        setSelectedDates([processed[processed.length - 1]]);
      } else {
        setSelectedDates([]);
      }
    } catch (err) {
      logger.error('검색 오류:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 선택 핸들러
  const handleSelectDate = (id) => {
    // 선택한 날짜 데이터 찾기
    const selectedDate = processedData.find(item => item.id === id);
    if (!selectedDate) return;
    
    // 이미 선택된 날짜인지 확인
    const existingIndex = selectedDates.findIndex(date => date.id === id);
    
    if (existingIndex !== -1) {
      // 이미 선택된 경우: 목록에서 제거 (토글)
      setSelectedDates(prev => prev.filter(date => date.id !== id));
    } else {
      // 선택되지 않은 경우
      if (selectedDates.length >= 2) {
        // 이미 2개 선택된 경우: 고정된 날짜가 있으면 그것을 남기고 다른 하나 교체
        const fixedDate = selectedDates.find(date => date.fixed);
        
        if (fixedDate) {
          setSelectedDates([fixedDate, selectedDate]);
        } else {
          // 고정된 날짜가 없으면 마지막 선택된 날짜 제거하고 새 날짜 추가
          setSelectedDates(prev => [prev[0], selectedDate]);
        }
      } else {
        // 2개 미만 선택된 경우: 새 날짜 추가
        setSelectedDates(prev => [...prev, selectedDate]);
      }
    }
  };

  // 날짜 고정 핸들러 (더블 클릭)
  const handleFixDate = (id) => {
    setSelectedDates(prev => {
      return prev.map(date => {
        if (date.id === id) {
          return { ...date, fixed: !date.fixed };
        }
        return date;
      });
    });
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const scrollPosition = window.scrollY;
    const headerHeight = 300; // 헤더와 그래프 영역 높이
    
    // 스크롤 위치에 따라 그래프 최소화 상태 결정 (날짜 선택기는 고정)
    setMinimized(scrollPosition > headerHeight);
  };

  // 스크롤 이벤트 리스너 등록/해제
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 선택된 데이터 항목 찾기
  const getSelectedItems = () => {
    return selectedDates.map(selectedDate => {
      return characterData.find(item => item.id === selectedDate.id) || null;
    }).filter(Boolean);
  };

  // 선택된 항목 목록
  const selectedItems = getSelectedItems();

  return (
    <div className="spec-log-container" ref={containerRef}>
      <h2>스펙 로그</h2>
      
      <OptionsNavigator 
        options={options} 
        onOptionChange={handleOptionChange} 
      />
      
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="캐릭터 이름을 입력하세요"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading}
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {hasSearched && !isLoading && processedData.length === 0 && !error && (
        <div className="no-results-message">
          <p>'{searchTerm}' 캐릭터에 대한 검색 결과가 없습니다.</p>
          <p>ZLoa History Tracker 확장 프로그램을 통해 먼저 데이터를 수집해야 합니다.</p>
          <p>아래 사용 방법을 참고하세요.</p>
        </div>
      )}
      
      {processedData.length > 0 && (
        <div className={`results-container ${minimized ? 'minimized' : ''}`}>
          <div className="graph-section">
            <ScoreGraph 
              data={processedData}
              onSelectDate={handleSelectDate}
              selectedDates={selectedDates}
              minimized={minimized}
            />
          </div>
          
          {/* 그래프 아래에 네비게이터 배치 */}
          <DateSelector 
            data={processedData}
            onSelectDate={handleSelectDate}
            onFixDate={handleFixDate}
            selectedDates={selectedDates}
            minimized={minimized}
          />
          
          {/* 네비게이터가 상단에 고정될 때 공간 확보 */}
          <div className="nav-space"></div>
          
          <div className="date-selector-section">
            {/* DateSelector의 스티키 컨테이너만 여기에 유지 */}
          </div>
          
          <div className="data-details-section">
            {selectedItems.length === 0 ? (
              <div className="no-selection-message">
                데이터를 선택하세요. 그래프나 날짜 목록에서 항목을 클릭하여 세부 정보를 볼 수 있습니다.
              </div>
            ) : (
              <div className="selected-data-container">
                {selectedItems.length > 0 && (
                  <div className="selected-data-item">
                    <DataDetail 
                      data={selectedItems[0]}
                      comparison={selectedItems.length > 1 ? selectedItems[1] : null}
                      options={options}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

<div className="usage-guide-section">
        <h3 style={{textAlign: 'left'}}>사용 방법 안내</h3>
        <div className="usage-guide-content">
          <p>
            스펙로그는 <strong>ZLoa History Tracker</strong> 크롬 확장프로그램에서 수집한 데이터를 보여주는 서비스입니다.
          </p>
          
          <div className="download-section">
            <h4 style={{textAlign: 'left'}}>확장 프로그램 설치하기</h4>
            <div className="download-steps">
              <h5>1. 파일 다운로드</h5>
              <ul>
                <li><a href="https://github.com/Heinul/ZLoaHistoryCollect/releases/download/ZloaSpecLog/ZloaHistoryCollect.zip" target="_blank" rel="noopener noreferrer">다운로드 링크</a>에서 최신 버전의 확장 프로그램 압축 파일을 다운로드합니다.</li>
                <li>다운로드한 파일의 압축을 해제합니다.</li>
              </ul>
              
              <h5>2. Chrome에 확장 프로그램 로드</h5>
              <ul>
                <li>Chrome 브라우저를 엽니다.</li>
                <li>주소창에 <code>chrome://extensions/</code>를 입력합니다.</li>
                <li>우측 상단의 "개발자 모드"를 활성화합니다.</li>
                <li>"압축해제된 확장 프로그램 로드" 버튼을 클릭합니다.</li>
                <li>다운로드하고 압축 해제한 폴더를 선택합니다.</li>
              </ul>
            </div>
          </div>
          
          <div className="download-section">
            <h4 style={{textAlign: 'left'}}>데이터 수집 방법</h4>
            <div className="download-steps">
              <ul>
                <li>확장 프로그램을 설치한 후 <a href="https://zloa.net/" target="_blank" rel="noopener noreferrer">ZLOA 사이트</a>에 접속합니다.</li>
                <li>원하는 캐릭터의 닉네임을 검색합니다.</li>
                <li>검색 하단에 나타나는 '캐릭터 정보 저장' 버튼을 클릭합니다.</li>
                <li>데이터가 저장되면 스펙로그에서 해당 캐릭터 정보를 확인할 수 있습니다.</li>
              </ul>
            </div>
          </div>
          
          <p>
            더 자세한 정보는 <a href="https://github.com/Heinul/ZLoaHistoryCollect" target="_blank" rel="noopener noreferrer">프로젝트 GitHub 페이지</a>에서 확인하실 수 있습니다.
          </p>
        </div>
      </div>
      

      <div className="button-container">
        <Link to="/" className="btn">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default SpecLog;