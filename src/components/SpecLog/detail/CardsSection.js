import React from 'react';

const CardsSection = ({ newData, oldData, hasComparison }) => {
  if (!newData.display || !newData.display.card) {
    return null;
  }

  return (
    <div className="data-cards">
      <h4>카드 정보</h4>
      <div className="cards-list">
        {Object.entries(newData.display.card).map(([cardName, awakeningCount], index) => {
          // 현재 코드에서 변경 감지 로직 제거
          return (
            <div key={index} className="card-item">
              <div className="card-content">
                <div className="card-name">{cardName}</div>
                <div className="card-level">{awakeningCount}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardsSection;