import React from 'react';

const SummarySection = ({ newData, oldData, hasComparison }) => {
  return (
    <div className="data-summary">
      <div className="summary-item">
        <div className="item-label">아이템 레벨</div>
        <div className="item-value">
          {hasComparison ? (
            <>
              {oldData.temlv} → {newData.temlv}
              {(newData.temlv !== oldData.temlv) && (
                <span className={`change-value ${newData.temlv > oldData.temlv ? 'positive' : 'negative'}`}>
                  ({newData.temlv > oldData.temlv ? '+' : ''}{(newData.temlv - oldData.temlv).toFixed(1)})
                </span>
              )}
            </>
          ) : (
            newData.temlv
          )}
        </div>
      </div>
      
      <div className="summary-item">
        <div className="item-label">환산 점수</div>
        <div className="item-value">
          {hasComparison ? (
            <>
              {oldData.converted_zp.toFixed(2)} → {newData.converted_zp.toFixed(2)}
              {(newData.converted_zp !== oldData.converted_zp) && (
                <span className={`change-value ${newData.converted_zp > oldData.converted_zp ? 'positive' : 'negative'}`}>
                  ({newData.converted_zp > oldData.converted_zp ? '+' : ''}{(newData.converted_zp - oldData.converted_zp).toFixed(2)})
                </span>
              )}
            </>
          ) : (
            newData.converted_zp.toFixed(2)
          )}
        </div>
      </div>
      
      {newData.rank_total && (
        <div className="summary-item">
          <div className="item-label">전체 랭킹</div>
          <div className="item-value">{newData.rank_total}</div>
        </div>
      )}
      
      {newData.rank_class && (
        <div className="summary-item">
          <div className="item-label">클래스 랭킹</div>
          <div className="item-value">{newData.rank_class}</div>
        </div>
      )}
    </div>
  );
};

export default SummarySection;