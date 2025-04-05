import React from 'react';

const EngravingsSection = ({ newData, oldData, hasComparison }) => {
  if (!newData.display || !newData.display.engr) {
    return null;
  }

  return (
    <div className="data-engravings">
      <h4>각인 정보</h4>
      <div className="engravings-list">
        {/* 각인 정보 처리 로직 */}
        {newData.display.engr.map((engr, index) => {
          const oldEngr = hasComparison && oldData.display && oldData.display.engr && 
                oldData.display.engr.find(e => e[0] === engr[0]);
          
          const hasChanged = oldEngr && (
            JSON.stringify(oldEngr[1]) !== JSON.stringify(engr[1])
          );
          
          const totalNew = engr[1][0] + engr[1][1];
          const totalOld = oldEngr ? oldEngr[1][0] + oldEngr[1][1] : 0;
          
          return (
            <div key={index} className={`engraving-item ${hasChanged ? 'item-changed' : ''}`}>
              <div className="engraving-name">{engr[0]}</div>
              <div className="engraving-level">
                <div>등급: {engr[1][0]}</div>
                <div>레벨: {engr[1][1]}</div>
                
                {hasChanged && (
                  <div className={`change-value ${totalNew > totalOld ? 'positive' : 'negative'}`}>
                    (변경됨: 
                    {oldEngr[1][0] > 0 ? ` 등급 ${oldEngr[1][0]}` : ''}
                    {oldEngr[1][1] > 0 ? ` 레벨 ${oldEngr[1][1]}` : ''} →)
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 삭제된 각인 표시 */}
        {hasComparison && oldData.display && oldData.display.engr &&
          oldData.display.engr.filter(oldEngr => 
            !newData.display.engr.some(engr => engr[0] === oldEngr[0])
          ).map((removedEngr, index) => (
            <div key={`removed-${index}`} className="engraving-item removed-item">
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