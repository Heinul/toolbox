import React from 'react';

const CardsSection = ({ newData, oldData, hasComparison }) => {
  if (!newData.display || !newData.display.card) {
    return null;
  }

  return (
    <div className="data-cards">
      <h4>카드 정보</h4>
      <div className="cards-list">
        {Object.entries(newData.display.card).map(([cardName, level], index) => (
          <div key={index} className="card-item">
            <div className="card-name">{cardName}</div>
            <div className="card-level">{level}각</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsSection;