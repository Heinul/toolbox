import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import qualityData from '../data/qualityData';
import { logUserAction } from '../firebase/config';
import '../styles/QualityReader.css';

function QualityReader() {
  // 상태 관리
  const [inputValue, setInputValue] = useState('');
  const [honing, setHoning] = useState(0); // 연마 단계 (0-3)
  const [results, setResults] = useState({
    목걸이: null,
    귀걸이: null,
    반지: null
  });

  // 품질 계산 함수
  const calculateQuality = (value, type, level = null) => {
    if (!value) return null;
    
    const numValue = parseInt(value);
    const honingLevel = level !== null ? level : honing;
    const data = qualityData[type][honingLevel];
    const min = data.최소;
    const max = data.최대;
    
    // 입력값이 범위를 벗어나면 유효하지 않음
    if (numValue < min || numValue > max) {
      return null;
    }
    
    // 품질 계산: (입력값 - 최소값) / (최대값 - 최소값) * 100
    const quality = ((numValue - min) / (max - min)) * 100;
    return Math.round(quality);
  };

  // 입력값이 변경될 때마다 품질 계산
  useEffect(() => {
    if (inputValue) {
      const numValue = parseInt(inputValue);
      if (!isNaN(numValue)) {
        setResults({
          목걸이: calculateQuality(numValue, '목걸이'),
          귀걸이: calculateQuality(numValue, '귀걸이'),
          반지: calculateQuality(numValue, '반지')
        });
      }
    } else {
      setResults({
        목걸이: null,
        귀걸이: null,
        반지: null
      });
    }
  }, [inputValue, honing]);

  // 연마 단계 변경 함수
  const handleHoningChange = (level) => {
    setHoning(level);
    // 연마 단계 변경 이벤트 로깅
    // logUserAction('change_honing_level', { level });
  };

  // 품질 값에 따른 색상 반환
  const getQualityColor = (quality) => {
    if (quality === null) return 'quality-none';
    if (quality >= 90) return 'quality-high';
    if (quality >= 70) return 'quality-medium';
    return 'quality-low';
  };

  // 품질 값에 따른 텍스트 표시
  const getQualityText = (quality) => {
    if (quality === null) return '입력값 범위 초과';
    return `${quality}%`;
  };

  return (
    <div className="quality-reader-container">
      <h2>품질 판독기</h2>
      
      {/* 연마 단계 선택과 품질 결과 패널을 포함하는 컨테이너 */}
      <div className="controls-container">
        <div className="honing-controls">
          <h3>연마단계</h3>
          <div className="honing-buttons">
            {[0, 1, 2, 3].map((level) => (
              <button 
                key={level}
                className={`honing-button ${honing === level ? 'active' : ''}`}
                onClick={() => handleHoningChange(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        {/* 품질 결과 패널 */}
        <div className="quality-results">
          <div className="quality-panel">
            <h3>목걸이</h3>
            <div className={`quality-value ${getQualityColor(results.목걸이)}`}>
              {getQualityText(results.목걸이)}
            </div>
          </div>
          
          <div className="quality-panel">
            <h3>귀걸이</h3>
            <div className={`quality-value ${getQualityColor(results.귀걸이)}`}>
              {getQualityText(results.귀걸이)}
            </div>
          </div>
          
          <div className="quality-panel">
            <h3>반지</h3>
            <div className={`quality-value ${getQualityColor(results.반지)}`}>
              {getQualityText(results.반지)}
            </div>
          </div>
        </div>
      </div>
      
      {/* 입력창 */}
      <div className="input-section">
        <label htmlFor="quality-input">입력값:</label>
        <input 
          type="number"
          id="quality-input"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            
            // 입력값이 있을 때만 로깅 (너무 많은 이벤트 방지)
            // if (e.target.value && e.target.value.length > 2) {
            //   logUserAction('quality_value_input', { value: e.target.value });
            // }
          }}
          onBlur={() => {
            // 입력 완료 시 로깅
            // if (inputValue) {
            //   logUserAction('quality_calculation', { 
            //     value: inputValue,
            //     honingLevel: honing,
            //     results: {
            //       necklace: calculateQuality(inputValue, '목걸이'),
            //       earring: calculateQuality(inputValue, '귀걸이'),
            //       ring: calculateQuality(inputValue, '반지')
            //     }
            //   });
            // }
          }}
          placeholder="품질값을 입력하세요"
          className="quality-input"
        />
      </div>
      
      {/* 데이터 테이블 */}
      <div className="data-table-container">
        <h3>품질 판독 테이블</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>부위</th>
              <th>연마단계</th>
              <th>품질판독</th>
              <th>최소</th>
              <th>최대</th>
            </tr>
          </thead>
          <tbody>
            {['반지', '귀걸이', '목걸이'].map((type) => (
              [0, 1, 2, 3].map((level) => (
                <tr key={`${type}-${level}`}>
                  {level === 0 ? <td rowSpan="4">{type}</td> : null}
                  <td>{level}</td>
                  <td>
                    {inputValue && calculateQuality(inputValue, type, level) !== null 
                      ? `${calculateQuality(inputValue, type, level)}%` 
                      : '-'}
                  </td>
                  <td>{qualityData[type][level].최소}</td>
                  <td>{qualityData[type][level].최대}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="button-container">
        <Link to="/" className="btn">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default QualityReader;
