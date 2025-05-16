import React from 'react';

const EngravingsSection = ({ newData, oldData, hasComparison }) => {
  if (!newData.display || !newData.display.engr) {
    return null;
  }

  return (
    <div className="data-engravings">
      <h4>각인 정보</h4>
      <div className="engravings-list">
        {/* 현재 각인 렌더링 */}
        {newData.display.engr.map((engr, index) => {
          const oldEngr = hasComparison && oldData.display && oldData.display.engr && 
                oldData.display.engr.find(e => e[0] === engr[0]);
          
          const hasChanged = oldEngr && (
            JSON.stringify(oldEngr[1]) !== JSON.stringify(engr[1])
          );
          
          const totalNew = engr[1][0] + engr[1][1];
          const totalOld = oldEngr ? oldEngr[1][0] + oldEngr[1][1] : 0;
          
          const isNewEngraving = hasComparison && !oldEngr;
          
          return (
            <div 
              key={index} 
              className={`engraving-item ${isNewEngraving ? 'new-engraving' : ''} ${hasChanged ? 'item-changed' : ''}`}
            >
              <div className="engraving-name">
                {engr[0]}
                {isNewEngraving && <span className="new-tag">NEW</span>}
              </div>
              <div className="engraving-level">
                <div>등급: {engr[1][0]}</div>
                <div>레벨: {engr[1][1]}</div>
                
                {hasChanged && (
                  <div className={`change-value ${totalNew > totalOld ? 'positive' : 'negative'}`}>
                    (등급 {oldEngr[1][0]} → {engr[1][0]}, 레벨 {oldEngr[1][1]} → {engr[1][1]})
                  </div>
                )}
              </div>
              
              {/* 변경된 경우 툴팁 추가 */}
              {hasChanged && (
                <div className="item-tooltip">
                  <div className="tooltip-title">이전 각인 정보</div>
                  <div className="tooltip-content">
                    <div><strong>이름:</strong> {oldEngr[0]}</div>
                    <div><strong>등급:</strong> {oldEngr[1][0]} <span className="arrow">→</span> {engr[1][0]}</div>
                    <div><strong>레벨:</strong> {oldEngr[1][1]} <span className="arrow">→</span> {engr[1][1]}</div>
                    <div className={`tooltip-change-summary ${totalNew > totalOld ? 'positive' : 'negative'}`}>
                      <strong>변경사항:</strong> {totalNew > totalOld ? '상승' : '하락'} ({totalOld} → {totalNew})
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* 삭제된 각인 렌더링 */}
        {hasComparison && oldData.display && oldData.display.engr &&
          oldData.display.engr
            .filter(oldEngr => 
              !newData.display.engr.some(engr => engr[0] === oldEngr[0])
            )
            .map((removedEngr, index) => (
              <div 
                key={`removed-${index}`} 
                className="engraving-item removed-engraving"
              >
                <div className="engraving-name">{removedEngr[0]}</div>
                <div className="engraving-level">
                  <div>삭제됨</div>
                  <div>
                    {removedEngr[1][0] > 0 ? `등급 ${removedEngr[1][0]}` : ''}
                    {removedEngr[1][1] > 0 ? ` 레벨 ${removedEngr[1][1]}` : ''}
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default EngravingsSection;