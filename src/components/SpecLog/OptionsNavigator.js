import React, { useState, useEffect, useRef } from 'react';

/**
 * 스펙로그 설정 네비게이터 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.options - 현재 옵션 상태
 * @param {Function} props.onOptionChange - 옵션 변경 시 호출할 함수
 * @returns {JSX.Element} - 옵션 네비게이터 컴포넌트
 */
const OptionsNavigator = ({ options = {}, onOptionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // 기본 설정
  const defaultOptions = {
    equipment: {
      showImages: true,
      showGrade: true,
      showQuality: true,
      showRefine: true,
      showHigherRefine: true,
      showTranscendence: true,
      showElixir: true
    },
    accessory: {
      showImages: true,
      showGrade: true,
      showQuality: true
    },
    abilityStone: {
      show: true
    }
  };
  
  // 맞추기, 전달받은 옵션에 누락된 값이 있을 수 있음
  const mergedOptions = {
    equipment: { ...defaultOptions.equipment, ...(options.equipment || {}) },
    accessory: { ...defaultOptions.accessory, ...(options.accessory || {}) },
    abilityStone: { ...defaultOptions.abilityStone, ...(options.abilityStone || {}) }
  };

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 옵션 변경 핸들러
  const handleOptionChange = (category, option, value) => {
    onOptionChange(category, option, value);
  };

  return (
    <div className="options-navigator" ref={menuRef}>
      <button 
        className={`options-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
          <path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
        </svg>
        <span>설정</span>
      </button>

      {isOpen && (
        <div className="options-menu">
          <div className="options-category">
            <h3 className="options-category-title">장비</h3>
            <div className="options-list">
              <div className="option-item">
                <label>이미지 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.equipment.showImages ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showImages', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.equipment.showImages ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showImages', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
              <div className="option-item">
                <label>등급 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.equipment.showGrade ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showGrade', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.equipment.showGrade ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showGrade', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
              <div className="option-item">
                <label>품질 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.equipment.showQuality ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showQuality', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.equipment.showQuality ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showQuality', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
              <div className="option-item">
                <label>재련 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.equipment.showRefine ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showRefine', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.equipment.showRefine ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showRefine', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
              <div className="option-item">
                <label>상급 재련 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.equipment.showHigherRefine ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showHigherRefine', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.equipment.showHigherRefine ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showHigherRefine', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
              <div className="option-item">
                <label>초월 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.equipment.showTranscendence ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showTranscendence', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.equipment.showTranscendence ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showTranscendence', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
              <div className="option-item">
                <label>엘릭서 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.equipment.showElixir ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showElixir', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.equipment.showElixir ? 'active' : ''}`}
                    onClick={() => handleOptionChange('equipment', 'showElixir', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="options-category">
            <h3 className="options-category-title">악세사리</h3>
            <div className="options-list">
              <div className="option-item">
                <label>이미지 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.accessory.showImages ? 'active' : ''}`}
                    onClick={() => handleOptionChange('accessory', 'showImages', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.accessory.showImages ? 'active' : ''}`}
                    onClick={() => handleOptionChange('accessory', 'showImages', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
              <div className="option-item">
                <label>등급 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.accessory.showGrade ? 'active' : ''}`}
                    onClick={() => handleOptionChange('accessory', 'showGrade', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.accessory.showGrade ? 'active' : ''}`}
                    onClick={() => handleOptionChange('accessory', 'showGrade', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
              <div className="option-item">
                <label>품질 표기</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.accessory.showQuality ? 'active' : ''}`}
                    onClick={() => handleOptionChange('accessory', 'showQuality', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.accessory.showQuality ? 'active' : ''}`}
                    onClick={() => handleOptionChange('accessory', 'showQuality', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="options-category">
            <h3 className="options-category-title">어빌리티 스톤</h3>
            <div className="options-list">
              <div className="option-item">
                <label>표시 여부</label>
                <div className="option-toggle">
                  <button 
                    className={`toggle-btn ${mergedOptions.abilityStone.show ? 'active' : ''}`}
                    onClick={() => handleOptionChange('abilityStone', 'show', true)}
                  >
                    표기
                  </button>
                  <button 
                    className={`toggle-btn ${!mergedOptions.abilityStone.show ? 'active' : ''}`}
                    onClick={() => handleOptionChange('abilityStone', 'show', false)}
                  >
                    숨기기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsNavigator;