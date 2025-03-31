import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Calculator() {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);
  
  // 간단한 계산 예시 (제곱 계산)
  const calculateSquare = () => {
    if (number === '') return;
    
    const num = parseFloat(number);
    if (!isNaN(num)) {
      setResult({
        original: num,
        square: num * num
      });
    }
  };
  
  return (
    <div>
      <h2>간단한 계산기</h2>
      <p>숫자를 입력하고 계산 버튼을 누르면 계산된 결과가 표시됩니다.</p>
      
      <div className="calculator-container">
        <div className="form-group">
          <label htmlFor="number-input">숫자 입력:</label>
          <input 
            type="number" 
            id="number-input"
            className="form-control"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="숫자를 입력하세요"
          />
        </div>
        
        <button className="btn" onClick={calculateSquare}>
          계산하기
        </button>
        
        {result && (
          <div className="result-box">
            <h3>계산 결과:</h3>
            <p>입력값: {result.original}</p>
            <p>결과값(제곱): {result.square}</p>
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="btn">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
