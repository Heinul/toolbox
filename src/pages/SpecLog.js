import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SpecLog.css';

function SpecLog() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 기능 구현은 향후 추가
    console.log('검색어:', searchTerm);
  };

  return (
    <div className="spec-log-container">
      <h2>스팩로그</h2>
      
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="검색어를 입력하세요"
          />
          <button type="submit" className="search-button">검색</button>
        </form>
      </div>

      <div className="button-container">
        <Link to="/" className="btn">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default SpecLog;