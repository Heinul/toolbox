import React from 'react';

const EngravingsSection = ({ newData, oldData, hasComparison }) => {
  if (!newData.display || !newData.display.engr) {
    return null;
  }

  return (
    <div className="data-engravings">
      <h4>각인 정보</h4>
      <div className="engravings-list">
        {/* 현재 있는 각인 표시 */}
        {newData.display.engr.map((engr, index) => {
          // 비교를 위한 로직 추가
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
                {engr[1][0] > 0 && `각인 ${engr[1][0]}`}
                {engr[1][1] > 0 && ` Lv.${engr[1][1]}`}
                
                {hasChanged && (
                  <span className={`change-value ${totalNew > totalOld ? 'positive' : 'negative'}`}>
                    ({oldEngr[1][0] > 0 ? `각인 ${oldEngr[1][0]}` : ''}
                    {oldEngr[1][1] > 0 ? ` Lv.${oldEngr[1][1]}` : ''} →)
                  </span>
                )}
              </div>
              
              {/* 이전 각인 정보 툴팁 */}
              {hasChanged && (
                <div className="item-tooltip">
                  <div className="tooltip-title">이전 각인 정보</div>
                  <div className="tooltip-content">
                    <div><strong>각인:</strong> {engr[0]}</div>
                    <div><strong>레벨:</strong> {oldEngr[1][0] > 0 ? `각인 ${oldEngr[1][0]}` : ''} {oldEngr[1][1] > 0 ? `Lv.${oldEngr[1][1]}` : ''}</div>
                    <div><strong>총 레벨:</strong> {totalOld}</div>
                  </div>
                </div>
              )}
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
                <span className="change-value negative">
                  (삭제됨 - 
                  {removedEngr[1][0] > 0 ? `각인 ${removedEngr[1][0]}` : ''}
                  {removedEngr[1][1] > 0 ? ` Lv.${removedEngr[1][1]}` : ''})
                </span>
              </div>
              
              {/* 삭제된 각인 정보 툴팁 */}
              <div className="item-tooltip">
                <div className="tooltip-title">삭제된 각인 정보</div>
                <div className="tooltip-content">
                  <div><strong>각인:</strong> {removedEngr[0]}</div>
                  <div><strong>레벨:</strong> {removedEngr[1][0] > 0 ? `각인 ${removedEngr[1][0]}` : ''} {removedEngr[1][1] > 0 ? `Lv.${removedEngr[1][1]}` : ''}</div>
                  <div><strong>총 레벨:</strong> {removedEngr[1][0] + removedEngr[1][1]}</div>
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