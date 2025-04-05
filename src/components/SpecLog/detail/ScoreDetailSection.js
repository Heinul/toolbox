import React from 'react';

const ScoreDetailSection = ({ newData, oldData, hasComparison }) => {
  return (
    <div className="data-details">
      <h4>환산 점수 상세</h4>
      <div className="details-grid">
        {newData.receipt && Object.entries(newData.receipt).map(([key, value]) => (
          <div key={key} className="detail-item">
            <div className="item-label">{key}</div>
            <div className="item-value">
              {hasComparison && oldData.receipt && oldData.receipt[key] !== undefined ? (
                <>
                  {typeof oldData.receipt[key] === 'number' ? oldData.receipt[key].toFixed(2) : oldData.receipt[key]}%
                  {' → '}
                  {typeof value === 'number' ? value.toFixed(2) : value}%
                  {(value !== oldData.receipt[key]) && (
                    <span className={`change-value ${value > oldData.receipt[key] ? 'positive' : 'negative'}`}>
                      ({value > oldData.receipt[key] ? '+' : ''}{(value - oldData.receipt[key]).toFixed(2)}%)
                    </span>
                  )}
                </>
              ) : (
                <>{typeof value === 'number' ? value.toFixed(2) : value}%</>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreDetailSection;